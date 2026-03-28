import React from 'react'

function PrintBarCode({ props }) {
  const { barImg, contentRef, name, mrp, count, qty, showPkd, pkdDate } = props

  // Create an array of length 'count' to repeat the barcode label
  const labels = Array.from({ length: Number(count) || 1 })

  const formattedDate = pkdDate ? new Date(pkdDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  }) : ''

  return (
    <div
      ref={contentRef}
      className="thermal-print-container"
    >
      {/* 2-Column Layout CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @page {
          size: 101.6mm 25.4mm;
          margin: 0;
        }
        @media print {
          body * { visibility: hidden; opacity: 0; }
          .thermal-print-container, .thermal-print-container * { visibility: visible; opacity: 1; }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            width: 101.6mm;
            height: 25.4mm;
            background: white !important;
          }
          .thermal-print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 101.6mm;
            display: block !important;
          }
          .label-row {
            display: flex;
            width: 101.6mm;
            height: 25.4mm;
            page-break-after: always;
            page-break-inside: avoid;
            box-sizing: border-box;
          }
          .label-row:last-child {
            page-break-after: auto;
          }
          .thermal-label {
            width: 50.8mm;
            height: 25.4mm;
            padding: 1mm 2mm;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            overflow: hidden;
            box-sizing: border-box;
            background: white;
            border: 0.1mm solid transparent;
          }
          .barcode-img {
            width: 100%;
            height: 9mm;
            object-fit: contain;
            display: block;
            margin-top: 0.2mm;
            margin-bottom: 0.2mm;
          }
          .product-name {
            font-family: 'Arial', sans-serif;
            font-size: 8pt;
            font-weight: 800;
            margin: 0;
            padding: 0;
            text-align: center;
            line-height: 1.1;
            width: 100%;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
            color: black;
            height: 6mm; /* Fixed height for 2 lines */
          }
          .footer-row {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 0.2mm;
            padding: 0 0.5mm;
          }
          .qty-text {
            font-family: 'Arial', sans-serif;
            font-size: 7pt;
            font-weight: bold;
            color: black;
          }
          .price-text {
            font-family: 'Arial', sans-serif;
            font-size: 8pt;
            font-weight: 800;
            color: black;
          }
          .pkd-text {
            font-family: 'Arial', sans-serif;
            font-size: 6pt;
            font-weight: bold;
            color: black;
            border-top: 0.1mm solid rgba(0,0,0,0.1);
            width: 100%;
            text-align: center;
            display: block;
            margin-top: 0.2mm;
            padding-top: 0.2mm;
          }
          /* Hide everything else during print */
          .no-print {
            display: none !important;
          }
        }
      ` }} />

      {/* Group labels into pairs for 2-column layout */}
      {Array.from({ length: Math.ceil((Number(count) || 1) / 2) }).map((_, rowIndex) => (
        <div key={rowIndex} className="label-row">
          {/* First Column */}
          <div className="thermal-label">
            <img src={barImg} alt="Barcode" className="barcode-img" />
            <p className="product-name">{name}</p>
            <div className="footer-row">
              <span className="qty-text">{qty}</span>
              <span className="price-text">MRP: ₹{mrp}</span>
            </div>
            {showPkd && <p className="pkd-text">PKD: {formattedDate}</p>}
          </div>

          {/* Second Column (only if count allows) */}
          {(rowIndex * 2 + 1) < (Number(count) || 1) ? (
            <div className="thermal-label">
              <img src={barImg} alt="Barcode" className="barcode-img" />
              <p className="product-name">{name}</p>
              <div className="footer-row">
                <span className="qty-text">{qty}</span>
                <span className="price-text">MRP: ₹{mrp}</span>
              </div>
              {showPkd && <p className="pkd-text">PKD: {formattedDate}</p>}
            </div>
          ) : (
            <div className="thermal-label" style={{ visibility: 'hidden' }}>
              {/* Empty placeholder for odd counts */}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default PrintBarCode