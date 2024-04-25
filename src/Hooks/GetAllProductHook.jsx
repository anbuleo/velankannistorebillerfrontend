// import { data } from 'autoprefixer'
import React, { useState } from 'react'
import AxiosService from '../common/Axioservice'
import {toast} from 'react-toastify'
import { addAllProduct } from '../common/ProductSlice'
import { useDispatch } from 'react-redux'

function GetAllProductHook() {
    let [product,setProduct] = useState(null)
    let [loading, setLoading] = useState(false)
    let dispatch = useDispatch()

    const getUSer = async()=>{
        setLoading(true)
        try {
            let res =await AxiosService.get('/product/getallproducts')
            // let data = await res.json()
            // console.log(res.data.product)
            if(res.status ===200){
                setProduct(res.data.product)
                // console.log(res.data.product)
                toast.success('Product Loaded success')
                let payload = res.data.product
                dispatch(addAllProduct(payload))
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