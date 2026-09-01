import { createContext, useContext, useState } from 'react'
import { translations } from '../i18n/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({children}) {
    const [language, setLanguage] = useState('uk')
    const t = (key) => translations[language][key] ?? key

    return(
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage має використовуватись всередині LanguageProvider')
  }
  return context
}