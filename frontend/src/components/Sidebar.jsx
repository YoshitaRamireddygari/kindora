import React from 'react';
import { FaHome, FaGift, FaHistory, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ role }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="w-64 bg-primary text-white flex flex-col h-screen rounded-r-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center space-x-3 mb-10 z-10">
                <div className="bg-white p-2 rounded-lg">
                    <FaGift className="text-primary text-xl" />
                </div>
                <h1 className="text-2xl font-bold">Kindora</h1>
            </div>

            <nav className="flex-1 space-y-4 z-10">
                <button className="flex items-center space-x-3 w-full p-3 bg-white text-primary rounded-xl font-medium shadow-md">
                    <FaHome /> <span>Dashboard</span>
                </button>
                {role === 'DONOR' && (
                    <>
                        <button className="flex items-center space-x-3 w-full p-3 hover:bg-secondary text-gray-200 rounded-xl transition-colors">
                            <FaGift /> <span>Donate Item</span>
                        </button>
                        <button className="flex items-center space-x-3 w-full p-3 hover:bg-secondary text-gray-200 rounded-xl transition-colors">
                            <FaHistory /> <span>My Donations</span>
                        </button>
                    </>
                )}
                <button className="flex items-center space-x-3 w-full p-3 hover:bg-secondary text-gray-200 rounded-xl transition-colors">
                    <FaUser /> <span>Profile</span>
                </button>
            </nav>

            <div className="z-10 mt-auto">
                <button onClick={handleLogout} className="flex items-center space-x-3 w-full p-3 hover:bg-red-500 hover:text-white text-gray-200 rounded-xl transition-colors mt-auto">
                    <FaSignOutAlt /> <span>Logout</span>
                </button>
            </div>
            
            {/* Decorative background circle */}
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary rounded-full opacity-50 mix-blend-screen filter blur-xl"></div>
        </div>
    );
}
