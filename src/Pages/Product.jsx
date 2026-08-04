import React, { useEffect, useState, useMemo } from 'react'
import Table from '../components/Table'
import { Link } from 'react-router-dom'
import GetAllProductHook from '../Hooks/GetAllProductHook'
import { useSelector } from 'react-redux'
import { MdAdd, MdFilterList, MdRefresh, MdSearch, MdHistory, MdPriceChange } from 'react-icons/md'
import AxiosService from '../common/Axioservice'

/**
 * Product Management: Optimized with Memoization & Price Modification Audit Modal
 */
function Product() {
  const { getUSer, loading } = GetAllProductHook()
  const { product = [] } = useSelector((state) => state.product)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchInput, setSearchInput] = useState("")

  // Price Log Modal state
  const [showPriceLogModal, setShowPriceLogModal] = useState(false)
  const [priceLogs, setPriceLogs] = useState([])
  const [logsLoading, setLogsLoading] = useState(false)

  useEffect(() => {
    if (!product || product.length === 0) {
      getUSer('products')
    }
  }, [getUSer, product.length])

  const fetchPriceLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await AxiosService.get('/product/price-logs');
      setPriceLogs(res.data.logs || []);
    } catch (err) {
      console.error('Error fetching price logs:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  const openPriceLogs = () => {
    setShowPriceLogModal(true);
    fetchPriceLogs();
  };

  const categories = useMemo(() => {
    return ["all", ...new Set(product.map(p => p.productType))]
  }, [product])

  const filteredData = useMemo(() => {
    const term = searchInput.toLowerCase().trim();
    return product.filter(item => {
      const matchesCategory = selectedCategory === "all" || item.productType === selectedCategory
      const matchesSearch = !term ||
        item.productName.toLowerCase().includes(term) ||
        item.tanglishName.toLowerCase().includes(term) ||
        item.productCode.toLowerCase().includes(term)

      return matchesCategory && matchesSearch
    })
  }, [product, selectedCategory, searchInput])

  return (
    <div className="container mx-auto px-4 py-8 fade-in min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-display font-bold text-surface-900 tracking-tight leading-none mb-2">Inventory Management</h1>
          <p className="text-surface-500 font-medium">Add, update and manage your store products.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={openPriceLogs}
            className="h-12 px-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 font-black text-xs uppercase flex items-center gap-2 hover:bg-amber-100 transition-all shadow-sm"
          >
            <MdHistory className="text-lg text-amber-600" /> Price & MRP Audit Log
          </button>
          <button
            onClick={() => getUSer('products')}
            className={`w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-surface-200 text-surface-500 hover:text-primary hover:border-primary transition-all shadow-sm ${loading ? 'opacity-50 pointer-events-none' : ''}`}
            title="Refresh List"
          >
            <MdRefresh className={`text-xl ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link to="/createproduct" className="premium-button flex items-center gap-2 h-12 px-6">
            <MdAdd className="text-xl" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 mb-8 flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-surface-400" />
          <input
            type="text"
            placeholder="Search by name, Tanglish name, or code..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-11 pr-4 h-11 bg-surface-50 border border-surface-200 rounded-xl text-sm font-medium focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <MdFilterList className="text-surface-400 text-lg flex-shrink-0" />
          <span className="text-xs font-bold text-surface-400 uppercase tracking-wider flex-shrink-0">Filter:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 uppercase ${selectedCategory === cat
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-card p-6">
        <Table data={filteredData} loading={loading} />
      </div>

      {/* Price Modification Log Modal */}
      {showPriceLogModal && (
        <dialog open className="modal backdrop-blur-md bg-surface-900/40">
          <div className="modal-box max-w-4xl bg-white p-6 rounded-3xl shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <div>
                <h3 className="text-xl font-black text-surface-900 flex items-center gap-2">
                  <MdPriceChange className="text-warning text-2xl" /> Product Price & MRP Modification Audit Log
                </h3>
                <p className="text-xs font-bold text-surface-400 mt-0.5">Historical log of all price, cost, and MRP edits made by staff.</p>
              </div>
              <button onClick={() => setShowPriceLogModal(false)} className="w-8 h-8 rounded-full bg-surface-100 font-bold text-surface-500 hover:text-error">✕</button>
            </div>

            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-50 text-[10px] font-black uppercase text-surface-400 border-b sticky top-0">
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
                  {logsLoading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-xs font-bold text-surface-400 uppercase">Loading Price Logs...</td>
                    </tr>
                  ) : priceLogs.length > 0 ? priceLogs.map(log => (
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
        </dialog>
      )}
    </div>
  )
}

export default Product