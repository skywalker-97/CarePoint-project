import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyProfile = () => {
    const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState(userData || {
        name: "User Name",
        email: "user@example.com",
        phone: "0000000000",
        address: { line1: "", line2: "" },
        gender: "Not Selected",
        dob: "2000-01-01"
    });

    // Populate formData when userData changes (e.g., after loading)
    React.useEffect(() => {
        if (userData) setFormData(userData);
    }, [userData]);

    const updateUserProfileData = async () => {
        try {
            const updateData = {
                userId: formData._id,
                name: formData.name,
                phone: formData.phone,
                address: JSON.stringify(formData.address),
                gender: formData.gender,
                dob: formData.dob
            };

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', updateData, { headers: { token } });

            if (data.success) {
                toast.success(data.message);
                await loadUserProfileData();
                setIsEdit(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    if (!userData) {
        return <div className='py-10 text-center text-gray-500'>Loading Profile...</div>;
    }

    return (
        <div className='max-w-lg flex flex-col gap-2 text-sm pt-5'>
            <div className='w-36 h-36 bg-gray-200 rounded-full flex justify-center items-center text-4xl text-primary font-bold'>
                {formData.name.charAt(0)}
            </div>
            
            {isEdit
                ? <input className='bg-gray-50 text-3xl font-medium max-w-60 px-2 py-1 mt-4 rounded border outline-none' type="text" onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} value={formData.name} />
                : <p className='text-3xl font-medium text-neutral-800 mt-4'>{formData.name}</p>
            }

            <hr className='bg-zinc-400 h-[1px] border-none my-2' />
            
            <div>
                <p className='text-neutral-500 underline mt-3 pb-1'>CONTACT INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
                    <p className='font-medium'>Email id:</p>
                    <p className='text-blue-500'>{formData.email}</p>

                    <p className='font-medium'>Phone:</p>
                    {isEdit
                        ? <input className='bg-gray-50 px-2 py-1 rounded border outline-none max-w-52' type="text" onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} value={formData.phone} />
                        : <p className='text-blue-400'>{formData.phone}</p>
                    }

                    <p className='font-medium'>Address:</p>
                    {isEdit
                        ? <p>
                            <input className='bg-gray-50 mt-1 px-2 py-1 rounded border outline-none min-w-44 block' type="text" onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={formData.address.line1} />
                            <br />
                            <input className='bg-gray-50 mt-1 px-2 py-1 rounded border outline-none min-w-44 block' type="text" onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={formData.address.line2} />
                        </p>
                        : <p className='text-gray-500'>{formData.address.line1}<br />{formData.address.line2}</p>
                    }
                </div>
            </div>
            
            <div>
                <p className='text-neutral-500 underline mt-5 pb-1'>BASIC INFORMATION</p>
                <div className='grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700'>
                    <p className='font-medium'>Gender:</p>
                    {isEdit
                        ? <select className='max-w-28 bg-gray-50 px-2 py-1 border rounded' onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))} value={formData.gender}>
                            <option value="Not Selected">Not Selected</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        : <p className='text-gray-500'>{formData.gender}</p>
                    }
                    <p className='font-medium'>Birthday:</p>
                    {isEdit
                        ? <input className='max-w-36 bg-gray-50 px-2 py-1 border rounded' type="date" onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))} value={formData.dob} />
                        : <p className='text-gray-500'>{formData.dob}</p>
                    }
                </div>
            </div>

            <div className='mt-8'>
                {isEdit
                    ? <button onClick={updateUserProfileData} className='border border-primary px-8 py-2 rounded-full text-white bg-primary hover:text-white transition-all'>Save Information</button>
                    : <button onClick={() => setIsEdit(true)} className='border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all'>Edit Profile</button>
                }
            </div>
        </div>
    );
};

export default MyProfile;
