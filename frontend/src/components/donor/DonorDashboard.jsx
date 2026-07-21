import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHandHoldingHeart, FaBoxOpen, FaMedal, FaStar } from 'react-icons/fa';
import { donorService } from '../../services/api';

export default function DonorDashboard({ user, setActiveTab }) {
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        const userId = user?.id || user?._id;
        if (!userId) return;
        
        const fetchStats = async () => {
            console.log("Fetching stats for user ID:", userId);
            try {
                const res = await donorService.getDashboardStats(userId);
                console.log("Received stats:", res.data);
                setDashboardData(res.data);
            } catch (error) {
                console.error("Failed to fetch donor stats", error);
            }
        };

        fetchStats();
        const intervalId = setInterval(fetchStats, 5000);
        return () => clearInterval(intervalId);
    }, [user]);

    const stats = dashboardData || { totalDonations: '...', pendingPickups: '...', acceptedPickups: '...', impactScore: '...' };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-6xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Welcome back, {user.name}!</h2>
                <p className="text-gray-500 mt-1">Here is the impact you've made so far.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex items-center">
                    <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center text-primary text-2xl mr-4 lg:mr-6">
                        <FaHandHoldingHeart />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-semibold mb-1">Total Donations</p>
                        <h3 className="text-3xl font-bold text-gray-800">{stats.totalDonations}</h3>
                    </div>
                </div>
                
                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex items-center">
                    <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500 text-2xl mr-4 lg:mr-6">
                        <FaBoxOpen />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-semibold mb-1">Pending Pickups</p>
                        <h3 className="text-3xl font-bold text-gray-800">{stats.pendingPickups}</h3>
                    </div>
                </div>

                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex items-center">
                    <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-500 text-2xl mr-4 lg:mr-6">
                        <FaBoxOpen />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-semibold mb-1">Accepted Pickups</p>
                        <h3 className="text-3xl font-bold text-gray-800">{stats.acceptedPickups}</h3>
                    </div>
                </div>

                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex items-center">
                    <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center text-green-500 text-2xl mr-4 lg:mr-6">
                        <FaStar />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-semibold mb-1">Impact Score</p>
                        <h3 className="text-3xl font-bold text-gray-800">{stats.impactScore}</h3>
                    </div>
                </div>
            </div>

            {/* Main Action Area */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* CTA Card */}
                <div className="flex-1 bg-gradient-to-br from-primary to-secondary rounded-[32px] p-10 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl"></div>
                    
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <h3 className="text-3xl font-bold mb-4">Ready to make a difference?</h3>
                            <p className="text-white/80 text-lg mb-8 max-w-md">Your unused items can bring a smile to someone's face. Start your next donation today.</p>
                        </div>
                        <button 
                            onClick={() => setActiveTab('DONATE')}
                            className="bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors self-start shadow-md flex items-center gap-2"
                        >
                            <FaHandHoldingHeart /> Donate Now
                        </button>
                    </div>
                </div>

                {/* Badges / Rewards */}
                <div className="w-full lg:w-[400px] bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 text-xl mb-6 flex items-center gap-2">
                        <FaMedal className="text-yellow-500" /> Your Achievements
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 text-xl">
                                🌟
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">First Step</h4>
                                <p className="text-xs text-gray-500">Made your first donation</p>
                            </div>
                        </div>
                        
                        <div className={`flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 ${stats.totalDonations >= 5 ? '' : 'opacity-50'}`}>
                            <div className={`w-12 h-12 rounded-full ${stats.totalDonations >= 5 ? 'bg-orange-100 text-orange-500' : 'bg-gray-200 text-gray-400 grayscale'} flex items-center justify-center text-xl`}>
                                🔥
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">On a Roll</h4>
                                <p className="text-xs text-gray-500">Donate 5 items to unlock</p>
                            </div>
                        </div>
                        
                        <div className={`flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 ${stats.totalDonations >= 20 ? '' : 'opacity-50'}`}>
                            <div className={`w-12 h-12 rounded-full ${stats.totalDonations >= 20 ? 'bg-purple-100 text-purple-500' : 'bg-gray-200 text-gray-400 grayscale'} flex items-center justify-center text-xl`}>
                                👑
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">Super Donor</h4>
                                <p className="text-xs text-gray-500">Donate 20 items to unlock</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
