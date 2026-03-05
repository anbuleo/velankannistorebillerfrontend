import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AxiosService from '../common/Axioservice'
import { deleteProductRedux } from '../common/ProductSlice'
import { toast } from 'react-toastify'
import { MdEdit, MdDelete } from 'react-icons/md'

function Table({ data }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const userData = JSON.parse(localStorage.getItem('data'))

  const handleDeleteProduct = async (id, name) => {
    if (userData.role !== 'admin') return toast.warning('Admin privileges required to delete products')

    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        const res = await AxiosService.delete(`/product/deleteproduct/${id}`)
        if (res.status === 200) {
          dispatch(deleteProductRedux(id))
          toast.success(`${name} deleted successfully`)
        }
      } catch (error) {
        toast.error('Failed to delete product')
      }
    }
  }

  const handleEditProduct = (id) => {
    if (userData.role !== 'admin') return toast.warning('Admin privileges required to edit products')
    navigate(`/editproduct/${id}`)
  }

  return (
    <div className="glass-card overflow-hidden">
      <table className="premium-table">
        <thead>
          <tr>
            <th className="w-16">#</th>
            <th>Product Name</th>
            <th>Category</th>
            <th className="text-right">Cost Price</th>
            <th className="text-right">Selling Price</th>
            <th className="text-center">Stock</th>
            <th>Code</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? data.map((item, i) => (
            <tr key={item._id}>
              <td className="text-surface-400 font-bold">{i + 1}</td>
              <td className="font-bold text-surface-900 uppercase tracking-tight">
                {item.productName}
                <span className="block text-[10px] text-surface-400 font-medium">{item.tanglishName}</span>
              </td>
              <td>
                <span className="badge badge-outline border-surface-200 text-surface-500 font-medium text-[10px] uppercase tracking-wider px-2">
                  {item.productType}
                </span>
              </td>
              <td className="text-right font-bold text-surface-500">₹{item.productCost || '--'}</td>
              <td className="text-right font-bold text-primary">₹{item.productPrice}</td>
              <td className="text-center font-bold">
                <span className={item.stockQuantity < 10 ? 'text-error' : 'text-surface-900'}>
                  {item.stockQuantity}
                </span>
                <span className="text-[10px] text-surface-400 ml-1 uppercase">{item.qantityType}</span>
              </td>
              <td className="font-mono text-xs text-surface-500">{item.productCode || 'N/A'}</td>
              <td className="text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEditProduct(item._id)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all"
                  >
                    <MdEdit className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(item._id, item.productName)}
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-error/5 text-error hover:bg-error hover:text-white transition-all"
                  >
                    <MdDelete className="text-lg" />
                  </button>
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={7} className="h-40 text-center text-surface-400 italic">No products found for this category</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table