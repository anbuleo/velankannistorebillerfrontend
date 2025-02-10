import React from 'react'

function PrintBarCode({props}) {
    const {data,count,barImg,contentRef,name,mrp} = props

  return <>
          <div 
  className="flex p-4 border border-gray-800 rounded-lg  print:items-center print:max-h-screen print:overflow-hidden" 
  ref={contentRef}
>
  <div className="border border-gray-600 p-2 mx-2 text-center print:flex print:flex-col print:items-center print:break-inside-avoid">
    <img src={barImg} alt="Barcode" className="block mx-auto" />
    <p className="text-center text-xs">{name}</p>
    <p className="text-center text-xs">MRP: {mrp}</p>
  </div>
  <div className="border border-gray-600 p-2 mx-2 text-center print:flex print:flex-col print:items-center print:break-inside-avoid">
    <img src={barImg} alt="Barcode" className="block mx-auto" />
    <p className="text-center text-xs">{name}</p>
    <p className="text-center text-xs">MRP: {mrp}</p>
  </div>
</div>


  </>
}

export default PrintBarCode