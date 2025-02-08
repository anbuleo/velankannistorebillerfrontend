import React, { useContext, useEffect, useState } from 'react'
import { Link ,useNavigate} from 'react-router-dom'
import {UserDataContext} from '../Context/AuthContext'
import { toast } from 'react-toastify'

function Nav() {
  let {data,setData} = useContext(UserDataContext)
  let navigate = useNavigate()
  
  return <>
  <div className="navbar bg-gradient-to-r from-slate-900 to-slate-700 fixed z-20">
  <div className="navbar-start">
  <div className="drawer ">
  <input id="my-drawer" type="checkbox" className="drawer-toggle" />
  <div className="drawer-content  ">
    {/* Page content here */}
    <label htmlFor="my-drawer" className="btn btn-square btn-ghost text-orange-200"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></label>
  </div> 
  <div className="drawer-side ">
    <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
    <ul className="menu p-4 w-70 min-h-full   gap-3 bg-gradient-to-r from-slate-900 to-slate-700  text-orange-200">
      {/* Sidebar content here */}
      <h1 className='text-center text-xl mb-20'>CB Store Assitant</h1>
      {data && data.role ==='admin' ?<><li className='liAside'><Link to={'/home'}>Home</Link></li>
      <li className='liAside'><Link to={'/product'}>Product</Link></li>
      <li className='liAside'><Link to={'/sale'}>Sales</Link></li>
      <li className='liAside'><Link to={'/customer'}>Customer BS</Link></li>
      <li className='liAside'><Link to={'/createbalancesheet'}>Customize BS</Link></li>
      <li className='liAside'><Link to={'/instabiller'}>InstaBiller</Link></li>
      <li className='liAside'><Link to={'/home'}>Biller</Link></li>
      <li className='liAside'><Link to={'/createcustomer'}>CreateCustomer</Link></li>
      <li className='liAside'><Link to={'/barcodeprint'}>BarcodePrint</Link></li><li className='btn btn-error  text-orange-200'><p onClick={()=>{
        sessionStorage.clear()
        localStorage.clear()
        navigate('/')
      }}>Sign Out</p></li></>:data.role ==='saleman'&& data.status=='approved'?<>
      <li className='liAside'><Link to={'/home'}>Home</Link></li>
      {/* <li className='liAside'><Link to={'/'}>Product</Link></li> */}
      <li className='liAside'><Link to={'/'}>Sales</Link></li>
      {/* <li className='liAside'><Link to={'/'}>Approval</Link></li> */}
      <li className='liAside'><Link to={'/'}>InstaBiller</Link></li>
      <li className='liAside'><Link to={'/'}>Biller</Link></li>
      <li className='liAside'><Link to={'/'}>CreateCustomer</Link></li>
      <li className='liAside'><Link to={'/'}>BarcodePrint</Link></li>
      <li className='btn btn-error  text-orange-200'><p onClick={()=>{
        sessionStorage.clear()
        localStorage.clear()
        toast.success('log out success')
        // /localStorage.removeItem('persist:root')
        navigate('/')
      }}>Sign Out</p></li>
      </>:<>
      <li>Wait for approval</li>
      </>}

      
    </ul>
  </div>
</div>
  </div>
  <div className="navbar-center">
    <a className="btn btn-ghost text-xl text-white  uppercase">Captian Biller</a>
  </div>
  <div className="navbar-end">
    <button className="btn btn-ghost btn-circle">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
    </button>
    <button className="btn btn-ghost btn-circle">
      <div className="indicator">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        <span className="badge badge-xs badge-primary indicator-item"></span>
      </div>
    </button>
  </div>
</div>

  </>
}

export default Nav



//nav code sinept

{/* <div className="navbar bg-base-100">
<div className="navbar-start">
  <div className="dropdown">
    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
    </div>
    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
      <li><a>Homepage</a></li>
      <li><a>Portfolio</a></li>
      <li><a>About</a></li>
    </ul>
  </div>
</div>
<div className="navbar-center">
  <a className="btn btn-ghost text-xl">daisyUI</a>
</div>
<div className="navbar-end">
  <button className="btn btn-ghost btn-circle">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
  </button>
  <button className="btn btn-ghost btn-circle">
    <div className="indicator">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
      <span className="badge badge-xs badge-primary indicator-item"></span>
    </div>
  </button>
</div>
</div> */}