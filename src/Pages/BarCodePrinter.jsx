import React,{useEffect, useRef, useState} from 'react'
import { useSelector } from 'react-redux'
import { Formik } from 'formik';
import * as Yup from 'yup'
import JsBarcode from 'jsbarcode';
function BarCodePrinter() {
  let [data,setData] = useState([])



  const {product} = useSelector(state=>state.product)




    let setBarcode = ()=>{
      product?.map((e)=>setData((pre)=>[...pre,]))
    }
  const barcodeRef = useRef(null);


  const barcodeSchema = Yup.object().shape({
      customerId: Yup.string().required('Select Customer Name Required'),
      amount: Yup.number().required('Amount Required'),
      type: Yup.string().required('Select type of payment required'),
    });

  let initialValues = {
      productId:'',
      barcode:'',

  }
  useEffect(() => {
    if (product && product.length > 0) {
      const barcodeData = product[0].productCode; // You can choose any product here or loop through them
      // Generate the barcode as soon as the component loads
      JsBarcode(barcodeRef.current, barcodeData, {
        format: "CODE128", // Barcode format
        lineColor: "#000", // Barcode line color
        width: 2, // Width of the bars
        height: 100, // Height of the barcode
        displayValue: true, // Display the barcode value below
        fontSize: 18, // Font size for the barcode value
        textAlign: "center", // Align the text (barcode value) below the barcode
      });
    }
  }, [product]); 

  const handlePrint = (val)=>{
    
    const barcodeData = val.productCode;
      JsBarcode(barcodeRef.current, barcodeData, {
        format: "CODE128", // Barcode format (can be CODE39, EAN13, etc.)
        lineColor: "#000", // Barcode line color
        width: 2, // Width of the bars
        height: 100, // Height of the barcode
        displayValue: true, // Don't display the barcode value below
        fontSize: 18, // Font size for the barcode value
      textAlign: "center", // Align the text (barcode value) below the barcode
      });

       setTimeout(() => {
      window.print();
    }, 500);

   
  }

  // console.log(product)
  return <>
   <div className="w-full pt-20">
   <div className='printable'  >
        {/* This is the part that gets printed */}
        <svg ref={barcodeRef} viewBox="0 0 200 100"></svg>
      </div>
  <table className="table  table-zebra  ">
    {/* head */}
    <thead className='text-orange-200 text-xl bg-slate-400'>
      <tr>
        <th></th>
        <th>Product</th>
        <th>Price</th>
        
        <th>barcode</th>
       
        <th>Edit</th>

      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
      {product && product?.map((e,i)=>{
        return <tr className="" key={i}>
        <th>{i+1}</th>
        <td>{e.productName}</td>
        <td>{e.unitValue}{e.qantityType}={e.productPrice}₹</td>
        
        <td>{e.productCode}</td>
        

       
        <td className='btn btn-outline btn-success' onClick={()=>handlePrint(e)}>PrintBar Code</td>
      </tr>
     
      
      })}
      
      
        
      
    </tbody>
  </table>
</div>
  </>
}

export default BarCodePrinter