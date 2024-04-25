import React, { useContext, useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {ProductBarCodeContext} from '../Context/BarCodeContext'
import AxiosService from '../common/Axioservice'
import { deleteProductRedux } from '../common/ProductSlice'
import { toast } from 'react-toastify'




function Table({data}) {
  // let {products} = useDisplayProductHook()
  // // let [tableData,setTableData] = useState([])
  // const {product} = useSelector((state)=>state.product)
  let navigate = useNavigate()
let dispatch = useDispatch()
// useEffect(()=>{console.log(products)},[products])
// console.log(products)

let product = data
  // console.log(product)
  // const AddBarCode = (eve,e)=>{
  //   eve.preventDefault()
    
  //   setBarCodeProduct(e)
  //   navigate('/addbarcode')
  // }

  const handleDeleteProduct  = async (id) =>{
    try {
      let res =await AxiosService.delete(`/product/deleteproduct/${id}`)
      // console.log(res.status)
      if(res.status === 200){
        let payload = id
      dispatch(deleteProductRedux(payload))
      toast.success(`${res.data.deletes.productName}  ${res.data.deletes.unitValue} ${res.data.deletes.qantityType} item Deleted!!`)
      }else {
        toast.warning('Try Again !')
      }

      
    } catch (error) {
      console.log(error)
      toast.error('Error Occurrs')
    }
  }

  // console.log(product)
  return <>
    <div className="">
  <table className="table static">
    {/* head */}
    <thead className='text-orange-200 text-xl'>
      <tr>
        <th></th>
        <th>Product</th>
        <th>Price</th>
        <th>Stock</th>
        <th>generateBarcode</th>
        <th>Edit</th>

      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
      {product && product.map((e,i)=>{
        return <tr className="" key={i}>
        <th>{i+1}</th>
        <td>{e.productName}</td>
        <td>{e.unitValue}{e.qantityType}={e.productPrice}₹</td>
        <td>{e.stockQuantity}</td>
        <td>{e.productCode}</td>
        <td className='flex gap-4 cursor-pointer '><i className="fa-solid fa-pen-to-square text-green-400"  onClick={()=>navigate(`/editproduct/${e._id}`)} ></i> <i className="fa-solid  fa-trash text-red-400" onClick={()=>handleDeleteProduct(e._id)}></i></td>
      </tr>
     
      
      })}
      
        
      
    </tbody>
  </table>
</div>
  </>
}

export default Table