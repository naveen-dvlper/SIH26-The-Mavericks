import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ChallengeCard from '../components/ChallengeCard.jsx'
import gsap from 'gsap'
import { useLanguage } from '../context/LanguageContext'
import { challengesData } from '../data/challenges'

export default function HomePage() {
  const containerRef = useRef(null)
  const { t, lang } = useLanguage()

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance animation: words stagger upwards into place
      gsap.from('.gsap-word', {
        y: 28,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
      })

      // 2. Continuous subtle floating movement on the key phrase
      gsap.to('.gsap-float', {
        y: -4,
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.8
      })
    }, containerRef)

    return () => ctx.revert()
  }, [lang]) // Re-run subtle animation cleanly whenever language changes

  return (
    <div ref={containerRef} className="w-full relative">
      {/* Hero Section */}
      <section className="relative bg-[#1a2d42] text-white overflow-hidden min-h-[520px] flex items-center">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=2066&auto=format&fit=crop" 
            alt="Flag Background" 
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#142334] via-[#1a2d42]/90 to-[#101b28]/60"></div>
        </div>

        <div className="relative z-10 w-full px-6 py-20">
          <div className="max-w-3xl">
            <p className="text-base tracking-widest font-semibold uppercase text-slate-300 mb-6">
              {t('hero_dept_tag')}
            </p>

            {/* GSAP Word Movement Title with Multi-language support */}
            <h1 className="text-5xl sm:text-7xl font-serif tracking-tight leading-[1.15] mb-6 select-none overflow-hidden">
              <span className="inline-block gsap-word mr-3">{t('hero_title_1')}</span>
              <br />
              <span className="inline-block gsap-float">
                <span className="italic font-light text-amber-200/90 inline-block gsap-word">
                  {t('hero_title_2')}
                </span>
              </span>
            </h1>

            <p className="text-2xl text-slate-300 font-light leading-relaxed max-w-2xl mb-10">
              {t('hero_desc')}
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <Link to="/report" className="inline-flex items-center gap-2 bg-[#25529f] hover:bg-[#1d4382] text-white text-lg font-medium px-6 py-3 rounded shadow transition">
                {t('btn_submit')} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/challenges" className="inline-flex items-center bg-transparent hover:bg-white/10 text-white border border-slate-400/60 text-lg font-medium px-6 py-3 rounded transition">
                {t('btn_explore')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Intro Banner */}
      <section className="border-b border-slate-200 bg-slate-50/50 py-12">
        <div className="w-full px-6">
          <div className="grid md:grid-cols-2 items-start gap-8">
            <div>
              <span className="text-base font-bold tracking-widest text-[#204482] uppercase block mb-2">The Platform</span>
              <h2 className="text-4xl sm:text-5xl font-serif text-slate-900 tracking-tight">
                A public workflow built around trust.
              </h2>
            </div>
            <div>
              <p className="text-slate-600 text-lg leading-relaxed mb-3">
                Every challenge carries a clear status, a visible trail of activity and a path toward the right university or partner.
              </p>
              <Link to="/how-it-works" className="text-base font-semibold text-[#204482] hover:underline inline-flex items-center gap-1">
                {t('nav_how_it_works')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Registry / Challenges */}
      <section className="py-14 bg-white">
        <div className="w-full px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-base uppercase font-bold tracking-wider text-slate-400 block mb-1">Featured From The Registry</span>
              <h3 className="text-4xl font-serif text-slate-900">Challenges seeking collaboration</h3>
            </div>
            <Link to="/challenges" className="text-base font-bold text-[#204482] hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {challengesData.map((item) => (
              <ChallengeCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-14 bg-slate-50/60 border-t border-slate-200">
        <div className="w-full px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-slate-200">
            <div>
              <span className="text-base uppercase font-bold tracking-wider text-slate-400 block mb-1">Our Principles</span>
              <h3 className="text-5xl font-serif text-slate-900">Designed for responsible action.</h3>
            </div>
            <p className="text-base text-slate-500 max-w-sm mt-3 md:mt-0 text-left md:text-right">
              A platform concept grounded in the values that public digital services should uphold.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <span className="text-base font-mono font-bold text-slate-400 block mb-2">01</span>
              <h4 className="text-xl font-bold text-slate-900 mb-1">Transparency</h4>
              <p className="text-base text-slate-600 leading-relaxed">Clear statuses and visible progress at every stage.</p>
            </div>
            <div>
              <span className="text-base font-mono font-bold text-slate-400 block mb-2">02</span>
              <h4 className="text-xl font-bold text-slate-900 mb-1">Accessibility</h4>
              <p className="text-base text-slate-600 leading-relaxed">A service that works for more people, in more ways.</p>
            </div>
            <div>
              <span className="text-base font-mono font-bold text-slate-400 block mb-2">03</span>
              <h4 className="text-xl font-bold text-slate-900 mb-1">Accountability</h4>
              <p className="text-base text-slate-600 leading-relaxed">An activity history that keeps decisions traceable.</p>
            </div>
            <div>
              <span className="text-base font-mono font-bold text-slate-400 block mb-2">04</span>
              <h4 className="text-xl font-bold text-slate-900 mb-1">Responsible AI</h4>
              <p className="text-base text-slate-600 leading-relaxed">Recommendations assist experts; they never replace review.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
