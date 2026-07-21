import React, { useEffect, useState } from 'react';
import { donorService } from '../../services/api';
import { motion } from 'framer-motion';
import { FaSearch, FaHome } from 'react-icons/fa';

export default function DonationHistory({ user }) {
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

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-gray-100 text-gray-600 border border-gray-200';
            case 'ACCEPTED': return 'bg-blue-50 text-blue-500 border border-blue-100';
            case 'IN TRANSIT':
            case 'SCHEDULED': return 'bg-blue-50 text-blue-500 border border-blue-100';
            case 'COMPLETED': return 'bg-green-50 text-green-500 border border-green-100';
            default: return 'bg-gray-50 text-gray-500';
        }
    };

    if (loading) return <div className="p-8 text-gray-500">Loading history...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-5xl">
            <div className="mb-8 flex items-center space-x-2">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Donation History</h2>
                    <div className="flex items-center text-gray-500 mt-1 space-x-2 text-sm">
                        <FaHome className="text-primary" />
                        <span>Your donation journey.</span>
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 flex-1">
                {/* Toolbar */}
                <div className="flex justify-between items-center mb-8 gap-4">
                    <div className="relative flex-1 max-w-md">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search history..." 
                            className="w-full bg-gray-50 text-gray-700 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all border border-gray-100"
                        />
                    </div>
                    <select className="bg-gray-50 border border-gray-100 text-gray-700 py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-medium appearance-none">
                        <option>Monthly</option>
                        <option>Yearly</option>
                        <option>All Time</option>
                    </select>
                </div>

                {/* Table View */}
                {donations.length === 0 ? (
                    <div className="py-20 text-center text-gray-500">
                        No history found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="p-4 font-bold text-gray-800 bg-gray-50/50 first:rounded-l-xl">Item</th>
                                    <th className="p-4 font-bold text-gray-800 bg-gray-50/50">NGO</th>
                                    <th className="p-4 font-bold text-gray-800 bg-gray-50/50">Date</th>
                                    <th className="p-4 font-bold text-gray-800 bg-gray-50/50 last:rounded-r-xl">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donations.map((d) => (
                                    <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 font-bold text-gray-900">
                                            {d.category}
                                        </td>
                                        <td className="p-4 text-gray-600 font-medium">
                                            Helping Hands NGO
                                        </td>
                                        <td className="p-4 text-gray-600 font-medium">
                                            {new Date(d.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${getStatusStyle(d.status)}`}>
                                                {d.status === 'SCHEDULED' ? 'In Transit' : d.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
