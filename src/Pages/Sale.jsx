import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SaleTable from '../components/SaleTable';
import useSaleTableDataHook from '../Hooks/SaleTableDataHook'
import { totalByCustomer } from '../common/SaleCart';
import { toast } from 'react-toastify';
import AxiosService from '../common/Axioservice';
import { HiOutlineCalendar, HiOutlineFunnel, HiOutlineMagnifyingGlass, HiOutlineCurrencyRupee } from 'react-icons/hi2'

function Sale() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const { customerBill, getBillOfuser, setCustomerBill } = useSaleTableDataHook()
    const { bills, totalBllAmount, totalAmountByCustomer } = useSelector(state => state.sale)
    const { customer } = useSelector(state => state.customer)
    const [tableData, setTableData] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        setTableData(bills)
    }, [bills])

    useEffect(() => {
        if (customerBill.length > 0 && !startDate && !endDate) {
            setTableData(customerBill)
        }
    }, [customerBill])

    const handleChangeCustomer = async (id) => {
        if (id === 'all') {
            setCustomerBill([])
            setTableData([...bills])
            dispatch(totalByCustomer('all'))
        } else {
            await getBillOfuser(id)
            setTableData(customerBill)
        }
    }

    const searchByDate = async () => {
        try {
            if (startDate && endDate) {
                const res = await AxiosService.put('/saleprint/getsalebydate', { startDate, endDate })
                if (res.status === 200) {
                    setTableData(res?.data?.sale)
                }
            } else {
                toast.warning('Please enter both start and end dates')
            }
        } catch (error) {
            toast.error('Date search failed')
        }
    }

    const totalTransactions = tableData.length;
    const avgTransaction = totalTransactions > 0 ? (tableData.reduce((acc, cur) => acc + Number(cur.totalAmount || 0), 0) / totalTransactions).toFixed(2) : 0;
    const cashSales = tableData.filter(t => (t.paymentType || '').toLowerCase() === 'cash').length;
    const onlineSales = tableData.filter(t => (t.paymentType || '').toLowerCase() === 'online').length;

    return (
        <div className="container mx-auto px-4 py-8 fade-in min-h-screen">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-10">
                <div className="flex-1">
                    <h1 className="text-4xl font-display font-bold text-surface-900 tracking-tight leading-none mb-2">Sales Ledger</h1>
                    <p className="text-surface-500 font-medium">Business intelligence and transaction forensics</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full xl:w-auto">
                    <div className="glass-card p-4 border-l-4 border-primary">
                        <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Revenue</p>
                        <p className="text-xl font-display font-bold text-surface-900">₹{totalBllAmount || '0'}</p>
                    </div>
                    <div className="glass-card p-4 border-l-4 border-indigo-500">
                        <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Average</p>
                        <p className="text-xl font-display font-bold text-surface-900">₹{avgTransaction}</p>
                    </div>
                    <div className="glass-card p-4 border-l-4 border-emerald-500">
                        <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Volume</p>
                        <p className="text-xl font-display font-bold text-surface-900">{totalTransactions} TX</p>
                    </div>
                    <div className="glass-card p-4 border-l-4 border-amber-500">
                        <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Cash/Online</p>
                        <p className="text-lg font-display font-bold text-surface-900 flex items-center gap-2">
                            {cashSales}<span className="text-surface-300 text-xs">/</span>{onlineSales}
                        </p>
                    </div>
                </div>
            </div>

            <div className="glass-card mb-8 p-6">
                <div className="flex flex-col lg:flex-row items-end gap-6 justify-between">
                    <div className="flex flex-wrap items-end gap-6 flex-1 w-full lg:w-auto">
                        <div className="flex-1 min-w-[300px]">
                            <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-2 px-1">Detailed Search</label>
                            <div className="relative">
                                <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                                <input
                                    type="text"
                                    placeholder="Search by Customer Name or Payment Method..."
                                    className="premium-input w-full h-11 pl-12 pr-4 bg-surface-50 focus:bg-white text-sm font-medium border-2 focus:border-primary/50"
                                    onChange={(e) => {
                                        const term = e.target.value.toLowerCase();
                                        if (!term) {
                                            setTableData(bills);
                                        } else {
                                            const filtered = (bills || []).filter(b =>
                                                (b.customerName || '').toLowerCase().includes(term) ||
                                                (b.paymentMethod || '').toLowerCase().includes(term)
                                            );
                                            setTableData(filtered);
                                        }
                                    }}
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
                                className="btn btn-primary h-11 px-8 rounded-xl shadow-premium border-none gap-2 flex-grow sm:flex-grow-0"
                            >
                                <HiOutlineFunnel /> Filter
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