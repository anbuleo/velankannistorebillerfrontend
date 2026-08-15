import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import {
  MdShoppingBag, MdAdd, MdDelete, MdCheckCircle, MdOutlineHourglassEmpty,
  MdPrint, MdContentCopy, MdArrowForward, MdSearch, MdCalendarToday,
  MdRefresh, MdLocalShipping, MdStorefront, MdDoneAll, MdClose
} from 'react-icons/md'
import AxiosService from '../common/Axioservice'
import { toast } from 'react-toastify'

/**
 * Stock Purchase & Wholesale Buying Slip Module (`/purchase-slip`)
 * 100% Isolated Procurement Management System for Grocery Shop Owners.
 */
function PurchaseSlip() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [slips, setSlips] = useState([])
  const [activeSlip, setActiveSlip] = useState(null)
  const [loading, setLoading] = useState(false)

  // Draft Builder Item Input State
  const [productSearch, setProductSearch] = useState('')
  const [itemName, setItemName] = useState('')
  const [quantityNeeded, setQuantityNeeded] = useState('')
  const [unit, setUnit] = useState('Pcs')
  const [vendorName, setVendorName] = useState('')
  const [notes, setNotes] = useState('')
  const [showProductDropdown, setShowProductDropdown] = useState(false)

  // Redux Product Master for Autocomplete
  const { product = [] } = useSelector((state) => state.product || { product: [] })

  // Fetch Slips for Selected Date
  const fetchSlips = async (dateStr) => {
    setLoading(true)
    try {
      const res = await AxiosService.get(`/purchaseslip/all?date=${dateStr}`)
      const fetchedSlips = res.data?.slips || []
      setSlips(fetchedSlips)

      if (fetchedSlips.length > 0) {
        setActiveSlip(fetchedSlips[0])
      } else {
        setActiveSlip(null)
      }
    } catch (error) {
      toast.error('Failed to load purchase slips')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlips(selectedDate)
  }, [selectedDate])

  // Filter products for autocomplete
  const matchedProducts = useMemo(() => {
    const term = productSearch.toLowerCase().trim()
    if (!term) return []
    return product.filter(p =>
      (p.productName || '').toLowerCase().includes(term) ||
      (p.productCode || '').toLowerCase().includes(term) ||
      (p.tanglishName || '').toLowerCase().includes(term)
    ).slice(0, 6)
  }, [product, productSearch])

  // Select item from master autocomplete
  const handleSelectProduct = (p) => {
    setItemName(p.productName)
    setUnit(p.qantityType || 'Pcs')
    setProductSearch(p.productName)
    setShowProductDropdown(false)
  }

  // Create new Slip
  const handleCreateNewSlip = async () => {
    try {
      const res = await AxiosService.post('/purchaseslip/create', {
        slipDate: selectedDate,
        title: `Stock Buying Slip - ${selectedDate}`,
        items: []
      })
      if (res.status === 201) {
        toast.success('New Buying Slip Created!')
        fetchSlips(selectedDate)
      }
    } catch (error) {
      toast.error('Failed to create slip')
    }
  }

  // Add Item to Active Slip
  const handleAddItem = async (e) => {
    e.preventDefault()
    const nameToUse = itemName || productSearch
    if (!nameToUse.trim()) return toast.warning('Please enter an item name')
    if (!quantityNeeded.trim()) return toast.warning('Please enter quantity needed')

    const newItem = {
      itemName: nameToUse.trim(),
      quantityNeeded: quantityNeeded.trim(),
      unit: unit || 'Pcs',
      vendorName: vendorName.trim() || 'General Market',
      isPurchased: false,
      actualCost: 0,
      notes: notes.trim()
    }

    let updatedItems = activeSlip ? [...(activeSlip.items || []), newItem] : [newItem]

    try {
      if (activeSlip && activeSlip._id) {
        const res = await AxiosService.put(`/purchaseslip/update/${activeSlip._id}`, {
          items: updatedItems
        })
        if (res.status === 200) {
          setActiveSlip(res.data.slip)
          toast.success(`Added ${nameToUse} to slip`)
        }
      } else {
        // Auto create slip if none exists
        const res = await AxiosService.post('/purchaseslip/create', {
          slipDate: selectedDate,
          title: `Stock Buying Slip - ${selectedDate}`,
          items: updatedItems
        })
        if (res.status === 201) {
          setActiveSlip(res.data.slip)
          toast.success(`Created slip & added ${nameToUse}`)
        }
      }

      // Reset form
      setProductSearch('')
      setItemName('')
      setQuantityNeeded('')
      setNotes('')
    } catch (error) {
      toast.error('Failed to save item')
    }
  }

  // Toggle item purchased status
  const handleToggleItemPurchased = async (itemIdx) => {
    if (!activeSlip) return
    const updatedItems = activeSlip.items.map((item, idx) => {
      if (idx === itemIdx) {
        return { ...item, isPurchased: !item.isPurchased }
      }
      return item
    })

    try {
      const res = await AxiosService.put(`/purchaseslip/update/${activeSlip._id}`, {
        items: updatedItems
      })
      if (res.status === 200) {
        setActiveSlip(res.data.slip)
      }
    } catch (error) {
      toast.error('Failed to update item status')
    }
  }

  // Delete item from slip
  const handleDeleteItem = async (itemIdx) => {
    if (!activeSlip) return
    const updatedItems = activeSlip.items.filter((_, idx) => idx !== itemIdx)

    try {
      const res = await AxiosService.put(`/purchaseslip/update/${activeSlip._id}`, {
        items: updatedItems
      })
      if (res.status === 200) {
        setActiveSlip(res.data.slip)
        toast.info('Item removed')
      }
    } catch (error) {
      toast.error('Failed to delete item')
    }
  }

  // Update actual cost
  const handleCostChange = async (itemIdx, costVal) => {
    if (!activeSlip) return
    const updatedItems = activeSlip.items.map((item, idx) => {
      if (idx === itemIdx) {
        return { ...item, actualCost: Number(costVal) || 0 }
      }
      return item
    })

    try {
      const res = await AxiosService.put(`/purchaseslip/update/${activeSlip._id}`, {
        items: updatedItems
      })
      if (res.status === 200) {
        setActiveSlip(res.data.slip)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Manual Carryover Engine: Copy pending items to next day
  const handleCarryoverPending = async () => {
    if (!activeSlip || !activeSlip._id) return
    const pendingItems = (activeSlip.items || []).filter(i => !i.isPurchased)
    if (pendingItems.length === 0) {
      return toast.info('All items in this slip are already purchased! No pending items to carry over.')
    }

    // Tomorrow's date
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().split('T')[0]

    try {
      const res = await AxiosService.post(`/purchaseslip/carryover/${activeSlip._id}`, {
        targetDate: tomorrowStr
      })

      if (res.status === 201) {
        toast.success(`Carried over ${pendingItems.length} unfulfilled items to tomorrow (${tomorrowStr})!`)
        setSelectedDate(tomorrowStr)
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Carryover failed'
      toast.error(msg)
    }
  }

  // Copy WhatsApp Text Format
  const handleCopyWhatsApp = () => {
    if (!activeSlip || !activeSlip.items || activeSlip.items.length === 0) {
      return toast.warning('No items to copy')
    }

    let text = `📦 *STOCK PURCHASE SLIP - ${activeSlip.slipDate}*\n`
    text += `----------------------------------------\n`
    activeSlip.items.forEach((item, i) => {
      const statusIcon = item.isPurchased ? '✅' : '⏳'
      text += `${i + 1}. ${item.itemName} - ${item.quantityNeeded} ${item.unit} (${item.vendorName}) ${statusIcon}\n`
    })
    text += `----------------------------------------\n`
    text += `Generated via Velankanni Store Biller`

    navigator.clipboard.writeText(text)
    toast.success('Copied WhatsApp Procurement Slip to clipboard!')
  }

  // Print Slip Handler
  const handlePrint = () => {
    window.print()
  }

  const itemsList = activeSlip?.items || []
  const purchasedCount = itemsList.filter(i => i.isPurchased).length
  const pendingCount = itemsList.length - purchasedCount
  const totalActualCost = itemsList.reduce((acc, cur) => acc + (Number(cur.actualCost) || 0), 0)

  return (
    <div className="container mx-auto px-4 py-8 fade-in min-h-screen">
      
      {/* Header & Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl shadow-lg shadow-primary/30">
              <MdShoppingBag />
            </div>
            <div>
              <h1 className="text-3xl font-display font-black text-surface-900 leading-none">
                Stock Procurement & Buying Slip
              </h1>
              <p className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Isolated Wholesale Procurement Engine
              </p>
            </div>
          </div>
        </div>

        {/* Date Selector & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 glass-card px-4 py-2 border-primary/20">
            <MdCalendarToday className="text-primary text-base" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none focus:ring-0 font-bold text-xs text-surface-900 outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="px-3 py-2 bg-surface-100 border border-surface-200 rounded-xl text-xs font-bold uppercase text-surface-600 hover:bg-white"
          >
            Today
          </button>

          <button
            onClick={handleCopyWhatsApp}
            disabled={itemsList.length === 0}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-50"
          >
            <MdContentCopy className="text-base" /> WhatsApp Format
          </button>

          <button
            onClick={handlePrint}
            disabled={itemsList.length === 0}
            className="px-4 py-2.5 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-600 transition-all disabled:opacity-50"
          >
            <MdPrint className="text-base" /> Print Slip
          </button>
        </div>
      </div>

      {/* Main Grid: Add Item Form & Active Slip List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Draft Builder Form */}
        <div className="lg:col-span-5">
          <div className="glass-card p-6 border-l-4 border-primary">
            <h3 className="font-display font-bold text-surface-900 text-lg mb-1 flex items-center gap-2">
              <MdAdd className="text-primary text-xl" /> Add Stock to Buying Slip
            </h3>
            <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-6">
              Search existing catalog or type custom items
            </p>

            <form onSubmit={handleAddItem} className="space-y-4">
              
              {/* Product Autocomplete Search */}
              <div className="relative">
                <label className="text-[10px] font-black uppercase text-surface-500 tracking-wider mb-1 block">
                  Product / Item Name *
                </label>
                <div className="relative">
                  <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 text-base" />
                  <input
                    type="text"
                    placeholder="Search Catalog or Type Custom Item..."
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value)
                      setItemName(e.target.value)
                      setShowProductDropdown(true)
                    }}
                    onFocus={() => setShowProductDropdown(true)}
                    className="w-full pl-9 pr-3 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-xs font-bold focus:bg-white focus:border-primary transition-all outline-none"
                  />
                </div>

                {/* Autocomplete Dropdown */}
                {showProductDropdown && matchedProducts.length > 0 && (
                  <div className="absolute top-[105%] left-0 right-0 z-50 glass-card shadow-2xl border border-primary/20 max-h-48 overflow-y-auto">
                    {matchedProducts.map(p => (
                      <div
                        key={p._id}
                        onClick={() => handleSelectProduct(p)}
                        className="p-2.5 hover:bg-primary/10 border-b border-surface-100 cursor-pointer flex items-center justify-between text-xs font-bold"
                      >
                        <div>
                          <p className="text-primary font-black uppercase">{p.productName}</p>
                          <p className="text-[9px] text-surface-400">{p.tanglishName} | {p.productCode}</p>
                        </div>
                        <span className="badge badge-primary text-[9px] font-black">{p.qantityType}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quantity & Unit Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase text-surface-500 tracking-wider mb-1 block">
                    Quantity Needed *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5, 10, 25"
                    value={quantityNeeded}
                    onChange={(e) => setQuantityNeeded(e.target.value)}
                    className="w-full px-3 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-xs font-bold focus:bg-white focus:border-primary transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-surface-500 tracking-wider mb-1 block">
                    Packaging Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-xs font-bold focus:bg-white focus:border-primary transition-all outline-none"
                  >
                    <option value="Pcs">Pcs / Pack</option>
                    <option value="Kg">Kg</option>
                    <option value="Bags">Bags / Sack</option>
                    <option value="Boxes">Boxes / Cartons</option>
                    <option value="Bundles">Bundles</option>
                    <option value="Liters">Liters / Tins</option>
                  </select>
                </div>
              </div>

              {/* Preferred Vendor / Market Supplier */}
              <div>
                <label className="text-[10px] font-black uppercase text-surface-500 tracking-wider mb-1 block">
                  Supplier / Vendor (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sri Murugan Traders / Market"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-xs font-bold focus:bg-white focus:border-primary transition-all outline-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-[10px] font-black uppercase text-surface-500 tracking-wider mb-1 block">
                  Notes / Specification
                </label>
                <input
                  type="text"
                  placeholder="e.g. Brand 50kg bag, Grade A quality"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-xs font-bold focus:bg-white focus:border-primary transition-all outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-600 transition-all flex items-center justify-center gap-2"
              >
                <MdAdd className="text-lg" /> Add Item To Buying Slip
              </button>

            </form>
          </div>
        </div>

        {/* Right Column: Wholesale Buying Slip Workspace */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card p-6 flex flex-col h-[650px] justify-between">
            
            {/* Slip Header Info */}
            <div className="border-b border-surface-100 pb-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-black text-surface-900 text-lg">
                    {activeSlip ? activeSlip.title : `Stock Buying Slip - ${selectedDate}`}
                  </h3>
                  <span className={`badge text-[9px] font-black uppercase text-white ${
                    activeSlip?.status === 'COMPLETED' ? 'bg-emerald-500' :
                    activeSlip?.status === 'PARTIAL' ? 'bg-amber-500' : 'bg-surface-700'
                  }`}>
                    {activeSlip?.status || 'DRAFT'}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-surface-400 uppercase mt-0.5">
                  Total Items: {itemsList.length} | Purchased: {purchasedCount} | Pending: {pendingCount}
                </p>
              </div>

              {/* Manual Carryover Trigger Button */}
              {pendingCount > 0 && (
                <button
                  onClick={handleCarryoverPending}
                  className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-amber-600 transition-all flex items-center gap-2 shrink-0 active:scale-95"
                  title="Copy unfulfilled pending items to tomorrow's buying list"
                >
                  <MdArrowForward className="text-base" /> Carryover Pending to Tomorrow
                </button>
              )}
            </div>

            {/* Slip Items Table */}
            <div className="flex-1 overflow-y-auto">
              <table className="premium-table">
                <thead className="sticky top-0 bg-surface-100 z-10">
                  <tr>
                    <th className="w-10 text-center">Done</th>
                    <th>Item & Supplier</th>
                    <th className="text-center">Quantity</th>
                    <th className="text-right w-28">Actual Cost (₹)</th>
                    <th className="w-12 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {itemsList.length > 0 ? (
                    itemsList.map((item, idx) => (
                      <tr key={idx} className={`hover:bg-surface-50 transition-colors ${item.isPurchased ? 'bg-emerald-500/5' : ''}`}>
                        <td className="text-center">
                          <input
                            type="checkbox"
                            checked={item.isPurchased}
                            onChange={() => handleToggleItemPurchased(idx)}
                            className="checkbox checkbox-primary checkbox-sm cursor-pointer"
                          />
                        </td>
                        <td>
                          <p className={`font-black text-xs uppercase ${item.isPurchased ? 'line-through text-surface-400' : 'text-surface-900'}`}>
                            {item.itemName}
                          </p>
                          <p className="text-[9px] font-bold text-primary uppercase">
                            Supplier: {item.vendorName || 'General Market'}
                          </p>
                          {item.notes && (
                            <p className="text-[9px] text-surface-400 font-medium italic">{item.notes}</p>
                          )}
                        </td>
                        <td className="text-center font-black text-xs text-surface-700">
                          {item.quantityNeeded} <span className="text-[9px] text-surface-400 font-bold uppercase">{item.unit}</span>
                        </td>
                        <td className="text-right">
                          <input
                            type="number"
                            placeholder="0"
                            value={item.actualCost || ''}
                            onChange={(e) => handleCostChange(idx, e.target.value)}
                            className="w-20 px-2 py-1 bg-surface-50 border border-surface-200 rounded-lg text-xs font-bold text-right outline-none focus:bg-white focus:border-primary"
                          />
                        </td>
                        <td className="text-center">
                          <button
                            onClick={() => handleDeleteItem(idx)}
                            className="text-surface-400 hover:text-error transition-colors p-1"
                            title="Remove Item"
                          >
                            <MdDelete className="text-lg" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-24 text-surface-400 italic text-xs font-bold uppercase tracking-widest">
                        No items added to today's procurement slip yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Summary Bar */}
            <div className="pt-4 mt-4 border-t border-surface-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-surface-400 uppercase">
                  Progress: <strong className="text-surface-900">{purchasedCount} / {itemsList.length} Purchased</strong>
                </span>
                {pendingCount > 0 && (
                  <span className="badge badge-amber text-[9px] font-black uppercase text-white">
                    {pendingCount} Pending Unfulfilled
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-surface-400 uppercase">Total Slip Outflow</p>
                <p className="text-xl font-display font-black text-surface-900">₹{totalActualCost.toLocaleString()}</p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Official Thermal Print Layout (Hidden on Screen, Visible on Print) */}
      <div 
        className="hidden print:block text-black bg-white select-none" 
        id="thermal-purchase-slip"
        style={{ 
          width: '300px', 
          margin: '0 auto',
          fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif",
          fontWeight: 900,
          color: '#000000',
          WebkitFontSmoothing: 'antialiased'
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            @page { 
              size: 80mm auto; 
              margin: 0; 
            }
            html, body {
              margin: 0 !important;
              padding: 0 !important;
              width: 80mm !important;
              background: white !important;
              color: black !important;
              font-weight: 900 !important;
            }
            #thermal-purchase-slip { 
              display: block !important;
              width: 80mm !important; 
              margin: 0 !important;
              padding: 4px !important;
              font-weight: 900 !important;
            }
            * {
              font-weight: 900 !important;
              color: #000000 !important;
            }
          }
        ` }} />

        {/* Header Section */}
        <div className="text-center mb-2">
          <h2 className="text-lg font-extrabold uppercase leading-tight" style={{ fontWeight: 900 }}>
            வேளாங்கண்ணி ஸ்டோர்
          </h2>
          <p className="text-xs font-black uppercase tracking-widest mt-0.5" style={{ fontWeight: 900 }}>
            STOCK PROCUREMENT SLIP
          </p>
          <p className="text-xs font-black mt-1" style={{ fontWeight: 900 }}>
            ====================================
          </p>
        </div>

        {/* Meta Details */}
        <div className="flex justify-between text-xs mb-2 px-1 font-extrabold" style={{ fontWeight: 900 }}>
          <div>
            <p className="font-extrabold" style={{ fontWeight: 900 }}>DATE: {selectedDate}</p>
            <p className="font-extrabold" style={{ fontWeight: 900 }}>SLIP: {activeSlip?.title || 'PROCUREMENT'}</p>
          </div>
          <div className="text-right">
            <p className="font-extrabold" style={{ fontWeight: 900 }}>ITEMS: {itemsList.length}</p>
            <p className="font-extrabold" style={{ fontWeight: 900 }}>PENDING: {pendingCount}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="border-t-2 border-b-2 border-black py-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-extrabold border-b-2 border-black" style={{ fontWeight: 900 }}>
                <th className="py-1"># ITEM</th>
                <th className="text-center py-1">QTY</th>
                <th className="text-right py-1">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {itemsList.map((item, i) => (
                <tr key={i} className="text-xs font-extrabold border-b border-gray-300 last:border-0" style={{ fontWeight: 900 }}>
                  <td className="py-1 align-top">
                    <div className="uppercase">
                      <span className="font-extrabold text-xs" style={{ fontWeight: 900 }}>
                        {i + 1}. {item.itemName}
                      </span>
                      <span className="text-[10px] font-extrabold block text-gray-800" style={{ fontWeight: 900 }}>
                        SUP: {item.vendorName || 'General Market'}
                      </span>
                    </div>
                  </td>
                  <td className="text-center py-1 align-top font-extrabold text-xs" style={{ fontWeight: 900 }}>
                    {item.quantityNeeded} {item.unit}
                  </td>
                  <td className="text-right py-1 align-top font-extrabold text-xs" style={{ fontWeight: 900 }}>
                    {item.isPurchased ? '[BOUGHT]' : '[PENDING]'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals / Summary */}
        <div className="mt-2 space-y-1 px-1 font-extrabold" style={{ fontWeight: 900 }}>
          <div className="flex justify-between text-xs font-extrabold border-b-2 border-dashed border-black pb-1.5" style={{ fontWeight: 900 }}>
            <span>PROGRESS:</span>
            <span className="text-xs font-extrabold" style={{ fontWeight: 900 }}>{purchasedCount} / {itemsList.length} BOUGHT</span>
          </div>
          {totalActualCost > 0 && (
            <div className="flex justify-between items-center text-sm font-extrabold pt-1" style={{ fontWeight: 900 }}>
              <span>TOTAL COST:</span>
              <span className="text-lg font-extrabold tracking-tight" style={{ fontWeight: 900 }}>₹{totalActualCost.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Footer Remarks */}
        <div className="mt-4 text-center border-t-2 border-dashed border-black pt-3">
          <p className="text-xs font-extrabold">====================================</p>
          <p className="text-xs uppercase font-extrabold mt-2" style={{ fontWeight: 900 }}>PURCHASER SIGNATURE</p>
          <div className="h-10"></div>
        </div>

        {/* Paper Cutter Margin */}
        <div className="h-14"></div>
      </div>

    </div>
  )
}

export default PurchaseSlip
