import React, { useState } from 'react'
import {useSelector } from 'react-redux'
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function CustomerTable() {
    const [expandedRows, setExpandedRows] = useState({});
    let {balanceSheet,TotalBalance} = useSelector(state=>state.balancesheet)
    const toggleExpand = (id) => {
        setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Customer Balance Sheet Report", 10, 10);

        const tableColumn = ["Customer Name", "Opening Balance", "Total Purchases", "Total Payments", "Remaining Balance"];
        const tableRows = [];

        balanceSheet?.forEach(sheet => {
            const rowData = [
                sheet.customerId?.name || "Unknown",
                `₹${sheet.openingBalance}`,
                `₹${sheet.totalPurchases}`,
                `₹${sheet.totalPayments}`,
                `₹${sheet.remainingBalance}`
            ];
            tableRows.push(rowData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20
        });

        doc.save("BalanceSheet.pdf");
    };

    // 📌 Function to Export as Excel
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(balanceSheet?.map(sheet => ({
            "Customer Name": sheet.customerId?.name || "Unknown",
            "Opening Balance": sheet.openingBalance,
            "Total Purchases": sheet.totalPurchases,
            "Total Payments": sheet.totalPayments,
            "Remaining Balance": sheet.remainingBalance
        })));

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Balance Sheet");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        saveAs(data, "BalanceSheet.xlsx");
    };
  return   <div>
    <div className="">
    <p>Total balance Remaining : {TotalBalance}</p>
    <div className="flex justify-end gap-4 mb-4">
                <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={exportToExcel}>Export to Excel</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={exportToPDF}>Export to PDF</button>
            </div>
    </div>
    <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">#</th>
                            <th className="border px-4 py-2">Customer Name</th>
                            <th className="border px-4 py-2">Opening Balance</th>
                            <th className="border px-4 py-2">Total Purchases</th>
                            <th className="border px-4 py-2">Total Payments</th>
                            <th className="border px-4 py-2">Remaining Balance</th>
                            <th className="border px-4 py-2">Transactions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {balanceSheet.length > 0 ? (
                            balanceSheet.map((sheet, index) => (
                                <React.Fragment key={index}>
                                    <tr className="text-center border">
                                        <td className="border px-4 py-2">{index + 1}</td>
                                        <td className="border px-4 py-2">{sheet.customerId?.name || "Unknown"}</td>
                                        <td className="border px-4 py-2">₹{sheet.openingBalance}</td>
                                        <td className="border px-4 py-2">₹{sheet.totalPurchases}</td>
                                        <td className="border px-4 py-2">₹{sheet.totalPayments}</td>
                                        <td className="border px-4 py-2 font-bold">₹{sheet.remainingBalance}</td>
                                        <td className="border px-4 py-2">
                                            <button
                                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                                onClick={() => toggleExpand(sheet._id)}
                                            >
                                                {expandedRows[sheet._id] ? "Hide" : "View"}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedRows[sheet._id] && (
                                        <tr>
                                            <td colSpan="7" className="border p-4 bg-gray-100">
                                                <h3 className="font-bold mb-2">Transactions</h3>
                                                <table className="w-full border-collapse border border-gray-300">
                                                    <thead>
                                                        <tr className="bg-gray-200">
                                                            <th className="border px-4 py-2">Date</th>
                                                            <th className="border px-4 py-2">Type</th>
                                                            <th className="border px-4 py-2">Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {sheet.transactions.length > 0 ? (
                                                            sheet.transactions.map((txn, i) => (
                                                                <tr key={i} className="text-center border">
                                                                    <td className="border px-4 py-2">{new Date(txn.date).toLocaleDateString()}</td>
                                                                    <td className={`border px-4 py-2 ${txn.type === 'payment' ? 'text-green-500' : 'text-red-500'}`}>
                                                                        {txn.type.replace("_", " ").toUpperCase()}
                                                                    </td>
                                                                    <td className="border px-4 py-2">₹{txn.amount}</td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="3" className="text-center py-2">No Transactions Found</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-4">No Balance Sheet Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>

         {/* <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Customer Name</th>
                            <th className="border px-4 py-2">Opening Balance</th>
                            <th className="border px-4 py-2">Total Purchases</th>
                            <th className="border px-4 py-2">Total Payments</th>
                            <th className="border px-4 py-2">Remaining Balance</th>
                        </tr>
                 </thead>
                 <tbody>
                    {balanceSheet && balanceSheet?.map((e,i)=>{
                        return <tr key={i} className="text-center border">
                        <td className="border px-4 py-2">{e.customerId?.name || "Unknown"}</td>
                        <td className="border px-4 py-2">₹{e.openingBalance}</td>
                        <td className="border px-4 py-2">₹{e.totalPurchases}</td>
                        <td className="border px-4 py-2">₹{e.totalPayments}</td>
                        <td className="border px-4 py-2 font-bold">₹{e.remainingBalance}</td>
                    </tr>
                    })}
                 </tbody>
        </table> */}
    </div>
  
}

export default CustomerTable