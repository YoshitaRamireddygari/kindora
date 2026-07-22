import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import { motion } from 'framer-motion';
import { FaEye, FaCheck, FaTimes, FaImage } from 'react-icons/fa';
import MapLocation from '../common/MapLocation';

export default function AdminProofs() {
    const [proofs, setProofs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewingProof, setViewingProof] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [rejectingId, setRejectingId] = useState(null);

    useEffect(() => {
        fetchProofs();
    }, []);

    const fetchProofs = async () => {
        try {
            const res = await adminService.getProofs();
            setProofs(res.data);
        } catch (error) {
            console.error("Failed to fetch proofs", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            await adminService.approveProof(id);
            alert("Proof approved successfully!");
            setViewingProof(null);
            fetchProofs();
        } catch (error) {
            alert("Failed to approve proof");
        }
    };

    const handleReject = async (id) => {
        if (!rejectReason) {
            alert("Please provide a rejection reason");
            return;
        }
        try {
            await adminService.rejectProof(id, rejectReason);
            alert("Proof rejected.");
            setRejectingId(null);
            setRejectReason('');
            setViewingProof(null);
            fetchProofs();
        } catch (error) {
            alert("Failed to reject proof");
        }
    };

    if (loading) return <div className="p-8">Loading proofs...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-7xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Donation Proofs</h2>
                <p className="text-gray-500 mt-1">Review and approve distribution proofs uploaded by NGOs.</p>
            </div>

            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 flex-1">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-gray-900 font-bold border-b border-gray-100">
                                <th className="py-4 px-4">Donation ID</th>
                                <th className="py-4 px-4">NGO ID</th>
                                <th className="py-4 px-4">Proof</th>
                                <th className="py-4 px-4">Status</th>
                                <th className="py-4 px-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proofs.map((proof) => (
                                <tr key={proof.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                    <td className="py-4 px-4 font-medium text-gray-800">{proof.donationId}</td>
                                    <td className="py-4 px-4 text-gray-600">{proof.ngoId}</td>
                                    <td className="py-4 px-4">
                                        <button 
                                            onClick={() => setViewingProof(proof)}
                                            className="flex items-center space-x-2 text-primary hover:underline bg-primary/5 px-3 py-1.5 rounded-lg">
                                            <FaImage /> <span>View Details</span>
                                        </button>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            proof.status === 'PENDING' ? 'bg-orange-100 text-orange-600' :
                                            proof.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                                            'bg-red-100 text-red-600'
                                        }`}>
                                            {proof.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        {proof.status === 'PENDING' && (
                                            <button 
                                                onClick={() => setViewingProof(proof)}
                                                className="text-primary hover:underline font-medium">
                                                Review
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {proofs.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">No proofs found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Proof Modal */}
            {viewingProof && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Review Distribution Proof</h3>
                        
                        <div className="space-y-4 mb-6">
                            <div>
                                <span className="font-semibold text-gray-700">Distribution Date:</span>
                                <span className="ml-2 text-gray-600">{viewingProof.distributionDate}</span>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700">Description:</span>
                                <p className="mt-1 text-gray-600 bg-gray-50 p-3 rounded-xl">{viewingProof.description}</p>
                            </div>
                            <div>
                                <MapLocation 
                                    latitude={viewingProof.distributionLatitude}
                                    longitude={viewingProof.distributionLongitude}
                                    address={viewingProof.distributionAddress}
                                    title="Distribution Location"
                                    height="150px"
                                    isAdmin={true}
                                />
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700 mb-2 block">Photos:</span>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {viewingProof.photos?.map((photo, index) => (
                                        <img key={index} src={photo} alt={`Proof ${index + 1}`} className="w-full h-40 object-cover rounded-xl border border-gray-200" />
                                    ))}
                                    {(!viewingProof.photos || viewingProof.photos.length === 0) && (
                                        <div className="text-gray-400 italic">No photos uploaded.</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {viewingProof.status === 'PENDING' && (
                            <div className="border-t border-gray-100 pt-6 mt-6">
                                {rejectingId === viewingProof.id ? (
                                    <div className="flex flex-col space-y-3">
                                        <label className="font-medium text-gray-700">Reason for rejection:</label>
                                        <select 
                                            value={rejectReason}
                                            onChange={(e) => setRejectReason(e.target.value)}
                                            className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none">
                                            <option value="">Select a reason...</option>
                                            <option value="Image unclear">Image unclear</option>
                                            <option value="Upload proper proof">Upload proper proof</option>
                                            <option value="Wrong donation">Wrong donation</option>
                                            <option value="Duplicate image">Duplicate image</option>
                                        </select>
                                        <div className="flex justify-end space-x-3 mt-4">
                                            <button onClick={() => setRejectingId(null)} className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200">Cancel</button>
                                            <button onClick={() => handleReject(viewingProof.id)} className="px-6 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600">Confirm Reject</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center">
                                        <button onClick={() => setViewingProof(null)} className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200">Close</button>
                                        <div className="flex space-x-3">
                                            <button onClick={() => setRejectingId(viewingProof.id)} className="flex items-center space-x-2 px-6 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100">
                                                <FaTimes /> <span>Reject</span>
                                            </button>
                                            <button onClick={() => handleApprove(viewingProof.id)} className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600">
                                                <FaCheck /> <span>Approve</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {viewingProof.status !== 'PENDING' && (
                            <div className="border-t border-gray-100 pt-6 mt-6 flex justify-end">
                                <button onClick={() => setViewingProof(null)} className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200">Close</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
