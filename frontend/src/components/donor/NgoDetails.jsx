import React from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaUsers } from 'react-icons/fa';

export default function NgoDetails() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
            <div className="mb-8 flex items-center space-x-2">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">NGO Details</h2>
                    <div className="flex items-center text-gray-500 mt-1 space-x-2 text-sm">
                        <FaHome className="text-primary" />
                        <span>More about the NGO.</span>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8 flex-1">
                {/* NGO Card Section */}
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-10 flex-1 max-w-2xl">
                    
                    <div className="flex items-start gap-6 mb-12">
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0 relative">
                            <FaUsers className="text-green-500 text-4xl" />
                            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 border border-gray-100">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    +
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-2xl mb-2">Helping Hands NGO</h3>
                            <p className="text-gray-500 leading-relaxed text-sm">
                                Helping Hands NGO works for the welfare of underprivileged people by providing food, shelter and education.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8 pl-4">
                        <div className="flex">
                            <div className="w-32 font-bold text-gray-900">Email</div>
                            <div className="text-gray-600 font-medium">contact@helpinghands.org</div>
                        </div>
                        <div className="flex">
                            <div className="w-32 font-bold text-gray-900">Phone</div>
                            <div className="text-gray-600 font-medium">+91 91234 56789</div>
                        </div>
                        <div className="flex">
                            <div className="w-32 font-bold text-gray-900">Location</div>
                            <div className="text-gray-600 font-medium">Hyderabad, Telangana</div>
                        </div>
                    </div>
                </div>

                {/* Right Side Illustration */}
                <div className="hidden lg:flex flex-col items-center justify-center w-80 bg-white rounded-[32px] p-8 text-center border border-gray-100 shadow-sm">
                    <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                        <div className="absolute inset-0 bg-secondary/5 rounded-full blur-3xl"></div>
                        
                        {/* Illustration Mockup using Icons/Shapes */}
                        <div className="w-full h-full relative flex items-center justify-center">
                             <div className="flex items-end gap-2 text-primary/80 text-7xl z-10">
                                <FaUsers />
                             </div>
                             <div className="absolute -top-4 text-pink-400 text-2xl">❤</div>
                             <div className="absolute top-4 right-0 text-pink-300 text-xl">❤</div>
                        </div>
                    </div>
                    <p className="text-gray-600 font-medium">Together, we can</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">build a better world.</p>
                </div>
            </div>
        </motion.div>
    );
}
