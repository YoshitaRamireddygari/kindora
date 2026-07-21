import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    if (!user) return null;

    return (
        <div className="flex h-screen bg-accent">
            <Sidebar role={user.role} />
            
            <main className="flex-1 p-8 overflow-y-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Welcome back, {user.name}! 👋</h2>
                        <p className="text-gray-500 mt-1">Here's what's happening on Kindora today.</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold shadow-md">
                            {user.name.charAt(0)}
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    {/* Stat Cards */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                        <h3 className="text-gray-500 text-sm font-medium">Total Donations</h3>
                        <p className="text-3xl font-bold text-primary mt-2">12</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                        <h3 className="text-gray-500 text-sm font-medium">Accepted</h3>
                        <p className="text-3xl font-bold text-green-500 mt-2">8</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                        <h3 className="text-gray-500 text-sm font-medium">In Transit</h3>
                        <p className="text-3xl font-bold text-orange-500 mt-2">3</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center bg-gradient-to-br from-primary to-secondary text-white">
                        <h3 className="text-white/80 text-sm font-medium">Impact Overview</h3>
                        <p className="text-2xl font-bold mt-2">15 Lives Touched</p>
                    </motion.div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                        <p>Dashboard is fully operational and connected!</p>
                        <p className="text-sm mt-2">We are currently implementing real-time data fetching.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
