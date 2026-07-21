import React from 'react';
import { motion } from 'framer-motion';

export default function AdminSettings() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">System Settings</h2>
                <p className="text-gray-500 mt-1">Configure global application preferences.</p>
            </div>

            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8">
                <div className="space-y-6">
                    <div>
                        <h4 className="font-bold text-gray-800 mb-2">Allow New NGO Registrations</h4>
                        <label className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input type="checkbox" className="sr-only" defaultChecked />
                                <div className="block bg-green-400 w-14 h-8 rounded-full"></div>
                                <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform translate-x-6"></div>
                            </div>
                            <div className="ml-3 text-gray-700 font-medium">Enabled</div>
                        </label>
                    </div>

                    <hr className="border-gray-100" />

                    <div>
                        <h4 className="font-bold text-gray-800 mb-2">Maintenance Mode</h4>
                        <label className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input type="checkbox" className="sr-only" />
                                <div className="block bg-gray-300 w-14 h-8 rounded-full"></div>
                                <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                            </div>
                            <div className="ml-3 text-gray-700 font-medium">Disabled</div>
                        </label>
                    </div>

                    <hr className="border-gray-100" />

                    <div>
                        <h4 className="font-bold text-gray-800 mb-4">Email Notifications</h4>
                        <div className="space-y-3">
                            <label className="flex items-center">
                                <input type="checkbox" className="form-checkbox text-primary rounded" defaultChecked />
                                <span className="ml-2 text-gray-700">Send daily digest to Admin</span>
                            </label>
                            <label className="flex items-center">
                                <input type="checkbox" className="form-checkbox text-primary rounded" defaultChecked />
                                <span className="ml-2 text-gray-700">Alert on new NGO verification</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-secondary transition-colors shadow-md">
                        Save Settings
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
