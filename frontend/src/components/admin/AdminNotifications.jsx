import React from 'react';
import { motion } from 'framer-motion';
import { FaBell, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function AdminNotifications() {
    const notifications = [
        { id: 1, title: 'New NGO Registration', desc: 'Helping Hands NGO has applied for verification.', time: '10 mins ago', type: 'info' },
        { id: 2, title: 'Server Load Alert', desc: 'High traffic detected on the donations API.', time: '1 hour ago', type: 'warning' },
        { id: 3, title: 'Weekly Report Ready', desc: 'The automated weekly analytics report is ready.', time: '2 hours ago', type: 'success' },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Notifications</h2>
                <p className="text-gray-500 mt-1">System alerts and important updates.</p>
            </div>

            <div className="space-y-4">
                {notifications.map((notif) => (
                    <div key={notif.id} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className={`p-3 rounded-xl flex items-center justify-center text-xl ${
                            notif.type === 'warning' ? 'bg-orange-100 text-orange-500' :
                            notif.type === 'success' ? 'bg-green-100 text-green-500' :
                            'bg-blue-100 text-blue-500'
                        }`}>
                            {notif.type === 'warning' ? <FaExclamationTriangle /> : notif.type === 'success' ? <FaCheckCircle /> : <FaBell />}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-800">{notif.title}</h4>
                            <p className="text-gray-600 mt-1">{notif.desc}</p>
                        </div>
                        <span className="text-xs font-semibold text-gray-400">{notif.time}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
