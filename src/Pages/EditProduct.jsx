import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useEditProduct from '../Hooks/useEditProduct';
import useCategory from '../Hooks/useCategory';
import { MdArrowBack, MdChevronRight, MdInventory, MdDescription, MdCurrencyRupee, MdNumbers, MdCategory, MdCheck } from 'react-icons/md'

function EditProduct() {
  const { product } = useSelector((state) => state.product)
  const { id } = useParams()
  const navigate = useNavigate()
  const { loading, editProduct } = useEditProduct()
  const { categories } = useCategory()
  const userData = JSON.parse(localStorage.getItem('data'))

  useEffect(() => {
    if (userData?.role !== 'admin') {
      toast.warning('Restricted: Admin access required for Inventory modification')
      navigate('/product')
    }
  }, [userData, navigate])

  const [initialValue, setInitialValue] = useState(null)

  useEffect(() => {
    const fn = product?.find(p => p._id === id)
    if (fn) {
      setInitialValue({
        productName: fn.productName || '',
        tanglishName: fn.tanglishName || '',
        productType: fn.productType || '',
        unitValue: fn.unitValue || '',
        qantityType: fn.qantityType || '',
        productCost: fn.productCost || '',
        productPrice: fn.productPrice || '',
        MRP: fn.MRP || '',
        stockQuantity: fn.stockQuantity || '',
        productCode: fn.productCode || '',
      })
    }
  }, [id, product])

  const transliterateToTamil = async (text, setFieldValue) => {
    if (!text) return;
    try {
      const response = await fetch(`https://inputtools.google.com/request?text=${text}&itc=ta-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=test`);
      const data = await response.json();
      if (data && data[0] === 'SUCCESS' && data[1][0][1][0]) {
        setFieldValue('productName', data[1][0][1][0]);
      }
    } catch (error) {
      console.error("Transliteration failed", error);
    }
  };

  const productSchema = Yup.object().shape({
    productName: Yup.string().required('Required'),
    tanglishName: Yup.string().required('Required'),
    productType: Yup.string().required('Required'),
    unitValue: Yup.number().required('Required'),
    qantityType: Yup.string().required('Required'),
    productCost: Yup.number(), // Optional
    productPrice: Yup.number().required('Required'),
    MRP: Yup.number().required('Required'),
    stockQuantity: Yup.number().required('Required'),
    productCode: Yup.string().required('Required'),
  });

  const handleUpdate = async (values) => {
    const res = await editProduct(id, values)
    if (res.status === 200) {
      navigate('/product')
    }
  }

  if (!initialValue) return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50">
      <span className="loading loading-ring loading-lg text-primary"></span>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl fade-in min-h-[80vh]">
      <div className="flex items-center gap-2 mb-10 text-sm font-bold text-surface-400">
        <Link to="/product" className="hover:text-primary transition-colors uppercase tracking-widest text-[10px]">Inventory Hub</Link>
        <MdChevronRight className="text-lg opacity-40" />
        <span className="text-surface-900 uppercase tracking-widest text-[10px]">Edit Asset Profile</span>
      </div>

      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center text-3xl shadow-premium">
            <MdInventory />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900 mb-1">Update Asset Profile</h1>
            <p className="text-surface-500 font-medium">Modified product data for SKU: {id.slice(-6)}</p>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -mt-32 -mr-32 blur-3xl"></div>
        <div className="bg-surface-50 p-8 border-b border-surface-100 flex items-center justify-between relative">
          <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest leading-none">Global Stock Calibration</h3>
        </div>

        <div className="p-10 relative">
          <Formik
            initialValues={initialValue}
            validationSchema={productSchema}
            onSubmit={handleUpdate}
          >
            {({ errors, touched, handleBlur, handleSubmit, handleChange, values, setFieldValue }) => (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <div className="space-y-6 md:pr-6 md:border-r border-surface-100">
                    <div>
                      <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-3 ml-1 leading-none">Tamil Name (Primary)</label>
                      <div className="relative">
                        <MdDescription className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-lg" />
                        <input className={`premium-input w-full h-14 pl-12 font-bold ${errors.productName && touched.productName ? 'border-error' : ''}`} type="text" name="productName" value={values.productName} onBlur={handleBlur} onChange={handleChange} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-3 ml-1 leading-none">Secondary Name (English)</label>
                      <div className="relative flex gap-2">
                        <input
                          autoFocus
                          className={`premium-input flex-1 h-14 ${errors.tanglishName && touched.tanglishName ? 'border-error' : ''}`}
                          type="text"
                          name="tanglishName"
                          value={values.tanglishName}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          onClick={() => transliterateToTamil(values.tanglishName, setFieldValue)}
                          className="w-14 h-14 rounded-xl bg-surface-900 text-white flex items-center justify-center hover:bg-primary transition-all shadow-lg active:scale-95"
                          title="Convert to Tamil Upward"
                        >
                          <span className="text-lg font-bold">அ</span>
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-3 ml-1 leading-none">Asset Family</label>
                        <select className={`premium-input w-full h-14 appearance-none ${errors.productType && touched.productType ? 'border-error' : ''}`} name="productType" value={values.productType} onBlur={handleBlur} onChange={handleChange}>
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-3 ml-1 leading-none">Asset Scale</label>
                        <div className="flex gap-2">
                          <input className={`premium-input w-2/3 h-14 ${errors.unitValue && touched.unitValue ? 'border-error' : ''}`} type="number" name="unitValue" value={values.unitValue} onBlur={handleBlur} onChange={handleChange} />
                          <select className={`premium-input w-1/3 h-14 appearance-none ${errors.qantityType && touched.qantityType ? 'border-error' : ''}`} name="qantityType" value={values.qantityType} onBlur={handleBlur} onChange={handleChange}>
                            <option value="KG">KG</option>
                            <option value="G">G</option>
                            <option value="L">L</option>
                            <option value="ML">ML</option>
                            <option value="PCS">PCS</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-3 ml-1 leading-none">Purchase Price (Cost)</label>
                          <div className="relative">
                            <MdCurrencyRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-lg" />
                            <input className={`premium-input w-full h-14 pl-12 font-bold text-surface-600 ${errors.productCost && touched.productCost ? 'border-error' : ''}`} type="number" name="productCost" value={values.productCost} onBlur={handleBlur} onChange={handleChange} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-3 ml-1 leading-none">Initial Stock</label>
                          <div className="relative">
                            <MdNumbers className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-lg" />
                            <input className={`premium-input w-full h-14 pl-12 font-bold ${errors.stockQuantity && touched.stockQuantity ? 'border-error' : ''}`} type="number" name="stockQuantity" value={values.stockQuantity} onBlur={handleBlur} onChange={handleChange} />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-3 ml-1 leading-none">Selling Price</label>
                          <div className="relative">
                            <MdCurrencyRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-lg" />
                            <input className={`premium-input w-full h-14 pl-12 font-bold text-primary ${errors.productPrice && touched.productPrice ? 'border-error' : ''}`} type="number" name="productPrice" value={values.productPrice} onBlur={handleBlur} onChange={handleChange} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-3 ml-1 leading-none">Maximum List MRP</label>
                          <div className="relative">
                            <MdCurrencyRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-lg opacity-40" />
                            <input className={`premium-input w-full h-14 pl-12 ${errors.MRP && touched.MRP ? 'border-error' : ''}`} type="number" name="MRP" value={values.MRP} onBlur={handleBlur} onChange={handleChange} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-3 ml-1 leading-none">Product Identity / Barcode</label>
                      <div className="flex gap-2">
                        <input
                          className={`premium-input flex-1 h-14 ${errors.productCode && touched.productCode ? 'border-error' : ''}`}
                          type="text"
                          name="productCode"
                          value={values.productCode}
                          onBlur={handleBlur}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const genId = 'VB' + Math.random().toString(36).substring(2, 7).toUpperCase() + Date.now().toString().slice(-4);
                            setFieldValue('productCode', genId);
                            toast.info("Unique Barcode Generated", { autoClose: 1500 });
                          }}
                          className="px-6 h-14 rounded-xl bg-surface-100 text-surface-600 font-bold hover:bg-surface-200 transition-all text-[10px] uppercase tracking-widest border border-dashed border-surface-300 active:scale-95"
                        >
                          Generate
                        </button>
                      </div>
                      <p className="text-[9px] text-surface-400 mt-2 font-bold uppercase tracking-wider italic">Scan existing manufacturer label OR generate shop-specific ID</p>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-surface-100 flex flex-col md:flex-row justify-between items-center gap-6">
                  <button type="button" onClick={() => navigate('/product')} className="flex items-center gap-2 font-bold text-surface-400 hover:text-surface-900 transition-colors uppercase text-[10px] tracking-widest order-2 md:order-1">
                    <MdArrowBack /> Cancel Operation
                  </button>
                  <button type="submit" disabled={loading} className={`premium-button h-16 px-12 text-sm flex items-center justify-center gap-3 order-1 md:order-2 shadow-2xl shadow-primary/30 min-w-[280px] ${loading ? 'opacity-70 grayscale' : ''}`}>
                    {loading ? <span className="loading loading-spinner"></span> : <><MdCheck className="text-xl" /> Save Asset Profile</>}
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

export default EditProduct