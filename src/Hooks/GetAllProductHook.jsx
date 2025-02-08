// import { data } from 'autoprefixer'
import React, { useState } from 'react'
import AxiosService from '../common/Axioservice'
import {toast} from 'react-toastify'
import { addAllProduct } from '../common/ProductSlice'
import {addAllBills} from '../common/SaleCart'
import { useDispatch } from 'react-redux'
import {addAllCustomer} from '../common/CustomerSlice'
import { addAllBalanceSheet } from '../common/balanceSheet'

function GetAllProductHook() {
    let [product,setProduct] = useState(null)
    let [loading, setLoading] = useState(false)
    let dispatch = useDispatch()

    const getUSer = async()=>{
        setLoading(true)
        try {
            let res =await AxiosService.get('/product/getallproducts')
            let bill = await AxiosService.get('/saleprint/getallbill')
            let cus = await AxiosService.get('/customer/getallcustomer')
            let bal = await AxiosService.get('saleprint/getallbalancesheet')
            // let data = await res.json()
            // console.log(cus)
            if(res.status ===200){
                setProduct(res.data.product)
                // console.log(res.data.product)
                toast.success('Product Loaded success')
                let payload = res.data.product
                dispatch(addAllProduct(payload))
            }
            if(bill.status ===200){
                toast.success('bills ready')
                
                let payload = bill.data.bill
                // console.log(bill.data.bill)
                dispatch(addAllBills(payload))

            }else if(bill.status == 204){
                toast.success(bill?.data?.message)
            }
            if(cus.status ===200){
                toast.success('Customer Loaded')
                dispatch(addAllCustomer(cus.data.customer))
            }
            if(bal.status ===200){
                toast.success('BalanceSheet Loaded')
                dispatch(addAllBalanceSheet(bal.data.balanceSheet))
            }
        } catch (error) {
            console.log(error)
            toast.error('Error in geting Product')
        } finally{
            setLoading(false)
        }
       
       
        // console.log(res.data)
      }
      
  return {getUSer,product,loading}
}

export default GetAllProductHook