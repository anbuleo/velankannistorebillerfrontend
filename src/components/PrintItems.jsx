import React from 'react'
import QrCodeGen from './QrCodeGen'

function PrintItems({props}) {
    let {cart,totalPriceInCart,time,today,contentRef,customeronecart,appUserName,isOnline} = props
    
  
  return   <div className=" p-2" id='printpaper' ref={contentRef} >
    <center className="mx-auto">
    <h3 className="font-bold text-lg text-center" >Estimate</h3>
      <p className='underline'>{appUserName}</p>
      <p >contact: 9095774352 | upputhuraipalayam</p>
    </center>
    <hr className="border-t border-black my-2" />
    <div className="mt-2 flex justify-between ">
      <div className='w-2/4 text-left'><p className='text-sm'>customer : {customeronecart?.name}</p>
      <p className='text-sm'>{customeronecart?.address}</p>
      </div>
      <div className='w-2/4 text-left text-sm'><p>Time : {time}</p>Date: {today}</div>
    </div>
    <hr className="border-t border-black my-2" />
    <div className=" mx-auto">
      <table className="w-full border-collapse">
        <thead className=''>
          <tr className='border-b border-black font-bold'>
            <th className='text-extrabold'><b>Qty</b></th>
            <th><strong>Name</strong></th>
            <th><strong>Mrp</strong></th>
            <th><strong>our rate</strong></th>
          
            <th className='text-right'><b>Amount</b></th>
          </tr>
        </thead>
        <tbody>
        {cart?.length > 0 ? cart.map((e,i)=><tr key={i} className="border-b border-gray-400">
        <td className="text-center text-xs">{e.productQuantity}</td>
                  <td className="text-left text-xs">{e.productName} {e.productUnit} {e.qantityType} </td>
                  <td className=" text-xs text-right">{e.MRP} </td>
                  <td className=" text-xs text-right">{e.productPrice} </td>
                  
                 
                  <td className="text-right text-xs"><b>{Math.ceil(Number((e.productPrice)*(e.productQuantity)))}</b></td>
                </tr>
        
        ):''}
          <tr>
            <td className="text-xs text-left" colSpan={2}>
             Total Items : {cart?.length}
            </td>
           
           
           <td colSpan={2} className='text-center' ><b>TOTAL</b></td>
           <td className='text-right'><b>{totalPriceInCart}</b></td>
          
          
          </tr>

        </tbody>
      </table>
      <hr className="border-t border-black my-2" />
      {isOnline &&<div className=""> <QrCodeGen upiId="Q465857834@ybl" name="velankanni store"  className=''  amount={totalPriceInCart}/></div>}
      <div className="">
        <h1 className='text-center'>{'நன்றி மீண்டும் வருக !! '}</h1>
      </div>
    </div>
    </div>
  
}

export default PrintItems