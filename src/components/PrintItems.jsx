import React from 'react'
import QrCodeGen from './QrCodeGen'

function PrintItems({props}) {
    let {cart,totalPriceInCart,time,today,contentRef,customeronecart,appUserName,isOnline} = props
    
  
  return   <div className=" px-2" id='printpaper' ref={contentRef} >
    <center className="mx-auto">
    <h3 className="font-bold text-xs text-center mt-0" >Estimate</h3>
      <p className='underline mt-0'>{appUserName}</p>
      <p className="font-bold text-xs text-center mt-0" > upputhuraipalayam</p>
    </center>
    <hr className="border-t border-black " />
    <div className=" flex justify-between ">
      <div className='w-2/4 text-left'><p className='text-xs'>customer : {customeronecart?.name || 'customer'}</p>
      <p className='text-xs'>{customeronecart?.address}</p>
      </div>
      <div className='w-2/4 text-left text-xs'><p>Time : {time}</p>Date: {today}</div>
    </div>
    <hr className="border-t border-black " />
    <div className=" mx-auto mt-0 ">
      <table className="w-full border-collapse mt-0">
        <thead className='mt-0'>
          <tr className='border-b mt-0 border-black font-bold'>
            <th className='text-extrabold'><b>Qty</b></th>
            <th><strong>Name</strong></th>
            {/* <th><strong>Mrp</strong></th> */}
            <th><strong>Rate</strong></th>
          
            <th className='text-right'><b>Amount</b></th>
          </tr>
        </thead>
        <tbody>
        {cart?.length > 0 ? cart.map((e,i)=><tr key={i} className="border-b border-gray-800">
        <td className="text-center text-xs">{e.productQuantity}</td>
                  <td className="text-left text-xs ">{e.productName}&#8203;{e.productUnit} {e.qantityType} {e.MRP}</td>
                  {/* <td className=" text-xs text-right">{e.MRP} </td> */}
                  <td className=" text-xs text-right">{e.productPrice} </td>
                  
                 
                  <td className="text-right text-xs"><b>{Math.ceil(Number((e.productPrice)*(e.productQuantity)))}</b></td>
                </tr>
        
        ):''}
          <tr>
            <td className="text-xs text-left" colSpan={2}>
             Total Items : {cart?.length}
            </td>
           
           
           <td colSpan={1} className='text-center' ><b>TOTAL</b></td>
           <td className='text-right'><b>{totalPriceInCart}</b></td>
          
          
          </tr>

        </tbody>
      </table>
      <hr className="border-t border-black " />
      {isOnline &&<div className=""> <QrCodeGen upiId="Q465857834@ybl" name="velankanni store"  className=''  amount={totalPriceInCart}/></div>}
      <div className="">
        <h1 className='text-center'>{'நன்றி மீண்டும் வருக !! '}</h1>
      </div>
    </div>
    </div>
  
}

export default PrintItems