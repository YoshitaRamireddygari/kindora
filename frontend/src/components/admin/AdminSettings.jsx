import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { settingsService } from '../../services/api';

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        allowNgoRegistrations: true,
        maintenanceMode: false,
        sendDailyDigest: true,
        alertOnNewNgo: true
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await settingsService.getSettings();
            setSettings(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch settings", error);
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await settingsService.updateSettings(settings);
            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Failed to save settings", error);
            alert("Failed to save settings.");
        }
    };

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (loading) return <div className="p-8">Loading settings...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800">System Settings</h2>
                <p className="text-gray-500 mt-1">Configure global application preferences.</p>
            </div>

            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8">
                <div className="space-y-6">
                    <div>
                        <h4 className="font-bold text-gray-800 mb-2">Allow New NGO Registrations</h4>
                        <label className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input type="checkbox" className="sr-only" checked={settings.allowNgoRegistrations} onChange={() => toggleSetting('allowNgoRegistrations')} />
                                <div className={`block w-14 h-8 rounded-full transition-colors ${settings.allowNgoRegistrations ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${settings.allowNgoRegistrations ? 'translate-x-6' : ''}`}></div>
                            </div>
                            <div className="ml-3 text-gray-700 font-medium">{settings.allowNgoRegistrations ? 'Enabled' : 'Disabled'}</div>
                        </label>
                    </div>

                    <hr className="border-gray-100" />

                    <div>
                        <h4 className="font-bold text-gray-800 mb-2">Maintenance Mode</h4>
                        <label className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input type="checkbox" className="sr-only" checked={settings.maintenanceMode} onChange={() => toggleSetting('maintenanceMode')} />
                                <div className={`block w-14 h-8 rounded-full transition-colors ${settings.maintenanceMode ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${settings.maintenanceMode ? 'translate-x-6' : ''}`}></div>
                            </div>
                            <div className="ml-3 text-gray-700 font-medium">{settings.maintenanceMode ? 'Enabled' : 'Disabled'}</div>
                        </label>
                    </div>

                    <hr className="border-gray-100" />

                    <div>
                        <h4 className="font-bold text-gray-800 mb-4">Email Notifications</h4>
                        <div className="space-y-3">
                            <label className="flex items-center cursor-pointer">
                                <input type="checkbox" className="form-checkbox text-primary rounded" checked={settings.sendDailyDigest} onChange={() => toggleSetting('sendDailyDigest')} />
                                <span className="ml-2 text-gray-700">Send daily digest to Admin</span>
                            </label>
                            <label className="flex items-center cursor-pointer">
                                <input type="checkbox" className="form-checkbox text-primary rounded" checked={settings.alertOnNewNgo} onChange={() => toggleSetting('alertOnNewNgo')} />
                                <span className="ml-2 text-gray-700">Alert on new NGO verification</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <button onClick={handleSave} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-secondary transition-colors shadow-md">
                        Save Settings
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
