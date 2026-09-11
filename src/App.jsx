import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'

import HomePage from './pages/HomePage.jsx'
import ReportProblemPage from './pages/ReportProblemPage.jsx'
import TrackComplaintPage from './pages/TrackComplaintPage.jsx'
import DepartmentPortalPage from './pages/DepartmentPortalPage.jsx'
import ImpactDashboardPage from './pages/ImpactDashboardPage.jsx'
import ChallengesPage from './pages/ChallengesPage.jsx'
import LoginPage from './pages/LoginPage.jsx'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between relative overflow-hidden">
      
      {/* Background layer with natural tones */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0 filter brightness-100 contrast-100"
        style={{ backgroundImage: `url('/SIH-logo.png')` }}
      />

      {/* Balanced 60% overlay: visible watermark without overpowering the content */}
      <div className="fixed inset-0 bg-white/60 pointer-events-none z-0"></div>

      {/* Page Content Layers */}
      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/report" element={<ReportProblemPage />} />
            <Route path="/track" element={<TrackComplaintPage />} />
            <Route path="/department" element={<DepartmentPortalPage />} />
            <Route path="/impact" element={<ImpactDashboardPage />} />
            <Route path="/challenges" element={<ChallengesPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  )
}
