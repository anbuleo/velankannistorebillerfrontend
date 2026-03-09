import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
    MdCurrencyRupee, MdSave, MdArrowBack, MdSync,
    MdSearch, MdCategory, MdInfo, MdTrendingUp, MdTrendingDown, MdLocalShipping
} from 'react-icons/md'
import { useSelector } from 'react-redux'
import AxiosService from '../common/Axioservice'
import GetAllProductHook from '../Hooks/GetAllProductHook'
import useCategory from '../Hooks/useCategory'

function QuickPriceUpdate() {
    const { getUSer } = GetAllProductHook()
    const { product } = useSelector(state => state.product)
    const { categories: allStoreCategories } = useCategory()
    const [prices, setPrices] = useState({}) // Stores { id: { price, cost } }
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getUSer()
    }, [])


    useEffect(() => {
        if (product) {
            const initialPrices = {}
            product.forEach(p => {
                initialPrices[p._id] = {
                    price: p.productPrice,
                    cost: p.productCost
                }
            })
            setPrices(initialPrices)
        }
    }, [product])

    const filteredProducts = useMemo(() => {
        if (!product) return []
        return product.filter(p => {
            const matchesSearch =
                p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.tanglishName?.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCat = selectedCategory ? p.productType === selectedCategory : true
            return matchesSearch && matchesCat
        })
    }, [product, searchTerm, selectedCategory])

    const handlePriceChange = (id, field, val) => {
        setPrices(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: val }
        }))
    }

    const handleUpdate = async () => {
        const updates = filteredProducts
            .filter(p => {
                const current = prices[p._id]
                return Number(current?.price) !== Number(p.productPrice) ||
                    Number(current?.cost) !== Number(p.productCost)
            })
            .map(p => {
                const current = prices[p._id]
                const isVegetable = p.productType === 'Vegetables'

                return {
                    id: p._id,
                    productPrice: Number(current.price),
                    productCost: Number(current.cost),
                    // For vegetables, automatically sync MRP to selling price
                    MRP: isVegetable ? Number(current.price) : p.MRP
                }
            })

        if (updates.length === 0) {
            toast.info("No price changes detected")
            return
        }

        setLoading(true)
        try {
            const res = await AxiosService.put('/product/bulk-price-update', { updates })
            if (res.status === 200) {
                toast.success(`Updated ${updates.length} products!`)
                getUSer()
            }
        } catch (error) {
            toast.error("Bulk update failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl fade-in min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-display font-bold text-surface-900 flex items-center gap-3">
                        <MdSync className="text-primary animate-spin-slow" /> Market Price Daily Sync
                    </h1>
                    <p className="text-surface-500 mt-1 font-medium italic">Adjust daily purchase and selling rates at once.</p>
                </div>
                <Link to="/product" className="btn btn-ghost rounded-xl text-surface-500 gap-2">
                    <MdArrowBack /> Back to Catalog
                </Link>
            </div>

            <div className="glass-card p-6 mb-8 bg-surface-900 text-white border-none shadow-xl shadow-primary/20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
                    <div>
                        <label className="block text-[10px] font-bold text-primary-200 uppercase tracking-widest mb-2 ml-1">Filter Category</label>
                        <div className="relative">
                            <MdCategory className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-300" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full h-12 bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 text-sm font-bold focus:bg-white/20 focus:outline-none transition-all"
                            >
                                <option value="" className="text-surface-900">All Categories</option>
                                {allStoreCategories?.map(cat => (
                                    <option key={cat._id} value={cat.name} className="text-surface-900">{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-primary-200 uppercase tracking-widest mb-2 ml-1">Quick Search</label>
                        <div className="relative">
                            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-300" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-12 bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 text-sm font-bold placeholder:text-primary-300/50 focus:bg-white/20 focus:outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={handleUpdate}
                            disabled={loading}
                            className="premium-button w-full h-12 bg-primary text-white flex items-center justify-center gap-2 hover:bg-white hover:text-primary transition-all shadow-lg active:scale-95 border-none"
                        >
                            {loading ? <span className="loading loading-spinner loading-xs"></span> : <><MdSave className="text-lg" /> Commit Changes</>}
                        </button>
                    </div>
                </div>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="premium-table">
                        <thead>
                            <tr className="bg-surface-50 text-[10px] uppercase tracking-widest text-surface-400">
                                <th className="py-4 px-6 text-left">Product Detail</th>
                                <th className="text-center w-[160px]">Purchase Rate</th>
                                <th className="text-center w-[160px]">Market Selling Rate</th>
                                <th className="text-right px-6">Live Margin</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length > 0 ? filteredProducts.map((p) => {
                                const currentData = prices[p._id] || { price: p.productPrice, cost: p.productCost }
                                const isPriceChanged = Number(currentData.price) !== Number(p.productPrice)
                                const isCostChanged = Number(currentData.cost) !== Number(p.productCost)

                                const margin = Number(currentData.price) - Number(currentData.cost)
                                const oldMargin = p.productPrice - p.productCost

                                return (
                                    <tr key={p._id} className={`hover:bg-surface-50/50 transition-colors ${(isPriceChanged || isCostChanged) ? 'bg-primary/5' : ''}`}>
                                        <td className="py-4 px-6">
                                            <p className="font-black text-primary text-sm uppercase leading-tight">{p.productName}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] text-surface-900 font-bold uppercase">{p.tanglishName}</span>
                                                <span className="text-[10px] text-surface-300 font-bold uppercase tracking-widest leading-none">|</span>
                                                <span className="text-[10px] text-secondary font-black uppercase tracking-widest leading-none">{p.unitValue}{p.qantityType}</span>
                                            </div>
                                        </td>

                                        {/* Cost Input */}
                                        <td className="text-center py-2 px-2">
                                            <div className={`relative flex items-center transition-transform duration-300 ${isCostChanged ? 'scale-105' : ''}`}>
                                                <MdLocalShipping className={`absolute left-3 z-10 ${isCostChanged ? 'text-primary' : 'text-surface-400 opacity-40'}`} />
                                                <input
                                                    type="number"
                                                    className={`w-full h-10 pl-9 pr-3 rounded-xl border-2 font-display font-black text-center text-sm transition-all focus:outline-none ${isCostChanged
                                                        ? 'border-primary bg-white text-primary shadow-lg shadow-primary/10'
                                                        : 'border-surface-100 bg-surface-50 text-surface-400'
                                                        }`}
                                                    value={currentData.cost || ''}
                                                    onChange={(e) => handlePriceChange(p._id, 'cost', e.target.value)}
                                                />
                                            </div>
                                        </td>

                                        {/* Price Input */}
                                        <td className="text-center py-2 px-2">
                                            <div className={`relative flex items-center transition-transform duration-300 ${isPriceChanged ? 'scale-105' : ''}`}>
                                                <MdCurrencyRupee className={`absolute left-3 z-10 ${isPriceChanged ? 'text-primary' : 'text-surface-400'}`} />
                                                <input
                                                    type="number"
                                                    className={`w-full h-10 pl-9 pr-3 rounded-xl border-2 font-display font-black text-center text-sm transition-all focus:outline-none ${isPriceChanged
                                                        ? 'border-primary bg-white text-primary shadow-lg shadow-primary/10'
                                                        : 'border-surface-100 bg-surface-50 text-surface-900'
                                                        }`}
                                                    value={currentData.price || ''}
                                                    onChange={(e) => handlePriceChange(p._id, 'price', e.target.value)}
                                                />
                                            </div>
                                        </td>

                                        <td className="text-right px-6">
                                            <div className="flex flex-col items-end">
                                                <p className={`text-sm font-black font-display ${margin > 0 ? 'text-success' : 'text-error'}`}>
                                                    ₹{margin.toFixed(2)}
                                                </p>
                                                {margin !== oldMargin && (
                                                    <p className={`text-[9px] font-black uppercase tracking-tighter ${margin > oldMargin ? 'text-success' : 'text-error'}`}>
                                                        {margin > oldMargin ? <MdTrendingUp className="inline" /> : <MdTrendingDown className="inline" />}
                                                        {margin > oldMargin ? ' Gain' : ' Loss'}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }) : (
                                <tr>
                                    <td colSpan={4} className="py-32 text-center text-surface-400 italic">
                                        <MdInfo className="text-4xl mx-auto mb-4 opacity-10" />
                                        No products found matching filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default QuickPriceUpdate
