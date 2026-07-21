import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await authService.login({ email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (error) {
            alert('Login failed! Use john@example.com / password123');
        }
    };

    return (
        <div className="flex h-screen bg-accent items-center justify-center">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-2xl shadow-xl w-96"
            >
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-primary p-4 rounded-full mb-4 shadow-lg">
                        <FaHeart className="text-white text-3xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary">Kindora</h2>
                    <p className="text-gray-500 text-sm">Kind Hearts. Better Tomorrow.</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="email" 
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input 
                            type="password" 
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-secondary transition-colors font-medium"
                    >
                        Login
                    </button>

                    <div className="text-center mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <button 
                                type="button" 
                                onClick={() => navigate('/register')}
                                className="text-primary font-semibold hover:underline"
                            >
                                Register first
                            </button>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
