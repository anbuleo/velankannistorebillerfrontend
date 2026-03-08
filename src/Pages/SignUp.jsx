import { Formik } from 'formik'
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import signUpHook from '../Hooks/signUpHook';
import { toast } from 'react-toastify'
import { MdEmail, MdLock, MdPerson, MdPhone } from 'react-icons/md'

function SignUp() {
  const { loading, signUp, code, message } = signUpHook()
  const navigate = useNavigate()

  useEffect(() => {
    if (code === 201) {
      toast.success('Account created successfully!')
      navigate('/')
    } else if (code) {
      toast.warning(message || 'Registration failed')
    }
  }, [code, message, navigate])

  const UserSchema = Yup.object().shape({
    userName: Yup.string().required('Full name is required').min(3, 'Name at least 3 chars'),
    email: Yup.string().email('Invalid email').required('Email required'),
    mobile: Yup.string().matches(/^\d{10}$/, 'Invalid mobile').required('Mobile required'),
    password: Yup.string().required('Password required').min(6, 'At least 6 chars')
  })

  const handleSubmitValues = async (values) => {
    try {
      await signUp(values)
    } catch (error) {
      toast.error('Registration error')
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Visual Side */}
      <div className="hidden lg:flex bg-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-900 opacity-90"></div>
        <div className="relative z-10 text-white max-w-md text-center lg:text-left">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 shadow-xl mx-auto lg:mx-0">
            <span className="text-3xl font-bold">V</span>
          </div>
          <h1 className="text-5xl font-display font-bold mb-6 leading-tight">Join the Billing Revolution.</h1>
          <p className="text-xl text-primary-100 font-light leading-relaxed">
            Create an account to access our all-in-one store management platform. Premium features await.
          </p>
          <ul className="mt-12 space-y-4">
            {['Smart Inventory Systems', 'Cloud-based Sales Logs', 'Advanced Barcoding'].map(item => (
              <li key={item} className="flex items-center gap-3 font-medium text-white/80">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">✓</div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-surface-50 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-surface-900 mb-2">Create Account</h2>
            <p className="text-surface-500">Register as a authorized staff member.</p>
          </div>

          <Formik
            initialValues={{ userName: "", email: "", password: "", mobile: "" }}
            validationSchema={UserSchema}
            onSubmit={handleSubmitValues}
          >
            {({ errors, touched, handleBlur, handleSubmit, handleChange }) => (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">Full Name</label>
                  <div className="relative">
                    <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-xl" />
                    <input
                      className={`premium-input w-full pl-12 h-12 ${errors.userName && touched.userName ? 'border-error' : ''}`}
                      type="text"
                      name="userName"
                      placeholder="Enter legal name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.userName && touched.userName && (
                    <p className="mt-1 text-xs text-error font-medium">{errors.userName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-xl" />
                    <input
                      className={`premium-input w-full pl-12 h-12 ${errors.email && touched.email ? 'border-error' : ''}`}
                      type="email"
                      name="email"
                      placeholder="name@company.com"
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && touched.email && (
                    <p className="mt-1 text-xs text-error font-medium">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">Contact Number</label>
                  <div className="relative">
                    <MdPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-xl" />
                    <input
                      className={`premium-input w-full pl-12 h-12 ${errors.mobile && touched.mobile ? 'border-error' : ''}`}
                      type="text"
                      name="mobile"
                      placeholder="10 digit mobile"
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.mobile && touched.mobile && (
                    <p className="mt-1 text-xs text-error font-medium">{errors.mobile}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">Secure Password</label>
                  <div className="relative">
                    <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-xl" />
                    <input
                      className={`premium-input w-full pl-12 h-12 ${errors.password && touched.password ? 'border-error' : ''}`}
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.password && touched.password && (
                    <p className="mt-1 text-xs text-error font-medium">{errors.password}</p>
                  )}
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`premium-button w-full h-14 flex items-center justify-center gap-2 group ${loading ? 'opacity-70 scale-95 shadow-none' : ''}`}
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-md"></span> Processing...
                      </>
                    ) : (
                      <>Launch Creation Protocol</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </Formik>

          <div className="mt-10 text-center">
            <p className="text-sm text-surface-500">
              Already registered? <Link to="/login" className="font-bold text-primary hover:underline">Sign in instead</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp