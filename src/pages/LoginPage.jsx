import React, { useState } from 'react';
import { Building2, GraduationCap, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [role, setRole] = useState('government');

  return (
    <div className="py-20 bg-slate-50 min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="w-full max-w-md px-6 relative z-10">
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-[#123158] p-6 text-center">
            <h1 className="text-2xl font-serif text-white mb-1">Portal Access</h1>
            <p className="text-blue-200 text-sm">Secure login for registered partners</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setRole('government')}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${role === 'government' ? 'text-[#123158] border-b-2 border-[#123158] bg-slate-50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Building2 className="w-4 h-4" />
              Government
            </button>
            <button
              onClick={() => setRole('university')}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${role === 'university' ? 'text-[#123158] border-b-2 border-[#123158] bg-slate-50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <GraduationCap className="w-4 h-4" />
              University
            </button>
          </div>

          {/* Form */}
          <div className="p-6 md:p-8">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  {role === 'government' ? 'Official Email ID' : 'Institutional Email'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="email" 
                    placeholder={role === 'government' ? "admin@jharkhand.gov.in" : "nodal@university.edu"}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded focus:border-[#123158] focus:ring-1 focus:ring-[#123158] outline-none transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded focus:border-[#123158] focus:ring-1 focus:ring-[#123158] outline-none transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300 text-[#123158] focus:ring-[#123158]" />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <a href="#" className="text-sm font-semibold text-[#204482] hover:underline">Forgot Password?</a>
              </div>

              <button className="w-full bg-[#123158] hover:bg-[#0d223f] text-white font-bold py-3 rounded mt-2 flex items-center justify-center gap-2 transition">
                Secure Login
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
