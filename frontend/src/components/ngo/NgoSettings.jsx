import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { authService, ngoService } from '../../services/api';

export default function NgoSettings({ user }) {
    const [activeTab, setActiveTab] = useState('Profile Settings');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    
    const [profileData, setProfileData] = useState({
        organizationName: user?.name || "Helping Hands NGO",
        contactPerson: user?.authorizedPersonName || "Admin",
        phone: user?.mobileNumber || "+91 91234 56789",
        address: user?.address || "Hyderabad, Telangana, India"
    });
    const [loading, setLoading] = useState(false);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await ngoService.updateProfile(user.id, {
                organizationName: profileData.organizationName,
                authorizedPersonName: profileData.contactPerson,
                mobileNumber: profileData.phone,
                address: profileData.address
            });
            
            // Update local storage so the rest of the app sees the changes
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { 
                ...currentUser, 
                name: profileData.organizationName,
                authorizedPersonName: profileData.contactPerson,
                mobileNumber: profileData.phone,
                address: profileData.address
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            alert("Profile updated successfully!");
            window.location.reload();
        } catch (error) {
            console.error("Failed to update profile", error);
            alert("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            alert('Please fill out all password fields.');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New passwords do not match!');
            return;
        }
        try {
            await authService.changePassword({ 
                email: user.email, 
                oldPassword: passwordData.oldPassword, 
                newPassword: passwordData.newPassword 
            });
            alert('Password updated successfully!');
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            alert(error.response?.data?.error || 'Failed to update password');
        }
    };

    const tabs = [
        'Profile Settings',
        'Change Password',
        'Notification Preferences',
        'Pickup Preferences',
        'Privacy Settings'
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-6xl mx-auto">
            <div className="mb-8 mt-8">
                <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
                <p className="text-gray-500 mt-1">Manage your account and preferences.</p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8 flex-1">
                {/* Left Sidebar for Settings */}
                <div className="w-full lg:w-64 bg-white rounded-3xl p-4 shadow-sm border border-gray-100 h-fit">
                    <ul className="space-y-2">
                        {tabs.map((tab) => (
                            <li key={tab}>
                                <button 
                                    onClick={() => setActiveTab(tab)}
                                    className={`w-full text-left px-6 py-4 rounded-xl font-medium transition-colors ${activeTab === tab ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    {tab}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Form Area */}
                <div className="flex-1 bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
                    {activeTab === 'Profile Settings' && (
                        <div>
                            <form className="space-y-6 max-w-lg" onSubmit={handleProfileUpdate}>
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">Organization Name</label>
                                    <input 
                                        type="text" 
                                        value={profileData.organizationName}
                                        onChange={(e) => setProfileData({...profileData, organizationName: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-700 font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">Email (Read-only)</label>
                                    <input 
                                        type="email" 
                                        value={user?.email || "contact@helpinghands.org"}
                                        readOnly
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none text-gray-500 font-medium cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">Contact Person</label>
                                    <input 
                                        type="text" 
                                        value={profileData.contactPerson}
                                        onChange={(e) => setProfileData({...profileData, contactPerson: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-700 font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">Phone</label>
                                    <input 
                                        type="text" 
                                        value={profileData.phone}
                                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-700 font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">Address</label>
                                    <input 
                                        type="text" 
                                        value={profileData.address}
                                        onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-700 font-medium"
                                    />
                                </div>
                                
                                <div className="pt-4">
                                    <button type="submit" disabled={loading} className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-secondary transition-colors disabled:opacity-50">
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'Change Password' && (
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Change Password</h3>
                            <form className="space-y-6 max-w-lg">
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">Current Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showCurrent ? "text" : "password"} 
                                            placeholder="Enter your password"
                                            value={passwordData.oldPassword}
                                            onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-700 pr-10"
                                        />
                                        <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                            {showCurrent ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">New Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showNew ? "text" : "password"} 
                                            placeholder="Enter new password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-700 pr-10"
                                        />
                                        <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                            {showNew ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">Confirm New Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showConfirm ? "text" : "password"} 
                                            placeholder="Confirm new password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-700 pr-10"
                                        />
                                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                            {showConfirm ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button type="button" onClick={handlePasswordUpdate} className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-secondary transition-colors">
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'Notification Preferences' && (
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Notification Preferences</h3>
                            <div className="space-y-6 max-w-lg">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <h4 className="font-bold text-gray-800">Email Notifications</h4>
                                        <p className="text-sm text-gray-500">Receive daily summaries and alerts via email.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <h4 className="font-bold text-gray-800">New Donation Alerts</h4>
                                        <p className="text-sm text-gray-500">Get notified instantly when a matching donation is posted.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <h4 className="font-bold text-gray-800">SMS Notifications</h4>
                                        <p className="text-sm text-gray-500">Receive urgent pickup reminders via SMS.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                                <div className="pt-4">
                                    <button type="button" className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-secondary transition-colors">
                                        Save Preferences
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Pickup Preferences' && (
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Pickup Preferences</h3>
                            <form className="space-y-6 max-w-lg">
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">Preferred Pickup Times</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                                            <input type="checkbox" className="w-5 h-5 text-primary" defaultChecked /> Morning (9 AM - 12 PM)
                                        </label>
                                        <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                                            <input type="checkbox" className="w-5 h-5 text-primary" defaultChecked /> Afternoon (12 PM - 4 PM)
                                        </label>
                                        <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                                            <input type="checkbox" className="w-5 h-5 text-primary" /> Evening (4 PM - 8 PM)
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">Maximum Pickups Per Day</label>
                                    <select className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-700 font-medium appearance-none bg-white">
                                        <option>5 Pickups</option>
                                        <option>10 Pickups</option>
                                        <option>15 Pickups</option>
                                        <option>Unlimited</option>
                                    </select>
                                </div>
                                <div className="pt-4">
                                    <button type="button" className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-secondary transition-colors">
                                        Update Pickup Settings
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'Privacy Settings' && (
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Privacy Settings</h3>
                            <div className="space-y-6 max-w-lg">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <h4 className="font-bold text-gray-800">Public Profile Visibility</h4>
                                        <p className="text-sm text-gray-500">Allow donors to view your NGO's public profile page.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div>
                                        <h4 className="font-bold text-gray-800">Show Contact Info to Donors</h4>
                                        <p className="text-sm text-gray-500">Display your phone number and address to matched donors.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
