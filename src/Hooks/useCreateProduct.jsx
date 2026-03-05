import React, { useState } from 'react'
import AxiosService from '../common/Axioservice'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addProduct } from '../common/ProductSlice'

function useCreateProduct() {
    let [loading, setLoading] = useState(false)
    let navigate = useNavigate()
    let dispatch = useDispatch()


    const createProduct = async (val) => {
        setLoading(true)
        try {
            let res = await AxiosService.post('/product/create', val)

            if (res.status === 201) {
                toast.success(`${res.data.product.productName} created Successfully`)
                let payload = res.data.product
                dispatch(addProduct(payload))
                return res; // Return the response to the caller
            }
            return res;
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error occurred during product creation';
            toast.error(errorMsg);
            console.error(error);
            return null;
        } finally {
            setLoading(false)
        }
    }



    return { loading, createProduct }
}

export default useCreateProduct