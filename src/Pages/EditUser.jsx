import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import AxiosService from '../common/Axioservice'
import { toast } from 'react-toastify'
import { MdVerified, MdAccountCircle, MdAccessTime, MdChevronRight, MdArrowBack, MdCheck } from 'react-icons/md'

function EditUser() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const { id } = useParams()
    const navigate = useNavigate()

    const getUser = async () => {
        try {
            const res = await AxiosService.get(`/auth/getuserbyid/${id}`)
            if (res.status === 200) {
                setData(res.data.user)
            }
        } catch (error) {
            toast.error('Profile synchronization failed')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getUser()
    }, [id])

    const handleUpdate = async () => {
        setSaving(true)
        try {
            const res = await AxiosService.put(`/auth/edituser/${id}`, data)
            if (res.status === 200) {
                toast.success('Personnel profile updated successfully')
                navigate('/user')
            }
        } catch (error) {
            toast.error('Update operation failed')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-surface-50">
            <div className="text-center animate-pulse">
                <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4 border-4 border-primary border-t-transparent animate-spin"></div>
                <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Accessing Profile...</p>
            </div>
        </div>
    )

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl fade-in">
            <div className="flex items-center gap-2 mb-10 text-sm font-bold text-surface-400">
                <Link to="/user" className="hover:text-primary transition-colors">Staff List</Link>
                <MdChevronRight />
                <span className="text-surface-900">Personnel Update</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left: Summary Profile */}
                <div className="lg:col-span-1 space-y-8 animate-in slide-in-from-left-8 duration-700">
                    <div className="glass-card p-10 flex flex-col items-center border-none shadow-premium relative bg-gradient-to-br from-white to-surface-50 text-center overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mt-16 -mr-16 blur-2xl"></div>
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center text-white text-4xl shadow-2xl mb-6 ring-4 ring-primary/10">
                            <MdAccountCircle />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-surface-900 mb-1 leading-none">{data?.userName}</h2>
                        <p className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-6 opacity-80">Profile ID: {id.slice(-8)}</p>

                        <div className="w-full space-y-3">
                            <div className="p-4 bg-white rounded-2xl border border-surface-100 flex items-center gap-3 text-left">
                                <MdAccessTime className="text-primary text-xl" />
                                <div>
                                    <p className="text-[10px] font-bold text-surface-400 uppercase leading-none mb-1">Last Login</p>
                                    <p className="text-xs font-bold text-surface-900">2 Mins Ago</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 border-none bg-surface-900 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity duration-700"></div>
                        <div className="flex items-center justify-between p-6 bg-surface-50/10 rounded-2xl border border-white/10 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white text-primary flex items-center justify-center text-xl shadow-sm">
                                    <MdVerified />
                                </div>
                                <div>
                                    <p className="font-bold text-white leading-none mb-1">Grant Approval</p>
                                    <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">Admin Privileges</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                className="toggle toggle-primary toggle-lg ring-offset-surface-900"
                                checked={data?.role === 'admin'}
                                onChange={(e) => setData({ ...data, role: e.target.checked ? 'admin' : 'staff' })}
                            />
                        </div>
                    </div>
                </div>

                {/* Right: Data Form */}
                <div className="lg:col-span-2 space-y-8 animate-in slide-in-from-right-8 duration-700">
                    <div className="glass-card p-10 shadow-premium border-none min-h-[500px]">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-display font-bold text-surface-900 flex items-center gap-3">
                                <span className="w-2 h-8 bg-primary rounded-full"></span>
                                Employee Information
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-3 ml-1 leading-none">Registered Name</label>
                                <input
                                    className="premium-input w-full h-14 pl-12"
                                    defaultValue={data?.userName}
                                    placeholder="Enter full name"
                                    onChange={(e) => setData({ ...data, userName: e.target.value })}
                                />
                                <MdAccountCircle className="absolute -mt-10 ml-4 text-surface-300 text-xl" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-3 ml-1 leading-none">Contact Email</label>
                                <input
                                    className="premium-input w-full h-14"
                                    defaultValue={data?.email}
                                    placeholder="Enter work email"
                                    onChange={(e) => setData({ ...data, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-3 ml-1 leading-none">Mobile No</label>
                                <input
                                    className="premium-input w-full h-14"
                                    defaultValue={data?.mobile}
                                    placeholder="Registered phone"
                                    onChange={(e) => setData({ ...data, mobile: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-3 ml-1 leading-none">Current Role</label>
                                <select
                                    className="premium-input w-full h-14 appearance-none capitalize font-bold"
                                    value={data?.role}
                                    onChange={(e) => setData({ ...data, role: e.target.value })}
                                >
                                    <option value="staff">Staff Member</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-12 pt-10 border-t border-surface-100 flex flex-col md:flex-row justify-between items-center gap-6">
                            <button
                                onClick={() => navigate('/user')}
                                className="flex items-center gap-2 font-bold text-surface-400 hover:text-surface-900 transition-colors uppercase text-[10px] tracking-widest order-2 md:order-1"
                            >
                                <MdArrowBack /> Cancel Changes
                            </button>
                            <button
                                onClick={handleUpdate}
                                disabled={saving}
                                className={`premium-button h-14 px-12 text-sm flex items-center justify-center gap-3 order-1 md:order-2 shadow-2xl transition-all ${saving ? 'opacity-70 scale-95 shadow-none' : ''}`}
                            >
                                {saving ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span> Syncing...
                                    </>
                                ) : (
                                    <>
                                        <MdCheck className="text-lg" /> Persist Profile
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditUser