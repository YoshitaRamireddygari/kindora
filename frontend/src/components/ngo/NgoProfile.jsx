import React from 'react';
import { motion } from 'framer-motion';
import { FaHandHoldingHeart } from 'react-icons/fa';
import MapLocation from '../common/MapLocation';

export default function NgoProfile({ user, setActiveTab }) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-6xl mx-auto">
            {/* Split layout */}
            <div className="flex flex-col lg:flex-row gap-8 mt-8">
                {/* Left Card: Summary */}
                <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 flex-1 lg:max-w-md flex flex-col items-center text-center">
                    <div className="w-32 h-32 rounded-full bg-green-50 border-4 border-white shadow-md flex items-center justify-center mb-6">
                        <FaHandHoldingHeart className="text-6xl text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{user?.name || 'Helping Hands NGO'}</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-8">
                        We work for the welfare of underprivileged people by providing food, clothing, education and support.
                    </p>
                    
                    <div className="w-full space-y-4 text-left">
                        <div className="flex">
                            <span className="font-bold text-gray-800 w-24">Email</span>
                            <span className="text-gray-600 truncate">{user?.email || 'contact@helpinghands.org'}</span>
                        </div>
                        <div className="flex">
                            <span className="font-bold text-gray-800 w-24">Phone</span>
                            <span className="text-gray-600">+91 91234 56789</span>
                        </div>
                        <div className="flex">
                            <span className="font-bold text-gray-800 w-24">Address</span>
                            <span className="text-gray-600">Hyderabad, Telangana, India</span>
                        </div>
                        <div className="flex">
                            <span className="font-bold text-gray-800 w-24">Website</span>
                            <span className="text-gray-600 hover:text-primary cursor-pointer transition-colors">www.helpinghands.org</span>
                        </div>
                    </div>
                </div>

                {/* Right Card: Details */}
                <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-800 mb-8 border-b border-gray-100 pb-4">NGO Details</h3>
                    
                    <div className="space-y-6 flex-1">
                        <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
                            <span className="font-bold text-gray-800">NGO Name</span>
                            <span className="text-gray-600 col-span-2">{user?.name || 'Helping Hands NGO'}</span>
                        </div>
                        <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
                            <span className="font-bold text-gray-800">Registration Number</span>
                            <span className="text-gray-600 col-span-2">NGO/TS/2018/12345</span>
                        </div>
                        <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
                            <span className="font-bold text-gray-800">Founded On</span>
                            <span className="text-gray-600 col-span-2">15 Aug 2018</span>
                        </div>
                        <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
                            <span className="font-bold text-gray-800">Type</span>
                            <span className="text-gray-600 col-span-2">Non-Governmental Organization</span>
                        </div>
                        <div className="grid grid-cols-3 border-b border-gray-50 pb-4">
                            <span className="font-bold text-gray-800">PAN Number</span>
                            <span className="text-gray-600 col-span-2">ABCDE1254F</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setActiveTab && setActiveTab('NGO_SETTINGS')}
                        className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-secondary transition-colors mt-8 mb-8"
                    >
                        Edit Profile
                    </button>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Registered Location</h3>
                    <MapLocation 
                        latitude={user?.latitude}
                        longitude={user?.longitude}
                        address={user?.address || 'Hyderabad, Telangana, India'}
                        title="NGO Base Location"
                        height="200px"
                    />
                </div>
            </div>
        </motion.div>
    );
}
