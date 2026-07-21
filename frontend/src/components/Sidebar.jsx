import React from 'react';
import { FaHome, FaGift, FaHistory, FaUser, FaSignOutAlt, FaMapMarkerAlt, FaHandHoldingHeart, FaUsers, FaBuilding, FaList, FaChartBar, FaBell, FaCog, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ role, activeTab, setActiveTab }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const getBtnClass = (tabName) => {
        return activeTab === tabName 
            ? "flex items-center space-x-4 w-full px-6 py-3 bg-white text-primary rounded-l-full font-bold shadow-sm -mr-6 relative z-10"
            : "flex items-center space-x-4 w-full px-6 py-3 hover:bg-sidebarHover text-gray-300 font-medium transition-colors rounded-l-full";
    };

    return (
        <div className="w-72 bg-sidebar text-white flex flex-col h-screen rounded-r-[40px] shadow-2xl relative overflow-hidden flex-shrink-0">
            {/* Logo Section */}
            <div className="flex items-center space-x-3 p-8 pb-10 z-10">
                <div className="text-pink-400 text-3xl">
                    <FaHandHoldingHeart />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-wide">Kindora</h1>
                    <p className="text-[10px] text-gray-300 tracking-wider uppercase mt-1">Where kindness finds the way</p>
                </div>
            </div>

            {/* Navigation Navigation */}
            <nav className="flex-1 space-y-2 z-10 pl-4">
                <button onClick={() => setActiveTab('OVERVIEW')} className={getBtnClass('OVERVIEW')}>
                    <FaHome className="text-xl" /> <span>Dashboard</span>
                </button>
                {role === 'DONOR' && (
                    <>
                        <button onClick={() => setActiveTab('DONATE')} className={getBtnClass('DONATE')}>
                            <FaGift className="text-xl" /> <span>Donate Item</span>
                        </button>
                        <button onClick={() => setActiveTab('MY_DONATIONS')} className={getBtnClass('MY_DONATIONS')}>
                            <FaHistory className="text-xl" /> <span>My Donations</span>
                        </button>
                        <button onClick={() => setActiveTab('HISTORY')} className={getBtnClass('HISTORY')}>
                            <FaHistory className="text-xl" /> <span>Donation History</span>
                        </button>
                        <button onClick={() => setActiveTab('TRACK')} className={getBtnClass('TRACK')}>
                            <FaMapMarkerAlt className="text-xl" /> <span>Track Donation</span>
                        </button>
                        <button onClick={() => setActiveTab('NGO_DETAILS')} className={getBtnClass('NGO_DETAILS')}>
                            <FaUsers className="text-xl" /> <span>NGO Details</span>
                        </button>
                    </>
                )}
                {role === 'NGO' && (
                    <>
                        <button onClick={() => setActiveTab('AVAILABLE')} className={getBtnClass('AVAILABLE')}>
                            <FaGift className="text-xl" /> <span>Available Donations</span>
                        </button>
                        <button onClick={() => setActiveTab('MY_PICKUPS')} className={getBtnClass('MY_PICKUPS')}>
                            <FaHistory className="text-xl" /> <span>My Pickups</span>
                        </button>
                    </>
                )}
                {role === 'ADMIN' && (
                    <div className="space-y-1">
                        <button onClick={() => setActiveTab('USERS')} className={getBtnClass('USERS')}>
                            <FaUser className="text-lg w-6" /> <span>Users</span>
                        </button>
                        <button onClick={() => setActiveTab('NGO_VERIFICATION')} className={getBtnClass('NGO_VERIFICATION')}>
                            <FaBuilding className="text-lg w-6" /> <span>NGOs</span>
                        </button>
                        <button onClick={() => setActiveTab('DONATIONS_MGMT')} className={getBtnClass('DONATIONS_MGMT')}>
                            <FaGift className="text-lg w-6" /> <span>Donations</span>
                        </button>
                        <button onClick={() => setActiveTab('CATEGORIES')} className={getBtnClass('CATEGORIES')}>
                            <FaList className="text-lg w-6" /> <span>Categories</span>
                        </button>
                        <button onClick={() => setActiveTab('REPORTS')} className={getBtnClass('REPORTS')}>
                            <FaChartBar className="text-lg w-6" /> <span>Reports</span>
                        </button>
                        <button onClick={() => setActiveTab('NOTIFICATIONS')} className={getBtnClass('NOTIFICATIONS')}>
                            <FaBell className="text-lg w-6" /> <span>Notifications</span>
                        </button>
                        <button onClick={() => setActiveTab('SETTINGS')} className={getBtnClass('SETTINGS')}>
                            <FaCog className="text-lg w-6" /> <span>Settings</span>
                        </button>
                        <button onClick={() => setActiveTab('PROFILE')} className={getBtnClass('PROFILE')}>
                            <FaUserCircle className="text-lg w-6" /> <span>Profile</span>
                        </button>
                    </div>
                )}
                {role !== 'ADMIN' && (
                    <button onClick={() => setActiveTab('PROFILE')} className={getBtnClass('PROFILE')}>
                        <FaUser className="text-xl" /> <span>Profile</span>
                    </button>
                )}
            </nav>

            {/* Logout at bottom */}
            <div className="mt-auto z-20 p-4 mb-4">
                <button onClick={handleLogout} className="flex items-center space-x-4 w-full px-6 py-3 hover:bg-sidebarHover text-gray-300 font-medium transition-colors rounded-xl">
                    <FaSignOutAlt className="text-xl text-red-400" /> <span>Logout</span>
                </button>
            </div>

            {/* Bottom Wave Graphic */}
            <svg viewBox="0 0 1440 320" className="absolute bottom-0 left-0 w-full z-0 text-white fill-current opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,256L80,245.3C160,235,320,213,480,218.7C640,224,800,256,960,266.7C1120,277,1280,267,1360,261.3L1440,256L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
            </svg>
        </div>
    );
}
