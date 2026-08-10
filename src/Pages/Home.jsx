import React, { useContext, useEffect, useState, useMemo } from 'react'
import { UserDataContext } from '../Context/UserDataContext'
import Pending from './Pending'
import { useSelector } from 'react-redux'
import {
  MdHistory, MdCurrencyRupee, MdPeople, MdTrendingUp, MdTrendingDown,
  MdInfoOutline, MdAccountBalanceWallet, MdWarning, MdSearch,
  MdPayments, MdReceipt, MdAddShoppingCart, MdPointOfSale,
  MdAssessment, MdSyncAlt, MdQrCode, MdChevronRight, MdCheckCircle
} from 'react-icons/md'
import AxiosService from '../common/Axioservice'
import { Link } from 'react-router-dom'
import PinGate from '../components/PinGate'
import GetAllProductHook from '../Hooks/GetAllProductHook'

/**
 * Executive Operational Command Center (`/home`)
 * Senior Business Intelligence Dashboard with Quick Action Launchpad & Live Sales Feed.
 */
function Home() {
  const { data, isOnline } = useContext(UserDataContext)
  const { product = [] } = useSelector((state) => state.product || { product: [] })
  const { bills = [] } = useSelector((state) => state.sale || { bills: [] })
  const { customer = [] } = useSelector((state) => state.customer || { customer: [] })
  
  const [allExpenses, setAllExpenses] = useState([])
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [searchInput, setSearchInput] = useState('')

  const { getUSer } = GetAllProductHook()
  const isAdmin = data?.role === 'admin'

  // Sync latest data on load
  useEffect(() => {
    getUSer('all')
    if (!isAdmin) return
    const fetchExpenseData = async () => {
      try {
        const res = await AxiosService.get('/expense/all')
        setAllExpenses(res.data?.expenses || [])
        const sumRes = await AxiosService.get('/expense/summary')
        setTotalExpenses(sumRes.data?.totalExpenses || 0)
      } catch (error) {
        console.error("Home: Expense data fetch error", error)
      }
    }
    fetchExpenseData()
  }, [isAdmin, getUSer])

  // Defensive currency formatting
  const fmt = (val) => (Number(val) || 0).toLocaleString('en-IN')

  const today = new Date().toISOString().split('T')[0]

  // Calculations
  const totalRevenue = useMemo(() => {
    return bills.reduce((acc, cur) => acc + Number(cur.totalAmount || cur.totalBillAmount || 0), 0)
  }, [bills])

  const todayRevenue = useMemo(() => {
    return bills
      .filter(b => b.createdAt && b.createdAt.split('T')[0] === today)
      .reduce((acc, cur) => acc + Number(cur.totalAmount || cur.totalBillAmount || 0), 0)
  }, [bills, today])

  const todayExpense = useMemo(() => {
    return allExpenses
      .filter(e => (e.expenseDate || e.createdAt || '').split('T')[0] === today)
      .reduce((acc, cur) => acc + Number(cur.expenseAmount || 0), 0)
  }, [allExpenses, today])

  const inventoryValuation = useMemo(() => {
    return product.reduce((acc, p) => {
      const price = Number(p.productPrice || 0)
      const qty = Number(p.stockQuantity || 0)
      return acc + (price * qty)
    }, 0)
  }, [product])

  const lowStockCount = useMemo(() => {
    return product.filter(p => Number(p.stockQuantity) < 5).length
  }, [product])

  const netProfit = totalRevenue - totalExpenses
  const todayProfit = todayRevenue - todayExpense

  const recentFiveBills = useMemo(() => {
    return Array.isArray(bills) ? bills.slice(0, 5) : []
  }, [bills])

  // Product Search Filtering
  const filteredProducts = useMemo(() => {
    const term = searchInput.toLowerCase().trim()
    if (!term) return []
    return product.filter(p =>
      (p.productName || '').toLowerCase().includes(term) ||
      (p.productCode || '').toLowerCase().includes(term) ||
      (p.tanglishName || '').toLowerCase().includes(term)
    ).slice(0, 8)
  }, [product, searchInput])

  // Stat Cards Configuration
  const mainStats = useMemo(() => {
    const base = [
      {
        title: "Today's Gross Inflow",
        value: `₹${fmt(todayRevenue)}`,
        sub: `${bills.filter(b => b.createdAt && b.createdAt.split('T')[0] === today).length} transactions today`,
        icon: MdTrendingUp,
        color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
      },
      {
        title: 'Inventory Catalog',
        value: `${product.length} SKUs`,
        sub: `Valuation: ₹${fmt(inventoryValuation)}`,
        icon: MdHistory,
        color: 'text-primary bg-primary/10 border-primary/20'
      },
      {
        title: 'Registered Clients',
        value: `${customer.length} Accounts`,
        sub: 'Active buyers directory',
        icon: MdPeople,
        color: 'text-blue-600 bg-blue-50 border-blue-200'
      },
      {
        title: 'Critical Stock Alert',
        value: `${lowStockCount} Items`,
        sub: 'Below minimum threshold',
        icon: MdWarning,
        color: lowStockCount > 0 ? 'text-amber-600 bg-amber-50 border-amber-200 font-bold' : 'text-surface-400 bg-surface-50 border-surface-200'
      }
    ]

    if (isAdmin) {
      base.splice(1, 0, {
        title: "Today's Outflow",
        value: `₹${fmt(todayExpense)}`,
        sub: 'Logged operating overheads',
        icon: MdTrendingDown,
        color: 'text-error bg-error/10 border-error/20'
      })

      base.splice(2, 0, {
        title: "Today's Net Profit",
        value: `₹${fmt(todayProfit)}`,
        sub: 'Revenue minus COGS & expenses',
        icon: MdAccountBalanceWallet,
        color: 'text-purple-600 bg-purple-50 border-purple-200',
        isSensitive: true
      })

      base.push({
        title: 'Cumulative Net Profit',
        value: `₹${fmt(netProfit)}`,
        sub: `Total Turnover: ₹${fmt(totalRevenue)}`,
        icon: MdCurrencyRupee,
        color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
        isSensitive: true
      })
    }

    return base
  }, [todayRevenue, todayExpense, todayProfit, netProfit, totalRevenue, product.length, customer.length, lowStockCount, inventoryValuation, bills, today, isAdmin])

  return (
    <div className="container mx-auto px-4 py-8 fade-in min-h-screen">

      {/* Hero Welcome Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-8 h-1 bg-primary rounded-full"></span>
            <span className="text-[10px] uppercase font-black text-surface-400 tracking-[0.25em]">
              Enterprise Command Center
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-surface-900 tracking-tight leading-none">
            Welcome, <span className="text-primary">{data?.userName || 'Velankanni Store'}</span>
          </h1>
          <p className="text-surface-500 font-medium text-sm md:text-base max-w-xl leading-relaxed">
            Real-time financial reconciliation, retail metrics, and inventory intelligence.
          </p>
        </div>

        {/* Global Instant Search Bar */}
        <div className="w-full max-w-md">
          <div className="relative group">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-xl group-focus-within:text-primary transition-colors z-10" />
            <input
              type="text"
              placeholder="Instant Product Code or Name Search..."
              className="premium-input w-full h-14 pl-12 pr-4 bg-white shadow-xl shadow-surface-200/50 border border-surface-200 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
            />

            {/* Instant Search Results Dropdown */}
            {searchInput && (
              <div className="absolute top-[110%] left-0 right-0 z-[100] glass-card shadow-2xl border-2 border-primary/20 overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="bg-surface-50 px-4 py-2 border-b text-[9px] font-black uppercase tracking-widest text-surface-400 flex items-center justify-between">
                  <span>Product Index Match ({filteredProducts.length})</span>
                  <span className="text-primary">Click to edit</span>
                </div>
                <div className="max-h-[320px] overflow-y-auto no-scrollbar">
                  {filteredProducts.length > 0 ? filteredProducts.map(p => (
                    <Link
                      key={p._id}
                      to={`/editproduct/${p._id}`}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-primary/5 border-b border-surface-50 transition-all group"
                    >
                      <div className="text-left">
                        <p className="font-black text-primary group-hover:text-primary-600 transition-colors text-xs uppercase leading-none">{p.productName}</p>
                        <p className="text-[10px] font-bold text-surface-900 uppercase tracking-tighter mt-1">
                          {p.tanglishName} <span className="opacity-30 mx-1">|</span> {p.productCode}
                        </p>
                        <p className="text-[9px] font-black text-surface-400 uppercase tracking-[0.1em] flex items-center gap-2 mt-1">
                          UNIT: <span className="text-secondary">{p.unitValue}{p.qantityType}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-black text-primary text-sm">₹{p.productPrice}</p>
                        <p className={`text-[9px] font-black uppercase ${Number(p.stockQuantity) < 5 ? 'text-error font-bold' : 'text-success'}`}>
                          STOCK: {p.stockQuantity}
                        </p>
                      </div>
                    </Link>
                  )) : (
                    <div className="p-8 text-center text-surface-400 italic text-xs font-bold uppercase tracking-widest">No matching products found</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Launchpad Toolbar */}
      <div className="glass-card p-6 mb-10 bg-gradient-to-r from-surface-50 to-white border border-surface-200">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-surface-400 mb-4 flex items-center gap-2">
          <MdPointOfSale className="text-primary text-base" /> Quick Action Launchpad
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            to="/instabiller"
            className="p-4 rounded-2xl bg-primary text-white hover:bg-primary-600 font-bold transition-all shadow-md shadow-primary/20 flex flex-col items-center justify-center text-center group"
          >
            <MdPointOfSale className="text-2xl mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs uppercase tracking-wider font-black">POS Counter</span>
          </Link>

          {isAdmin && (
            <Link
              to="/createproduct"
              className="p-4 rounded-2xl bg-white hover:bg-surface-50 border border-surface-200 text-surface-800 font-bold transition-all shadow-sm flex flex-col items-center justify-center text-center group"
            >
              <MdAddShoppingCart className="text-2xl text-primary mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs uppercase tracking-wider font-bold">Add Product</span>
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/expense"
              className="p-4 rounded-2xl bg-white hover:bg-surface-50 border border-surface-200 text-surface-800 font-bold transition-all shadow-sm flex flex-col items-center justify-center text-center group"
            >
              <MdPayments className="text-2xl text-error mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs uppercase tracking-wider font-bold">Log Expense</span>
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/market-sync"
              className="p-4 rounded-2xl bg-white hover:bg-surface-50 border border-surface-200 text-surface-800 font-bold transition-all shadow-sm flex flex-col items-center justify-center text-center group"
            >
              <MdSyncAlt className="text-2xl text-indigo-600 mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs uppercase tracking-wider font-bold">Price Sync</span>
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/audit"
              className="p-4 rounded-2xl bg-white hover:bg-surface-50 border border-surface-200 text-surface-800 font-bold transition-all shadow-sm flex flex-col items-center justify-center text-center group"
            >
              <MdAssessment className="text-2xl text-emerald-600 mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs uppercase tracking-wider font-bold">BI Audit</span>
            </Link>
          )}

          <Link
            to="/barcodeprint"
            className="p-4 rounded-2xl bg-white hover:bg-surface-50 border border-surface-200 text-surface-800 font-bold transition-all shadow-sm flex flex-col items-center justify-center text-center group"
          >
            <MdQrCode className="text-2xl text-purple-600 mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="text-xs uppercase tracking-wider font-bold">Barcodes</span>
          </Link>
        </div>
      </div>

      {/* Main KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
        {mainStats.map((stat, i) => {
          const cardContent = (
            <div key={i} className="glass-card p-6 border-l-4 group hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center text-2xl shadow-sm`}>
                  <stat.icon />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest mb-1">{stat.title}</p>
                  <p className="text-2xl font-display font-black text-surface-900 tracking-tight">{stat.value}</p>
                </div>
              </div>
              <div className="pt-3 border-t border-surface-100 flex items-center justify-between text-[10px] font-bold text-surface-400">
                <span>{stat.sub}</span>
              </div>
            </div>
          )

          if (stat.isSensitive) {
            return (
              <PinGate key={i} label={stat.title}>
                {cardContent}
              </PinGate>
            )
          }

          return cardContent
        })}
      </div>

      {/* Revenue Graph & Live Sales Feed */}
      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          
          {/* Revenue Chart */}
          <div className="lg:col-span-7">
            <PinGate label="Performance Overview">
              <div className="glass-card p-6 h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-display font-black text-surface-900 flex items-center gap-2">
                      <MdTrendingUp className="text-primary text-xl" /> Sales Trend Overview
                    </h3>
                    <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mt-0.5">
                      Recent transaction billing volume
                    </p>
                  </div>
                  <Link to="/sale" className="btn btn-xs btn-ghost text-primary text-[10px] font-black uppercase">
                    View Sales Log <MdChevronRight className="text-sm" />
                  </Link>
                </div>

                <div className="h-[220px] flex items-end justify-between gap-3 px-2 pt-6">
                  {bills.slice(-7).map((bill, i) => {
                    const heightPercent = totalRevenue > 0 ? Math.min(100, Math.max(15, (Number(bill.totalAmount || 0) / (totalRevenue / 5)) * 100)) : 20
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                        <div
                          className="w-full rounded-xl bg-primary/20 group-hover:bg-primary transition-all duration-300 cursor-pointer relative"
                          style={{ height: `${heightPercent}%` }}
                        >
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-900 text-white text-[9px] font-black py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-20">
                            ₹{fmt(bill.totalAmount)}
                          </div>
                        </div>
                        <span className="text-[9px] font-bold text-surface-400 uppercase tracking-tighter">
                          {new Date(bill.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </PinGate>
          </div>

          {/* Live Recent 5 Bills Feed */}
          <div className="lg:col-span-5">
            <div className="glass-card p-6 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-100">
                <h3 className="text-lg font-display font-black text-surface-900 flex items-center gap-2">
                  <MdReceipt className="text-primary text-xl" /> Live Terminal Feed
                </h3>
                <span className="badge badge-primary font-black text-[9px] uppercase">
                  Recent 5 Bills
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {recentFiveBills.length > 0 ? (
                  recentFiveBills.map((b, idx) => (
                    <div key={b._id || idx} className="p-3 bg-surface-50 rounded-2xl border border-surface-200 hover:border-primary/30 transition-all flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black text-surface-900 uppercase">{b.customerName || 'Retail Customer'}</p>
                        <p className="text-[9px] font-bold text-primary">{b.billNumber || `INV-${b._id?.slice(-4)}`} • {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-display font-black text-surface-900">₹{fmt(b.totalAmount)}</p>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                          (b.paymentType || '').toLowerCase() === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {b.paymentType || 'CASH'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-surface-400 italic text-xs font-bold uppercase">No transactions logged today</div>
                )}
              </div>

              <div className="pt-3 border-t border-surface-100 text-center">
                <Link to="/instabiller" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                  Launch POS Counter &rarr;
                </Link>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Pending User Approvals Component */}
      <div className="grid grid-cols-1 gap-8">
        <Pending />
      </div>

    </div>
  )
}

export default Home