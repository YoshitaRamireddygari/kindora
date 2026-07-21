import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, ngoService } from '../services/api';
import { FaUserPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Register() {
    const [role, setRole] = useState('DONOR');
    const [formData, setFormData] = useState({
        name: '', // Used for DONOR name, or NGO organizationName
        email: '',
        password: '',
        phone: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            if (role === 'DONOR') {
                await authService.register({ ...formData, role: 'DONOR' });
                alert('Registration successful! Please login.');
                navigate('/login');
            } else {
                // NGO
                await ngoService.register({
                    organizationName: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    // Note: password is not standard in MVP NGO entity, but we send it anyway or handle it in backend
                });
                alert('NGO Registration submitted! Waiting for Admin verification.');
                navigate('/login');
            }
        } catch (error) {
            alert('Registration failed! Email might already be in use.');
        }
    };

    return (
        <div className="flex h-screen bg-accent items-center justify-center">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-2xl shadow-xl w-96 max-h-screen overflow-y-auto"
            >
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-primary p-4 rounded-full mb-4 shadow-lg">
                        <FaUserPlus className="text-white text-3xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary">Create Account</h2>
                </div>
                
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">I am registering as a...</label>
                        <select 
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="DONOR">Donor (Individual/Corporate)</option>
                            <option value="NGO">Non-Governmental Organization</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {role === 'DONOR' ? 'Full Name' : 'Organization Name'}
                        </label>
                        <input 
                            type="text" 
                            name="name"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input 
                            type="email" 
                            name="email"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input 
                            type="text" 
                            name="phone"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {role === 'DONOR' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input 
                                type="password" 
                                name="password"
                                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    <button 
                        type="submit"
                        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition-colors font-medium mt-4"
                    >
                        Register
                    </button>

                    <div className="text-center mt-4 pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <button 
                                type="button" 
                                onClick={() => navigate('/login')}
                                className="text-primary font-semibold hover:underline"
                            >
                                Login here
                            </button>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
