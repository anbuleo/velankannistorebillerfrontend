import { Formik } from 'formik';
import React from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import AxiosService from '../common/Axioservice';
import { useNavigate, Link } from 'react-router-dom';
import { MdCalculate, MdArrowBack, MdCurrencyRupee, MdCompareArrows, MdPerson } from 'react-icons/md'

function BalanceCreate() {
  const { customer } = useSelector((state) => state.customer);
  const navigate = useNavigate();

  const BalanceSheetSchema = Yup.object().shape({
    customerId: Yup.string().required('Required'),
    amount: Yup.number().required('Required').positive('Must be positive'),
    type: Yup.string().required('Required'),
  });

  const handleCreate = async (values) => {
    try {
      const res = await AxiosService.post('/customer/createbalancesheet', values);
      if (res.status === 201) {
        toast.success('Balance entry created successfully');
        navigate('/customer');
      }
    } catch (error) {
      toast.error('Failed to create balance entry');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl fade-in min-h-[80vh]">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-surface-900 leading-none">Ledger Entry</h1>
          <p className="text-sm font-medium text-surface-400 mt-2 uppercase tracking-wider">Manual Balance Adjustment</p>
        </div>
        <Link to="/customer" className="btn btn-ghost rounded-xl text-surface-500 gap-2">
          <MdArrowBack /> Back to Directory
        </Link>
      </div>

      <div className="glass-card overflow-hidden shadow-2xl">
        <div className="bg-surface-50 p-8 border-b border-surface-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center text-3xl shadow-lg shadow-secondary/20">
              <MdCalculate />
            </div>
            <p className="font-bold text-surface-400 uppercase tracking-widest text-[10px]">Financial Transaction</p>
          </div>
        </div>

        <div className="p-10">
          <Formik
            initialValues={{ customerId: '', amount: '', type: '' }}
            validationSchema={BalanceSheetSchema}
            onSubmit={handleCreate}
          >
            {({ errors, touched, handleBlur, handleSubmit, handleChange }) => (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-surface-700 mb-3 ml-1">Select Customer</label>
                  <div className="relative">
                    <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-lg" />
                    <select
                      className="premium-input w-full h-14 pl-12 pr-10 appearance-none bg-white font-medium"
                      name="customerId"
                      onBlur={handleBlur}
                      onChange={handleChange}
                    >
                      <option disabled value="">Select customer Profile</option>
                      {customer?.map((c, i) => (
                        <option key={c._id || i} value={c._id}>{c.name} ({c.mobile})</option>
                      ))}
                    </select>
                  </div>
                  {errors.customerId && touched.customerId && <div className="text-error text-xs font-bold mt-2 ml-1 uppercase tracking-tight">{errors.customerId}</div>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-surface-700 mb-3 ml-1">Entry Type</label>
                    <div className="relative">
                      <MdCompareArrows className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-lg" />
                      <select
                        className="premium-input w-full h-14 pl-12 pr-10 appearance-none bg-white font-medium"
                        name="type"
                        onBlur={handleBlur}
                        onChange={handleChange}
                      >
                        <option disabled value="">Select Category</option>
                        <option value="Credit">Credit (Add Balance)</option>
                        <option value="Debit">Debit (Sub Balance)</option>
                      </select>
                    </div>
                    {errors.type && touched.type && <div className="text-error text-xs font-bold mt-2 ml-1 uppercase tracking-tight">{errors.type}</div>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-surface-700 mb-3 ml-1">Transactional Amount</label>
                    <div className="relative">
                      <MdCurrencyRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-lg" />
                      <input
                        type="number"
                        name="amount"
                        className="premium-input w-full h-14 pl-12 text-lg font-bold"
                        placeholder="0.00"
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.amount && touched.amount && <div className="text-error text-xs font-bold mt-2 ml-1 uppercase tracking-tight">{errors.amount}</div>}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    className="premium-button w-full h-16 text-lg flex items-center justify-center gap-3 shadow-primary/30"
                  >
                    <MdCalculate className="text-2xl" /> Commit Ledger Entry
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default BalanceCreate;
