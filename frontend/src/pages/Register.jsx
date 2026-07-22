import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api, { ngoService } from '../services/api';
import { navState } from '../utils/navigation';
import LocationSelector from '../components/common/LocationSelector';
import MapLocation from '../components/common/MapLocation';

export default function Register() {
    const [role, setRole] = useState('DONOR');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (navState.isFirstLoad) {
            navigate('/');
        }
    }, [navigate]);
    
    // Donor State
    const [donorData, setDonorData] = useState({
        name: '', email: '', password: '', confirmPassword: '', phone: '', address: '', 
        fullAddress: '', city: '', district: '', state: '', country: '', pincode: '',
        latitude: null, longitude: null
    });

    // NGO State
    const [ngoData, setNgoData] = useState({
        organizationName: '', registrationNumber: '', registrationType: 'Society',
        registrationDate: '', address: '', fullAddress: '', city: '', district: '', state: '', country: '', pincode: '',
        authorizedPersonName: '', email: '', mobileNumber: '', password: '', confirmPassword: '',
        registrationCertificate: '', panCard: '', addressProof: '', idProof: '', latitude: null, longitude: null
    });

    const handleDonorChange = (e) => setDonorData({ ...donorData, [e.target.name]: e.target.value });
    const handleNgoChange = (e) => setNgoData({ ...ngoData, [e.target.name]: e.target.value });

    // Mock file upload handler
    const handleFileUpload = (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            setNgoData({ ...ngoData, [fieldName]: `/mock-storage/documents/${file.name}` });
        }
    };

    const handleDonorSubmit = async (e) => {
        e.preventDefault();
        
        if (donorData.password !== donorData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        if (donorData.password.length < 6) {
            alert('Password must be at least 6 characters long!');
            return;
        }
        if (!donorData.address || !donorData.latitude) {
            alert('Please select a valid location from the map.');
            return;
        }

        try {
            const { confirmPassword, ...submitData } = donorData;
            await api.post('/auth/register', { ...submitData, role: 'DONOR' });
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || 'Unknown error occurred on the server';
            alert(`Registration failed: ${errorMsg}`);
        }
    };

    const handleNgoSubmit = async (e) => {
        e.preventDefault();
        
        if (ngoData.password !== ngoData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        if (ngoData.password.length < 6) {
            alert('Password must be at least 6 characters long!');
            return;
        }
        if (!ngoData.address || !ngoData.latitude) {
            alert('Please select a valid location from the map.');
            return;
        }

        try {
            const { confirmPassword, ...submitData } = ngoData;
            await ngoService.register(submitData);
            alert('Your registration has been submitted successfully. Your account will be activated after admin verification. You will receive an email once your application is approved.');
            navigate('/login');
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || 'Unknown error occurred on the server';
            alert(`Registration failed: ${errorMsg}`);
        }
    };

    return (
        <div className="min-h-screen bg-accent flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-4xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Join Kindora</h2>
                    <p className="text-gray-500 mt-2">Select your account type to get started</p>
                </div>

                <div className="flex space-x-4 mb-8 bg-gray-50 p-2 rounded-xl max-w-md mx-auto">
                    <button 
                        className={`flex-1 py-3 rounded-lg font-bold transition-all ${role === 'DONOR' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                        onClick={() => setRole('DONOR')}
                    >
                        Donor
                    </button>
                    <button 
                        className={`flex-1 py-3 rounded-lg font-bold transition-all ${role === 'NGO' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                        onClick={() => setRole('NGO')}
                    >
                        NGO Organization
                    </button>
                </div>

                {role === 'DONOR' ? (
                    <form onSubmit={handleDonorSubmit} className="space-y-4 max-w-md mx-auto" autoComplete="off">
                        <input type="text" name="name" placeholder="Full Name" onChange={handleDonorChange} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" required />
                        <input type="email" name="email" placeholder="Email Address" onChange={handleDonorChange} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" required autoComplete="new-password" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleDonorChange} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none pr-12" required autoComplete="new-password" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            <div className="relative">
                                <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" onChange={handleDonorChange} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none pr-12" required autoComplete="new-password" />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                        <input type="text" name="phone" placeholder="Phone Number" onChange={handleDonorChange} className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" required />
                        
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Your Location</label>
                            <LocationSelector 
                                onLocationSelect={(loc) => setDonorData(prev => ({ 
                                    ...prev, 
                                    address: loc.address, 
                                    fullAddress: loc.fullAddress,
                                    city: loc.city,
                                    district: loc.district,
                                    state: loc.state,
                                    country: loc.country,
                                    pincode: loc.pincode,
                                    latitude: loc.lat, 
                                    longitude: loc.lng 
                                }))} 
                            />
                            {donorData.address && (
                                <div className="mt-4">
                                    <MapLocation 
                                        latitude={donorData.latitude}
                                        longitude={donorData.longitude}
                                        address={donorData.address}
                                        title="Selected Address"
                                        showMap={false}
                                    />
                                </div>
                            )}
                        </div>
                        
                        <button type="submit" className="w-full bg-secondary text-white py-4 rounded-xl hover:bg-primary transition-colors font-bold mt-4">Register as Donor</button>
                    </form>
                ) : (
                    <form onSubmit={handleNgoSubmit} className="space-y-8" autoComplete="off">
                        {/* Organization Details */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Organization Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" name="organizationName" placeholder="NGO Name" onChange={handleNgoChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none" required />
                                <input type="text" name="registrationNumber" placeholder="Registration Number" onChange={handleNgoChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none" required />
                                <select name="registrationType" onChange={handleNgoChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none bg-white">
                                    <option value="Society">Society</option>
                                    <option value="Trust">Trust</option>
                                    <option value="Section 8 Company">Section 8 Company</option>
                                </select>
                                <input type="date" name="registrationDate" onChange={handleNgoChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none text-gray-500" required />
                            </div>
                        </div>

                        {/* Location Details */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Location Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <input type="text" name="city" value={ngoData.city} placeholder="City" onChange={handleNgoChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none" required />
                                <input type="text" name="state" value={ngoData.state} placeholder="State" onChange={handleNgoChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none" required />
                                <input type="text" name="pincode" value={ngoData.pincode} placeholder="Pincode" onChange={handleNgoChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none" required />
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">NGO Location</label>
                                <LocationSelector 
                                    onLocationSelect={(loc) => setNgoData(prev => ({ 
                                        ...prev, 
                                        address: loc.address, 
                                        fullAddress: loc.fullAddress,
                                        city: loc.city || prev.city,
                                        district: loc.district,
                                        state: loc.state || prev.state,
                                        country: loc.country,
                                        pincode: loc.pincode || prev.pincode,
                                        latitude: loc.lat, 
                                        longitude: loc.lng 
                                    }))} 
                                />
                                {ngoData.address && (
                                    <div className="mt-4">
                                        <MapLocation 
                                            latitude={ngoData.latitude}
                                            longitude={ngoData.longitude}
                                            address={ngoData.address}
                                            title="NGO Registered Location"
                                            showMap={false}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contact & Login */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Contact & Login Credentials</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" name="authorizedPersonName" placeholder="Authorized Person Name" onChange={handleNgoChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none" required />
                                <input type="text" name="mobileNumber" placeholder="Mobile Number" onChange={handleNgoChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none" required />
                                <input type="email" name="email" placeholder="Official Email (Username)" onChange={handleNgoChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none md:col-span-2" required autoComplete="new-password" />
                                <div className="relative">
                                    <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" onChange={handleNgoChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none pr-10" required autoComplete="new-password" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                <div className="relative">
                                    <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="Confirm Password" onChange={handleNgoChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none pr-10" required autoComplete="new-password" />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Document Uploads */}
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Document Verification</h3>
                            <p className="text-sm text-gray-500 mb-4">Please upload the required documents in PDF or Image format.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Registration Certificate</label>
                                    <input type="file" onChange={(e) => handleFileUpload(e, 'registrationCertificate')} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">PAN Card</label>
                                    <input type="file" onChange={(e) => handleFileUpload(e, 'panCard')} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Address Proof</label>
                                    <input type="file" onChange={(e) => handleFileUpload(e, 'addressProof')} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Authorized Person ID</label>
                                    <input type="file" onChange={(e) => handleFileUpload(e, 'idProof')} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" required />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl hover:bg-secondary transition-colors font-bold text-lg">Submit Registration</button>
                    </form>
                )}

                <div className="text-center mt-6 text-gray-500">
                    Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
                </div>
            </motion.div>
        </div>
    );
}
