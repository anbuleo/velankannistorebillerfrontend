import { Formik } from 'formik';
import React from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import AxiosService from '../common/Axioservice';
import { useNavigate } from 'react-router-dom';

function BalanceCreate() {
  let { customer } = useSelector((state) => state.customer);
  let navigate = useNavigate()

  const BalanceSheetSchema = Yup.object().shape({
    customerId: Yup.string().required('Select Customer Name Required'),
    amount: Yup.number().required('Amount Required'),
    type: Yup.string().required('Select type of payment required'),
  });

  let initialValues = {
    customerId: '',
    amount: 0,
    type: '',
  };

  const handleCreate =async(val)=>{
    try {
            if(val?.amount > 0){

                let res = await AxiosService.post('/saleprint/createandeditbalancesheet',val)

                if(res.status === 200||res.status ==201){
                    toast.success(res?.data?.message)
                    navigate('/product')
                }else if(res.status === 400 || res.status==404){
                    toast.error(res.data.message)
                }
            }else{
                toast.warning('Enter amount')
            }
        
    } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <p className="text-2xl text-center underline uppercase mb-4">Create BalanceSheet</p>
        <Formik
          initialValues={initialValues}
          validationSchema={BalanceSheetSchema}
          onSubmit={(values) => {
            handleCreate(values); // Handle form submission logic here
          }}
        >
          {({ errors, touched, handleBlur, handleSubmit, handleChange }) => (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="customerId" className="block text-sm font-semibold mb-2">
                  Customer Name
                </label>
                <select
                  className="input input-bordered w-full text-black"
                  name="customerId"
                  id="customerId"
                  onBlur={handleBlur}
                  onChange={handleChange}
                >
                  <option disabled value="">
                    Select customer Name
                  </option>
                  {customer &&
                    customer?.map((e, i) => (
                      <option key={i} value={e._id}>
                        {e.name}
                      </option>
                    ))}
                </select>
                {errors.customerId && touched.customerId ? (
                  <div style={{ color: 'red' }}>{errors.customerId}</div>
                ) : null}
              </div>

              <div className="mb-4">
                <label htmlFor="type" className="block text-sm font-semibold mb-2">
                  Payment Type
                </label>
                <select
                  className="input input-bordered w-full text-black"
                  name="type"
                  id="type"
                  onBlur={handleBlur}
                  onChange={handleChange}
                >
                  <option disabled value="">
                    Select One option
                  </option>
                  <option value="opening_balance">Opening Balance</option>
                  <option value="purchase">Purchase</option>
                  <option value="payment">Payment</option>
                </select>
                {errors.type && touched.type ? (
                  <div style={{ color: 'red' }}>{errors.type}</div>
                ) : null}
              </div>

              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-semibold mb-2">
                  Enter Amount
                </label>
                <input
                  className="input input-bordered w-full text-black"
                  type="number"
                  name="amount"
                  id="amount"
                  placeholder="Enter amount for entry"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {errors.amount && touched.amount ? (
                  <div style={{ color: 'red' }}>{errors.amount}</div>
                ) : null}
              </div>

              <div className="mt-4">
                <button type="submit" className="btn btn-accent btn-outline w-full " >
                  Submit
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default BalanceCreate;
