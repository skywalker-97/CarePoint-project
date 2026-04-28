import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminContext } from '../context/AdminContext';
import { assets } from '../assets/assets_admin/assets';
import { doctors as initialDoctors } from '../assets/assets_frontend/assets';
import { UserPlus, Camera } from 'lucide-react';

const AddDoctor = () => {
    const { backendUrl, aToken, getAllDoctors, getDashData } = useContext(AdminContext);

    const [docImgKey, setDocImgKey] = useState('doc1'); // Default to doc1

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [experience, setExperience] = useState('1 Year');
    const [fees, setFees] = useState('');
    const [about, setAbout] = useState('');
    const [speciality, setSpeciality] = useState('General physician');
    const [degree, setDegree] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            const doctorData = {
                image: docImgKey,
                name,
                email,
                password,
                experience,
                fees: Number(fees),
                about,
                speciality,
                degree,
                address: JSON.stringify({ line1: address1, line2: address2 })
            };

            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', doctorData, { headers: { atoken: aToken } });

            if (data.success) {
                toast.success(data.message);
                if (getAllDoctors) getAllDoctors();
                if (getDashData) getDashData();
                setName('');
                setEmail('');
                setPassword('');
                setAddress1('');
                setAddress2('');
                setDegree('');
                setAbout('');
                setFees('');
                setDocImgKey('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className='m-2 md:m-5 w-full max-w-5xl'>
            <div className='flex flex-col gap-2 mb-8'>
                <h1 className='text-2xl font-bold text-gray-800 flex items-center gap-2'>
                    <UserPlus className="text-primary" size={28} />
                    Add New Doctor
                </h1>
                <p className='text-sm text-gray-500 font-medium'>Create a new professional profile for the CarePoint network.</p>
            </div>

            <div className='bg-white p-6 md:p-10 rounded-[32px] border border-gray-100 shadow-sm w-full'>
                
                {/* Image Selection Section */}
                <div className='mb-10'>
                    <div className="flex items-center gap-2 mb-4">
                        <Camera size={18} className="text-primary" />
                        <p className='font-bold text-gray-700'>Select Profile Avatar</p>
                    </div>
                    <div className='flex flex-wrap gap-4 p-5 border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50'>
                        {(initialDoctors || []).map((doc, index) => (
                            <img 
                                key={index}
                                onClick={() => setDocImgKey(doc._id)}
                                className={`w-16 h-16 rounded-2xl cursor-pointer object-cover border-4 transition-all duration-300 shadow-sm ${docImgKey === doc._id ? 'border-primary ring-4 ring-blue-50 scale-110 shadow-blue-200' : 'border-white hover:border-gray-200 hover:scale-105'}`}
                                src={doc.image || assets.upload_area} 
                                alt={`Doctor ${index + 1}`} 
                            />
                        ))}
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-gray-600'>
                    {/* Left Column */}
                    <div className='space-y-6'>
                        <div className='flex flex-col gap-2'>
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                            <input onChange={(e) => setName(e.target.value)} value={name} className='bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all' type="text" placeholder='Dr. Jonathan Doe' required />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} className='bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all' type="email" placeholder='doctor@carepoint.com' required />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Security Password</label>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} className='bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all' type="password" placeholder='••••••••' required />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Experience Level</label>
                            <select onChange={(e) => setExperience(e.target.value)} value={experience} className='bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer'>
                                {[...Array(10)].map((_, i) => (
                                    <option key={i} value={`${i + 1} Year`}>{i + 1} Year{i > 0 ? 's' : ''}</option>
                                ))}
                                <option value="10+ Years">10+ Years</option>
                            </select>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className='space-y-6'>
                        <div className='flex flex-col gap-2'>
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Speciality Field</label>
                            <select onChange={(e) => setSpeciality(e.target.value)} value={speciality} className='bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer'>
                                <option value="General physician">General physician</option>
                                <option value="Gynecologist">Gynecologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Pediatricians">Pediatricians</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Gastroenterologist">Gastroenterologist</option>
                            </select>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Educational Degree</label>
                            <input onChange={(e) => setDegree(e.target.value)} value={degree} className='bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all' type="text" placeholder='MD - Cardiology' required />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Consultation Fees</label>
                            <div className='relative'>
                                <span className='absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold'>$</span>
                                <input onChange={(e) => setFees(e.target.value)} value={fees} className='w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-10 pr-5 py-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all' type="number" placeholder='50' required />
                            </div>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Practice Location</label>
                            <div className='space-y-3'>
                                <input onChange={(e) => setAddress1(e.target.value)} value={address1} className='w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm' type="text" placeholder='Clinic Address Line 1' required />
                                <input onChange={(e) => setAddress2(e.target.value)} value={address2} className='w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm' type="text" placeholder='City, State, Zip' required />
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mt-10'>
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Professional Biography</label>
                    <textarea onChange={(e) => setAbout(e.target.value)} value={about} className='w-full bg-gray-50/50 border border-gray-100 rounded-3xl px-6 py-4 mt-2 focus:bg-white focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm leading-relaxed' placeholder='Detail the doctor professional background, clinical interests, and patient care philosophy...' rows={6} required />
                </div>
                
                <div className='mt-12 flex justify-end'>
                    <button type='submit' className='w-full md:w-auto bg-primary text-white px-16 py-4 rounded-2xl font-bold hover:bg-blue-600 shadow-xl shadow-blue-500/20 active:scale-95 transition-all'>
                        Add to Network
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AddDoctor;
