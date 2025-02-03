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
  <div className=' h-screen pt-20 p-2 w-screen '>
  <div className="flex flex-col w-full border-opacity-50 ">
  <div className=" flex h-20 bg-gray-600   justify-around rounded-box place-items-center">
  <div className=""><select className="select select-success w-full max-w-xs " onChange={(e)=>handleDisplayProduct(e.target.value)}>
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
    <div className="">Add Product</div>
    
    <div className="btn btn-outline btn-success " ><Link to="/createproduct">Create Product</Link></div>
  </div>
  <div className="">OR</div>
  <div className=" mx-auto">
  <i className="fa-solid fa-rotate-right text-2xl  text-white " onClick={()=>reloadPage()}></i>
  </div>
  <div className="  h-auto  bg-gray-600  text-orange-300 rounded-box place-items-center">
    
    <Table data={data} />
    
  
  </div>
</div>
  </div>
  </>
}

export default Product