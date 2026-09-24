import React, { useState } from 'react';
import { Building2, GraduationCap, Lock, Mail, ArrowRight, ShieldAlert, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export default function LoginPage() {
  const { login, user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState('government');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Read any guard redirect messages (e.g. from ProtectedRoute)
  const redirectMessage = location.state?.message;
  const redirectTarget = location.state?.from?.pathname;

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanEmail = (email || '').trim();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail) {
      setErrorMsg('Please enter your official Email ID.');
      return;
    }
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('Please enter a valid official Email ID format.');
      return;
    }
    if (!cleanPassword) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      await login({ email: cleanEmail, password: cleanPassword, role });
      
      // Determine redirection target
      if (role === 'government') {
        const dest = redirectTarget || '/admin';
        navigate(dest, { replace: true });
      } else {
        const dest = redirectTarget && redirectTarget !== '/admin' ? redirectTarget : '/workspace';
        navigate(dest, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-14 bg-slate-50 min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="w-full max-w-md px-6 relative z-10">

        {/* Security Alert if redirected from Protected Route */}
        {redirectMessage && (
          <div className="mb-4 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 shadow-xs">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm mb-0.5">Authentication Required</span>
              <span>{redirectMessage}</span>
            </div>
          </div>
        )}

        {/* If already authenticated, show status box */}
        {isAuthenticated && (
          <div className="mb-4 p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-950 text-xs flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#123158]" />
              <span>Signed in as <strong className="font-bold">{user?.name}</strong> ({isAdmin ? 'Govt Admin' : 'University'})</span>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link to="/admin" className="font-bold text-[#123158] underline hover:text-blue-700">
                  Go to Portal
                </Link>
              )}
              <button 
                onClick={logout} 
                className="font-bold text-red-600 hover:underline"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-[#123158] p-6 text-center text-white">
            <div className="inline-flex p-2 bg-white/10 rounded-full mb-2">
              <Building2 className="w-6 h-6 text-amber-400" />
            </div>
            <h1 className="text-2xl font-serif text-white mb-1">Official Portal Access</h1>
            <p className="text-blue-200 text-xs">
              Government of Jharkhand • SETU Challenge Resolution Network
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50">
            <button
              type="button"
              id="tab-role-government"
              onClick={() => handleRoleChange('government')}
              className={`flex-1 py-3.5 text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                role === 'government' 
                  ? 'text-[#123158] border-b-2 border-[#123158] bg-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Government Official
            </button>
            <button
              type="button"
              id="tab-role-university"
              onClick={() => handleRoleChange('university')}
              className={`flex-1 py-3.5 text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                role === 'university' 
                  ? 'text-[#123158] border-b-2 border-[#123158] bg-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              University Nodal
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-8">
            {errorMsg && (
              <div className="mb-5 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {role === 'government' ? 'Official Government Email ID' : 'Institutional Email Address'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="email" 
                    id="input-login-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={role === 'government' ? "admin@jharkhand.gov.in" : "nodal@bitmesra.ac.in"}
                    required
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded focus:border-[#123158] focus:ring-1 focus:ring-[#123158] outline-none transition"
                  />
                </div>
                {role === 'government' && (
                  <p className="text-[11px] text-slate-500 mt-1">
                    Accepts *.gov.in or official nodal accounts.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="password" 
                    id="input-login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded focus:border-[#123158] focus:ring-1 focus:ring-[#123158] outline-none transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-[#123158] focus:ring-[#123158]" 
                  />
                  <span className="text-slate-600">Remember session</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowHelpModal(true)}
                  className="text-[#204482] font-semibold hover:underline cursor-pointer bg-transparent border-0 p-0 text-xs"
                >
                  Need Help?
                </button>
              </div>

              <button 
                type="submit"
                id="btn-submit-login"
                disabled={loading}
                className="w-full bg-[#123158] hover:bg-[#0d223f] disabled:bg-slate-400 text-white font-bold py-3 rounded mt-3 flex items-center justify-center gap-2 transition text-sm shadow-xs cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <span>Official Secure Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Modal: Authorized Credentials Reference */}
        {showHelpModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4 backdrop-blur-xs">
            <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-slate-200 text-xs">
              <div className="flex items-start justify-between pb-3 border-b border-slate-200 mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#123158]">
                    Official Portal Access Directory
                  </h3>
                  <p className="text-slate-500 text-xs">
                    Defined credentials for secure authorized portal sign-in.
                  </p>
                </div>
                <button 
                  onClick={() => setShowHelpModal(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold text-base cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded p-3.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#123158] text-sm mb-1.5">
                    <Building2 className="w-4 h-4 text-[#123158]" />
                    Government Administrator Login
                  </div>
                  <div className="space-y-1 text-slate-700">
                    <p><strong>Official Email:</strong> <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[#123158]">admin@jharkhand.gov.in</code></p>
                    <p><strong>Security Password:</strong> <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[#123158]">Admin@Jharkhand2026</code></p>
                    <p className="text-[11px] text-slate-500 mt-1">Authorized for State Nodal Officers and Department Secretaries.</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded p-3.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#123158] text-sm mb-1.5">
                    <GraduationCap className="w-4 h-4 text-[#123158]" />
                    University Nodal Partner Login
                  </div>
                  <div className="space-y-1 text-slate-700">
                    <p><strong>Institutional Email:</strong> <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[#123158]">nodal@bitmesra.ac.in</code></p>
                    <p><strong>Security Password:</strong> <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[#123158]">BitMesra@2026</code></p>
                    <p className="text-[11px] text-slate-500 mt-1">Also accepts temporary credentials assigned to allocated universities by State Admin.</p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded p-3 text-[11px] text-amber-900 leading-relaxed">
                  <strong>Strict Security Policy:</strong> Random inputs or unauthorized emails will be rejected by the National Informatics Centre (NIC) authentication gateway.
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200 mt-4">
                <button
                  type="button"
                  onClick={() => setShowHelpModal(false)}
                  className="bg-[#123158] hover:bg-[#0c223e] text-white px-4 py-2 rounded font-bold text-xs cursor-pointer"
                >
                  Understood
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security Compliance Footnote */}
        <div className="mt-6 text-center text-[11px] text-slate-500">
          <p>National Informatics Centre (NIC) • State Data Centre Standard Compliant</p>
          <p className="mt-0.5">Unauthorized access attempts are logged and monitored under IT Act 2000.</p>
        </div>

      </div>
    </div>
  );
}
