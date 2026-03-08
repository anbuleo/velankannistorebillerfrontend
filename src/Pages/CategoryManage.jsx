import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useCategory from '../Hooks/useCategory'
import { MdCategory, MdAdd, MdDelete, MdArrowBack, MdChevronRight, MdDescription, MdList } from 'react-icons/md'

function CategoryManage() {
    const { loading, categories, createCategory, deleteCategory } = useCategory()
    const [newCategory, setNewCategory] = useState({ name: '', description: '' })
    const user = JSON.parse(localStorage.getItem('user'))

    const handleCreate = async (e) => {
        e.preventDefault()
        if (!newCategory.name) return
        const success = await createCategory({
            ...newCategory,
            createdBy: user?.userName || 'Admin'
        })
        if (success) {
            setNewCategory({ name: '', description: '' })
        }
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-5xl fade-in min-h-[80vh]">
            <div className="flex items-center gap-2 mb-10 text-sm font-bold text-surface-400">
                <Link to="/home" className="hover:text-primary transition-colors uppercase tracking-widest text-[10px]">Dashboard</Link>
                <MdChevronRight className="text-lg opacity-40" />
                <span className="text-surface-900 uppercase tracking-widest text-[10px]">Category Management</span>
            </div>

            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center text-3xl shadow-premium">
                        <MdCategory />
                    </div>
                    <div>
                        <h1 className="text-3xl font-display font-bold text-surface-900 mb-1">Store Categories</h1>
                        <p className="text-surface-500 font-medium">Define and manage product classifications.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Create Form */}
                <div className="md:col-span-1">
                    <div className="glass-card p-8 sticky top-32 shadow-xl border border-surface-100">
                        <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-8 border-b border-surface-100 pb-4 flex items-center gap-2">
                            <MdAdd className="text-lg" /> Create New Category
                        </h3>

                        <form onSubmit={handleCreate} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-surface-500 uppercase mb-2 ml-1">Category Name</label>
                                <div className="relative">
                                    <MdCategory className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 text-lg" />
                                    <input
                                        className="premium-input w-full h-14 pl-12"
                                        placeholder="e.g. Beverages"
                                        value={newCategory.name}
                                        onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-surface-500 uppercase mb-2 ml-1">Description (Optional)</label>
                                <div className="relative">
                                    <MdDescription className="absolute left-4 top-4 text-surface-400 text-lg" />
                                    <textarea
                                        className="premium-input w-full h-32 pl-12 pt-4 resize-none"
                                        placeholder="Brief details about this category..."
                                        value={newCategory.description}
                                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !newCategory.name}
                                className={`premium-button w-full h-14 text-white flex items-center justify-center gap-2 ${loading || !newCategory.name ? 'opacity-50 grayscale' : 'bg-primary shadow-primary/30'}`}
                            >
                                {loading ? <span className="loading loading-spinner"></span> : <><MdAdd className="text-xl" /> Add Category</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Categories List */}
                <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <h3 className="text-xs font-bold text-surface-400 uppercase tracking-widest flex items-center gap-2">
                            <MdList className="text-lg" /> Active Categories ({categories.length})
                        </h3>
                    </div>

                    {categories.length === 0 ? (
                        <div className="glass-card p-12 text-center text-surface-400 border border-dashed border-surface-200">
                            <MdCategory className="text-6xl mx-auto mb-4 opacity-10" />
                            <p className="font-medium italic">No categories created yet. Start by defining one on the left.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {categories?.map((cat) => (
                                <div key={cat._id} className="glass-card p-6 flex items-center justify-between hover:border-primary/30 transition-all duration-300 group">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-xl bg-surface-100 flex items-center justify-center text-surface-400 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                            <span className="font-bold">{cat.name[0]}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-surface-900 group-hover:text-primary transition-colors">{cat.name}</h4>
                                            <p className="text-xs text-surface-500 mt-0.5 line-clamp-1">{cat.description || 'No description provided.'}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => deleteCategory(cat._id)}
                                        className="btn btn-ghost btn-circle text-surface-300 hover:text-error hover:bg-error/10 transition-all duration-300"
                                    >
                                        <MdDelete className="text-xl" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CategoryManage
