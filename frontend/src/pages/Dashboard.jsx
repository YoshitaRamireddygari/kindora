import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import DonateItem from '../components/donor/DonateItem';
import MyDonations from '../components/donor/MyDonations';
import DonationHistory from '../components/donor/DonationHistory';
import NgoDetails from '../components/donor/NgoDetails';
import Profile from '../components/donor/Profile';
import TrackDonation from '../components/donor/TrackDonation';
import AvailableDonations from '../components/ngo/AvailableDonations';
import MyPickups from '../components/ngo/MyPickups';
import AdminVerification from '../components/admin/AdminVerification';
import AdminDashboard from '../components/admin/AdminDashboard';
import DonorDashboard from '../components/donor/DonorDashboard';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('OVERVIEW');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    // Handle setting default tab when user loads, but only once
    useEffect(() => {
        if (user && activeTab === 'OVERVIEW' && !window.defaultTabSet) {
            window.defaultTabSet = true;
            // Optionally, we can let them stay on OVERVIEW
        }
    }, [user, activeTab]);

    if (!user) return null;

    const renderContent = () => {
        // --- Admin Tabs ---
        if (activeTab === 'OVERVIEW' && user.role === 'ADMIN') return <AdminDashboard />;
        if (activeTab === 'NGO_VERIFICATION') return <AdminVerification />;
        
        // Placeholders for unimplemented admin modules
        const unimplementedAdminTabs = ['USERS', 'DONATIONS_MGMT', 'CATEGORIES', 'REPORTS', 'NOTIFICATIONS', 'SETTINGS', 'AUDIT_LOGS'];
        if (unimplementedAdminTabs.includes(activeTab)) {
            return (
                <div className="p-8 flex items-center justify-center h-full">
                    <div className="text-center text-gray-400">
                        <h3 className="text-2xl font-bold mb-2">Module Under Construction</h3>
                        <p>This module ({activeTab}) will be implemented in the next iteration.</p>
                    </div>
                </div>
            );
        }

        // --- Donor Tabs ---
        if (activeTab === 'DONATE') return <DonateItem user={user} setActiveTab={setActiveTab} />;
        if (activeTab === 'MY_DONATIONS') return <MyDonations user={user} />;
        if (activeTab === 'HISTORY') return <DonationHistory user={user} />;
        if (activeTab === 'TRACK') return <TrackDonation />;
        if (activeTab === 'NGO_DETAILS') return <NgoDetails />;
        
        // --- NGO Tabs ---
        if (activeTab === 'AVAILABLE') return <AvailableDonations user={user} setActiveTab={setActiveTab} />;
        if (activeTab === 'MY_PICKUPS') return <MyPickups user={user} />;
        
        // --- Shared Tabs ---
        if (activeTab === 'PROFILE') return <Profile user={user} />;
        
        // Fallback OVERVIEW for non-admins (Donors/NGOs)
        if (activeTab === 'OVERVIEW') {
            return <DonorDashboard user={user} setActiveTab={setActiveTab} />;
        }
        
        return (
            <div className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Coming Soon</h2>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-accent font-sans">
            <Sidebar role={user.role} activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Topbar user={user} />
                
                <main className="flex-1 overflow-y-auto relative">
                    {/* Only add padding if it's not the massive admin dashboard which handles its own spacing */}
                    <div className={activeTab === 'OVERVIEW' && user.role === 'ADMIN' ? 'p-6' : 'p-8'}>
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
}
