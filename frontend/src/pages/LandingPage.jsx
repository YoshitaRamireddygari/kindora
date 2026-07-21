import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaShieldAlt } from 'react-icons/fa';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-accent flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-secondary rounded-full opacity-20 filter blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-primary rounded-full opacity-20 filter blur-3xl"></div>

            <motion.div 
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 flex flex-col items-center text-center px-4"
            >
                <div className="bg-primary p-6 rounded-full mb-8 shadow-2xl">
                    <FaHeart className="text-white text-6xl" />
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold text-primary mb-4 tracking-tight">
                    Welcome to Kindora
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl">
                    Kind Hearts. Better Tomorrow. Join our community to make a difference.
                </p>

                <div className="flex flex-col sm:flex-row gap-6">
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/login')}
                        className="flex items-center justify-center space-x-3 bg-primary text-white px-8 py-4 rounded-full text-xl font-bold shadow-xl hover:bg-secondary transition-colors"
                    >
                        <FaHeart />
                        <span>Donate Now</span>
                    </motion.button>

                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/admin/login')}
                        className="flex items-center justify-center space-x-3 bg-white text-primary border-2 border-primary px-8 py-4 rounded-full text-xl font-bold shadow-xl hover:bg-gray-50 transition-colors"
                    >
                        <FaShieldAlt />
                        <span>Admin Portal</span>
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
