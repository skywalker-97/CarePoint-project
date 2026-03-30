import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AdminContext } from './context/AdminContext';
import { AppContext } from './context/AppContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminSidebar from './components/AdminSidebar';
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

const App = () => {

  const { aToken } = useContext(AdminContext);

  if (aToken) {
     return (
        <div className='bg-[#F8F9FD]'>
          <ToastContainer />
          {/* Admin Navbar or Top Header could go here, for now reusing simple Navbar or separate Admin layout */}
          <div className='flex items-center justify-between px-4 sm:px-10 py-3 border-b bg-white'>
            <div className='flex items-center gap-2 text-primary font-bold text-xl'>
               <img className='w-44 cursor-pointer' src={adminAssets.admin_logo} alt="Admin Logo" />
               <span className='text-xs sm:text-sm text-gray-500 border border-gray-500 rounded-full px-2.5 py-0.5 ml-2'>Admin</span>
            </div>
            <button onClick={() => { localStorage.removeItem('aToken'); window.location.href='/' }} className='bg-primary text-white text-sm px-10 py-2 rounded-full'>Logout</button>
          </div>
          <div className='flex items-start'>
            <AdminSidebar />
            <Routes>
               <Route path='/' element={<AdminAppointments />} />
               <Route path='/admin-dashboard' element={<AdminAppointments />} />
               <Route path='/all-appointments' element={<AdminAppointments />} />
               <Route path='/add-doctor' element={<AddDoctor />} />
            </Routes>
          </div>
        </div>
     );
  }

  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />
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
      <Footer />
    </div>
  )
}

export default App;
