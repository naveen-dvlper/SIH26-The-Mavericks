import React, { useState } from 'react'
import { Search, MapPin, Clock, CheckCircle2, AlertCircle, Building2 } from 'lucide-react'

export default function TrackComplaintPage() {
  const [complaintId, setComplaintId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [complaint, setComplaint] = useState(null);

  const handleTrack = async () => {
    if (!complaintId) return;
    setLoading(true);
    setError(null);
    setComplaint(null);
    
    try {
      const response = await fetch(`/api/complaints/${complaintId}`);
      if (!response.ok) {
        throw new Error("Complaint not found or invalid ID.");
      }
      const data = await response.json();
      setComplaint(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'submitted': return { label: 'Received', color: 'text-amber-600', icon: Clock, bg: 'bg-amber-50' };
      case 'ai_reviewed': return { label: 'AI Reviewed', color: 'text-blue-600', icon: CheckCircle2, bg: 'bg-blue-50' };
      case 'pending_govt_approval': return { label: 'Pending Dept Routing', color: 'text-purple-600', icon: Building2, bg: 'bg-purple-50' };
      case 'dispatched_to_dept': return { label: 'Dispatched', color: 'text-indigo-600', icon: MapPin, bg: 'bg-indigo-50' };
      case 'resolved': return { label: 'Resolved', color: 'text-green-600', icon: CheckCircle2, bg: 'bg-green-50' };
      default: return { label: status, color: 'text-slate-600', icon: AlertCircle, bg: 'bg-slate-50' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-sm text-slate-500 mb-6">
          <span className="hover:underline cursor-pointer">Home</span> &gt; <span className="font-semibold text-slate-700">Track Complaint</span>
        </div>
        <h1 className="text-4xl font-serif text-[#123158] mb-2 font-bold tracking-tight">Track Complaint</h1>
        <p className="text-slate-600 mb-8">Enter your complaint ID to check its current status.</p>
        
        <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm mb-8">
          <div className="flex gap-4">
            <input 
              type="text" 
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value.trim())}
              placeholder="e.g. JH-26-09A4F" 
              className="flex-grow text-base p-4 border border-slate-300 rounded focus:outline-none focus:border-[#123158] transition"
            />
            <button 
              onClick={handleTrack}
              disabled={loading}
              className="bg-[#123158] hover:bg-[#1a4b82] disabled:bg-slate-400 text-white font-bold py-4 px-8 rounded transition flex items-center gap-2"
            >
              {loading ? "Searching..." : <><Search className="w-5 h-5" /> Track</>}
            </button>
          </div>
          {error && <p className="text-red-600 text-sm mt-4 font-medium">{error}</p>}
        </div>

        {complaint && (
          <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
            <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Complaint ID</span>
                <h2 className="text-2xl font-bold text-[#123158]">{complaint.id}</h2>
                <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-2">
                  <MapPin className="w-4 h-4" /> {complaint.location}
                </div>
              </div>
              
              {(() => {
                const statusInfo = getStatusDisplay(complaint.status);
                const Icon = statusInfo.icon;
                return (
                  <div className={`px-4 py-2 rounded-full border border-slate-100 flex items-center gap-2 ${statusInfo.bg}`}>
                    <Icon className={`w-5 h-5 ${statusInfo.color}`} />
                    <span className={`font-bold ${statusInfo.color}`}>{statusInfo.label}</span>
                  </div>
                );
              })()}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-2">Description</h3>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded border border-slate-100">
                  {complaint.description}
                </p>
              </div>

              {complaint.aiAnalysis && (
                <div className="bg-blue-50 border border-blue-100 p-4 rounded">
                  <h3 className="text-sm font-bold text-[#123158] mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> AI Triaged
                  </h3>
                  <p className="text-sm text-blue-900 mb-1">
                    <span className="font-semibold">Category:</span> {complaint.aiAnalysis.category || "General"}
                  </p>
                  <p className="text-sm text-blue-800">
                    {complaint.aiAnalysis.reasoning}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
