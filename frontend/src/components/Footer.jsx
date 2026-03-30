import React from 'react';
import { assets } from '../assets/assets_frontend/assets';

const Footer = () => {
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        
        {/* Left Section */}
        <div>
          <div className='text-xl sm:text-2xl font-bold mb-5 flex items-center gap-2 text-primary'>
            <img className='w-40 mb-5' src={assets.logo} alt="CarePoint Logo" />
          </div>
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
        </div>

        {/* Center Section */}
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li className='cursor-pointer hover:text-black'>Home</li>
            <li className='cursor-pointer hover:text-black'>About us</li>
            <li className='cursor-pointer hover:text-black'>Contact us</li>
            <li className='cursor-pointer hover:text-black'>Privacy policy</li>
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+1-212-456-7890</li>
            <li>carepoint@gmail.com</li>
          </ul>
        </div>

      </div>

      <div>
        <hr className='border-gray-300' />
        <p className='py-5 text-sm text-center'>Copyright 2026@ CarePoint - All Right Reserved.</p>
      </div>
    </div>
  );
};

export default Footer;
