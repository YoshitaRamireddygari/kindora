import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import { motion } from 'framer-motion';
import { FaTrash, FaUserShield, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import MapLocation from '../common/MapLocation';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedRow, setExpandedRow] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await adminService.getUsers();
            setUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await adminService.deleteUser(id);
            setUsers(users.filter(u => u.id !== id));
        } catch (error) {
            console.error("Failed to delete user", error);
            alert("Error deleting user");
        }
    };

    if (loading) return <div className="p-8">Loading users...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-7xl mx-auto">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
                    <p className="text-gray-500 mt-1">Manage all registered users on the platform.</p>
                </div>
            </div>

            <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                                <th className="p-4 font-semibold pl-6">Name</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Role</th>
                                <th className="p-4 font-semibold">Donations</th>
                                <th className="p-4 font-semibold">Joined</th>
                                <th className="p-4 font-semibold text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <React.Fragment key={user.id}>
                                <tr className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 pl-6 font-medium text-gray-800 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                            {user.name?.charAt(0).toUpperCase() || <FaUserShield />}
                                        </div>
                                        {user.name}
                                    </td>
                                    <td className="p-4 text-gray-600">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 
                                            user.role === 'NGO' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className="font-bold text-gray-700">{user.donationsCount || 0}</span>
                                    </td>
                                    <td className="p-4 text-gray-500 text-sm">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="p-4 pr-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => setExpandedRow(expandedRow === user.id ? null : user.id)}
                                                className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                                title="View Location"
                                            >
                                                {expandedRow === user.id ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user.id)}
                                                className="w-8 h-8 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                                                title="Delete User"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {expandedRow === user.id && (
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <td colSpan="6" className="p-6">
                                            <MapLocation 
                                                latitude={user.latitude}
                                                longitude={user.longitude}
                                                address={user.address}
                                                title="User Registered Location"
                                                height="200px"
                                                isAdmin={true}
                                            />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
