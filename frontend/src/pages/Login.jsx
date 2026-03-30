import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { DoctorContext } from '../context/DoctorContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
    const { backendUrl, token, setToken } = useContext(AppContext);
    const { dToken, setDToken } = useContext(DoctorContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [state, setState] = useState('Sign Up');
    const [loginMode, setLoginMode] = useState('Patient'); // 'Patient' or 'Doctor'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        if (location.state && location.state.mode) {
            setState(location.state.mode);
        }
    }, [location]);

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            if (state === 'Sign Up') {
                const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password });
                if (data.success) {
                    localStorage.setItem('token', data.token);
                    setToken(data.token);
                    toast.success("Account successfully created!");
                } else {
                    toast.error(data.message);
                }
            } else {
                if (loginMode === 'Patient') {
                    const { data } = await axios.post(backendUrl + '/api/user/login', { email, password });
                    if (data.success) {
                        localStorage.setItem('token', data.token);
                        setToken(data.token);
                        toast.success("Logged in successfully!");
                    } else {
                        toast.error(data.message);
                        console.error("Login failed:", data.message);
                    }
                } else {
                    const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password });
                    if (data.success) {
                        localStorage.setItem('dToken', data.token);
                        setDToken(data.token);
                        toast.success("Doctor logged in successfully!");
                    } else {
                        toast.error(data.message);
                        console.error("Doctor login failed:", data.message);
                    }
                }
            }
        } catch (error) {
            toast.error("Network Error: " + error.message);
            console.error("Axios Submission Error:", error);
        }
    };

    useEffect(() => {
        if (token || dToken) {
            navigate('/');
        }
    }, [token, dToken]);

    return (
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
                
                <div className='flex gap-4 m-auto mb-4 border-b pb-2'>
                    <p onClick={() => { setLoginMode('Patient') }} className={`cursor-pointer pb-1 ${loginMode === 'Patient' ? 'text-primary border-b-2 border-primary font-semibold' : ''}`}>Patient</p>
                    <p onClick={() => { setLoginMode('Doctor'); setState('Login') }} className={`cursor-pointer pb-1 ${loginMode === 'Doctor' ? 'text-primary border-b-2 border-primary font-semibold' : ''}`}>Doctor</p>
                </div>

                <p className='text-2xl font-semibold'>{loginMode} {state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
                <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to access your dashboard</p>

                {state === 'Sign Up' && (
                    <div className='w-full'>
                        <p>Full Name</p>
                        <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="text" onChange={(e) => setName(e.target.value)} value={name} required={state === 'Sign Up'} />
                    </div>
                )}
                
                <div className='w-full'>
                    <p>Email</p>
                    <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                </div>
                
                <div className='w-full'>
                    <p>Password</p>
                    <input className='border border-zinc-300 rounded w-full p-2 mt-1' type="password" onChange={(e) => setPassword(e.target.value)} value={password} required />
                    <p className='text-xs text-gray-400 mt-1'>Password must be at least 8 characters</p>
                </div>
                
                <button type='submit' className='bg-primary text-white w-full py-2 rounded-md text-base'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</button>

                {loginMode === 'Patient' && (
                    state === 'Sign Up'
                        ? <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login here</span></p>
                        : <p>Create a new account? <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>Click here</span></p>
                )}
                
                <p className='mt-2 text-xs'>Admin login? <span onClick={() => navigate('/admin-login')} className='text-primary underline cursor-pointer'>Click here</span></p>
            </div>
        </form>
    );
};

export default Login;
