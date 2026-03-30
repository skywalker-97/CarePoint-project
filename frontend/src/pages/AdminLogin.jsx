import React, { useContext, useState } from 'react';
import { AdminContext } from '../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets_admin/assets';

const AdminLogin = () => {
    const [email, setEmail] = useState('admin@admin.com');
    const [password, setPassword] = useState('adminpassword');

    const { setAToken, backendUrl } = useContext(AdminContext);
    const navigate = useNavigate();

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password });
            if (data.success) {
                localStorage.setItem('aToken', data.token);
                setAToken(data.token);
                toast.success("Admin Logged In successfully");
                navigate('/admin-dashboard');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
                <p className='text-2xl font-semibold m-auto'><span className='text-primary'>Admin</span> Login</p>
                <div className='w-full'>
                    <p>Email</p>
                    <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                </div>
                <div className='w-full'>
                    <p>Password</p>
                    <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                </div>
                <button type='submit' className='bg-primary text-white w-full py-2 rounded-md text-base mt-2'>Login</button>
                <p className='mt-2 text-xs'>Patient login? <span onClick={() => navigate('/login')} className='text-primary underline cursor-pointer'>Click here</span></p>
            </div>
        </form>
    );
};

export default AdminLogin;
