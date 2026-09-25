import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Send, CheckCircle2, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';

export default function DepartmentPortalPage() {
  const { user, isAuthenticated, isUniversity } = useAuth();
  
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Interest Submission Modal State
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [whyThisUniversity, setWhyThisUniversity] = useState('');
  const [availableResources, setAvailableResources] = useState('');
  const [expectedTimelineWeeks, setExpectedTimelineWeeks] = useState(8);
  const [submittingInterest, setSubmittingInterest] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const fetchComplaints = async () => {
    try {
      const data = await apiService.getComplaints();
      if (Array.isArray(data)) {
        setComplaints(data);
      }
    } catch (err) {
      console.warn('Failed to load complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Filter problems:
  // Show problems that were broadcasted to universities (research_invitations_sent)
  // as well as any other pending challenges
  const activeMatched = complaints.filter(c => c.status === 'research_invitations_sent');
  
  // Also count active projects assigned
  const activeAssigned = complaints.filter(c => c.status === 'in_research' || c.status === 'output_submitted' || c.status === 'routed_to_university');

  const institutionName = user?.institution || user?.agency || 'BIT Mesra';
  const deptName = user?.department || 'Dept. of Civil & Environmental Engineering';

  // Submit Interest Handler
  const handleSubmitInterest = async (e) => {
    e.preventDefault();
    if (!selectedProblem) return;

    setSubmittingInterest(true);
    try {
      const data = await apiService.submitUniversityInterest(selectedProblem.id, {
        universityName: institutionName,
        department: deptName,
        nodalOfficer: user?.name || 'Dr. Ananya Sen',
        contactEmail: user?.email || 'nodal@bitmesra.ac.in',
        whyThisUniversity,
        availableResources,
        expectedTimelineWeeks
      });

      if (data && data.success) {
        setFeedbackMessage(`Interest submitted successfully for ${selectedProblem.id}! AI has scored and ranked your proposal for Government Admin review.`);
        setSelectedProblem(null);
        setWhyThisUniversity('');
        setAvailableResources('');
        fetchComplaints();
      } else {
        alert(data?.error || 'Failed to submit interest');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting interest: ' + (err.message || 'Network issue'));
    } finally {
      setSubmittingInterest(false);
      setTimeout(() => setFeedbackMessage(''), 7000);
    }
  };

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
              {institutionName} • {deptName}
            </p>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-[15px] font-bold text-[#123158] border-b-4 border-[#f5a623] pb-3 px-1">
              Matched Problems ({activeMatched.length})
            </button>
            
            {/* If university logged in, allow them to view or enter their dedicated workspace */}
            {isAuthenticated && (isUniversity || user?.role === 'university') ? (
              <Link 
                to="/workspace"
                className="text-[15px] font-medium text-blue-700 hover:text-blue-900 border-b-4 border-transparent pb-3 px-1 transition-colors flex items-center gap-1.5"
              >
                <span>Digital Workspace ({activeAssigned.length})</span>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded">Active</span>
              </Link>
            ) : (
              <button 
                onClick={() => alert("Digital workspace opens after official university login. Click 'Portal Login' at top right.")}
                className="text-[15px] font-medium text-slate-500 hover:text-slate-800 border-b-4 border-transparent pb-3 px-1 transition-colors"
              >
                Active Projects ({activeAssigned.length})
              </button>
            )}
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

          {/* Feedback message */}
          {feedbackMessage && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm rounded flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                {feedbackMessage}
              </span>
              <button onClick={() => setFeedbackMessage('')} className="text-xs text-emerald-700 font-bold hover:underline">
                Dismiss
              </button>
            </div>
          )}

          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">Loading matched problems...</div>
          ) : activeMatched.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No problems currently matched to your department domain. Check back as new challenges are approved.
            </div>
          ) : (
            <div className="space-y-6">
              {activeMatched.map((item) => {
                const interestList = item.universityRoute?.interests || [];
                const alreadySubmitted = interestList.some(int => 
                  int.universityName?.toLowerCase().includes(institutionName.toLowerCase())
                );

                return (
                  <div key={item.id} className="border border-slate-200 rounded-lg p-5 flex flex-col md:flex-row gap-6 hover:shadow-sm transition bg-white">
                    {/* Thumbnail Image */}
                    <div className="shrink-0 w-full md:w-[220px] h-[160px] bg-slate-100 rounded overflow-hidden flex items-center justify-center border border-slate-200">
                      {item.photoUrl ? (
                        <img 
                          src={item.photoUrl} 
                          alt="Problem issue" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Building2 className="w-8 h-8 text-slate-300" />
                      )}
                    </div>

                    {/* Problem Content */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="text-[18px] font-bold text-[#123158]">
                            {item.aiAnalysis?.category || 'Civic Infrastructure Problem'}
                          </h3>
                          <span className="shrink-0 bg-red-50 text-red-700 text-[11px] font-bold px-2.5 py-1 rounded tracking-wide uppercase border border-red-100">
                            High Priority
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[13px] text-slate-500 mb-4">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{item.location} <span className="mx-1">•</span> ID: {item.id}</span>
                        </div>

                        <div className="bg-[#f8f9fa] border border-slate-100 rounded p-3 mb-5">
                          <p className="text-[13px] text-slate-700 leading-relaxed">
                            <span className="font-bold text-[#123158]">AI Structured Summary: </span>
                            {item.description}
                          </p>
                          {item.aiAnalysis?.reasoning && (
                            <p className="text-[12px] text-slate-600 mt-2 pt-2 border-t border-slate-200">
                              <span className="font-semibold text-[#123158]">Triage Note: </span>
                              {item.aiAnalysis.reasoning}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Card Footer */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-[12px] font-medium">
                          <span className="text-slate-400">Sent</span>
                          <span className="text-slate-300">→</span>
                          <span className="text-[#123158] font-bold">Opened</span>
                          <span className="text-slate-300">→</span>
                          <span className={alreadySubmitted ? "text-emerald-700 font-bold" : "text-slate-400"}>
                            {alreadySubmitted ? "Interest Lodged" : "Claimed"}
                          </span>
                        </div>

                        <div className="flex items-center gap-5">
                          <div className="flex items-center gap-1.5 text-red-600">
                            <Clock className="w-4 h-4" />
                            <span className="text-[13px] font-bold">Expires in 41h 12m</span>
                          </div>

                          {alreadySubmitted ? (
                            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[13px] font-bold px-4 py-2 rounded flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              Interest Submitted
                            </div>
                          ) : (
                            <button 
                              onClick={() => setSelectedProblem(item)}
                              className="bg-[#123158] hover:bg-[#0d223f] text-white text-[14px] font-bold px-5 py-2.5 rounded transition cursor-pointer shadow-xs"
                            >
                              Submit Interest
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Modal: University Interest Proposal Submission */}
        {selectedProblem && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl border border-slate-200 text-xs">
              <div className="flex items-start justify-between pb-3 border-b border-slate-200 mb-4">
                <div>
                  <span className="font-mono text-xs font-bold text-[#123158]">{selectedProblem.id}</span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    Submit University Interest Proposal
                  </h3>
                  <p className="text-slate-500 text-xs">
                    Institution: <strong>{institutionName}</strong> • {deptName}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedProblem(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-base cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitInterest} className="space-y-4">
                {/* 1. Why their university */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    1. Why is your university suited for this research? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={whyThisUniversity}
                    onChange={(e) => setWhyThisUniversity(e.target.value)}
                    placeholder="Highlight specialized faculty, prior civil/environmental projects, and institutional expertise..."
                    required
                    className="w-full p-2.5 border border-slate-300 rounded text-xs focus:border-[#123158] outline-none"
                  />
                </div>

                {/* 2. Resources available */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    2. Available Labs, Software & Equipment <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={availableResources}
                    onChange={(e) => setAvailableResources(e.target.value)}
                    placeholder="List specific testing rigs, GIS software, spectrometry labs, or research scholar capacity..."
                    required
                    className="w-full p-2.5 border border-slate-300 rounded text-xs focus:border-[#123158] outline-none"
                  />
                </div>

                {/* 3. Expected timeline */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    3. Expected Research Timeline (in Weeks) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={2}
                      max={52}
                      value={expectedTimelineWeeks}
                      onChange={(e) => setExpectedTimelineWeeks(e.target.value)}
                      required
                      className="w-28 p-2 border border-slate-300 rounded text-xs font-bold text-[#123158]"
                    />
                    <span className="text-slate-500">Weeks to deliver final solution blueprint</span>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-[11px] text-blue-900 leading-relaxed">
                  <strong>AI Ranking Note:</strong> Once submitted, AI analyzes all university submissions based on expertise, resources, and deadline to rank them for the Government Administrator.
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setSelectedProblem(null)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded font-semibold hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingInterest}
                    className="bg-[#123158] hover:bg-[#0c223e] text-white px-5 py-2 rounded font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {submittingInterest ? 'Transmitting...' : 'Submit Interest to State Admin'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
