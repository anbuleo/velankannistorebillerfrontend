import GetAllProductHook from '../Hooks/GetAllProductHook'
import { useSelector } from 'react-redux'
import { MdInventory2, MdWarning, MdArrowForward } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { useEffect, useMemo } from 'react'

function LowStock() {
    const { product } = useSelector(state => state.product)
    const { getUSer } = GetAllProductHook()

    useEffect(() => {
        if (!product || product.length === 0) {
            getUSer()
        }
    }, [])

    const lowStockItems = useMemo(() => {
        return product.filter(p => Number(p.stockQuantity) < 5)
    }, [product])

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-surface-900 flex items-center gap-3">
                        <MdWarning className="text-error" /> Low Stock Dashboard
                    </h1>
                    <p className="text-surface-500 mt-1 font-medium italic">Items requiring immediate reordering</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="badge badge-error h-10 px-4 font-bold text-sm shadow-lg shadow-error/20">
                        {lowStockItems.length} CRITICAL ITEMS
                    </span>
                    <Link to="/product" className="btn btn-ghost gap-2 font-bold text-primary">
                        View Full Inventory <MdArrowForward />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {lowStockItems.length > 0 ? lowStockItems.map((item) => (
                    <div key={item._id} className="glass-card overflow-hidden group hover:border-error/50 transition-all duration-300">
                        <div className="bg-gradient-to-br from-error/5 to-transparent p-6 pb-4">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-error shadow-sm border border-error/10">
                                    <MdInventory2 className="text-2xl" />
                                </div>
                                <span className={`badge ${Number(item.stockQuantity) === 0 ? 'badge-error' : 'badge-warning'} font-bold text-[10px] uppercase tracking-widest`}>
                                    {Number(item.stockQuantity) === 0 ? 'Out of Stock' : 'Low Stock'}
                                </span>
                            </div>
                            <h3 className="font-display font-bold text-surface-900 text-lg uppercase truncate" title={item.productName}>
                                {item.productName}
                            </h3>
                            <p className="text-[10px] font-extrabold text-primary uppercase tracking-[0.2em] mt-1">{item.tanglishName}</p>
                        </div>

                        <div className="p-6 pt-0">
                            <div className="divider my-4 opacity-50"></div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-1">Current Stock</p>
                                    <p className={`text-3xl font-display font-black ${Number(item.stockQuantity) === 0 ? 'text-error animate-pulse' : 'text-surface-900'}`}>
                                        {item.stockQuantity} <span className="text-sm font-bold text-surface-400 uppercase tracking-tight">{item.qantityType || 'pcs'}</span>
                                    </p>
                                </div>
                                <Link
                                    to={`/editproduct/${item._id}`}
                                    className="btn btn-outline btn-sm rounded-xl border-surface-200 text-surface-600 hover:bg-primary hover:text-white hover:border-primary font-bold"
                                >
                                    Update Stock
                                </Link>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full h-96 glass-card flex flex-col items-center justify-center text-center p-12">
                        <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mb-6">
                            <MdInventory2 className="text-4xl" />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-surface-900">All Stock Optimized!</h3>
                        <p className="text-surface-500 max-w-md mt-2">There are no products currently below the threshold of 5 units. Your inventory is well-maintained.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LowStock
