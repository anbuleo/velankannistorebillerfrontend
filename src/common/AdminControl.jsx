import React from 'react'
import {Navigate} from 'react-router-dom'
import { toast } from 'react-toastify'
import Pending from '../Pages/Pending'
function AdminControl({children}) {
    let datas = localStorage.getItem('data')
     let data = JSON.parse(datas)
    let con1 = data.status == 'approved'
    let condition = data.role == 'admin'
    console.log(data)
    if(!condition) {
        toast.warning('Admin only')
    }

  return con1 ? condition ? children  : <Navigate to='/home' /> : <Pending />
}

export default AdminControl