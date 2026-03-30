import React, { useContext, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminContext } from '../context/AdminContext';
import { assets } from '../assets/assets_admin/assets';
import { doctors as initialDoctors } from '../assets/assets_frontend/assets';

const AddDoctor = () => {
    const { backendUrl, aToken } = useContext(AdminContext);

    const [docImgKey, setDocImgKey] = useState(''); // Stores stable key like doc1/doc2

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

            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', doctorData, { headers: { aToken } });

            if (data.success) {
                toast.success(data.message);
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
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>
            <p className='mb-3 text-lg font-medium'>Add Doctor</p>
            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl'>
                
                <div className='mb-8'>
                    <p className='mb-2 text-gray-500'>Select Doctor Profile Picture (from Assets)</p>
                    <div className='flex flex-wrap gap-3 max-h-40 overflow-y-auto p-2 border rounded bg-gray-50'>
                        {initialDoctors.map((doc, index) => (
                            <img 
                                key={index}
                                onClick={() => setDocImgKey(doc._id)}
                                className={`w-14 h-14 rounded-full cursor-pointer object-cover border-2 transition-all ${docImgKey === doc._id ? 'border-primary scale-110' : 'border-transparent hover:border-gray-300'}`}
                                src={doc.image} 
                                alt={`Doctor ${index + 1}`} 
                            />
                        ))}
                    </div>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor name</p>
                            <input onChange={(e) => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Name' required />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Email</p>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2' type="email" placeholder='Email' required />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Doctor Password</p>
                            <input onChange={(e) => setPassword(e.target.value)} value={password} className='border rounded px-3 py-2' type="password" placeholder='Password' required />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Experience</p>
                            <select onChange={(e) => setExperience(e.target.value)} value={experience} className='border rounded px-3 py-2'>
                                {[...Array(10)].map((_, i) => (
                                    <option key={i} value={`${i + 1} Year`}>{i + 1} Year</option>
                                ))}
                            </select>
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Fees</p>
                            <input onChange={(e) => setFees(e.target.value)} value={fees} className='border rounded px-3 py-2' type="number" placeholder='fees' required />
                        </div>
                    </div>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Speciality</p>
                            <select onChange={(e) => setSpeciality(e.target.value)} value={speciality} className='border rounded px-3 py-2'>
                                <option value="General physician">General physician</option>
                                <option value="Gynecologist">Gynecologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Pediatricians">Pediatricians</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Gastroenterologist">Gastroenterologist</option>
                            </select>
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Education</p>
                            <input onChange={(e) => setDegree(e.target.value)} value={degree} className='border rounded px-3 py-2' type="text" placeholder='Education' required />
                        </div>
                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Address</p>
                            <input onChange={(e) => setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2' type="text" placeholder='address 1' required />
                            <input onChange={(e) => setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2' type="text" placeholder='address 2' required />
                        </div>
                    </div>
                </div>

                <div>
                    <p className='mt-4 mb-2'>About Doctor</p>
                    <textarea onChange={(e) => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' placeholder='write about doctor' rows={5} required />
                </div>
                
                <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Add doctor</button>
            </div>
        </form>
    );
};

export default AddDoctor;
