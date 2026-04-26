import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../context/AdminContext';
import { Users, Filter, ShieldCheck, CheckCircle, Clock } from 'lucide-react';

const DoctorsList = () => {
    const { doctors, getAllDoctors, aToken, changeAvailability, changeVerification } = useContext(AdminContext);

    useEffect(() => {
        if (aToken) {
            getAllDoctors();
        }
    }, [aToken]);

    return (
        <div className='m-2 md:m-5'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
                <div>
                    <h1 className='text-2xl font-bold text-gray-800 flex items-center gap-2'>
                        <Users className="text-primary" size={28} />
                        Doctor Management
                    </h1>
                    <p className='text-sm text-gray-500 font-medium mt-1'>View and manage all registered physician profiles.</p>
                </div>
                <div className='flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm'>
                    <Filter size={18} className="text-gray-400" />
                    <span className='text-sm font-bold text-gray-700'>{doctors.length} Total Doctors</span>
                </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                {doctors.map((item, index) => (
                    <div key={index} className='group bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300'>
                        <div className='relative h-56 overflow-hidden bg-gray-50'>
                            {item.image || item.fallbackImage ? (
                                <img 
                                    className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110' 
                                    src={item.image || item.fallbackImage} 
                                    alt={item.name} 
                                    onError={(e) => {
                                        if (item.fallbackImage && e.currentTarget.src !== item.fallbackImage) {
                                            e.currentTarget.src = item.fallbackImage;
                                        } else {
                                            e.currentTarget.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                                        }
                                    }}
                                />
                            ) : (
                                <div className='w-full h-full flex items-center justify-center bg-blue-50 text-primary font-bold text-4xl uppercase'>
                                    {item.name.charAt(0)}
                                </div>
                            )}
                            <div className='absolute top-4 left-4 flex flex-col gap-2'>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 backdrop-blur-md shadow-sm ${item.available ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full bg-white ${item.available ? 'animate-pulse' : ''}`} />
                                    {item.available ? 'Active' : 'Private'}
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 backdrop-blur-md shadow-sm ${item.isVerified ? 'bg-blue-500/90 text-white' : 'bg-amber-500/90 text-white'}`}>
                                    <ShieldCheck size={10} />
                                    {item.isVerified ? 'Verified' : 'Pending'}
                                </div>
                            </div>
                        </div>

                        <div className='p-6'>
                            <div className='mb-4'>
                                <p className='text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1'>{item.speciality}</p>
                                <h3 className='text-xl font-bold text-gray-800 line-clamp-1'>
                                    {item.name.startsWith('Dr.') ? item.name : `Dr. ${item.name}`}
                                </h3>
                                <p className='text-xs text-gray-400 font-medium mt-1'>{item.degree} - {item.experience} Exp</p>
                            </div>

                            <div className='flex items-center justify-between pt-4 border-t border-gray-50'>
                                <div className='flex items-center gap-4'>
                                    <div className='flex items-center gap-2'>
                                        <input 
                                            onChange={() => changeAvailability(item._id)} 
                                            type="checkbox" 
                                            checked={item.available} 
                                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                        />
                                        <span className='text-[10px] font-black text-gray-500 uppercase tracking-widest'>Active</span>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            const { changeVerification, getDashData } = useContext(AdminContext);
                                            // Since changeVerification is already in context, we use it directly
                                        }}
                                        onClickCapture={() => {
                                            // Verification logic is handled by the context function
                                            import('../context/AdminContext').then(() => {
                                                 // Actually we already have it in the component scope
                                            })
                                        }}
                                        // Wait, changeVerification IS already in the scope of the component!
                                        onClick={() => {
                                            // The changeVerification function is already destructured at the top
                                            changeVerification(item._id).then(() => getAllDoctors());
                                        }}
                                        className={`p-2 rounded-lg transition-all ${item.isVerified ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`}
                                        title={item.isVerified ? "Revoke Verification" : "Approve Physician"}
                                    >
                                        <ShieldCheck size={16} />
                                    </button>
                                </div>
                                <div className='text-primary font-black text-lg'>
                                    ${item.fees}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {doctors.length === 0 && (
                <div className='bg-white rounded-3xl border border-dashed border-gray-200 p-20 flex flex-col items-center justify-center text-center'>
                    <div className='w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4'>
                        <Users className='text-gray-300' size={40} />
                    </div>
                    <h3 className='text-xl font-bold text-gray-800 mb-2'>No Doctors Found</h3>
                    <p className='text-gray-400 max-w-xs'>It looks like there are no doctors registered yet. Try adding one from the "Add Doctor" panel.</p>
                </div>
            )}
        </div>
    );
};

export default DoctorsList;
