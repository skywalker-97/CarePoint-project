import React from 'react';
import { assets } from '../assets/assets_frontend/assets';
import { 
  Mail, Phone, MapPin, Instagram, Twitter, Facebook, 
  Linkedin, ArrowUpRight, Shield, Globe, Award, Heart 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='bg-white border-t border-slate-100 pt-32 pb-16 relative overflow-hidden font-inter'>
      {/* Decorative Background Elements */}
      <div className='absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none' />
      <div className='absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none' />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24 mb-32'>
          
          {/* Brand & Mission Section */}
          <div className="space-y-10 lg:col-span-2">
            <div className='flex items-center gap-3'>
                <img className='w-10 h-10 object-contain' src={assets.logo} alt="CarePoint Logo" />
                <span className='text-3xl font-black text-slate-900 tracking-tighter'>CarePoint<span className='text-primary'>.</span></span>
            </div>
            <p className='text-[#64748B] font-medium leading-relaxed max-w-sm text-lg'>
              Building the future of healthcare with premium, patient-centric technology. We connect you with world-class specialists in seconds.
            </p>
            <div className='flex gap-4'>
                {[
                  { Icon: Instagram, link: '#' },
                  { Icon: Twitter, link: '#' },
                  { Icon: Facebook, link: '#' },
                  { Icon: Linkedin, link: '#' }
                ].map((social, i) => (
                    <a 
                      key={i} 
                      href={social.link}
                      className='w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-sm border border-slate-100'
                    >
                        <social.Icon size={20} />
                    </a>
                ))}
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-10">
            <h4 className='text-[10px] font-black text-slate-900 uppercase tracking-[0.4em]'>Platform</h4>
            <ul className='flex flex-col gap-5 text-[#64748B] font-bold'>
              {[
                { name: 'Find Doctors', path: '/doctors' },
                { name: 'AI Symptom Checker', path: '/' },
                { name: 'Specialists', path: '/doctors' },
                { name: 'Secure Portal', path: '/login' },
                { name: 'Contact Concierge', path: '/contact' }
              ].map((item) => (
                  <Link 
                    to={item.path} 
                    key={item.name} 
                    className='flex items-center gap-2 hover:text-primary transition-all cursor-pointer group w-fit'
                  >
                      {item.name} 
                      <ArrowUpRight size={14} className='opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-primary' />
                  </Link>
              ))}
            </ul>
          </div>

          {/* Contact & Trust */}
          <div className="space-y-10">
            <h4 className='text-[10px] font-black text-slate-900 uppercase tracking-[0.4em]'>Contact</h4>
            <ul className='flex flex-col gap-6'>
              <li className='flex items-center gap-4 group cursor-pointer'>
                  <div className='w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-blue-50 transition-all'>
                      <Phone size={18} />
                  </div>
                  <span className='font-black text-slate-600 group-hover:text-slate-900 transition-colors'>+1 800 CAREPT</span>
              </li>
              <li className='flex items-center gap-4 group cursor-pointer'>
                  <div className='w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-blue-50 transition-all'>
                      <Mail size={18} />
                  </div>
                  <span className='font-black text-slate-600 group-hover:text-slate-900 transition-colors'>hello@carepoint.com</span>
              </li>
            </ul>

            <div className='pt-8 border-t border-slate-50 space-y-4'>
                <div className='flex items-center gap-2 text-emerald-600'>
                    <Shield size={16} fill="currentColor" className='opacity-20' />
                    <span className='text-[10px] font-black uppercase tracking-widest'>HIPAA Compliant</span>
                </div>
                <div className='flex items-center gap-2 text-primary'>
                    <Award size={16} fill="currentColor" className='opacity-20' />
                    <span className='text-[10px] font-black uppercase tracking-widest'>NABH Certified</span>
                </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className='flex items-center gap-6'>
                <p className='text-xs text-[#64748B] font-black uppercase tracking-[0.2em]'>
                    &copy; 2026 CarePoint Enterprise
                </p>
                <div className='hidden md:flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full'>
                    <div className='w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse' />
                    <span className='text-[8px] font-black text-emerald-700 uppercase tracking-widest'>All Systems Operational</span>
                </div>
            </div>
            
            <div className='flex gap-8'>
                {['Privacy Policy', 'Terms of Service', 'Cookie Settings'].map(item => (
                    <span key={item} className='text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary cursor-pointer transition-all'>{item}</span>
                ))}
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
