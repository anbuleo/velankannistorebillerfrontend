import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import {
  MdAssessment, MdTrendingUp, MdTrendingDown, MdAccountBalance,
  MdSearch, MdReceipt, MdPayments, MdHistory, MdPrint, MdDownload,
  MdFilterList, MdPieChart, MdCategory, MdShoppingBag, MdLock, MdRefresh,
  MdCheckCircle, MdCalendarToday, MdMonetizationOn, MdShowChart
} from 'react-icons/md'
import AxiosService from '../common/Axioservice'
import { toast } from 'react-toastify'
import PinGate from '../components/PinGate'
import GetAllProductHook from '../Hooks/GetAllProductHook'

/**
 * Senior Business Analyst Audit & Financial Verification Center
 * Executive BI Dashboard with Precision Margins, SKU Analytics, Search & Official Export.
 */
function AdminAudit() {
  // Date Filtering State
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [datePreset, setDatePreset] = useState('today') // 'today', 'yesterday', 'week', 'month', 'custom'
  
  // Data State
  const [allExpenses, setAllExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [salesSearch, setSalesSearch] = useState('')
  const [expenseSearch, setExpenseSearch] = useState('')
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState('all')
  const [activeTab, setActiveTab] = useState('ledger') // 'ledger', 'skus'

  const printRef = useRef(null)
  const { getUSer, loading: loadingBills } = GetAllProductHook()

  // Redux State
  const { bills = [] } = useSelector((state) => state.sale || { bills: [] })
  const { product = [] } = useSelector((state) => state.product || { product: [] })

  // Fetch all expenses once and filter dynamically
  const fetchAllExpenses = async () => {
    setLoading(true)
    try {
      const res = await AxiosService.get('/expense/all')
      setAllExpenses(res.data?.expenses || [])
    } catch (error) {
      toast.error("Failed to load audit expense logs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllExpenses()
    getUSer('all', true) // Force fresh fetch for accurate audit statement
  }, [getUSer])

  // Handle Preset Selection
  const handlePresetChange = (preset) => {
    setDatePreset(preset)
    const today = new Date()

    if (preset === 'today') {
      setSelectedDate(today.toISOString().split('T')[0])
    } else if (preset === 'yesterday') {
      const y = new Date(today)
      y.setDate(y.getDate() - 1)
      setSelectedDate(y.toISOString().split('T')[0])
    }
  }

  // Filter bills by date / range
  const filteredBills = useMemo(() => {
    const today = new Date()
    return (bills || []).filter(b => {
      const bDate = new Date(b.createdAt)
      const bDateStr = bDate.toISOString().split('T')[0]

      if (datePreset === 'today' || datePreset === 'yesterday' || datePreset === 'custom') {
        return bDateStr === selectedDate
      } else if (datePreset === 'week') {
        const sevenDaysAgo = new Date(today)
        sevenDaysAgo.setDate(today.getDate() - 7)
        return bDate >= sevenDaysAgo && bDate <= today
      } else if (datePreset === 'month') {
        const thirtyDaysAgo = new Date(today)
        thirtyDaysAgo.setDate(today.getDate() - 30)
        return bDate >= thirtyDaysAgo && bDate <= today
      }
      return true
    })
  }, [bills, selectedDate, datePreset])

  // Filter expenses by date / range
  const filteredExpenses = useMemo(() => {
    const today = new Date()
    return (allExpenses || []).filter(e => {
      const eDate = new Date(e.expenseDate || e.createdAt)
      const eDateStr = eDate.toISOString().split('T')[0]

      if (datePreset === 'today' || datePreset === 'yesterday' || datePreset === 'custom') {
        return eDateStr === selectedDate
      } else if (datePreset === 'week') {
        const sevenDaysAgo = new Date(today)
        sevenDaysAgo.setDate(today.getDate() - 7)
        return eDate >= sevenDaysAgo && eDate <= today
      } else if (datePreset === 'month') {
        const thirtyDaysAgo = new Date(today)
        thirtyDaysAgo.setDate(today.getDate() - 30)
        return eDate >= thirtyDaysAgo && eDate <= today
      }
      return true
    })
  }, [allExpenses, selectedDate, datePreset])

  // Senior Business Analyst Metrics Computation
  const stats = useMemo(() => {
    let totalRevenue = 0
    let totalCOGS = 0

    filteredBills.forEach(bill => {
      totalRevenue += Number(bill.totalAmount || 0)

      if (bill.products && Array.isArray(bill.products)) {
        bill.products.forEach(item => {
          const masterProduct = product.find(p => p._id === item.productId || p.productName === item.productName)
          const cost = Number(item.productCost) || Number(masterProduct?.productCost) || 0
          const qty = Number(item.productQuantity || 1)
          totalCOGS += (cost * qty)
        })
      }
    })

    const grossProfit = totalRevenue - totalCOGS
    const grossMarginPercent = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0

    const totalExpense = filteredExpenses.reduce((acc, cur) => acc + Number(cur.expenseAmount || 0), 0)
    const netProfit = grossProfit - totalExpense
    const netMarginPercent = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

    const txCount = filteredBills.length
    const aov = txCount > 0 ? totalRevenue / txCount : 0
    const expenseRatio = totalRevenue > 0 ? (totalExpense / totalRevenue) * 100 : 0

    const cashSales = filteredBills
      .filter(b => (b.paymentType || '').toLowerCase() === 'cash')
      .reduce((acc, cur) => acc + Number(cur.totalAmount || 0), 0)

    const onlineSales = filteredBills
      .filter(b => (b.paymentType || '').toLowerCase() === 'online')
      .reduce((acc, cur) => acc + Number(cur.totalAmount || 0), 0)

    const pendingSales = filteredBills
      .filter(b => Number(b.dueAmount) > 0)
      .reduce((acc, cur) => acc + Number(cur.dueAmount || 0), 0)

    return {
      revenue: totalRevenue || 0,
      cogs: totalCOGS || 0,
      grossProfit: grossProfit || 0,
      grossMarginPercent: grossMarginPercent || 0,
      expense: totalExpense || 0,
      netProfit: netProfit || 0,
      profit: netProfit || 0,
      netMarginPercent: netMarginPercent || 0,
      txCount: txCount || 0,
      aov: aov || 0,
      expenseRatio: expenseRatio || 0,
      cashSales: cashSales || 0,
      onlineSales: onlineSales || 0,
      pendingSales: pendingSales || 0
    }
  }, [filteredBills, filteredExpenses, product])

  // Aggregated Product SKU Breakdown
  const skuBreakdown = useMemo(() => {
    const map = {}

    filteredBills.forEach(bill => {
      if (bill.products && Array.isArray(bill.products)) {
        bill.products.forEach(item => {
          const name = item.productName || 'Unknown Product'
          const masterProduct = product.find(p => p._id === item.productId || p.productName === name)
          const qty = Number(item.productQuantity || 1)
          const price = Number(item.productPrice) || Number(masterProduct?.productPrice) || 0
          const cost = Number(item.productCost) || Number(masterProduct?.productCost) || 0

          const revenue = price * qty
          const cogs = cost * qty
          const profit = revenue - cogs

          if (!map[name]) {
            map[name] = {
              name,
              qty: 0,
              revenue: 0,
              cogs: 0,
              profit: 0
            }
          }

          map[name].qty += qty
          map[name].revenue += revenue
          map[name].cogs += cogs
          map[name].profit += profit
        })
      }
    })

    return Object.values(map).sort((a, b) => b.revenue - a.revenue)
  }, [filteredBills, product])

  // Search filtered sales
  const searchedBills = useMemo(() => {
    const term = salesSearch.toLowerCase().trim()
    if (!term) return filteredBills
    return filteredBills.filter(b =>
      (b.customerName || '').toLowerCase().includes(term) ||
      (b.billNumber || '').toLowerCase().includes(term) ||
      (b.paymentType || '').toLowerCase().includes(term)
    )
  }, [filteredBills, salesSearch])

  // Search & Category filtered expenses
  const searchedExpenses = useMemo(() => {
    const term = expenseSearch.toLowerCase().trim()
    return filteredExpenses.filter(e => {
      const matchesCategory = expenseCategoryFilter === 'all' || e.expenseCategory === expenseCategoryFilter
      const matchesTerm = !term ||
        (e.expenseTitle || '').toLowerCase().includes(term) ||
        (e.description || '').toLowerCase().includes(term) ||
        (e.expenseCategory || '').toLowerCase().includes(term)
      return matchesCategory && matchesTerm
    })
  }, [filteredExpenses, expenseSearch, expenseCategoryFilter])

  // Categories list for dropdown
  const expenseCategories = useMemo(() => {
    const set = new Set(allExpenses.map(e => e.expenseCategory).filter(Boolean))
    return Array.from(set)
  }, [allExpenses])

  // CSV Export Handler
  const handleExportCSV = () => {
    try {
      let csvContent = `data:text/csv;charset=utf-8,\uFEFF`
      csvContent += `VELANKANNI STORE BILLER - OFFICIAL AUDIT STATEMENT\n`
      csvContent += `Audit Date / Window,${selectedDate} (${datePreset.toUpperCase()})\n`
      csvContent += `Gross Revenue,Rs. ${stats.revenue}\n`
      csvContent += `Cost of Goods Sold (COGS),Rs. ${stats.cogs}\n`
      csvContent += `Gross Margin %,${stats.grossMarginPercent.toFixed(2)}%\n`
      csvContent += `Total Expenses Outflow,Rs. ${stats.expense}\n`
      csvContent += `Net Profit,Rs. ${stats.profit}\n`
      csvContent += `Net Margin %,${stats.netMarginPercent.toFixed(2)}%\n`
      csvContent += `Total Transactions,${stats.txCount}\n`
      csvContent += `Average Order Value (AOV),Rs. ${stats.aov.toFixed(2)}\n\n`

      csvContent += `--- SALES LOG ---\n`
      csvContent += `Bill #,Customer Name,Payment Mode,Total Amount (Rs),Due Amount (Rs),Time\n`
      searchedBills.forEach(b => {
        csvContent += `"${b.billNumber || b._id}","${b.customerName || 'Walk-in'}","${b.paymentType || 'cash'}","${b.totalAmount || 0}","${b.dueAmount || 0}","${new Date(b.createdAt).toLocaleTimeString()}"\n`
      })

      csvContent += `\n--- EXPENSE LOG ---\n`
      csvContent += `Title,Category,Amount (Rs),Description,Date\n`
      searchedExpenses.forEach(e => {
        csvContent += `"${e.expenseTitle}","${e.expenseCategory || 'General'}","${e.expenseAmount}","${e.description || ''}","${new Date(e.expenseDate || e.createdAt).toLocaleDateString()}"\n`
      })

      const encodedUri = encodeURI(csvContent)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", `Audit_Statement_${selectedDate}_${datePreset}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success("Audit CSV Exported Successfully!")
    } catch (e) {
      toast.error("Failed to export CSV")
    }
  }

  // Print Handler
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="container mx-auto px-4 py-8 fade-in min-h-screen">
      
      {/* Header & Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl shadow-lg shadow-primary/30">
              <MdAssessment />
            </div>
            <div>
              <h1 className="text-3xl font-display font-black text-surface-900 leading-none">
                Executive Audit Center
              </h1>
              <p className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success"></span> Senior BA Verification Engine Active
              </p>
            </div>
          </div>
        </div>

        {/* Date Presets & Picker */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-surface-100 p-1.5 rounded-2xl border border-surface-200 flex items-center gap-1">
            {[
              { id: 'today', label: 'Today' },
              { id: 'yesterday', label: 'Yesterday' },
              { id: 'week', label: '7 Days' },
              { id: 'month', label: '30 Days' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => handlePresetChange(p.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                  datePreset === p.id 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-surface-600 hover:text-surface-900 hover:bg-white/50'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 glass-card px-4 py-2 border-primary/20">
            <MdCalendarToday className="text-primary text-base" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value)
                setDatePreset('custom')
              }}
              className="bg-transparent border-none focus:ring-0 font-bold text-xs text-surface-900 outline-none"
            />
          </div>

          <button
            onClick={() => getUSer('all', true)}
            className="w-10 h-10 rounded-xl bg-surface-100 border border-surface-200 text-surface-600 hover:text-primary hover:bg-white flex items-center justify-center transition-all"
            title="Force Refresh Data"
          >
            <MdRefresh className="text-xl" />
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-surface-900 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg hover:bg-surface-800 transition-all"
          >
            <MdDownload className="text-base text-primary" /> Export CSV
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-600 transition-all"
          >
            <MdPrint className="text-base" /> Print Report
          </button>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        
        {/* Gross Revenue */}
        <PinGate label="Daily Revenue">
          <div className="glass-card p-6 bg-gradient-to-br from-white to-surface-50 border-l-4 border-emerald-500 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl">
                <MdTrendingUp />
              </div>
              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                {stats.txCount} Orders
              </span>
            </div>
            <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest mb-1">
              Gross Turnover
            </p>
            <p className="text-3xl font-display font-black text-surface-900">
              ₹{(stats?.revenue || 0).toLocaleString()}
            </p>
            <div className="mt-3 pt-3 border-t border-surface-100 flex items-center justify-between text-[10px] text-surface-500 font-bold">
              <span>Avg Order (AOV):</span>
              <span className="font-mono text-surface-900 font-black">₹{(stats?.aov || 0).toFixed(0)}</span>
            </div>
          </div>
        </PinGate>

        {/* Expenses Outflow */}
        <div className="glass-card p-6 bg-gradient-to-br from-white to-surface-50 border-l-4 border-error shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div className="w-12 h-12 bg-error/10 text-error rounded-2xl flex items-center justify-center text-2xl">
              <MdTrendingDown />
            </div>
            <span className="text-[9px] font-black text-error bg-error/10 px-2 py-0.5 rounded-full uppercase">
              {filteredExpenses.length} Entries
            </span>
          </div>
          <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest mb-1">
            Total Operational Outflow
          </p>
          <p className="text-3xl font-display font-black text-surface-900">
            ₹{(stats?.expense || 0).toLocaleString()}
          </p>
          <div className="mt-3 pt-3 border-t border-surface-100 flex items-center justify-between text-[10px] text-surface-500 font-bold">
            <span>Expense / Revenue Ratio:</span>
            <span className="font-mono text-error font-black">{(stats?.expenseRatio || 0).toFixed(1)}%</span>
          </div>
        </div>

        {/* Gross Margin */}
        <PinGate label="Gross Margin">
          <div className="glass-card p-6 bg-gradient-to-br from-white to-surface-50 border-l-4 border-indigo-500 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl">
                <MdShowChart />
              </div>
              <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">
                COGS: ₹{(stats?.cogs || 0).toLocaleString()}
              </span>
            </div>
            <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest mb-1">
              Gross Margin (Pre-Expense)
            </p>
            <p className="text-3xl font-display font-black text-surface-900">
              ₹{(stats?.grossProfit || 0).toLocaleString()}
            </p>
            <div className="mt-3 pt-3 border-t border-surface-100 flex items-center justify-between text-[10px] text-surface-500 font-bold">
              <span>Gross Margin Rate:</span>
              <span className="font-mono text-indigo-600 font-black">{(stats?.grossMarginPercent || 0).toFixed(1)}%</span>
            </div>
          </div>
        </PinGate>

        {/* Net Profit */}
        <PinGate label="Net Profit">
          <div className="glass-card p-6 bg-surface-900 text-white border-none shadow-xl shadow-primary/20">
            <div className="flex justify-between items-start mb-3">
              <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-primary/30">
                <MdAccountBalance />
              </div>
              <span className="text-[9px] font-black text-white bg-white/10 px-2.5 py-0.5 rounded-full uppercase">
                Net Margin: {(stats?.netMarginPercent || 0).toFixed(1)}%
              </span>
            </div>
            <p className="text-[10px] font-black text-primary-200 uppercase tracking-widest mb-1 opacity-70">
              Final Net Take-Home Profit
            </p>
            <p className="text-3xl font-display font-black text-white">
              ₹{(stats?.profit ?? stats?.netProfit ?? 0).toLocaleString()}
            </p>
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-300 font-bold">
              <span>Status:</span>
              <span className={`font-mono font-black ${(stats?.profit ?? stats?.netProfit ?? 0) >= 0 ? 'text-emerald-400' : 'text-error'}`}>
                {(stats?.profit ?? stats?.netProfit ?? 0) >= 0 ? 'PROFITABLE' : 'DEFICIT'}
              </span>
            </div>
          </div>
        </PinGate>
      </div>

      {/* Payment Channel Liquidity Allocation Bar */}
      <div className="glass-card p-6 mb-8">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-surface-400 mb-4 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MdMonetizationOn className="text-primary text-base" /> Liquidity & Settlement Split
          </span>
          <span className="text-surface-500 font-bold">Total: ₹{stats.revenue.toLocaleString()}</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/20">
            <p className="text-[10px] font-black text-surface-400 uppercase">Cash In-Hand</p>
            <p className="text-xl font-display font-black text-emerald-600">₹{stats.cashSales.toLocaleString()}</p>
            <p className="text-[10px] font-bold text-surface-400 mt-1">
              {stats.revenue > 0 ? ((stats.cashSales / stats.revenue) * 100).toFixed(1) : 0}% of turnover
            </p>
          </div>

          <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/20">
            <p className="text-[10px] font-black text-surface-400 uppercase">Online / Digital (UPI/Card)</p>
            <p className="text-xl font-display font-black text-blue-600">₹{stats.onlineSales.toLocaleString()}</p>
            <p className="text-[10px] font-bold text-surface-400 mt-1">
              {stats.revenue > 0 ? ((stats.onlineSales / stats.revenue) * 100).toFixed(1) : 0}% of turnover
            </p>
          </div>

          <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/20">
            <p className="text-[10px] font-black text-surface-400 uppercase">Pending Due Receivables</p>
            <p className="text-xl font-display font-black text-amber-600">₹{stats.pendingSales.toLocaleString()}</p>
            <p className="text-[10px] font-bold text-surface-400 mt-1">
              {stats.revenue > 0 ? ((stats.pendingSales / stats.revenue) * 100).toFixed(1) : 0}% uncollected
            </p>
          </div>
        </div>
      </div>

      {/* Main View Mode Selector Tabs */}
      <div className="flex items-center gap-3 mb-6 bg-surface-100 p-1.5 rounded-2xl border border-surface-200 w-fit">
        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'ledger'
              ? 'bg-white text-primary shadow-md'
              : 'text-surface-500 hover:text-surface-900'
          }`}
        >
          <MdReceipt className="text-lg" /> Audit Ledgers (Sales & Expenses)
        </button>

        <button
          onClick={() => setActiveTab('skus')}
          className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'skus'
              ? 'bg-white text-primary shadow-md'
              : 'text-surface-500 hover:text-surface-900'
          }`}
        >
          <MdShoppingBag className="text-lg" /> Product SKU Performance ({skuBreakdown.length})
        </button>
      </div>

      {activeTab === 'ledger' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sales Audit Log */}
          <div className="lg:col-span-7">
            <PinGate label="Sales Ledger">
              <div className="glass-card flex flex-col h-[600px]">
                <div className="p-6 border-b border-surface-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-bold text-surface-900 flex items-center gap-2 text-lg">
                      <MdReceipt className="text-primary" /> Sales Audit Ledger
                    </h3>
                    <p className="text-[10px] font-bold text-surface-400 uppercase mt-0.5">
                      {searchedBills.length} Transactions Recorded
                    </p>
                  </div>

                  <div className="relative">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-base" />
                    <input
                      type="text"
                      placeholder="Search Customer or Bill #..."
                      value={salesSearch}
                      onChange={(e) => setSalesSearch(e.target.value)}
                      className="pl-9 pr-3 py-1.5 bg-surface-50 border border-surface-200 rounded-xl text-xs font-bold focus:bg-white focus:border-primary transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <table className="premium-table">
                    <thead className="sticky top-0 bg-surface-100 z-10">
                      <tr>
                        <th className="font-black">Customer / Bill</th>
                        <th className="text-center font-black">Method</th>
                        <th className="text-right font-black">Revenue</th>
                        <th className="text-right font-black">Est. Margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchedBills.length > 0 ? (
                        searchedBills.map((bill, i) => {
                          let billProfit = 0
                          if (bill.products && Array.isArray(bill.products)) {
                            bill.products.forEach(item => {
                              const masterProduct = product.find(p => p._id === item.productId || p.productName === item.productName)
                              const cost = Number(item.productCost) || Number(masterProduct?.productCost) || 0
                              const sellingPrice = Number(item.productPrice) || Number(masterProduct?.productPrice) || 0
                              const qty = Number(item.productQuantity || 1)
                              billProfit += (sellingPrice - cost) * qty
                            })
                          }

                          return (
                            <tr key={bill._id || i} className="hover:bg-surface-50 font-black">
                              <td>
                                <p className="font-black text-surface-900 text-xs uppercase">{bill.customerName || 'Walk-in Customer'}</p>
                                <p className="text-[9px] text-primary font-bold">{bill.billNumber || `INV-${(bill._id || '').slice(-4)}`} • {new Date(bill.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              </td>
                              <td className="text-center">
                                <span className={`badge text-[9px] font-bold uppercase tracking-wider text-white border-none ${(bill.paymentType || '').toLowerCase() === 'cash' ? 'bg-emerald-500' :
                                  (bill.paymentType || '').toLowerCase() === 'online' ? 'bg-blue-500' : 'bg-amber-500'
                                }`}>
                                  {bill.paymentType || 'cash'}
                                </span>
                              </td>
                              <td className="text-right font-display font-bold text-surface-900 text-sm">
                                ₹{Number(bill.totalAmount || 0).toLocaleString()}
                                {Number(bill.dueAmount) > 0 && (
                                  <p className="text-[9px] text-error font-bold">₹{bill.dueAmount} due</p>
                                )}
                              </td>
                              <td className="text-right font-display font-bold text-emerald-600 text-sm italic">
                                +₹{billProfit.toLocaleString()}
                              </td>
                            </tr>
                          )
                        })
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center py-20 text-surface-400 italic">No sales log entries found for this selection</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-surface-50 border-t border-surface-100 grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <p className="text-[8px] font-bold text-surface-400 uppercase">Cash Collected</p>
                    <p className="text-xs font-black text-emerald-600">₹{stats.cashSales.toLocaleString()}</p>
                  </div>
                  <div className="text-center border-x border-surface-200">
                    <p className="text-[8px] font-bold text-surface-400 uppercase">Online / UPI</p>
                    <p className="text-xs font-black text-blue-600">₹{stats.onlineSales.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] font-bold text-surface-400 uppercase">Pending Due</p>
                    <p className="text-xs font-black text-amber-600">₹{stats.pendingSales.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </PinGate>
          </div>

          {/* Expense Audit Log */}
          <div className="lg:col-span-5">
            <div className="glass-card flex flex-col h-[600px]">
              <div className="p-6 border-b border-surface-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-surface-900 flex items-center gap-2 text-lg">
                    <MdPayments className="text-error" /> Expense Audit Log
                  </h3>
                  <span className="badge badge-error text-white font-bold text-[9px] uppercase">{searchedExpenses.length} Logs</span>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-base" />
                    <input
                      type="text"
                      placeholder="Search Expense..."
                      value={expenseSearch}
                      onChange={(e) => setExpenseSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-surface-50 border border-surface-200 rounded-xl text-xs font-bold focus:bg-white focus:border-primary transition-all outline-none"
                    />
                  </div>
                  {expenseCategories.length > 0 && (
                    <select
                      value={expenseCategoryFilter}
                      onChange={(e) => setExpenseCategoryFilter(e.target.value)}
                      className="bg-surface-50 border border-surface-200 text-xs font-bold rounded-xl px-2 py-1.5 outline-none"
                    >
                      <option value="all">All Categories</option>
                      {expenseCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <table className="premium-table">
                  <thead className="sticky top-0 bg-surface-100 z-10">
                    <tr>
                      <th>Title & Note</th>
                      <th className="text-center">Category</th>
                      <th className="text-right">Outflow</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchedExpenses.length > 0 ? (
                      searchedExpenses.map((exp, i) => (
                        <tr key={i} className="hover:bg-surface-50">
                          <td>
                            <p className="font-bold text-surface-900 text-xs uppercase">{exp.expenseTitle}</p>
                            <p className="text-[9px] text-surface-400 font-medium italic truncate max-w-[140px]">{exp.description || 'No notes'}</p>
                          </td>
                          <td className="text-center">
                            <span className="badge badge-ghost text-[9px] font-bold uppercase tracking-wider">{exp.expenseCategory || 'General'}</span>
                          </td>
                          <td className="text-right font-display font-bold text-error text-sm">
                            ₹{Number(exp.expenseAmount || 0).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center py-20 text-surface-400 italic">No expense entries found for this selection</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-6 bg-surface-50 border-t border-surface-100 flex items-center justify-between">
                <p className="text-xs font-bold text-surface-400 uppercase tracking-widest">Total Period Outflow</p>
                <p className="text-lg font-black text-error">₹{stats.expense.toLocaleString()}</p>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Product SKU Audit Table */
        <PinGate label="SKU Margin Performance">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-bold text-surface-900 text-lg flex items-center gap-2">
                  <MdShoppingBag className="text-primary" /> Product SKU Performance & Contribution
                </h3>
                <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mt-0.5">
                  Itemized margin leaderboard for selected period
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product / SKU Description</th>
                    <th className="text-center">Quantity Sold</th>
                    <th className="text-right">Gross Sales (₹)</th>
                    <th className="text-right">Estimated Cost (₹)</th>
                    <th className="text-right">Margin Contribution (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {skuBreakdown.length > 0 ? (
                    skuBreakdown.map((sku, idx) => (
                      <tr key={idx} className="hover:bg-surface-50 font-black">
                        <td className="text-surface-400 font-bold text-xs">{idx + 1}</td>
                        <td className="text-surface-900 font-bold text-sm uppercase">{sku.name}</td>
                        <td className="text-center font-bold text-surface-700 text-sm">{sku.qty}</td>
                        <td className="text-right font-display font-bold text-surface-900 text-sm">₹{sku.revenue.toLocaleString()}</td>
                        <td className="text-right font-display font-bold text-surface-400 text-sm">₹{sku.cogs.toLocaleString()}</td>
                        <td className="text-right font-display font-bold text-emerald-600 text-sm">
                          +₹{sku.profit.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-20 text-surface-400 italic">No products sold during this audit window</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </PinGate>
      )}

      {/* Official Print View (Hidden on Screen, Visible on Print) */}
      <div className="hidden print:block print:p-8 font-sans">
        <div className="text-center border-b-2 border-black pb-4 mb-6">
          <h1 className="text-2xl font-bold uppercase">VELANKANNI STORE BILLER</h1>
          <h2 className="text-sm font-semibold uppercase tracking-widest">OFFICIAL BUSINESS AUDIT STATEMENT</h2>
          <p className="text-xs text-gray-600 mt-1">Audit Window: {selectedDate} ({datePreset.toUpperCase()}) | Generated: {new Date().toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6 border p-4 rounded text-xs">
          <div><strong>Gross Turnover:</strong> ₹{stats.revenue.toLocaleString()}</div>
          <div><strong>Total Expenses:</strong> ₹{stats.expense.toLocaleString()}</div>
          <div><strong>Net Take-Home Profit:</strong> ₹{stats.profit.toLocaleString()}</div>
          <div><strong>Cash Sales:</strong> ₹{stats.cashSales.toLocaleString()}</div>
          <div><strong>Online Sales:</strong> ₹{stats.onlineSales.toLocaleString()}</div>
          <div><strong>Pending Credit:</strong> ₹{stats.pendingSales.toLocaleString()}</div>
        </div>

        <h3 className="font-bold text-sm mb-2 border-b pb-1">SALES TRANSACTIONS LOG</h3>
        <table className="w-full text-xs border-collapse border mb-6">
          <thead>
            <tr className="bg-gray-200 border-b">
              <th className="p-1 text-left">Bill #</th>
              <th className="p-1 text-left">Customer</th>
              <th className="p-1 text-center">Mode</th>
              <th className="p-1 text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {searchedBills.map((b, i) => (
              <tr key={i} className="border-b">
                <td className="p-1">{b.billNumber || b._id}</td>
                <td className="p-1">{b.customerName || 'Walk-in'}</td>
                <td className="p-1 text-center">{b.paymentType || 'cash'}</td>
                <td className="p-1 text-right">₹{b.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-16 pt-8 border-t border-gray-400 flex justify-between text-xs">
          <div>
            <p className="border-t border-black pt-1 w-48 text-center font-bold">Store Auditor Signature</p>
          </div>
          <div>
            <p className="border-t border-black pt-1 w-48 text-center font-bold">Business Owner Sign-off</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default AdminAudit
