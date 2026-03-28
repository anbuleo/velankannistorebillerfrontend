import React from 'react'
import QrCodeGen from './QrCodeGen'

/**
 * Senior Dev Optimized Receipt Component
 * Tailored for 80mm (3.15 inch) Thermal Printers (e.g., TVS RP3200 Plus)
 */
function PrintItems({ props }) {
  let { cart, totalPriceInCart, time, today, contentRef, customeronecart, appUserName, isOnline, isPickingSlip } = props

  return (
    <div 
      className="p-1 text-black bg-white" 
      id='printpaper' 
      ref={contentRef}
      style={{ 
        width: '300px', // Standard 80mm width in browser pixels
        margin: '0 auto',
        fontFamily: "'Courier New', Courier, monospace", // Traditional receipt look
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { size: 80mm auto; margin: 0; }
          body * { visibility: hidden; opacity: 0; }
          #printpaper, #printpaper * { visibility: visible; opacity: 1; }
          #printpaper { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 80mm !important; 
            display: block !important;
          }
        }
      ` }} />
      <div className="text-center mb-2">
        <h2 className="text-lg font-black leading-tight uppercase tamil-font">{ 'வேளாங்கண்ணி ஸ்டோர்'}</h2>
        <p className="text-[10px] lowercase italic opacity-80 mt-1">upputhuraipalayam</p>
        <p className="text-[10px] font-black mt-1">------------------------------------------</p>
      </div>

      <div className="flex justify-between text-[11px] mb-2 px-1">
        <div className="w-1/2">
          <p className="font-black">CUST: {customeronecart?.name || 'CASH'}</p>
          <p className="text-[9px] font-black">{customeronecart?.mobile}</p>
        </div>
        <div className="w-1/2 text-right">
          <p className="font-black">DATE: {today}</p>
          <p className="font-black">TIME: {time}</p>
        </div>
      </div>

      <div className="border-t border-b border-black py-1">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[11px] font-black border-b border-black tamil-font">
              <th className="py-1">விவரம்</th>
              <th className="text-center py-1">அளவு</th>
              {!isPickingSlip && <th className="text-right py-1">மொத்தம்</th>}
            </tr>
          </thead>
          <tbody>
            {cart?.length > 0 ? cart.map((e, i) => (
              <tr key={i} className="text-[11px] font-black">
                <td className="py-1 align-top">
                  <div className="uppercase">
                    <span className="inline-block max-w-[170px] truncate align-middle font-black" title={e.productName}>{e.productName}</span> 
                    <span className="text-[9px] lowercase font-black align-middle ml-1">({e.productUnit} {e.qantityType})</span>
                  </div>
                </td>
                <td className="text-center py-1 align-top">
                  {e.productQuantity}
                </td>
                {!isPickingSlip && (
                  <td className="text-right py-1 align-top">
                    {Math.ceil(Number(e.productPrice * e.productQuantity))}
                  </td>
                )}
              </tr>
            )) : null}
          </tbody>
        </table>
      </div>

      {!isPickingSlip && (
        <div className="mt-2 space-y-1 px-1">
          <div className="flex justify-between text-xs font-black border-b border-dashed border-black pb-1">
            <span>TOTAL ITEMS:</span>
            <span>{cart?.length}</span>
          </div>
          <div className="flex justify-between text-base font-black pt-1">
            <span>GRAND TOTAL:</span>
            <span className="text-lg">₹{totalPriceInCart}</span>
          </div>
        </div>
      )}

      {isOnline && !isPickingSlip && (
        <div className="flex flex-col items-center mt-3 pt-2 border-t border-dashed border-black">
          <p className="text-[9px] font-black mb-1">SCAN TO PAY (UPI)</p>
          <QrCodeGen 
            upiId="Q465857834@ybl" 
            name="velankanni store" 
            amount={totalPriceInCart} 
            size={100} // Optimized for thermal scannability
          />
        </div>
      )}

      <div className="mt-6 text-center border-t border-dashed border-black pt-3">
        {isPickingSlip ? (
          <div className="mt-4 pb-10">
            <p className="text-[10px] font-bold">--------------------------------</p>
            <p className="text-[10px] mt-1 uppercase">COLLECTOR SIGNATURE</p>
          </div>
        ) : (
          <>
            <p className="text-sm font-black tamil-font mb-1">நன்றி மீண்டும் வருக !!</p>
            <p className="text-[10px] uppercase font-black tracking-tighter">Please check goods before leaving</p>
          </>
        )}
      </div>
      
      {/* Paper Cutter Margin */}
      <div className="h-12"></div>
    </div>
  )
}

export default PrintItems