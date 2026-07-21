import React from 'react';
import { motion } from 'framer-motion';
import { FaList, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

export default function AdminCategories() {
    const categories = [
        { id: 1, name: 'Food', count: 45, status: 'Active' },
        { id: 2, name: 'Clothes', count: 120, status: 'Active' },
        { id: 3, name: 'Books', count: 85, status: 'Active' },
        { id: 4, name: 'Toys', count: 30, status: 'Active' },
        { id: 5, name: 'Others', count: 15, status: 'Active' },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-5xl mx-auto">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Categories</h2>
                    <p className="text-gray-500 mt-1">Manage donation categories and types.</p>
                </div>
                <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-secondary transition-colors shadow-md">
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
        </motion.div>
    );
}
