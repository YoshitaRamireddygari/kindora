import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import { motion } from 'framer-motion';
import { FaBoxOpen, FaCheckCircle, FaClock, FaTruck } from 'react-icons/fa';

export default function AdminDonations() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const res = await adminService.getDonations();
                setDonations(res.data);
            } catch (error) {
                console.error("Failed to fetch donations", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDonations();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'ACCEPTED': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'SCHEDULED': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING': return <FaClock className="mr-1" />;
            case 'ACCEPTED': return <FaCheckCircle className="mr-1" />;
            case 'SCHEDULED': return <FaTruck className="mr-1" />;
            case 'COMPLETED': return <FaCheckCircle className="mr-1" />;
            default: return null;
        }
    };

    if (loading) return <div className="p-8">Loading donations...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-7xl mx-auto">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">System Donations</h2>
                    <p className="text-gray-500 mt-1">Overview of all donations flowing through the platform.</p>
                </div>
            </div>

            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                                <th className="p-4 font-semibold pl-6">Item</th>
                                <th className="p-4 font-semibold">Category</th>
                                <th className="p-4 font-semibold">Quantity</th>
                                <th className="p-4 font-semibold">Location</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map((donation) => (
                                <tr key={donation.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 pl-6 font-medium text-gray-800 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center">
                                            <FaBoxOpen />
                                        </div>
                                        {donation.description || 'Donation Item'}
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold">
                                            {donation.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600">{donation.quantity}</td>
                                    <td className="p-4 text-gray-500 text-sm">{donation.pickupAddress}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center w-fit ${getStatusStyle(donation.status)}`}>
                                            {getStatusIcon(donation.status)}
                                            {donation.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500 text-sm">
                                        {donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                            {donations.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">No donations found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
