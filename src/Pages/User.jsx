import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import AxiosService from '../common/Axioservice'
import { useNavigate, Link } from 'react-router-dom'
import { MdPeople, MdEdit, MdDelete, MdAccountCircle, MdEmail, MdPhone } from 'react-icons/md'

function User() {
  const [userData, setUserData] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const getUserData = async () => {
    try {
      const res = await AxiosService.get('/auth/getalluser')
      if (res.status === 200) {
        setUserData(res.data.users || res.data.user || [])
      }
    } catch (error) {
      toast.error('Could not fetch staff data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserData()
  }, [])

  const handleDeleteUser = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the staff?`)) {
      try {
        const res = await AxiosService.delete(`/auth/deleteuser/${id}`)
        if (res.status === 200) {
          toast.success('Staff member removed')
          getUserData()
        }
      } catch (error) {
        toast.error('Removal failed')
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl shadow-premium">
            <MdPeople />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900 mb-1">Staff Management</h1>
            <p className="text-surface-500 font-medium">Control access levels and manage employee profiles.</p>
          </div>
        </div>
        <Link to="/signup" className="premium-button flex items-center gap-2 h-12 px-8">
          <MdPeople className="text-xl" /> Create New Account
        </Link>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="bg-surface-50 px-8 py-5 border-b border-surface-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest leading-none">Registered Personnel</h3>
          <span className="badge badge-primary font-bold">{userData.length} Members</span>
        </div>
        <table className="premium-table">
          <thead>
            <tr>
              <th className="w-20 text-center">#</th>
              <th>Employee Details</th>
              <th>Credentials</th>
              <th className="text-center">Role</th>
              <th className="text-center">Account Status</th>
              <th className="text-right">Management</th>
            </tr>
          </thead>
          <tbody>
            {!loading && userData.map((user, i) => (
              <tr key={user._id} className="h-24 hover:bg-surface-50/50 transition-colors">
                <td className="text-center">
                  <div className="w-10 h-10 rounded-full bg-surface-100 text-surface-400 font-bold flex items-center justify-center mx-auto text-sm border-2 border-white shadow-sm">
                    {i + 1}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center text-white text-xl shadow-lg shadow-primary/20">
                      <MdAccountCircle />
                    </div>
                    <div>
                      <p className="font-bold text-surface-900 text-lg uppercase tracking-tight leading-none mb-1">{user.userName}</p>
                      <p className="text-[10px] text-surface-400 font-bold uppercase tracking-widest flex items-center gap-1 opacity-70">
                        Staff Identity Code: {user._id.slice(-6)}
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
                  <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${user.role === 'admin' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="text-center">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border-2 ${user.status === 'approved'
                    ? 'border-success/20 bg-success/5 text-success'
                    : user.status === 'rejected'
                      ? 'border-error/20 bg-error/5 text-error'
                      : 'border-amber-400/30 bg-amber-50 text-amber-600'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'approved' ? 'bg-success' : user.status === 'rejected' ? 'bg-error' : 'bg-amber-500'
                      }`}></span>
                    {user.status || 'pending'}
                  </span>
                </td>
                <td className="text-right">
                  <div className="flex justify-end gap-3 px-4">
                    <button
                      onClick={() => navigate(`/edituser/${user._id}`)}
                      className="w-11 h-11 flex items-center justify-center rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all shadow-sm group"
                    >
                      <MdEdit className="text-xl transition-transform group-hover:scale-110" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id, user.userName)}
                      className="w-11 h-11 flex items-center justify-center rounded-xl bg-error/5 text-error hover:bg-error hover:text-white transition-all shadow-sm group"
                    >
                      <MdDelete className="text-xl transition-transform group-hover:scale-110" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {loading && (
              <tr>
                <td colSpan={5} className="h-60 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <span className="loading loading-ring loading-lg text-primary"></span>
                    <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Synchronizing personnel data...</p>
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

export default User