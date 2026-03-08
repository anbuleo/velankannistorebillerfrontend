import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { MdPictureAsPdf, MdTableChart, MdVisibility, MdVisibilityOff } from 'react-icons/md'

function CustomerTable({ filteredData }) {
    const [expandedRows, setExpandedRows] = useState({});
    const { customer: allCustomers } = useSelector((state) => state.customer);
    const displayList = filteredData || allCustomers;
    const userData = JSON.parse(localStorage.getItem('data'));
    const isAdmin = userData?.role === 'admin';

    const toggleRow = (id) => {
        setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const tableColumn = ["Name", "Mobile", "Aadhaar", "Location", "Balance"];
        const tableRows = displayList.map((c) => [
            c.name,
            c.mobile,
            c.aadhaar || 'NO_ID',
            c.location || 'NOT SPECIFIED',
            `Rs.${Number(c.balance || 0).toFixed(2)}`
        ]);
        doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
        doc.save("Customer_Report.pdf");
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(displayList.map(c => ({
            Name: c.name,
            Mobile: c.mobile,
            Aadhaar: c.aadhaar || 'NO_ID',
            Location: c.location || 'NOT SPECIFIED',
            Balance: Number(c.balance || 0).toFixed(2)
        })));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(data, "Customer_Ledger.xlsx");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-6">
                <div>
                    <h3 className="font-display font-bold text-surface-900 leading-none">Export Controls</h3>
                    <p className="text-[10px] text-surface-400 mt-1 uppercase tracking-widest font-bold">Download Directory State</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn btn-outline border-surface-200 bg-white hover:bg-surface-50 text-surface-600 rounded-xl gap-2 font-bold shadow-sm" onClick={exportToExcel}>
                        <MdTableChart className="text-xl text-success" /> Export Excel
                    </button>
                    <button className="btn btn-outline border-surface-200 bg-white hover:bg-surface-50 text-surface-600 rounded-xl gap-2 font-bold shadow-sm" onClick={exportToPDF}>
                        <MdPictureAsPdf className="text-xl text-error" /> Export PDF
                    </button>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th className="w-16 text-center">#</th>
                            <th>Customer Identity</th>
                            <th className="text-center">Reference</th>
                            <th>Primary Location</th>
                            {isAdmin && <th className="text-right">Ledger Balance</th>}
                            <th className="text-center w-24">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayList && displayList.length > 0 ? displayList.map((c, i) => (
                            <React.Fragment key={c._id}>
                                <tr className="h-20 hover:bg-surface-50">
                                    <td className="text-center text-surface-400 font-bold">{i + 1}</td>
                                    <td>
                                        <p className="font-bold text-surface-900 uppercase tracking-tight leading-none mb-1">{c.name}</p>
                                        <p className="text-[10px] text-surface-400 tracking-widest font-bold uppercase">{c.mobile}</p>
                                    </td>
                                    <td className="text-center">
                                        <span className="badge badge-outline border-surface-200 text-surface-400 font-medium text-[10px] uppercase tracking-wider px-2">
                                            {c.aadhaar || 'NO_ID'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="text-xs font-medium text-surface-600 uppercase italic opacity-70">{c.location || 'NOT SPECIFIED'}</span>
                                    </td>
                                    {isAdmin && (
                                        <td className="text-right">
                                            <span className={`text-xl font-display font-bold leading-none ${Number(c.balance) > 0 ? 'text-error' : 'text-success'}`}>
                                                ₹{Number(c.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                            </span>
                                        </td>
                                    )}
                                    <td className="text-center">
                                        <button
                                            onClick={() => toggleRow(c._id)}
                                            className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center hover:bg-surface-200 transition-colors mx-auto"
                                        >
                                            {expandedRows[c._id] ? <MdVisibilityOff className="text-surface-600" /> : <MdVisibility className="text-surface-600" />}
                                        </button>
                                    </td>
                                </tr>
                                {expandedRows[c._id] && (
                                    <tr className="bg-surface-50 animate-in slide-in-from-top-4 duration-300">
                                        <td colSpan={6} className="p-8">
                                            <div className="flex flex-col md:flex-row gap-8">
                                                <div className="flex-1 glass-card p-6 border-none bg-white">
                                                    <h5 className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-4">Detailed Profile</h5>
                                                    <div className="grid grid-cols-2 gap-6">
                                                        <div>
                                                            <p className="text-[10px] font-bold text-surface-400 uppercase leading-none mb-1">Full Name</p>
                                                            <p className="font-bold text-surface-900">{c.name}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-surface-400 uppercase leading-none mb-1">Mobile Contact</p>
                                                            <p className="font-bold text-surface-900">{c.mobile}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-surface-400 uppercase leading-none mb-1">Primary Location</p>
                                                            <p className="font-bold text-surface-900 uppercase italic opacity-70">{c.location || 'NOT SPECIFIED'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-surface-400 uppercase leading-none mb-1">Identity Reference (AADHAAR/ID)</p>
                                                            <p className="font-bold text-surface-900">{c.aadhaar || 'NO_ID'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {isAdmin && (
                                                    <div className="w-full md:w-80 glass-card p-6 border-none bg-primary/5 text-primary">
                                                        <h5 className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mb-4">Financial Overview</h5>
                                                        <div className="space-y-4">
                                                            <div>
                                                                <p className="text-[10px] font-bold uppercase leading-none mb-1 opacity-70">Current Outstanding</p>
                                                                <p className="text-3xl font-display font-bold">₹{Number(c.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/10">
                                                                <div>
                                                                    <p className="text-[9px] font-bold uppercase leading-none mb-1 opacity-60">Lifetime Purchases</p>
                                                                    <p className="text-sm font-bold">₹{Number(c.totalPurchases || 0).toLocaleString('en-IN')}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[9px] font-bold uppercase leading-none mb-1 opacity-60">Total Settled</p>
                                                                    <p className="text-sm font-bold">₹{Number(c.totalPayments || 0).toLocaleString('en-IN')}</p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => window.location.href = `/sale?customerId=${c._id}`}
                                                                className="btn btn-primary btn-sm w-full mt-2 rounded-lg font-bold uppercase tracking-wider text-[10px]"
                                                            >
                                                                View Activity Logs
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        )) : (
                            <tr><td colSpan={6} className="h-40 text-center text-surface-400 italic">No matches found for the current search filter.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CustomerTable