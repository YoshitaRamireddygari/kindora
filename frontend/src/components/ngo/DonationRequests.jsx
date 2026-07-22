import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaEye, FaCheck, FaFilter, FaBox, FaTshirt, FaBook, FaBed, FaGamepad, FaEllipsisV, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { ngoService } from '../../services/api';
import MapLocation from '../common/MapLocation';

export default function DonationRequests({ user }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All Categories');
    const [activeMenu, setActiveMenu] = useState(null);
    const [expandedRow, setExpandedRow] = useState(null);

    const toggleMenu = (id) => {
        if (activeMenu === id) {
            setActiveMenu(null);
        } else {
            setActiveMenu(id);
        }
    };

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await ngoService.getPendingDonations();
                setRequests(res.data || []);
            } catch (err) {
                console.error("Failed to fetch pending donations", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
        const intervalId = setInterval(fetchRequests, 5000);
        return () => clearInterval(intervalId);
    }, []);

    const handleAccept = async (id) => {
        try {
            await ngoService.acceptDonation(id, user.id);
            setRequests(requests.filter(r => r.id !== id));
            alert('Donation request accepted!');
        } catch (error) {
            alert('Failed to accept donation.');
        }
    };

    const handleEdit = (id) => {
        alert('Edit functionality for donation requests will be implemented in the next iteration.');
        setActiveMenu(null);
    };

    const handleCancel = (id) => {
        if (window.confirm('Are you sure you want to decline/cancel this donation request?')) {
            setRequests(requests.filter(r => r.id !== id));
            alert('Donation request cancelled.');
        }
        setActiveMenu(null);
    };

    const getCategoryIcon = (category) => {
        const cat = category?.toLowerCase();
        if (cat === 'food' || cat === 'rice') return <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-lg"><FaBox /></div>;
        if (cat === 'clothes' || cat === 'clothing') return <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-lg"><FaTshirt /></div>;
        if (cat === 'books' || cat === 'education') return <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center text-lg"><FaBook /></div>;
        if (cat === 'blankets') return <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center text-lg"><FaBed /></div>;
        if (cat === 'toys' || cat === 'kids') return <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center text-lg"><FaGamepad /></div>;
        return <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-lg"><FaBox /></div>;
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-7xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Donation Requests</h2>
                <p className="text-gray-500 mt-1">Browse and respond to donation requests.</p>
            </div>
            
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 flex-1">
                {/* Toolbar */}
                <div className="flex justify-between items-center mb-8 gap-4">
                    <div className="relative flex-1 max-w-md">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search requests by item or ID..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 text-gray-700 border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                    <div className="flex gap-4">
                        <select 
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="bg-gray-50 border border-gray-100 text-gray-700 py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-medium appearance-none"
                        >
                            <option value="All Categories">All Categories</option>
                            <option value="food">Food & Rice</option>
                            <option value="clothing">Clothes & Clothing</option>
                            <option value="education">Books & Education</option>
                            <option value="toys">Toys & Kids</option>
                            <option value="blankets">Blankets</option>
                        </select>
                        <select className="bg-gray-50 border border-gray-100 text-gray-700 py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-medium appearance-none">
                            <option>All Status</option>
                            <option>Pending</option>
                        </select>
                        <button className="bg-primary text-white py-3 px-6 rounded-xl font-medium hover:bg-secondary transition-colors flex items-center gap-2">
                            <FaFilter /> Filter
                        </button>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="py-20 text-center text-gray-500">Loading requests...</div>
                ) : requests.length === 0 ? (
                    <div className="py-20 text-center text-gray-500">No pending donation requests at the moment.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-gray-900 font-bold border-b border-gray-100">
                                    <th className="py-4 px-4 font-bold">Item</th>
                                    <th className="py-4 px-4 font-bold">Donor</th>
                                    <th className="py-4 px-4 font-bold">Category</th>
                                    <th className="py-4 px-4 font-bold">Quantity</th>
                                    <th className="py-4 px-4 font-bold">Requested On</th>
                                    <th className="py-4 px-4 font-bold">Status</th>
                                    <th className="py-4 px-4 font-bold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.filter(req => {
                                    const matchesSearch = (req.category || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                                                          (req.id || '').toLowerCase().includes(searchTerm.toLowerCase());
                                    
                                    if (filterCategory === 'All Categories') return matchesSearch;
                                    
                                    const cat = (req.category || '').toLowerCase();
                                    if (filterCategory === 'food') return matchesSearch && (cat === 'food' || cat === 'rice');
                                    if (filterCategory === 'clothing') return matchesSearch && (cat === 'clothes' || cat === 'clothing');
                                    if (filterCategory === 'education') return matchesSearch && (cat === 'books' || cat === 'education');
                                    if (filterCategory === 'toys') return matchesSearch && (cat === 'toys' || cat === 'kids');
                                    if (filterCategory === 'blankets') return matchesSearch && (cat === 'blankets');
                                    
                                    return matchesSearch;
                                }).map((req) => (
                                    <React.Fragment key={req.id}>
                                    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                {getCategoryIcon(req.category)}
                                                <span className="font-bold text-gray-900">{req.category}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-gray-600 font-medium">{req.donorName || 'Unknown Donor'}</td>
                                        <td className="py-4 px-4 text-gray-600 font-medium">{req.category}</td>
                                        <td className="py-4 px-4 text-gray-600 font-medium">{req.quantity}</td>
                                        <td className="py-4 px-4 text-gray-600 font-medium">{new Date(req.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 bg-orange-50 text-orange-500 rounded-full text-xs font-bold border border-orange-100">
                                                Pending
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center relative">
                                            <div className="flex justify-center gap-2">
                                                <button 
                                                    onClick={() => setExpandedRow(expandedRow === req.id ? null : req.id)}
                                                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                                >
                                                    {expandedRow === req.id ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                                                </button>
                                                <button onClick={() => handleAccept(req.id)} className="w-8 h-8 rounded-full bg-green-50 text-green-500 border border-green-200 flex items-center justify-center hover:bg-green-100 transition-colors">
                                                    <FaCheck size={14} />
                                                </button>
                                                <button onClick={() => toggleMenu(req.id)} className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                                    <FaEllipsisV size={14} />
                                                </button>
                                            </div>
                                            {activeMenu === req.id && (
                                                <div className="absolute right-8 top-10 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10 text-left">
                                                    <button onClick={() => handleEdit(req.id)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">Edit</button>
                                                    <button onClick={() => handleCancel(req.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Cancel</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                    {expandedRow === req.id && (
                                        <tr className="bg-gray-50/50 border-b border-gray-100">
                                            <td colSpan="7" className="p-6">
                                                <MapLocation 
                                                    latitude={req.pickupLatitude}
                                                    longitude={req.pickupLongitude}
                                                    address={req.pickupAddress}
                                                    title="Pickup Location"
                                                    height="200px"
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {/* Pagination (Static) */}
                {!loading && requests.length > 0 && (
                    <div className="flex justify-between items-center mt-6 text-gray-500 text-sm">
                        <span>Showing 1 to {requests.length} of {requests.length} requests</span>
                        <div className="flex gap-1">
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100">&lt;</button>
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-white font-bold">1</button>
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 font-medium">2</button>
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 font-medium">3</button>
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100">&gt;</button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
