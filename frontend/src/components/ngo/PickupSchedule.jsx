import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaEye, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { ngoService } from '../../services/api';

export default function PickupSchedule({ user }) {
    const [pickups, setPickups] = useState([]);
    const [scheduleDate, setScheduleDate] = useState('');
    const [schedulingId, setSchedulingId] = useState(null);

    useEffect(() => {
        if (!user || !user.id) return;
        const fetchPickups = async () => {
            try {
                // Filter only those in ACCEPTED or SCHEDULED state
                const res = await ngoService.getAcceptedDonations(user.id);
                const pendingPickups = (res.data || []).filter(d => d.status === 'ACCEPTED' || d.status === 'SCHEDULED');
                setPickups(pendingPickups);
            } catch (err) {
                console.error("Failed to fetch pickups", err);
            }
        };

        fetchPickups();
        const intervalId = setInterval(fetchPickups, 5000);
        return () => clearInterval(intervalId);
    }, [user]);

    const handleMarkPickedUp = async (id) => {
        try {
            await ngoService.updateDonationStatus(id, 'COMPLETED');
            // Optimistically update
            setPickups(pickups.filter(p => p.id !== id));
        } catch (err) {
            console.error("Failed to mark picked up", err);
        }
    };

    const handleSchedule = async (id) => {
        if (!scheduleDate) {
            alert('Please select a date.');
            return;
        }
        try {
            await ngoService.schedulePickup(id, scheduleDate);
            setPickups(pickups.map(p => p.id === id ? { ...p, status: 'SCHEDULED', pickupDate: scheduleDate } : p));
            setSchedulingId(null);
            setScheduleDate('');
            alert('Pickup scheduled successfully!');
        } catch (err) {
            console.error(err);
            alert('Failed to schedule pickup');
        }
    };

    const getStatusStyle = (status) => {
        if (status === 'Scheduled' || status === 'ACCEPTED') return 'bg-blue-50 text-blue-500 border-blue-100';
        if (status === 'In Progress') return 'bg-orange-50 text-orange-500 border-orange-100';
        if (status === 'Completed') return 'bg-green-50 text-green-500 border-green-100';
        return 'bg-gray-50 text-gray-500 border-gray-100';
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-7xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Pickup Schedule</h2>
                <p className="text-gray-500 mt-1">Track and manage donation pickups.</p>
            </div>
            
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 flex-1">
                {/* Toolbar */}
                <div className="flex justify-between items-center mb-8 gap-4">
                    <div className="relative flex-1 max-w-md">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search pickups..." 
                            className="w-full bg-gray-50 text-gray-700 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all border border-gray-100"
                        />
                    </div>
                    <div className="flex gap-4">
                        <select className="bg-gray-50 border border-gray-100 text-gray-700 py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-medium appearance-none">
                            <option>All Status</option>
                        </select>
                        <button className="bg-primary text-white py-3 px-6 rounded-xl font-medium hover:bg-secondary transition-colors flex items-center gap-2">
                            <FaCalendarAlt /> Calendar View
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-gray-900 font-bold border-b border-gray-100">
                                <th className="py-4 px-4 font-bold">Donor Details</th>
                                <th className="py-4 px-4 font-bold">Category</th>
                                <th className="py-4 px-4 font-bold">Address</th>
                                <th className="py-4 px-4 font-bold">Date</th>
                                <th className="py-4 px-4 font-bold text-center">Status</th>
                                <th className="py-4 px-4 font-bold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pickups.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-gray-500">No scheduled pickups found.</td>
                                </tr>
                            )}
                            {pickups.map((pickup) => (
                                <tr key={pickup.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-4">
                                        <div className="font-bold text-gray-900">Donor</div>
                                        <div className="text-sm text-gray-500">{pickup.donorName || 'N/A'}</div>
                                    </td>
                                    <td className="py-4 px-4 font-medium text-gray-600">{pickup.description || 'Details unavailable'}</td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center text-gray-600">
                                            <FaMapMarkerAlt className="mr-2 text-red-400" />
                                            {pickup.pickupAddress || 'Address not provided'}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center text-gray-600">
                                            <FaCalendarAlt className="mr-2 text-primary" />
                                            <div>
                                                <div className="font-medium">{pickup.pickupDate ? new Date(pickup.pickupDate).toLocaleDateString('en-GB') : 'Flexible'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusStyle(pickup.status)}`}>
                                            {pickup.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex gap-2 justify-end items-center">
                                            <button className="p-2 text-gray-400 hover:text-primary transition-colors bg-gray-50 hover:bg-primary/10 rounded-lg h-fit">
                                                <FaEye />
                                            </button>
                                            
                                            {pickup.status === 'ACCEPTED' ? (
                                                schedulingId === pickup.id ? (
                                                    <div className="flex flex-col gap-2">
                                                        <input 
                                                            type="date" 
                                                            value={scheduleDate} 
                                                            onChange={(e) => setScheduleDate(e.target.value)} 
                                                            className="text-sm border border-gray-200 p-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" 
                                                        />
                                                        <div className="flex gap-1 justify-end">
                                                            <button onClick={() => setSchedulingId(null)} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-200">Cancel</button>
                                                            <button onClick={() => handleSchedule(pickup.id)} className="px-2 py-1 bg-primary text-white text-xs font-bold rounded-lg hover:bg-secondary">Save</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => { setSchedulingId(pickup.id); setScheduleDate(''); }} className="px-4 py-2 bg-purple-50 text-purple-600 text-sm font-bold rounded-lg hover:bg-purple-100 transition-colors">
                                                        Schedule Date
                                                    </button>
                                                )
                                            ) : (
                                                <button onClick={() => handleMarkPickedUp(pickup.id)} className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-secondary transition-colors whitespace-nowrap">
                                                    Mark Picked Up
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
