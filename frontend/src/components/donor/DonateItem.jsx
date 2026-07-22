import React, { useState } from 'react';
import { donorService } from '../../services/api';
import { motion } from 'framer-motion';
import { FaHandHoldingHeart, FaPlus } from 'react-icons/fa';
import LocationSelector from '../common/LocationSelector';
import MapLocation from '../common/MapLocation';

export default function DonateItem({ user, setActiveTab }) {
    const [formData, setFormData] = useState({
        itemName: '',
        category: '',
        quantity: '',
        condition: '',
        pickupAddress: '',
        pickupFullAddress: '',
        pickupCity: '',
        pickupDistrict: '',
        pickupState: '',
        pickupCountry: '',
        pickupPincode: '',
        pickupLatitude: null,
        pickupLongitude: null,
        description: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.pickupAddress) {
            alert('Please select a pickup location on the map.');
            return;
        }
        
        if (!formData.images || formData.images.length === 0) {
            alert('Please upload at least one image of the item.');
            return;
        }

        try {
            await donorService.createDonation({
                description: `${formData.itemName} (${formData.quantity}) - ${formData.condition}: ${formData.description}`,
                category: formData.category,
                quantity: formData.quantity,
                pickupAddress: formData.pickupAddress,
                pickupFullAddress: formData.pickupFullAddress,
                pickupCity: formData.pickupCity,
                pickupDistrict: formData.pickupDistrict,
                pickupState: formData.pickupState,
                pickupCountry: formData.pickupCountry,
                pickupPincode: formData.pickupPincode,
                pickupLatitude: formData.pickupLatitude,
                pickupLongitude: formData.pickupLongitude,
                donorId: user.id
            });
            alert('Donation submitted successfully!');
            setActiveTab('HISTORY');
        } catch (error) {
            alert('Failed to submit donation. Please try again.');
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Donate Item</h2>
                <p className="text-gray-500 mt-1">Share more, care more.</p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8 flex-1">
                {/* Form Section */}
                <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 p-8 flex-1 max-w-3xl">
                    <h3 className="font-bold text-gray-800 mb-6 text-lg">Item Details</h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name</label>
                                <input 
                                    type="text" name="itemName" placeholder="Enter item name"
                                    value={formData.itemName} onChange={handleChange} required
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-700"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                <select 
                                    name="category" value={formData.category} onChange={handleChange} required
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-700 appearance-none bg-white"
                                >
                                    <option value="" disabled>Select</option>
                                    <option value="Food">Food</option>
                                    <option value="Clothes">Clothes</option>
                                    <option value="Books">Books</option>
                                    <option value="Toys">Toys</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                                <input 
                                    type="text" name="quantity" placeholder="Enter quantity"
                                    value={formData.quantity} onChange={handleChange} required
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-700"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Condition</label>
                                <select 
                                    name="condition" value={formData.condition} onChange={handleChange} required
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-700 appearance-none bg-white"
                                >
                                    <option value="" disabled>Select</option>
                                    <option value="New">New</option>
                                    <option value="Good">Good</option>
                                    <option value="Fair">Fair</option>
                                </select>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Pickup Location</label>
                            <LocationSelector 
                                onLocationSelect={(loc) => setFormData(prev => ({ 
                                    ...prev, 
                                    pickupAddress: loc.address,
                                    pickupFullAddress: loc.fullAddress,
                                    pickupCity: loc.city,
                                    pickupDistrict: loc.district,
                                    pickupState: loc.state,
                                    pickupCountry: loc.country,
                                    pickupPincode: loc.pincode, 
                                    pickupLatitude: loc.lat, 
                                    pickupLongitude: loc.lng 
                                }))} 
                            />
                            {formData.pickupAddress && (
                                <div className="mt-4">
                                    <MapLocation 
                                        latitude={formData.pickupLatitude}
                                        longitude={formData.pickupLongitude}
                                        address={formData.pickupAddress}
                                        title="Selected Pickup Location"
                                        showMap={false}
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                            <input 
                                type="text" name="description" placeholder="Good quality, well maintained and clean items."
                                value={formData.description} onChange={handleChange} required
                                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-700"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-4">Upload Images</label>
                            <div className="flex gap-4 overflow-x-auto pb-2 items-center">
                                {formData.images && formData.images.map((img, idx) => (
                                    <div key={idx} className="w-24 h-24 rounded-xl bg-gray-200 flex-shrink-0 overflow-hidden relative group">
                                        <img src={URL.createObjectURL(img)} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                                        <button 
                                            type="button" 
                                            onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                <label className="w-24 h-24 rounded-xl bg-purple-100 flex flex-col items-center justify-center text-primary font-medium flex-shrink-0 hover:bg-purple-200 transition-colors cursor-pointer border-2 border-dashed border-primary/30">
                                    <FaPlus className="mb-1" />
                                    <span className="text-sm">Add</span>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        multiple 
                                        className="hidden" 
                                        onChange={(e) => {
                                            if (e.target.files) {
                                                const newFiles = Array.from(e.target.files);
                                                setFormData({ ...formData, images: [...(formData.images || []), ...newFiles] });
                                            }
                                        }} 
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button 
                                type="submit"
                                className="w-full bg-secondary text-white py-4 rounded-2xl hover:bg-primary transition-colors font-bold text-lg"
                            >
                                Submit Donation
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right Side Illustration */}
                <div className="hidden lg:flex flex-col items-center justify-center w-80 bg-accent rounded-[32px] p-8 text-center">
                    <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
                        <div className="absolute inset-0 bg-secondary/10 rounded-full blur-3xl"></div>
                        <div className="w-32 h-32 bg-secondary rounded-2xl rotate-12 flex items-center justify-center shadow-2xl z-10 relative">
                            <FaHandHoldingHeart className="text-white text-5xl -rotate-12" />
                            {/* Decorative Hearts */}
                            <div className="absolute -top-6 -right-6 text-pink-400 text-2xl -rotate-12">❤</div>
                            <div className="absolute top-4 -left-8 text-pink-300 text-xl rotate-12">❤</div>
                            <div className="absolute -bottom-4 right-8 text-purple-300 text-lg rotate-45">❤</div>
                        </div>
                    </div>
                    <p className="text-gray-600 font-medium">Your small donation</p>
                    <p className="text-gray-600 font-medium">create a big</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">big difference.</p>
                </div>
            </div>
        </motion.div>
    );
}
