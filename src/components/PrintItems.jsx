import React from 'react'
import QrCodeGen from './QrCodeGen'

/**
 * Senior Developer Ultra-Legible Thermal Receipt Component
 * Optimized for 80mm & 58mm Thermal Printers (e.g. TVS RP3200 Plus, Epson, Star Micronics)
 * Heavy extra-bold typography & enlarged font sizing for maximum thermal contrast.
 */
function PrintItems({ props }) {
  let { cart, totalPriceInCart, time, today, contentRef, customeronecart, appUserName, isOnline, isPickingSlip } = props

  return (
    <div 
      className="p-1 text-black bg-white select-none" 
      id='printpaper' 
      ref={contentRef}
      style={{ 
        width: '300px', // Standard 80mm browser rendering width
        margin: '0 auto',
        fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
        fontWeight: 900, // Extra Bold thermal contrast
        color: '#000000',
        WebkitFontSmoothing: 'antialiased'
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { 
            size: 80mm auto; 
            margin: 0; 
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 80mm !important;
            background: white !important;
            color: black !important;
            font-weight: 900 !important;
          }
          #printpaper { 
            width: 80mm !important; 
            margin: 0 !important;
            padding: 4px !important;
            font-weight: 900 !important;
          }
          * {
            font-weight: 900 !important;
            color: #000000 !important;
          }
        }
      ` }} />

      {/* Header Section */}
      <div className="text-center mb-2">
        <h2 className="text-xl font-extrabold leading-tight uppercase tracking-tight" style={{ fontWeight: 900 }}>
          {'வேளாங்கண்ணி ஸ்டோர்'}
        </h2>
        <p className="text-xs font-black uppercase mt-1 tracking-widest" style={{ fontWeight: 900 }}>
          upputhuraipalayam
        </p>
        <p className="text-xs font-black mt-1" style={{ fontWeight: 900 }}>
          ====================================
        </p>
      </div>

      {/* Customer & Timestamp Bar */}
      <div className="flex justify-between text-xs mb-2 px-1 font-extrabold" style={{ fontWeight: 900 }}>
        <div className="w-1/2">
          <p className="font-extrabold" style={{ fontWeight: 900 }}>CUST: {customeronecart?.name || 'CASH'}</p>
          {customeronecart?.mobile && <p className="text-xs font-extrabold" style={{ fontWeight: 900 }}>{customeronecart?.mobile}</p>}
        </div>
        <div className="w-1/2 text-right">
          <p className="font-extrabold" style={{ fontWeight: 900 }}>DATE: {today}</p>
          <p className="font-extrabold" style={{ fontWeight: 900 }}>TIME: {time}</p>
        </div>
      </div>

      {/* Item Table */}
      <div className="border-t-2 border-b-2 border-black py-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs font-extrabold border-b-2 border-black" style={{ fontWeight: 900 }}>
              <th className="py-1">விவரம்</th>
              <th className="text-center py-1">அளவு</th>
              {!isPickingSlip && <th className="text-right py-1">மொத்தம்</th>}
            </tr>
          </thead>
          <tbody>
            {cart?.length > 0 ? cart.map((e, i) => (
              <tr key={i} className="text-xs font-extrabold border-b border-gray-300 last:border-0" style={{ fontWeight: 900 }}>
                <td className="py-1.5 align-top">
                  <div className="uppercase">
                    <span className="inline-block max-w-[160px] truncate font-extrabold text-xs" style={{ fontWeight: 900 }} title={e.productName}>
                      {e.productName}
                    </span> 
                    <span className="text-[5px] font-extrabold block text-gray-800" style={{ fontWeight: 600 }}>
                      {e.productUnit} {e.qantityType}
                    </span>
                  </div>
                </td>
                <td className="text-center py-1.5 align-top font-extrabold text-xs" style={{ fontWeight: 900 }}>
                  {e.productQuantity}
                </td>
                {!isPickingSlip && (
                  <td className="text-right py-1.5 align-top font-extrabold text-sm" style={{ fontWeight: 900 }}>
                    ₹{Math.ceil(Number(e.productPrice * e.productQuantity))}
                  </td>
                )}
              </tr>
            )) : null}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      {!isPickingSlip && (
        <div className="mt-2 space-y-1 px-1 font-extrabold" style={{ fontWeight: 900 }}>
          <div className="flex justify-between text-xs font-extrabold border-b-2 border-dashed border-black pb-1.5" style={{ fontWeight: 900 }}>
            <span>TOTAL ITEMS:</span>
            <span className="text-sm font-extrabold" style={{ fontWeight: 900 }}>{cart?.length}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-extrabold pt-1.5" style={{ fontWeight: 900 }}>
            <span>GRAND TOTAL:</span>
            <span className="text-2xl font-extrabold tracking-tight" style={{ fontWeight: 900 }}>₹{totalPriceInCart}</span>
          </div>
        </div>
      )}

      {/* UPI QR Payment */}
      {isOnline && !isPickingSlip && (
        <div className="flex flex-col items-center mt-3 pt-2 border-t-2 border-dashed border-black">
          <p className="text-xs font-extrabold mb-1 tracking-widest" style={{ fontWeight: 900 }}>SCAN TO PAY (UPI)</p>
          <QrCodeGen 
            upiId="Q465857834@ybl" 
            name="velankanni store" 
            amount={totalPriceInCart} 
            size={110} // Scaled for high resolution scanning
          />
        </div>
      )}

      {/* Footer Remarks */}
      <div className="mt-4 text-center border-t-2 border-dashed border-black pt-3">
        {isPickingSlip ? (
          <div className="mt-4 pb-10">
            <p className="text-xs font-extrabold">========================</p>
            <p className="text-xs mt-1 uppercase font-extrabold" style={{ fontWeight: 900 }}>COLLECTOR SIGNATURE</p>
          </div>
        ) : (
          <>
            <p className="text-base font-extrabold mb-1" style={{ fontWeight: 900 }}>நன்றி மீண்டும் வருக !!</p>
            <p className="text-xs uppercase font-extrabold tracking-tight" style={{ fontWeight: 900 }}>Please check goods before leaving</p>
          </>
        )}
      </div>
      
      {/* Paper Cutter Margin */}
      <div className="h-14"></div>
    </div>
  )
}

export default PrintItems