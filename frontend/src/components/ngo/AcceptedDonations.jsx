import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaEye, FaFileAlt, FaBox, FaTshirt, FaBook, FaBed, FaGamepad, FaCheck, FaLocationArrow, FaChevronDown, FaChevronUp, FaCamera } from 'react-icons/fa';
import { ngoService } from '../../services/api';
import LocationSelector from '../common/LocationSelector';
import MapLocation from '../common/MapLocation';

export default function AcceptedDonations({ user }) {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All Status');
    
    // Proof Modal State
    const [isProofModalOpen, setIsProofModalOpen] = useState(false);
    const [selectedDonation, setSelectedDonation] = useState(null);
    const [proofData, setProofData] = useState({
        recipientName: '',
        distributionDate: '',
        distributionAddress: '',
        distributionFullAddress: '',
        distributionCity: '',
        distributionDistrict: '',
        distributionState: '',
        distributionCountry: '',
        distributionPincode: '',
        distributionLatitude: null,
        distributionLongitude: null,
        description: '',
        photos: [] // We'll simulate 3 photos using Base64
    });
    const [expandedRow, setExpandedRow] = useState(null);

    useEffect(() => {
        const fetchDonations = async () => {
            if (!user || !user.id) return;
            try {
                const res = await ngoService.getAcceptedDonations(user.id);
                setDonations(res.data || []);
            } catch (err) {
                console.error("Failed to fetch accepted donations", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDonations();
        const intervalId = setInterval(fetchDonations, 5000);
        return () => clearInterval(intervalId);
    }, [user]);

    const getCategoryIcon = (category) => {
        const cat = category?.toLowerCase();
        if (cat === 'food' || cat === 'rice') return <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center text-lg"><FaBox /></div>;
        if (cat === 'clothes' || cat === 'clothing') return <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center text-lg"><FaTshirt /></div>;
        if (cat === 'books' || cat === 'education') return <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center text-lg"><FaBook /></div>;
        if (cat === 'blankets') return <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center text-lg"><FaBed /></div>;
        if (cat === 'toys' || cat === 'kids') return <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center text-lg"><FaGamepad /></div>;
        return <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-lg"><FaBox /></div>;
    };

    const getStatusStyle = (status) => {
        if (status === 'COMPLETED') return 'bg-green-50 text-green-500 border-green-100';
        if (status === 'DISTRIBUTION_PROOF_PENDING') return 'bg-yellow-50 text-yellow-600 border-yellow-100';
        if (status === 'IN_TRANSIT' || status === 'ACCEPTED' || status === 'DELIVERED_TO_NGO') return 'bg-blue-50 text-blue-500 border-blue-100';
        return 'bg-gray-50 text-gray-500 border-gray-100';
    };

    const openProofModal = (donation) => {
        setSelectedDonation(donation);
        setProofData({
            recipientName: '',
            distributionDate: new Date().toISOString().split('T')[0],
            distributionAddress: '',
            distributionFullAddress: '',
            distributionCity: '',
            distributionDistrict: '',
            distributionState: '',
            distributionCountry: '',
            distributionPincode: '',
            distributionLatitude: null,
            distributionLongitude: null,
            description: '',
            photos: []
        });
        setIsProofModalOpen(true);
    };

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files).slice(0, 3); // Max 3 photos
        if (files.length === 0) return;
        
        const filePromises = files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(filePromises).then(base64Photos => {
            setProofData(prev => ({ ...prev, photos: [...prev.photos, ...base64Photos].slice(0, 3) }));
        });
    };

    const handleUploadProofSubmit = async () => {
        if (!proofData.distributionDate || !proofData.description || proofData.photos.length === 0) {
            alert("Please fill all required fields and upload at least 1 photo.");
            return;
        }

        try {
            await ngoService.uploadProof(selectedDonation.id, proofData);
            alert("Distribution proof uploaded successfully!");
            setIsProofModalOpen(false);
            setDonations(donations.map(d => 
                d.id === selectedDonation.id ? { ...d, status: 'DISTRIBUTION_PROOF_PENDING' } : d
            ));
        } catch (error) {
            alert("Failed to upload proof");
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-7xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Accepted Donations</h2>
                <p className="text-gray-500 mt-1">View all accepted donations.</p>
            </div>
            
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 flex-1">
                {/* Toolbar */}
                <div className="flex justify-between items-center mb-8 gap-4">
                    <div className="relative flex-1 max-w-md">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by ID, Item, or Donor..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 text-gray-700 border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-primary/30 focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                    <div className="flex gap-4">
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-gray-50 border border-gray-100 text-gray-700 py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-medium appearance-none"
                        >
                            <option value="All Status">All Status</option>
                            <option value="ACCEPTED">In Transit (Accepted)</option>
                            <option value="SCHEDULED">Scheduled</option>
                            <option value="DISTRIBUTION_PROOF_PENDING">Pending Proof</option>
                            <option value="COMPLETED">Completed</option>
                        </select>
                        <select className="bg-gray-50 border border-gray-100 text-gray-700 py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer font-medium appearance-none">
                            <option>This Month</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="py-20 text-center text-gray-500">Loading accepted donations...</div>
                ) : donations.length === 0 ? (
                    <div className="py-20 text-center text-gray-500">No accepted donations found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-gray-900 font-bold border-b border-gray-100">
                                    <th className="py-4 px-4 font-bold">Item</th>
                                    <th className="py-4 px-4 font-bold">Donor</th>
                                    <th className="py-4 px-4 font-bold">Quantity</th>
                                    <th className="py-4 px-4 font-bold">Accepted On</th>
                                    <th className="py-4 px-4 font-bold">Status</th>
                                    <th className="py-4 px-4 font-bold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donations.filter(don => {
                                    const matchesSearch = (don.id || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                                        (don.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                                        (don.donorName || '').toLowerCase().includes(searchTerm.toLowerCase());
                                    
                                    if (!matchesSearch) return false;
                                    if (filterStatus === 'All Status') return true;
                                    return don.status === filterStatus;
                                }).map((d) => (
                                    <React.Fragment key={d.id}>
                                    <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                {getCategoryIcon(d.category)}
                                                <span className="font-bold text-gray-900">{d.category}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-gray-600 font-medium">{d.donorName || 'Unknown Donor'}</td>
                                        <td className="py-4 px-4 text-gray-600 font-medium">{d.quantity}</td>
                                        <td className="py-4 px-4 text-gray-600 font-medium">{new Date(d.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(d.status)}`}>
                                                {d.status === 'ACCEPTED' ? 'In Transit' : d.status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button 
                                                    onClick={() => setExpandedRow(expandedRow === d.id ? null : d.id)}
                                                    className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                                >
                                                    {expandedRow === d.id ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                                                </button>
                                                {d.status !== 'COMPLETED' && d.status !== 'DISTRIBUTION_PROOF_PENDING' && (
                                                    <button 
                                                        onClick={() => openProofModal(d)}
                                                        title="Upload Distribution Proof"
                                                        className="px-4 py-1.5 rounded-full bg-green-50 text-green-600 border border-green-200 flex items-center justify-center hover:bg-green-100 transition-colors gap-2 font-bold text-sm">
                                                        <FaCamera size={14} /> Upload Proof
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                    {expandedRow === d.id && (
                                        <tr className="bg-gray-50/50 border-b border-gray-100">
                                            <td colSpan="6" className="p-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="md:col-span-2">
                                                        <MapLocation 
                                                            latitude={d.pickupLatitude}
                                                            longitude={d.pickupLongitude}
                                                            address={d.pickupAddress}
                                                            title="Pickup Location"
                                                            height="150px"
                                                            showNavigationButton={true}
                                                        />
                                                    </div>
                                                </div>
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
                {!loading && donations.length > 0 && (
                    <div className="flex justify-between items-center mt-6 text-gray-500 text-sm">
                        <span>Showing 1 to {donations.length} of {donations.length} donations</span>
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

            {/* Upload Proof Modal */}
            {isProofModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[32px] p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">Upload Distribution Proof</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">Donation ID: {selectedDonation?.id}</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name (Optional)</label>
                                <input type="text" value={proofData.recipientName} onChange={(e) => setProofData({...proofData, recipientName: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20" />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Distribution Date *</label>
                                <input type="date" value={proofData.distributionDate} onChange={(e) => setProofData({...proofData, distributionDate: e.target.value})} className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20" />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                                <LocationSelector 
                                    onLocationSelect={(loc) => setProofData(prev => ({ 
                                        ...prev, 
                                        distributionAddress: loc.address,
                                        distributionFullAddress: loc.fullAddress,
                                        distributionCity: loc.city,
                                        distributionDistrict: loc.district,
                                        distributionState: loc.state,
                                        distributionCountry: loc.country,
                                        distributionPincode: loc.pincode, 
                                        distributionLatitude: loc.lat, 
                                        distributionLongitude: loc.lng 
                                    }))} 
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                <textarea 
                                    rows="3" 
                                    placeholder="e.g. Donated clothes were distributed to 25 children at ABC Government School."
                                    value={proofData.description} 
                                    onChange={(e) => setProofData({...proofData, description: e.target.value})} 
                                    className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photos (Max 3) *</label>
                                <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="w-full p-2 border border-gray-200 rounded-xl text-sm" />
                                
                                {proofData.photos.length > 0 && (
                                    <div className="mt-3 flex gap-2">
                                        {proofData.photos.map((p, i) => (
                                            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                                                <img src={p} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                                                <button 
                                                    onClick={() => setProofData(prev => ({...prev, photos: prev.photos.filter((_, idx) => idx !== i)}))}
                                                    className="absolute top-0 right-0 bg-red-500 text-white p-1 text-xs"
                                                >
                                                    x
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-3">
                            <button onClick={() => setIsProofModalOpen(false)} className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Cancel</button>
                            <button onClick={handleUploadProofSubmit} className="px-6 py-2 bg-primary text-white font-bold rounded-xl hover:bg-secondary">Submit Proof</button>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
