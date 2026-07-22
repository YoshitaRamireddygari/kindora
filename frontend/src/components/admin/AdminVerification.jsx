import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaFileAlt, FaEye } from 'react-icons/fa';
import MapLocation from '../common/MapLocation';

export default function AdminVerification() {
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [viewingNgo, setViewingNgo] = useState(null);

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
                                            <button 
                                                onClick={() => setViewingNgo(ngo)}
                                                className="flex items-center space-x-2 text-primary font-medium hover:underline bg-primary/5 px-3 py-1.5 rounded-lg">
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

            {viewingNgo && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">NGO Documents & Location</h3>
                        <p className="text-gray-500 mb-6">Uploaded by {viewingNgo.organizationName}</p>
                        
                        <div className="mb-6">
                            <MapLocation 
                                latitude={viewingNgo.latitude}
                                longitude={viewingNgo.longitude}
                                address={`${viewingNgo.address}, ${viewingNgo.city}, ${viewingNgo.state} - ${viewingNgo.pincode}`}
                                title="Registered Address"
                                height="200px"
                                isAdmin={true}
                            />
                        </div>

                        <div className="space-y-4">
                            {viewingNgo.registrationCertificate ? (
                                <a href={viewingNgo.registrationCertificate} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <FaFileAlt className="text-blue-500 text-xl" />
                                        <span className="font-medium text-gray-700">Registration Certificate</span>
                                    </div>
                                    <FaEye className="text-gray-400" />
                                </a>
                            ) : (
                                <div className="flex items-center justify-between p-4 border border-gray-100 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <FaFileAlt className="text-gray-400 text-xl" />
                                        <span className="font-medium text-gray-400">Registration Certificate (Not uploaded)</span>
                                    </div>
                                </div>
                            )}
                            
                            {viewingNgo.panCard ? (
                                <a href={viewingNgo.panCard} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <FaFileAlt className="text-blue-500 text-xl" />
                                        <span className="font-medium text-gray-700">PAN Card</span>
                                    </div>
                                    <FaEye className="text-gray-400" />
                                </a>
                            ) : (
                                <div className="flex items-center justify-between p-4 border border-gray-100 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <FaFileAlt className="text-gray-400 text-xl" />
                                        <span className="font-medium text-gray-400">PAN Card (Not uploaded)</span>
                                    </div>
                                </div>
                            )}

                            {viewingNgo.addressProof ? (
                                <a href={viewingNgo.addressProof} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <FaFileAlt className="text-blue-500 text-xl" />
                                        <span className="font-medium text-gray-700">Address Proof</span>
                                    </div>
                                    <FaEye className="text-gray-400" />
                                </a>
                            ) : (
                                <div className="flex items-center justify-between p-4 border border-gray-100 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <FaFileAlt className="text-gray-400 text-xl" />
                                        <span className="font-medium text-gray-400">Address Proof (Not uploaded)</span>
                                    </div>
                                </div>
                            )}

                            {viewingNgo.idProof ? (
                                <a href={viewingNgo.idProof} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <FaFileAlt className="text-blue-500 text-xl" />
                                        <span className="font-medium text-gray-700">ID Proof</span>
                                    </div>
                                    <FaEye className="text-gray-400" />
                                </a>
                            ) : (
                                <div className="flex items-center justify-between p-4 border border-gray-100 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <FaFileAlt className="text-gray-400 text-xl" />
                                        <span className="font-medium text-gray-400">ID Proof (Not uploaded)</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button 
                                onClick={() => setViewingNgo(null)}
                                className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
