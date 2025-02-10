import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AxiosService from '../common/Axioservice'
import { toast } from 'react-toastify'

function EditUser() {
    let [data,setData] = useState([])
    let [inputdata,setInputData] = useState(false)

    let params =  useParams()
    let navigate = useNavigate()

    useEffect(()=>{getUSerData()},[data])
    const changeuserStatus =async (inputdata)=>{
        let id = params.id
        if(inputdata===true){
            let res = await AxiosService.put(`/auth/approval/${id}`,{status:'approved'})
            if(res.status==200 ){
                toast.success('Customer approved')
                navigate('/user')
            }
        }
        navigate('/user')
    }


    let getUSerData =async()=>{
        let id = params.id

        
        try {
            let res = await AxiosService.get(`/auth/getuserbyid/${id}`)
            if(res.status== 200){
                setData(res?.data?.user)
            }
            
        } catch (error) {
            toast.error('error occurs')
        }
    }
    
    
    return <>
         <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-80 text-center">
        <h2 className="text-xl font-semibold mb-4">Request</h2>
        <div className="">
            <p className=" text-2xl p-2">Name : {data?.userName}</p>
        </div>
        <div className="">
            <p className='text-2xl p-2'>Role: {data?.role}</p>
        </div>
        <div className="p-2 flex text-2xl items-center">
            {data?.status === "pending"?<><label className='label' htmlFor="status">Status : IS Accept</label><input type="checkbox" onChange={(e)=>setInputData(e.target.checked)} className='checkbox-success' name="status" id="status" /></>:<p>Approved</p>}
            
        </div>     
        
       
        
        <button className="w-full p-2 bg-green-500 text-white rounded hover:bg-blue-600" onClick={()=>changeuserStatus(inputdata)}>
          Approve
        </button>

      </div>
      
    </div>
    
    
    </>

}

export default EditUser