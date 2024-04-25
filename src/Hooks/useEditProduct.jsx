import React from 'react'
import { useState } from 'react'
import AxiosService from '../common/Axioservice'
import { useDispatch } from 'react-redux'
import { editProductRedux } from '../common/ProductSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function useEditProduct() {

    let [loading,setLoading] = useState(false)
    let dispatch = useDispatch()
    let navigate = useNavigate()
    const editProdduct = async(value,id) =>{
        setLoading(true)
        try {
            let res = await AxiosService.put(`/product/editproduct/${id}`,value)

            dispatch(editProductRedux(res.data))
            toast.success(`${res.data.productName} is updated`)
            navigate('/product')
            // console.log(res.data)
        } catch (error) {
            toast('error occur')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }



  return  {loading,editProdduct}
  
}

export default useEditProduct