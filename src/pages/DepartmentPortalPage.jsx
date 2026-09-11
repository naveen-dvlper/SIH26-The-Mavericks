import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Clock } from 'lucide-react'

export default function DepartmentPortalPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Breadcrumbs */}
        <div className="text-[13px] text-slate-500 mb-6 font-medium">
          <Link to="/" className="hover:underline hover:text-[#123158]">Home</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-[#123158] font-semibold">Department Portal</span>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-slate-200 pb-0">
          <div className="mb-6 md:mb-8">
            <h1 className="text-[34px] font-serif text-[#123158] mb-1 font-bold tracking-tight">Coordinator Portal</h1>
            <p className="text-[14px] text-slate-600">
              BIT Mesra • Dept. of Civil & Environmental Engineering
            </p>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-[15px] font-bold text-[#123158] border-b-4 border-[#f5a623] pb-3 px-1">
              Matched Problems (2)
            </button>
            <button className="text-[15px] font-medium text-slate-500 hover:text-slate-800 border-b-4 border-transparent pb-3 px-1 transition-colors">
              Active Projects (1)
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
          
          {/* Info Alert */}
          <div className="bg-[#f4f9ff] border border-blue-100 rounded p-4 mb-8">
            <p className="text-[14px] text-slate-600">
              Problems matched to your department's domain by AI. Unclaimed problems will automatically cascade to the next suitable department to ensure timely resolution.
            </p>
          </div>

          <div className="space-y-6">
            
            {/* Card 1 */}
            <div className="border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row gap-6 hover:shadow-sm transition bg-white">
              <div className="shrink-0 w-full md:w-[220px] h-[160px] bg-slate-200 rounded overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=600&auto=format&fit=crop" 
                  alt="Waterlogging issue" 
                  className="w-full h-full object-cover grayscale opacity-80 mix-blend-multiply" 
                />
              </div>
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-[18px] font-bold text-[#123158]">Waterlogging & Drainage Failure</h3>
                    <span className="shrink-0 bg-red-50 text-red-700 text-[11px] font-bold px-2.5 py-1 rounded tracking-wide uppercase border border-red-100">
                      High Priority
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px] text-slate-500 mb-4">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Sector 4, Bokaro Steel City <span className="mx-1">•</span> ID: JH-26-09A4F</span>
                  </div>
                  <div className="bg-[#f8f9fa] border border-slate-100 rounded p-3 mb-5">
                    <p className="text-[13px] text-slate-700 leading-relaxed">
                      <span className="font-bold text-[#123158]">AI Structured Summary:</span> Chronic waterlogging due to blocked primary drainage channel. Requires civil engineering assessment for redesign.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 text-[12px] font-medium">
                    <span className="text-slate-400">Sent</span>
                    <span className="text-slate-300">→</span>
                    <span className="text-[#123158] font-bold">Opened</span>
                    <span className="text-slate-300">→</span>
                    <span className="text-slate-400">Claimed</span>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-1.5 text-red-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-[13px] font-bold">Expires in 41h 12m</span>
                    </div>
                    <button className="bg-[#123158] hover:bg-[#0d223f] text-white text-[14px] font-bold px-5 py-2.5 rounded transition">
                      Submit Interest
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row gap-6 hover:shadow-sm transition bg-white">
              <div className="shrink-0 w-full md:w-[220px] h-[160px] bg-slate-100 rounded flex items-center justify-center border border-slate-200">
                <span className="text-slate-400 text-sm font-medium">Issue Image</span>
              </div>
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-[18px] font-bold text-[#123158]">Traffic Signal Sync Issue</h3>
                    <span className="shrink-0 bg-orange-50 text-orange-700 text-[11px] font-bold px-2.5 py-1 rounded tracking-wide uppercase border border-orange-100">
                      Medium Priority
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px] text-slate-500 mb-4">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Albert Ekka Chowk, Ranchi <span className="mx-1">•</span> ID: JH-26-09B21</span>
                  </div>
                  <div className="bg-[#f8f9fa] border border-slate-100 rounded p-3 mb-5">
                    <p className="text-[13px] text-slate-700 leading-relaxed">
                      <span className="font-bold text-[#123158]">AI Structured Summary:</span> Signals out of sync causing gridlock during peak hours. Needs traffic flow modeling.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 text-[12px] font-medium">
                    <span className="text-slate-400">Sent</span>
                    <span className="text-slate-300">→</span>
                    <span className="text-[#123158] font-bold">Opened</span>
                    <span className="text-slate-300">→</span>
                    <span className="text-slate-400">Claimed</span>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-1.5 text-red-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-[13px] font-bold">Expires in 12h 05m</span>
                    </div>
                    <button className="bg-[#123158] hover:bg-[#0d223f] text-white text-[14px] font-bold px-5 py-2.5 rounded transition">
                      Submit Interest
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
