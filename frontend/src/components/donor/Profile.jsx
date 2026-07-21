import React from 'react';
import { motion } from 'framer-motion';

export default function Profile({ user }) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>
            
            <div className="space-y-6">
                <div className="flex items-center space-x-6 mb-8">
                    <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-lg">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">{user?.name}</h3>
                        <p className="text-gray-500 capitalize">{user?.role}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Full Name / Username</label>
                        <p className="mt-1 text-lg font-medium text-gray-900">{user?.name}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Email Address</label>
                        <p className="mt-1 text-lg font-medium text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                        <p className="mt-1 text-lg font-medium text-gray-900">{user?.phone || 'Not provided'}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Joined On</label>
                        <p className="mt-1 text-lg font-medium text-gray-900">
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                        </p>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 mt-8">
                    <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-colors">
                        Edit Profile
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
