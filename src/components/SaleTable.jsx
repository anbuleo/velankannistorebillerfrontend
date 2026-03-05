import React from 'react'
import AxiosService from '../common/Axioservice'
import { toast } from 'react-toastify';
import { MdDelete, MdVisibility, MdClose, MdPrint, MdSave } from 'react-icons/md'

function SaleTable({ props }) {
    const [selectedBill, setSelectedBill] = React.useState(null);
    const userData = JSON.parse(localStorage.getItem('data'))
    const isAdmin = userData?.role === 'admin'

    const handleDelete = async (id) => {
        let confirmDelete = window.confirm("CRITICAL ACTION: Are you sure you want to PERMANENTLY DELETE this sale record? This cannot be undone.");
        if (confirmDelete) {
            try {
                let res = await AxiosService.delete(`/saleprint/deletebyid/${id}`)
                if (res.status === 200) {
                    toast.success("Sale record purged successfully");
                    window.location.reload();
                }
            } catch (error) {
                toast.error("Delete operation failed - Check permissions");
            }
        }
    }

    const handleSettlePayment = async (bill) => {
        if (!window.confirm(`Mark Bill ${bill.billNumber || bill._id} as fully Paid?`)) return;
        try {
            const res = await AxiosService.put(`/saleprint/editbillbyid/${bill._id}`, {
                dueAmount: 0,
                paidAmount: bill.totalAmount || bill.totalBillAmount
            })
            if (res.status === 200) {
                toast.success("Payment settled and synchronized");
                setSelectedBill(null);
                window.location.reload();
            }
        } catch (error) {
            toast.error("Cloud synchronization failed for settlement");
        }
    }

    return (
        <div className="glass-card overflow-hidden">
            <div className="bg-surface-50 px-6 py-4 border-b border-surface-100 flex items-center justify-between">
                <p className="font-bold text-surface-400 uppercase tracking-widest text-[10px]">Transaction Log</p>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-surface-400 hidden md:block">DAILY SETTLEMENT ACTIVE</span>
                    <span className="badge badge-primary font-bold">{props.tableData.length} Records</span>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th className="w-16">#</th>
                            <th>Customer Name</th>
                            <th className="text-right">Sale Amount</th>
                            <th className="text-center">Method</th>
                            <th className="text-center">Status</th>
                            <th>Date</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.tableData && props.tableData.length > 0 ? props.tableData.map((item, i) => (
                            <tr key={item._id} className="h-20">
                                <td className="text-surface-400 font-bold">{i + 1}</td>
                                <td className="font-bold text-surface-900 uppercase tracking-tight">
                                    <div className="flex flex-col">
                                        <span>{item.customerName}</span>
                                        <span className="text-[10px] text-primary font-extrabold uppercase tracking-widest mt-0.5">
                                            {item.billNumber || `TRN-${item._id.slice(-6).toUpperCase()}`}
                                        </span>
                                    </div>
                                </td>
                                <td className="text-right font-display font-bold text-surface-900">₹{item.totalAmount || item.totalBillAmount}</td>
                                <td className="text-center">
                                    <span className="badge badge-outline border-surface-200 text-surface-500 font-medium text-[9px] uppercase tracking-wider px-2">
                                        {item.paymentType || item.paymentMethod || 'CASH'}
                                    </span>
                                </td>
                                <td className="text-center">
                                    {Number(item.dueAmount) === 0 ? (
                                        <span className="badge badge-success bg-success/10 text-success border-none font-bold text-[10px] uppercase tracking-wider px-3">
                                            Settled
                                        </span>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1">
                                            <span className={`badge ${Number(item.dueAmount) >= Number(item.totalAmount || item.totalBillAmount) ? 'badge-error bg-error/10 text-error' : 'badge-warning bg-amber-500/10 text-amber-600'} border-none font-bold text-[10px] uppercase tracking-wider px-3`}>
                                                ₹{item.dueAmount} DUE
                                            </span>
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <div className="text-xs font-bold text-surface-500">{new Date(item.createdAt).toLocaleDateString()}</div>
                                    <div className="text-[10px] text-surface-400 font-medium mt-0.5 uppercase tracking-tighter">{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </td>
                                <td className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setSelectedBill(item)}
                                            className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                                            title="View Details"
                                        >
                                            <MdVisibility className="text-lg" />
                                        </button>
                                        {isAdmin && (
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-error/5 text-error hover:bg-error hover:text-white transition-all shadow-sm"
                                                title="Purge Record"
                                            >
                                                <MdDelete className="text-lg" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={7} className="h-40 text-center text-surface-400 italic">No sales logs found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Bill Detail Modal Overlay */}
            {selectedBill && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-surface-900/60 backdrop-blur-sm animate-in fade-in">
                    <div className="glass-card w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="bg-surface-900 text-white p-6 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h2 className="text-2xl font-display font-bold uppercase tracking-tight">Bill Overview</h2>
                                    {Number(selectedBill.dueAmount) === 0 ? (
                                        <span className="badge badge-success border-none font-bold text-[9px] uppercase tracking-widest px-2">PAID</span>
                                    ) : (
                                        <span className="badge badge-error border-none font-bold text-[9px] uppercase tracking-widest px-2 animate-pulse">PENDING: ₹{selectedBill.dueAmount}</span>
                                    )}
                                </div>
                                <p className="text-primary-300 text-[10px] font-bold uppercase tracking-[0.2em]">
                                    {selectedBill.billNumber || `TRN-${selectedBill._id.slice(-6).toUpperCase()}`}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedBill(null)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
                            >
                                <MdClose className="text-xl" />
                            </button>
                        </div>

                        <div className="p-8 max-h-[60vh] overflow-y-auto no-scrollbar">
                            <div className="flex justify-between items-start mb-10 pb-6 border-b border-surface-100">
                                <div>
                                    <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-2">Customer Profile</p>
                                    <p className="text-xl font-display font-bold text-surface-900">{selectedBill.customerName}</p>
                                    <p className="text-sm font-medium text-surface-500 mt-1">{selectedBill.customerMobile || 'Retail Guest'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-2">Timestamp</p>
                                    <p className="text-sm font-bold text-surface-900">{new Date(selectedBill.createdAt).toLocaleDateString()}</p>
                                    <p className="text-xs font-medium text-surface-500">{new Date(selectedBill.createdAt).toLocaleTimeString()}</p>
                                </div>
                            </div>

                            <table className="w-full mb-8">
                                <thead>
                                    <tr className="text-left border-b border-surface-100">
                                        <th className="pb-4 text-[10px] font-bold text-surface-400 uppercase tracking-widest">Item Description</th>
                                        <th className="pb-4 text-center text-[10px] font-bold text-surface-400 uppercase tracking-widest">Qty</th>
                                        <th className="pb-4 text-right text-[10px] font-bold text-surface-400 uppercase tracking-widest">Price</th>
                                        <th className="pb-4 text-right text-[10px] font-bold text-surface-400 uppercase tracking-widest">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedBill.products?.map((p, idx) => (
                                        <tr key={idx} className="border-b border-surface-50 h-14">
                                            <td className="font-bold text-surface-900 text-sm uppercase">{p.productName}</td>
                                            <td className="text-center font-bold text-surface-600 text-sm">{p.productQuantity}</td>
                                            <td className="text-right font-medium text-surface-500 text-sm">₹{p.productPrice}</td>
                                            <td className="text-right font-bold text-surface-900 text-sm">₹{p.productTotal}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="flex justify-between gap-10">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center justify-between text-[10px] font-bold text-surface-400 uppercase">
                                        <span>Payment Mode</span>
                                        <span className="text-surface-900">{selectedBill.paymentType || selectedBill.paymentMethod || 'CASH'}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] font-bold text-surface-400 uppercase tracking-widest">
                                        <span>Initial Paid</span>
                                        <span className="text-success font-extrabold font-mono">₹{selectedBill.paidAmount || (selectedBill.totalAmount - selectedBill.dueAmount) || '0.00'}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] font-bold text-surface-400 uppercase tracking-widest">
                                        <span>Remaining Due</span>
                                        <span className="text-error font-extrabold font-mono">₹{selectedBill.dueAmount || '0.00'}</span>
                                    </div>
                                </div>
                                <div className="w-48 pt-4 border-t-2 border-surface-900 flex flex-col items-end">
                                    <span className="text-surface-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-1 leading-none">Net Total</span>
                                    <span className="text-primary font-display font-extrabold text-4xl">₹{selectedBill.totalAmount || selectedBill.totalBillAmount}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface-50 p-6 border-t border-surface-100 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                {Number(selectedBill.dueAmount) > 0 && (
                                    <button
                                        onClick={() => handleSettlePayment(selectedBill)}
                                        className="btn btn-warning btn-sm rounded-lg px-4 font-extrabold border-none shadow-sm gap-2"
                                    >
                                        <MdSave className="text-base" /> Settle Due
                                    </button>
                                )}
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSelectedBill(null)}
                                    className="px-6 py-2 rounded-xl font-bold text-surface-500 hover:text-surface-900 transition-colors text-sm uppercase tracking-widest"
                                >
                                    Dismiss
                                </button>
                                <button className="btn btn-primary px-8 rounded-xl gap-2 font-bold shadow-lg shadow-primary/30 border-none">
                                    <MdPrint className="text-lg" /> Print Receipt
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SaleTable