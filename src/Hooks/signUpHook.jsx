import  { useState } from 'react'
import AxiosService from '../common/Axioservice'

const signUpHook = () => {
  let [loading, setLoading] = useState(false);
  let [message,setMessage] = useState('')
  let [code,setCode] = useState('')

    let signUp = async({userName,email,mobile,password})=>{
        setLoading(true)
        try {
            let res = await AxiosService.post('/auth/signup',{userName,email,mobile,password})
          
            // let data = await res.json()
            // if(data.error) throw new Error(data.error)
            setCode(res.status)
            setMessage(res.data.message)
           
           
            
        } catch (error) {
            setCode(error.response.data.message)
            setMessage(error.response.data.message)
            console.log(error.response.data.message)
        }finally {
            setLoading(false)
            // console.log('hi')
        }
    }


    return {loading,signUp,code,message}

}

export default signUpHook