import React from 'react'

import {useSelector} from 'react-redux'
import CustomerTable from '../components/CustomerTable'
 
function Customer() {

    

  return <>
    <div className="pt-20">
            <div className="">
                <div className="">
                    <p className="text-4xl text-center underline">Customers</p>
                </div>
                <div className="">
                    <CustomerTable />
                </div>
            </div>
    </div>  
  </>
}

export default Customer