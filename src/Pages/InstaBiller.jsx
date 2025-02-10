import { Formik } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector , useDispatch} from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {addProductToCart,removeProductFromCart,totalPrice,lessoneproduct,addProductOne,customizeProductPrice, addCustomerBillOne, deleCustomerBillOne, handleChangeInKGQty, resetCart} from '../common/CartSlice'
import * as Yup from 'yup';
import { HiBackspace } from "react-icons/hi2";
import { GrFormSubtract,GrFormAdd  } from "react-icons/gr";
import genrateBill from '../Hooks/genrateBill';
import {useReactToPrint} from 'react-to-print'
import PrintItems from '../components/PrintItems';
import { PDFDownloadLink } from '@react-pdf/renderer';
import BillPDF from '../components/BillPdf';
 

function InstaBiller(){
    let [customerSelect, setCustomerSelect] = useState('customer')
    let [paymentType,setPaymentType] = useState('cash')
    let [isOnline,setIsOnline] = useState(false)
    let [searchInput,setSearchInput] = useState('')
    const [time,setTime] = useState("")
    let appUserName = `${import.meta.env.VITE_APPUSER_NAME}`
    let [tableData,setTableData] = useState([])
    let [isAdmin,setIsAdmin] = useState(false)
    let {product} = useSelector((state)=>state.product)
    let {cart,totalPriceInCart,customeronecart} = useSelector((state)=>state.cart)
    // let [ customerBillAddress,setCustomerBillAddress] = useState(customeronecart)
// console.log(appUserName)
  let {customer} = useSelector((state)=>state.customer)
  const contentRef =useRef(null);


  let data = JSON.parse(localStorage?.getItem('data'))

  
  // let {totalPriceInCart} = useSelector((state)=>state.totalPriceInCart)
  let {getCustomer,createBill} = genrateBill()

    let dispatch = useDispatch()
    function formatAMPM(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    }
    // console.log(customeronecart)
    let  today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();

  today= dd + '/' + mm + '/' + yyyy
   
  useEffect(( )=>{ if(data && data.role !== 'admin'){
    setIsAdmin(true)
  }else{
    setIsAdmin(false)
  } },[tableData]) 

  
  // console.log(customer)
  const handleChangeQtyK = (id,qtys)=>{
    let qty = parseFloat(qtys)
    if(qty > 0 ){
      dispatch(handleChangeInKGQty({productId:id,qty:qtys}))
    }else {
      toast.warning('Qty should greater than 0.005 kg')
    }
  }
  const hamdleChangePaymentType = (e)=>{
    setPaymentType(e)
      if(e !== 'online'){
        
        setIsOnline(false)
        return
      }
      setIsOnline(true)
  }
  const handleChangePrice = async(id,price) => {
    try {
      let payload={
        productId:id,
        customPrice:price
      }
      dispatch(customizeProductPrice(payload))
    } catch (error) {
      toast.error('error occurs')
    }
  }
  console.log(cart)
  const addProductBilling = (data) => {
    // console.log(data)
    try {
      let payload = {
            productPrice: data.productPrice,
            productCode: data.productCode,
            productName: data.productName,
            productUnit: data.unitValue,
            productQuantity: 1,
            productTotal: Number(data.productPrice) * (data.productQuantity||1),
            productBarcode: data.productBarcode,
            qantityType:data.qantityType,
            productId: data._id,
            MRP:data.MRP,
            MinCost:data.productCost
      }
      dispatch(addProductToCart(payload))
     setTableData([])
      
    } catch (error) {
      toast.error('error occur')
    }
  }
//  console.log(cart)
  const handleChange =  (e)=>{
    
    let val = e
    // console.log(val)
    if(val.length <= 0){
      setTableData([])
      return
    }
    
    let code = product.filter((a,b)=>a.productCode===val)
    let barcode = product.filter((a,b)=>a.productBarcode ===val)
    // console.log(code)
    const regex = new RegExp(`^${val}`, "i")
    let filteredData = product.filter((a,b)=>{
      return regex.test(a.productName) ||  regex.test(a.tanglishName)
      // val && a && a.productName && .toLowerCase().includes(val)
  })
    
    if(code.length > 0){
      let isCode = code[0]
      let payload = {
        productPrice: isCode?.productPrice,
        productCode: isCode?.productCode,
        productName: isCode?.productName,
        productUnit: isCode?.unitValue,
        productQuantity: 1,
        productTotal: isCode?.productPrice * 1,
        productBarcode: isCode?.productBarcode,
        qantityType:isCode?.qantityType,
        productId: isCode?._id,
        MRP:isCode?.MRP,
        MinCost:isCode?.productCost
  }
  // console.log(code,'code')
 
    dispatch(addProductToCart(payload))
    setSearchInput('')
   
  return
    }else if(barcode.length >0){
      let payload = {
        productPrice: barcode.productPrice,
        productCode: barcodeproductCode,
        productName: barcodeproductName,
        productUnit: barcodeunitValue,
        productQuantity: 1,
        productTotal: barcodeproductPrice * 1,
        productBarcode: barcodeproductBarcode,
        qantityType:barcodeqantityType,
        productId: barcode._id,
        MRP:barcode?.MRP,
        MinCost:barcode?.productCost
  }
  dispatch(addProductToCart(payload))
  setSearchInput('')
  return
    } else {

      if(filteredData.length > 0){
        setTableData(filteredData)
       }
    
    }

  //  console.log(filteredData,product);
   
  }

  const handleChangeCustomer = async(e)=>{
    e.preventDefault()
    setCustomerSelect(e.target.value)
     getCustomer()
    if(e.target.value == 'customer'){
      dispatch(deleCustomerBillOne())
      // console.log(customeronecart)
      // setCustomerBillAddress('')
    }
  }
  const handleCustomerField = async(val)=>{
    let parsed = JSON.parse(val.target.value)
    // console.log(parsed)
    // cons
    dispatch(addCustomerBillOne(parsed))
    

  }
  const handleEstimatePrint = useReactToPrint({
    contentRef
  })
  
  return <>
  <div className="container mx-auto p-4">
  <div className=" flex p-4 ">
  <div className="h-4"> </div>

 </div>
 <div className="pt-5">
 <div className=""><h1 className="text-center uppercase text-2xl underline text-white">{appUserName}</h1></div>
   <div className="">
   {/* <div className="flex justify-between mb-4">
        <PDFDownloadLink document={<BillPDF cart={cart} totalPrice={totalPriceInCart} today={today} companyName={appUserName} />} fileName="bill.pdf">
          {({ loading }) => (loading ? "Loading..." : <button className="btn btn-primary">Download PDF</button>)}
        </PDFDownloadLink>
      </div> */}
   </div>
   <div className=""></div>
   
 </div>
 <div >
                <div className="flex justify-between">
                <div className="my-auto">
                    <select className='select w-full max-w-xs' onChange={handleChangeCustomer}>

                      <option  defaultValuevalue="customer" disabled>customer</option>
                      <option  value="customer">customer</option>
                      <option value="customerR">customer R</option>
                      
                    </select>
                   </div>
                   {customerSelect === 'customerR'?<div className="my-auto">
                    <select className=' select w-full max-w-xs' onChange={handleCustomerField}>
                      <option  disabled selected>Select Customer Name</option>
                      {customer?.length>0 && customer.map((e,i)=>{
                        return <option value={JSON.stringify(e)} key={i}  >{e.name}</option>
                      })}
                    </select>
                   </div>:""}
                   
                  <div className="">
                  <input type="text" placeholder='Add product BY NAME OR CODE'  className='input input-lg text-black w-full ' value={searchInput} onChange={(e)=>{setSearchInput(e.target.value); handleChange(e.target.value)}} />
                  </div>
                   <div className="my-auto">
                    <select className='select w-full max-w-xs' onChange={(e)=>hamdleChangePaymentType(e.target.value)}>
                      <option defaultValue={'cash'} value="">Cash</option>
                      <option value="credit" disabled={customerSelect==='customer'?true:false} >credit</option>
                      <option value="online">Online</option>
                    </select>
                   </div>
                   </div>
                  {tableData.length >0 &&  <div className="w-3/6 mx-auto  p-2   text-white  opacity-95 border border-zinc-950  rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 overflow-y-auto max-h-56 dark:border-gray-700 uppercase "> 
             {tableData.length >0 && tableData.map((e,i)=>{
            return <p className="bg-slate-950 hover:bg-slate-400 rounded-lg p-2"  key={i} onClick={()=>addProductBilling(e)} >
              {e.productName} {e.unitValue} {e.qantityType}
            </p>
            })}
              </div>} 
            </div>
           
    <div className="">
      <table className="table bg-white text-center max-h-3/4  table-zebra">
        <thead>
          <tr>
              <td>Item no</td>
              <td>product name</td>
              <td>MRP</td>
              <td>product per price</td>
              <td>product qty</td>
              <td>Amount</td>
              <td>Edit</td>
          </tr>
        </thead>
        {/* table body */}
        
        <tbody>
          {cart?.length > 0 ? cart.map((e,i)=><tr key={i} id={i}>
                <td className="">{i+1}</td>
                <td className="">{e.productName}  {e.productUnit } {e.qantityType}
                </td>
                <td>{e.MRP}</td>
                <td className=""><input defaultValue={e.productPrice} disabled={isAdmin} type='number' className='input    input-xs	 max-w-xs text-center bg-transparent' onChange={(s)=>handleChangePrice(e.productId,s.target.value)} /></td>
                {e.qantityType === "Kg"? (<td className="flex justify-center gap-3 items-center">
                <input type="number" placeholder='1.00'   step="any" defaultValue={e.productQuantity} onChange={(s)=>handleChangeQtyK(e.productId,s.target.value)}/></td>) :(<td className="flex justify-center gap-3 items-center">
              <GrFormSubtract className='hover:bg-slate-200 rounded cursor-pointer  ' onClick={()=>dispatch(lessoneproduct(e.productId))} /><div className="">{e.productQuantity}</div> <GrFormAdd className='hover:bg-slate-200 rounded cursor-pointer  ' onClick={()=>dispatch(addProductOne(e.productId))}/>
                  </td>)
                }
                <td className="">{Math.ceil(Number((e.productPrice)*(e.productQuantity)))}</td>
                <td className="mx-auto" onClick={()=>dispatch(removeProductFromCart(e.productId))}><HiBackspace /></td>
          </tr>):''}
          <tr>
           <td colSpan={4}>TOTAL</td>
           <td>{totalPriceInCart}</td>
           <td></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="flex justify-around p-4">
      <div className="btn" onClick={()=>createBill(paymentType,cart,totalPriceInCart,customeronecart)}>save</div>
      <div className="btn" onClick={()=>setTime(formatAMPM(new Date))}>
        <button className="btn" onClick={()=>document.getElementById('my_modal_3').showModal()}>Print Estimate</button>
<dialog id="my_modal_3" className="modal">
  <div className="modal-box">
    <form method="dialog">
      {/* if there is a button in form, it will close the modal */}
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
      <PrintItems props={{cart,totalPriceInCart,time,today,contentRef,customeronecart,appUserName,isOnline}} />
    
    <div className="">
      <p className="btn" onClick={()=>handleEstimatePrint()}>Print</p>
    </div>
            
  </div>
</dialog>
</div>
      <div className="btn" onClick={()=>{createBill(paymentType,cart,totalPriceInCart,customeronecart);handleEstimatePrint()}}>save & print</div>
      <div className="btn btn-error btn-outline" onClick={()=>dispatch(resetCart())}>delete</div>
    </div>
     
            
  </div>
  </>
}

export default InstaBiller