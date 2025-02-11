import React, { useState } from 'react'
import { toast } from 'react-toastify'
import AxiosService from '../common/Axioservice'
import { useDispatch } from 'react-redux'
import {deleteBillbyid, totalByCustomer} from '../common/SaleCart'

function SaleTableDataHook() {

    let [customerBill,setCustomerBill] = useState([])
    let dispatch = useDispatch()

    let getBillOfuser = async(id)=>{
        try {
            let res = await AxiosService.get(`/saleprint/getallbillbycutomerid/${id}`)
            if(res.status ===200){
                setCustomerBill(res.data.bill)
                dispatch(totalByCustomer(id))
            }else if(res.status !== 200){
                toast.warning(' No bill to this customer')
                setCustomerBill([])
            }
            
        } catch (error) {
            // console.log(error)
            toast.error(error?.data?.message)
        }
    }
    let handleDelete = async(id)=>{
        let datas = localStorage.getItem('data')
        let data = JSON.parse(datas)
        
        if(data.role !=='admin' ) return toast.warning('Admin only delete Sale bill')
        try {
            let res = await AxiosService.delete(`/saleprint/deletebyid/${id}`)
            if(res.status == 200){
                toast.success('Bill removed Success')
                dispatch(deleteBillbyid(id))
            }
        } catch (error) {
            toast.error(error?.data?.message)
        }

    }



  return {getBillOfuser,customerBill,handleDelete,setCustomerBill}
}

export default SaleTableDataHook