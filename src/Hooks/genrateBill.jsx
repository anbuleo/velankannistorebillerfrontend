import React, { useState } from 'react'
import AxiosService from '../common/Axioservice'
import { useDispatch } from 'react-redux'
import {addAllCustomer} from '../common/CustomerSlice'
import {resetCart} from '../common/CartSlice'
import { toast } from 'react-toastify'
import axios from 'axios'
import  {useNavigate} from 'react-router-dom'

function genrateBill() {
  

    let [billLoading,setBillLoading] = useState(false)
    let dispatch = useDispatch()
    let navigate = useNavigate()
    
    
   const createBill = async(paymentType,cart,totalPriceInCart,customeronecart)=>{
            // console.log(paymentType,cart,totalPriceInCart,customeronecart)
            try{
                let val = {
                    customerName:customeronecart?.name || 'customer',
                    customerId :customeronecart?._id || null,
                    customerMobile:customeronecart?.mobile || null,
                    totalAmount:totalPriceInCart,
                    paidAmount:paymentType==='cash'?totalPriceInCart:paymentType==='credit' ? 0 :totalPriceInCart,
                    dueAmount:paymentType==='cash'?0:paymentType==='credit' ? totalPriceInCart :0,
                    createBy: localStorage.getItem('data')._id || '',
                    paymentType:paymentType,
                    products:cart


                }

                let res = await AxiosService.post('/saleprint/printbill',val)
                // console.log(res)
                if(res.status == 201){
                    dispatch(resetCart())
                    navigate('/product')
                }
            }catch(error){
                console.log(error)
            }
    
   }
  const getCustomer = async()=>{
    try {
        let res = await AxiosService.get('/customer/getallcustomer')
        // console.log(res.data)

        if(res.status == 200){
            dispatch(addAllCustomer(res.data?.customer))
        }
    } catch (error) {
        toast.error('error occurs c')

    }
  }
  
  
    return {billLoading,getCustomer,createBill}
}

export default genrateBill