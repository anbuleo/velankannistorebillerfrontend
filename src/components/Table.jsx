import React, { useMemo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AxiosService from '../common/Axioservice'
import { deleteProductRedux } from '../common/ProductSlice'
import { toast } from 'react-toastify'
import { MdEdit, MdDelete } from 'react-icons/md'

/**
 * Table Component: Senior-optimized for high-volume inventory.
 * Uses React.memo with custom comparison for sub-millisecond render times.
 */
function Table({ data }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const userData = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('data')) } catch (e) { return {} }
  }, [])

  const isAdmin = userData.role === 'admin'

  const handleDeleteProduct = useCallback(async (id, name) => {
    if (userData.role !== 'admin') return toast.warning('Admin privileges required to delete products')

    const confirmToast = toast.error(
      <div className="flex items-start gap-4 p-1">
        <div className="w-12 h-12 rounded-full bg-error/20 flex items-center justify-center shrink-0">
          <MdDelete className="text-error text-xl" />
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <p className="font-black text-[11px] text-surface-900 uppercase tracking-tighter leading-tight">Delete {name}?</p>
            <p className="text-[10px] font-bold text-surface-500 uppercase tracking-wider mt-1">This will remove it from inventory forever</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                toast.dismiss(confirmToast);
                try {
                  const res = await AxiosService.delete(`/product/deleteproduct/${id}`)
                  if (res.status === 200) {
                    dispatch(deleteProductRedux(id))
                    toast.success(`${name} purged successfully`)
                  }
                } catch (e) { toast.error('Purge failure') }
              }}
              className="bg-error text-white h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-error/20 active:scale-95 transition-all"
            >
              Purge Record
            </button>
            <button onClick={() => toast.dismiss(confirmToast)} className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-surface-500 hover:bg-surface-100 transition-all">Dismiss</button>
          </div>
        </div>
      </div>,
      { autoClose: false, closeOnClick: false, draggable: false, icon: false }
    );
  }, [dispatch, userData.role])

  const handleEditProduct = useCallback((id) => {
    if (userData.role !== 'admin') return toast.warning('Admin privileges required to edit products')
    navigate(`/editproduct/${id}`)
  }, [navigate, userData.role])

  return (
    <div className="glass-card overflow-hidden">
      <table className="premium-table">
        <thead>
          <tr>
            <th className="w-16">#</th>
            <th>Product Name</th>
            <th>Category</th>
            {userData.role === 'admin' && <th className="text-right">Cost Price</th>}
            <th className="text-right">Selling Price</th>
            <th className="text-center">Stock</th>
            <th>Code</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? data.map((item, i) => (
            <tr key={item._id} className="hover:bg-surface-50/50 transition-colors">
              <td className="text-surface-400 font-bold">{i + 1}</td>
              <td className="tracking-tight py-4">
                <p className="font-black text-primary uppercase text-sm leading-tight mb-1">{item.productName}</p>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-surface-900 font-bold uppercase">{item.tanglishName}</span>
                  <span className="text-[10px] text-surface-300 font-bold uppercase tracking-widest leading-none">|</span>
                  <span className="text-[10px] text-secondary font-black uppercase tracking-widest leading-none">{item.unitValue}{item.qantityType}</span>
                </div>
              </td>
              <td>
                <span className="badge badge-outline border-surface-200 text-surface-500 font-medium text-[10px] uppercase tracking-wider px-2">
                  {item.productType}
                </span>
              </td>
              {userData.role === 'admin' && <td className="text-right font-bold text-surface-500 font-mono">₹{item.productCost || '--'}</td>}
              <td className="text-right font-bold text-primary font-mono">₹{item.productPrice}</td>
              <td className="text-center font-bold">
                <span className={item.stockQuantity < 10 ? 'text-error' : 'text-surface-900'}>
                  {item.stockQuantity}
                </span>
                <span className="text-[10px] text-surface-400 ml-1 uppercase">{item.qantityType}</span>
              </td>
              <td className="font-mono text-[11px] text-surface-500 max-w-[120px] truncate" title={item.productCode}>
                {item.productCode || 'N/A'}
              </td>
              <td className="text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEditProduct(item._id)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all active:scale-90"
                  >
                    <MdEdit className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(item._id, item.productName)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-error/5 text-error hover:bg-error hover:text-white transition-all active:scale-90"
                  >
                    <MdDelete className="text-lg" />
                  </button>
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={isAdmin ? 8 : 7} className="h-40 text-center text-surface-400 italic">No products matched the current filters</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

// Memoize to prevent re-renders unless data array actually changes
export default React.memo(Table, (prev, next) => {
  return prev.data === next.data;
})