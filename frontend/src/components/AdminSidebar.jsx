import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { assets } from '../assets/assets_admin/assets';
import { LayoutDashboard, Calendar, UserPlus, Users } from 'lucide-react';

const AdminSidebar = () => {
    const { aToken } = useContext(AdminContext);

    return (
        <div className='min-h-screen bg-white border-r shadow-sm'>
            {aToken && (
                <ul className='text-[#515151] mt-5 space-y-1'>
                    <NavLink 
                        className={({ isActive }) => `flex items-center gap-3 py-4 px-6 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-blue-50 border-r-4 border-primary text-primary' : 'hover:bg-gray-50'}`} 
                        to={'/admin-dashboard'}
                    >
                        <LayoutDashboard size={20} />
                        <p className='hidden md:block font-bold text-sm'>Dashboard</p>
                    </NavLink>

                    <NavLink 
                        className={({ isActive }) => `flex items-center gap-3 py-4 px-6 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-blue-50 border-r-4 border-primary text-primary' : 'hover:bg-gray-50'}`} 
                        to={'/all-appointments'}
                    >
                        <Calendar size={20} />
                        <p className='hidden md:block font-bold text-sm'>Appointments</p>
                    </NavLink>

                    <NavLink 
                        className={({ isActive }) => `flex items-center gap-3 py-4 px-6 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-blue-50 border-r-4 border-primary text-primary' : 'hover:bg-gray-50'}`} 
                        to={'/add-doctor'}
                    >
                        <UserPlus size={20} />
                        <p className='hidden md:block font-bold text-sm'>Add Doctor</p>
                    </NavLink>
                    <NavLink 
                        className={({ isActive }) => `flex items-center gap-3 py-4 px-6 md:px-9 md:min-w-72 cursor-pointer transition-all ${isActive ? 'bg-blue-50 border-r-4 border-primary text-primary' : 'hover:bg-gray-50'}`} 
                        to={'/doctor-list'}
                    >
                        <Users size={20} />
                        <p className='hidden md:block font-bold text-sm'>Doctors List</p>
                    </NavLink>
                </ul>
            )}
        </div>
    );
};

export default AdminSidebar;
