import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaFileAlt, FaEye } from 'react-icons/fa';

export default function AdminVerification() {
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        fetchPendingNgos();
    }, []);

    const fetchPendingNgos = async () => {
        try {
            const response = await adminService.getPendingNgos();
            setNgos(response.data);
        } catch (error) {
            console.error("Failed to fetch pending NGOs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await adminService.approveNgo(id);
            alert('NGO Approved successfully! Email notification sent.');
            fetchPendingNgos();
        } catch (error) {
            alert('Failed to approve NGO');
        }
    };

    const handleReject = async (id) => {
        if (!rejectReason) {
            alert('Please provide a reason for rejection');
            return;
        }
        try {
            await adminService.rejectNgo(id, rejectReason);
            alert('NGO Rejected. Rejection email sent.');
            setRejectingId(null);
            setRejectReason('');
            fetchPendingNgos();
        } catch (error) {
            alert('Failed to reject NGO');
        }
    };

    if (loading) return <div className="p-8">Loading pending verifications...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-6xl">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">NGO Verification</h2>
                    <p className="text-gray-500 mt-1">Review and approve new NGO registrations.</p>
                </div>
                <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-xl font-bold">
                    {ngos.length} Pending
                </div>
            </div>
            
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden flex-1">
                {ngos.length === 0 ? (
                    <div className="py-20 text-center text-gray-500">
                        No pending verifications.
                    </div>
                ) : (
                    <div className="overflow-x-auto p-4">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="p-4 font-bold text-gray-800 bg-gray-50/50 rounded-l-xl">NGO Details</th>
                                    <th className="p-4 font-bold text-gray-800 bg-gray-50/50">Registration No.</th>
                                    <th className="p-4 font-bold text-gray-800 bg-gray-50/50">Documents</th>
                                    <th className="p-4 font-bold text-gray-800 bg-gray-50/50">Status</th>
                                    <th className="p-4 font-bold text-gray-800 bg-gray-50/50 rounded-r-xl">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ngos.map((ngo) => (
                                    <tr key={ngo.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4">
                                            <p className="font-bold text-gray-900">{ngo.organizationName}</p>
                                            <p className="text-sm text-gray-500">{ngo.email} • {ngo.mobileNumber}</p>
                                        </td>
                                        <td className="p-4 font-medium text-gray-700">
                                            {ngo.registrationNumber}
                                        </td>
                                        <td className="p-4">
                                            <button className="flex items-center space-x-2 text-primary font-medium hover:underline bg-primary/5 px-3 py-1.5 rounded-lg">
                                                <FaEye /> <span>View Files</span>
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">Pending</span>
                                        </td>
                                        <td className="p-4">
                                            {rejectingId === ngo.id ? (
                                                <div className="flex flex-col space-y-2">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Reason for rejection"
                                                        value={rejectReason}
                                                        onChange={(e) => setRejectReason(e.target.value)}
                                                        className="text-sm p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                                                    />
                                                    <div className="flex space-x-2">
                                                        <button onClick={() => handleReject(ngo.id)} className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Confirm Reject</button>
                                                        <button onClick={() => setRejectingId(null)} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300">Cancel</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center space-x-3">
                                                    <button 
                                                        onClick={() => handleApprove(ngo.id)}
                                                        className="flex items-center space-x-1 text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors font-medium text-sm"
                                                    >
                                                        <FaCheck /> <span>Approve</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => setRejectingId(ngo.id)}
                                                        className="flex items-center space-x-1 text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors font-medium text-sm"
                                                    >
                                                        <FaTimes /> <span>Reject</span>
                                                    </button>
                                                </div>
                                            )}
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
