import React, { useState, useEffect } from 'react';
import AxiosService from '../common/Axioservice';
import { toast } from 'react-toastify';
import {
  MdAccountBalance, MdTrendingUp, MdAccountBalanceWallet,
  MdCheckCircle, MdLockClock, MdLockOpen, MdNightlightRound,
  MdHistory, MdPriceChange, MdReceiptLong
} from 'react-icons/md';

function FinanceHub() {
  const [activeTab, setActiveTab] = useState('pnl');
  const [pnlData, setPnlData] = useState(null);
  const [cashShift, setCashShift] = useState(null);
  const [shiftHistory, setShiftHistory] = useState([]);
  const [dayEndSummary, setDayEndSummary] = useState(null);
  const [dayEndHistory, setDayEndHistory] = useState([]);
  const [priceLogs, setPriceLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showDayEndModal, setShowDayEndModal] = useState(false);

  const [openingCashInput, setOpeningCashInput] = useState('');
  const [actualCashInput, setActualCashInput] = useState('');
  const [notesInput, setNotesInput] = useState('');

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      const [pnlRes, shiftRes, histRes, daySummaryRes, dayHistRes, priceLogRes] = await Promise.allSettled([
        AxiosService.get('/report/pnl'),
        AxiosService.get('/cashdrawer/active'),
        AxiosService.get('/cashdrawer/history'),
        AxiosService.get('/dayend/summary'),
        AxiosService.get('/dayend/history'),
        AxiosService.get('/product/price-logs')
      ]);

      if (pnlRes.status === 'fulfilled') setPnlData(pnlRes.value.data);
      if (shiftRes.status === 'fulfilled') setCashShift(shiftRes.value.data);
      if (histRes.status === 'fulfilled') setShiftHistory(histRes.value.data.shifts || []);
      if (daySummaryRes.status === 'fulfilled') setDayEndSummary(daySummaryRes.value.data.todaySummary);
      if (dayHistRes.status === 'fulfilled') setDayEndHistory(dayHistRes.value.data.history || []);
      if (priceLogRes.status === 'fulfilled') setPriceLogs(priceLogRes.value.data.logs || []);
    } catch (err) {
      console.error('Finance hub fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const handleOpenShift = async (e) => {
    e.preventDefault();
    try {
      const res = await AxiosService.post('/cashdrawer/open', {
        openingCash: Number(openingCashInput || 0),
        notes: notesInput
      });
      toast.success(res.data.message || 'Cash register shift opened!');
      setShowOpenModal(false);
      setOpeningCashInput('');
      setNotesInput('');
      fetchFinancialData();
    } catch (err) {
      toast.error('Failed to open cash shift');
    }
  };

  const handleCloseShift = async (e) => {
    e.preventDefault();
    try {
      const res = await AxiosService.post('/cashdrawer/close', {
        actualClosingCash: Number(actualCashInput || 0),
        notes: notesInput
      });
      toast.success(res.data.message || 'Cash drawer shift closed & audited!');
      setShowCloseModal(false);
      setActualCashInput('');
      setNotesInput('');
      fetchFinancialData();
    } catch (err) {
      toast.error('Failed to close cash shift');
    }
  };

  const handleCompleteDayEnd = async (e) => {
    e.preventDefault();
    try {
      const res = await AxiosService.post('/dayend/close', {
        actualDrawerCash: Number(actualCashInput || dayEndSummary?.expectedDrawerCash || 0),
        notes: notesInput || 'Day End Night Closure'
      });
      toast.success(res.data.message || 'Day End EOD Closure Completed!');
      setShowDayEndModal(false);
      setActualCashInput('');
      setNotesInput('');
      fetchFinancialData();
    } catch (err) {
      toast.error('Failed to complete Day End closure');
    }
  };

  const displayPnl = pnlData || { grossSales: 0, totalCOGS: 0, totalExpenses: 0, grossProfit: 0, netProfit: 0, netMarginPercentage: 0 };
  const displayDayEnd = dayEndSummary || { totalBillsCount: 0, totalSalesAmount: 0, cashSales: 0, onlineSales: 0, creditSales: 0, netProfit: 0, expectedDrawerCash: 0 };

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1400px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-surface-900 flex items-center gap-3">
            <MdAccountBalance className="text-primary text-4xl" /> Retail Financial & Operations Hub
          </h1>
          <p className="text-sm font-bold text-surface-400 mt-1">P&L Statements, Day End EOD Closures, Cash Register Audits, and Price Edit Audit Logs.</p>
        </div>

        <div className="flex flex-wrap gap-2 bg-surface-100 p-1.5 rounded-2xl border border-surface-200">
          <button
            onClick={() => setActiveTab('pnl')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'pnl' ? 'bg-primary text-white shadow-lg' : 'text-surface-500 hover:text-surface-900'}`}
          >
            Profit & Loss (P&L)
          </button>
          <button
            onClick={() => setActiveTab('dayend')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'dayend' ? 'bg-indigo-600 text-white shadow-lg' : 'text-surface-500 hover:text-surface-900'}`}
          >
            🌙 Day End Closure (EOD)
          </button>
          <button
            onClick={() => setActiveTab('cashdrawer')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'cashdrawer' ? 'bg-primary text-white shadow-lg' : 'text-surface-500 hover:text-surface-900'}`}
          >
            Cash Register Audit
          </button>
          <button
            onClick={() => setActiveTab('pricelogs')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'pricelogs' ? 'bg-warning text-white shadow-lg' : 'text-surface-500 hover:text-surface-900'}`}
          >
            Price Edit Logs ({priceLogs.length})
          </button>
        </div>
      </div>

      {/* Tab 1: P&L Statement */}
      {activeTab === 'pnl' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 border-l-4 border-l-primary">
              <p className="text-xs font-black text-surface-400 uppercase tracking-widest">Gross Sales Revenue</p>
              <p className="text-3xl font-display font-black text-primary mt-2">₹{(displayPnl.grossSales || 0).toLocaleString()}</p>
              <p className="text-[10px] font-bold text-surface-400 mt-1">Total Customer Billing</p>
            </div>

            <div className="glass-card p-6 border-l-4 border-l-indigo-500">
              <p className="text-xs font-black text-surface-400 uppercase tracking-widest">Cost of Goods Sold (COGS)</p>
              <p className="text-3xl font-display font-black text-indigo-600 mt-2">₹{(displayPnl.totalCOGS || 0).toLocaleString()}</p>
              <p className="text-[10px] font-bold text-surface-400 mt-1">Inventory Cost Valuation</p>
            </div>

            <div className="glass-card p-6 border-l-4 border-l-error">
              <p className="text-xs font-black text-surface-400 uppercase tracking-widest">Shop Expenses</p>
              <p className="text-3xl font-display font-black text-error mt-2">₹{(displayPnl.totalExpenses || 0).toLocaleString()}</p>
              <p className="text-[10px] font-bold text-surface-400 mt-1">Rent, Electricity, Salaries</p>
            </div>

            <div className="glass-card p-6 border-l-4 border-l-success">
              <p className="text-xs font-black text-surface-400 uppercase tracking-widest">Net Profit</p>
              <p className="text-3xl font-display font-black text-success mt-2">₹{(displayPnl.netProfit || 0).toLocaleString()}</p>
              <p className="text-[10px] font-bold text-success mt-1">{displayPnl.netMarginPercentage || 0}% Net Profit Margin</p>
            </div>
          </div>

          <div className="glass-card p-8 max-w-3xl mx-auto">
            <h3 className="text-xl font-black text-surface-900 mb-6 flex items-center gap-2">
              <MdTrendingUp className="text-primary text-2xl" /> Financial Income Statement
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-surface-50 rounded-2xl border">
                <span className="text-sm font-bold text-surface-700 uppercase">Gross Sales Revenue</span>
                <span className="font-display font-black text-xl text-primary">₹{(displayPnl.grossSales || 0).toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-surface-50 rounded-2xl border">
                <span className="text-sm font-bold text-surface-700 uppercase">(-) Cost of Goods Sold (COGS)</span>
                <span className="font-display font-black text-xl text-indigo-600">- ₹{(displayPnl.totalCOGS || 0).toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-primary/10 rounded-2xl border border-primary/20">
                <span className="text-sm font-black text-primary uppercase">(=) Gross Profit</span>
                <span className="font-display font-black text-2xl text-primary">₹{(displayPnl.grossProfit || 0).toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center p-4 bg-surface-50 rounded-2xl border">
                <span className="text-sm font-bold text-surface-700 uppercase">(-) Operating Shop Expenses</span>
                <span className="font-display font-black text-xl text-error">- ₹{(displayPnl.totalExpenses || 0).toLocaleString()}</span>
              </div>

              <div className="divider my-2"></div>

              <div className="flex justify-between items-center p-6 bg-surface-900 text-white rounded-3xl">
                <div>
                  <p className="text-xs font-black uppercase text-white/50">Net Business Profit</p>
                  <p className="text-3xl font-display font-black text-success mt-1">₹{(displayPnl.netProfit || 0).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <span className="px-4 py-2 bg-success text-white rounded-xl font-black text-sm uppercase">
                    {displayPnl.netMarginPercentage || 0}% Margin
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Day End (EOD) Closure */}
      {activeTab === 'dayend' && (
        <div className="space-y-8">
          <div className="glass-card p-8 bg-surface-900 text-white border-none shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Night Closure EOD Engine</span>
                <h3 className="text-2xl font-black mt-1 flex items-center gap-2">
                  <MdNightlightRound className="text-indigo-400" /> Today's Day End Summary ({new Date().toLocaleDateString()})
                </h3>
              </div>
              <button
                onClick={() => {
                  setActualCashInput(dayEndSummary?.expectedDrawerCash || '');
                  setShowDayEndModal(true);
                }}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase shadow-xl transition-all flex items-center gap-2"
              >
                <MdCheckCircle className="text-lg" /> Complete Day End Closure
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 pt-6 border-t border-white/10">
              <div>
                <p className="text-[10px] font-bold text-white/50 uppercase">Total Bills</p>
                <p className="text-2xl font-display font-black text-white mt-1">{displayDayEnd.totalBillsCount || 0}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/50 uppercase">Total Sales</p>
                <p className="text-2xl font-display font-black text-primary mt-1">₹{(displayDayEnd.totalSalesAmount || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/50 uppercase">Cash Sales</p>
                <p className="text-2xl font-display font-black text-success mt-1">₹{(displayDayEnd.cashSales || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/50 uppercase">Online / UPI</p>
                <p className="text-2xl font-display font-black text-info mt-1">₹{(displayDayEnd.onlineSales || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/50 uppercase">Udhar / Credit</p>
                <p className="text-2xl font-display font-black text-warning mt-1">₹{(displayDayEnd.creditSales || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/50 uppercase">Today Net Profit</p>
                <p className="text-2xl font-display font-black text-success mt-1">₹{(displayDayEnd.netProfit || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-black text-surface-900 mb-4">Past Day End (EOD) Closure Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-50 text-[10px] font-black uppercase text-surface-400 border-b">
                    <th className="p-3">Date</th>
                    <th className="p-3">Closed By</th>
                    <th className="p-3 text-center">Bills</th>
                    <th className="p-3 text-right">Total Sales</th>
                    <th className="p-3 text-right">Cash</th>
                    <th className="p-3 text-right">Online</th>
                    <th className="p-3 text-right">Udhar</th>
                    <th className="p-3 text-right">Net Profit</th>
                    <th className="p-3 text-right">Drawer Discrepancy</th>
                  </tr>
                </thead>
                <tbody>
                  {dayEndHistory.length > 0 ? dayEndHistory.map(d => (
                    <tr key={d._id} className="border-b hover:bg-surface-50/50">
                      <td className="p-3 font-bold text-xs">{new Date(d.date).toLocaleDateString()}</td>
                      <td className="p-3 font-bold text-xs">{d.closedByName || d.closedBy}</td>
                      <td className="p-3 text-center font-bold text-xs">{d.totalBillsCount}</td>
                      <td className="p-3 text-right font-display font-black text-sm text-primary">₹{(d.totalSalesAmount || 0).toLocaleString()}</td>
                      <td className="p-3 text-right font-display font-black text-xs text-success">₹{(d.cashSales || 0).toLocaleString()}</td>
                      <td className="p-3 text-right font-display font-black text-xs text-info">₹{(d.onlineSales || 0).toLocaleString()}</td>
                      <td className="p-3 text-right font-display font-black text-xs text-warning">₹{(d.creditSales || 0).toLocaleString()}</td>
                      <td className="p-3 text-right font-display font-black text-sm text-success">₹{(d.netProfit || 0).toLocaleString()}</td>
                      <td className={`p-3 text-right font-display font-black text-xs ${d.discrepancy < 0 ? 'text-error' : d.discrepancy > 0 ? 'text-warning' : 'text-success'}`}>
                        {d.discrepancy === 0 ? '₹0' : `₹${d.discrepancy}`}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-xs font-bold text-surface-400 uppercase">No EOD Day End Closures Recorded Yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Cash Register Audit */}
      {activeTab === 'cashdrawer' && (
        <div className="space-y-8">
          <div className="glass-card p-8 bg-surface-900 text-white border-none shadow-2xl relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-200">Cash Register Shift</span>
                <h3 className="text-2xl font-black mt-1">
                  Status: {cashShift?.active ? <span className="text-success flex items-center gap-1 inline-flex"><MdLockOpen /> ACTIVE SHIFT</span> : <span className="text-warning flex items-center gap-1 inline-flex"><MdLockClock /> SHIFT CLOSED</span>}
                </h3>
              </div>
              <div>
                {!cashShift?.active ? (
                  <button onClick={() => setShowOpenModal(true)} className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-primary-600 transition-all flex items-center gap-2">
                    <MdLockOpen className="text-lg" /> Open Cash Register Shift
                  </button>
                ) : (
                  <button onClick={() => setShowCloseModal(true)} className="px-6 py-3 bg-error text-white rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-error-600 transition-all flex items-center gap-2">
                    <MdLockClock className="text-lg" /> Audit & Close Cash Shift
                  </button>
                )}
              </div>
            </div>

            {cashShift?.active && cashShift.shift && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
                <div>
                  <p className="text-[10px] font-bold text-white/50 uppercase">Opening Cash</p>
                  <p className="text-2xl font-display font-black text-white mt-1">₹{cashShift.shift.openingCash}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/50 uppercase">Cash Sales Collected</p>
                  <p className="text-2xl font-display font-black text-success mt-1">+ ₹{cashShift.shift.cashSales}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/50 uppercase">Cash Paid Out (Expenses + Vendor)</p>
                  <p className="text-2xl font-display font-black text-error mt-1">- ₹{(cashShift.shift.expensesPaid || 0) + (cashShift.shift.vendorPaymentsPaid || 0)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-primary-200 uppercase">Expected Drawer Cash</p>
                  <p className="text-3xl font-display font-black text-primary mt-1">₹{cashShift.shift.expectedClosingCash}</p>
                </div>
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-black text-surface-900 mb-4">Cash Register Audit History</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-50 text-[10px] font-black uppercase text-surface-400 border-b">
                    <th className="p-3">Shift Date</th>
                    <th className="p-3">Cashier</th>
                    <th className="p-3 text-right">Opening Cash</th>
                    <th className="p-3 text-right">Expected Cash</th>
                    <th className="p-3 text-right">Physical Count</th>
                    <th className="p-3 text-right">Discrepancy</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {shiftHistory.length > 0 ? shiftHistory.map(s => (
                    <tr key={s._id} className="border-b hover:bg-surface-50/50">
                      <td className="p-3 font-bold text-xs">{new Date(s.createdAt).toLocaleDateString()}</td>
                      <td className="p-3 font-bold text-xs">{s.cashierName || 'Cashier'}</td>
                      <td className="p-3 text-right font-display font-black text-sm">₹{s.openingCash}</td>
                      <td className="p-3 text-right font-display font-black text-sm">₹{s.expectedClosingCash}</td>
                      <td className="p-3 text-right font-display font-black text-sm text-primary">₹{s.actualClosingCash}</td>
                      <td className={`p-3 text-right font-display font-black text-sm ${s.discrepancy < 0 ? 'text-error' : s.discrepancy > 0 ? 'text-warning' : 'text-success'}`}>
                        {s.discrepancy === 0 ? '₹0 (Exact)' : `₹${s.discrepancy}`}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase ${s.status === 'OPEN' ? 'bg-success/10 text-success' : 'bg-surface-200 text-surface-600'}`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-xs font-bold text-surface-400 uppercase">No Register Shifts Logged</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Price Edit Audit Logs */}
      {activeTab === 'pricelogs' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-black text-surface-900 mb-4 flex items-center gap-2">
            <MdPriceChange className="text-warning text-2xl" /> Product Price Modification Audit Log
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-50 text-[10px] font-black uppercase text-surface-400 border-b">
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Product Name</th>
                  <th className="p-3 text-right">Selling Price (Old ➔ New)</th>
                  <th className="p-3 text-right">Cost Price (Old ➔ New)</th>
                  <th className="p-3 text-right">MRP (Old ➔ New)</th>
                  <th className="p-3">Modified By</th>
                  <th className="p-3">Reason</th>
                </tr>
              </thead>
              <tbody>
                {priceLogs.length > 0 ? priceLogs.map(log => (
                  <tr key={log._id} className="border-b hover:bg-surface-50/50">
                    <td className="p-3 font-bold text-xs">
                      {new Date(log.createdAt).toLocaleDateString()} <span className="text-surface-400 text-[10px] font-medium">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td className="p-3 font-black text-sm text-surface-900">{log.productName}</td>
                    <td className="p-3 text-right font-display font-black text-xs">
                      <span className="text-surface-400 line-through">₹{log.oldPrice}</span> ➔ <span className="text-primary text-sm">₹{log.newPrice}</span>
                    </td>
                    <td className="p-3 text-right font-display font-black text-xs">
                      <span className="text-surface-400 line-through">₹{log.oldCost}</span> ➔ <span className="text-indigo-600 text-sm">₹{log.newCost}</span>
                    </td>
                    <td className="p-3 text-right font-display font-black text-xs">
                      <span className="text-surface-400 line-through">₹{log.oldMRP}</span> ➔ <span className="text-warning text-sm">₹{log.newMRP}</span>
                    </td>
                    <td className="p-3 font-bold text-xs text-surface-600">{log.modifiedByName || log.modifiedBy}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-surface-100 text-surface-700 text-[10px] font-black uppercase">
                        {log.reason}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-xs font-bold text-surface-400 uppercase">No Product Price Modifications Logged Yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Open Shift Modal */}
      {showOpenModal && (
        <dialog open className="modal backdrop-blur-md bg-surface-900/40">
          <div className="modal-box max-w-md bg-white p-6 rounded-3xl shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="text-xl font-black text-surface-900">Open Cash Register Shift</h3>
              <button onClick={() => setShowOpenModal(false)} className="w-8 h-8 rounded-full bg-surface-100 font-bold text-surface-500 hover:text-error">✕</button>
            </div>
            <form onSubmit={handleOpenShift} className="space-y-4">
              <div>
                <label className="text-xs font-black text-surface-500 uppercase">Starting Drawer Cash (₹) *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  placeholder="e.g. 1000"
                  className="w-full h-14 px-4 bg-surface-50 border rounded-2xl font-display font-black text-xl text-primary mt-1 outline-none focus:border-primary"
                  value={openingCashInput}
                  onChange={(e) => setOpeningCashInput(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-black text-surface-500 uppercase">Shift Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Morning counter start"
                  className="w-full h-12 px-4 bg-surface-50 border rounded-xl font-bold mt-1 text-sm outline-none focus:border-primary"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full h-14 bg-primary text-white rounded-2xl font-black uppercase text-xs shadow-lg hover:bg-primary-600 transition-all flex items-center justify-center gap-2">
                <MdCheckCircle className="text-xl" /> Confirm & Start Shift
              </button>
            </form>
          </div>
        </dialog>
      )}

      {/* Close Shift Modal */}
      {showCloseModal && (
        <dialog open className="modal backdrop-blur-md bg-surface-900/40">
          <div className="modal-box max-w-md bg-white p-6 rounded-3xl shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="text-xl font-black text-surface-900">Audit & Close Cash Shift</h3>
              <button onClick={() => setShowCloseModal(false)} className="w-8 h-8 rounded-full bg-surface-100 font-bold text-surface-500 hover:text-error">✕</button>
            </div>
            <form onSubmit={handleCloseShift} className="space-y-4">
              <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl flex justify-between items-center">
                <span className="text-xs font-black uppercase text-primary">Expected Cash in Drawer</span>
                <span className="text-2xl font-display font-black text-primary">₹{cashShift?.shift?.expectedClosingCash}</span>
              </div>
              <div>
                <label className="text-xs font-black text-surface-500 uppercase">Actual Physical Cash Count (₹) *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  placeholder="0.00"
                  className="w-full h-14 px-4 bg-surface-50 border rounded-2xl font-display font-black text-xl text-success mt-1 outline-none focus:border-primary"
                  value={actualCashInput}
                  onChange={(e) => setActualCashInput(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-black text-surface-500 uppercase">Closing Audit Notes</label>
                <input
                  type="text"
                  placeholder="Optional discrepancy notes..."
                  className="w-full h-12 px-4 bg-surface-50 border rounded-xl font-bold mt-1 text-sm outline-none focus:border-primary"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full h-14 bg-error text-white rounded-2xl font-black uppercase text-xs shadow-lg hover:bg-error-600 transition-all flex items-center justify-center gap-2">
                <MdCheckCircle className="text-xl" /> Audit & Close Register
              </button>
            </form>
          </div>
        </dialog>
      )}

      {/* Complete Day End EOD Modal */}
      {showDayEndModal && (
        <dialog open className="modal backdrop-blur-md bg-surface-900/40">
          <div className="modal-box max-w-md bg-white p-6 rounded-3xl shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="text-xl font-black text-surface-900">Complete Day End (EOD) Closure</h3>
              <button onClick={() => setShowDayEndModal(false)} className="w-8 h-8 rounded-full bg-surface-100 font-bold text-surface-500 hover:text-error">✕</button>
            </div>
            <form onSubmit={handleCompleteDayEnd} className="space-y-4">
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-2">
                <div className="flex justify-between text-xs font-bold text-surface-600">
                  <span>Total Day Sales:</span>
                  <span className="font-black text-primary">₹{(dayEndSummary?.totalSalesAmount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-surface-600">
                  <span>Expected Drawer Cash:</span>
                  <span className="font-black text-success">₹{(dayEndSummary?.expectedDrawerCash || 0).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-surface-500 uppercase">Actual Physical Cash in Drawer (₹) *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  placeholder="0.00"
                  className="w-full h-14 px-4 bg-surface-50 border rounded-2xl font-display font-black text-xl text-indigo-600 mt-1 outline-none focus:border-indigo-500"
                  value={actualCashInput}
                  onChange={(e) => setActualCashInput(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-black text-surface-500 uppercase">Night Closure Remarks / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Counter closed successfully"
                  className="w-full h-12 px-4 bg-surface-50 border rounded-xl font-bold mt-1 text-sm outline-none focus:border-indigo-500"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                />
              </div>

              <button type="submit" className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase text-xs shadow-lg transition-all flex items-center justify-center gap-2">
                <MdCheckCircle className="text-xl" /> Confirm & Lock Day End EOD
              </button>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default FinanceHub;
