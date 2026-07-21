import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaEye, FaFileAlt, FaBox, FaTshirt, FaBook, FaBed, FaGamepad } from 'react-icons/fa';
import { ngoService } from '../../services/api';

export default function AcceptedDonations({ user }) {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDonations = async () => {
            if (!user || !user.id) return;
            try {
                const res = await ngoService.getAcceptedDonations(user.id);
                setDonations(res.data || []);
            } catch (err) {
                console.error("Failed to fetch accepted donations", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDonations();
        const intervalId = setInterval(fetchDonations, 5000);
        return () => clearInterval(intervalId);
    }, [user]);

    const getCategoryIcon = (category) => {
        const cat = category?.toLowerCase();
        if (cat === 'food' || cat === 'rice') return <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-lg"><FaBox /></div>;
        if (cat === 'clothes' || cat === 'clothing') return <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-lg"><FaTshirt /></div>;
        if (cat === 'books' || cat === 'education') return <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center text-lg"><FaBook /></div>;
        if (cat === 'blankets') return <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center text-lg"><FaBed /></div>;
        if (cat === 'toys' || cat === 'kids') return <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center text-lg"><FaGamepad /></div>;
        return <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-lg"><FaBox /></div>;
    };

    const getStatusStyle = (status) => {
        if (status === 'COMPLETED') return 'bg-green-50 text-green-500 border-green-100';
        if (status === 'IN TRANSIT' || status === 'ACCEPTED') return 'bg-blue-50 text-blue-500 border-blue-100';
        return 'bg-gray-50 text-gray-500 border-gray-100';
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-7xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Accepted Donations</h2>
                <p className="text-gray-500 mt-1">View all accepted donations.</p>
            </div>
            
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 flex-1">
                {/* Toolbar */}
                <div className="flex justify-between items-center mb-8 gap-4">
                    <div className="relative flex-1 max-w-md">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by ID, Item, or Donor..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 text-gray-700 border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                    <div className="flex gap-4">
                        <select className="bg-gray-50 border border-gray-100 text-gray-700 py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-medium appearance-none">
                            <option>All Status</option>
                        </select>
                        <select className="bg-gray-50 border border-gray-100 text-gray-700 py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-medium appearance-none">
                            <option>This Month</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="py-20 text-center text-gray-500">Loading accepted donations...</div>
                ) : donations.length === 0 ? (
                    <div className="py-20 text-center text-gray-500">No accepted donations found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-gray-900 font-bold border-b border-gray-100">
                                    <th className="py-4 px-4 font-bold">Item</th>
                                    <th className="py-4 px-4 font-bold">Donor</th>
                                    <th className="py-4 px-4 font-bold">Quantity</th>
                                    <th className="py-4 px-4 font-bold">Accepted On</th>
                                    <th className="py-4 px-4 font-bold">Status</th>
                                    <th className="py-4 px-4 font-bold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donations.filter(don => 
                                    (don.id || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                                    (don.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    (don.donorName || '').toLowerCase().includes(searchTerm.toLowerCase())
                                ).map((d) => (
                                    <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                {getCategoryIcon(d.category)}
                                                <span className="font-bold text-gray-900">{d.category}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-gray-600 font-medium">Unknown Donor</td>
                                        <td className="py-4 px-4 text-gray-600 font-medium">{d.quantity}</td>
                                        <td className="py-4 px-4 text-gray-600 font-medium">{new Date(d.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(d.status)}`}>
                                                {d.status === 'ACCEPTED' ? 'In Transit' : d.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                                    <FaEye size={14} />
                                                </button>
                                                <button className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                                    <FaFileAlt size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {/* Pagination (Static) */}
                {!loading && donations.length > 0 && (
                    <div className="flex justify-between items-center mt-6 text-gray-500 text-sm">
                        <span>Showing 1 to {donations.length} of {donations.length} donations</span>
                        <div className="flex gap-1">
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100">&lt;</button>
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-white font-bold">1</button>
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 font-medium">2</button>
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 font-medium">3</button>
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100">&gt;</button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
