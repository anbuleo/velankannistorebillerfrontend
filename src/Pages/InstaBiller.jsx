import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  addProductToCart, removeProductFromCart, lessoneproduct,
  addProductOne, customizeProductPrice, addCustomerBillOne,
  resetCart, setActiveBill, addBillTab, removeBillTab,
  ensureActiveBill, handleChangeInKGQty
} from '../common/CartSlice'
import {
  MdSearch, MdPrint, MdSave, MdDelete, MdAdd, MdRemove,
  MdLibraryAdd, MdFactCheck, MdAddCircle, MdClose, MdPerson,
  MdQrCodeScanner, MdPayments, MdHistory, MdKeyboard, MdBackspace, MdCurrencyRupee
} from "react-icons/md";
import genrateBill from '../Hooks/genrateBill';
import { useReactToPrint } from 'react-to-print'
import PrintItems from '../components/PrintItems';
import GetAllProductHook from '../Hooks/GetAllProductHook';

/**
 * InstaBiller: High-Performance POS Interface for Fresh Produce & Retail
 * Senior Developer Edition focusing on speed, resilience, and UX.
 */
function InstaBiller() {
  const dispatch = useDispatch()
  const { getUSer } = GetAllProductHook()

  // UI State
  const [paymentType, setPaymentType] = useState('cash')
  const [paymentStatus, setPaymentStatus] = useState('paid')
  const [searchInput, setSearchInput] = useState('')
  const [customerSearch, setCustomerSearch] = useState('')
  const [showCustomerResults, setShowCustomerResults] = useState(false)
  const [isPickingSlip, setIsPickingSlip] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString())
  const [selectedProductIndex, setSelectedProductIndex] = useState(0)
  const [selectedCustomerIndex, setSelectedCustomerIndex] = useState(-1)
  const [showShortcuts, setShowShortcuts] = useState(false)

  // Refs for focus management
  const searchInputRef = useRef(null)
  const printRef = useRef(null);

  // Redux State
  const { product = [] } = useSelector((state) => state.product)
  const { bills = [], activeBillId } = useSelector((state) => state.cart || { bills: [], activeBillId: null })
  const { customer = [] } = useSelector((state) => state.customer)
  const { balanceSheet = [] } = useSelector((state) => state.balancesheet || { balanceSheet: [] });
  const userData = JSON.parse(localStorage.getItem('data'))
  const isAdmin = userData?.role === 'admin'

  // Current Active Context
  const currentBill = useMemo(() => {
    if (!Array.isArray(bills) || bills.length === 0) return null;
    return bills.find(b => b.id === activeBillId) || bills[0];
  }, [bills, activeBillId]);

  const { cart = [], totalPriceInCart = 0, customeronecart = { name: 'Retail Customer' } } = currentBill || {};

  const { createBill } = genrateBill()

  // Print Logic
  const handleEstimatePrint = useReactToPrint({
    contentRef: printRef,
  });

  /**
   * Performance Optimized Search
   * 10k product search using memoized filtering
   */
  const filteredProducts = useMemo(() => {
    const term = searchInput.toLowerCase().trim();
    if (!term) return [];

    return product
      .filter(p =>
        p.productName.toLowerCase().includes(term) ||
        p.productCode.toLowerCase().includes(term) ||
        p.tanglishName?.toLowerCase().includes(term)
      )
      .slice(0, 15);
  }, [product, searchInput]);

  const filteredCustomers = useMemo(() => {
    const term = customerSearch.toLowerCase().trim();
    if (!term) return customer.slice(0, 5);
    return customer
      .filter(c => c.name.toLowerCase().includes(term) || c.mobile.toLowerCase().includes(term))
      .slice(0, 10);
  }, [customer, customerSearch]);

  /**
   * Action Handlers
   */
  const addToCart = useCallback((p) => {
    dispatch(addProductToCart({
      productId: p._id,
      productName: p.productName,
      productPrice: Number(p.productPrice),
      productCode: p.productCode,
      productUnit: p.unitValue,
      qantityType: p.qantityType,
    }))
    setSearchInput('')
    searchInputRef.current?.focus()
    toast.success(`${p.productName} added`, { autoClose: 500, hideProgressBar: true, position: 'bottom-right' })
  }, [dispatch]);

  const handleSave = async (shouldPrint = false) => {
    if (cart.length === 0) return toast.warning("Workspace empty");

    // Safety: Credit Limit Check
    if (paymentStatus !== 'paid' && customeronecart?._id) {
      const sheet = balanceSheet.find(b => b.customerId === customeronecart._id);
      const currentDebt = sheet?.remainingBalance || 0;
      const limit = customeronecart.creditLimit || 5000;

      if (Number(currentDebt) + Number(totalPriceInCart) > limit) {
        return toast.error(`CREDIT LIMIT EXCEEDED: Limit ₹${limit}, Current Debt ₹${currentDebt}`);
      }
    }

    try {
      await createBill(paymentType, cart, totalPriceInCart, customeronecart, paymentStatus);
      if (shouldPrint) handleEstimatePrint();

      toast.success("Transaction Finalized");
      dispatch(resetCart());
      getUSer();
    } catch (err) {
      toast.error("Process Failed");
    }
  }

  // Keyboard Event Management
  useEffect(() => {
    const handleKeys = (e) => {
      // Functional Keys (Standalone)
      if (e.key === 'F2') { e.preventDefault(); dispatch(addBillTab()); }
      if (e.key === 'F6') { 
        e.preventDefault(); 
        setPaymentType(prev => prev === 'cash' ? 'online' : 'cash');
        toast.info(`Payment: ${paymentType === 'cash' ? 'Online' : 'Cash'}`, { autoClose: 500 });
      }
      if (e.key === 'F7') {
        e.preventDefault();
        if (customeronecart?.name !== 'Retail Customer') {
          setPaymentStatus(prev => prev === 'paid' ? 'pending' : 'paid');
          toast.info(`Status: ${paymentStatus === 'paid' ? 'Credit' : 'Paid'}`, { autoClose: 500 });
        }
      }
      if (e.key === 'F8') { e.preventDefault(); handleSave(false); }
      if (e.key === 'F9') { e.preventDefault(); document.querySelector('input[placeholder="Customer Search..."]')?.focus(); }
      if (e.key === 'F10') { e.preventDefault(); handleSave(true); }
      if (e.key === 'F12') { e.preventDefault(); dispatch(resetCart()); }
      if (e.key === 'Escape') {
        setSearchInput('');
        setCustomerSearch('');
        setShowCustomerResults(false);
        searchInputRef.current?.focus();
      }

      // Alt Key Combinations (Legacy & Backup)
      if (e.altKey) {
        const key = e.key.toLowerCase();
        if (key === 's') { e.preventDefault(); handleSave(false); }
        if (key === 'p') { e.preventDefault(); handleSave(true); }
        if (key === 'f') { e.preventDefault(); searchInputRef.current?.focus(); }
        if (key === 'n') { e.preventDefault(); dispatch(addBillTab()); }
        if (key === 'q') { e.preventDefault(); dispatch(resetCart()); }
        if (key === 'h') { e.preventDefault(); setShowShortcuts(prev => !prev); }
      }

      // Ctrl + Number for Tabs
      if (e.ctrlKey && e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        if (bills[index]) {
          e.preventDefault();
          dispatch(setActiveBill(bills[index].id));
        }
      }
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [cart, totalPriceInCart, customeronecart, paymentStatus, paymentType, bills, dispatch]);

  // Initial Sync
  useEffect(() => {
    dispatch(ensureActiveBill());
    const clock = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(clock);
  }, [dispatch]);

  if (!currentBill) return <div className="h-screen flex items-center justify-center text-primary font-black animate-pulse">Initializing Counter...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1600px] fade-in min-h-screen">

      {/* Upper Navigation & Status */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl shadow-lg shadow-primary/30">
            <MdPayments />
          </div>
          <div>
            <h1 className="text-3xl font-display font-black text-surface-900 leading-none">Checkout</h1>
            <p className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success"></span> Systems Ready • {currentTime}
            </p>
          </div>
        </div>

        {/* Tab Logic - Senior Design */}
        <div className="flex items-center gap-3 bg-surface-100 p-1.5 rounded-2xl border border-surface-200">
          {bills.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => dispatch(setActiveBill(tab.id))}
              className={`relative h-11 px-6 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all overflow-hidden flex items-center gap-3 ${activeBillId === tab.id
                ? 'bg-white text-primary shadow-premium'
                : 'text-surface-400 hover:text-surface-600'
                }`}
            >
              <span className="opacity-40">{idx + 1}</span>
              {tab.customeronecart?.name || tab.name}
              {bills.length > 1 && (
                <MdClose
                  className="hover:text-error transition-colors"
                  onClick={(e) => { e.stopPropagation(); dispatch(removeBillTab(tab.id)); }}
                />
              )}
              {activeBillId === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary"></div>}
            </button>
          ))}
          <button
            onClick={() => dispatch(addBillTab())}
            className="w-11 h-11 rounded-xl bg-white/50 border-2 border-dashed border-surface-300 text-surface-400 hover:border-primary hover:text-primary transition-all flex items-center justify-center"
          >
            <MdAddCircle className="text-xl" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Console: Inventory & Workflow */}
        <div className="lg:col-span-8 space-y-6">

          {/* Main Command Bar */}
          <div className="glass-card p-4 relative z-50">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <MdQrCodeScanner className={`absolute left-4 top-1/2 -translate-y-1/2 text-xl transition-colors ${searchInput ? 'text-primary' : 'text-surface-400'}`} />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Scanner Mode Active: Scan or Search..."
                  className="w-full h-16 pl-14 pr-4 bg-surface-50 border-2 border-surface-100 rounded-2xl text-lg font-bold focus:bg-white focus:border-primary transition-all outline-none"
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setSelectedProductIndex(0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setSelectedProductIndex(prev => Math.min(prev + 1, filteredProducts.length - 1));
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setSelectedProductIndex(prev => Math.max(prev - 1, 0));
                    } else if (e.key === 'Enter' && filteredProducts.length > 0) {
                      e.preventDefault();
                      addToCart(filteredProducts[selectedProductIndex]);
                      setSelectedProductIndex(0);
                    }
                  }}
                />

                {/* Command Results */}
                {searchInput && (
                  <div className="absolute top-[110%] left-0 right-0 glass-card shadow-2xl border-2 border-primary/10 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="bg-surface-50 px-4 py-2 border-b flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-surface-400">
                      <span>Found {filteredProducts.length} items</span>
                      <span className="flex items-center gap-2"><MdKeyboard /> Enter to add first</span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {filteredProducts.map((p, idx) => (
                        <button
                          key={p._id}
                          onClick={() => addToCart(p)}
                          className={`w-full px-6 py-4 flex items-center justify-between border-b border-surface-100 transition-all group ${selectedProductIndex === idx ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-primary/5'}`}
                        >
                          <div className="text-left">
                            <p className="font-black text-primary text-sm uppercase leading-tight">{p.productName}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-surface-900 font-bold uppercase">{p.tanglishName}</span>
                              <span className="text-[10px] text-surface-300 font-bold uppercase tracking-widest leading-none">|</span>
                              <span className="text-[10px] text-secondary font-black uppercase tracking-widest leading-none">{p.unitValue}{p.qantityType}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="font-display font-black text-primary text-xl">₹{p.productPrice}</p>
                              <p className="text-[8px] font-black text-surface-300 line-through">MRP ₹{p.MRP}</p>
                            </div>
                            <div className={`px-2 py-1 rounded bg-surface-100 text-[10px] font-black ${Number(p.stockQuantity) < 10 ? 'text-error' : 'text-success'}`}>
                              STK: {p.stockQuantity}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Node */}
              <div className="relative w-full md:w-[300px]">
                <MdPerson className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-surface-400" />
                <input
                  type="text"
                  placeholder="Customer Search..."
                  className="w-full h-16 pl-14 pr-4 bg-surface-50 border-2 border-surface-100 rounded-2xl font-bold focus:bg-white focus:border-primary transition-all outline-none"
                  value={customerSearch || (customeronecart?.name !== 'Retail Customer' ? customeronecart.name : '')}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    setShowCustomerResults(true);
                    setSelectedCustomerIndex(-1);
                  }}
                  onFocus={() => setShowCustomerResults(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setSelectedCustomerIndex(prev => Math.min(prev + 1, filteredCustomers.length - 1));
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setSelectedCustomerIndex(prev => Math.max(prev - 1, -1));
                    } else if (e.key === 'Enter') {
                      e.preventDefault();
                      if (selectedCustomerIndex === -1) {
                        dispatch(addCustomerBillOne({ name: 'Retail Customer' }));
                        setShowCustomerResults(false);
                        setCustomerSearch('');
                      } else if (filteredCustomers[selectedCustomerIndex]) {
                        const c = filteredCustomers[selectedCustomerIndex];
                        dispatch(addCustomerBillOne(c));
                        setShowCustomerResults(false);
                        setCustomerSearch(c.name);
                      }
                      searchInputRef.current?.focus();
                    }
                  }}
                />
                {showCustomerResults && (
                  <div className="absolute top-[110%] left-0 right-0 glass-card shadow-2xl border overflow-hidden z-[100]">
                    <button
                      onClick={() => { dispatch(addCustomerBillOne({ name: 'Retail Customer' })); setShowCustomerResults(false); setCustomerSearch(''); searchInputRef.current?.focus(); }}
                      className={`w-full px-6 py-3 text-left font-black text-[10px] uppercase border-b transition-all ${selectedCustomerIndex === -1 ? 'bg-primary/10 text-primary' : 'text-surface-400 hover:bg-surface-50'}`}
                    >
                      Guest (Default)
                    </button>
                    {filteredCustomers.map((c, idx) => (
                      <button
                        key={c._id}
                        onClick={() => { dispatch(addCustomerBillOne(c)); setShowCustomerResults(false); setCustomerSearch(c.name); searchInputRef.current?.focus(); }}
                        className={`w-full px-6 py-4 flex flex-col transition-all text-left border-b last:border-0 ${selectedCustomerIndex === idx ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-primary/5'}`}
                      >
                        <span className="font-black text-surface-900 text-sm">{c.name}</span>
                        <span className="text-[10px] font-bold text-surface-400">{c.mobile} • {c.address || 'No Address'}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cart View */}
          <div className="glass-card overflow-hidden">
            <div className="bg-surface-50 py-3 px-6 border-b flex justify-between items-center">
              <h2 className="text-[10px] font-black uppercase tracking-widest text-surface-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Current Workspace Invoice
              </h2>
              <div className="flex gap-4">
                <select
                  className="bg-transparent border-none text-[10px] font-black uppercase text-surface-500 focus:ring-0 cursor-pointer"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                >
                  <option value="cash">Cash Settlement</option>
                  <option value="online">Digital/UPI</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto min-h-[400px]">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th className="w-12 text-center">#</th>
                    <th>Product</th>
                    <th className="text-center w-[200px]">Quantity / Weight</th>
                    <th className="text-right w-[120px]">Price</th>
                    <th className="text-right w-[120px]">Subtotal</th>
                    <th className="w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.length > 0 ? cart.map((item, i) => (
                    <tr key={item.productId} className="hover:bg-surface-50/50 transition-colors h-24">
                      <td className="text-center opacity-30 font-black text-xs">{i + 1}</td>
                      <td>
                        <p className="font-black text-primary uppercase text-sm leading-tight">{item.productName}</p>
                        <p className="text-[10px] font-bold text-surface-900 tracking-tighter flex items-center gap-2 mt-0.5">
                          {item.tanglishName} <span className="opacity-30">|</span> {item.productCode}
                        </p>
                        <p className="text-[9px] font-black text-surface-400 uppercase tracking-widest mt-1">
                          Unit: <span className="text-secondary">{item.productUnit}{item.qantityType}</span>
                        </p>
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-2 group">
                          <button
                            onClick={() => dispatch(lessoneproduct(item.productId))}
                            className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center text-surface-400 hover:bg-error/10 hover:text-error transition-all active:scale-95"
                          >
                            <MdRemove />
                          </button>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.001"
                              value={item.productQuantity}
                              onChange={(e) => dispatch(handleChangeInKGQty({ productId: item.productId, qty: e.target.value }))}
                              className="w-24 h-12 bg-surface-50 border-2 border-surface-100 rounded-xl text-center font-display font-black text-lg focus:border-primary focus:bg-white transition-all outline-none"
                            />
                            <div className="absolute top-1/2 -translate-y-1/2 right-2 text-[8px] font-black text-surface-300 uppercase select-none">
                              {item.qantityType}
                            </div>
                          </div>
                          <button
                            onClick={() => dispatch(addProductOne(item.productId))}
                            className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all active:scale-95"
                          >
                            <MdAdd />
                          </button>
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="flex items-center justify-end group">
                          <MdCurrencyRupee className="text-[10px] opacity-20 group-focus-within:opacity-100 transition-opacity" />
                          <input
                            type="number"
                            defaultValue={item.productPrice}
                            disabled={!isAdmin}
                            className="w-20 text-right bg-transparent border-none font-display font-black text-sm text-surface-400 focus:text-primary transition-colors focus:ring-0"
                            onChange={(e) => dispatch(customizeProductPrice({ productId: item.productId, customPrice: e.target.value }))}
                          />
                        </div>
                      </td>
                      <td className="text-right font-display font-black text-surface-900 text-lg">
                        ₹{item.productTotal}
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => dispatch(removeProductFromCart(item.productId))}
                          className="w-10 h-10 flex items-center justify-center text-surface-200 hover:text-error transition-colors"
                        >
                          <MdDelete className="text-xl" />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="py-40 text-center">
                        <div className="max-w-[200px] mx-auto opacity-10">
                          <MdQrCodeScanner className="text-8xl mx-auto mb-4" />
                          <p className="font-black text-sm uppercase tracking-widest leading-loose">Waiting for Entry...</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Panel: Logistics & Checkout */}
        <div className="lg:col-span-4 space-y-6">

          {/* Financial Context Card */}
          <div className="glass-card p-6 bg-surface-900 text-white border-none shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/20 transition-all duration-1000"></div>

            <div className="flex justify-between items-start mb-10">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-200 mb-1">Settlement Mode</h4>
                <select
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-black uppercase text-primary-200 focus:outline-none focus:bg-white/10"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                >
                  <option value="paid" className="text-surface-900">Instant Settlement</option>
                  <option value="pending" className="text-surface-900" disabled={customeronecart?.name === 'Retail Customer'}>Convert to Credit</option>
                  <option value="partial" className="text-surface-900" disabled={customeronecart?.name === 'Retail Customer'}>Split Payment</option>
                </select>
              </div>
              <div className="text-right">
                <MdFactCheck className="text-4xl text-primary opacity-50" />
              </div>
            </div>

            <div className="space-y-4 mb-10">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white/50 uppercase">Order Volume</span>
                <span className="font-black">{cart.length} SKUs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white/50 uppercase">Customer Node</span>
                <span className="font-black text-primary-200 uppercase tracking-tighter truncate max-w-[150px]">{customeronecart?.name}</span>
              </div>
              <div className="divider opacity-5 my-2"></div>
              <div className="flex justify-between items-end">
                <span className="text-sm font-black uppercase text-white/40">Grand Total</span>
                <div className="text-right">
                  <p className="text-[10px] font-black text-primary uppercase text-right mb-1">INR (Inclusive TAX)</p>
                  <p className="text-5xl font-display font-black text-primary tracking-tighter leading-none">₹{totalPriceInCart}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                disabled={cart.length === 0}
                onClick={() => handleSave(true)}
                className="premium-button w-full h-16 bg-primary text-white flex items-center justify-center gap-3 text-lg hover:shadow-primary/40 transition-all active:scale-95"
              >
                <MdPrint className="text-2xl" /> Commit & Print Invoice
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  disabled={cart.length === 0}
                  onClick={() => handleSave(false)}
                  className="h-12 border-2 border-white/10 rounded-xl font-black text-[10px] uppercase hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                  <MdSave className="text-base" /> Quick Save
                </button>
                <button
                  onClick={() => dispatch(resetCart())}
                  className="h-12 border-2 border-white/10 rounded-xl font-black text-[10px] uppercase hover:bg-error/10 hover:text-error hover:border-error/20 transition-all flex items-center justify-center gap-2"
                >
                  <MdBackspace className="text-base" /> Clear Workspace
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats / History Integration */}
          <div className="glass-card p-6 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-surface-400 flex items-center gap-2">
              <MdHistory className="text-primary text-lg" /> Recent Node Activity
            </h4>
            <div className="space-y-4">
              {isAdmin ? (
                <>
                  <button
                    onClick={() => { setIsPickingSlip(false); document.getElementById('view_estimate').showModal(); }}
                    className="w-full h-12 flex items-center justify-between px-6 rounded-xl bg-surface-50 hover:bg-white border-2 border-surface-100 transition-all group"
                  >
                    <span className="text-[10px] font-black uppercase text-surface-500 group-hover:text-primary transition-colors">Visual Preview Log</span>
                    <MdFactCheck className="text-xl text-surface-300 group-hover:text-primary transition-colors" />
                  </button>
                  <button
                    onClick={() => { setIsPickingSlip(true); document.getElementById('view_estimate').showModal(); }}
                    className="w-full h-12 flex items-center justify-between px-6 rounded-xl bg-surface-50 hover:bg-white border-2 border-surface-100 transition-all group"
                  >
                    <span className="text-[10px] font-black uppercase text-surface-500 group-hover:text-indigo-500 transition-colors">Generate Picking Slip</span>
                    <MdLibraryAdd className="text-xl text-surface-300 group-hover:text-indigo-500 transition-colors" />
                  </button>
                </>
              ) : (
                <div className="p-10 text-center opacity-20">
                  <MdKeyboard className="text-4xl mx-auto mb-2" />
                  <p className="text-[10px] font-black uppercase italic">Standard Ops Mode</p>
                </div>
              )}
            </div>
          </div>

          {/* Shortcut Legend - Professional POS UX */}
          <div className="glass-card p-6 bg-surface-50 border-2 border-primary/5">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-surface-400 mb-4 flex items-center gap-2">
              <MdKeyboard className="text-primary text-lg" /> Command Shortcuts
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'F2', label: 'New Bill' },
                { key: 'F6', label: 'Payment Mode' },
                { key: 'F8', label: 'Quick Save' },
                { key: 'F9', label: 'Search Client' },
                { key: 'F10', label: 'Print Bill' },
                { key: 'F12', label: 'Clear All' },
                { key: 'ESC', label: 'Reset Focus' },
                { key: 'Tab', label: 'Switch Input' },
              ].map(s => (
                <div key={s.key} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-surface-100 shadow-sm transition-all hover:border-primary/20">
                  <span className="text-[10px] font-black text-surface-400 uppercase">{s.label}</span>
                  <kbd className="px-2 py-0.5 rounded bg-surface-900 text-white text-[10px] font-display font-black min-w-[32px] text-center">{s.key}</kbd>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-surface-200 flex items-center justify-between overflow-hidden">
               <span className="text-[9px] font-black text-surface-400 uppercase">Tab Switching</span>
               <div className="flex gap-1">
                 {[1,2,3].map(n => <span key={n} className="px-1.5 py-0.5 rounded bg-surface-200 text-[8px] font-black">^ + {n}</span>)}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Senior Modal Infrastructure */}
      <dialog id="view_estimate" className="modal backdrop-blur-md">
        <div className="modal-box max-w-2xl bg-white p-0 overflow-hidden rounded-[2rem] shadow-2xl">
          <div className="p-8 bg-surface-50 border-b flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-display font-black text-surface-900 leading-none">Document Preview</h3>
              <p className="text-[10px] font-black text-surface-400 uppercase mt-1 tracking-widest">Digital Terminal Draft</p>
            </div>
            <form method="dialog"><button className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:text-error transition-colors"><MdClose className="text-xl" /></button></form>
          </div>
          <div className="p-10">
            <div className="border border-dashed border-surface-300 rounded-[1.5rem] p-8 bg-surface-50/50">
              <PrintItems props={{ cart, totalPriceInCart, customeronecart, time: currentTime, today: new Date().toLocaleDateString(), contentRef: null, isPickingSlip }} />
            </div>

            {/* Print Engine Target */}
            <div className="hidden">
              <div ref={printRef}>
                <PrintItems props={{ cart, totalPriceInCart, customeronecart, time: currentTime, today: new Date().toLocaleDateString(), contentRef: null, isPickingSlip }} />
              </div>
            </div>
          </div>
          <div className="p-8 bg-surface-50 border-t flex justify-end gap-3">
            <form method="dialog"><button className="h-14 px-8 font-black uppercase text-xs text-surface-400 hover:text-surface-900 transition-colors">Discard</button></form>
            <button
              onClick={handleEstimatePrint}
              className="h-14 px-10 bg-primary text-white rounded-2xl font-black uppercase text-xs shadow-xl shadow-primary/20 flex items-center gap-3 transition-transform active:scale-95"
            >
              <MdPrint className="text-xl" /> Print Physical Copy
            </button>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default InstaBiller