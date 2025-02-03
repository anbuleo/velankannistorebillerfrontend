import React from 'react'
import { QRCodeCanvas } from "qrcode.react";

function QrCodeGen({ upiId, name, amount}) {
    const phonePeUPI = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;

    return (
      <div   className="flex flex-col items-center  ">
        <p className="text-xs font-bold mb-2">Scan & Pay </p>
        <QRCodeCanvas value={phonePeUPI}   size={150} level="H" />
        <p className="mt-2 text-xs text-gray-900">UPI ID: {upiId}</p>
      </div>
    );
}

export default QrCodeGen