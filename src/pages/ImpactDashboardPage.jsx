import React from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Building2, Users, MapPin, Trophy } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts'

export default function ImpactDashboardPage() {
  const categoryData = [
    { name: 'Infrastructure', value: 420 },
    { name: 'Sanitation', value: 310 },
    { name: 'Traffic', value: 210 },
    { name: 'Water', value: 180 },
    { name: 'Electricity', value: 120 },
  ]

  const universityRankings = [
    { rank: 1, name: 'BIT Mesra', district: 'Ranchi', solved: 124, active: 12, score: 98 },
    { rank: 2, name: 'NIT Jamshedpur', district: 'East Singhbhum', solved: 98, active: 8, score: 85 },
    { rank: 3, name: 'IIT (ISM) Dhanbad', district: 'Dhanbad', solved: 85, active: 15, score: 82 },
    { rank: 4, name: 'Ranchi University', district: 'Ranchi', solved: 42, active: 5, score: 64 },
    { rank: 5, name: 'Vinoba Bhave University', district: 'Hazaribagh', solved: 28, active: 3, score: 45 },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12">
      <div className="max-w-[1400px] mx-auto px-6">
        
        {/* Breadcrumbs */}
        <div className="text-[13px] text-slate-500 mb-6 font-medium">
          <Link to="/" className="hover:underline hover:text-[#123158]">Home</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-[#123158] font-semibold">Impact Dashboard</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-[34px] font-serif text-[#123158] mb-2 font-bold tracking-tight">Statewide Impact Dashboard</h1>
          <p className="text-[15px] text-slate-600">
            Live overview of civic issues routed and resolved across Jharkhand.
          </p>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Card 1 */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 relative shadow-sm overflow-hidden flex flex-col justify-between h-[140px]">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#f5a623]"></div>
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">Problems Reported</span>
              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100">
                <AlertCircle className="w-4 h-4 text-[#f5a623]" />
              </div>
            </div>
            <div className="text-4xl font-bold text-[#123158]">4,821</div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 relative shadow-sm overflow-hidden flex flex-col justify-between h-[140px]">
            <div className="absolute top-0 left-0 right-0 h-1 bg-green-600"></div>
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">Verified Deployments</span>
              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="text-4xl font-bold text-[#123158]">1,245</div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 relative shadow-sm overflow-hidden flex flex-col justify-between h-[140px]">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#123158]"></div>
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">Depts Engaged</span>
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                <Building2 className="w-4 h-4 text-[#123158]" />
              </div>
            </div>
            <div className="text-4xl font-bold text-[#123158]">34</div>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 relative shadow-sm overflow-hidden flex flex-col justify-between h-[140px]">
            <div className="absolute top-0 left-0 right-0 h-1 bg-blue-400"></div>
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">People Impacted (Est)</span>
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                <Users className="w-4 h-4 text-blue-500" />
              </div>
            </div>
            <div className="text-4xl font-bold text-[#123158]">850k+</div>
          </div>

        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Heatmap Placeholder */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-[16px] font-bold text-[#123158] mb-6">Resolution Heatmap (District-wise)</h3>
            <div className="border border-slate-200 rounded-lg h-[320px] bg-slate-50 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
              <div className="relative z-10 bg-white border border-slate-200 rounded-lg shadow-sm p-8 text-center max-w-sm">
                <MapPin className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <h4 className="text-[13px] font-bold text-slate-800 tracking-wide uppercase mb-2">Jharkhand Map Visualization</h4>
                <p className="text-[12px] text-slate-500 leading-relaxed">
                  Live deployment clusters concentrated in Ranchi, Jamshedpur, and Dhanbad.
                </p>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-[16px] font-bold text-[#123158] mb-6">Resolved Problems by Category</h3>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                  />
                  <Bar dataKey="value" fill="#123158" radius={[2, 2, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* University Rankings */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-[#f5a623]" />
            <div>
              <h3 className="text-[18px] font-bold text-[#123158]">University Impact Rankings</h3>
              <p className="text-[13px] text-slate-500">Top performing academic institutions based on successful problem resolutions.</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-4 px-4 text-[12px] font-bold text-slate-500 uppercase tracking-wider w-16 text-center">Rank</th>
                  <th className="py-4 px-4 text-[12px] font-bold text-slate-500 uppercase tracking-wider">Institution</th>
                  <th className="py-4 px-4 text-[12px] font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">District</th>
                  <th className="py-4 px-4 text-[12px] font-bold text-slate-500 uppercase tracking-wider text-right">Problems Solved</th>
                  <th className="py-4 px-4 text-[12px] font-bold text-slate-500 uppercase tracking-wider text-right hidden sm:table-cell">Active Projects</th>
                  <th className="py-4 px-4 text-[12px] font-bold text-slate-500 uppercase tracking-wider text-right">Impact Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {universityRankings.map((uni, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 text-center">
                      {uni.rank <= 3 ? (
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                          uni.rank === 1 ? 'bg-amber-100 text-amber-700' : 
                          uni.rank === 2 ? 'bg-slate-200 text-slate-700' : 
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {uni.rank}
                        </div>
                      ) : (
                        <span className="text-[15px] font-semibold text-slate-500">{uni.rank}</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-[15px] font-bold text-[#123158]">{uni.name}</div>
                    </td>
                    <td className="py-4 px-4 hidden sm:table-cell">
                      <span className="text-[14px] text-slate-600">{uni.district}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-[15px] font-semibold text-green-600">{uni.solved}</span>
                    </td>
                    <td className="py-4 px-4 text-right hidden sm:table-cell">
                      <span className="text-[14px] text-slate-600">{uni.active}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="inline-flex items-center px-2.5 py-1 rounded bg-[#123158]/5 text-[#123158] font-bold text-[14px]">
                        {uni.score}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}

