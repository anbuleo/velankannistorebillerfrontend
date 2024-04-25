import { Formik } from 'formik'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import signUpHook from '../Hooks/signUpHook';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify'

function SignUp() {
  let {loading,signUp,code,message} = signUpHook()
  useEffect(()=>{

  },[code])
  let navigate = useNavigate()
  const UserSchema = Yup.object().shape({
  
    userName:Yup.string().required('* Required').min(3,'* User Name should be atlest 3 characters'),
    email:Yup.string().email('* Invalid Email').required('* Required'),
    mobile:Yup.string().matches(/^\d{10}$/,'* Invalid Mobile Number').required('* Required'),
    password:Yup.string().required('* Required')
  })

  let handleSubmitValues = async(values)=>{
    try {
      await signUp(values)
      if(Number(code)==201){
        toast.success('User create Success')
        navigate('/')
      }else{
        toast.warning(message?message:'change userName')
      }
    
    } catch (error) {
      toast.error(message)
      console.log(error)
    }
  }
  return <>
  <div className="h-screen place-content-center w-screen ">
    <div className="w-full max-w-lg p-4 mx-auto bg-transparent backdrop-blur-xl text-white  opacity-95 border border-zinc-950  rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 ">
        <div className="heading">
          <h1 className='text-center text-xl'>SignUp</h1>
        </div>
        <div className="form">
        <Formik
          initialValues={{
            userName:"",
            email:"",
            password:"",
            mobile:"",
            

          }}
          validationSchema={UserSchema}
          onSubmit={(values)=>handleSubmitValues(values)}
        >
          {({ errors,touched,handleBlur,handleSubmit,handleChange})=>(
            <form onSubmit={handleSubmit} >
            <div className="">
                <label>Name</label><br />
                <input type='text' className="input input-bordered w-full text-black" name='userName' placeholder="John" onBlur={handleBlur} onChange={handleChange}/>
                {errors.userName && touched.userName ? <div style={{color:"red"}}>{errors.userName}</div>:null}
              </div>
    
              
              
            
              <div className="">
                <label>Email</label>
                <input className='input input-bordered w-full text-black' type="email" name='email' placeholder="Enter email"  onBlur={handleBlur} onChange={handleChange}/>
                {errors.email && touched.email ? <div style={{color:"red"}}>{errors.email}</div>:null}
              </div>
    
              <div className="">
                <label>Mobile</label>
                <input className='input input-bordered w-full text-black' type="text" name='mobile' placeholder="Enter Mobile" onBlur={handleBlur} onChange={handleChange}/>
                {errors.mobile && touched.mobile ? <div style={{color:"red"}}>{errors.mobile}</div>:null}
              </div>
    
              <div className="">
                <label>Password</label>
                <input className='input input-bordered w-full text-black' type="password" name='password' placeholder="Enter password" onBlur={handleBlur} onChange={handleChange}/>
                {errors.password && touched.password ? <div style={{color:"red"}}>{errors.password}</div>:null}
              </div>
    
              <button className='mt-4 btn btn-outline w-full bg-slate-600' type='submit'>
                {loading?<span className="loading loading-dots loading-lg"></span>:'Submit'}
              </button>
            </form>
          )}
        </Formik>
        </div>
        <div className="mt-4 text-sm text-right"><p>Already have an account? <span className='cursor-pointer text-blue-700 text-xl'><Link to={'/'}>Sign in</Link></span> </p></div>
    </div>
  </div>
  </>
}

export default SignUp