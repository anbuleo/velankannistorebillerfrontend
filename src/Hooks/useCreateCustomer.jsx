import React, { useState } from 'react'
import AxiosService from '../common/Axioservice'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function useCreateCustomer() {
    let [loading,setLoading] = useState(false)
    let navigate = useNavigate()

    const createCustomer = async(val)=>{
        setLoading(true)
        try {
            let res = await AxiosService.post('/customer/createcustomer',val)
            if(res.status ===201){
                toast.success(res.data.message)
                navigate('/customer')
                setLoading(false)
            }else {
                toast.warning('Try again later')
            }
        } catch (error) {
            toast.error('Error occur !!')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }



  return {loading,createCustomer}
  
}

export default useCreateCustomer