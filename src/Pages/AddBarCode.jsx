import React, { useContext } from 'react'
import Barcode from 'react-barcode';
import { ProductBarCodeContext } from '../Context/BarCodeContext';

function AddBarCode() {

  let  {barCodeProduct } = useContext(ProductBarCodeContext)
  console.log(barCodeProduct)


  return <>
  <div className="h-screen place-content-center w-screen ">
  <div className="w-full max-w-lg p-4  mx-auto  bg-transparent backdrop-blur-xl text-orange-200  opacity-95 border border-zinc-950  rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 ">
     <p className='text-center uppercase text-2xl'>Add BarCode</p>
     <form onSubmit={(e)=>{
      e.preventDefault()
      console.log(e)
     }}>
     <div className="flex">
      <div className="text-black">
        <input type="text" />
      </div>
      {/* divider  */}
      <div className="">
      <Barcode value={'89'} />
      </div>
     </div>
     </form>
    </div>
  </div>
  </>
}

export default AddBarCode