import React, { useState, useEffect } from 'react';
import AxiosService from '../common/Axioservice';
import { toast } from 'react-toastify';
import { MdLocalShipping, MdBusiness, MdReceipt, MdCheckCircle, MdPayments, MdHistory, MdListAlt } from 'react-icons/md';

function PurchaseManage() {
  const [activeTab, setActiveTab] = useState('suppliers');
  const [suppliers, setSuppliers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [paymentLogs, setPaymentLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // New Supplier Form
  const [supplierForm, setSupplierForm] = useState({
    supplierName: '', companyName: '', mobile: '', email: '', gstin: '', address: ''
  });

  // Fast Vendor Purchase Form (Direct Total Bill Entry)
  const [purchaseForm, setPurchaseForm] = useState({
    supplierId: '',
    billNumber: '',
    totalAmount: '',
    paidAmount: '',
    notes: ''
  });

  // Record Payment to Vendor State
  const [selectedVendorForPayment, setSelectedVendorForPayment] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMode: 'Cash',
    notes: ''
  });

  // View Vendor Specific Ledger Modal State
  const [viewingVendorLedger, setViewingVendorLedger] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [supRes, purRes, payRes] = await Promise.allSettled([
        AxiosService.get('/supplier/all'),
        AxiosService.get('/purchase/all'),
        AxiosService.get('/supplier/payments')
      ]);
      if (supRes.status === 'fulfilled') setSuppliers(supRes.value.data.suppliers || []);
      if (purRes.status === 'fulfilled') setPurchases(purRes.value.data.purchases || []);
      if (payRes.status === 'fulfilled') setPaymentLogs(payRes.value.data.paymentLogs || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateSupplier = async (e) => {
    e.preventDefault();
    try {
      await AxiosService.post('/supplier/create', supplierForm);
      toast.success('Supplier added successfully');
      setSupplierForm({ supplierName: '', companyName: '', mobile: '', email: '', gstin: '', address: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating supplier');
    }
  };

  const totalBillValuation = Number(purchaseForm.totalAmount || 0);
  const paidNowValuation = Number(purchaseForm.paidAmount || 0);
  const remainingDueValuation = Math.max(0, totalBillValuation - paidNowValuation);

  const handleCreatePurchase = async (e) => {
    e.preventDefault();
    if (!purchaseForm.supplierId) return toast.warning('Select a vendor / supplier');
    if (totalBillValuation <= 0) return toast.warning('Total bill amount must be greater than 0');

    try {
      await AxiosService.post('/purchase/create', {
        supplierId: purchaseForm.supplierId,
        billNumber: purchaseForm.billNumber,
        totalAmount: totalBillValuation,
        paidAmount: paidNowValuation,
        notes: purchaseForm.notes
      });
      toast.success('Wholesale bill logged & vendor balance updated!');
      setPurchaseForm({
        supplierId: '',
        billNumber: '',
        totalAmount: '',
        paidAmount: '',
        notes: ''
      });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record purchase entry');
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!selectedVendorForPayment) return;
    if (Number(paymentForm.amount) <= 0) return toast.warning('Enter valid payment amount');

    try {
      const res = await AxiosService.post('/supplier/pay', {
        supplierId: selectedVendorForPayment._id,
        amount: Number(paymentForm.amount),
        paymentMode: paymentForm.paymentMode,
        notes: paymentForm.notes
      });
      toast.success(res.data.message || 'Vendor cash payment recorded!');
      setSelectedVendorForPayment(null);
      setPaymentForm({ amount: '', paymentMode: 'Cash', notes: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record vendor payment');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1400px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-surface-900 flex items-center gap-3">
            <MdLocalShipping className="text-primary text-4xl" /> Wholesale & Vendor Payables
          </h1>
          <p className="text-sm font-bold text-surface-400 mt-1">Directly record total vendor bills, cash debt payments, and track payment history logs.</p>
        </div>

        <div className="flex flex-wrap gap-2 bg-surface-100 p-1.5 rounded-2xl border border-surface-200">
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'suppliers' ? 'bg-primary text-white shadow-lg' : 'text-surface-500 hover:text-surface-900'}`}
          >
            Vendors ({suppliers.length})
          </button>
          <button
            onClick={() => setActiveTab('new_purchase')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'new_purchase' ? 'bg-primary text-white shadow-lg' : 'text-surface-500 hover:text-surface-900'}`}
          >
            + Log Purchase Bill
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'history' ? 'bg-primary text-white shadow-lg' : 'text-surface-500 hover:text-surface-900'}`}
          >
            Bills History ({purchases.length})
          </button>
          <button
            onClick={() => setActiveTab('payments_log')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'payments_log' ? 'bg-success text-white shadow-lg' : 'text-surface-500 hover:text-surface-900'}`}
          >
            Pay Cash Log ({paymentLogs.length})
          </button>
        </div>
      </div>

      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 glass-card p-6">
            <h3 className="text-lg font-black text-surface-900 mb-4 flex items-center gap-2">
              <MdBusiness className="text-primary" /> Add New Wholesale Vendor
            </h3>
            <form onSubmit={handleCreateSupplier} className="space-y-4">
              <div>
                <label className="text-xs font-black text-surface-500 uppercase">Supplier / Contact Person *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full h-12 px-4 bg-surface-50 border rounded-xl font-bold mt-1 text-sm outline-none focus:border-primary"
                  value={supplierForm.supplierName}
                  onChange={(e) => setSupplierForm({ ...supplierForm, supplierName: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-black text-surface-500 uppercase">Company / Agency Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sri Lakshmi Wholesale Traders"
                  className="w-full h-12 px-4 bg-surface-50 border rounded-xl font-bold mt-1 text-sm outline-none focus:border-primary"
                  value={supplierForm.companyName}
                  onChange={(e) => setSupplierForm({ ...supplierForm, companyName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-surface-500 uppercase">Mobile Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="10 digit mobile"
                    className="w-full h-12 px-4 bg-surface-50 border rounded-xl font-bold mt-1 text-sm outline-none focus:border-primary"
                    value={supplierForm.mobile}
                    onChange={(e) => setSupplierForm({ ...supplierForm, mobile: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-surface-500 uppercase">GSTIN Number</label>
                  <input
                    type="text"
                    placeholder="33AAAAA0000A1Z5"
                    className="w-full h-12 px-4 bg-surface-50 border rounded-xl font-bold mt-1 text-sm uppercase outline-none focus:border-primary"
                    value={supplierForm.gstin}
                    onChange={(e) => setSupplierForm({ ...supplierForm, gstin: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-surface-500 uppercase">Address / Location</label>
                <textarea
                  rows="2"
                  placeholder="Market road, Wholesale hub..."
                  className="w-full p-3 bg-surface-50 border rounded-xl font-bold mt-1 text-sm outline-none focus:border-primary"
                  value={supplierForm.address}
                  onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                ></textarea>
              </div>
              <button type="submit" className="w-full h-14 bg-primary text-white rounded-xl font-black uppercase text-xs shadow-lg hover:bg-primary-600 transition-all">
                Save Vendor Profile
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 glass-card p-6">
            <h3 className="text-lg font-black text-surface-900 mb-4">Vendor Directory & Payables</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-50 text-[10px] font-black uppercase text-surface-400 border-b">
                    <th className="p-3">Vendor / Company</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3 text-right">Outstanding Due</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.length > 0 ? suppliers.map(s => (
                    <tr key={s._id} className="border-b hover:bg-surface-50/50">
                      <td className="p-3">
                        <p className="font-black text-surface-900 text-sm">{s.supplierName}</p>
                        <p className="text-xs font-bold text-surface-400">{s.companyName || 'Individual'}</p>
                      </td>
                      <td className="p-3 font-bold text-xs">{s.mobile}</td>
                      <td className="p-3 text-right font-display font-black text-sm text-error">
                        ₹{(s.outstandingBalance || 0).toLocaleString()}
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedVendorForPayment(s);
                              setPaymentForm({ amount: s.outstandingBalance || '', paymentMode: 'Cash', notes: 'Cash debt settlement' });
                            }}
                            className="px-3 py-1.5 bg-success text-white rounded-xl font-black text-[10px] uppercase shadow-md hover:bg-success-600 transition-all flex items-center gap-1"
                          >
                            <MdPayments className="text-sm" /> Pay Cash
                          </button>
                          <button
                            onClick={() => setViewingVendorLedger(s)}
                            className="p-2 bg-surface-100 text-surface-600 hover:text-primary rounded-xl transition-colors"
                            title="View Statement / History"
                          >
                            <MdListAlt className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-xs font-bold text-surface-400 uppercase">No Suppliers Found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'new_purchase' && (
        <div className="glass-card p-8 max-w-3xl mx-auto">
          <h3 className="text-xl font-black text-surface-900 mb-6 flex items-center gap-2">
            <MdReceipt className="text-primary text-2xl" /> Log Wholesale Purchase Bill
          </h3>

          <form onSubmit={handleCreatePurchase} className="space-y-6">
            <div>
              <label className="text-xs font-black text-surface-500 uppercase">Select Vendor / Supplier *</label>
              <select
                required
                className="w-full h-14 px-4 bg-surface-50 border rounded-2xl font-bold mt-1 text-sm outline-none focus:border-primary"
                value={purchaseForm.supplierId}
                onChange={(e) => setPurchaseForm({ ...purchaseForm, supplierId: e.target.value })}
              >
                <option value="">-- Choose Vendor --</option>
                {suppliers.map(s => (
                  <option key={s._id} value={s._id}>{s.supplierName} ({s.companyName || s.mobile})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-surface-500 uppercase">Vendor Bill / Ref Number</label>
                <input
                  type="text"
                  placeholder="e.g. INV-90812"
                  className="w-full h-14 px-4 bg-surface-50 border rounded-2xl font-bold mt-1 text-sm outline-none focus:border-primary"
                  value={purchaseForm.billNumber}
                  onChange={(e) => setPurchaseForm({ ...purchaseForm, billNumber: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-black text-surface-500 uppercase">Total Bill Amount (₹) *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  placeholder="0.00"
                  className="w-full h-14 px-4 bg-surface-50 border rounded-2xl font-display font-black text-xl text-primary mt-1 outline-none focus:border-primary"
                  value={purchaseForm.totalAmount}
                  onChange={(e) => setPurchaseForm({ ...purchaseForm, totalAmount: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-surface-500 uppercase">Paid Amount Now (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full h-14 px-4 bg-surface-50 border rounded-2xl font-display font-black text-xl text-success mt-1 outline-none focus:border-primary"
                  value={purchaseForm.paidAmount}
                  onChange={(e) => setPurchaseForm({ ...purchaseForm, paidAmount: e.target.value })}
                />
              </div>

              <div className="p-4 bg-error/10 border border-error/20 rounded-2xl flex flex-col justify-center">
                <p className="text-[10px] font-black uppercase text-error tracking-widest">Remaining Vendor Due</p>
                <p className="text-3xl font-display font-black text-error">₹{remainingDueValuation.toLocaleString()}</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-surface-500 uppercase">Notes / Bill Description</label>
              <textarea
                rows="2"
                placeholder="Optional remarks (e.g., Rice bags & oil cans invoice)..."
                className="w-full p-4 bg-surface-50 border rounded-2xl font-bold mt-1 text-sm outline-none focus:border-primary"
                value={purchaseForm.notes}
                onChange={(e) => setPurchaseForm({ ...purchaseForm, notes: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" className="w-full h-16 bg-primary text-white rounded-2xl font-black uppercase text-sm shadow-xl hover:bg-primary-600 transition-all flex items-center justify-center gap-2">
              <MdCheckCircle className="text-2xl" /> Record Wholesale Purchase Bill
            </button>
          </form>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-black text-surface-900 mb-4">Vendor Purchase History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-50 text-[10px] font-black uppercase text-surface-400 border-b">
                  <th className="p-3">Ref / PO Number</th>
                  <th className="p-3">Vendor</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Total Amount</th>
                  <th className="p-3 text-right">Paid</th>
                  <th className="p-3 text-right">Remaining Due</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {purchases.length > 0 ? purchases.map(p => (
                  <tr key={p._id} className="border-b hover:bg-surface-50/50">
                    <td className="p-3 font-mono font-bold text-xs text-primary">
                      {p.billNumber || p.purchaseNumber}
                    </td>
                    <td className="p-3 font-bold text-xs">{p.supplierId?.supplierName || 'Vendor'}</td>
                    <td className="p-3 font-bold text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 text-right font-display font-black text-sm">₹{p.totalAmount?.toLocaleString()}</td>
                    <td className="p-3 text-right font-display font-black text-sm text-success">₹{(p.paidAmount || 0).toLocaleString()}</td>
                    <td className="p-3 text-right font-display font-black text-sm text-error">₹{(p.dueAmount || 0).toLocaleString()}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase ${p.paymentStatus === 'paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                        {p.paymentStatus}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-xs font-bold text-surface-400 uppercase">No Vendor Bills Recorded</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'payments_log' && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-black text-surface-900 mb-4 flex items-center gap-2">
            <MdPayments className="text-success text-2xl" /> Pay Cash & Debt Settlement Log
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-50 text-[10px] font-black uppercase text-surface-400 border-b">
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Vendor / Company</th>
                  <th className="p-3 text-center">Payment Mode</th>
                  <th className="p-3 text-right">Amount Paid</th>
                  <th className="p-3">Remarks / Notes</th>
                </tr>
              </thead>
              <tbody>
                {paymentLogs.length > 0 ? paymentLogs.map(log => (
                  <tr key={log._id || log.date} className="border-b hover:bg-surface-50/50">
                    <td className="p-3 font-bold text-xs">
                      {new Date(log.date).toLocaleDateString()} <span className="text-surface-400 text-[10px] font-medium">{new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td className="p-3 font-bold text-xs">
                      <p className="text-surface-900 font-black">{log.supplierName}</p>
                      <p className="text-[10px] text-surface-400 font-medium">{log.companyName || log.mobile}</p>
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2.5 py-1 rounded bg-success/10 text-success text-[10px] font-black uppercase">
                        {log.paymentMode || 'Cash'}
                      </span>
                    </td>
                    <td className="p-3 text-right font-display font-black text-base text-success">
                      ₹{(log.amount || 0).toLocaleString()}
                    </td>
                    <td className="p-3 font-bold text-xs text-surface-500">
                      {log.notes || 'Vendor debt payment'}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-xs font-bold text-surface-400 uppercase">No Pay Cash Logs Recorded</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Vendor Payment Modal */}
      {selectedVendorForPayment && (
        <dialog open className="modal backdrop-blur-md bg-surface-900/40">
          <div className="modal-box max-w-md bg-white p-6 rounded-3xl shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <div>
                <h3 className="text-xl font-black text-surface-900">Record Vendor Payment</h3>
                <p className="text-xs font-bold text-surface-400 mt-0.5">{selectedVendorForPayment.supplierName} ({selectedVendorForPayment.companyName || 'Vendor'})</p>
              </div>
              <button onClick={() => setSelectedVendorForPayment(null)} className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center font-bold text-surface-500 hover:text-error transition-colors">✕</button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div className="p-4 bg-error/10 border border-error/20 rounded-2xl flex justify-between items-center">
                <span className="text-xs font-black uppercase text-error">Current Debt</span>
                <span className="text-2xl font-display font-black text-error">₹{(selectedVendorForPayment.outstandingBalance || 0).toLocaleString()}</span>
              </div>

              <div>
                <label className="text-xs font-black text-surface-500 uppercase">Payment Amount (₹) *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  placeholder="0.00"
                  className="w-full h-12 px-4 bg-surface-50 border rounded-xl font-display font-black text-lg text-success mt-1 outline-none focus:border-primary"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-surface-500 uppercase">Payment Mode</label>
                  <select
                    className="w-full h-12 px-3 bg-surface-50 border rounded-xl font-bold text-xs mt-1 outline-none focus:border-primary"
                    value={paymentForm.paymentMode}
                    onChange={(e) => setPaymentForm({ ...paymentForm, paymentMode: e.target.value })}
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI / Digital</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-surface-500 uppercase">Remarks / Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Cash settlement"
                    className="w-full h-12 px-3 bg-surface-50 border rounded-xl font-bold text-xs mt-1 outline-none focus:border-primary"
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="w-full h-14 bg-success text-white rounded-2xl font-black uppercase text-xs shadow-lg hover:bg-success-600 transition-all flex items-center justify-center gap-2">
                <MdCheckCircle className="text-xl" /> Confirm Vendor Cash Settlement
              </button>
            </form>
          </div>
        </dialog>
      )}

      {/* View Vendor Ledger Statement Modal */}
      {viewingVendorLedger && (
        <dialog open className="modal backdrop-blur-md bg-surface-900/40">
          <div className="modal-box max-w-xl bg-white p-6 rounded-3xl shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <div>
                <h3 className="text-xl font-black text-surface-900">Vendor Statement & Ledger</h3>
                <p className="text-xs font-bold text-surface-400 mt-0.5">{viewingVendorLedger.supplierName} ({viewingVendorLedger.companyName || viewingVendorLedger.mobile})</p>
              </div>
              <button onClick={() => setViewingVendorLedger(null)} className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center font-bold text-surface-500 hover:text-error transition-colors">✕</button>
            </div>

            <div className="p-4 bg-surface-50 rounded-2xl mb-4 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black uppercase text-surface-400">Current Outstanding Debt</p>
                <p className="text-2xl font-display font-black text-error">₹{(viewingVendorLedger.outstandingBalance || 0).toLocaleString()}</p>
              </div>
              <button
                onClick={() => {
                  const s = viewingVendorLedger;
                  setViewingVendorLedger(null);
                  setSelectedVendorForPayment(s);
                  setPaymentForm({ amount: s.outstandingBalance || '', paymentMode: 'Cash', notes: 'Cash debt settlement' });
                }}
                className="px-4 py-2 bg-success text-white rounded-xl font-black text-xs uppercase shadow-md flex items-center gap-1"
              >
                <MdPayments /> Pay Cash Now
              </button>
            </div>

            <div className="max-h-[300px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-100 text-[10px] font-black uppercase text-surface-500">
                    <th className="p-2">Date</th>
                    <th className="p-2">Type</th>
                    <th className="p-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(viewingVendorLedger.transactions) && viewingVendorLedger.transactions.length > 0 ? (
                    viewingVendorLedger.transactions.slice().reverse().map((tx, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2 text-xs font-bold">{new Date(tx.date).toLocaleDateString()}</td>
                        <td className="p-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${tx.type === 'PAYMENT' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                            {tx.type} ({tx.paymentMode || 'Cash'})
                          </span>
                        </td>
                        <td className="p-2 text-right font-display font-black text-sm">₹{(tx.amount || 0).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-6 text-center text-xs font-bold text-surface-400 uppercase">No transactions logged yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default PurchaseManage;
