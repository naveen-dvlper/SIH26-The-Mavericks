import React from 'react'
import { GraduationCap } from 'lucide-react'

export default function UniversitiesPage() {
  const unis = [
    { name: "Birla Institute of Technology, Mesra", location: "Ranchi", focus: "Engineering & Applied Computing" },
    { name: "IIT (ISM) Dhanbad", location: "Dhanbad", focus: "Mining, Geo-resources & Energy" },
    { name: "Ranchi University", location: "Ranchi", focus: "Social Policy & Environmental Science" }
  ]

  return (
    <div className="py-14 w-full px-6">
      <span className="text-sm uppercase font-bold tracking-wider text-slate-400 block mb-1">Academic Network</span>
      <h1 className="text-4xl font-serif text-slate-900 mb-8">Participating Universities</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {unis.map((u, i) => (
          <div key={i} className="border border-slate-200 p-6 rounded bg-white">
            <GraduationCap className="w-6 h-6 text-[#204482] mb-4" />
            <h3 className="font-bold text-slate-900 text-lg mb-1">{u.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{u.location}</p>
            <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-700 font-medium">
              {u.focus}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
