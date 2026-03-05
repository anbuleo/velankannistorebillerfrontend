import { useState, useEffect } from 'react'
import AxiosService from '../common/Axioservice'
import { toast } from 'react-toastify'

function useCategory() {
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([])

    const getAllCategories = async () => {
        setLoading(true)
        try {
            const res = await AxiosService.get('/category/getall')
            if (res.status === 200) {
                setCategories(res.data.categories)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const createCategory = async (val) => {
        setLoading(true)
        try {
            const res = await AxiosService.post('/category/create', val)
            if (res.status === 201) {
                toast.success('Category Created Successfully')
                getAllCategories()
                return true
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error occurred')
        } finally {
            setLoading(false)
        }
        return false
    }

    const deleteCategory = async (id) => {
        setLoading(true)
        try {
            const res = await AxiosService.delete(`/category/delete/${id}`)
            if (res.status === 200) {
                toast.success('Category Deleted Successfully')
                getAllCategories()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error occurred while deleting category')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllCategories()
    }, [])

    return { loading, categories, createCategory, deleteCategory, getAllCategories }
}

export default useCategory
