import React, { useEffect, useRef, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import JsBarcode from 'jsbarcode';
import PrintBarCode from '../common/PrintBarCode';
import { useReactToPrint } from 'react-to-print'
import { MdPrint, MdQrCode, MdNumbers, MdArrowBack, MdInventory } from 'react-icons/md'
import { Link } from 'react-router-dom'
import GetAllProductHook from '../Hooks/GetAllProductHook'

function BarCodePrinter() {
  const [data, setData] = useState('8901324061239')
  const [printCount, setPrintCount] = useState('1')
  const [barImg, setBarImg] = useState('')
  const [name, setName] = useState('LUBBER')
  const [mrp, setMrp] = useState('10')
  const [qty, setQty] = useState('1PCS')
  const [showPkd, setShowPkd] = useState(false)
  const [pkdDate, setPkdDate] = useState(new Date().toISOString().split('T')[0])
  const [searchInput, setSearchInput] = useState('')

  const { product } = useSelector(state => state.product)
  const { getUSer } = GetAllProductHook()
  const contentRef = useRef(null);

  const filteredProducts = useMemo(() => {
    const term = searchInput.toLowerCase().trim();
    if (!term) return [];
    return product.filter(p =>
      p.productName.toLowerCase().includes(term) ||
      p.productCode.toLowerCase().includes(term) ||
      p.tanglishName?.toLowerCase().includes(term)
    ).slice(0, 10);
  }, [product, searchInput]);

  useEffect(() => {
    if (!product || product.length === 0) {
      getUSer()
    }
    // Generate initial barcode for example
    generateBarcode('8901324061239')
  }, [])

  const generateBarcode = (val) => {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, val, {
      format: "CODE128",
      lineColor: "#000",
      width: 2,
      height: 30,
      displayValue: true,
      fontSize: 14,
      fontOptions: "bold",
      margin: 0,
    });
    setBarImg(canvas.toDataURL("image/png"))
  }

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: 'BarcodeLabels',
  })

  const handleProductSelect = (val) => {
    const fn = product?.find(p => p.productCode === val)
    if (!fn) return

    // Prioritize Tamil name if available, otherwise use English
    setName(fn.tanglishName || fn.productName)
    setMrp(fn.MRP)
    setData(val)
    setQty(`${fn.unitValue || '1'}${fn.qantityType || 'PCS'}`)
    generateBarcode(val)
  }

  return (
    <div className="container mx-auto px-4 py-8 fade-in min-h-screen flex flex-col items-center bg-surface-50">
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-surface-900">Thermal Print Studio</h1>
          <p className="text-sm font-medium text-surface-500 uppercase tracking-widest mt-1">2x1 Inch Label Generator</p>
        </div>
        <Link to="/product" className="btn btn-ghost rounded-xl text-surface-500 gap-2">
          <MdArrowBack /> Back to Inventory
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Configuration Card */}
        <div className="glass-card overflow-hidden shadow-xl">
          <div className="bg-surface-900 p-6 text-white flex items-center gap-3">
            <MdQrCode className="text-2xl" />
            <h2 className="font-bold uppercase tracking-wider text-sm">Configuration</h2>
          </div>

          <div className="p-6 space-y-6">
            <div className="relative">
              <label className="block text-xs font-bold text-surface-500 uppercase mb-2 ml-1">Search & Select Product</label>
              <div className="relative">
                <MdInventory className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  type="text"
                  placeholder="Type product name or code..."
                  className="premium-input w-full h-12 pl-12 pr-4 bg-white font-bold"
                  onChange={(e) => setSearchInput(e.target.value)}
                  value={searchInput}
                />
                {searchInput && filteredProducts.length > 0 && (
                  <div className="absolute top-[110%] left-0 right-0 z-[100] glass-card shadow-2xl border overflow-hidden max-h-[300px] overflow-y-auto">
                    {filteredProducts.map(p => (
                      <button
                        key={p._id}
                        onClick={() => {
                          handleProductSelect(p.productCode);
                          setSearchInput('');
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-primary/5 border-b border-surface-100 flex justify-between items-center transition-all group"
                      >
                        <div>
                          <p className="font-black text-xs text-primary group-hover:text-primary-600 transition-colors uppercase leading-none">
                            {p.tanglishName}
                          </p>
                          <p className="font-bold text-[10px] text-surface-900 mt-1 uppercase tracking-tight">
                            {p.productName}
                          </p>
                          <p className="text-[9px] font-bold text-surface-400 uppercase tracking-tighter flex items-center gap-2 mt-1">
                            {p.productCode} <span className="opacity-30">|</span> <span className="text-secondary font-black">{p.unitValue}{p.qantityType}</span>
                          </p>
                        </div>
                        <p className="font-display font-black text-primary">₹{p.productPrice}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-surface-500 uppercase mb-2 ml-1">Print Quantity</label>
                <div className="relative">
                  <MdNumbers className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                  <input
                    type="number"
                    min="1"
                    className="premium-input w-full h-12 pl-12 font-bold"
                    value={printCount}
                    onChange={(s) => setPrintCount(s.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col justify-end">
                <label className="premium-checkbox-container flex items-center gap-2 cursor-pointer p-3 bg-surface-100 rounded-xl hover:bg-surface-200 transition-colors">
                  <input
                    type="checkbox"
                    checked={showPkd}
                    onChange={(e) => setShowPkd(e.target.checked)}
                    className="w-5 h-5 rounded border-surface-300 text-primary focus:ring-primary"
                  />
                  <span className="text-xs font-bold text-surface-700 uppercase">Show PKD</span>
                </label>
              </div>
            </div>

            {showPkd && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-xs font-bold text-surface-500 uppercase mb-2 ml-1">Manual PKD Date</label>
                <input
                  type="date"
                  className="premium-input w-full h-12 px-4 font-bold"
                  value={pkdDate}
                  onChange={(s) => setPkdDate(s.target.value)}
                />
              </div>
            )}

            <div className="pt-2">
              <button
                className={`premium-button w-full h-14 text-white flex items-center justify-center gap-2 ${(!data || !printCount) ? 'btn-disabled opacity-50' : 'bg-primary shadow-primary/30'}`}
                onClick={handlePrint}
                disabled={!data || !printCount}
              >
                <MdPrint className="text-xl" /> Print Labels
              </button>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div className="glass-card overflow-hidden shadow-xl flex flex-col md:col-span-2">
          <div className="bg-primary p-6 text-white flex items-center justify-between">
            <h2 className="font-bold uppercase tracking-wider text-sm">Live Preview (2-Column Layout)</h2>
            <p className="text-[10px] bg-white/20 px-2 py-1 rounded">Side-by-side Grid</p>
          </div>

          <div className="flex-1 bg-surface-100 p-8">
            {barImg ? (
              <div className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Show up to 4 labels in pairs to demonstrate the 2-column layout */}
                  {[...Array(Math.min(Number(printCount) || 1, 4))].map((_, idx) => (
                    <div key={idx} className="relative group w-full flex justify-center">
                      <div className="bg-white shadow-xl border border-surface-200 overflow-hidden flex flex-col items-center justify-start transition-transform hover:scale-105 duration-300"
                        style={{ width: '192px', height: '96px', padding: '4px' }}>
                        <img src={barImg} alt="Barcode Preview" className="h-[34px] w-full object-contain mb-1" />
                        <div style={{ height: '24px', display: 'flex', alignItems: 'center', width: '100%' }}>
                          <p className="text-[10px] font-extrabold text-black uppercase leading-[1.1] w-full text-center overflow-hidden"
                            style={{ display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical' }}>
                            {name}
                          </p>
                        </div>
                        <div className="w-full flex justify-between items-center mt-1 px-1">
                          <span className="text-[9px] font-bold text-black">{qty}</span>
                          <span className="text-[10px] font-bold text-black">MRP: ₹{mrp}</span>
                        </div>
                        {showPkd && (
                          <div className="text-[8px] font-bold text-black mt-0.5 border-t border-black/10 w-full text-center pt-0.5">
                            PKD: {new Date(pkdDate).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                          </div>
                        )}
                      </div>
                      <div className="absolute top-0 right-[calc(50%-96px)] w-5 h-5 bg-primary text-white text-[10px] flex items-center justify-center rounded-full font-bold shadow-md transform -translate-y-1/2 translate-x-1/2">
                        {idx + 1}
                      </div>
                    </div>
                  ))}

                  {Number(printCount) > 4 && (
                    <div className="flex items-center justify-center w-[192px] h-[96px] border-2 border-dashed border-surface-300 rounded-lg text-surface-400 font-bold text-sm">
                      +{Number(printCount) - 4} more
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-surface-200/50 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-surface-200">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-[11px] font-bold text-surface-600 uppercase tracking-widest">
                      Printing {printCount} Labels • 2-Column (101.6mm × 25.4mm)
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-surface-400">
                <MdQrCode className="text-6xl mb-4 opacity-10" />
                <p className="font-medium">Selected product preview will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden container for printing */}
      <div className="hidden">
        <PrintBarCode props={{ barImg, contentRef, name, mrp, count: printCount, qty, showPkd, pkdDate }} />
      </div>
    </div>
  )
}

export default BarCodePrinter