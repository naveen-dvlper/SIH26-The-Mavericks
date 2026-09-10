import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations } from '../utils/translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('setu_lang') || 'en'
  })

  useEffect(() => {
    localStorage.setItem('setu_lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const t = (key) => translations[lang]?.[key] || translations['en']?.[key] || key

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
