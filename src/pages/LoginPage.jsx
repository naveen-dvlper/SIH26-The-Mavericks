import React from 'react'

export default function LoginPage() {
  return (
    <div className="py-16 bg-slate-50 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white p-8 border border-slate-200 rounded shadow-sm">
        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Platform Access</h2>
        <p className="text-sm text-slate-500 mb-6">Enter your registered credentials to manage solutions.</p>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email or Username</label>
            <input type="text" className="w-full text-sm p-2.5 border border-slate-200 rounded outline-none focus:border-[#204482]" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input type="password" className="w-full text-sm p-2.5 border border-slate-200 rounded outline-none focus:border-[#204482]" />
          </div>
          <button type="submit" className="w-full bg-[#204482] hover:bg-[#183668] text-white text-sm font-semibold py-2.5 rounded transition">
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}
