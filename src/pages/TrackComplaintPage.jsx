import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, MapPin, Clock, CheckCircle2, AlertCircle, 
  Building2, Award, Mail, ChevronRight, ShieldCheck, ArrowRight, FileText 
} from 'lucide-react';

export default function TrackComplaintPage() {
  const [searchParams] = useSearchParams();
  const [complaintId, setComplaintId] = useState(searchParams.get('id') || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [complaint, setComplaint] = useState(null);

  const fetchComplaintById = async (idToFetch) => {
    if (!idToFetch) return;
    setLoading(true);
    setError(null);
    setComplaint(null);
    
    try {
      const response = await fetch(`/api/complaints/${idToFetch}`);
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

  useEffect(() => {
    const paramId = searchParams.get('id');
    if (paramId) {
      setComplaintId(paramId);
      fetchComplaintById(paramId);
    }
  }, [searchParams]);

  const handleTrack = () => {
    fetchComplaintById(complaintId);
  };

  const getLifecycleStage = (status) => {
    switch (status) {
      case 'submitted':
      case 'ai_reviewed':
      case 'pending_govt_approval':
        return {
          step: 2,
          badge: 'AI Triaged • Awaiting Admin Approval',
          color: 'text-amber-800 bg-amber-50 border-amber-200',
          desc: 'Complaint is in the state database. AI has analyzed whether municipal repair or university research is required.'
        };
      case 'municipal_repair_assigned':
        return {
          step: 3,
          badge: 'Dispatched to Municipal Corporation',
          color: 'text-blue-800 bg-blue-50 border-blue-200',
          desc: 'Admin approved routine repairment. Work order emailed directly to local municipal corporation.'
        };
      case 'research_invitations_sent':
        return {
          step: 3,
          badge: 'Broadcasted to Top Indian Universities',
          color: 'text-purple-800 bg-purple-50 border-purple-200',
          desc: 'Problem requires deep research. Invitation links emailed to top universities; AI is evaluating incoming capability proposals.'
        };
      case 'in_research':
      case 'routed_to_university':
        return {
          step: 4,
          badge: 'Assigned to University Academic Workspace',
          color: 'text-indigo-800 bg-indigo-50 border-indigo-200',
          desc: 'Admin assigned a top-ranked university. Researchers are working in their digital workspace.'
        };
      case 'output_submitted':
        return {
          step: 5,
          badge: 'Research Output & Blueprint Submitted',
          color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
          desc: 'University researchers submitted the final solution deliverable for state validation.'
        };
      case 'resolved':
        return {
          step: 6,
          badge: 'Problem Resolved & Implemented',
          color: 'text-emerald-800 bg-emerald-100 border-emerald-300',
          desc: 'The civic issue has been resolved on-ground according to state verification.'
        };
      default:
        return {
          step: 1,
          badge: status,
          color: 'text-slate-700 bg-slate-100 border-slate-200',
          desc: 'Processing issue status.'
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Breadcrumb */}
        <div className="text-[13px] text-slate-500 mb-6 font-medium">
          <span className="hover:underline cursor-pointer">Home</span> &gt; <span className="font-semibold text-slate-700">Track Civic Issue Lifecycle</span>
        </div>

        <h1 className="text-3xl font-serif text-[#123158] mb-2 font-bold tracking-tight">Track Problem Lifecycle</h1>
        <p className="text-slate-600 mb-8 text-sm">
          Enter your reference ID to view AI triage, administrative approval status, municipal dispatches, or academic research milestones.
        </p>
        
        {/* Search Box */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-2xs mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value.trim())}
              placeholder="e.g. JH-26-09A4F" 
              className="flex-grow text-sm p-3.5 border border-slate-300 rounded focus:outline-none focus:border-[#123158] transition font-mono"
            />
            <button 
              onClick={handleTrack}
              disabled={loading}
              className="bg-[#123158] hover:bg-[#0c223e] disabled:bg-slate-400 text-white font-bold py-3.5 px-7 rounded transition flex items-center justify-center gap-2 cursor-pointer shadow-xs text-sm"
            >
              {loading ? "Tracking..." : <><Search className="w-4 h-4" /> Track Status</>}
            </button>
          </div>
          {error && <p className="text-red-600 text-xs mt-3 font-medium">{error}</p>}
        </div>

        {/* Complaint Result */}
        {complaint && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* Header / ID / Current Stage */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Tracking Number</span>
                <h2 className="text-2xl font-bold font-mono text-[#123158]">{complaint.id}</h2>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5" /> {complaint.location}
                </div>
              </div>

              {(() => {
                const stage = getLifecycleStage(complaint.status);
                return (
                  <div className={`px-3 py-1.5 rounded text-xs font-bold border ${stage.color}`}>
                    {stage.badge}
                  </div>
                );
              })()}
            </div>

            {/* Visual Step Progress Bar */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Lifecycle Progression
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                
                {/* Step 1 */}
                <div className="p-2.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold">
                  <span className="block text-[10px] text-emerald-600">Step 1</span>
                  Citizen Registered
                </div>

                {/* Step 2 */}
                <div className={`p-2.5 rounded border font-semibold ${
                  complaint.aiAnalysis ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <span className="block text-[10px] text-emerald-600">Step 2</span>
                  AI Analysis & Triage
                </div>

                {/* Step 3 */}
                <div className={`p-2.5 rounded border font-semibold ${
                  complaint.status !== 'pending_govt_approval' && complaint.status !== 'submitted' && complaint.status !== 'ai_reviewed'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}>
                  <span className="block text-[10px] text-slate-500">Step 3</span>
                  Admin Route Approval
                </div>

                {/* Step 4 */}
                <div className={`p-2.5 rounded border font-semibold ${
                  complaint.status === 'resolved' || complaint.status === 'output_submitted' || complaint.status === 'in_research'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <span className="block text-[10px] text-slate-500">Step 4</span>
                  Execution / Research
                </div>

              </div>
            </div>

            {/* Problem Description */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Issue Description</h3>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded border border-slate-200">
                {complaint.description}
              </p>
            </div>

            {/* AI Technical Analysis */}
            {complaint.aiAnalysis && (
              <div className="bg-[#f8fafd] border border-blue-200 p-4 rounded-lg text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-[#123158] flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> AI Triage Assessment
                  </h4>
                  <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    Category: {complaint.aiAnalysis.category}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  <strong className="text-slate-800">Triage Decision: </strong> {complaint.aiAnalysis.reasoning}
                </p>
                <div className="flex flex-wrap gap-4 pt-2 border-t border-blue-100 text-[11px] text-slate-500">
                  <span>Routing Recommendation: <strong className="text-slate-800">{complaint.aiAnalysis.recommendedPath === 'research' ? '🔬 Academic Research' : '🛠️ Municipal Repair'}</strong></span>
                  <span>Scope Budget: <strong className="text-slate-800">{complaint.aiAnalysis.estimatedBudgetRange}</strong></span>
                </div>
              </div>
            )}

            {/* Municipal Route Details if active */}
            {complaint.status === 'municipal_repair_assigned' && complaint.municipalDetails && (
              <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-lg text-xs">
                <h4 className="font-bold text-blue-900 text-sm flex items-center gap-1.5 mb-1">
                  <Building2 className="w-4 h-4 text-blue-700" /> Municipal Repair Dispatch
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  Dispatched to <strong>{complaint.municipalDetails.assignedMunicipality}</strong> ({complaint.municipalDetails.dispatchedEmail}).
                </p>
                <p className="text-slate-600 mt-1">
                  <strong>Ground Action: </strong> {complaint.municipalDetails.actionRequired}
                </p>
              </div>
            )}

            {/* University Research Route if active */}
            {complaint.universityRoute && (
              <div className="bg-purple-50/50 border border-purple-200 p-4 rounded-lg text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-purple-900 text-sm flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-purple-700" /> Academic Research Lifecycle
                  </h4>
                  {complaint.universityRoute.selectedUniversity && (
                    <span className="font-bold text-xs bg-purple-100 text-purple-900 px-2 py-0.5 rounded">
                      Assigned: {complaint.universityRoute.selectedUniversity}
                    </span>
                  )}
                </div>

                {complaint.universityRoute.interests && complaint.universityRoute.interests.length > 0 && (
                  <div>
                    <span className="text-slate-600 font-bold block mb-1">
                      University Capability Submissions Evaluated by AI:
                    </span>
                    <div className="space-y-1.5">
                      {complaint.universityRoute.interests.map((int, i) => (
                        <div key={i} className="bg-white p-2 rounded border border-purple-100 flex items-center justify-between">
                          <span className="font-medium text-slate-800">
                            #{int.aiRank || i + 1} {int.universityName} ({int.expectedTimelineWeeks} weeks)
                          </span>
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Fit Score: {int.aiFitScore || 90}/100
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Workspace updates */}
                {complaint.universityRoute.workspaceUpdates && complaint.universityRoute.workspaceUpdates.length > 0 && (
                  <div className="pt-2 border-t border-purple-100">
                    <span className="text-slate-600 font-bold block mb-1.5">Active Research Milestones:</span>
                    <div className="space-y-1.5">
                      {complaint.universityRoute.workspaceUpdates.map((u, i) => (
                        <div key={i} className="bg-white p-2 rounded border border-slate-200">
                          <div className="flex items-center justify-between font-bold text-slate-800">
                            <span>{u.title}</span>
                            <span className="text-[10px] text-slate-500 font-normal">{u.stage}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-0.5">{u.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Final Deliverable */}
                {complaint.universityRoute.finalOutput && (
                  <div className="mt-2 p-3 bg-white border border-emerald-400 rounded">
                    <span className="font-bold text-emerald-800 text-xs block mb-1">
                      ✅ Final Solution Output: {complaint.universityRoute.finalOutput.deliverableType}
                    </span>
                    <p className="text-slate-700 leading-snug">{complaint.universityRoute.finalOutput.executiveSummary}</p>
                    <p className="text-slate-500 text-[11px] mt-1">
                      <strong>Recommendations:</strong> {complaint.universityRoute.finalOutput.recommendations}
                    </p>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
