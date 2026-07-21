import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTruck, FaBox, FaHourglassHalf, FaUserAlt, FaUserEdit } from 'react-icons/fa';

export default function NgoNotifications() {
    // Mock data based on the screenshot
    const notifications = [
        { id: 1, text: 'Your donation request for Rice has been accepted.', time: '2 mins ago', icon: <FaCheckCircle />, bg: 'bg-green-100', color: 'text-green-500' },
        { id: 2, text: 'Pickup of Clothes is scheduled for 27 Jul 2026 at 02:00 PM.', time: '1 hour ago', icon: <FaTruck />, bg: 'bg-blue-100', color: 'text-blue-500' },
        { id: 3, text: 'Blankets donation has been marked as received.', time: '3 hours ago', icon: <FaBox />, bg: 'bg-indigo-100', color: 'text-indigo-500' },
        { id: 4, text: 'Toys donation request is still pending.', time: '5 hours ago', icon: <FaHourglassHalf />, bg: 'bg-pink-100', color: 'text-pink-500' },
        { id: 5, text: 'Your profile has been updated successfully.', time: '1 day ago', icon: <FaUserEdit />, bg: 'bg-yellow-100', color: 'text-yellow-500' },
        { id: 6, text: 'New donor Bright Future NGO has raised a request.', time: '2 days ago', icon: <FaUserAlt />, bg: 'bg-blue-100', color: 'text-blue-500' },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-4xl mx-auto">
            <div className="mb-8 mt-8">
                <h2 className="text-3xl font-bold text-gray-800">Notifications</h2>
                <p className="text-gray-500 mt-1">Stay updated with the latest activities.</p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col flex-1">
                <div className="space-y-6 flex-1">
                    {notifications.map((notif) => (
                        <div key={notif.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors border-b border-gray-50 last:border-0">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${notif.bg} ${notif.color}`}>
                                    {notif.icon}
                                </div>
                                <p className="font-medium text-gray-700">{notif.text}</p>
                            </div>
                            <span className="text-sm text-gray-400 font-medium whitespace-nowrap ml-4">{notif.time}</span>
                        </div>
                    ))}
                </div>
                
                <div className="mt-8">
                    <button className="w-full border-2 border-primary text-primary py-4 rounded-xl font-bold hover:bg-primary hover:text-white transition-colors">
                        View All Notifications
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
