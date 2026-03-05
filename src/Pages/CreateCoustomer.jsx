import { Formik } from 'formik'
import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import * as Yup from 'yup';
import useCreateCustomer from '../Hooks/useCreateCustomer';
import { MdPersonAdd, MdArrowBack, MdPhone, MdPlace, MdPerson, MdAttachMoney } from 'react-icons/md'

function CreateCoustomer() {
  const { loading, createCustomer } = useCreateCustomer()
  const navigate = useNavigate()

  const customerSchema = Yup.object().shape({
    name: Yup.string().required('Full Name is required'),
    mobile: Yup.string().matches(/^[0-9]{10}$/, 'Invalid mobile number').required('Number is required'),
    location: Yup.string().required('Location is required'),
    aadhaar: Yup.string().matches(/^[0-9]{12}$/, 'Invalid Aadhaar number'),
  });

  const handleCreate = async (values) => {
    try {
      const res = await createCustomer(values)
      if (res.status === 201) {
        navigate('/customer')
      }
    } catch (error) {
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl fade-in min-h-[80vh]">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl shadow-premium">
            <MdPersonAdd />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900 mb-1">Register Customer</h1>
            <p className="text-surface-500 font-medium">Create a new credit profile in the directory.</p>
          </div>
        </div>
        <Link to="/customer" className="btn btn-ghost rounded-xl text-surface-500 gap-2">
          <MdArrowBack /> Back to Lists
        </Link>
      </div>

      <div className="glass-card overflow-hidden shadow-2xl">
        <div className="bg-surface-50 p-8 border-b border-surface-100 flex items-center justify-between">
          <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest leading-none">KYC Verification Details</h3>
        </div>

        <div className="p-10">
          <Formik
            initialValues={{ name: '', mobile: '', location: '', aadhaar: '', creditLimit: '' }}
            onSubmit={handleCreate}
            validationSchema={customerSchema}
          >
            {({ errors, touched, handleBlur, handleSubmit, handleChange }) => (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-surface-700 mb-3 ml-1">Full Name</label>
                    <div className="relative">
                      <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-lg" />
                      <input
                        className="premium-input w-full pl-12 h-14"
                        type="text"
                        name="name"
                        placeholder="Legal registration name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.name && touched.name && <div className="text-error text-xs font-bold mt-2 ml-1 uppercase tracking-tight">{errors.name}</div>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-surface-700 mb-3 ml-1">Contact Number</label>
                    <div className="relative">
                      <MdPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-lg" />
                      <input
                        className="premium-input w-full pl-12 h-14"
                        type="text"
                        name="mobile"
                        placeholder="10 digit mobile"
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.mobile && touched.mobile && <div className="text-error text-xs font-bold mt-2 ml-1 uppercase tracking-tight">{errors.mobile}</div>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-surface-700 mb-3 ml-1 flex items-center justify-between">
                      <span>Aadhaar Identity</span>
                      <span className="text-[10px] text-surface-400 font-bold uppercase tracking-widest">Optional</span>
                    </label>
                    <div className="relative">
                      <MdPersonAdd className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-lg" />
                      <input
                        className="premium-input w-full pl-12 h-14"
                        type="text"
                        name="aadhaar"
                        placeholder="12 digit identity number (if available)"
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.aadhaar && touched.aadhaar && <div className="text-error text-xs font-bold mt-2 ml-1 uppercase tracking-tight">{errors.aadhaar}</div>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-surface-700 mb-3 ml-1">Physical Address</label>
                    <div className="relative">
                      <MdPlace className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-lg" />
                      <input
                        className="premium-input w-full pl-12 h-14"
                        type="text"
                        name="location"
                        placeholder="City / Village / Hub"
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.location && touched.location && <div className="text-error text-xs font-bold mt-2 ml-1 uppercase tracking-tight">{errors.location}</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-surface-700 mb-3 ml-1">Credit Limit (₹)</label>
                    <div className="relative">
                      <MdAttachMoney className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-lg" />
                      <input
                        className="premium-input w-full pl-12 h-14"
                        type="number"
                        name="creditLimit"
                        placeholder="Default: 5000"
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    className={`premium-button w-full h-16 text-lg flex items-center justify-center gap-3 shadow-primary/30 ${loading ? 'opacity-70 grayscale' : ''}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      <><MdPersonAdd className="text-2xl" /> Launch Profile Registration</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default CreateCoustomer