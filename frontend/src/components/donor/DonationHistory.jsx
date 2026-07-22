import React, { useEffect, useState } from 'react';
import { donorService } from '../../services/api';
import { motion } from 'framer-motion';
import { FaSearch, FaHome, FaImage } from 'react-icons/fa';
import MapLocation from '../common/MapLocation';

export default function DonationHistory({ user }) {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewingProof, setViewingProof] = useState(null);

    const handleViewProof = async (id) => {
        try {
            const res = await donorService.getDonationProof(id);
            setViewingProof(res.data);
        } catch (error) {
            alert("No proof uploaded yet or proof is still pending review.");
        }
    };

    const handleCopy = (text) => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text);
            alert("Tracking ID copied to clipboard!");
        } else {
            // Fallback for non-secure contexts (e.g., HTTP IP address access)
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "absolute";
            textArea.style.left = "-999999px";
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                alert("Tracking ID copied to clipboard!");
            } catch (err) {
                console.error("Fallback copy failed", err);
                alert("Failed to copy. Please highlight and copy manually.");
            }
            document.body.removeChild(textArea);
        }
    };

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
                                    <th className="p-4 font-bold text-gray-800 bg-gray-50/50">Tracking ID</th>
                                    <th className="p-4 font-bold text-gray-800 bg-gray-50/50">NGO</th>
                                    <th className="p-4 font-bold text-gray-800 bg-gray-50/50">Date</th>
                                    <th className="p-4 font-bold text-gray-800 bg-gray-50/50">Status</th>
                                    <th className="p-4 font-bold text-gray-800 bg-gray-50/50 last:rounded-r-xl text-center">Proof</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donations.map((d) => (
                                    <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 font-bold text-gray-900">
                                            {d.category}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{d.id}</span>
                                                <button 
                                                    onClick={() => handleCopy(d.id)}
                                                    className="text-gray-400 hover:text-primary transition-colors"
                                                    title="Copy Tracking ID"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-600 font-medium">
                                            {d.ngoId ? `NGO ID: ${d.ngoId}` : 'Pending Assignment'}
                                        </td>
                                        <td className="p-4 text-gray-600 font-medium">
                                            {new Date(d.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col items-start gap-1">
                                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${getStatusStyle(d.status)}`}>
                                                    {d.status.replace(/_/g, ' ')}
                                                </span>
                                                {d.pickupDate && (d.status === 'SCHEDULED' || d.status === 'IN_TRANSIT') && (
                                                    <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                                                        🗓️ {new Date(d.pickupDate).toLocaleDateString('en-GB')}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            {(d.status === 'COMPLETED' || d.status === 'DISTRIBUTION_PROOF_PENDING') && (
                                                <button 
                                                    onClick={() => handleViewProof(d.id)}
                                                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-bold transition-colors"
                                                    title="View Proof"
                                                >
                                                    <FaImage /> <span>View</span>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* View Proof Modal */}
            {viewingProof && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[32px] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">Distribution Proof</h3>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">✓</div>
                                <div>
                                    <p className="font-bold text-green-800">Your donation has reached the needy!</p>
                                    <p className="text-sm text-green-600">Distributed on: {viewingProof.distributionDate}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">Message from NGO</h4>
                                <p className="text-gray-600 bg-gray-50 p-4 rounded-xl text-sm italic border border-gray-100">
                                    "{viewingProof.description}"
                                </p>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-800 mb-3">Distribution Location</h4>
                                <div className="rounded-xl overflow-hidden border border-gray-200">
                                    <MapLocation 
                                        latitude={viewingProof.distributionLatitude}
                                        longitude={viewingProof.distributionLongitude}
                                        address={viewingProof.distributionAddress}
                                        title="Distributed Here"
                                        height="200px"
                                    />
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-800 mb-3">Photos</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {viewingProof.photos?.map((photo, index) => (
                                        <div key={index} className="aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                            <img src={photo} alt={`Proof ${index + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    {(!viewingProof.photos || viewingProof.photos.length === 0) && (
                                        <div className="text-gray-400 italic text-sm">No photos available.</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button 
                                onClick={() => setViewingProof(null)} 
                                className="px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
