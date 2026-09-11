import React from 'react';
import { Globe, PlusCircle, LogIn } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="w-full flex flex-col font-sans z-50 bg-white">
      {/* Top Strip */}
      <div className="bg-[#111827] text-slate-300 text-xs">
        <div className="w-full px-6 h-[38px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-[13px]">Government of Jharkhand</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400 text-[13px]">Govt. of Jharkhand</span>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center">
            <div className="flex items-center bg-[#1f2937] border border-slate-700 rounded overflow-hidden">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 flex items-center gap-1.5 font-medium transition text-[12px] tracking-wider ${
                  lang === 'en' ? 'bg-[#3b5998] text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Globe className={`w-4 h-4 ${lang === 'en' ? 'text-amber-400' : 'text-slate-400'}`} />
                English
              </button>
              <div className="w-px h-3 bg-slate-600"></div>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-3 py-1.5 font-medium transition text-[12px] tracking-wider ${
                  lang === 'hi' ? 'bg-[#3b5998] text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                हिन्दी
              </button>
              <div className="w-px h-3 bg-slate-600"></div>
              <button
                type="button"
                onClick={() => setLang('sat')}
                className={`px-3 py-1.5 font-medium transition text-[12px] tracking-wider ${
                  lang === 'sat' ? 'bg-[#3b5998] text-white' : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                ᱥᱟᱱᱛᱟᱲᱤ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Masthead */}
      <div className="bg-white">
        <div className="w-full px-6 py-5 flex items-center justify-between">
          {/* Left - Department Info */}
          <div className="flex items-center gap-5">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" 
              alt="State Emblem" 
              className="h-[75px] w-auto object-contain" 
            />
            <div className="w-px h-16 bg-slate-300 mx-2"></div>
            <div className="flex flex-col">
              <h1 className="text-[22px] font-bold text-[#1f2937] leading-tight">Government of Jharkhand</h1>
              <h2 className="text-[16px] font-bold text-[#3b5998] leading-tight mt-1">Department of Higher & Technical Education</h2>
              <p className="text-[12px] text-slate-500 font-semibold tracking-wide mt-1.5 uppercase">
                SETU • CITIZEN-ACADEMIA CHALLENGE RESOLUTION NETWORK
              </p>
            </div>
          </div>
          
          {/* Right - Mission Info */}
          <div className="flex items-center gap-5 text-right">
            <div className="flex flex-col">
              <h3 className="text-[16px] font-bold text-[#1f2937] leading-tight">JHARKHAND SAMADHAN MISSION</h3>
              <p className="text-[13px] font-bold text-[#3b5998] leading-tight mt-1">STATE INNOVATION & RESEARCH CELL</p>
            </div>
            <div className="bg-[#f8f9fa] p-3 border border-slate-100 rounded">
              <img 
                src="/assets/jharkhandlogo.webp" 
                alt="Jharkhand Logo" 
                className="h-[65px] w-auto object-contain mix-blend-multiply" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Nav Bar */}
      <div className="bg-[#123158] shadow-md relative z-20">
        <div className="w-full px-6 h-[56px] flex items-center justify-between">
          <nav className="flex items-center h-full">
            <Link 
              to="/" 
              className={`h-full flex items-center px-5 text-[15px] font-bold transition-colors border-b-4 ${isActive('/') ? 'border-[#f5a623] text-white' : 'border-transparent text-slate-100 hover:text-white hover:bg-white/5'}`}
            >
              Home
            </Link>
            <Link 
              to="/report" 
              className={`h-full flex items-center px-5 text-[15px] font-bold transition-colors border-b-4 ${isActive('/report') ? 'border-[#f5a623] text-white' : 'border-transparent text-slate-100 hover:text-white hover:bg-white/5'}`}
            >
              Report a Problem
            </Link>
            <Link 
              to="/track" 
              className={`h-full flex items-center px-5 text-[15px] font-bold transition-colors border-b-4 ${isActive('/track') ? 'border-[#f5a623] text-white' : 'border-transparent text-slate-100 hover:text-white hover:bg-white/5'}`}
            >
              Track Complaint
            </Link>
            <Link 
              to="/department" 
              className={`h-full flex items-center px-5 text-[15px] font-bold transition-colors border-b-4 ${isActive('/department') ? 'border-[#f5a623] text-white' : 'border-transparent text-slate-100 hover:text-white hover:bg-white/5'}`}
            >
              Department Portal
            </Link>
            <Link 
              to="/impact" 
              className={`h-full flex items-center px-5 text-[15px] font-bold transition-colors border-b-4 ${isActive('/impact') ? 'border-[#f5a623] text-white' : 'border-transparent text-slate-100 hover:text-white hover:bg-white/5'}`}
            >
              Impact Dashboard
            </Link>
          </nav>
          
          <div className="flex items-center h-full">
            <Link 
              to="/login" 
              className={`h-full flex items-center px-5 text-[14px] font-bold transition-colors bg-[#0d223f] text-amber-400 hover:bg-[#0a1a30] hover:text-white border-l border-[#204482]`}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Portal Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
