import React, { useState, useRef, useEffect } from 'react';
import { FaBars, FaSearch, FaRegBell, FaChevronDown, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ user, setActiveTab }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchResults([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const searchOptions = [
        { label: 'Dashboard Overview', tab: 'OVERVIEW', roles: ['ADMIN', 'DONOR', 'NGO'] },
        { label: 'Donate Item', tab: 'DONATE', roles: ['DONOR'] },
        { label: 'My Donations', tab: 'MY_DONATIONS', roles: ['DONOR'] },
        { label: 'Donation History', tab: 'HISTORY', roles: ['DONOR'] },
        { label: 'Track Donation', tab: 'TRACK', roles: ['DONOR'] },
        { label: 'Donation Requests', tab: 'DONATION_REQUESTS', roles: ['NGO'] },
        { label: 'Accepted Donations', tab: 'ACCEPTED_DONATIONS', roles: ['NGO'] },
        { label: 'Pickup Schedule', tab: 'PICKUP_SCHEDULE', roles: ['NGO'] },
        { label: 'Inventory & Items', tab: 'INVENTORY', roles: ['NGO'] },
        { label: 'Beneficiaries', tab: 'BENEFICIARIES', roles: ['NGO'] },
        { label: 'Manage Users', tab: 'USERS', roles: ['ADMIN'] },
        { label: 'NGO Approvals', tab: 'NGOS', roles: ['ADMIN'] },
        { label: 'System Donations', tab: 'DONATIONS', roles: ['ADMIN'] },
        { label: 'Donation Categories', tab: 'CATEGORIES', roles: ['ADMIN'] },
        { label: 'Reports & Analytics', tab: 'REPORTS', roles: ['ADMIN', 'NGO'] },
        { label: 'My Profile', tab: 'PROFILE', roles: ['ADMIN', 'DONOR'] },
        { label: 'NGO Profile', tab: 'NGO_PROFILE', roles: ['NGO'] },
        { label: 'Platform Settings', tab: 'NGO_SETTINGS', roles: ['NGO'] },
        { label: 'Platform Settings', tab: 'SETTINGS', roles: ['ADMIN'] },
        { label: 'Notifications', tab: 'NOTIFICATIONS', roles: ['ADMIN', 'NGO', 'DONOR'] },
    ];

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearchQuery(val);
        if (val.trim() === '') {
            setSearchResults([]);
        } else {
            const matches = searchOptions.filter(opt => 
                opt.roles.includes(user?.role) && 
                opt.label.toLowerCase().includes(val.toLowerCase())
            );
            setSearchResults(matches);
        }
    };

    const handleSearchSelect = (tab) => {
        if (setActiveTab) setActiveTab(tab);
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter' && searchResults.length > 0) {
            handleSearchSelect(searchResults[0].tab);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="bg-white h-20 px-8 flex items-center justify-between shadow-sm sticky top-0 z-20">
            {/* Left - Menu Icon & Search */}
            <div className="flex items-center space-x-6 flex-1">
                <button className="text-gray-500 hover:text-gray-800 transition-colors">
                    <FaBars className="text-xl" />
                </button>
                
                <div className="relative w-full max-w-md hidden md:block" ref={searchRef}>
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search for quick navigation..." 
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchKeyDown}
                        className="w-full bg-gray-50 text-gray-700 pl-12 pr-4 py-3 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all border border-transparent focus:border-primary/30"
                    />
                    
                    {searchResults.length > 0 && (
                        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 overflow-hidden">
                            {searchResults.map((result, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => handleSearchSelect(result.tab)}
                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 flex items-center justify-between"
                                >
                                    <span className="font-medium">{result.label}</span>
                                    <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-1 rounded-md">Jump To</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right - Notifications & Profile */}
            <div className="flex items-center space-x-6">
                <button 
                    onClick={() => setActiveTab && setActiveTab('NOTIFICATIONS')}
                    className="relative text-gray-500 hover:text-gray-800 transition-colors"
                >
                    <FaRegBell className="text-xl" />
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="relative" ref={dropdownRef}>
                    <div 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-full transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg shadow-sm">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="hidden md:flex items-center space-x-2">
                            <span className="font-semibold text-gray-700">{user?.name}</span>
                            <FaChevronDown className={`text-xs text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>
                    </div>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                            <button 
                                onClick={() => { setActiveTab && setActiveTab(user?.role === 'NGO' ? 'NGO_PROFILE' : 'PROFILE'); setIsDropdownOpen(false); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                                <FaUser className="text-gray-400" /> My Profile
                            </button>
                            <button 
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <FaSignOutAlt className="text-red-400" /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
