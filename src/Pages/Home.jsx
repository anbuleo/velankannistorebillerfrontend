import React, { useContext, useEffect, useState, useMemo } from 'react'
import { UserDataContext } from '../Context/UserDataContext'
import Pending from './Pending'
import { useSelector } from 'react-redux'
import { MdHistory, MdCurrencyRupee, MdPeople, MdTrendingUp, MdInfoOutline, MdAccountBalanceWallet, MdWarning } from 'react-icons/md'
import AxiosService from '../common/Axioservice'
import { Link } from 'react-router-dom'
import PinGate from '../components/PinGate'

function Home() {
  const { data } = useContext(UserDataContext)
  const { product } = useSelector((state) => state.product)
  const { bills = [] } = useSelector((state) => state.sale || { bills: [] })
  const { customer } = useSelector((state) => state.customer)
  const [allExpenses, setAllExpenses] = useState([])
  const [totalExpenses, setTotalExpenses] = useState(0)

  const isAdmin = data?.role === 'admin'

  useEffect(() => {
    if (!isAdmin) return
    const fetchData = async () => {
      try {
        const res = await AxiosService.get('/expense/all')
        setAllExpenses(res.data.expenses || [])

        const sumRes = await AxiosService.get('/expense/summary')
        setTotalExpenses(sumRes.data.totalExpenses || 0)
      } catch (error) {
        console.error("Home: Data fetch failed")
      }
    }
    fetchData()
  }, [isAdmin])

  const today = new Date().toISOString().split('T')[0]

  const totalRevenue = useMemo(() => {
    return bills.reduce((acc, cur) => acc + Number(cur.totalAmount || cur.totalBillAmount || 0), 0)
  }, [bills])

  const todayRevenue = useMemo(() => {
    return bills.filter(b => b.createdAt && b.createdAt.split('T')[0] === today)
      .reduce((acc, cur) => acc + Number(cur.totalAmount || cur.totalBillAmount || 0), 0)
  }, [bills, today])

  const todayExpense = useMemo(() => {
    return allExpenses.filter(e => e.expenseDate && e.expenseDate.split('T')[0] === today)
      .reduce((acc, cur) => acc + Number(cur.expenseAmount || 0), 0)
  }, [allExpenses, today])

  const lowStockCount = useMemo(() => {
    return product.filter(p => Number(p.stockQuantity) < 5).length
  }, [product])

  const netProfit = totalRevenue - totalExpenses
  const todayProfit = todayRevenue - todayExpense

  const stats = useMemo(() => {
    const baseStats = [
      { title: 'Inventory Size', value: product.length, icon: MdHistory, color: 'text-primary bg-primary/10' },
      { title: 'Registered Clients', value: customer.length, icon: MdPeople, color: 'text-indigo-600 bg-indigo-50' },
    ]

    if (isAdmin) {
      baseStats.splice(1, 0, { title: "Today's Profit", value: `₹${todayProfit.toLocaleString()}`, icon: MdTrendingUp, color: 'text-success bg-success/10' })
      baseStats.push({ title: 'Total Net Profit', value: `₹${netProfit.toLocaleString()}`, icon: MdAccountBalanceWallet, color: 'text-purple-600 bg-purple-50' })
    }

    return baseStats
  }, [product.length, customer.length, todayProfit, netProfit, isAdmin])

  return (
    <div className="container mx-auto px-4 py-12 fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-10 h-1 text-primary bg-primary rounded-full"></span>
            <span className="text-[10px] uppercase font-bold text-surface-400 tracking-[0.2em]">Operational Dashboard</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-surface-900 tracking-tight">
            Welcome, <span className="text-secondary">{data?.userName || 'Velankanni Store'}</span>
          </h1>
          <p className="text-surface-500 font-medium text-lg max-w-xl">
            Real-time insights and financial reconciliation for your premium retail management system.
          </p>
        </div>
        <div className="hidden lg:block">
          {lowStockCount > 0 ? (
            <Link to="/lowstock" className="glass-card p-4 border-none bg-error/5 flex items-center gap-4 hover:bg-error/10 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-white text-error flex items-center justify-center text-2xl shadow-sm border border-error/10 animate-pulse">
                <MdWarning />
              </div>
              <div>
                <p className="text-xs font-bold text-error uppercase tracking-widest leading-none mb-1">Stock Warning</p>
                <p className="font-bold text-surface-900 leading-none">{lowStockCount} Items Critical</p>
              </div>
            </Link>
          ) : (
            <div className="glass-card p-4 border-none bg-primary/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white text-primary flex items-center justify-center text-2xl shadow-sm">
                <MdInfoOutline />
              </div>
              <div>
                <p className="text-xs font-bold text-primary-600 uppercase tracking-widest leading-none mb-1">System Health</p>
                <p className="font-bold text-surface-900 leading-none">All Systems Optimal</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => {
          const isProfitStat = stat.title.toLowerCase().includes('profit')
          const card = (
            <div key={i} className="glass-card p-6 group hover:-translate-y-2 transition-all duration-500 shadow-premium">
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center text-3xl transition-transform group-hover:scale-110 duration-500`}>
                  <stat.icon />
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-surface-400 uppercase tracking-widest leading-none mb-2">{stat.title}</p>
                  <p className="text-2xl font-display font-bold text-surface-900 leading-none tracking-tight">{stat.value}</p>
                </div>
              </div>
              <div className="h-1 w-full bg-surface-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-2/3 group-hover:w-full transition-all duration-1000"></div>
              </div>
            </div>
          )
          if (isProfitStat) {
            return (
              <PinGate key={i} label={stat.title}>
                {card}
              </PinGate>
            )
          }
          return card
        })}
      </div>

      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            <PinGate label="Performance Overview">
              <div className="glass-card p-8 min-h-[400px]">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-display font-bold text-surface-900">Performance Overview</h3>
                  <div className="flex gap-2">
                    <button className="px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-primary text-white shadow-lg shadow-primary/20">Revenue</button>
                  </div>
                </div>
                <div className="h-[250px] flex items-end justify-between gap-4 px-2">
                  {bills.slice(-7).map((bill, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                      <div
                        className={`w-full rounded-2xl bg-surface-100 group-hover:bg-primary transition-all duration-500 cursor-pointer relative`}
                        style={{ height: `${Math.min(100, (Number(bill.totalAmount) / (totalRevenue / 5)) * 100)}%` }}
                      >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-900 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          ₹{Number(bill.totalAmount).toLocaleString()}
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-surface-400 uppercase tracking-tighter">
                        {new Date(bill.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </PinGate>
          </div>

          <div className="space-y-8">
            <div className="glass-card p-0 overflow-hidden bg-primary text-white border-none shadow-2xl shadow-primary/30">
              <div className="p-8 pb-0">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-3xl mb-4">
                  <MdTrendingUp />
                </div>
                <h4 className="text-2xl font-display font-bold mb-2">Profit Target</h4>
                <p className="text-white/70 text-sm font-medium leading-relaxed mb-6">
                  Current Net Profit is calculated by subtracting daily expenses from total gross revenue.
                </p>
              </div>
              <div className="bg-white/10 p-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest">Efficiency: High</span>
                <Link to="/sale" className="btn btn-sm btn-ghost text-white text-[10px] font-bold uppercase tracking-widest border border-white/20 px-4">View Sales</Link>
              </div>
            </div>

            <div className="glass-card p-8">
              <h4 className="text-lg font-display font-bold text-surface-900 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-secondary rounded-full"></span>
                Fast Access
              </h4>
              <div className="grid grid-cols-1 gap-3">
                <Link to="/lowstock" className="w-full py-4 px-6 rounded-2xl bg-surface-50 hover:bg-surface-100 transition-all text-left group">
                  <p className="text-xs font-bold text-surface-900 group-hover:text-primary transition-colors">Critical Stock Audit</p>
                  <p className="text-[10px] text-surface-400 uppercase tracking-widest font-bold">{lowStockCount} Items Below Threshold</p>
                </Link>
                <Link to="/expense" className="w-full py-4 px-6 rounded-2xl bg-surface-50 hover:bg-surface-100 transition-all text-left group">
                  <p className="text-xs font-bold text-surface-900 group-hover:text-primary transition-colors">Expense Management</p>
                  <p className="text-[10px] text-surface-400 uppercase tracking-widest font-bold">Log Daily Overheads</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-12">
        <Pending />
      </div>
    </div>
  )
}

export default Home