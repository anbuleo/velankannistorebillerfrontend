import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useEditProduct from '../Hooks/useEditProduct';
import useCategory from '../Hooks/useCategory';
import { toast } from 'react-toastify';
import {
  MdArrowBack,
  MdChevronRight,
  MdInventory,
  MdDescription,
  MdCurrencyRupee,
  MdNumbers,
  MdCheck,
  MdCalculate,
  MdAutoFixHigh
} from 'react-icons/md'

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
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcData, setCalcData] = useState({ billTotal: '', billQty: '', overhead: '0' });
  const [calcResult, setCalcResult] = useState(0);

  useEffect(() => {
    const total = Number(calcData.billTotal) || 0;
    const qty = Number(calcData.billQty) || 1;
    const overhead = Number(calcData.overhead) || 0;
    if (total > 0 && qty > 0) {
      const base = total / qty;
      setCalcResult(base + (base * (overhead / 100)));
    }
  }, [calcData]);

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
    productCost: Yup.number(),
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
          <div className="w-20 h-20 rounded-3xl bg-primary text-white flex items-center justify-center text-4xl shadow-premium shadow-primary/30">
            <MdInventory />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900 mb-1">Update Asset Profile</h1>
            <p className="text-surface-500 font-medium font-bold text-xs uppercase tracking-widest">Calibration for SKU: {id.slice(-8)}</p>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden shadow-2xl relative">
        <div className="p-12 relative">
          <Formik
            initialValues={initialValue}
            validationSchema={productSchema}
            onSubmit={handleUpdate}
          >
            {({ errors, touched, handleBlur, handleSubmit, handleChange, values, setFieldValue }) => (
              <form onSubmit={handleSubmit} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                  {/* Left Column: Data Set Primary */}
                  <div className="space-y-8 md:pr-8 md:border-r-2 border-surface-50">
                    <div className="relative">
                      <label className="block text-[10px] font-black text-surface-400 uppercase tracking-[3px] mb-4 ml-1">Primary Tamil Identity</label>
                      <div className="relative">
                        <MdDescription className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-400 text-xl" />
                        <input className="premium-input w-full h-16 pl-14 font-black text-lg" type="text" name="productName" value={values.productName} onBlur={handleBlur} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="relative">
                      <label className="block text-[10px] font-black text-surface-400 uppercase tracking-[3px] mb-4 ml-1">Secondary English Identity</label>
                      <div className="flex gap-3">
                        <input className="premium-input flex-1 h-16 font-black text-lg" type="text" name="tanglishName" value={values.tanglishName} onBlur={handleBlur} onChange={handleChange} />
                        <button
                          type="button"
                          onClick={() => transliterateToTamil(values.tanglishName, setFieldValue)}
                          className="w-16 h-16 rounded-2xl bg-surface-900 text-white flex items-center justify-center hover:bg-primary transition-all shadow-xl active:scale-95 text-2xl font-bold shrink-0 border-2 border-white/10"
                        >
                          அ
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-2">
                      <div>
                        <label className="block text-[10px] font-black text-surface-400 uppercase tracking-[3px] mb-4 ml-1">Asset Class</label>
                        <select className="premium-input w-full h-16 appearance-none font-bold" name="productType" value={values.productType} onBlur={handleBlur} onChange={handleChange}>
                          <option value="">Select</option>
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-surface-400 uppercase tracking-[3px] mb-4 ml-1">Measurement</label>
                        <div className="flex gap-3">
                          <input className="premium-input w-2/3 h-16 font-black" type="number" name="unitValue" value={values.unitValue} onBlur={handleBlur} onChange={handleChange} />
                          <select className="premium-input w-1/3 h-16 appearance-none text-center font-bold" name="qantityType" value={values.qantityType} onBlur={handleBlur} onChange={handleChange}>
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

                  {/* Right Column: Financial Set */}
                  <div className="space-y-8">
                    <div>
                      <div className="flex justify-between items-center mb-4 ml-1">
                        <label className="block text-[10px] font-black text-surface-400 uppercase tracking-[3px]">Inbound Cost</label>
                        <button
                          type="button"
                          onClick={() => setShowCalculator(!showCalculator)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 ${showCalculator ? 'bg-primary text-white border-2 border-primary/20 shadow-lg' : 'bg-surface-900 text-white hover:bg-primary border-2 border-white/10'}`}
                        >
                          <MdCalculate className="text-sm" /> Billing Calc
                        </button>
                      </div>

                      {showCalculator && (
                        <div className="mb-8 p-6 bg-primary/5 rounded-3xl border-2 border-primary/20 animate-in zoom-in-95 duration-200 shadow-2xl shadow-primary/10 space-y-5">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest">Total Bill ₹</p>
                              <input type="number" placeholder="0.00" className="w-full h-12 px-5 bg-white border-2 border-surface-200 rounded-2xl font-black text-lg focus:border-primary transition-all outline-none" value={calcData.billTotal} onChange={(e) => setCalcData({ ...calcData, billTotal: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                              <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest">Bulk Qty</p>
                              <input type="number" placeholder="1" className="w-full h-12 px-5 bg-white border-2 border-surface-200 rounded-2xl font-black text-lg focus:border-primary transition-all outline-none" value={calcData.billQty} onChange={(e) => setCalcData({ ...calcData, billQty: e.target.value })} />
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-6 border-t border-primary/10">
                            <div>
                              <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest">Derived Unit Cost</p>
                              <p className="text-3xl font-display font-black text-primary">₹{calcResult.toFixed(2)}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => { setFieldValue('productCost', calcResult.toFixed(2)); setShowCalculator(false); }}
                              className="h-14 px-8 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-[2px] shadow-xl shadow-primary/30 active:scale-95 transition-all"
                            >
                              Apply Cost
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="relative">
                        <MdCurrencyRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-400 text-xl" />
                        <input className="premium-input w-full h-16 pl-14 font-black text-lg text-surface-600" type="number" name="productCost" value={values.productCost} onBlur={handleBlur} onChange={handleChange} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <label className="block text-[10px] font-black text-surface-400 uppercase tracking-[3px] mb-4 ml-1">Selling Rate</label>
                        <div className="relative">
                          <MdCurrencyRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-400 text-xl" />
                          <input className="premium-input w-full h-16 pl-14 font-black text-lg text-primary" type="number" name="productPrice" value={values.productPrice} onBlur={handleBlur} onChange={handleChange} />
                        </div>
                        {values.productCost && values.productPrice && (
                          <div className="mt-4 p-5 rounded-3xl bg-surface-900 border border-primary/20 flex items-center justify-between shadow-xl">
                            <div>
                              <p className="text-[9px] font-black text-primary/60 uppercase tracking-[3px] mb-1">Live Profit</p>
                              <p className={`text-2xl font-display font-black ${values.productPrice - values.productCost > 0 ? 'text-success' : 'text-error'}`}>
                                {(((values.productPrice - values.productCost) / values.productPrice) * 100).toFixed(1)}% <span className="text-xs uppercase opacity-70">Mar</span>
                              </p>
                            </div>
                            <div className={`px-4 py-2 rounded-xl text-xs font-black shadow-lg ${values.productPrice - values.productCost > 0 ? 'bg-success text-white' : 'bg-error text-white'}`}>
                              ₹{(values.productPrice - values.productCost).toFixed(2)}
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-surface-400 uppercase tracking-[3px] mb-4 ml-1">Market MRP</label>
                        <div className="relative">
                          <MdCurrencyRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-400 text-xl opacity-40" />
                          <input className="premium-input w-full h-16 pl-14 font-bold text-lg" type="number" name="MRP" value={values.MRP} onBlur={handleBlur} onChange={handleChange} />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <label className="block text-[10px] font-black text-surface-400 uppercase tracking-[3px] mb-4 ml-1">Stock Portfolio</label>
                        <div className="relative">
                          <MdNumbers className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-400 text-xl" />
                          <input className="premium-input w-full h-16 pl-14 font-black text-lg" type="number" name="stockQuantity" value={values.stockQuantity} onBlur={handleBlur} onChange={handleChange} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-4 ml-1">
                          <label className="block text-[10px] font-black text-surface-400 uppercase tracking-[3px]">ID / Barcode</label>
                          <button
                            type="button"
                            onClick={() => {
                              const genId = 'VB' + Math.random().toString(36).substring(2, 7).toUpperCase() + Date.now().toString().slice(-4);
                              setFieldValue('productCode', genId);
                              toast.info("Unique Barcode Generated", { autoClose: 1500 });
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-md active:scale-95 border-2 border-white/10"
                          >
                            <MdAutoFixHigh className="text-sm" /> Generate
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            className={`premium-input w-full h-16 font-black text-lg tracking-widest ${errors.productCode && touched.productCode ? 'border-error ring-4 ring-error/5' : ''}`}
                            type="text"
                            name="productCode"
                            value={values.productCode}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Scan/Type"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-12 border-t-2 border-surface-50 flex flex-col md:flex-row justify-between items-center gap-8">
                  <button type="button" onClick={() => navigate('/product')} className="group flex items-center gap-3 font-black text-surface-400 hover:text-surface-900 transition-all uppercase text-[11px] tracking-[3px]">
                    <MdArrowBack className="text-xl group-hover:-translate-x-1 transition-transform" /> Discard Changes
                  </button>
                  <button type="submit" disabled={loading} className="premium-button h-20 px-16 bg-primary text-white flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[3px] shadow-3xl shadow-primary/40 rounded-3xl active:scale-[0.98] min-w-[320px]">
                    {loading ? <span className="loading loading-spinner loading-lg"></span> : <><MdCheck className="text-3xl" /> Commit Profile Update</>}
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