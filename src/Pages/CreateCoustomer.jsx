import { Formik } from 'formik'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup';
import useCreateCustomer from '../Hooks/useCreateCustomer';

function CreateCoustomer() {

  let {loading,createCustomer} = useCreateCustomer()
  let navigate = useNavigate()
  const customerSchema = Yup.object().shape({
    name : Yup.string().required('Customer Name Required'),
    mobile : Yup.string().required('Mobile Number Required').max(10,'maximum 10 digit').min(10,'Enter valid 10 digit'),
    address : Yup.string().required("Address required").min(5,'Minimum 3 characters')
  })
  const handleCreate = async (val) =>{
    try {
      // console.log(val)
      createCustomer(val)
    } catch (error) {
      console.log(error)
      toast.error('Error occur')
    }
  }
  return <div className='h-screen'>
           {loading ? <div className="place-content-center mx-auto"><span className="loading loading-bars loading-lg"></span></div>:<> <div className="  text-2xl bg-transparent backdrop-blur-xl text-orange-300   opacity-95 border border-zinc-950  rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
              <p className="text-center ">Create Customer </p>
              <p className="btn btn-info btn-outline float-right" onClick={()=>navigate('/home')}>{'<--- back'}</p>
            </div>
            <div className="divider divider-warning"></div>
            <div className="bg-transparent backdrop-blur-xl text-orange-300 w-2/4 mx-auto  opacity-95 border border-warning  rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
              <Formik
                  initialValues={{
                    name : "",
                    mobile:"",
                    address:"",

                  }}
                  onSubmit={(values)=>handleCreate(values)}
                  validationSchema={customerSchema}


              >
                {({errors,touched,handleBlur,handleSubmit,handleChange})=>(
                  <form onSubmit={handleSubmit}>
                    <div className="">
                <label>Name</label>
                <input className='input input-bordered w-full text-black' type="text" name='name' placeholder="(eg) liyon"  onBlur={handleBlur} onChange={handleChange}/>
                {errors.name && touched.name ? <div style={{color:"red"}}>{errors.name}</div>:null}
              </div>
              <div className="">
                <label>Mobile</label>
                <input className='input input-bordered w-full text-black' type="tel" name='mobile' placeholder="9876543210"  onBlur={handleBlur} onChange={handleChange}/>
                {errors.mobile && touched.mobile ? <div style={{color:"red"}}>{errors.mobile}</div>:null}
              </div>
              <div className="">
                <label > Address</label>
              <textarea className="textarea textarea-warning  w-full text-black" placeholder="Enter address" name='address'   onBlur={handleBlur} onChange={handleChange}></textarea>
                {errors.address && touched.address ? <div style={{color:"red"}}>{errors.address}</div>:null}
              </div>
                  <div className="btn btn-warning btn-outline w-full" onClick={handleSubmit}>Create</div>
                  </form>
                )}

              </Formik>
            </div></>}
  </div>
  
}

export default CreateCoustomer