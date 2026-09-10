import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, Clock } from 'lucide-react'
import { challengesData } from '../data/challenges'

export default function ChallengeDetailPage() {
  const { id } = useParams()
  const challenge = challengesData.find(c => c.id === id) || challengesData[0]

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="w-full px-6">
        
        <Link to="/challenges" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#204482] hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to registry
        </Link>

        <div className="border-b border-slate-200 pb-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-base text-slate-500 font-semibold">{challenge.id}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium border ${challenge.statusColor}`}>
              {challenge.status}
            </span>
          </div>
          <h1 className="text-4xl font-serif text-slate-900 mb-4">{challenge.title}</h1>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span><strong>Location:</strong> {challenge.location}</span>
            <span>•</span>
            <span><strong>Sector:</strong> {challenge.category}</span>
          </div>
        </div>

        <div className="space-y-6 text-base text-slate-700 leading-relaxed">
          <h3 className="text-lg font-bold text-slate-900">Challenge Summary</h3>
          <p>{challenge.description}</p>
          <p>
            This challenge was submitted through the citizen portal and is assigned to the Jharkhand Academic & Research consortium for domain review and feasibility verification.
          </p>
        </div>

        <div className="mt-10 p-6 bg-slate-50 border border-slate-200 rounded">
          <h4 className="text-sm uppercase font-bold tracking-wider text-slate-500 mb-4">Status Trail</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" /> Submission received and verified
            </li>
            <li className="flex items-center gap-2 text-amber-700">
              <Clock className="w-4 h-4" /> Departmental review & university dispatch pending
            </li>
          </ul>
        </div>

      </div>
    </div>
  )
}
