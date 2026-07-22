import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { donorService } from '../../services/api';
import MapLocation from '../common/MapLocation';
import LocationSelector from '../common/LocationSelector';

export default function Profile({ user }) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        fullAddress: user?.fullAddress || '',
        city: user?.city || '',
        district: user?.district || '',
        state: user?.state || '',
        country: user?.country || '',
        pincode: user?.pincode || '',
        latitude: user?.latitude || null,
        longitude: user?.longitude || null,
    });
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        try {
            await donorService.updateProfile(user.id, formData);
            
            // Update local storage so the rest of the app sees the changes
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...currentUser, ...formData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            alert("Profile updated successfully!");
            setIsEditing(false);
            window.location.reload();
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>
            
            <div className="space-y-6">
                <div className="flex items-center space-x-6 mb-8">
                    <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-4xl font-bold shadow-lg">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">{user?.name}</h3>
                        <p className="text-gray-500 capitalize">{user?.role}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Full Name / Username</label>
                        {isEditing ? (
                            <input 
                                type="text" 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        ) : (
                            <p className="mt-1 text-lg font-medium text-gray-900">{user?.name}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Email Address (Read-only)</label>
                        <p className="mt-1 text-lg font-medium text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Phone Number</label>
                        {isEditing ? (
                            <input 
                                type="text" 
                                value={formData.phone} 
                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        ) : (
                            <p className="mt-1 text-lg font-medium text-gray-900">{user?.phone || 'Not provided'}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Joined On</label>
                        <p className="mt-1 text-lg font-medium text-gray-900">
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                        </p>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 mt-8">
                    <h4 className="text-lg font-bold text-gray-800 mb-4">Address Details</h4>
                    {isEditing ? (
                        <LocationSelector 
                            initialLocation={user?.latitude ? { lat: user.latitude, lng: user.longitude, address: user.address } : null}
                            onLocationSelect={(loc) => setFormData({
                                ...formData,
                                address: loc.address,
                                fullAddress: loc.fullAddress,
                                city: loc.city,
                                district: loc.district,
                                state: loc.state,
                                country: loc.country,
                                pincode: loc.pincode,
                                latitude: loc.lat,
                                longitude: loc.lng
                            })}
                        />
                    ) : (
                        <MapLocation 
                            latitude={user?.latitude}
                            longitude={user?.longitude}
                            address={user?.address}
                            title="Saved Address"
                            height="200px"
                        />
                    )}
                </div>

                <div className="pt-8 border-t border-gray-100 mt-8 flex gap-4">
                    {isEditing ? (
                        <>
                            <button onClick={handleSave} disabled={loading} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 font-bold">
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button onClick={() => setIsEditing(false)} className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors font-bold">
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-secondary transition-colors font-bold">
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
