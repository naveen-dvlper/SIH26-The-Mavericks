import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  MapPin, Clock, Send, CheckCircle2, ShieldCheck, 
  Building2, AlertCircle, PlusCircle, ArrowRight, Lock
} from 'lucide-react';
import { apiService } from '../services/apiService';

export default function UniversityWorkspacePage() {
  const { user, isAuthenticated, isUniversity } = useAuth();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState(null);

  // New milestone update
  const [newUpdateTitle, setNewUpdateTitle] = useState('');
  const [newUpdateNote, setNewUpdateNote] = useState('');
  const [newUpdateStage, setNewUpdateStage] = useState('Field Prototyping & Sampling');
  const [postingUpdate, setPostingUpdate] = useState(false);

  // Final output modal
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [execSummary, setExecSummary] = useState('');
  const [deliverableType, setDeliverableType] = useState('Engineering Blueprint');
  const [keyFindings, setKeyFindings] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [submittingFinal, setSubmittingFinal] = useState(false);

  const myUniversityName = user?.institution || user?.agency || 'BIT Mesra';

  const fetchComplaints = async () => {
    try {
      const data = await apiService.getComplaints();
      if (Array.isArray(data)) {
        setComplaints(data);
      }
    } catch (err) {
      console.warn('Failed to load complaints in workspace:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Filter assigned projects for this university
  const assignedProblems = complaints.filter(c => 
    c.status === 'in_research' || 
    c.status === 'output_submitted' || 
    c.status === 'routed_to_university' ||
    c.universityRoute?.selectedUniversity?.toLowerCase().includes(myUniversityName.toLowerCase())
  );

  const activeProb = selectedProblem || (assignedProblems.length > 0 ? assignedProblems[0] : null);

  const handleAddWorkspaceUpdate = async (e) => {
    e.preventDefault();
    if (!activeProb) return;

    setPostingUpdate(true);
    try {
      const data = await apiService.postWorkspaceUpdate(activeProb.id, {
        title: newUpdateTitle,
        note: newUpdateNote,
        stage: newUpdateStage,
        author: `${user?.name || 'Dr. Ananya Sen'} (${myUniversityName})`
      });

      if (data && data.success) {
        setNewUpdateTitle('');
        setNewUpdateNote('');
        fetchComplaints();
        setSelectedProblem(data.complaint);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPostingUpdate(false);
    }
  };

  const handleSubmitFinalOutput = async (e) => {
    e.preventDefault();
    if (!activeProb) return;

    setSubmittingFinal(true);
    try {
      const data = await apiService.submitFinalOutput(activeProb.id, {
        executiveSummary: execSummary,
        deliverableType,
        keyFindings,
        recommendations
      });

      if (data && data.success) {
        setShowFinalModal(false);
        setExecSummary('');
        setKeyFindings('');
        setRecommendations('');
        fetchComplaints();
        setSelectedProblem(data.complaint);
        alert('Final Deliverable Output transmitted to State Government Admin for closure and implementation!');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting deliverable: ' + (err.message || 'Network issue'));
    } finally {
      setSubmittingFinal(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6 text-center">
          <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
            <div className="w-14 h-14 bg-amber-50 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-[#123158] mb-2">University Login Required</h1>
            <p className="text-slate-600 text-sm mb-6">
              The digital research workspace is restricted to allocated institutional researchers. Please log in with your assigned university nodal credentials.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 w-full bg-[#123158] hover:bg-[#0d223f] text-white font-bold py-3 px-6 rounded transition text-sm"
            >
              Sign In to University Portal <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const updates = activeProb?.universityRoute?.workspaceUpdates || [];
  const finalOutput = activeProb?.universityRoute?.finalOutput;

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Breadcrumb */}
        <div className="text-[13px] text-slate-500 mb-6 font-medium">
          <Link to="/" className="hover:underline hover:text-[#123158]">Home</Link>
          <span className="mx-2">&gt;</span>
          <Link to="/department" className="hover:underline hover:text-[#123158]">Department Portal</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-[#123158] font-semibold">University Digital Research Workspace</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b border-slate-200 pb-4 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#123158] text-white uppercase tracking-wider">
                Institutional Research Lab Space
              </span>
              <span className="text-xs text-slate-500">
                {user?.name} • {myUniversityName} ({user?.department || 'Academic Coordinator'})
              </span>
            </div>
            <h1 className="text-[32px] font-serif text-[#123158] font-bold tracking-tight">
              State Challenge Research Workspace
            </h1>
            <p className="text-[14px] text-slate-600 max-w-2xl">
              Collaborative space allocated by Government Admin for commissioned civic challenges. Log ongoing research notes, milestone tests, and transmit finalized deliverables.
            </p>
          </div>

          <Link
            to="/department"
            className="text-xs font-bold text-[#123158] hover:underline flex items-center gap-1 self-start md:self-auto"
          >
            ← Back to Department Interest Portal
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400">Loading research workspace...</div>
        ) : assignedProblems.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-700">No active research projects currently assigned to {myUniversityName}.</p>
            <p className="text-xs text-slate-400 mt-1">
              Visit the <Link to="/department" className="text-[#123158] font-bold underline">Department Portal</Link> to view open problem briefs and submit your university's interest proposal.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Left list of problems */}
            <div className="lg:col-span-1 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Assigned State Challenges ({assignedProblems.length})
              </h3>

              {assignedProblems.map((prob) => {
                const isSelected = activeProb?.id === prob.id;

                return (
                  <div 
                    key={prob.id}
                    onClick={() => setSelectedProblem(prob)}
                    className={`p-4 rounded-lg border cursor-pointer transition ${
                      isSelected ? 'bg-white border-[#123158] shadow-sm ring-1 ring-[#123158]' : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-mono font-bold text-[#123158]">{prob.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        prob.status === 'output_submitted' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {prob.status === 'output_submitted' ? 'Output Submitted' : 'In Research'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 line-clamp-1 mb-1">
                      {prob.aiAnalysis?.category || 'Civic Research Project'}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{prob.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Right workspace details */}
            {activeProb && (
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-bold uppercase">
                        Assigned Project Workspace
                      </span>
                      <span className="font-mono text-xs font-bold text-[#123158]">{activeProb.id}</span>
                    </div>
                    <h2 className="text-xl font-bold font-serif text-[#123158] mt-1">
                      {activeProb.aiAnalysis?.category || 'Civic Infrastructure Challenge'}
                    </h2>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5" /> {activeProb.location}
                    </p>
                  </div>

                  {!finalOutput && (
                    <button
                      onClick={() => setShowFinalModal(true)}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded text-xs transition cursor-pointer shadow-xs shrink-0"
                    >
                      Submit Final Deliverable
                    </button>
                  )}
                </div>

                {/* Problem Statement Card */}
                <div className="bg-slate-50 border border-slate-200 rounded p-4 text-xs">
                  <span className="font-bold text-[#123158] block mb-1">Problem Statement & Scope:</span>
                  <p className="text-slate-700 leading-relaxed mb-2">{activeProb.description}</p>
                  {activeProb.aiAnalysis?.reasoning && (
                    <p className="text-slate-600 border-t border-slate-200 pt-2 text-[11px]">
                      <strong className="text-slate-700">AI Context: </strong> {activeProb.aiAnalysis.reasoning}
                    </p>
                  )}
                </div>

                {/* Final Output if already submitted */}
                {finalOutput && (
                  <div className="p-4 bg-emerald-50/70 border border-emerald-300 rounded-lg text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Final Research Deliverable Submitted ({finalOutput.deliverableType})
                      </span>
                      <span className="text-slate-400 text-[11px]">
                        {new Date(finalOutput.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed mb-2">
                      <strong>Executive Summary: </strong> {finalOutput.executiveSummary}
                    </p>
                    <p className="text-slate-600 mb-1">
                      <strong>Key Findings: </strong> {finalOutput.keyFindings}
                    </p>
                    <p className="text-slate-600">
                      <strong>Execution Steps: </strong> {finalOutput.recommendations}
                    </p>
                  </div>
                )}

                {/* Post New Milestone Update */}
                <div className="bg-slate-50 border border-slate-200 rounded p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                    <PlusCircle className="w-3.5 h-3.5 text-blue-600" />
                    Log Progress Note or Milestone
                  </h4>
                  
                  <form onSubmit={handleAddWorkspaceUpdate} className="space-y-3 text-xs">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Milestone Title</label>
                        <input
                          type="text"
                          value={newUpdateTitle}
                          onChange={(e) => setNewUpdateTitle(e.target.value)}
                          placeholder="E.g., Soil Sample Compaction Analysis"
                          required
                          className="w-full p-2 border border-slate-300 rounded bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-semibold mb-1">Research Stage</label>
                        <select
                          value={newUpdateStage}
                          onChange={(e) => setNewUpdateStage(e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded bg-white"
                        >
                          <option>Literature & Problem Definition</option>
                          <option>Field Prototyping & Sampling</option>
                          <option>Feasibility & Lab Testing</option>
                          <option>Final Solution Synthesis</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Findings & Progress Description</label>
                      <textarea
                        rows={3}
                        value={newUpdateNote}
                        onChange={(e) => setNewUpdateNote(e.target.value)}
                        placeholder="Detail the technical actions, parameters observed, or laboratory testing metrics..."
                        required
                        className="w-full p-2 border border-slate-300 rounded bg-white resize-none"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={postingUpdate}
                        className="bg-[#123158] hover:bg-[#0c223e] text-white font-bold px-4 py-2 rounded transition cursor-pointer"
                      >
                        {postingUpdate ? 'Recording Milestone...' : 'Save Milestone Note'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Milestone history trail */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                    Milestone Log ({updates.length})
                  </h4>

                  {updates.length === 0 ? (
                    <div className="p-4 border border-dashed border-slate-200 rounded text-center text-slate-400 text-xs">
                      No research updates posted yet. Use the form above to record progress.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {updates.map((upd, idx) => (
                        <div key={upd.id || idx} className="p-3 border border-slate-200 rounded text-xs bg-white">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-[#123158]">{upd.title}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
                              {upd.stage}
                            </span>
                          </div>
                          <p className="text-slate-600 leading-relaxed">{upd.note}</p>
                          <div className="text-[10px] text-slate-400 mt-2 flex items-center justify-between">
                            <span>Logged by: {upd.author}</span>
                            <span>{new Date(upd.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        )}

        {/* Modal: Final Output Submission */}
        {showFinalModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl border border-slate-200 text-xs">
              <div className="flex items-start justify-between pb-3 border-b border-slate-200 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Submit Final Research Deliverable
                  </h3>
                  <p className="text-slate-500 text-xs">
                    This official output will be transmitted to the Government Admin for validation and problem closure.
                  </p>
                </div>
                <button 
                  onClick={() => setShowFinalModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-base"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitFinalOutput} className="space-y-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Deliverable Format</label>
                  <select
                    value={deliverableType}
                    onChange={(e) => setDeliverableType(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded bg-white"
                  >
                    <option>Engineering Blueprint</option>
                    <option>Policy Framework</option>
                    <option>Working Prototype</option>
                    <option>Pilot Implementation Plan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Executive Summary</label>
                  <textarea
                    rows={3}
                    value={execSummary}
                    onChange={(e) => setExecSummary(e.target.value)}
                    placeholder="Summarize the core engineering solution or policy mechanism synthesized..."
                    required
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Key Scientific Findings & Simulation Data</label>
                  <textarea
                    rows={3}
                    value={keyFindings}
                    onChange={(e) => setKeyFindings(e.target.value)}
                    placeholder="Highlight specific gradient calculations, runoff coefficients, or particulate knockdown percentages..."
                    required
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Recommended Municipal Execution Steps</label>
                  <textarea
                    rows={2}
                    value={recommendations}
                    onChange={(e) => setRecommendations(e.target.value)}
                    placeholder="Actionable steps for municipal engineers to execute this solution on ground..."
                    required
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setShowFinalModal(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded font-semibold hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingFinal}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 rounded font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {submittingFinal ? 'Transmitting Output...' : 'Submit Deliverable to Government'}
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
