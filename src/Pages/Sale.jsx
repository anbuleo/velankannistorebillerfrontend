import React, { useEffect, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import SaleTable from '../components/SaleTable';
import useSaleTableDataHook from '../Hooks/SaleTableDataHook'
import { totalByCustomer } from '../common/SaleCart';
import { toast } from 'react-toastify';
import AxiosService from '../common/Axioservice';

function Sale() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    let {customerBill,getBillOfuser,setCustomerBill} = useSaleTableDataHook()

    let {bills,totalBllAmount,totalAmountByCustomer} = useSelector(state=>state.sale)
    let {customer} = useSelector(state=>state.customer)

    // console.log(bills)
    
    const [tableData,setTableData] = useState([])
    let dispatch = useDispatch()


    useEffect(()=>{
        setTableData(bills) 
    },[bills])
    useEffect(()=>{
        if(customerBill.length >0 && !startDate && !endDate){
            
            setTableData(customerBill)
        }
        
     },[tableData])
    



    const handleChangeCustomer = async(id)=>{
        if(id === 'all'){
            setCustomerBill([])
            setTableData([...bills])
            dispatch(totalByCustomer('all'))
            return
        }else{
            await getBillOfuser(id)
            setTableData(customerBill)
            setTimeout(() => { 
                console.log("Updated customerBill:", customerBill);
                setTableData([...customerBill]); 
            }, 100); 
        }

      

       
    }
    const searchByDate = async()=>{
        try {
            if(startDate && endDate) {

                let res = await AxiosService.put('/saleprint/getsalebydate',{startDate,endDate})
                if(res.status == 200){
                    setTableData(res?.data?.sale)
                    setStartDate('')
                    setEndDate('')
                }
            }else {
                toast.warning('enter start and end date')
            }
            
        } catch (error) {
            toast.error('Error in sorting')
        }
    }
    // console.log(startDate,endDate)
  return <>
    <div className="container pt-10">
        {/* headers */}
                <div className="pt-10">
                    <p className="text-4xl text-center uppercase underline  bg-white">Sale</p>
                    
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4 p-4 md:justify-between">
                        <div className="w-full sm:w-auto">
                            <select className="select select-accent w-full max-w-xs" onChange={(e)=>handleChangeCustomer(e.target.value)}>
                                <option   value={'all'}>All Customer Bills</option>
                               {customer?.length >0 && customer?.map((e,i)=>{
                                return <option key={i} value={e._id}>{e.name}</option>
                               })}
                            </select>
                        </div>

                        <div className="flex flex-wrap justify-center gap-4">
                        <div className="flex flex-col sm:flex-row items-center">
                        <label className='label'>Start Date:</label>
                        <input className=' input input-accent sm:w-48 ' type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div className="flex flex-col sm:flex-row items-center">
                        <label className='label'>End Date:</label>
      <input className='input input-accent sm:w-48 ' type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

                        </div>
                        <div className="flex flex-col sm:flex-row items-center">
                            <p className="btn btn-outline btn-accent" onClick={searchByDate}>search</p>
                        </div>
      
                        </div>

                        <div className="my-auto">

                        <p className="text-lg font-semibold">Total Amount by customer: {totalAmountByCustomer}</p>
                        <p className="text-lg font-semibold">Total Amount: {totalBllAmount || totalAmountByCustomer}</p>
                        </div>
                </div>
                {/* table */}
                <div className="">
                        <SaleTable props={{tableData}} />
                </div>
    </div>
  </>
}

export default Sale