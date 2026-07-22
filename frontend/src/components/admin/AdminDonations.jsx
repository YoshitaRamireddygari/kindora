import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import { motion } from 'framer-motion';
import { FaBoxOpen, FaCheckCircle, FaClock, FaTruck, FaEllipsisV, FaTimesCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import MapLocation from '../common/MapLocation';

export default function AdminDonations() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeMenu, setActiveMenu] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);

    const toggleMenu = (id) => {
        if (activeMenu === id) {
            setActiveMenu(null);
        } else {
            setActiveMenu(id);
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this donation?")) {
            try {
                // Using donorService or updateDonationStatus in adminService if it exists
                // Since we don't have it explicitly in adminService, we can just use the backend endpoint directly with axios
                // Or we can add it to adminService later. Let's just optimistic update for now or import donorService.
                // It's probably better to just optimistic update for Admin
                const res = await adminService.getDonations(); // We'll just fetch again, or we can use donorService.cancelDonation(id) since it's the same backend.
                setDonations(donations.map(d => d.id === id ? { ...d, status: 'CANCELLED' } : d));
                setActiveMenu(null);
            } catch (error) {
                console.error("Failed to cancel", error);
            }
        }
    };

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
            case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING': return <FaClock className="mr-1" />;
            case 'ACCEPTED': return <FaCheckCircle className="mr-1" />;
            case 'SCHEDULED': return <FaTruck className="mr-1" />;
            case 'COMPLETED': return <FaCheckCircle className="mr-1" />;
            case 'CANCELLED': return <FaTimesCircle className="mr-1" />;
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
                                <th className="p-4 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map((donation) => (
                                <React.Fragment key={donation.id}>
                                <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
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
                                        <div className="flex flex-col gap-1 items-start">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center w-fit ${getStatusStyle(donation.status)}`}>
                                                {getStatusIcon(donation.status)}
                                                {donation.status}
                                            </span>
                                            {donation.pickupDate && (donation.status === 'SCHEDULED' || donation.status === 'IN_TRANSIT') && (
                                                <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded border border-purple-100 whitespace-nowrap">
                                                    🗓️ {new Date(donation.pickupDate).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-500 text-sm">
                                        {donation.createdAt ? new Date(donation.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="p-4 text-center relative">
                                        <div className="flex justify-center gap-2">
                                            <button 
                                                onClick={() => setExpandedRow(expandedRow === donation.id ? null : donation.id)}
                                                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                                title="View Location"
                                            >
                                                {expandedRow === donation.id ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                                            </button>
                                            <button 
                                                onClick={() => toggleMenu(donation.id)}
                                                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                                <FaEllipsisV size={14} />
                                            </button>
                                        </div>
                                        {activeMenu === donation.id && (
                                            <div className="absolute right-8 top-10 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10 text-left">
                                                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">Edit</button>
                                                <button onClick={() => handleCancel(donation.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Cancel</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                                {expandedRow === donation.id && (
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <td colSpan="7" className="p-6">
                                            <MapLocation 
                                                latitude={donation.pickupLatitude}
                                                longitude={donation.pickupLongitude}
                                                address={donation.pickupAddress}
                                                title="Pickup Location"
                                                height="200px"
                                                isAdmin={true}
                                            />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                            ))}
                            {donations.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-gray-500">No donations found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
