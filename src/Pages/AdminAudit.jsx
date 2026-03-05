import React, { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { MdAccountBalance, MdTrendingUp, MdTrendingDown, MdAssessment, MdSearch, MdReceipt, MdPayments, MdHistory } from 'react-icons/md'
import AxiosService from '../common/Axioservice'
import { toast } from 'react-toastify'
import PinGate from '../components/PinGate'

function AdminAudit() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [dailyExpenses, setDailyExpenses] = useState([])
    const [loading, setLoading] = useState(false)

    // Get all bills from Redux store
    const { bills = [] } = useSelector((state) => state.sale || { bills: [] })

    const fetchExpensesByDate = async (date) => {
        setLoading(true)
        try {
            // Ideally backend should have a filter by date, but we can also filter all expenses if not too many
            const res = await AxiosService.get('/expense/all')
            const filtered = res.data.expenses.filter(e =>
                new Date(e.expenseDate).toISOString().split('T')[0] === date
            )
            setDailyExpenses(filtered)
        } catch (error) {
            toast.error("Failed to load audit data")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchExpensesByDate(selectedDate)
    }, [selectedDate])

    // Filter bills for the selected date
    const dailyBills = useMemo(() => {
        return (bills || []).filter(b =>
            new Date(b.createdAt).toISOString().split('T')[0] === selectedDate
        )
    }, [bills, selectedDate])

    // Financial Computations
    const stats = useMemo(() => {
        const revenue = dailyBills.reduce((acc, cur) => acc + Number(cur.totalAmount || 0), 0)
        const expense = dailyExpenses.reduce((acc, cur) => acc + Number(cur.expenseAmount || 0), 0)
        const profit = revenue - expense

        const cashSales = dailyBills
            .filter(b => (b.paymentType || '').toLowerCase() === 'cash')
            .reduce((acc, cur) => acc + Number(cur.totalAmount || 0), 0)
        const onlineSales = dailyBills
            .filter(b => (b.paymentType || '').toLowerCase() === 'online')
            .reduce((acc, cur) => acc + Number(cur.totalAmount || 0), 0)
        const pendingSales = dailyBills
            .filter(b => Number(b.dueAmount) > 0)
            .reduce((acc, cur) => acc + Number(cur.dueAmount || 0), 0)

        return { revenue, expense, profit, cashSales, onlineSales, pendingSales }
    }, [dailyBills, dailyExpenses])

    return (
        <div className="container mx-auto px-4 py-8 fade-in min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-display font-bold text-surface-900 flex items-center gap-3">
                        <MdAssessment className="text-primary" /> Daily Audit Center
                    </h1>
                    <p className="text-surface-500 mt-1 font-medium">Precision verification of daily revenue, expenses, and margins.</p>
                </div>
                <div className="flex items-center gap-4 glass-card px-6 py-3 border-primary/20">
                    <MdHistory className="text-primary text-xl" />
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 font-bold text-surface-900"
                    />
                </div>
            </div>

            {/* Audit Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <PinGate label="Daily Revenue">
                    <div className="glass-card p-6 bg-gradient-to-br from-white to-surface-50 border-l-4 border-success">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-success/10 text-success rounded-2xl flex items-center justify-center text-2xl">
                                <MdTrendingUp />
                            </div>
                            <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Inflow</span>
                        </div>
                        <p className="text-[10px] font-bold text-surface-500 uppercase mb-1">Daily Gross Revenue</p>
                        <p className="text-3xl font-display font-black text-surface-900">₹{stats.revenue.toLocaleString()}</p>
                    </div>
                </PinGate>

                <div className="glass-card p-6 bg-gradient-to-br from-white to-surface-50 border-l-4 border-error">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-error/10 text-error rounded-2xl flex items-center justify-center text-2xl">
                            <MdTrendingDown />
                        </div>
                        <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Outflow</span>
                    </div>
                    <p className="text-[10px] font-bold text-surface-500 uppercase mb-1">Daily Total Expenses</p>
                    <p className="text-3xl font-display font-black text-surface-900">₹{stats.expense.toLocaleString()}</p>
                </div>

                <PinGate label="Net Profit">
                    <div className="glass-card p-6 bg-surface-900 text-white border-none shadow-xl shadow-primary/20">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-primary/30">
                                <MdAccountBalance />
                            </div>
                            <span className="text-[10px] font-bold text-primary-300 uppercase tracking-widest">Net Result</span>
                        </div>
                        <p className="text-[10px] font-bold text-primary-200 uppercase mb-1 opacity-70">Daily Net Profit</p>
                        <p className="text-3xl font-display font-black text-white">₹{stats.profit.toLocaleString()}</p>
                    </div>
                </PinGate>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Sales Audit Log */}
                <div className="glass-card flex flex-col h-[500px]">
                    <div className="p-6 border-b border-surface-100 flex items-center justify-between">
                        <h3 className="font-display font-bold text-surface-900 flex items-center gap-2">
                            <MdReceipt className="text-primary" /> Sales Audit Log
                        </h3>
                        <span className="badge badge-outline border-surface-200 font-bold text-[10px] uppercase">{dailyBills.length} TX</span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <table className="premium-table">
                            <thead className="sticky top-0 bg-surface-50 z-10">
                                <tr>
                                    <th>Customer</th>
                                    <th className="text-center">Mode</th>
                                    <th className="text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dailyBills.length > 0 ? dailyBills.map((bill, i) => (
                                    <tr key={bill._id || i} className="hover:bg-surface-50">
                                        <td>
                                            <p className="font-bold text-surface-900 text-xs uppercase">{bill.customerName || 'Walk-in'}</p>
                                            <p className="text-[9px] text-surface-400 font-bold">{new Date(bill.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </td>
                                        <td className="text-center">
                                            <span className={`badge text-[9px] font-bold uppercase tracking-wider text-white border-none ${(bill.paymentType || '').toLowerCase() === 'cash' ? 'badge-success' :
                                                (bill.paymentType || '').toLowerCase() === 'online' ? 'badge-info' :
                                                    'badge-warning'
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
                                    </tr>
                                )) : (
                                    <tr><td colSpan={3} className="text-center py-20 text-surface-400 italic">No sales recorded for this date</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 bg-surface-50 border-t border-surface-100 grid grid-cols-3 gap-2">
                        <div className="text-center">
                            <p className="text-[8px] font-bold text-surface-400 uppercase">Cash</p>
                            <p className="text-xs font-black text-success">₹{stats.cashSales.toLocaleString()}</p>
                        </div>
                        <div className="text-center border-x border-surface-200">
                            <p className="text-[8px] font-bold text-surface-400 uppercase">Online</p>
                            <p className="text-xs font-black text-info">₹{stats.onlineSales.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[8px] font-bold text-surface-400 uppercase">Pending</p>
                            <p className="text-xs font-black text-error">₹{stats.pendingSales.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Expense Audit Log */}
                <div className="glass-card flex flex-col h-[500px]">
                    <div className="p-6 border-b border-surface-100 flex items-center justify-between">
                        <h3 className="font-display font-bold text-surface-900 flex items-center gap-2">
                            <MdPayments className="text-error" /> Expense Audit Log
                        </h3>
                        <span className="badge badge-outline border-surface-200 font-bold text-[10px] uppercase">{dailyExpenses.length} Entries</span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <table className="premium-table">
                            <thead className="sticky top-0 bg-surface-50 z-10">
                                <tr>
                                    <th>Entry</th>
                                    <th className="text-center">Category</th>
                                    <th className="text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dailyExpenses.length > 0 ? dailyExpenses.map((exp, i) => (
                                    <tr key={i} className="hover:bg-surface-50">
                                        <td>
                                            <p className="font-bold text-surface-900 text-xs uppercase">{exp.expenseTitle}</p>
                                            <p className="text-[9px] text-surface-400 font-medium italic truncate max-w-[100px]">{exp.description}</p>
                                        </td>
                                        <td className="text-center">
                                            <span className="badge badge-ghost text-[9px] font-bold uppercase tracking-wider">{exp.expenseCategory}</span>
                                        </td>
                                        <td className="text-right font-display font-bold text-error text-sm">
                                            ₹{Number(exp.expenseAmount).toLocaleString()}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={3} className="text-center py-20 text-surface-400 italic">No expenses logged for this date</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-6 bg-surface-50 border-t border-surface-100 flex items-center justify-between">
                        <p className="text-xs font-bold text-surface-400 uppercase tracking-widest">Daily Outflow</p>
                        <p className="text-lg font-black text-error">₹{stats.expense.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminAudit
