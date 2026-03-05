import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import CustomerTable from '../components/CustomerTable'
import { Link } from 'react-router-dom'
import { MdPersonAdd, MdSearch, MdPeople, MdAccountBalanceWallet } from 'react-icons/md'

function Customer() {
  const { customer } = useSelector((state) => state.customer)
  const [searchTerm, setSearchTerm] = useState('')

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
          <div className="glass-card px-6 py-4 border-l-4 border-error flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-error/10 text-error flex items-center justify-center text-xl">
              <MdAccountBalanceWallet />
            </div>
            <div>
              <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest leading-none mb-1">Ledger Liability</p>
              <p className="text-xl font-display font-bold text-error">₹{totalOutstanding}</p>
            </div>
          </div>
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