import React, { useState } from 'react'
import AxiosService from '../common/Axioservice'
import { useDispatch } from 'react-redux'
import {addAllCustomer} from '../common/CustomerSlice'

function genrateBill() {
  

    let [billLoading,setBillLoading] = useState(false)
    let dispatch = useDispatch()
    
    
   const print = async(e)=>{
    try {
        setBillLoading(true)
        
        
    } catch (error) {
        
    }finally{
        setBillLoading(false)
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
  
  
    return {billLoading,getCustomer}
}

export default genrateBill