import React, { useEffect, useState } from 'react';
import { donorService } from '../../services/api';
import { motion } from 'framer-motion';
import { FaSearch, FaEllipsisV, FaShoppingBag, FaBicycle, FaTshirt, FaBook, FaBox } from 'react-icons/fa';
import MapLocation from '../common/MapLocation';

export default function MyDonations({ user }) {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeMenu, setActiveMenu] = useState(null);
    
    // Proof Modal State
    const [isProofModalOpen, setIsProofModalOpen] = useState(false);
    const [selectedProof, setSelectedProof] = useState(null);
    const [proofLoading, setProofLoading] = useState(false);

    const toggleMenu = (id) => {
        if (activeMenu === id) {
            setActiveMenu(null);
        } else {
            setActiveMenu(id);
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm("Are you sure you want to cancel this donation?")) {
            try {
                await donorService.cancelDonation(id);
                setDonations(donations.map(d => d.id === id ? { ...d, status: 'CANCELLED' } : d));
                setActiveMenu(null);
            } catch (error) {
                console.error("Failed to cancel donation", error);
                alert("Failed to cancel donation.");
            }
        }
    };

    const handleViewDetails = async (donation) => {
        setProofLoading(true);
        setIsProofModalOpen(true);
        try {
            const res = await donorService.getDonationProof(donation.id);
            setSelectedProof(res.data);
        } catch (error) {
            console.error("Failed to fetch proof", error);
            setSelectedProof(null); // No proof found or error
        } finally {
            setProofLoading(false);
        }
    };

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await donorService.getHistory(user.id);
                setDonations(response.data);
            } catch (error) {
                console.error("Failed to fetch donations", error);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.id) {
            fetchDonations();
        } else {
            setLoading(false); 
        }
    }, [user]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-gray-100 text-gray-600 border border-gray-200';
            case 'ACCEPTED': return 'bg-blue-50 text-blue-500 border border-blue-100';
            case 'IN TRANSIT':
            case 'SCHEDULED': return 'bg-blue-50 text-blue-500 border border-blue-100';
            case 'COMPLETED': return 'bg-green-50 text-green-500 border border-green-100';
            case 'CANCELLED': return 'bg-red-50 text-red-500 border border-red-100';
            default: return 'bg-gray-50 text-gray-500';
        }
    };

    const getCategoryIcon = (category) => {
        switch (category?.toLowerCase()) {
            case 'clothes': return <div className="w-12 h-12 rounded-full bg-green-100 text-green-500 flex items-center justify-center text-xl"><FaTshirt /></div>;
            case 'books': return <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-xl"><FaBook /></div>;
            case 'food': return <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-xl"><FaBox /></div>;
            case 'bike': return <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-xl"><FaBicycle /></div>;
            default: return <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center text-xl"><FaShoppingBag /></div>;
        }
    };

    if (loading) return <div className="p-8 text-gray-500">Loading donations...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-5xl">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">My Donations</h2>
                <p className="text-gray-500 mt-1">View your all donations.</p>
            </div>
            
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 flex-1">
                {/* Toolbar */}
                <div className="flex justify-between items-center mb-8 gap-4">
                    <div className="relative flex-1 max-w-md">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search donations..." 
                            className="w-full bg-gray-50 text-gray-700 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all border border-gray-100"
                        />
                    </div>
                    <select className="bg-gray-50 border border-gray-100 text-gray-700 py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-medium appearance-none">
                        <option>All Status</option>
                        <option>Completed</option>
                        <option>In Transit</option>
                    </select>
                </div>

                {/* List View */}
                {donations.length === 0 ? (
                    <div className="py-20 text-center text-gray-500 flex flex-col items-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <FaShoppingBag className="text-3xl text-gray-300" />
                        </div>
                        <p>No donations found.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {donations.map((d) => (
                            <div key={d.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                                <div className="flex items-center space-x-6 flex-1">
                                    {getCategoryIcon(d.category)}
                                    <div className="w-1/3">
                                        <p className="font-bold text-gray-900">{d.category}</p>
                                        <p className="text-sm text-gray-500">Helping Hands NGO</p>
                                    </div>
                                    <div className="w-1/4 text-gray-500 font-medium">
                                        {new Date(d.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                    <div className="w-1/4 flex justify-end">
                                        <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getStatusColor(d.status)}`}>
                                            {d.status === 'SCHEDULED' ? 'In Transit' : d.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="relative">
                                    <button 
                                        onClick={() => toggleMenu(d.id)}
                                        className="p-3 text-gray-400 hover:text-gray-700 transition-colors ml-4">
                                        <FaEllipsisV />
                                    </button>
                                    {activeMenu === d.id && (
                                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                                            {d.status === 'COMPLETED' ? (
                                                <button onClick={() => { handleViewDetails(d); setActiveMenu(null); }} className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors font-medium">View Details</button>
                                            ) : (
                                                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">Edit</button>
                                            )}
                                            {d.status === 'PENDING' && (
                                                <button onClick={() => handleCancel(d.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">Cancel</button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Proof Modal */}
            {isProofModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[32px] p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto relative text-center">
                        {proofLoading ? (
                            <div className="py-20 text-gray-500">Loading details...</div>
                        ) : selectedProof ? (
                            <>
                                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
                                    🎉
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Donation Completed</h3>
                                <p className="text-gray-500 mb-6">Your donation has reached the beneficiaries.</p>
                                
                                {selectedProof.photos && selectedProof.photos.length > 0 ? (
                                    <div className="mb-6 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                                        <img src={selectedProof.photos[0]} alt="Distribution Proof" className="w-full h-64 object-cover" />
                                    </div>
                                ) : (
                                    <div className="mb-6 rounded-2xl bg-gray-100 h-64 flex items-center justify-center text-gray-400 italic">
                                        No photo available
                                    </div>
                                )}

                                <div className="bg-gray-50 p-4 rounded-2xl text-left space-y-3 mb-8">
                                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                                        <span className="text-gray-500 font-medium text-sm">Distributed By</span>
                                        <span className="font-bold text-gray-800">Helping Hands NGO</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                                        <span className="text-gray-500 font-medium text-sm">Distribution Date</span>
                                        <span className="font-bold text-gray-800">{selectedProof.distributionDate}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 font-medium text-sm block mb-1">Description</span>
                                        <p className="text-gray-800 text-sm">{selectedProof.description}</p>
                                    </div>
                                    {selectedProof.distributionLatitude && selectedProof.distributionLongitude && (
                                        <div className="pt-2">
                                            <MapLocation 
                                                latitude={selectedProof.distributionLatitude}
                                                longitude={selectedProof.distributionLongitude}
                                                address={selectedProof.distributionAddress}
                                                title="Distribution Location"
                                                height="150px"
                                            />
                                        </div>
                                    )}
                                </div>

                                <button onClick={() => setIsProofModalOpen(false)} className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                                    Close
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="py-20 text-gray-500">Proof details not available yet.</div>
                                <button onClick={() => setIsProofModalOpen(false)} className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
                                    Close
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
