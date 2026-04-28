import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AdminContext } from './context/AdminContext';
import { AppContext } from './context/AppContext';
import { DoctorContext } from './context/DoctorContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminSidebar from './components/AdminSidebar';
import DoctorSidebar from './components/DoctorSidebar';
import NotificationBell from './components/NotificationBell';
import { assets as adminAssets } from './assets/assets_admin/assets';

// Pages
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Login from './pages/Login';
import About from './pages/About';
import Contact from './pages/Contact';
import MyProfile from './pages/MyProfile';
import MyAppointments from './pages/MyAppointments';
import Appointment from './pages/Appointment';
import AdminLogin from './pages/AdminLogin';
import AdminAppointments from './pages/AdminAppointments';
import AddDoctor from './pages/AddDoctor';
import DoctorProfile from './pages/DoctorProfile';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorAppointments from './pages/DoctorAppointments';
import AdminDashboard from './pages/AdminDashboard';
import DoctorsList from './pages/DoctorsList';

const App = () => {

  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  if (aToken || dToken) {
     return (
        <div className='min-h-screen bg-[#f8f9ff]'>
          <ToastContainer position="top-right" autoClose={3000} />
          
          {/* --- Premium Admin/Doctor Top Bar --- */}
          <nav className='sticky top-0 z-[1000] flex items-center justify-between px-6 sm:px-12 py-4 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm'>
            <div className='flex items-center gap-4'>
              <div className='group cursor-pointer flex items-center gap-2' onClick={() => window.location.href = '/'}>
                <img className='w-36 md:w-44 transition-transform group-hover:scale-105' src={adminAssets.admin_logo} alt="Logo" />
                <div className='h-8 w-[1px] bg-gray-200 mx-2 hidden sm:block' />
                <span className='hidden sm:inline-flex items-center px-3 py-1 bg-blue-50 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100'>
                  {aToken ? 'Admin Control' : 'Doctor Portal'}
                </span>
              </div>
            </div>

            <div className='flex items-center gap-6'>
              {/* Live Activity Feed */}
              <NotificationBell 
                token={aToken || dToken} 
                type={aToken ? 'admin' : 'doctor'} 
              />
              
              <div className='hidden md:flex flex-col items-end'>
                <p className='text-xs font-black text-gray-400 uppercase tracking-tighter'>Logged in as</p>
                <p className='text-sm font-bold text-gray-700'>{aToken ? 'Administrator' : 'Medical Professional'}</p>
              </div>
              <button 
                onClick={() => { 
                    localStorage.removeItem('aToken'); 
                    localStorage.removeItem('dToken'); 
                    window.location.href='/';
                }} 
                className='flex items-center gap-2 bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-8 py-3 rounded-2xl hover:bg-primary shadow-lg shadow-gray-200 hover:shadow-blue-500/20 active:scale-95 transition-all'
              >
                Logout
              </button>
            </div>
          </nav>

          <div className='flex items-start'>
            {aToken ? <AdminSidebar /> : <DoctorSidebar />}
            <main className='flex-1 min-h-[calc(100vh-80px)] overflow-y-auto'>
              <Routes>
                 {/* Admin Routes */}
                 <Route path='/' element={aToken ? <AdminDashboard /> : <DoctorDashboard />} />
                 <Route path='/admin-dashboard' element={<AdminDashboard />} />
                 <Route path='/all-appointments' element={<AdminAppointments />} />
                 <Route path='/add-doctor' element={<AddDoctor />} />
                 <Route path='/doctor-list' element={<DoctorsList />} />

                 {/* Doctor Routes */}
                 <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
                 <Route path='/doctor-appointments' element={<DoctorAppointments />} />
                 <Route path='/doctor-profile' element={<DoctorProfile />} />
              </Routes>
            </main>
          </div>
        </div>
     );
  }

  return (
    <div className='pt-16 md:pt-20 min-h-screen'>
      <ToastContainer />
      <Navbar />
      <div className='w-full'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/doctors' element={<Doctors />} />
          <Route path='/doctors/:speciality' element={<Doctors />} />
          <Route path='/login' element={<Login />} />
          <Route path='/admin-login' element={<AdminLogin />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/my-profile' element={<MyProfile />} />
          <Route path='/my-appointments' element={<MyAppointments />} />
          <Route path='/appointment/:docId' element={<Appointment />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App;
