import React, { useContext, useEffect } from 'react'
import { UserDataContext } from '../Context/AuthContext'
import Pending from './Pending'
import GetAllProductHook from '../Hooks/GetAllProductHook'
import {useSelector,useDispatch} from 'react-redux'
import  {addAllProduct} from '../common/ProductSlice'
import signInHook from '../Hooks/signInHook'

function Home() {
  let {data,setData} = useContext(UserDataContext)
  let dispatch = useDispatch()
  // let {product} = signInHook()

  
    // let {loading,getUSer,product} = GetAllProductHook()

  // useEffect(()=>{
  //   getUSer()
    
  // },[])
  
  
  // dispatch(addAllProduct(product))
  // if(product?.length >0 ){
    
  //       let payload = product
  //       dispatch(addAllProduct(payload))
  //       // console.log(product)
      
      
    
  // }
  


  // console.log(data)
  return <>
  {data && data.status == 'pending' ? <>
  <Pending data={data}/>
  </>:<><div className="h-screen place-content-center w-screen ">
    <div className=" text-orange-300 mx-auto shadow-xl   mt-5 bg-gradient-to-r from-slate-900 to-slate-700 rounded-lg  max-w-md "> 
    <div className="card-body text-center text-2xl">
      <p>Welcome <span className='text-orange-800 text-4xl uppercase'>{data?.userName}</span></p>
    </div>
    <div className="card-body  text-2xl">
      <p><strong>Captian <span className='text-orange-800'> Biller</span> </strong>app is a  Fastest billing software for 'Retail' and 'WholeSale' shops some  best features  </p>
      <ol className='list-disc px-5'>
        <li>UserFriendly</li>
        <li>Faster</li>
        <li>Multi User</li>
        <li>Customer Database</li>
        <li>Sales Record</li>
        <li>Parent controll</li>
      </ol>
    </div>
    </div>
    </div></>}
  </>
}

export default Home