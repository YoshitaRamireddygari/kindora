import React, { useEffect, useState } from 'react';
import { ngoService } from '../../services/api';
import { motion } from 'framer-motion';
import { FaSearch, FaShoppingBag, FaBicycle, FaTshirt, FaBook, FaBox, FaCheckCircle } from 'react-icons/fa';

export default function AvailableDonations({ user, setActiveTab }) {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await ngoService.getPendingDonations();
                setDonations(response.data);
            } catch (error) {
                console.error("Failed to fetch pending donations", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDonations();
    }, []);

    const handleAccept = async (donationId) => {
        try {
            await ngoService.acceptDonation(donationId, user.id);
            alert('Donation Accepted Successfully!');
            setActiveTab('MY_PICKUPS');
        } catch (error) {
            alert('Failed to accept donation.');
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

    if (loading) return <div className="p-8 text-gray-500">Loading available donations...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-5xl">
            <div className="mb-8 flex items-center space-x-2">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Available Donations</h2>
                    <div className="flex items-center text-gray-500 mt-1 space-x-2 text-sm">
                        <span>Items waiting to be picked up and distributed.</span>
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 flex-1">
                {/* Toolbar */}
                <div className="flex justify-between items-center mb-8 gap-4">
                    <div className="relative flex-1 max-w-md">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search available donations..." 
                            className="w-full bg-gray-50 text-gray-700 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all border border-gray-100"
                        />
                    </div>
                </div>

                {/* List View */}
                {donations.length === 0 ? (
                    <div className="py-20 text-center text-gray-500 flex flex-col items-center">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <FaShoppingBag className="text-3xl text-gray-300" />
                        </div>
                        <p>No donations available right now.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {donations.map((d) => (
                            <div key={d.id} className="flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                                <div className="flex items-center space-x-6 flex-1">
                                    {getCategoryIcon(d.category)}
                                    <div className="w-1/3">
                                        <p className="font-bold text-gray-900">{d.category} ({d.quantity})</p>
                                        <p className="text-sm text-gray-500 truncate max-w-[200px]">{d.description}</p>
                                    </div>
                                    <div className="w-1/3 text-gray-500 text-sm">
                                        <span className="block font-medium">Pickup:</span>
                                        <span className="truncate block max-w-[200px]">{d.pickupAddress}</span>
                                    </div>
                                    <div className="w-1/4 flex justify-end">
                                        <button 
                                            onClick={() => handleAccept(d.id)}
                                            className="flex items-center space-x-2 bg-secondary text-white px-6 py-2 rounded-xl hover:bg-primary transition-colors font-semibold shadow-sm"
                                        >
                                            <FaCheckCircle />
                                            <span>Accept</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
