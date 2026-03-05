import React, { useState, useEffect } from 'react'
import AxiosService from '../common/Axioservice'
import { toast } from 'react-toastify'
import { MdAdd, MdDelete, MdReceiptLong, MdAttachMoney, MdOutlineCategory, MdDescription } from 'react-icons/md'

function Expense() {
    const [expenses, setExpenses] = useState([])
    const [loading, setLoading] = useState(true)
    const [summary, setSummary] = useState(0)
    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        expenseTitle: '',
        expenseAmount: '',
        expenseCategory: 'Others',
        description: '',
        expenseDate: new Date().toISOString().split('T')[0]
    })

    const fetchExpenses = async () => {
        try {
            const [expRes, sumRes] = await Promise.all([
                AxiosService.get('/expense/all'),
                AxiosService.get('/expense/summary')
            ])
            setExpenses(expRes.data.expenses)
            setSummary(sumRes.data.totalExpenses)
        } catch (error) {
            toast.error("Failed to load expenses")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchExpenses()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await AxiosService.post('/expense/add', formData)
            toast.success("Expense logged successfully")
            setShowForm(false)
            setFormData({
                expenseTitle: '',
                expenseAmount: '',
                expenseCategory: 'Others',
                description: '',
                expenseDate: new Date().toISOString().split('T')[0]
            })
            fetchExpenses()
        } catch (error) {
            toast.error("Entry failed")
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this expense record?")) return
        try {
            await AxiosService.delete(`/expense/delete/${id}`)
            toast.success("Record deleted")
            fetchExpenses()
        } catch (error) {
            toast.error("Deletion failed")
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-display font-bold text-surface-900 flex items-center gap-3">
                        <MdReceiptLong className="text-primary" /> Daily Expense Ledger
                    </h1>
                    <p className="text-surface-500 mt-1 font-medium">Tracking overheads for profit reconciliation</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="glass-card px-6 py-3 bg-surface-900 text-white min-w-[200px]">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Total Expenditure</p>
                        <p className="text-2xl font-display font-bold text-white">₹{summary.toLocaleString()}</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn btn-primary h-14 px-8 rounded-2xl shadow-xl shadow-primary/30 flex items-center gap-2 font-bold"
                    >
                        <MdAdd className="text-xl" /> Log New Expense
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="glass-card p-8 mb-10 animate-in slide-in-from-top-4 duration-300">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <MdAttachMoney className="text-primary" /> Expense Details
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="form-control">
                            <label className="label text-[10px] font-bold text-surface-400 uppercase">Title</label>
                            <input
                                type="text" required
                                className="premium-input bg-surface-50"
                                value={formData.expenseTitle}
                                onChange={(e) => setFormData({ ...formData, expenseTitle: e.target.value })}
                                placeholder="e.g. Electricity Bill"
                            />
                        </div>
                        <div className="form-control">
                            <label className="label text-[10px] font-bold text-surface-400 uppercase">Amount (₹)</label>
                            <input
                                type="number" required
                                className="premium-input bg-surface-50"
                                value={formData.expenseAmount}
                                onChange={(e) => setFormData({ ...formData, expenseAmount: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="form-control">
                            <label className="label text-[10px] font-bold text-surface-400 uppercase">Category</label>
                            <select
                                className="premium-input bg-surface-50"
                                value={formData.expenseCategory}
                                onChange={(e) => setFormData({ ...formData, expenseCategory: e.target.value })}
                            >
                                {['Electricity', 'Rent', 'Wages', 'Transport', 'Maintenance', 'Others'].map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="label text-[10px] font-bold text-surface-400 uppercase">Date</label>
                            <input
                                type="date" required
                                className="premium-input bg-surface-50"
                                value={formData.expenseDate}
                                onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                            />
                        </div>
                        <div className="form-control md:col-span-2 lg:col-span-3">
                            <label className="label text-[10px] font-bold text-surface-400 uppercase">Description</label>
                            <textarea
                                className="premium-input bg-surface-50 h-14"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Additional details..."
                            />
                        </div>
                        <div className="flex items-end">
                            <button type="submit" className="btn btn-primary w-full h-14 rounded-xl font-bold">Save Entry</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="glass-card overflow-hidden">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Entry Details</th>
                            <th className="text-center">Category</th>
                            <th className="text-right">Amount</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.length > 0 ? expenses.map((exp) => (
                            <tr key={exp._id} className="h-20">
                                <td className="font-bold text-surface-500 text-xs">
                                    {new Date(exp.expenseDate).toLocaleDateString()}
                                </td>
                                <td>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-surface-900 uppercase tracking-tight">{exp.expenseTitle}</span>
                                        <span className="text-[10px] text-surface-400 font-medium italic truncate max-w-xs">{exp.description || 'No description'}</span>
                                    </div>
                                </td>
                                <td className="text-center">
                                    <span className="badge badge-outline border-surface-200 text-surface-500 font-bold text-[9px] uppercase tracking-widest px-3">
                                        {exp.expenseCategory}
                                    </span>
                                </td>
                                <td className="text-right font-display font-bold text-surface-900">
                                    ₹{exp.expenseAmount.toLocaleString()}
                                </td>
                                <td className="text-right">
                                    <button
                                        onClick={() => handleDelete(exp._id)}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-error/5 text-error hover:bg-error hover:text-white transition-all shadow-sm"
                                    >
                                        <MdDelete className="text-lg" />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="h-40 text-center text-surface-400 italic">No expense records found for this period</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Expense
