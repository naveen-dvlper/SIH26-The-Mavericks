import React, { useState, useEffect } from 'react'
import { MapPin, Clock, Camera, AlertCircle } from 'lucide-react'

export default function ChallengesPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_BACKEND_URL || '';
    fetch(`${baseUrl}/api/complaints`)
      .then(res => res.json())
      .then(data => {
        setComplaints(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getStatusColor = (status) => {
    if (status === 'submitted') return 'bg-blue-50 text-blue-700 border-blue-200';
    if (status === 'ai_reviewed') return 'bg-purple-50 text-purple-700 border-purple-200';
    if (status === 'pending_govt_approval') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <div className="py-14 bg-slate-50 min-h-screen">
      <div className="w-full px-6 max-w-7xl mx-auto">
        <div className="mb-8 border-b border-slate-200 pb-6">
          <span className="text-sm uppercase font-bold tracking-wider text-slate-400 block mb-1">Registry</span>
          <h1 className="text-4xl font-serif text-slate-900">Explore Registered Problems</h1>
          <p className="text-base text-slate-500 mt-2 max-w-xl">
            Browse all civic issues and problems reported across the state, viewed from the top level without needing to act on them.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-slate-400">
            <span className="animate-pulse">Loading problems...</span>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {complaints.length > 0 ? complaints.map(item => (
              <article key={item.id} className="border border-slate-200 rounded-lg p-6 bg-white hover:shadow-md transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4 pb-3 border-b border-slate-100">
                    <span className="font-mono font-medium text-[#123158]">{item.id}</span>
                    <span className={`px-2.5 py-1 rounded text-[11px] font-bold border capitalize ${getStatusColor(item.status)}`}>
                      {item.status?.replace(/_/g, ' ')}
                    </span>
                  </div>
                  
                  {item.photoUrl && !item.photoUrl.startsWith('blob:') && item.photoUrl !== 'placeholder_image_url' && (
                    <div className="w-full h-40 bg-slate-100 rounded-md mb-4 overflow-hidden">
                      <img src={item.photoUrl} alt="Issue" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <h4 className="text-[17px] font-bold text-slate-800 mb-3 leading-snug">
                    {item.aiAnalysis?.category || "Uncategorized Issue"}
                  </h4>
                  <p className="text-[14px] text-slate-600 leading-relaxed mb-6 line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                  <div className="text-xs text-slate-500 flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{item.location}</span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{new Date(item.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </article>
            )) : (
              <div className="col-span-3 py-12 text-center text-slate-500 bg-white border border-slate-200 rounded-lg">
                <AlertCircle className="w-8 h-8 mx-auto mb-3 text-slate-400" />
                <p>No problems have been registered yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
