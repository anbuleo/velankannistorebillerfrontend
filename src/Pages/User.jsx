import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import AxiosService from '../common/Axioservice'
import { useNavigate } from 'react-router-dom'

function User() {

  let [userData, setUserData] = useState([])

useEffect(()=>{getUserAllUser()},[userData])

let navigate = useNavigate()



  let getUserAllUser = async()=>{
      let data = JSON.parse(localStorage.getItem('data'))
      
    try {
      if(!data || data.role !== 'admin') return
      let res = await AxiosService.get(`/auth/getalluser/${data._id}`)

      if(res.status == 200){
        setUserData(res.data?.user)
      }
    } catch (error) {
      console.log(error)
      toast.error('error in get user')
    }
  }
  const handleDeleteUser = async(id)=>{
    try {
      let res = await AxiosService.delete(`/auth/deleteuser/${id}`)
      // console.log(res,id)
      if(res.status == 200){
        let fil = userData?.filter((a,b)=>a._id != id)
        setUserData(fil)
        toast.success('Deleted success')
      }
    } catch (error) {
      toast.error('error occurs')
    }

  }


  return <>
          <div className="pt-20">
            <div className=""></div>
            <div className="">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Number</th>
                    <th>email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userData && userData?.map((e,i)=>{
                    return <tr key={i}>
                      <td>{e.userName}</td>
                      <td>{e.mobile}</td>
                      <td>{e.email}</td>
                      <td>{e.role}</td>
                      <td>{e.status}</td>
                      <td className='flex gap-4 cursor-pointer '><i className="fa-solid fa-pen-to-square text-green-400" onClick={()=>navigate(`/edituser/${e._id}`)}  ></i> <i className="fa-solid  fa-trash text-red-400" onClick={()=>handleDeleteUser(e._id)}></i></td>
                    </tr>
                  })}
                </tbody>
              </table>
            </div>
          </div>
  </>
}

export default User