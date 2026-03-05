import React, { useState, useEffect } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import useCreateProduct from '../Hooks/useCreateProduct';
import useCategory from '../Hooks/useCategory';
import { toast } from 'react-toastify';
import {
  MdArrowBack,
  MdChevronRight,
  MdInventory,
  MdDescription,
  MdCurrencyRupee,
  MdNumbers,
  MdLibraryAdd,
  MdFactCheck
} from 'react-icons/md'

function CreateProduct() {
  const { loading, createProduct } = useCreateProduct()
  const { categories } = useCategory()
  const navigate = useNavigate()
  const userData = JSON.parse(localStorage.getItem('data'))

  useEffect(() => {
    if (userData?.role !== 'admin') {
      toast.warning('Restricted: Admin access required for Inventory production')
      navigate('/product')
    }
  }, [userData, navigate])

  const [isFinishMode, setIsFinishMode] = useState(false);

  const productSchema = Yup.object().shape({
    productName: Yup.string().required('Required'),
    tanglishName: Yup.string().required('Required'),
    productType: Yup.string().required('Required'),
    unitValue: Yup.number().required('Required'),
    qantityType: Yup.string().required('Required'),
    productCost: Yup.number(), // Optional but must be number
    productPrice: Yup.number().required('Required'),
    MRP: Yup.number().required('Required'),
    stockQuantity: Yup.number().required('Required'),
    productCode: Yup.string().required('Required'),
  });

  const handleCreate = async (values, { resetForm }) => {
    const res = await createProduct(values)
    if (res && res.status === 201) {
      if (isFinishMode) {
        navigate('/product')
      } else {
        resetForm()
        // Focus the secondary name field for the next entry
        const englishField = document.getElementsByName('tanglishName')[0];
        if (englishField) englishField.focus();
      }
    }
  }

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

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl fade-in min-h-[80vh]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 text-sm font-bold text-surface-400">
          <Link to="/product" className="hover:text-primary transition-colors uppercase tracking-widest text-[10px]">Inventory</Link>
          <MdChevronRight className="text-lg opacity-40" />
          <span className="text-surface-900 uppercase tracking-widest text-[10px]">Rapid Entry Mode</span>
        </div>
        <div className="badge badge-primary font-bold px-4 py-3">Rapid Add Active</div>
      </div>

      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl shadow-premium">
            <MdInventory />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900 mb-1">Bulk Product Entry</h1>
            <p className="text-surface-500 font-medium">Type English name below to generate Tamil name above.</p>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mt-32 -mr-32 blur-3xl"></div>
        <div className="bg-surface-50 p-8 border-b border-surface-100 flex items-center justify-between relative">
          <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest leading-none">High-Speed Metadata Entry</h3>
        </div>

        <div className="p-10 relative">
          <Formik
            initialValues={{
              productName: '', tanglishName: '', productType: '', unitValue: '',
              qantityType: 'PCS', productCost: '', productPrice: '', MRP: '', stockQuantity: '', productCode: ''
            }}
            validationSchema={productSchema}
            onSubmit={handleCreate}
          >
            {({ errors, touched, handleBlur, handleSubmit, handleChange, values, setFieldValue, resetForm }) => (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  {/* Basic Info */}
                  <div className="space-y-6 md:pr-6 md:border-r border-surface-100">
                    <div>
                      <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-3 ml-1">Tamil Name (Primary)</label>
                      <div className="relative">
                        <MdDescription className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-lg" />
                        <input
                          className={`premium-input w-full h-14 pl-12 font-bold ${errors.productName && touched.productName ? 'border-error' : ''}`}
                          type="text"
                          name="productName"
                          placeholder="சர்க்கரை"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.productName}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-3 ml-1">Secondary Name (English/Other)</label>
                      <div className="relative flex gap-2">
                        <input
                          autoFocus
                          className={`premium-input flex-1 h-14 ${errors.tanglishName && touched.tanglishName ? 'border-error' : ''}`}
                          type="text"
                          name="tanglishName"
                          placeholder="Type 'Sugar' or 'Sarkarai' here"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.tanglishName}
                        />
                        <button
                          type="button"
                          onClick={() => transliterateToTamil(values.tanglishName, setFieldValue)}
                          className="w-14 h-14 rounded-xl bg-surface-900 text-white flex items-center justify-center hover:bg-primary transition-all shadow-lg active:scale-95 group"
                          title="Convert to Tamil Upward"
                        >
                          <span className="text-lg font-bold">அ</span>
                        </button>
                      </div>
                      <p className="text-[9px] text-surface-400 mt-2 font-bold uppercase tracking-wider">Tip: Type English here and click 'அ' to populate Tamil Name above</p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-3 ml-1">Category</label>
                        <select className={`premium-input w-full h-14 appearance-none ${errors.productType && touched.productType ? 'border-error' : ''}`} name="productType" onBlur={handleBlur} onChange={handleChange} value={values.productType}>
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-3 ml-1">Quantity Measure</label>
                        <div className="flex gap-2">
                          <input className={`premium-input w-2/3 h-14 ${errors.unitValue && touched.unitValue ? 'border-error' : ''}`} type="number" name="unitValue" onBlur={handleBlur} onChange={handleChange} value={values.unitValue} />
                          <select className={`premium-input w-1/3 h-14 appearance-none ${errors.qantityType && touched.qantityType ? 'border-error' : ''}`} name="qantityType" onBlur={handleBlur} onChange={handleChange} value={values.qantityType}>
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

                  {/* Pricing & Stock */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-3 ml-1">Purchase Price</label>
                          <div className="relative">
                            <MdCurrencyRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-lg" />
                            <input className={`premium-input w-full h-14 pl-12 font-bold text-surface-600 ${errors.productCost && touched.productCost ? 'border-error' : ''}`} type="number" name="productCost" onBlur={handleBlur} onChange={handleChange} value={values.productCost} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-3 ml-1">Initial Stock</label>
                          <div className="relative">
                            <MdNumbers className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-lg" />
                            <input className={`premium-input w-full h-14 pl-12 font-bold ${errors.stockQuantity && touched.stockQuantity ? 'border-error' : ''}`} type="number" name="stockQuantity" onBlur={handleBlur} onChange={handleChange} value={values.stockQuantity} />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-3 ml-1">Selling Price</label>
                          <div className="relative">
                            <MdCurrencyRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-lg" />
                            <input className={`premium-input w-full h-14 pl-12 font-bold text-primary ${errors.productPrice && touched.productPrice ? 'border-error' : ''}`} type="number" name="productPrice" onBlur={handleBlur} onChange={handleChange} value={values.productPrice} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-3 ml-1">Maximum MRP</label>
                          <div className="relative">
                            <MdCurrencyRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-lg opacity-40" />
                            <input className={`premium-input w-full h-14 pl-12 ${errors.MRP && touched.MRP ? 'border-error' : ''}`} type="number" name="MRP" onBlur={handleBlur} onChange={handleChange} value={values.MRP} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-3 ml-1">Product Identity / Barcode</label>
                      <div className="flex gap-2">
                        <input
                          className={`premium-input flex-1 h-14 placeholder:opacity-30 ${errors.productCode && touched.productCode ? 'border-error' : ''}`}
                          type="text"
                          name="productCode"
                          placeholder="Scan or type code"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.productCode}
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
                      <p className="text-[9px] text-surface-400 mt-2 font-bold uppercase tracking-wider italic">Enter manufacturer barcode OR click generate for shop ID</p>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-surface-100 flex flex-col lg:flex-row justify-between items-center gap-6">
                  <Link to="/product" className="flex items-center gap-2 font-bold text-surface-400 hover:text-surface-900 transition-colors uppercase text-[10px] tracking-widest order-3 lg:order-1">
                    <MdArrowBack /> Exit Mode
                  </Link>

                  <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto order-1 lg:order-2">
                    <button
                      type="submit"
                      disabled={loading}
                      onClick={() => setIsFinishMode(false)}
                      className="premium-button h-16 px-8 bg-surface-900 text-white flex items-center justify-center gap-3 shadow-xl hover:bg-black transition-all"
                    >
                      <MdLibraryAdd className="text-xl" /> Commit & Add Another
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      onClick={() => setIsFinishMode(true)}
                      className={`premium-button h-16 px-12 text-sm flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 ${loading ? 'opacity-70 grayscale' : ''}`}
                    >
                      {loading ? <span className="loading loading-ring"></span> : <><MdFactCheck className="text-xl" /> Commit & Finish</>}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default CreateProduct