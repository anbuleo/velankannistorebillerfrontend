import React from 'react'

function Pending({data}) {
  return <><div className="h-screen  place-content-center w-screen">
  <div className="card w-96 glass mx-auto text-orange-200">
  <div className='card-body items-center '><p className='text-2xl'> Welcome <span className='text-orange-600 uppercase'>{data?.userName}</span></p></div>
  <div className="card-body items-center text-center">
    <h2 className="card-title">Wait for Approval</h2>
    <p>Your account is registered for {data?.role} access, its being process... </p>
    
    <div className="card-actions justify-end">
    <p>After verification you will get permit for access</p>
    </div>
  </div>
</div>
  </div>
  </>
}

export default Pending