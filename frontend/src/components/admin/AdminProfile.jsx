import React from 'react';
import { motion } from 'framer-motion';
import { FaUserShield, FaEnvelope } from 'react-icons/fa';

export default function AdminProfile({ user }) {
    if (!user) return null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-3xl mx-auto">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Admin Profile</h2>
                    <p className="text-gray-500 mt-1">Manage your administrator account.</p>
                </div>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-primary/10 text-primary flex items-center justify-center text-6xl font-bold mb-6">
                    <FaUserShield />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-1">{user.name}</h3>
                <span className="px-4 py-1 bg-purple-100 text-purple-700 font-bold rounded-full text-sm mb-6">
                    Super Admin
                </span>

                <div className="w-full max-w-md bg-gray-50 rounded-2xl p-6 text-left space-y-4">
                    <div>
                        <p className="text-gray-500 text-sm font-semibold mb-1">Email Address</p>
                        <p className="text-gray-800 font-medium flex items-center gap-2">
                            <FaEnvelope className="text-gray-400" /> {user.email}
                        </p>
                    </div>
                    <hr className="border-gray-200" />
                    <div>
                        <p className="text-gray-500 text-sm font-semibold mb-1">Account Created</p>
                        <p className="text-gray-800 font-medium">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
