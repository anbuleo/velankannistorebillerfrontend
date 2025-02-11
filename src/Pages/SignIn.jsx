import { Formik } from 'formik'
import React, { useEffect } from 'react'
import { Link ,useNavigate} from 'react-router-dom';
import * as Yup from 'yup';
import signInHook from '../Hooks/signInHook';
import {toast} from 'react-toastify'


function SignIn() {
  let navigate = useNavigate()
 

  let {loading,signIn,code,message} = signInHook()
  
  const UserSchema = Yup.object().shape({
  
    
    email:Yup.string().email('* Invalid Email').required('* Required'),
  
    password:Yup.string().required('* Required')
  })

  const handleSubmitValues = async(values)=>{
    try {
      await signIn(values)
      
    } catch (error) {
      toast.error('Erorr ocured')
      console.log(error)
    }
  }
  return <>
  <div className="h-screen place-content-center w-screen ">
    <div className="w-full max-w-lg p-4  mx-auto  bg-slate-500 backdrop-blur-xl text-white  opacity-95 border border-zinc-950  rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 ">
        <div className="heading">
          <h1 className='text-center text-xl'>SignIn</h1>
        </div>
        <div className="form">
        <Formik
          initialValues={{
           
            email:"",
            password:"",
           
            

          }}
          validationSchema={UserSchema}
          onSubmit={(values)=>handleSubmitValues(values)}
        >
          {({ errors,touched,handleBlur,handleSubmit,handleChange})=>(
            <form onSubmit={handleSubmit} >
           
    
              
              
            
              <div className="">
                <label>Email</label>
                <input className='input input-bordered w-full text-black' type="email" name='email' placeholder="Enter email"  onBlur={handleBlur} onChange={handleChange}/>
                {errors.email && touched.email ? <div style={{color:"red"}}>{errors.email}</div>:null}
              </div>
    
              
    
              <div className="">
                <label>Password</label>
                <input className='input input-bordered w-full text-black' type="password" name='password' placeholder="Enter password" onBlur={handleBlur} onChange={handleChange}/>
                {errors.password && touched.password ? <div style={{color:"red"}}>{errors.password}</div>:null}
              </div>
    
              <button className='mt-4 btn btn-outline w-full bg-slate-200' type='submit'>
               {loading ? <span className="loading loading-dots loading-lg"></span>:'submit'}
              </button>
            </form>
          )}
        </Formik>
        </div>
        <div className="mt-4 text-sm text-right"><p>Doesn't have an account? <span className='cursor-pointer text-blue-700 text-xl'><Link to={'/signup'}>Sign Up</Link></span> </p></div>
    </div>
  </div>
  </>
}

export default SignIn