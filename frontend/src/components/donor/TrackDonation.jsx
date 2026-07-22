import React, { useState } from 'react';
import { donorService } from '../../services/api';
import { motion } from 'framer-motion';
import { FaBoxOpen, FaTruck, FaCheckCircle, FaClipboardCheck, FaSearch } from 'react-icons/fa';

export default function TrackDonation() {
    const [donationId, setDonationId] = useState('');
    const [trackingResult, setTrackingResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrack = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const res = await donorService.trackDonation(donationId);
            const data = res.data;
            setTrackingResult({
                id: data.id,
                status: data.status || 'PENDING',
                item: data.description || data.category || 'Donation Item',
                ngo: data.ngoId ? `NGO ID: ${data.ngoId}` : 'Pending NGO Assignment',
                createdDate: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A',
                scheduledDate: data.pickupDate ? new Date(data.pickupDate).toLocaleDateString() : null
            });
        } catch (err) {
            console.error("Tracking error", err);
            setError('Invalid Tracking ID or Donation not found!');
            setTrackingResult(null);
        } finally {
            setLoading(false);
        }
    };

    const getStatusLevel = (status) => {
        switch (status) {
            case 'PENDING': return 1;
            case 'ACCEPTED': return 2;
            case 'SCHEDULED': 
            case 'PICKED_UP':
            case 'IN_TRANSIT':
            case 'DELIVERED_TO_NGO':
            case 'DISTRIBUTION_PROOF_PENDING':
                return 3;
            case 'COMPLETED': return 4;
            case 'CANCELLED': return 0;
            default: return 0;
        }
    };

    const currentLevel = trackingResult ? getStatusLevel(trackingResult.status) : 0;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8 max-w-3xl mx-auto mt-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Track Your Donation</h2>
            <p className="text-gray-500 mb-8">Enter the tracking ID from your donation history to see its live status.</p>
            
            <form onSubmit={handleTrack} className="flex gap-4 mb-10">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Enter Donation Tracking ID (e.g., 60a7b...)"
                        value={donationId}
                        onChange={(e) => setDonationId(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 text-gray-700 border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                        required
                    />
                </div>
                <button 
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-secondary transition-colors font-bold shadow-md disabled:opacity-50"
                >
                    {loading ? 'Tracking...' : 'Track Item'}
                </button>
            </form>

            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-8 border border-red-100 font-medium">
                    {error}
                </div>
            )}

            {trackingResult && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 border-t border-gray-100 pt-12">
                    <div className="flex justify-between items-center mb-16 relative px-4">
                        {/* Connecting Background Line */}
                        <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded-full"></div>
                        {/* Active Line */}
                        <div className="absolute top-1/2 left-4 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-700" style={{ width: `calc(${((currentLevel - 1) / 3) * 100}% - 2rem)` }}></div>
                        
                        <div className="flex flex-col items-center">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-lg border-4 border-white transition-colors duration-500 ${currentLevel >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                                <FaBoxOpen />
                            </div>
                            <span className={`mt-3 font-bold ${currentLevel >= 1 ? 'text-gray-800' : 'text-gray-400'}`}>Donated</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-lg border-4 border-white transition-colors duration-500 ${currentLevel >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                                <FaClipboardCheck />
                            </div>
                            <span className={`mt-3 font-bold ${currentLevel >= 2 ? 'text-gray-800' : 'text-gray-400'}`}>Accepted</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-lg border-4 border-white transition-colors duration-500 ${currentLevel >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                                <FaTruck />
                            </div>
                            <span className={`mt-3 font-bold ${currentLevel >= 3 ? 'text-gray-800' : 'text-gray-400'}`}>Scheduled</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-lg border-4 border-white transition-colors duration-500 ${currentLevel >= 4 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                <FaCheckCircle />
                            </div>
                            <span className={`mt-3 font-bold ${currentLevel >= 4 ? 'text-green-600' : 'text-gray-400'}`}>Completed</span>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <h3 className="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2">
                            <FaBoxOpen className="text-primary" /> Donation Information
                        </h3>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Tracking ID</p>
                                <p className="font-mono text-gray-900 mt-1 bg-white px-3 py-1 rounded-lg border border-gray-200 inline-block text-sm">{trackingResult.id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Current Status</p>
                                <p className="font-bold text-primary mt-1">{trackingResult.status}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Item Details</p>
                                <p className="font-medium text-gray-900 mt-1">{trackingResult.item}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Assigned To</p>
                                <p className="font-medium text-gray-900 mt-1">{trackingResult.ngo}</p>
                            </div>
                            {trackingResult.scheduledDate && (
                                <div className="col-span-2 bg-purple-50 p-4 rounded-xl border border-purple-100">
                                    <p className="text-sm text-purple-600 font-bold flex items-center gap-2">
                                        <FaTruck /> Pickup Scheduled For: {trackingResult.scheduledDate}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
