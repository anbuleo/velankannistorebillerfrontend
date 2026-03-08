import React, { useState, useEffect } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import useCreateProduct from '../Hooks/useCreateProduct';
import useCategory from '../Hooks/useCategory';
import { toast } from 'react-toastify';
import useVoiceCommand from '../Hooks/useVoiceCommand';
import {
  MdArrowBack,
  MdChevronRight,
  MdInventory,
  MdDescription,
  MdCurrencyRupee,
  MdNumbers,
  MdLibraryAdd,
  MdFactCheck,
  MdMic,
  MdCalculate,
  MdAutoFixHigh
} from 'react-icons/md'

const VoiceHint = ({ en, ta, active }) => (
  <span className={`inline-flex items-center gap-1.5 ml-3 transition-all duration-500 pointer-events-none transform ${active ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
    <span className="px-1.5 py-0.5 rounded-md bg-primary/10 text-primary text-[9px] font-black lowercase tracking-tighter border border-primary/10">"{en}"</span>
    <span className="px-1.5 py-0.5 rounded-md bg-error/10 text-error text-[9px] font-black lowercase tracking-tighter border border-error/10">"{ta}"</span>
  </span>
);

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
  const [showVoiceGuide, setShowVoiceGuide] = useState(false);
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

  const handleCreate = async (values, { resetForm }) => {
    const res = await createProduct(values)
    if (res && res.status === 201) {
      if (isFinishMode) {
        navigate('/product')
      } else {
        resetForm()
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
          <Link to="/product" className="hover:text-primary transition-colors uppercase tracking-widest text-[10px]">Inventory Hub</Link>
          <MdChevronRight className="text-lg opacity-40" />
          <span className="text-surface-900 uppercase tracking-widest text-[10px]">Rapid Entry</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowVoiceGuide(!showVoiceGuide)} className="w-10 h-10 rounded-xl bg-surface-100 text-surface-400 flex items-center justify-center hover:bg-surface-200 transition-all font-bold">?</button>
          <div className="badge badge-primary font-bold px-4 py-4 rounded-lg shadow-lg">Mode: Rapid Add</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-primary text-white flex items-center justify-center text-4xl shadow-premium shadow-primary/30">
            <MdInventory />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-surface-900 mb-1">Bulk Product Entry</h1>
            <p className="text-surface-500 font-medium font-bold text-xs uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> Dual Language Voice AI Ready
            </p>
          </div>
        </div>
      </div>

      {showVoiceGuide && (
        <div className="glass-card mb-12 p-8 border-l-8 border-primary animate-in fade-in slide-in-from-top-6 duration-500 shadow-2xl">
          <h4 className="text-sm font-black text-surface-900 uppercase tracking-widest mb-6 flex items-center gap-3">
            <MdMic className="text-primary text-xl" /> AI Voice Command Laboratory
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4 pt-2 border-t border-surface-100">
              <p className="text-[10px] font-black text-primary uppercase tracking-[3px]">Global English Mode</p>
              <div className="grid grid-cols-1 gap-2.5 text-xs font-bold text-surface-600 uppercase tracking-wider">
                <div className="p-3 bg-surface-50 rounded-xl border border-surface-100 italic">"Name Sugar" / "Price 50" / "Generate ID"</div>
                <div className="p-3 bg-surface-50 rounded-xl border border-surface-100 italic">"Category Grocery" / "Unit 5" / "Measure KG"</div>
                <div className="p-3 bg-primary/10 text-primary rounded-xl border border-primary/20 font-black">"Save & Finish" / "Submit Entry"</div>
              </div>
            </div>
            <div className="space-y-4 pt-2 border-t border-error/20">
              <p className="text-[10px] font-black text-error uppercase tracking-[3px]">தமிழ் பயன்முறை</p>
              <div className="grid grid-cols-1 gap-2.5 text-xs font-bold text-surface-600 uppercase tracking-wider">
                <div className="p-3 bg-surface-50 rounded-xl border border-surface-100 italic">"பெயர் சர்க்கரை" / "விலை 50" / "உருவாக்கு"</div>
                <div className="p-3 bg-surface-50 rounded-xl border border-surface-100 italic">"வகை மளிகை" / "அளவு 5" / "அளவீடு கிலோ"</div>
                <div className="p-3 bg-error/10 text-error rounded-xl border border-error/20 font-black">"சேமி" / "முடிக்கவும்"</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card overflow-hidden shadow-2xl relative">
        <Formik
          initialValues={{
            productName: '', tanglishName: '', productType: '', unitValue: '',
            qantityType: 'PCS', productCost: '', productPrice: '', MRP: '', stockQuantity: '', productCode: ''
          }}
          validationSchema={productSchema}
          onSubmit={handleCreate}
        >
          {({ errors, touched, handleBlur, handleSubmit, handleChange, values, setFieldValue, submitForm }) => {
            const { isListening, toggleListening, lastUpdatedField, transcript, toggleLang } = useVoiceCommand(
              setFieldValue,
              values,
              submitForm,
              (val) => transliterateToTamil(val, setFieldValue),
              categories
            );

            return (
              <div className="relative">
                <div className="bg-surface-50 p-8 border-b border-surface-100 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 shadow-sm">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xs font-black text-surface-400 uppercase tracking-[2px] leading-none">Voice Neural Interface</h3>
                    <div className={`mt-2 py-3 px-6 bg-white rounded-2xl border-2 transition-all duration-300 ${transcript ? 'border-primary shadow-lg scale-100' : 'border-transparent opacity-40 scale-95'}`}>
                      <p className="text-sm font-black text-primary italic lowercase tracking-wide flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-primary animate-ping' : 'bg-surface-300'}`}></span>
                        {transcript || (isListening ? 'listening for commands...' : 'ready for interaction')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={toggleLang}
                      className="px-6 h-14 rounded-2xl bg-surface-900 text-white font-black text-xs uppercase tracking-[3px] transition-all hover:bg-black active:scale-95 shadow-xl border-2 border-white/10"
                    >
                      EN ⇆ தமிழ்
                    </button>

                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`group flex items-center gap-4 px-8 h-14 rounded-2xl font-black uppercase tracking-[2px] text-xs transition-all border-2 shadow-2xl active:scale-95 ${isListening
                        ? 'bg-primary text-white border-primary ring-8 ring-primary/10'
                        : 'bg-white text-surface-900 border-surface-200 hover:border-primary hover:text-primary'
                        }`}
                    >
                      {isListening ? (
                        <><div className="flex gap-1"><span className="w-1.5 h-4 bg-white/50 animate-bounce"></span><span className="w-1.5 h-4 bg-white animate-bounce delay-75"></span><span className="w-1.5 h-4 bg-white/50 animate-bounce delay-150"></span></div> Active</>
                      ) : (
                        <><MdMic className="text-xl" /> Voice AI</>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-12 relative">
                  <form onSubmit={handleSubmit} className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                      {/* Section A: Identification */}
                      <div className="space-y-8 md:pr-8 md:border-r-2 border-surface-50">
                        <div className="relative">
                          <label className="group block text-[10px] font-black text-surface-400 uppercase tracking-[3px] mb-4 ml-1">
                            Primary Tamil Identity <VoiceHint en="product" ta="பொருள்" active={isListening} />
                          </label>
                          <div className={`relative transition-all duration-500 rounded-2xl ${lastUpdatedField === 'productName' ? 'ring-8 ring-primary/10 scale-[1.03] shadow-2xl' : ''}`}>
                            <MdDescription className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-400 text-xl" />
                            <input
                              className={`premium-input w-full h-16 pl-14 font-black text-lg ${errors.productName && touched.productName ? 'border-error ring-4 ring-error/5' : ''}`}
                              type="text"
                              name="productName"
                              placeholder="சர்க்கரை"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.productName}
                            />
                          </div>
                        </div>

                        <div className="relative">
                          <label className="group block text-[10px] font-black text-surface-400 uppercase tracking-[3px] mb-4 ml-1">
                            Secondary English Identity <VoiceHint en="name" ta="பெயர்" active={isListening} />
                          </label>
                          <div className={`flex gap-3 transition-all duration-500 rounded-2xl ${lastUpdatedField === 'tanglishName' ? 'ring-8 ring-primary/10 scale-[1.03] shadow-2xl' : ''}`}>
                            <input
                              className={`premium-input flex-1 h-16 font-black text-lg ${errors.tanglishName && touched.tanglishName ? 'border-error ring-4 ring-error/5' : ''}`}
                              type="text"
                              name="tanglishName"
                              placeholder="Type 'Sugar'"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.tanglishName}
                            />
                            <button
                              type="button"
                              onClick={() => transliterateToTamil(values.tanglishName, setFieldValue)}
                              className="w-16 h-16 rounded-2xl bg-surface-900 text-white flex items-center justify-center hover:bg-primary transition-all shadow-xl active:scale-95 text-2xl font-bold shrink-0 border-2 border-white/10"
                              title="Sync to Tamil"
                            >
                              அ
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 pt-2">
                          <div>
                            <label className="group block text-[10px] font-black text-surface-400 uppercase tracking-[3px] mb-4 ml-1">
                              Asset Class <VoiceHint en="category" ta="வகை" active={isListening} />
                            </label>
                            <div className={`transition-all duration-500 rounded-2xl ${lastUpdatedField === 'productType' ? 'ring-8 ring-primary/10 scale-[1.03]' : ''}`}>
                              <select className={`premium-input w-full h-16 appearance-none font-bold ${errors.productType && touched.productType ? 'border-error' : ''}`} name="productType" onBlur={handleBlur} onChange={handleChange} value={values.productType}>
                                <option value="">Select</option>
                                {categories.map((cat) => (
                                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="group block text-[10px] font-black text-surface-400 uppercase tracking-[3px] mb-4 ml-1">
                              Measurement <VoiceHint en="measure" ta="அளவீடு" active={isListening} />
                            </label>
                            <div className={`flex gap-3 transition-all duration-500 rounded-2xl ${lastUpdatedField === 'unitValue' || lastUpdatedField === 'qantityType' ? 'ring-8 ring-primary/10 scale-[1.03]' : ''}`}>
                              <input className={`premium-input w-2/3 h-16 font-black ${errors.unitValue && touched.unitValue ? 'border-error' : ''}`} type="number" name="unitValue" onBlur={handleBlur} onChange={handleChange} value={values.unitValue} />
                              <select className={`premium-input w-1/3 h-16 appearance-none text-center font-bold ${errors.qantityType && touched.qantityType ? 'border-error' : ''}`} name="qantityType" onBlur={handleBlur} onChange={handleChange} value={values.qantityType}>
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

                      {/* Section B: Economics */}
                      <div className="space-y-8">
                        <div>
                          <div className="flex justify-between items-center mb-4 ml-1">
                            <label className="block text-[10px] font-black text-surface-400 uppercase tracking-[3px]">
                              Inbound Cost <VoiceHint en="cost" ta="அடக்கம்" active={isListening} />
                            </label>
                            <button
                              type="button"
                              onClick={() => setShowCalculator(!showCalculator)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 ${showCalculator ? 'bg-primary text-white border-2 border-primary/20' : 'bg-surface-900 text-white hover:bg-primary border-2 border-white/10'}`}
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

                          <div className={`relative transition-all duration-500 rounded-2xl ${lastUpdatedField === 'productCost' ? 'ring-8 ring-primary/10 scale-[1.03]' : ''}`}>
                            <MdCurrencyRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-400 text-xl" />
                            <input className="premium-input w-full h-16 pl-14 font-black text-lg text-surface-600" type="number" name="productCost" onBlur={handleBlur} onChange={handleChange} value={values.productCost} />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                          <div>
                            <label className="group block text-[10px] font-black text-surface-400 uppercase tracking-[3px] mb-4 ml-1">
                              Selling Rate <VoiceHint en="price" ta="விலை" active={isListening} />
                            </label>
                            <div className={`relative transition-all duration-500 rounded-2xl ${lastUpdatedField === 'productPrice' ? 'ring-8 ring-primary/10 scale-[1.03] shadow-2xl' : ''}`}>
                              <MdCurrencyRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-400 text-xl" />
                              <input className="premium-input w-full h-16 pl-14 font-black text-lg text-primary" type="number" name="productPrice" onBlur={handleBlur} onChange={handleChange} value={values.productPrice} />
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
                            <label className="group block text-[10px] font-black text-surface-400 uppercase tracking-[3px] mb-4 ml-1">
                              Market MRP <VoiceHint en="mrp" ta="எம்ஆர்பி" active={isListening} />
                            </label>
                            <div className={`relative transition-all duration-500 rounded-2xl ${lastUpdatedField === 'MRP' ? 'ring-8 ring-primary/10 scale-[1.03]' : ''}`}>
                              <MdCurrencyRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-400 text-xl opacity-40" />
                              <input className="premium-input w-full h-16 pl-14 font-bold text-lg" type="number" name="MRP" onBlur={handleBlur} onChange={handleChange} value={values.MRP} />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                          <div>
                            <label className="group block text-[10px] font-black text-surface-400 uppercase tracking-[3px] mb-4 ml-1">
                              Initial Stock <VoiceHint en="stock" ta="இருப்பு" active={isListening} />
                            </label>
                            <div className={`relative transition-all duration-500 rounded-2xl ${lastUpdatedField === 'stockQuantity' ? 'ring-8 ring-primary/10 scale-[1.03]' : ''}`}>
                              <MdNumbers className="absolute left-5 top-1/2 -translate-y-1/2 text-surface-400 text-xl" />
                              <input className="premium-input w-full h-16 pl-14 font-black text-lg" type="number" name="stockQuantity" onBlur={handleBlur} onChange={handleChange} value={values.stockQuantity} />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-4 ml-1">
                              <label className="group block text-[10px] font-black text-surface-400 uppercase tracking-[3px]">
                                ID / Barcode <VoiceHint en="barcode" ta="பார்கோடு" active={isListening} />
                              </label>
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
                            <div className={`relative transition-all duration-500 rounded-2xl ${lastUpdatedField === 'productCode' ? 'ring-8 ring-primary/10 scale-[1.03]' : lastUpdatedField === 'barcode' ? 'ring-8 ring-primary/10 scale-[1.03] shadow-2xl' : ''}`}>
                              <input
                                className={`premium-input w-full h-16 font-black text-lg tracking-widest ${errors.productCode && touched.productCode ? 'border-error ring-4 ring-error/5' : ''}`}
                                type="text"
                                name="productCode"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.productCode}
                                placeholder="Scan or type"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-12 border-t-2 border-surface-50 flex flex-col lg:flex-row justify-between items-center gap-8">
                      <Link to="/product" className="group flex items-center gap-3 font-black text-surface-400 hover:text-surface-900 transition-all uppercase text-[11px] tracking-[3px]">
                        <MdArrowBack className="text-xl group-hover:-translate-x-1 transition-transform" /> Exit Module
                      </Link>

                      <div className="flex flex-col sm:flex-row gap-5 w-full lg:w-auto">
                        <button
                          type="submit"
                          disabled={loading}
                          onClick={() => setIsFinishMode(false)}
                          className="premium-button h-20 px-10 bg-surface-900 text-white flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[3px] rounded-3xl"
                        >
                          <MdLibraryAdd className="text-2xl" /> Save & Next
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          onClick={() => setIsFinishMode(true)}
                          className="premium-button h-20 px-14 bg-primary text-white flex items-center justify-center gap-4 text-xs font-black uppercase tracking-[3px] shadow-3xl shadow-primary/40 rounded-3xl active:scale-[0.98]"
                        >
                          {loading ? <span className="loading loading-spinner loading-lg"></span> : <><MdFactCheck className="text-2xl" /> Commit & Finish</>}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            );
          }}
        </Formik>
      </div>
    </div>
  )
}

export default CreateProduct