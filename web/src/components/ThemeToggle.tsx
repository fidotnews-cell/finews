"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useLanguage } from "./LanguageProvider"

interface ThemeToggleProps {
  variant?: 'icon' | 'sidebar'
}

export function ThemeToggle({ variant = 'icon' }: ThemeToggleProps) {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const { t } = useLanguage()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light")
  }

  if (!mounted) {
    if (variant === 'sidebar') {
      return (
        <button className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-[#1e2327] transition-colors text-sm font-medium text-gray-600 dark:text-[#999] hover:text-black dark:hover:text-white w-full">
           <div className="w-4 h-4" />
           <span>Loading...</span>
        </button>
      )
    }
    return (
      <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative w-9 h-9">
         <div className="w-5 h-5" />
      </button>
    )
  }

  if (variant === 'sidebar') {
    return (
      <button
        onClick={toggleTheme}
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#1e2327] transition-colors text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white w-full"
      >
        <div className="flex items-center gap-3">
            {resolvedTheme === 'light' ? (
            <Sun className="w-4 h-4" />
            ) : (
            <Moon className="w-4 h-4" />
            )}
            <span>{resolvedTheme === 'light' ? t('mode.light') : t('mode.dark')}</span>
        </div>
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative w-9 h-9 flex items-center justify-center"
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-black dark:text-white absolute" />
      <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-black dark:text-white absolute" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
