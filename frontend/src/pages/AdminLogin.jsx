import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { navState } from '../utils/navigation';
import { authService } from '../services/api';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (navState.isFirstLoad) {
            navigate('/');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Hardcoded admin check
        if (email === 'yoshita.ramireddygari@gmail.com' && password === 'Yoshita@1234') {
            const adminUser = {
                name: 'Yoshita (Admin)',
                email: email,
                role: 'ADMIN',
                createdAt: '2026-07-21T21:54:45+05:30'
            };
            localStorage.setItem('token', 'mock_admin_token');
            localStorage.setItem('user', JSON.stringify(adminUser));
            navigate('/dashboard');
        } else {
            alert('Invalid Admin Credentials!');
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 items-center justify-center relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full opacity-30 filter blur-3xl"></div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-2xl shadow-2xl w-96 z-10"
            >
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-gray-900 p-4 rounded-full mb-4 shadow-lg border-2 border-primary">
                        <FaShieldAlt className="text-primary text-3xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Admin Portal</h2>
                    <p className="text-gray-500 text-sm">Secure Access Only</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
                    {/* Hack to trick aggressive browser autofill */}
                    <input type="email" style={{display: 'none'}} name="fakeemail" />
                    <input type="password" style={{display: 'none'}} name="fakepassword" />

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Admin Email</label>
                        <input 
                            type="email" 
                            autoComplete="new-password"
                            placeholder="Enter admin email"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                placeholder="Enter admin password"
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)} 
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-black transition-colors font-medium border border-transparent hover:border-primary"
                    >
                        Access Dashboard
                    </button>
                    
                    <div className="text-center mt-4">
                        <button 
                            type="button"
                            onClick={() => navigate('/')}
                            className="text-sm text-gray-500 hover:text-primary transition-colors"
                        >
                            ← Back to Home
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
