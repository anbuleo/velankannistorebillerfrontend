import React,{useEffect, useRef, useState} from 'react'
import { useSelector } from 'react-redux'
import { Formik } from 'formik';
import * as Yup from 'yup'
import JsBarcode from 'jsbarcode';
import PrintBarCode from '../common/PrintBarCode';
import {useReactToPrint} from 'react-to-print'


function BarCodePrinter() {
  let [data,setData] = useState('')
  let [count,setCount] = useState('')
  let [barImg,setBarImg] = useState('')
  let [name,setName] = useState('')
  let [mrp,setMrp] = useState('')


  const printRef = useRef();

  

  const {product} = useSelector(state=>state.product)




  const barcodeRef = useRef(null);
   const contentRef =useRef(null);

  useEffect(()=>{},[barImg])
  const handleEstimatePrint = useReactToPrint({
      contentRef
    })


  const barcodeSchema = Yup.object().shape({
      customerId: Yup.string().required('Select Customer Name Required'),
      amount: Yup.number().required('Amount Required'),
      type: Yup.string().required('Select type of payment required'),
    });

  let initialValues = {
      productId:'',
      barcode:'',

  }
  // useEffect(() => {
  //   if (product && product.length > 0) {
  //     const barcodeData = product[0].productCode; // You can choose any product here or loop through them
  //     // Generate the barcode as soon as the component loads
  //     JsBarcode(barcodeRef.current, barcodeData, {
  //       format: "CODE128", // Barcode format
  //       lineColor: "#000", // Barcode line color
  //       width: 2, // Width of the bars
  //       height: 100, // Height of the barcode
  //       displayValue: true, // Display the barcode value below
  //        // Align the text (barcode value) below the barcode
  //     });
  //   }
  // }, [product]); 

  const handlePrint = (val)=>{
    console.log(data)
    // const barcodeData = val.productCode;
      JsBarcode(barcodeRef.current, data, {
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
  const handlechangecode = (val) =>{

    let fn = product?.filter((a,b)=>a.productCode == val)

    setName(fn[0].productName + fn[0].unitValue + fn[0].qantityType)
    setMrp(fn[0].MRP)
    console.log(name,fn)

    setData(val)


    const canvas = document.createElement("canvas");
    JsBarcode(canvas, val, {
      format: "CODE128",
      lineColor: "#000",
      width: 2,
      height: 50,
      displayValue: true,
      fontSize: 18,
      textAlign: "center",
    });

    const barcodeImage = canvas.toDataURL("image/png")
    setBarImg(barcodeImage)
  }

  // console.log(product)
  return <>
   
   <div className="w-full pt-20">
   <div className='printable '  >
        {/* This is the part that gets printed */}
        <div className="">
          
           
            
              <div className="w-1/2"><svg ref={barcodeRef} ></svg></div>
            
        </div>
        <div className="">
          
           
            
              <div className="w-1/2"><svg ref={barcodeRef} ></svg></div>
            
        </div>
        <div className="">
          
           
            
              <div className="w-1/2"><svg ref={barcodeRef} ></svg></div>
            
        </div>
        
        
        
      </div>
      <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-80 text-center">
        <h2 className="text-xl font-semibold mb-4">Select Options</h2>
        
        <select className="w-full p-2 border rounded mb-4" onChange={(s)=>handlechangecode(s.target.value)}>
          <option disabled value="">select One product</option>
         {product && product?.map((e,i)=>{
          
          return <option value={e.productCode}>{e.productName}{e.unitValue}{e.qantityType}</option>
         })}
        </select>
        
        <input 
          type="number" 
          className="w-full p-2 border rounded mb-4" 
          placeholder="Enter number"
          onChange={(s)=>setCount(s.target.value)}
        />
        
        <button className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={()=>handleEstimatePrint()}>
          Submit
        </button>

      </div>
      
    </div>
    <div className="">
    <PrintBarCode props={{data,count,barImg,contentRef,name,mrp}} />
    </div>
</div>
  </>
}

export default BarCodePrinter