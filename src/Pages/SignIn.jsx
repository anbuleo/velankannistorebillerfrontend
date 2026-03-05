import { Formik } from 'formik'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import signInHook from '../Hooks/signInHook';
import { toast } from 'react-toastify'
import { MdEmail, MdLock } from 'react-icons/md'

function SignIn() {
  const { loading, signIn } = signInHook()

  const UserSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required')
  })

  const handleSubmitValues = async (values) => {
    try {
      await signIn(values)
    } catch (error) {
      toast.error('Authentication failed')
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Visual Side */}
      <div className="hidden lg:flex bg-primary relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-900 opacity-90"></div>
        <div className="relative z-10 text-white max-w-md">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 shadow-xl">
            <span className="text-3xl font-bold">V</span>
          </div>
          <h1 className="text-5xl font-display font-bold mb-6 leading-tight">Effortless Billing for Modern Stores.</h1>
          <p className="text-xl text-primary-100 font-light leading-relaxed">
            Manage inventory, generate bills, and track sales with our premium store assistant tools.
          </p>
          <div className="mt-12 flex gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-primary-700 bg-primary-800" />
              ))}
            </div>
            <p className="text-sm text-primary-200">Trusted by 500+ store owners</p>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-surface-50">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-surface-900 mb-2">Welcome Back</h2>
            <p className="text-surface-500">Please enter your details to sign in.</p>
          </div>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={UserSchema}
            onSubmit={handleSubmitValues}
          >
            {({ errors, touched, handleBlur, handleSubmit, handleChange }) => (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-2">Email Address</label>
                  <div className="relative">
                    <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-xl" />
                    <input
                      className={`premium-input w-full pl-12 ${errors.email && touched.email ? 'border-error' : ''}`}
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
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-surface-700">Password</label>
                    <a href="#" className="text-xs font-semibold text-primary hover:underline">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <MdLock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-xl" />
                    <input
                      className={`premium-input w-full pl-12 ${errors.password && touched.password ? 'border-error' : ''}`}
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-surface-300 rounded" />
                    <label htmlFor="remember-me" className="ml-2 block text-xs text-surface-900 font-medium">Remember me</label>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`premium-button w-full h-14 flex items-center justify-center gap-2 group ${loading ? 'opacity-70 scale-95 shadow-none' : ''}`}
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-md"></span> Authenticating...
                      </>
                    ) : (
                      <>Sign In to Dashboard</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </Formik>

          <div className="mt-10 text-center">
            <p className="text-sm text-surface-500">
              New here? <Link to="/signup" className="font-bold text-primary hover:underline">Create a staff account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn