import React, { useEffect, useState } from 'react';
import { donorService } from '../../services/api';
import { motion } from 'framer-motion';
import { FaSearch, FaEllipsisV, FaShoppingBag, FaBicycle, FaTshirt, FaBook, FaBox } from 'react-icons/fa';

export default function MyDonations({ user }) {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await donorService.getHistory(user.id);
                setDonations(response.data);
            } catch (error) {
                console.error("Failed to fetch donations", error);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.id) {
            fetchDonations();
        } else {
            setLoading(false); 
        }
    }, [user]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-gray-100 text-gray-600 border border-gray-200';
            case 'ACCEPTED': return 'bg-blue-50 text-blue-500 border border-blue-100';
            case 'IN TRANSIT':
            case 'SCHEDULED': return 'bg-blue-50 text-blue-500 border border-blue-100';
            case 'COMPLETED': return 'bg-green-50 text-green-500 border border-green-100';
            default: return 'bg-gray-50 text-gray-500';
        }
    };

    const getCategoryIcon = (category) => {
        switch (category?.toLowerCase()) {
            case 'clothes': return <div className="w-12 h-12 rounded-full bg-green-100 text-green-500 flex items-center justify-center text-xl"><FaTshirt /></div>;
            case 'books': return <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-xl"><FaBook /></div>;
            case 'food': return <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-xl"><FaBox /></div>;
            case 'bike': return <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-xl"><FaBicycle /></div>;
            default: return <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center text-xl"><FaShoppingBag /></div>;
        }
    };

    if (loading) return <div className="p-8 text-gray-500">Loading donations...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-5xl">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">My Donations</h2>
                <p className="text-gray-500 mt-1">View your all donations.</p>
            </div>
            
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 flex-1">
                {/* Toolbar */}
                <div className="flex justify-between items-center mb-8 gap-4">
                    <div className="relative flex-1 max-w-md">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search donations..." 
                            className="w-full bg-gray-50 text-gray-700 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all border border-gray-100"
                        />
                    </div>
                    <select className="bg-gray-50 border border-gray-100 text-gray-700 py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-medium appearance-none">
                        <option>All Status</option>
                        <option>Completed</option>
                        <option>In Transit</option>
                    </select>
                </div>

                {/* List View */}
                {donations.length === 0 ? (
                    <div className="py-20 text-center text-gray-500 flex flex-col items-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <FaShoppingBag className="text-3xl text-gray-300" />
                        </div>
                        <p>No donations found.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {donations.map((d) => (
                            <div key={d.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                                <div className="flex items-center space-x-6 flex-1">
                                    {getCategoryIcon(d.category)}
                                    <div className="w-1/3">
                                        <p className="font-bold text-gray-900">{d.category}</p>
                                        <p className="text-sm text-gray-500">Helping Hands NGO</p>
                                    </div>
                                    <div className="w-1/4 text-gray-500 font-medium">
                                        {new Date(d.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                    <div className="w-1/4 flex justify-end">
                                        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(d.status)}`}>
                                            {d.status === 'SCHEDULED' ? 'In Transit' : d.status}
                                        </span>
                                    </div>
                                </div>
                                <button className="p-3 text-gray-400 hover:text-gray-700 transition-colors ml-4">
                                    <FaEllipsisV />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
