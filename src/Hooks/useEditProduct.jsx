import React from 'react'
import { useState } from 'react'
import AxiosService from '../common/Axioservice'
import { useDispatch } from 'react-redux'
import { editProductRedux } from '../common/ProductSlice'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function useEditProduct() {

    let [loading, setLoading] = useState(false)
    let dispatch = useDispatch()
    let navigate = useNavigate()
    const editProduct = async (id, value) => {
        setLoading(true)
        try {
            let res = await AxiosService.put(`/product/editproduct/${id}`, value)

            const updatedProduct = res.data.product || res.data;
            dispatch(editProductRedux(updatedProduct))
            toast.success(`${updatedProduct.productName} is updated successfully`)
            return res;
        } catch (error) {
            toast.error('Error occurred during product update')
            console.error(error)
            return null;
        } finally {
            setLoading(false)
        }
    }



    return { loading, editProduct }

}

export default useEditProduct