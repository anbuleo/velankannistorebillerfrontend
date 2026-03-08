import React, { useEffect, useState, useMemo } from 'react'
import Table from '../components/Table'
import { Link } from 'react-router-dom'
import GetAllProductHook from '../Hooks/GetAllProductHook'
import { useSelector } from 'react-redux'
import { MdAdd, MdFilterList, MdRefresh, MdSearch } from 'react-icons/md'

/**
 * Product Management: Optimized with Memoization & Targeted Syncing
 */
function Product() {
  const { getUSer, loading } = GetAllProductHook()
  const { product = [] } = useSelector((state) => state.product)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchInput, setSearchInput] = useState("")

  useEffect(() => {
    // Initial Sync: Only fetch products to save bandwidth
    if (!product || product.length === 0) {
      getUSer('products')
    }
  }, [getUSer, product.length])

  // Memoize Category List to prevent expensive Set operations on re-render
  const categories = useMemo(() => {
    return ["all", ...new Set(product.map(p => p.productType))]
  }, [product])

  // Senior Optimization: Memoize the filtering logic.
  // This prevents the expensive .filter() from running when typing in unrelated fields.
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

        <div className="flex items-center gap-3">
          <button
            onClick={() => getUSer('products')}
            className={`w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-surface-200 text-surface-500 hover:text-primary hover:border-primary transition-all shadow-sm ${loading ? 'opacity-50 pointer-events-none' : ''}`}
            title="Refresh List"
          >
            <MdRefresh className={`text-xl ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link to="/createproduct" className="premium-button flex items-center gap-2 h-12 px-6">
            <MdAdd className="text-xl" /> Create Product
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="glass-card mb-8 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1 relative">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-lg" />
            <input
              type="text"
              placeholder="Search products by name, tamil name, or barcode..."
              className="premium-input w-full h-12 pl-12 focus:bg-white text-sm"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            <div className="flex items-center gap-2 text-surface-400 font-bold uppercase text-[10px] tracking-widest whitespace-nowrap px-2">
              <MdFilterList className="text-sm" /> Filter By
            </div>
            <div className="flex gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${selectedCategory === cat
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105'
                    : 'bg-white border-surface-200 text-surface-500 hover:border-primary hover:text-primary'
                    }`}
                >
                  {cat || 'Uncategorized'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Table data={filteredData} />
    </div>
  )
}

export default Product