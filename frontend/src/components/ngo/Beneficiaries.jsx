import React from 'react';
import { motion } from 'framer-motion';

export default function Beneficiaries() {
    // Mock data for display based on the design
    const stats = [
        { label: 'Total Beneficiaries', value: '320', trend: '+18% this month', color: 'text-primary' },
        { label: 'Families Helped', value: '80', trend: '+12% this month', color: 'text-blue-500' },
        { label: 'Donations Distributed', value: '24', trend: '+19% this month', color: 'text-purple-500' },
        { label: 'Areas Served', value: '6', trend: '+10% this month', color: 'text-teal-500' },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Beneficiary / Impact</h2>
                    <p className="text-gray-500 mt-1">View the impact you're creating.</p>
                </div>
                <select className="bg-white border border-gray-100 text-gray-700 py-2 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-medium appearance-none shadow-sm">
                    <option>This Month</option>
                </select>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-36">
                        <p className="text-gray-500 text-sm font-semibold">{stat.label}</p>
                        <h3 className={`text-4xl font-bold ${stat.color} my-2`}>{stat.value}</h3>
                        <p className="text-green-500 text-xs font-semibold">{stat.trend}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                {/* Beneficiaries Trend */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="font-bold text-gray-800 text-xl mb-6">Beneficiaries Trend</h3>
                    <div className="flex-1 w-full h-full min-h-[250px] relative">
                        {/* Placeholder for Line Chart */}
                        <svg viewBox="0 0 500 250" className="w-full h-full" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* Grid lines */}
                            <line x1="0" y1="50" x2="500" y2="50" stroke="#f3f4f6" strokeWidth="1" />
                            <line x1="0" y1="100" x2="500" y2="100" stroke="#f3f4f6" strokeWidth="1" />
                            <line x1="0" y1="150" x2="500" y2="150" stroke="#f3f4f6" strokeWidth="1" />
                            <line x1="0" y1="200" x2="500" y2="200" stroke="#f3f4f6" strokeWidth="1" />
                            
                            {/* Line & Fill */}
                            <path d="M0,230 L50,150 L100,150 L150,80 L200,100 L250,50 L300,70 L350,20 L400,0" fill="none" stroke="#8b5cf6" strokeWidth="3" />
                            <path d="M0,230 L50,150 L100,150 L150,80 L200,100 L250,50 L300,70 L350,20 L400,0 L400,250 L0,250 Z" fill="url(#lineGrad)" />
                            
                            {/* Dots */}
                            <circle cx="0" cy="230" r="4" fill="#8b5cf6" />
                            <circle cx="50" cy="150" r="4" fill="#8b5cf6" />
                            <circle cx="100" cy="150" r="4" fill="#8b5cf6" />
                            <circle cx="150" cy="80" r="4" fill="#8b5cf6" />
                            <circle cx="200" cy="100" r="4" fill="#8b5cf6" />
                            <circle cx="250" cy="50" r="4" fill="#8b5cf6" />
                            <circle cx="300" cy="70" r="4" fill="#8b5cf6" />
                            <circle cx="350" cy="20" r="4" fill="#8b5cf6" />
                            <circle cx="400" cy="0" r="4" fill="#8b5cf6" />
                        </svg>
                    </div>
                </div>

                {/* Distribution by Category */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="font-bold text-gray-800 text-xl mb-6">Distribution by Category</h3>
                    <div className="flex-1 flex items-center justify-center gap-8">
                        {/* Placeholder for Donut Chart */}
                        <div className="relative w-56 h-56">
                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f3f4f6" strokeWidth="15" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#8b5cf6" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="150.7" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3b82f6" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="175.8" transform="rotate(144 50 50)" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="213.5" transform="rotate(252 50 50)" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ec4899" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="226" transform="rotate(306 50 50)" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="238.6" transform="rotate(342 50 50)" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-gray-500 text-sm font-semibold">Total</span>
                                <span className="text-3xl font-bold text-gray-800">24</span>
                            </div>
                        </div>
                        
                        <div className="flex flex-col space-y-4 min-w-[120px]">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"></div><span className="text-gray-600 font-medium">Food</span></div>
                                <span className="font-bold text-gray-800">40%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-gray-600 font-medium">Clothing</span></div>
                                <span className="font-bold text-gray-800">30%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-500"></div><span className="text-gray-600 font-medium">Education</span></div>
                                <span className="font-bold text-gray-800">15%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-pink-500"></div><span className="text-gray-600 font-medium">Kids</span></div>
                                <span className="font-bold text-gray-800">10%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div><span className="text-gray-600 font-medium">Others</span></div>
                                <span className="font-bold text-gray-800">5%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
