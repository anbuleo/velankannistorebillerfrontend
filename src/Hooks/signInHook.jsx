import { useState } from 'react'
import AxiosService from '../common/Axioservice';
import {useNavigate} from 'react-router-dom'
import {toast } from 'react-toastify'
import GetAllProductHook from '../Hooks/GetAllProductHook'
import {useSelector,useDispatch} from 'react-redux'
import  {addAllProduct} from '../common/ProductSlice'

const signInHook = () => {
    let [loading,setLoading] = useState(false);
    let [code,setCode] = useState('');
    let [message,setMessage] = useState('');
    let navigate = useNavigate()
    let dispatch = useDispatch()
    let [getProduct,SetProduct] = useState(null)

    let {getUSer,product} = GetAllProductHook()



    const signIn = async({email,password})=>{
        setLoading(true)
        try {
            let res = await AxiosService.post('/auth/signin',{email,password})
            
            if(res.status ===200){
              
                // console.log(res.data.rest)
                sessionStorage.setItem('token',res.data.token)
                localStorage.setItem('data',JSON.stringify(res.data.rest))
               
                setCode(res.status)
                getUSer()
                setMessage('login Sucess')
                toast.success('Login Success')
                navigate('/home')
                
            }
                
            
           

           
        } catch (error) {
            // setCode(error.response.data.statusCode)
            // setMessage(error.response.data.message)
                console.log(error)
        } finally {
            setLoading(false)
        }

    }

  return {loading,signIn,code,message,product}
}

export default signInHook