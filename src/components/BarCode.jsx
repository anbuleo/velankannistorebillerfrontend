import React from 'react'
import Barcode from 'react-barcode';

function BarCode({id}) {


  return <Barcode value={id} />;
}

export default BarCode