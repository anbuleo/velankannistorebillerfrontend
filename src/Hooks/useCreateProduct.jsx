import React, { useState } from 'react'
import AxiosService from '../common/Axioservice'
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addProduct } from '../common/ProductSlice'

function useCreateProduct() {
    let [loading,setLoading] = useState(false)
    let navigate = useNavigate()
    let dispatch = useDispatch()
   

    const createProduct = async (val)=>{
        setLoading(true)
        try {
            let res = await AxiosService.post('/product/create',val)

            // console.log(res)

            if(res.status ===201){
                toast.success(`${res.data.product.productName} created SuccessFully`)
                let payload = res.data.product
                dispatch(addProduct(payload))
                navigate('/product')
            }
            
        } catch (error) {
            toast.error('Error occurred')
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

   
     
  return {loading,createProduct}
}

export default useCreateProduct