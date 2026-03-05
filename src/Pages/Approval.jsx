import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import AxiosService from '../common/Axioservice'
import { MdCheck, MdClose, MdPersonAdd, MdAccessTime, MdAccountCircle, MdEmail, MdPhone } from 'react-icons/md'

function Approval() {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)

    const getPendingRequests = async () => {
        try {
            const res = await AxiosService.get('/auth/getalluser')
            if (res.status === 200) {
                // Filter for users with pending status
                const allUsers = res.data.users || res.data.user || []; const pending = allUsers.filter(user => user.status === 'pending' || !user.status)
                setRequests(pending)
            }
        } catch (error) {
            toast.error('Could not fetch approval requests')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getPendingRequests()
    }, [])

    const handleApproval = async (id, status, name) => {
        const action = status === 'approved' ? 'approve' : 'reject';
        if (window.confirm(`Are you sure you want to ${action} ${name}'s account request?`)) {
            try {
                const res = await AxiosService.put(`/auth/approval/${id}`, { status, activeStatus: status === 'approved' })
                if (res.status === 200) {
                    toast.success(`User ${action}d successfully`)
                    getPendingRequests()
                }
            } catch (error) {
                toast.error(`${action.charAt(0).toUpperCase() + action.slice(1)} logic failed`)
            }
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 fade-in min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-3xl shadow-premium">
                        <MdPersonAdd />
                    </div>
                    <div>
                        <h1 className="text-3xl font-display font-bold text-surface-900 mb-1">Access Approvals</h1>
                        <p className="text-surface-500 font-medium">Review and authorize new staff registration requests.</p>
                    </div>
                </div>
                <div className="glass-card px-6 py-3 flex items-center gap-3 border-amber-200 bg-amber-50">
                    <MdAccessTime className="text-amber-600 text-xl animate-pulse" />
                    <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">{requests.length} Pending Actions</p>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="bg-surface-50 px-8 py-5 border-b border-surface-100 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest leading-none">Awaiting Review</h3>
                </div>
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>Applicant</th>
                            <th>Contact Details</th>
                            <th className="text-center">Request Date</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loading && requests.map((user) => (
                            <tr key={user._id} className="h-24 hover:bg-surface-50/50 transition-colors">
                                <td>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xl shadow-lg shadow-amber-200">
                                            <MdAccountCircle />
                                        </div>
                                        <div>
                                            <p className="font-bold text-surface-900 text-lg uppercase tracking-tight leading-none mb-1">{user.userName}</p>
                                            <p className="text-[10px] text-surface-400 font-bold uppercase tracking-widest opacity-70">
                                                Role: {user.role}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-surface-600 font-medium text-sm">
                                            <MdEmail className="opacity-40" /> {user.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-surface-400 font-medium text-xs">
                                            <MdPhone className="opacity-40" /> {user.mobile}
                                        </div>
                                    </div>
                                </td>
                                <td className="text-center">
                                    <p className="text-xs font-bold text-surface-600">{new Date(user.createdAt).toLocaleDateString()}</p>
                                    <p className="text-[10px] text-surface-400">{new Date(user.createdAt).toLocaleTimeString()}</p>
                                </td>
                                <td className="text-right">
                                    <div className="flex justify-end gap-3 px-4">
                                        <button
                                            onClick={() => handleApproval(user._id, 'approved', user.userName)}
                                            className="btn btn-success btn-sm gap-2 rounded-xl text-white font-bold uppercase tracking-widest text-[10px] px-4"
                                        >
                                            <MdCheck /> Approve
                                        </button>
                                        <button
                                            onClick={() => handleApproval(user._id, 'rejected', user.userName)}
                                            className="btn btn-error btn-sm gap-2 rounded-xl text-white font-bold uppercase tracking-widest text-[10px] px-4"
                                        >
                                            <MdClose /> Reject
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {!loading && requests.length === 0 && (
                            <tr>
                                <td colSpan={4} className="h-60 text-center">
                                    <div className="flex flex-col items-center gap-4 py-20">
                                        <div className="w-20 h-20 rounded-full bg-surface-50 flex items-center justify-center text-surface-200 text-5xl">
                                            <MdCheck />
                                        </div>
                                        <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">No pending signup requests.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        {loading && (
                            <tr>
                                <td colSpan={4} className="h-60 text-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <span className="loading loading-ring loading-lg text-amber-500"></span>
                                        <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Scanning for requests...</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Approval
