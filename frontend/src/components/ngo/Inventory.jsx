import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaEye, FaDownload } from 'react-icons/fa';
import { ngoService } from '../../services/api';

export default function Inventory({ user }) {
    const [inventoryItems, setInventoryItems] = useState([]);

    useEffect(() => {
        if (!user || !user.id) return;
        const fetchInventory = async () => {
            try {
                const res = await ngoService.getInventory(user.id);
                setInventoryItems(res.data || []);
            } catch (err) {
                console.error("Failed to fetch inventory", err);
            }
        };

        fetchInventory();
        const intervalId = setInterval(fetchInventory, 5000);

        return () => clearInterval(intervalId);
    }, [user]);

    const foodCount = inventoryItems.filter(i => i.category?.toLowerCase() === 'food' || i.category?.toLowerCase() === 'rice').length;
    const clothingCount = inventoryItems.filter(i => i.category?.toLowerCase() === 'clothing' || i.category?.toLowerCase() === 'clothes').length;
    const otherCount = inventoryItems.length - foodCount - clothingCount;

    const inventoryStats = [
        { label: 'Total Items', value: inventoryItems.length, unit: 'All time', color: 'text-primary' },
        { label: 'Food Items', value: foodCount, unit: 'Items', color: 'text-green-500' },
        { label: 'Clothing Items', value: clothingCount, unit: 'Items', color: 'text-pink-500' },
        { label: 'Other Items', value: otherCount, unit: 'Items', color: 'text-purple-500' },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-7xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Inventory / Items Received</h2>
                <p className="text-gray-500 mt-1">Manage all received items.</p>
            </div>
            
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 flex-1">
                {/* Toolbar */}
                <div className="flex justify-between items-center mb-8 gap-4">
                    <div className="relative flex-1 max-w-md">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search items..." 
                            className="w-full bg-gray-50 text-gray-700 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all border border-gray-100"
                        />
                    </div>
                    <div className="flex gap-4">
                        <select className="bg-gray-50 border border-gray-100 text-gray-700 py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-medium appearance-none">
                            <option>All Categories</option>
                        </select>
                        <select className="bg-gray-50 border border-gray-100 text-gray-700 py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-medium appearance-none">
                            <option>All Status</option>
                        </select>
                        <button className="bg-primary text-white py-3 px-6 rounded-xl font-medium hover:bg-secondary transition-colors flex items-center gap-2">
                            <FaDownload /> Export
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {inventoryStats.map((stat, idx) => (
                        <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                            <p className="text-gray-500 text-sm font-semibold mb-2">{stat.label}</p>
                            <h3 className={`text-4xl font-bold ${stat.color} mb-1`}>{stat.value}</h3>
                            <p className="text-gray-400 text-sm font-medium">{stat.unit}</p>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-gray-900 font-bold border-b border-gray-100">
                                <th className="py-4 px-4 font-bold">Item</th>
                                <th className="py-4 px-4 font-bold">Category</th>
                                <th className="py-4 px-4 font-bold">Quantity</th>
                                <th className="py-4 px-4 font-bold">Received On</th>
                                <th className="py-4 px-4 font-bold">Donor</th>
                                <th className="py-4 px-4 font-bold">Status</th>
                                <th className="py-4 px-4 font-bold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventoryItems.map((item) => (
                                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-4 font-bold text-gray-900">{item.category}</td>
                                    <td className="py-4 px-4 text-gray-600 font-medium">{item.category}</td>
                                    <td className="py-4 px-4 text-gray-600 font-medium">{item.quantity}</td>
                                    <td className="py-4 px-4 text-gray-600 font-medium">{new Date(item.createdAt).toLocaleDateString('en-GB')}</td>
                                    <td className="py-4 px-4 text-gray-600 font-medium">Unknown Donor</td>
                                    <td className="py-4 px-4">
                                        <span className="px-4 py-1.5 rounded-full text-xs font-bold border bg-green-50 text-green-500 border-green-100">
                                            Good
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <button className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors mx-auto">
                                            <FaEye size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
