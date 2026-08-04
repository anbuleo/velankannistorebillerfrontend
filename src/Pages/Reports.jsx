import React, { useState, useEffect } from 'react';
import AxiosService from '../common/Axioservice';
import { toast } from 'react-toastify';
import { MdAssessment, MdTrendingUp, MdAccountBalance, MdReceipt, MdDownload, MdDateRange } from 'react-icons/md';

function Reports() {
  const [activeTab, setActiveTab] = useState('executive');
  const [dashboardData, setDashboardData] = useState(null);
  const [gstData, setGstData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const [dashRes, gstRes] = await Promise.allSettled([
        AxiosService.get('/report/dashboard'),
        AxiosService.get('/report/gst')
      ]);
      if (dashRes.status === 'fulfilled') setDashboardData(dashRes.value.data);
      if (gstRes.status === 'fulfilled') setGstData(gstRes.value.data);
    } catch (err) {
      console.error('Report error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1400px]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-surface-900 flex items-center gap-3">
            <MdAssessment className="text-primary text-4xl" /> Business Intelligence & GST Reports
          </h1>
          <p className="text-sm font-bold text-surface-400 mt-1">Executive financial summary, tax filings, net profit margins, and sales metrics.</p>
        </div>

        <div className="flex gap-2 bg-surface-100 p-1.5 rounded-2xl border border-surface-200">
          <button
            onClick={() => setActiveTab('executive')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'executive' ? 'bg-primary text-white shadow-lg' : 'text-surface-500 hover:text-surface-900'}`}
          >
            Executive Dashboard
          </button>
          <button
            onClick={() => setActiveTab('gst')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'gst' ? 'bg-primary text-white shadow-lg' : 'text-surface-500 hover:text-surface-900'}`}
          >
            GST GSTR-3B Tax Filing
          </button>
        </div>
      </div>

      {activeTab === 'executive' && dashboardData && (
        <div className="space-y-8">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 border-l-4 border-l-primary">
              <p className="text-xs font-black text-surface-400 uppercase tracking-widest">Today's Total Sales</p>
              <p className="text-3xl font-display font-black text-primary mt-2">₹{dashboardData.todaySales?.toLocaleString() || 0}</p>
              <p className="text-[10px] font-bold text-surface-400 mt-1">Monthly: ₹{dashboardData.monthlySales?.toLocaleString() || 0}</p>
            </div>

            <div className="glass-card p-6 border-l-4 border-l-success">
              <p className="text-xs font-black text-surface-400 uppercase tracking-widest">Today's Net Profit</p>
              <p className="text-3xl font-display font-black text-success mt-2">₹{dashboardData.todayNetProfit?.toLocaleString() || 0}</p>
              <p className="text-[10px] font-bold text-surface-400 mt-1">Gross Profit: ₹{dashboardData.todayGrossProfit?.toLocaleString() || 0}</p>
            </div>

            <div className="glass-card p-6 border-l-4 border-l-warning">
              <p className="text-xs font-black text-surface-400 uppercase tracking-widest">Customer Pending Udhar</p>
              <p className="text-3xl font-display font-black text-warning mt-2">₹{dashboardData.pendingPayments?.toLocaleString() || 0}</p>
              <p className="text-[10px] font-bold text-surface-400 mt-1">Total Credit Balances</p>
            </div>

            <div className="glass-card p-6 border-l-4 border-l-indigo-500">
              <p className="text-xs font-black text-surface-400 uppercase tracking-widest">Stock Asset Valuation</p>
              <p className="text-3xl font-display font-black text-indigo-600 mt-2">₹{dashboardData.totalStockValuation?.toLocaleString() || 0}</p>
              <p className="text-[10px] font-bold text-surface-400 mt-1">{dashboardData.totalProducts} Total SKUs</p>
            </div>
          </div>

          {/* Operational Metrics Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-card p-6">
              <h3 className="text-lg font-black text-surface-900 mb-4">Financial Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-surface-50 rounded-xl">
                  <span className="text-xs font-bold text-surface-500 uppercase">Gross Monthly Revenue</span>
                  <span className="font-display font-black text-lg text-primary">₹{dashboardData.monthlySales}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-surface-50 rounded-xl">
                  <span className="text-xs font-bold text-surface-500 uppercase">Today's Logged Expenses</span>
                  <span className="font-display font-black text-lg text-error">₹{dashboardData.todayExpenses}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-surface-50 rounded-xl">
                  <span className="text-xs font-bold text-surface-500 uppercase">Monthly Expenses</span>
                  <span className="font-display font-black text-lg text-error">₹{dashboardData.monthExpenses}</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-lg font-black text-surface-900 mb-4">Inventory Health Indicator</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-surface-50 rounded-xl">
                  <span className="text-xs font-bold text-surface-500 uppercase">Low Stock Alert Count</span>
                  <span className="font-display font-black text-lg text-error">{dashboardData.lowStockCount} Items</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-surface-50 rounded-xl">
                  <span className="text-xs font-bold text-surface-500 uppercase">Registered Customer Accounts</span>
                  <span className="font-display font-black text-lg text-surface-900">{dashboardData.totalCustomers} Accounts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'gst' && gstData && (
        <div className="glass-card p-8 max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <div>
              <h3 className="text-xl font-black text-surface-900">GST Monthly Tax Computation</h3>
              <p className="text-xs font-bold text-surface-400">Period: {gstData.period}</p>
            </div>
            <button onClick={() => window.print()} className="px-5 py-2.5 bg-primary text-white rounded-xl font-black text-xs uppercase flex items-center gap-2 shadow-lg">
              <MdDownload className="text-base" /> Print GST Report
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-surface-50 rounded-2xl border">
                <p className="text-[10px] font-black uppercase text-surface-400">Total Billed Invoices</p>
                <p className="text-2xl font-display font-black text-surface-900 mt-1">{gstData.totalInvoices}</p>
              </div>
              <div className="p-4 bg-surface-50 rounded-2xl border">
                <p className="text-[10px] font-black uppercase text-surface-400">Gross Billed Sales</p>
                <p className="text-2xl font-display font-black text-primary mt-1">₹{gstData.grossSales?.toLocaleString()}</p>
              </div>
            </div>

            <div className="p-6 bg-surface-900 text-white rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white/60 uppercase">Taxable TurnOver</span>
                <span className="font-display font-black text-lg">₹{Math.round(gstData.taxableAmount || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white/60 uppercase">CGST (Central Tax)</span>
                <span className="font-display font-black text-lg text-primary-200">₹{Math.round(gstData.cgst || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white/60 uppercase">SGST (State Tax)</span>
                <span className="font-display font-black text-lg text-primary-200">₹{Math.round(gstData.sgst || 0).toLocaleString()}</span>
              </div>
              <div className="divider opacity-10 my-2"></div>
              <div className="flex justify-between items-center text-xl font-black">
                <span className="uppercase text-white">Total Tax Payable</span>
                <span className="font-display text-primary">₹{Math.round(gstData.totalGST || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;
