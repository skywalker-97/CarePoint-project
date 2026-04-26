import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../context/DoctorContext';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorProfile = () => {

    const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext);
    const { currency } = useContext(AppContext);
    const [isEdit, setIsEdit] = useState(false);

    const updateUserProfile = async () => {
        try {
            const updateData = {
                name: profileData.name,
                about: profileData.about,
                address: profileData.address,
                fees: profileData.fees,
                available: profileData.available
            }

            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { headers: { dtoken: dToken } });

            if (data.success) {
                toast.success(data.message);
                setIsEdit(false);
                getProfileData();
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (dToken) {
            getProfileData();
        }
    }, [dToken]);

    return profileData && (
        <div className='m-2 md:m-5'>
            <div className='flex flex-col xl:flex-row gap-6'>
                <div className="w-full xl:max-w-72">
                    <img className='bg-primary/5 w-full rounded-2xl border border-gray-100 shadow-sm' src={profileData.image} alt="" />
                </div>

                <div className='flex-1 border border-gray-100 rounded-2xl p-6 md:p-8 bg-white shadow-sm'>
                    {/* ----- Doc Info : name, degree, experience ----- */}
                    <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50 pb-6'>
                        <div>
                            <div className='text-3xl font-bold text-gray-800 mb-2'>
                                {isEdit ? <input className='border border-gray-200 rounded-lg bg-gray-50 px-3 py-1 text-2xl w-full' type="text" onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))} value={profileData.name} /> : profileData.name}
                            </div>
                            <div className='flex items-center gap-3 text-gray-600'>
                                <p className="font-medium">{profileData.degree} - {profileData.speciality}</p>
                                <span className='py-1 px-3 border border-gray-100 text-[10px] font-bold rounded-full bg-gray-50 uppercase tracking-wider'>{profileData.experience}</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl border border-green-100'>
                            <input className="w-4 h-4 text-primary cursor-pointer" onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))} checked={profileData.available} type="checkbox" id="available" />
                            <label className="text-sm font-bold text-green-700 cursor-pointer" htmlFor="available">Available for Booking</label>
                        </div>
                    </div>

                    {/* ----- Doc About ----- */}
                    <div className="py-6 border-b border-gray-50">
                        <p className='flex items-center gap-1.5 text-sm font-bold text-gray-800 uppercase tracking-widest mb-3'>About</p>
                        <div className='text-gray-600 leading-relaxed'>
                            {isEdit ? <textarea className='w-full border border-gray-200 rounded-xl bg-gray-50 p-4 text-sm' rows={6} onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))} value={profileData.about}></textarea> : <p className="text-sm md:text-base">{profileData.about}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                        <div>
                            <p className='text-sm font-bold text-gray-800 uppercase tracking-widest mb-3'>Appointment Fee</p>
                            <p className='text-2xl font-bold text-primary'>
                                {currency} {isEdit ? <input className="border border-gray-200 rounded-lg bg-gray-50 px-2 py-1 w-24 ml-2" type="number" onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} value={profileData.fees} /> : profileData.fees}
                            </p>
                        </div>

                        <div>
                            <p className='text-sm font-bold text-gray-800 uppercase tracking-widest mb-3'>Address</p>
                            <div className='text-sm text-gray-600 space-y-1'>
                                {isEdit 
                                    ? <div className="space-y-2">
                                        <input className="w-full border border-gray-200 rounded-lg bg-gray-50 px-3 py-1.5" type="text" onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={profileData.address.line1} />
                                        <input className="w-full border border-gray-200 rounded-lg bg-gray-50 px-3 py-1.5" type="text" onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={profileData.address.line2} />
                                      </div>
                                    : <p>{profileData.address.line1}<br />{profileData.address.line2}</p>
                                }
                            </div>
                        </div>
                    </div>

                    <div className='pt-6 border-t border-gray-50'>
                        {
                            isEdit
                                ? <button onClick={updateUserProfile} className='px-10 py-3 bg-primary text-white text-sm font-bold rounded-full hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200 active:scale-95'>Save Profile Changes</button>
                                : <button onClick={() => setIsEdit(true)} className='px-10 py-3 border-2 border-primary text-primary text-sm font-bold rounded-full hover:bg-primary hover:text-white transition-all active:scale-95'>Edit Profile</button>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;
