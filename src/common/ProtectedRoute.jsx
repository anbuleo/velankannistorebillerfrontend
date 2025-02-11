// import { Children } from 'react'
import {Navigate} from 'react-router-dom'
import Pending from '../Pages/Pending'

function ProtectedRoute({children}) {

    const token = sessionStorage.getItem('token')
    let datas = localStorage.getItem('data')
    let data = JSON.parse(datas)
   let con1 = data.status == 'approved'

    if(!token){
        sessionStorage.clear()
        localStorage.clear()
    }
  return token ? con1? children :<Pending />: <Navigate to='/' />
}

export default ProtectedRoute