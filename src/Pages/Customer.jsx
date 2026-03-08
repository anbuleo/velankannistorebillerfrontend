import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import CustomerTable from '../components/CustomerTable'
import { Link } from 'react-router-dom'
import AxiosService from '../common/Axioservice'
import { toast } from 'react-toastify'
import GetAllProductHook from '../Hooks/GetAllProductHook'
import { MdPersonAdd, MdSearch, MdPeople, MdAccountBalanceWallet, MdSync } from 'react-icons/md'

function Customer() {
  const { customer } = useSelector((state) => state.customer)
  const [searchTerm, setSearchTerm] = useState('')
  const [syncing, setSyncing] = useState(false)
  const { getUSer } = GetAllProductHook()

  const userData = JSON.parse(localStorage.getItem('data'))
  const isAdmin = userData?.role === 'admin'

  const handleSync = async () => {
    setSyncing(true)
    try {
      const res = await AxiosService.post('/saleprint/recalculate')
      if (res.status === 200) {
        toast.success('Financial records reconciled successfully')
        await getUSer() // Refresh data
      }
    } catch (error) {
      toast.error('Ledger reconciliation failed')
    } finally {
      setSyncing(false)
    }
  }

  const filteredCustomers = (customer || []).filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.mobile.includes(searchTerm)
  )

  const totalOutstanding = (customer || []).reduce((acc, cur) => acc + Number(cur.balance || 0), 0)

  return (
    <div className="container mx-auto px-4 py-8 fade-in min-h-screen">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-surface-900 tracking-tight leading-none mb-2">Customer Intelligence</h1>
          <p className="text-surface-500 font-medium">Global directory of verified credit profiles and loyalty contacts.</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="glass-card px-6 py-4 border-l-4 border-primary flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-xl">
              <MdPeople />
            </div>
            <div>
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest leading-none mb-1">Total Profiles</p>
              <p className="text-xl font-display font-bold text-surface-900">{customer?.length || 0}</p>
            </div>
          </div>
          {isAdmin && (
            <div className="glass-card px-6 py-4 border-l-4 border-error flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center text-xl">
                <MdAccountBalanceWallet />
              </div>
              <div>
                <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest leading-none mb-1">Ledger Liability</p>
                <p className="text-xl font-display font-bold text-error">₹{totalOutstanding.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          )}
          {isAdmin && (
            <button
              onClick={handleSync}
              disabled={syncing}
              className={`h-[68px] px-6 rounded-2xl flex items-center gap-3 font-bold uppercase text-[10px] tracking-widest transition-all ${syncing ? 'bg-surface-200 text-surface-400' : 'bg-primary/5 text-primary border-2 border-primary/10 hover:bg-primary hover:text-white'
                }`}
            >
              <MdSync className={`text-xl ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Reconciling Ledger...' : 'Sync & Repair Ledger'}
            </button>
          )}
          <Link to="/createcustomer" className="premium-button flex items-center gap-2 h-[68px] px-8">
            <MdPersonAdd className="text-2xl" /> Register Profile
          </Link>
        </div>
      </div>

      <div className="glass-card p-6 mb-8">
        <div className="relative max-w-xl">
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-xl" />
          <input
            type="text"
            placeholder="Search by Identity Name or Mobile Contact..."
            className="premium-input w-full h-14 pl-12 bg-surface-50 focus:bg-white text-lg font-medium border-2 focus:border-primary/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-6">
        <CustomerTable filteredData={filteredCustomers} />
      </div>
    </div>
  )
}

export default Customer