import React, { useEffect, useState } from 'react'
import Table from '../components/Table'
import { Link } from 'react-router-dom'
import GetAllProductHook from '../Hooks/GetAllProductHook'
import { useSelector } from 'react-redux'
import { MdAdd, MdFilterList, MdRefresh, MdSearch } from 'react-icons/md'

function Product() {
  const { getUSer } = GetAllProductHook()
  const { product } = useSelector((state) => state.product)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchInput, setSearchInput] = useState("")

  useEffect(() => {
    if (!product || product.length === 0) {
      getUSer()
    }
  }, [])

  const categories = product ? ["all", ...new Set(product.map(p => p.productType))] : ["all"]

  const filteredData = product?.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.productType === selectedCategory
    const matchesSearch =
      item.productName.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.tanglishName.toLowerCase().includes(searchInput.toLowerCase()) ||
      item.productCode.toLowerCase().includes(searchInput.toLowerCase())

    return matchesCategory && matchesSearch
  })

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-surface-900 mb-1">Inventory Management</h1>
          <p className="text-surface-500 font-medium">Add, update and manage your store products.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => getUSer()}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-surface-200 text-surface-500 hover:text-primary hover:border-primary transition-all shadow-sm"
            title="Refresh List"
          >
            <MdRefresh className="text-xl" />
          </button>
          <Link to="/createproduct" className="premium-button flex items-center gap-2 h-12 px-6">
            <MdAdd className="text-xl" /> Create Product
          </Link>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="glass-card mb-8 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1 relative">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-lg" />
            <input
              type="text"
              placeholder="Search products by name, tamil name, or barcode..."
              className="premium-input w-full h-12 pl-12"
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
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${selectedCategory === cat
                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-white border-surface-200 text-surface-500 hover:border-primary hover:text-primary'
                    }`}
                >
                  {cat}
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