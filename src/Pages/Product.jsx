import React, { useEffect, useMemo, useState } from 'react'
import Table from '../components/Table'
import { Link } from 'react-router-dom'
// import BarCodeContext from '../Context/BarCodeContext'
import GetAllProductHook from '../Hooks/GetAllProductHook'

import { useSelector } from 'react-redux'

function Product() {
  let {getUSer} = GetAllProductHook()
  let [data,setData] =useState([])
  
  const {product} = useSelector((state)=>state.product)
  
  const reloadPage = ()=>{
    try {
      getUSer()
      setData(product)
      // console.log("a")
    } catch (error) {
      console.log(error)
    }
  } 
  useEffect(()=>{ getUSer()},[])
  const handleDisplayProduct = (value)=>{
        try {
         
            // Create the data array here
            let filteredData = product.filter((a,b)=>a.productType === value)
           
          setData(filteredData)
          // displayProductValue(value)
        } catch (error) {
          console.log(error)
        }
  }
  return <>
  <div className=' h-auto pt-20 p-2 card w-full'>
  <div className="flex flex-col  border-opacity-50 card  ">
  <div className=" flex h-20  w-full   justify-between rounded-box place-items-center">
  <div className=" w-1/3"><select className="select select-success w-full max-w-xs " onChange={(e)=>handleDisplayProduct(e.target.value)}>
  <option disabled selected   className='bg-transparent'>Select by catagory</option>
  <option value={"Atta & Flour"}>Atta & Flour</option>
  <option value={"Dhall"}>Dhall</option>
  <option value={"Spieces"}>Spieces</option>
  <option value={"Vegetables"}>Vegetables</option>
  <option value={"plastics"}>plastics</option>
  <option value={"Beauty & Degredant"}>Beauty & Degredant</option>
  <option value={"Milk & batten"}>Milk & batten</option>
  <option value={"Grains & cattleFeeds"} >Grains & cattleFeeds</option>
  <option value={"Snacks"}> Snacks</option>
  <option value={"Tea & Beverages"}>Tea & Beverages</option>
  
</select></div>
    <div className="w-1/3 text-center">Add Product</div>
    
    <div className="btn btn-outline btn-success w-1/3 " ><Link to="/createproduct">Create Product</Link></div>
  </div>
 
  <div className=" w-full text-center  ">
  <i className="fa-solid fa-rotate-right text-2xl  text-black " onClick={()=>reloadPage()}></i>
  </div>
  <div className="  sm:w-auto   text-orange-300 rounded-box place-items-center">
    
    <Table data={data} />
    
  
  </div>
</div>
  </div>
  </>
}

export default Product