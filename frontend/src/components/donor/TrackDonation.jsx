import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBoxOpen, FaTruck, FaCheckCircle, FaClipboardCheck } from 'react-icons/fa';

export default function TrackDonation() {
    const [donationId, setDonationId] = useState('');
    const [trackingResult, setTrackingResult] = useState(null);

    const handleTrack = (e) => {
        e.preventDefault();
        // Mocking a successful tracking result for MVP
        if (donationId) {
            setTrackingResult({
                id: donationId,
                status: 'SCHEDULED',
                item: 'Food Supplies',
                ngo: 'Helping Hands NGO',
                pickupDate: new Date().toLocaleDateString()
            });
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Track Your Donation</h2>
            
            <form onSubmit={handleTrack} className="flex gap-4 mb-10">
                <input 
                    type="text" 
                    placeholder="Enter Donation Tracking ID (e.g., KD20260725)"
                    value={donationId}
                    onChange={(e) => setDonationId(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                />
                <button 
                    type="submit"
                    className="bg-primary text-white px-8 py-3 rounded-xl hover:bg-secondary transition-colors font-medium shadow-md"
                >
                    Track
                </button>
            </form>

            {trackingResult && (
                <div className="mt-8 border-t border-gray-100 pt-8">
                    <div className="flex justify-between items-center mb-12 relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
                        
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl shadow-lg border-4 border-white">
                                <FaBoxOpen />
                            </div>
                            <span className="mt-2 font-bold text-gray-800">Donated</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl shadow-lg border-4 border-white">
                                <FaClipboardCheck />
                            </div>
                            <span className="mt-2 font-bold text-gray-800">Accepted</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-yellow-400 text-white rounded-full flex items-center justify-center text-xl shadow-lg border-4 border-white">
                                <FaTruck />
                            </div>
                            <span className="mt-2 font-bold text-gray-800">Scheduled</span>
                        </div>
                        <div className="flex flex-col items-center opacity-50 grayscale">
                            <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-xl shadow-lg border-4 border-white">
                                <FaCheckCircle />
                            </div>
                            <span className="mt-2 font-bold text-gray-800">Completed</span>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl">
                        <h3 className="font-bold text-lg text-gray-800 mb-4">Donation Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Item Name</p>
                                <p className="font-medium text-gray-900">{trackingResult.item}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Assigned NGO</p>
                                <p className="font-medium text-primary">{trackingResult.ngo}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <p className="font-bold text-yellow-600">{trackingResult.status}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Pickup Date</p>
                                <p className="font-medium text-gray-900">{trackingResult.pickupDate}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
