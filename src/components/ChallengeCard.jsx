import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function ChallengeCard({ item }) {
  return (
    <article className="border border-slate-200 rounded p-6 bg-white hover:shadow-md transition flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between text-sm text-slate-500 mb-4 pb-3 border-b border-slate-100">
          <span className="font-mono font-medium">{item.id}</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${item.statusColor}`}>
            {item.status}
          </span>
        </div>
        <h4 className="text-lg font-semibold text-slate-900 mb-2 leading-snug">
          {item.title}
        </h4>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          {item.description}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <div className="text-xs text-slate-500 mb-4 flex items-center gap-2">
          <span className="text-slate-700 font-medium">{item.category}</span>
          <span>•</span>
          <span>{item.location}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
            <span className={`w-2.5 h-2.5 rounded-full ${item.priorityDot}`}></span> {item.priority}
          </span>
          <Link to={`/challenges/${item.id}`} className="text-slate-400 hover:text-slate-900 transition-colors">
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </article>
  )
}
