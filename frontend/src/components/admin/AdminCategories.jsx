import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaList, FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { categoryService } from '../../services/api';

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await categoryService.getAll();
            setCategories(res.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        
        try {
            await categoryService.create({ name: newCategoryName });
            setNewCategoryName('');
            setShowModal(false);
            fetchCategories(); // Refresh list
        } catch (error) {
            console.error("Failed to add category", error);
            alert("Failed to add category.");
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-5xl mx-auto">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Categories</h2>
                    <p className="text-gray-500 mt-1">Manage donation categories and types.</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-secondary transition-colors shadow-md"
                >
                    <FaPlus /> Add Category
                </button>
            </div>

            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                            <th className="p-4 font-semibold pl-6">Category Name</th>
                            <th className="p-4 font-semibold">Total Items</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold text-right pr-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="p-4 pl-6 font-medium text-gray-800 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                                        <FaList />
                                    </div>
                                    {cat.name}
                                </td>
                                <td className="p-4 text-gray-600">{cat.count} donations</td>
                                <td className="p-4">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                        {cat.status}
                                    </span>
                                </td>
                                <td className="p-4 pr-6 text-right">
                                    <button className="text-gray-400 hover:text-primary p-2 transition-colors mr-2"><FaEdit /></button>
                                    <button className="text-gray-400 hover:text-red-500 p-2 transition-colors"><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Category Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">Add New Category</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <FaTimes size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleAddCategory}>
                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-800 mb-2">Category Name</label>
                                <input 
                                    type="text" 
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="e.g. Blankets"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-700 font-medium"
                                    required
                                />
                            </div>
                            <div className="flex gap-4">
                                <button 
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 py-3 rounded-xl font-bold text-white bg-primary hover:bg-secondary transition-colors"
                                >
                                    Add Category
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
