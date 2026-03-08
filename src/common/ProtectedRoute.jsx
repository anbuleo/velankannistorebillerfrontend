// import { Children } from 'react'
import { Navigate } from 'react-router-dom'
import Pending from '../Pages/Pending'

function ProtectedRoute({ children }) {

  const token = localStorage.getItem('token')
  let datas = localStorage.getItem('data')
  let data = datas ? JSON.parse(datas) : null
  let con1 = data?.status === 'approved'

  if (!token) {
    localStorage.clear()
    return <Navigate to='/login' />
  }
  return con1 ? children : <Pending />
}

export default ProtectedRoute