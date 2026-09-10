import React from 'react'
import { Building2 } from 'lucide-react'

export default function PartnersPage() {
  const partners = [
    { name: "Jharkhand State Livelihood Promotion Society", type: "State Agency" },
    { name: "Digital India Corporation", type: "National Initiative" },
    { name: "Tribal Research Institute", type: "Research Foundation" }
  ]

  return (
    <div className="py-14 w-full px-6">
      <span className="text-sm uppercase font-bold tracking-wider text-slate-400 block mb-1">Ecosystem</span>
      <h1 className="text-4xl font-serif text-slate-900 mb-8">Implementation Partners</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {partners.map((p, i) => (
          <div key={i} className="border border-slate-200 p-6 rounded bg-white">
            <Building2 className="w-6 h-6 text-[#204482] mb-4" />
            <h3 className="font-bold text-slate-900 text-lg mb-1">{p.name}</h3>
            <p className="text-sm text-slate-500">{p.type}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
