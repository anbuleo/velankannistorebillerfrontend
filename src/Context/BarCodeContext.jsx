import React, { useState } from 'react'

export const ProductBarCodeContext = React.createContext(null)

function BarCodeContext({children}) {

    let [barCodeProduct,setBarCodeProduct] = useState("")
  return <ProductBarCodeContext.Provider  value={{barCodeProduct,setBarCodeProduct}}>
    
    {children }
  </ProductBarCodeContext.Provider>
}

export default BarCodeContext