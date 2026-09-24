import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  MapPin, Search, CheckCircle2, Building2, Send, Award, 
  Clock, ArrowRight, ShieldCheck, Mail, AlertCircle, FileText, Check, ChevronDown, Sparkles
} from 'lucide-react';

export default function AdminPortalPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // all, pending, municipal, invited, research, resolved
  const [searchTerm, setSearchTerm] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(null); // id of item processing

  // Modal / Detail state for ranking comparison
  const [selectedForRanking, setSelectedForRanking] = useState(null);

  const fetchComplaints = async () => {
    try {
      const res = await fetch('/api/complaints');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setComplaints(data);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Failed to load complaints from backend:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Admin approves route: either Municipal Repair or Research
  const handleAdminApprove = async (complaintId, routeType) => {
    setActionLoading(complaintId);
    try {
      const res = await fetch(`/api/complaints/${complaintId}/admin-approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routeType })
      });
      const data = await res.json();
      if (data.success) {
        setComplaints(prev => prev.map(c => c.id === complaintId ? data.complaint : c));
        setFeedbackMessage(data.actionTaken);
      } else {
        alert(data.error || 'Approval failed');
      }
    } catch (err) {
      console.error(err);
      alert('Network error during approval');
    } finally {
      setActionLoading(null);
      setTimeout(() => setFeedbackMessage(''), 6000);
    }
  };

  // Admin assigns problem to a specific University (from AI rankings)
  const handleAssignUniversity = async (complaintId, universityName, contactEmail) => {
    setActionLoading(complaintId);
    try {
      const res = await fetch(`/api/complaints/${complaintId}/assign-university`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ universityName, contactEmail })
      });
      const data = await res.json();
      if (data.success) {
        setComplaints(prev => prev.map(c => c.id === complaintId ? data.complaint : c));
        setFeedbackMessage(`Official allocation confirmed for ${universityName}. Institutional portal login issued: ${data.loginCredentials.email} (Code: ${data.loginCredentials.institutionalCode})`);
        setSelectedForRanking(null);
      } else {
        alert(data.error || 'Failed to assign');
      }
    } catch (err) {
      console.error(err);
      alert('Network error assigning university');
    } finally {
      setActionLoading(null);
      setTimeout(() => setFeedbackMessage(''), 8000);
    }
  };

  // Mark resolved
  const handleMarkResolved = async (complaintId) => {
    setActionLoading(complaintId);
    try {
      const res = await fetch(`/api/complaints/${complaintId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved' })
      });
      const data = await res.json();
      if (data.success) {
        setComplaints(prev => prev.map(c => c.id === complaintId ? { ...c, status: 'resolved' } : c));
        setFeedbackMessage(`Problem ${complaintId} successfully marked as resolved.`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
      setTimeout(() => setFeedbackMessage(''), 5000);
    }
  };

  // Filter counts
  const pendingCount = complaints.filter(c => c.status === 'pending_govt_approval' || c.status === 'submitted' || c.status === 'ai_reviewed').length;
  const municipalCount = complaints.filter(c => c.status === 'municipal_repair_assigned').length;
  const invitedCount = complaints.filter(c => c.status === 'research_invitations_sent').length;
  const researchCount = complaints.filter(c => c.status === 'in_research' || c.status === 'output_submitted' || c.status === 'routed_to_university').length;
  const resolvedCount = complaints.filter(c => c.status === 'resolved').length;

  const filteredComplaints = complaints.filter(item => {
    let matchesStatus = true;
    if (filterStatus === 'pending') {
      matchesStatus = item.status === 'pending_govt_approval' || item.status === 'submitted' || item.status === 'ai_reviewed';
    } else if (filterStatus === 'municipal') {
      matchesStatus = item.status === 'municipal_repair_assigned';
    } else if (filterStatus === 'invited') {
      matchesStatus = item.status === 'research_invitations_sent';
    } else if (filterStatus === 'research') {
      matchesStatus = item.status === 'in_research' || item.status === 'output_submitted' || item.status === 'routed_to_university';
    } else if (filterStatus === 'resolved') {
      matchesStatus = item.status === 'resolved';
    }

    const matchesSearch = !searchTerm || 
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.aiAnalysis?.category || '').toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Breadcrumb */}
        <div className="text-[13px] text-slate-500 mb-6 font-medium">
          <Link to="/" className="hover:underline hover:text-[#123158]">Home</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-[#123158] font-semibold">Government of Jharkhand • State Administrator Portal</span>
        </div>

        {/* Portal Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 border-b border-slate-200 pb-0 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#123158] text-white tracking-wide uppercase">
                Official Admin Console
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {user?.designation || 'State Nodal Administrator'} • {user?.cadre || 'JH-2012'}
              </span>
            </div>
            <h1 className="text-[32px] font-serif text-[#123158] font-bold tracking-tight">
              Civic Problem Triage & University Allocation Ledger
            </h1>
            <p className="text-[14px] text-slate-600 max-w-3xl mt-1">
              Review citizen complaints analyzed by AI. Approve either routine municipal dispatch or broadcast complex challenges to top Indian universities, inspect AI rankings, and commission academic workspaces.
            </p>
          </div>

          {/* Workflow Status Tabs */}
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-0">
            <button 
              onClick={() => setFilterStatus('all')}
              className={`text-[14px] pb-3 px-2 font-semibold transition-colors border-b-4 whitespace-nowrap cursor-pointer ${
                filterStatus === 'all' ? 'border-[#f5a623] text-[#123158]' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              All Records ({complaints.length})
            </button>
            <button 
              onClick={() => setFilterStatus('pending')}
              className={`text-[14px] pb-3 px-2 font-semibold transition-colors border-b-4 whitespace-nowrap cursor-pointer ${
                filterStatus === 'pending' ? 'border-[#f5a623] text-[#123158]' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Needs Approval ({pendingCount})
            </button>
            <button 
              onClick={() => setFilterStatus('invited')}
              className={`text-[14px] pb-3 px-2 font-semibold transition-colors border-b-4 whitespace-nowrap cursor-pointer ${
                filterStatus === 'invited' ? 'border-[#f5a623] text-[#123158]' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Univ Interest & Rank ({invitedCount})
            </button>
            <button 
              onClick={() => setFilterStatus('research')}
              className={`text-[14px] pb-3 px-2 font-semibold transition-colors border-b-4 whitespace-nowrap cursor-pointer ${
                filterStatus === 'research' ? 'border-[#f5a623] text-[#123158]' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Active Research ({researchCount})
            </button>
            <button 
              onClick={() => setFilterStatus('municipal')}
              className={`text-[14px] pb-3 px-2 font-semibold transition-colors border-b-4 whitespace-nowrap cursor-pointer ${
                filterStatus === 'municipal' ? 'border-[#f5a623] text-[#123158]' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Municipal ({municipalCount})
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 text-sm rounded-lg flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-medium leading-relaxed">{feedbackMessage}</span>
            </div>
            <button onClick={() => setFeedbackMessage('')} className="text-xs font-bold text-emerald-800 hover:underline ml-4">
              Close
            </button>
          </div>
        )}

        {/* Search Bar & Workflow Guide Strip */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, location, or problem category..."
              className="w-full text-[13px] pl-9 pr-3 py-2 border border-slate-300 rounded focus:border-[#123158] focus:outline-none transition"
            />
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live SETU Autonomous Routing Engine Active</span>
          </div>
        </div>

        {/* Problem Feed */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            <span className="animate-pulse">Loading state ledger complaints...</span>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="font-semibold text-base text-slate-700">No records found for the selected filter.</p>
            <p className="text-xs text-slate-400 mt-1">Try switching tabs or clearing your search term.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredComplaints.map((item) => {
              const aiReport = item.aiAnalysis || {};
              const isNeedsApproval = item.status === 'pending_govt_approval' || item.status === 'submitted' || item.status === 'ai_reviewed';
              const isMunicipal = item.status === 'municipal_repair_assigned';
              const isInvited = item.status === 'research_invitations_sent';
              const isAssignedResearch = item.status === 'in_research' || item.status === 'output_submitted' || item.status === 'routed_to_university';
              const isResolved = item.status === 'resolved';

              const interestList = item.universityRoute?.interests || [];
              const hasInterests = interestList.length > 0;

              return (
                <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs transition hover:border-slate-300">
                  
                  {/* Top Bar: ID, Badge, Timestamp */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-[#123158] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {item.id}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium text-slate-700">{item.location}</span>
                      </div>
                    </div>

                    <div>
                      {isNeedsApproval && (
                        <span className="bg-amber-50 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded uppercase tracking-wider border border-amber-200 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Awaiting Admin Approval
                        </span>
                      )}
                      {isMunicipal && (
                        <span className="bg-blue-50 text-blue-800 text-[11px] font-bold px-2.5 py-1 rounded uppercase tracking-wider border border-blue-200 flex items-center gap-1">
                          <Building2 className="w-3 h-3" /> Dispatched to Municipality
                        </span>
                      )}
                      {isInvited && (
                        <span className="bg-purple-50 text-purple-800 text-[11px] font-bold px-2.5 py-1 rounded uppercase tracking-wider border border-purple-200 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> Mailed Top Universities ({interestList.length} Responses)
                        </span>
                      )}
                      {isAssignedResearch && (
                        <span className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded uppercase tracking-wider border border-emerald-200 flex items-center gap-1">
                          <Award className="w-3 h-3" /> Active University Workspace
                        </span>
                      )}
                      {isResolved && (
                        <span className="bg-slate-100 text-slate-700 text-[11px] font-bold px-2.5 py-1 rounded uppercase tracking-wider border border-slate-200">
                          Completed & Resolved
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Problem Description & Photo */}
                  <div className="grid md:grid-cols-4 gap-6 mb-5">
                    <div className="md:col-span-3">
                      <h3 className="text-[17px] font-bold text-[#123158] mb-1">
                        {aiReport.category || 'Civic Infrastructure Concern'}
                      </h3>
                      <p className="text-[14px] text-slate-700 leading-relaxed">
                        {item.description}
                      </p>

                      {/* AI Detailed Analysis Report */}
                      <div className="mt-4 bg-[#f8fafd] border border-blue-100 rounded-md p-4 text-xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-[#123158] flex items-center gap-1.5 text-xs">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                            AI Triage Technical Report
                          </span>
                          <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                            aiReport.recommendedPath === 'research' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            AI Recommendation: {aiReport.recommendedPath === 'research' ? 'Academic Research Needed' : 'Municipal Repair Only'}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-2">
                          <strong className="text-slate-800">Reasoning: </strong>
                          {aiReport.reasoning}
                        </p>
                        {aiReport.scopeOfWork && (
                          <p className="text-slate-600 mb-1">
                            <strong className="text-slate-800">Identified Scope: </strong>
                            {aiReport.scopeOfWork}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-4 mt-2 pt-2 border-t border-blue-50 text-[11px] text-slate-500">
                          <span>Target Domain: <strong className="text-slate-700">{aiReport.targetDomain || 'Civil / Environmental'}</strong></span>
                          <span>Estimated Scope Budget: <strong className="text-slate-700">{aiReport.estimatedBudgetRange || 'Standard Norms'}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Image Column */}
                    <div className="md:col-span-1">
                      <div className="h-44 bg-slate-100 rounded border border-slate-200 overflow-hidden flex items-center justify-center">
                        {item.photoUrl ? (
                          <img src={item.photoUrl} alt="Citizen Photo" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-3 text-slate-400 text-xs">
                            <Building2 className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                            <span>No Photo Attached</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* FLOW STEP 1: ADMIN APPROVAL ACTIONS (If Pending) */}
                  {isNeedsApproval && (
                    <div className="mt-4 p-4 bg-amber-50/70 border border-amber-200 rounded-md">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h4 className="text-sm font-bold text-amber-900">
                            Admin Approval Required to Route Problem
                          </h4>
                          <p className="text-xs text-amber-800 mt-0.5">
                            Based on the AI report above, approve whether this problem only needs municipal repairment or academic research.
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <button
                            onClick={() => handleAdminApprove(item.id, 'municipal')}
                            disabled={actionLoading === item.id}
                            className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold px-4 py-2.5 rounded text-xs transition flex items-center gap-2 cursor-pointer shadow-2xs"
                          >
                            <Building2 className="w-3.5 h-3.5 text-slate-600" />
                            Approve Municipal Repair
                          </button>
                          
                          <button
                            onClick={() => handleAdminApprove(item.id, 'research')}
                            disabled={actionLoading === item.id}
                            className="bg-[#123158] hover:bg-[#0c223e] text-white font-bold px-4 py-2.5 rounded text-xs transition flex items-center gap-2 cursor-pointer shadow-xs"
                          >
                            <Send className="w-3.5 h-3.5 text-amber-300" />
                            Approve Research (Email Top 10 Universities)
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* FLOW STEP 2: MUNICIPAL DISPATCH DETAILS */}
                  {isMunicipal && item.municipalDetails && (
                    <div className="mt-4 p-4 bg-blue-50/60 border border-blue-200 rounded-md text-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-[#123158] flex items-center gap-2 text-sm">
                          <Building2 className="w-4 h-4 text-blue-700" />
                          Municipal Corporation Work Order Issued
                        </span>
                        <span className="text-[11px] text-blue-700 font-semibold">
                          Automated Mail Transmitted
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        Official work order email sent to <strong>{item.municipalDetails.assignedMunicipality}</strong> ({item.municipalDetails.dispatchedEmail}).
                      </p>
                      <p className="text-slate-600 mt-1">
                        <strong>Action Required: </strong> {item.municipalDetails.actionRequired}
                      </p>
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => handleMarkResolved(item.id)}
                          className="bg-[#123158] hover:bg-[#0c223e] text-white font-bold px-3.5 py-2 rounded text-xs transition cursor-pointer"
                        >
                          Mark Work Completed
                        </button>
                      </div>
                    </div>
                  )}

                  {/* FLOW STEP 3: UNIVERSITY INVITATIONS & AI RANKED INTERESTS */}
                  {(isInvited || (isAssignedResearch && hasInterests)) && (
                    <div className="mt-4 border border-slate-200 rounded-md p-4 bg-slate-50/80">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-blue-600" />
                            Emailed Top 10 Indian Universities Across Relevant Domain
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {interestList.length} of 10 institutions have submitted interest dossiers. AI has ranked them by expertise, resources, and timeline.
                          </p>
                        </div>
                        {isInvited && (
                          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded border border-purple-200">
                            Select Best-Suited University Below
                          </span>
                        )}
                      </div>

                      {interestList.length === 0 ? (
                        <div className="py-4 text-center text-slate-400 text-xs">
                          Waiting for universities to access the problem brief and submit interest proposals...
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {interestList.map((interest, idx) => {
                            const isAssigned = item.universityRoute?.selectedUniversity === interest.universityName;

                            return (
                              <div 
                                key={interest.id || idx} 
                                className={`p-3.5 rounded border text-xs bg-white transition ${
                                  isAssigned ? 'border-emerald-500 ring-1 ring-emerald-400 bg-emerald-50/30' : 'border-slate-200'
                                }`}
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs bg-[#123158] text-white px-2 py-0.5 rounded">
                                      AI Rank #{interest.aiRank || idx + 1}
                                    </span>
                                    <h5 className="font-bold text-sm text-[#123158]">
                                      {interest.universityName}
                                    </h5>
                                    <span className="text-slate-400">• {interest.department}</span>
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                      AI Fit Score: {interest.aiFitScore || 90}/100
                                    </span>
                                    {isInvited && !isAssigned && (
                                      <button
                                        onClick={() => handleAssignUniversity(item.id, interest.universityName, interest.contactEmail)}
                                        disabled={actionLoading === item.id}
                                        className="bg-[#123158] hover:bg-[#0c223e] text-white font-bold px-3 py-1.5 rounded text-xs transition cursor-pointer flex items-center gap-1"
                                      >
                                        <Award className="w-3 h-3 text-amber-300" />
                                        Assign & Create Login
                                      </button>
                                    )}
                                    {isAssigned && (
                                      <span className="bg-emerald-600 text-white font-bold px-3 py-1 rounded text-xs flex items-center gap-1">
                                        <Check className="w-3.5 h-3.5" /> Assigned Partner
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Three Required Submission Answers */}
                                <div className="grid sm:grid-cols-3 gap-3 bg-slate-50 p-2.5 rounded border border-slate-100 mt-2">
                                  <div>
                                    <span className="font-bold text-slate-700 block mb-0.5 text-[11px]">1. Why This University:</span>
                                    <p className="text-slate-600 line-clamp-3 leading-snug">{interest.whyThisUniversity}</p>
                                  </div>
                                  <div>
                                    <span className="font-bold text-slate-700 block mb-0.5 text-[11px]">2. Available Resources/Labs:</span>
                                    <p className="text-slate-600 line-clamp-3 leading-snug">{interest.availableResources}</p>
                                  </div>
                                  <div>
                                    <span className="font-bold text-slate-700 block mb-0.5 text-[11px]">3. Expected Timeline:</span>
                                    <p className="text-[#123158] font-bold text-sm">{interest.expectedTimelineWeeks} Weeks</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Contact: {interest.contactEmail}</p>
                                  </div>
                                </div>

                                {interest.aiRankingReason && (
                                  <p className="text-[11px] text-slate-500 mt-2 italic flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-blue-500 shrink-0" />
                                    <span>AI Evaluation: {interest.aiRankingReason}</span>
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* FLOW STEP 4: ASSIGNED UNIVERSITY WORKSPACE & OUTPUT VIEW */}
                  {isAssignedResearch && (
                    <div className="mt-4 border border-emerald-200 bg-emerald-50/20 rounded-md p-4 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-3 border-b border-emerald-100">
                        <div>
                          <h4 className="font-bold text-sm text-[#123158] flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            Academic Workspace: {item.universityRoute?.selectedUniversity}
                          </h4>
                          <p className="text-slate-500 text-xs">
                            University coordinates through the digital portal workspace to submit interim updates and final deliverables.
                          </p>
                        </div>
                        {item.universityRoute?.portalLoginAccount && (
                          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded text-[11px] text-slate-700 flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span>Login ID: <strong className="text-[#123158]">{item.universityRoute.portalLoginAccount.email}</strong></span>
                            {item.universityRoute.portalLoginAccount.tempPass && (
                              <span>Password: <strong className="font-mono text-[#123158] bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">{item.universityRoute.portalLoginAccount.tempPass}</strong></span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Workspace Updates Timeline */}
                      {item.universityRoute?.workspaceUpdates && item.universityRoute.workspaceUpdates.length > 0 ? (
                        <div className="space-y-2 mb-3">
                          <span className="font-bold text-slate-600 block text-[11px] uppercase tracking-wider">
                            Latest Research Milestones Logged by University:
                          </span>
                          {item.universityRoute.workspaceUpdates.slice(0, 3).map((upd, uIdx) => (
                            <div key={upd.id || uIdx} className="bg-white p-2.5 rounded border border-slate-200">
                              <div className="flex items-center justify-between font-semibold text-slate-800">
                                <span>{upd.title}</span>
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{upd.stage}</span>
                              </div>
                              <p className="text-slate-600 text-[11px] mt-1">{upd.note}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-400 italic">No workspace updates logged yet.</p>
                      )}

                      {/* Final Output if submitted */}
                      {item.universityRoute?.finalOutput ? (
                        <div className="mt-3 p-3 bg-white border border-emerald-300 rounded">
                          <span className="font-bold text-emerald-800 text-xs uppercase tracking-wide block mb-1">
                            🎉 Final Research Deliverable Received ({item.universityRoute.finalOutput.deliverableType})
                          </span>
                          <p className="text-slate-700 text-xs leading-relaxed">{item.universityRoute.finalOutput.executiveSummary}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[11px] text-slate-500">Key Findings: {item.universityRoute.finalOutput.keyFindings}</span>
                            {!isResolved && (
                              <button
                                onClick={() => handleMarkResolved(item.id)}
                                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded text-xs"
                              >
                                Accept & Resolve Problem
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                          <span>Awaiting final engineering blueprint / policy submission from university team.</span>
                          {!isResolved && (
                            <button
                              onClick={() => handleMarkResolved(item.id)}
                              className="text-[#123158] font-bold hover:underline"
                            >
                              Manually Mark Resolved
                            </button>
                          )}
                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
