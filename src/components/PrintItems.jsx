import React from 'react'
import QrCodeGen from './QrCodeGen'

function PrintItems({ props }) {
  let { cart, totalPriceInCart, time, today, contentRef, customeronecart, appUserName, isOnline, isPickingSlip } = props


  return <div className=" px-2" id='printpaper' ref={contentRef} >
    <center className="mx-auto">
      <h3 className="font-bold text-xs text-center mt-0" >{isPickingSlip ? 'Picking Slip' : 'Estimate'}</h3>
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
            <th><strong>Name</strong></th>
            <th className='text-extrabold'><b>Qty</b></th>
            {!isPickingSlip && <th><strong>Rate</strong></th>}
            {!isPickingSlip && <th className='text-right'><b>Amount</b></th>}
          </tr>
        </thead>
        <tbody>
          {cart?.length > 0 ? cart.map((e, i) => <tr key={i} className="border-b border-gray-800">
            <td className="text-left py-2 font-medium">
              <p className="text-xs font-bold leading-tight uppercase">{e.productName}</p>
              <p className="text-[10px] text-surface-500 font-extrabold uppercase mt-0.5">
                Unit: {e.productUnit} {e.qantityType}
              </p>
            </td>
            <td className="text-center text-xs">{e.productQuantity}</td>
            {!isPickingSlip && <td className=" text-xs text-right">{e.productPrice} </td>}
            {!isPickingSlip && <td className="text-right text-xs"><b>{Math.ceil(Number((e.productPrice) * (e.productQuantity)))}</b></td>}
          </tr>

          ) : ''}
          {!isPickingSlip && <tr>
            <td className="text-xs text-left" colSpan={2}>
              Total Items : {cart?.length}
            </td>
            <td colSpan={1} className='text-center' ><b>TOTAL</b></td>
            <td className='text-right'><b>{totalPriceInCart}</b></td>
          </tr>}
          {isPickingSlip && <tr>
            <td className="text-xs text-left font-bold pt-2" colSpan={2}>
              Total Items : {cart?.length}
            </td>
          </tr>}
        </tbody>
      </table>
      {!isPickingSlip && <hr className="border-t border-black " />}
      {isOnline && !isPickingSlip && <div className=""> <QrCodeGen upiId="Q465857834@ybl" name="velankanni store" amount={totalPriceInCart} /></div>}
      <div className="mt-4 border-t border-dashed border-black pt-2">
        <h1 className='text-center text-[10px]'>{isPickingSlip ? 'Collector Signature: ________________' : 'நன்றி மீண்டும் வருக !!'}</h1>
      </div>
    </div>
  </div>

}

export default PrintItems