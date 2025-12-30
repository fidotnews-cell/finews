"use client"

import * as React from "react"
import { Globe, Check } from "lucide-react"
import { useLanguage } from "./LanguageProvider"

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
] as const

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = React.useState(false)
  const { language, setLanguage } = useLanguage()
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLanguageChange = (code: string) => {
    setLanguage(code as any)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#1e2327] transition-colors text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white w-full"
      >
        <Globe className="w-4 h-4" />
        <span>{LANGUAGES.find(l => l.code === language)?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-full bg-white dark:bg-[#15191c] border border-gray-200 dark:border-[#222] rounded-lg shadow-xl overflow-hidden z-50">
          <div className="py-1 max-h-60 overflow-y-auto">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-[#ccc] hover:bg-gray-50 dark:hover:bg-[#1e2327] flex items-center justify-between transition-colors"
              >
                <span>{lang.name}</span>
                {language === lang.code && <Check className="w-3 h-3 text-black dark:text-white" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
