import React from 'react'

export default function HowItWorksPage() {
  const steps = [
    { num: "01", title: "Challenge Submission", desc: "Citizens, local bodies, or students log practical hurdles affecting community life." },
    { num: "02", title: "Review & Triage", desc: "State coordinators and domain advisors verify problem statements and avoid duplicates." },
    { num: "03", title: "University Collaboration", desc: "Universities pick open briefs as research topics, capstone projects, or field pilots." },
    { num: "04", title: "Implementation & Tracking", desc: "Outcomes and verified pilot results are recorded transparently on the state ledger." }
  ]

  return (
    <div className="py-14 w-full px-6">
      <span className="text-sm uppercase font-bold tracking-wider text-slate-400 block mb-1">Process</span>
      <h1 className="text-4xl font-serif text-slate-900 mb-8">How SETU Works</h1>
      <div className="space-y-6">
        {steps.map((s) => (
          <div key={s.num} className="flex gap-6 p-6 border border-slate-200 rounded bg-white items-start">
            <span className="text-xl font-mono font-bold text-[#204482]">{s.num}</span>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{s.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
