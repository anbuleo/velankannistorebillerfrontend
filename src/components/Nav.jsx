import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { UserDataContext } from '../Context/AuthContext'
import { toast } from 'react-toastify'
import {
  MdMenu, MdAccountCircle, MdLogout, MdKeyboardArrowDown,
  MdDashboard, MdInventory, MdTrendingUp, MdManageAccounts
} from 'react-icons/md'
import AxiosService from '../common/Axioservice'

function Nav() {
  const { data } = useContext(UserDataContext)
  const [pendingCount, setPendingCount] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isAdmin = data?.role === 'admin'

  useEffect(() => {
    if (isAdmin) {
      const getPending = async () => {
        try {
          const res = await AxiosService.get('/auth/getalluser')
          const pending = res.data.users.filter(u => u.status === 'pending').length
          setPendingCount(pending)
        } catch (e) {
          console.error('Failed to get pending users', e)
        }
      }
      getPending()
    }
  }, [isAdmin])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    sessionStorage.clear()
    localStorage.clear()
    toast.success('Logged out successfully')
    navigate('/')
  }

  // --- Premium Grouped Navigation Links ---
  const adminNav = [
    {
      label: 'Core',
      icon: <MdDashboard />,
      paths: ['/home', '/instabiller', '/customer'],
      links: [
        { name: 'Dashboard', path: '/home' },
        { name: 'InstaBiller', path: '/instabiller' },
        { name: 'Customers', path: '/customer' }
      ]
    },
    {
      label: 'Inventory',
      icon: <MdInventory />,
      paths: ['/product', '/category', '/lowstock', '/barcodeprint'],
      links: [
        { name: 'Product Catalog', path: '/product' },
        { name: 'Categories', path: '/category' },
        { name: 'Daily Price Sync', path: '/market-sync' },
        { name: 'Low Stock Alert', path: '/lowstock' },
        { name: 'Barcode Generator', path: '/barcodeprint' }
      ]
    },
    {
      label: 'Finance',
      icon: <MdTrendingUp />,
      paths: ['/audit', '/sale', '/expense'],
      links: [
        { name: 'Audit Center', path: '/audit' },
        { name: 'Sales Log', path: '/sale' },
        { name: 'Expenses', path: '/expense' }
      ]
    },
    {
      label: 'Admin',
      icon: <MdManageAccounts />,
      paths: ['/user', '/approval'],
      hasBadge: pendingCount > 0,
      links: [
        { name: 'Staff Accounts', path: '/user' },
        { name: 'Signup Approvals', path: '/approval', badge: pendingCount }
      ]
    }
  ]

  const staffNav = [
    {
      label: 'Workspace',
      icon: <MdDashboard />,
      paths: ['/home', '/instabiller', '/sale', '/product', '/lowstock'],
      links: [
        { name: 'Dashboard', path: '/home' },
        { name: 'InstaBiller', path: '/instabiller' },
        { name: 'Sales Log', path: '/sale' },
        { name: 'Browse Inventory', path: '/product' },
        { name: 'Low Stock Status', path: '/lowstock' }
      ]
    }
  ]

  const navGroups = isAdmin ? adminNav : staffNav

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-1 backdrop-blur-md bg-white/70 shadow-sm border-b border-surface-200/50' : 'py-3 bg-transparent'}`}>
        <div className="container mx-auto px-4">
          <div className={`navbar glass-card px-4 lg:px-6 transition-all duration-300 ${scrolled ? 'border-transparent shadow-none bg-transparent min-h-[56px]' : 'min-h-[64px]'}`}>

            {/* Left: Brand & Mobile Toggle */}
            <div className="flex-1 flex items-center gap-3">
              <div className="lg:hidden">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="btn btn-ghost btn-circle hover:bg-surface-100 transition-colors">
                  <MdMenu className="text-2xl text-surface-700" />
                </button>
              </div>

              <Link to="/home" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:shadow-primary/50 group-hover:scale-105 transition-all duration-300">
                  <span className="text-lg font-black tracking-tighter">VB</span>
                </div>
                <div className="hidden sm:flex flex-col justify-center">
                  <span className="text-[14px] font-display font-black tracking-tight leading-none text-surface-900">
                    Velankanni <span className="text-primary">Biller</span>
                  </span>
                  <span className="text-[8px] font-bold text-surface-400 uppercase tracking-widest leading-none mt-0.5">
                    Premium Admin
                  </span>
                </div>
              </Link>
            </div>

            {/* Middle: Desktop Navigation Menus */}
            <div className="hidden lg:flex flex-none justify-center">
              <ul className="flex items-center gap-2">
                {navGroups.map((group, i) => {
                  const isActive = group.paths.includes(location.pathname)
                  return (
                    <li key={i} className="relative group/nav">
                      <button className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 ${isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                        }`}>
                        {group.icon}
                        {group.label}
                        <MdKeyboardArrowDown className="text-lg opacity-50 group-hover/nav:rotate-180 transition-transform duration-300" />

                        {/* Notification Dot on Parent */}
                        {group.hasBadge && (
                          <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-error ring-2 ring-white animate-pulse" />
                        )}
                      </button>

                      {/* Dropdown Card */}
                      <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 pointer-events-none group-hover/nav:opacity-100 group-hover/nav:translate-y-0 group-hover/nav:pointer-events-auto transition-all duration-300 z-50">
                        <div className="glass-card min-w-[220px] p-2 flex flex-col gap-1 border border-surface-200/50 shadow-2xl shadow-surface-900/10 rounded-2xl">
                          {group.links.map(link => (
                            <Link
                              key={link.path}
                              to={link.path}
                              className={`px-4 py-3 rounded-xl flex items-center justify-between transition-all duration-200 ${location.pathname === link.path
                                ? 'bg-primary text-white font-bold shadow-md shadow-primary/20'
                                : 'hover:bg-surface-50 text-surface-700 font-semibold hover:text-primary hover:pl-5'
                                }`}
                            >
                              <span className="text-[11px] uppercase tracking-wider">{link.name}</span>
                              {link.badge > 0 && (
                                <span className={`badge border-none font-bold text-[9px] h-5 min-w-[1.25rem] ${location.pathname === link.path ? 'bg-white text-primary' : 'bg-error text-white'
                                  }`}>
                                  {link.badge}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Right: User Profile Menu */}
            <div className="flex-1 flex justify-end gap-2">
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost p-1 pr-3 hover:bg-surface-100 rounded-2xl flex items-center gap-3 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-surface-800 to-surface-900 flex items-center justify-center text-white shadow-md">
                    <MdAccountCircle className="text-xl opacity-80" />
                  </div>
                  <div className="flex flex-col items-start hidden sm:flex">
                    <span className="text-xs font-bold text-surface-900 leading-none mb-0.5">{data?.userName || 'Staff User'}</span>
                    <span className={`text-[9px] uppercase tracking-widest font-black leading-none ${isAdmin ? 'text-primary' : 'text-surface-400'}`}>
                      {data?.role || 'Access'}
                    </span>
                  </div>
                  <MdKeyboardArrowDown className="text-surface-400 hidden sm:block" />
                </div>
                <ul tabIndex={0} className="mt-3 z-[1] p-2 glass-card menu menu-sm dropdown-content bg-white rounded-2xl w-56 border border-surface-200/50 shadow-2xl shadow-surface-900/10">
                  <div className="px-4 py-3 border-b border-surface-100 mb-2">
                    <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Signed in as</p>
                    <p className="text-sm font-bold text-surface-900 truncate">{data?.email || 'user@velankanni.com'}</p>
                  </div>
                  <li>
                    <button onClick={handleLogout} className="py-3 px-4 text-error hover:bg-error/10 hover:text-error rounded-xl font-bold transition-colors">
                      <MdLogout className="text-xl" /> Secure Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Drawer (Glassmorphism overlap) */}
      <div className={`fixed inset-0 z-[100] bg-surface-900/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setMobileMenuOpen(false)}>
        <div
          className={`absolute top-0 left-0 bottom-0 w-[280px] bg-white shadow-2xl transition-transform duration-400 ease-out flex flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          {/* Drawer Header */}
          <div className="h-20 border-b border-surface-100 flex items-center px-6 justify-between bg-surface-50">
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                <span className="text-xl font-black tracking-tighter">VB</span>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[15px] font-display font-black tracking-tight leading-none text-surface-900">
                  VB<span className="text-primary font-bold">OS</span> Mobile
                </span>
                <span className="text-[9px] font-bold text-surface-400 uppercase tracking-widest leading-none mt-1">
                  Menu Access
                </span>
              </div>
            </div>
          </div>

          {/* Drawer Links */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {navGroups.map((group, i) => (
              <div key={i} className="mb-4">
                <h4 className="text-[10px] font-black text-surface-400 uppercase tracking-widest mb-2 px-3 flex items-center gap-2">
                  {group.icon} {group.label}
                </h4>
                <ul className="flex flex-col gap-1">
                  {group.links.map((link) => {
                    const isActive = location.pathname === link.path
                    return (
                      <li key={link.path}>
                        <Link
                          to={link.path}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${isActive
                            ? 'bg-primary/10 text-primary font-bold'
                            : 'text-surface-700 font-semibold hover:bg-surface-50'
                            }`}
                        >
                          <span className="text-xs uppercase tracking-wider">{link.name}</span>
                          {link.badge > 0 && (
                            <span className="badge badge-error h-5 min-w-[1.25rem] text-[9px] font-bold text-white border-none">
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-surface-100 bg-surface-50">
            <button onClick={handleLogout} className="w-full btn btn-ghost text-error bg-error/10 hover:bg-error hover:text-white rounded-xl font-bold transition-all border-none">
              <MdLogout className="text-xl" /> Sign Out Device
            </button>
          </div>
        </div>
      </div>

      <div className="h-24"></div> {/* Spacer for fixed nav */}
    </>
  )
}

export default Nav