import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import DonateItem from '../components/donor/DonateItem';
import MyDonations from '../components/donor/MyDonations';
import DonationHistory from '../components/donor/DonationHistory';
import NgoDetails from '../components/donor/NgoDetails';
import Profile from '../components/donor/Profile';
import TrackDonation from '../components/donor/TrackDonation';
import NgoDashboard from '../components/ngo/NgoDashboard';
import DonationRequests from '../components/ngo/DonationRequests';
import AcceptedDonations from '../components/ngo/AcceptedDonations';
import PickupSchedule from '../components/ngo/PickupSchedule';
import Inventory from '../components/ngo/Inventory';
import Beneficiaries from '../components/ngo/Beneficiaries';
import NgoProfile from '../components/ngo/NgoProfile';
import NgoNotifications from '../components/ngo/NgoNotifications';
import NgoSettings from '../components/ngo/NgoSettings';
import AdminVerification from '../components/admin/AdminVerification';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminUsers from '../components/admin/AdminUsers';
import AdminDonations from '../components/admin/AdminDonations';
import AdminProofs from '../components/admin/AdminProofs';
import AdminCategories from '../components/admin/AdminCategories';
import AdminReports from '../components/admin/AdminReports';
import AdminNotifications from '../components/admin/AdminNotifications';
import AdminSettings from '../components/admin/AdminSettings';
import AdminProfile from '../components/admin/AdminProfile';
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
        if (activeTab === 'OVERVIEW' && user.role === 'ADMIN') return <AdminDashboard setActiveTab={setActiveTab} />;
        if (activeTab === 'USERS' && user.role === 'ADMIN') return <AdminUsers />;
        if (activeTab === 'NGO_VERIFICATION' && user.role === 'ADMIN') return <AdminVerification />;
        if (activeTab === 'DONATIONS_MGMT' && user.role === 'ADMIN') return <AdminDonations />;
        if (activeTab === 'PROOFS' && user.role === 'ADMIN') return <AdminProofs />;
        if (activeTab === 'CATEGORIES' && user.role === 'ADMIN') return <AdminCategories />;
        if (activeTab === 'REPORTS' && user.role === 'ADMIN') return <AdminReports />;
        if (activeTab === 'NOTIFICATIONS' && user.role === 'ADMIN') return <AdminNotifications />;
        if (activeTab === 'SETTINGS' && user.role === 'ADMIN') return <AdminSettings />;
        if (activeTab === 'PROFILE' && user.role === 'ADMIN') return <AdminProfile user={user} />;
        
        // Placeholders for unimplemented admin modules
        const unimplementedAdminTabs = ['AUDIT_LOGS'];
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
        if (user.role === 'NGO') {
            if (activeTab === 'OVERVIEW') return <NgoDashboard user={user} setActiveTab={setActiveTab} />;
            if (activeTab === 'DONATION_REQUESTS') return <DonationRequests user={user} />;
            if (activeTab === 'ACCEPTED_DONATIONS') return <AcceptedDonations user={user} />;
            if (activeTab === 'PICKUP_SCHEDULE') return <PickupSchedule user={user} />;
            if (activeTab === 'INVENTORY') return <Inventory user={user} />;
            if (activeTab === 'BENEFICIARIES') return <Beneficiaries />;
            if (activeTab === 'NGO_PROFILE') return <NgoProfile user={user} setActiveTab={setActiveTab} />;
            if (activeTab === 'NOTIFICATIONS') return <NgoNotifications />;
            if (activeTab === 'NGO_SETTINGS') return <NgoSettings user={user} />;
            if (activeTab === 'REPORTS') return <AdminReports />;
        }
        
        // --- Shared Tabs ---
        if (activeTab === 'PROFILE') return <Profile user={user} />;
        
        // Fallback OVERVIEW for Donors
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
                <Topbar user={user} setActiveTab={setActiveTab} />
                
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
