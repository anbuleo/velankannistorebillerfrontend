import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom';
import SaleTable from '../components/SaleTable';
import useSaleTableDataHook from '../Hooks/SaleTableDataHook'
import useGetAllProductHook from '../Hooks/GetAllProductHook';
import { totalByCustomer } from '../common/SaleCart';
import { toast } from 'react-toastify';
import AxiosService from '../common/Axioservice';
import { MdCalendarToday, MdFilterList, MdSearch, MdCurrencyRupee, MdRefresh } from 'react-icons/md'

/**
 * Sale Ledger: Senior-optimized with memoized stats and proactive fetching.
 */
function Sale() {
    const { getUSer, loading: fetchingData } = useGetAllProductHook();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialCustomerId = queryParams.get('customerId');

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [searchInput, setSearchInput] = useState("");

    const { customerBill, getBillOfuser, setCustomerBill } = useSaleTableDataHook()
    const { bills, totalBllAmount } = useSelector(state => state.sale)
    const { customer } = useSelector(state => state.customer)
    const [serverFilteredData, setServerFilteredData] = useState(null)
    const dispatch = useDispatch()

    useEffect(() => {
        if (bills.length === 0) {
            getUSer('bills');
        }
    }, [getUSer, bills.length])

    useEffect(() => {
        if (initialCustomerId && bills.length > 0) {
            handleChangeCustomer(initialCustomerId);
        }
    }, [bills.length, initialCustomerId])

    const handleChangeCustomer = async (id) => {
        setServerFilteredData(null);
        if (id === 'all') {
            setCustomerBill([])
            dispatch(totalByCustomer('all'))
        } else {
            await getBillOfuser(id)
        }
    }

    const searchByDate = async () => {
        try {
            if (startDate && endDate) {
                const res = await AxiosService.put('/saleprint/getsalebydate', { startDate, endDate })
                if (res.status === 200) {
                    setServerFilteredData(res?.data?.sale)
                    toast.success('Ledger filtered by date');
                }
            } else {
                toast.warning('Enter date range')
            }
        } catch (error) {
            toast.error('Date filter failed')
        }
    }

    // Senior Optimization: Memoize the base data before applying search filters
    const baseData = useMemo(() => {
        return serverFilteredData || (customerBill.length > 0 ? customerBill : bills);
    }, [serverFilteredData, customerBill, bills]);

    // Senior Optimization: Memoize filtered view based on search input
    const tableData = useMemo(() => {
        const term = searchInput.toLowerCase().trim();
        if (!term) return baseData;

        return baseData.filter(b =>
            (b.customerName || '').toLowerCase().includes(term) ||
            (b.paymentMethod || '').toLowerCase().includes(term) ||
            (b.billNumber || '').toLowerCase().includes(term) ||
            (b._id || '').toLowerCase().includes(term)
        );
    }, [baseData, searchInput]);

    // Senior Optimization: Compute stats ONLY when tableData changes
    const stats = useMemo(() => {
        const totalTransactions = tableData.length;
        const totalRevenue = tableData.reduce((acc, cur) => acc + Number(cur.totalAmount || 0), 0);
        const avgTransaction = totalTransactions > 0 ? (totalRevenue / totalTransactions).toFixed(2) : 0;
        const cashSales = tableData.filter(t => (t.paymentType || '').toLowerCase() === 'cash').length;
        const onlineSales = tableData.filter(t => (t.paymentType || '').toLowerCase() === 'online').length;

        return { totalTransactions, avgTransaction, cashSales, onlineSales, totalRevenue };
    }, [tableData]);

    const userData = JSON.parse(localStorage.getItem('data'))
    const isAdmin = userData?.role === 'admin'

    return (
        <div className="container mx-auto px-4 py-8 fade-in min-h-screen">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-10">
                <div className="flex-1">
                    <h1 className="text-4xl font-display font-bold text-surface-900 tracking-tight leading-none mb-2">Sales Ledger</h1>
                    <p className="text-surface-500 font-medium">Business intelligence and transaction forensics</p>
                </div>

                {isAdmin && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full xl:w-auto">
                        <div className="glass-card p-4 border-l-4 border-primary">
                            <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Period Revenue</p>
                            <p className="text-xl font-display font-bold text-surface-900">₹{stats.totalRevenue}</p>
                        </div>
                        <div className="glass-card p-4 border-l-4 border-indigo-500">
                            <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Average</p>
                            <p className="text-xl font-display font-bold text-surface-900">₹{stats.avgTransaction}</p>
                        </div>
                        <div className="glass-card p-4 border-l-4 border-emerald-500">
                            <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Volume</p>
                            <p className="text-xl font-display font-bold text-surface-900">{stats.totalTransactions} TX</p>
                        </div>
                        <div className="glass-card p-4 border-l-4 border-amber-500">
                            <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Cash/Online</p>
                            <p className="text-lg font-display font-bold text-surface-900 flex items-center gap-2">
                                {stats.cashSales}<span className="text-surface-300 text-xs">/</span>{stats.onlineSales}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="glass-card mb-8 p-6">
                <div className="flex flex-col lg:flex-row items-end gap-6 justify-between">
                    <div className="flex flex-wrap items-end gap-6 flex-1 w-full lg:w-auto">
                        <div className="flex-1 min-w-[300px]">
                            <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-2 px-1">Detailed Search</label>
                            <div className="relative">
                                <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                                <input
                                    type="text"
                                    placeholder="Search by Customer, Method, or Invoice..."
                                    className="premium-input w-full h-11 pl-12 pr-4 bg-surface-50 focus:bg-white text-sm font-medium border-2 focus:border-primary/50"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="min-w-[240px]">
                            <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-2 px-1">Filter by Customer</label>
                            <div className="relative">
                                <select
                                    className="select select-bordered w-full h-11 rounded-xl bg-surface-50 border-surface-200 focus:bg-white transition-all font-medium text-sm"
                                    onChange={(e) => handleChangeCustomer(e.target.value)}
                                >
                                    <option value='all'>All Customers</option>
                                    {customer?.map((c, i) => <option key={i} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4 items-end flex-wrap w-full lg:w-auto">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-2 px-1">Date Range</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        className="premium-input w-full h-11 px-4 text-xs"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                    <span className="text-surface-300 font-bold">—</span>
                                    <input
                                        className="premium-input w-full h-11 px-4 text-xs"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button
                                onClick={searchByDate}
                                className="btn btn-primary h-11 px-6 rounded-xl shadow-premium border-none gap-2 flex-grow sm:flex-grow-0"
                            >
                                <MdFilterList /> Filter
                            </button>
                            <button
                                onClick={() => {
                                    setServerFilteredData(null);
                                    getUSer('bills');
                                }}
                                className={`btn btn-square h-11 w-11 rounded-xl bg-surface-100 hover:bg-surface-200 border-none ${fetchingData ? 'animate-spin opacity-50' : ''}`}
                            >
                                <MdRefresh className="text-lg text-surface-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <SaleTable props={{ tableData }} />
        </div>
    )
}

export default Sale