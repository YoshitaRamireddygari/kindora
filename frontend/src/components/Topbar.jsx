import React from 'react';
import { FaBars, FaSearch, FaRegBell, FaChevronDown } from 'react-icons/fa';

export default function Topbar({ user }) {
    return (
        <div className="bg-white h-20 px-8 flex items-center justify-between shadow-sm sticky top-0 z-20">
            {/* Left - Menu Icon & Search */}
            <div className="flex items-center space-x-6 flex-1">
                <button className="text-gray-500 hover:text-gray-800 transition-colors">
                    <FaBars className="text-xl" />
                </button>
                
                <div className="relative w-full max-w-md hidden md:block">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search anything..." 
                        className="w-full bg-gray-50 text-gray-700 pl-12 pr-4 py-3 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all border border-transparent focus:border-primary/30"
                    />
                </div>
            </div>

            {/* Right - Notifications & Profile */}
            <div className="flex items-center space-x-6">
                <button className="relative text-gray-500 hover:text-gray-800 transition-colors">
                    <FaRegBell className="text-xl" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-full transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shadow-sm">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden md:flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">{user?.name}</span>
                        <FaChevronDown className="text-xs text-gray-400" />
                    </div>
                </div>
            </div>
        </div>
    );
}
