import Link from 'next/link'
import { Facebook, Twitter, Github, Send, Smartphone, AppWindow } from 'lucide-react'

export function Footer() {
  return (
    <footer className="h-12 border-t border-gray-200 dark:border-[#222] bg-white dark:bg-[#15191c] flex items-center justify-between px-4 shrink-0 transition-colors">
      <div className="flex items-center gap-4 text-gray-400 dark:text-gray-500">
         <a href="#" className="hover:text-blue-600 dark:hover:text-[#1877F2] transition-colors"><Facebook className="w-4 h-4" /></a>
         <a href="#" className="hover:text-black dark:hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
         <a href="#" className="hover:text-blue-500 dark:hover:text-[#229ED9] transition-colors"><Send className="w-4 h-4" /></a>
         <a href="#" className="hover:text-black dark:hover:text-white transition-colors"><Github className="w-4 h-4" /></a>
         <a href="#" className="hover:text-black dark:hover:text-white transition-colors"><AppWindow className="w-4 h-4" /></a>
         <a href="#" className="hover:text-green-600 dark:hover:text-[#3DDC84] transition-colors"><Smartphone className="w-4 h-4" /></a>
      </div>
      
      <div className="flex items-center gap-6 text-[10px] uppercase font-medium text-gray-500 dark:text-gray-400">
         <Link href="/submit-source" className="hover:text-black dark:hover:text-white transition-colors">Submit Source</Link>
         <Link href="/advertise" className="hover:text-black dark:hover:text-white transition-colors">Advertise</Link>
         <Link href="/developers" className="hover:text-black dark:hover:text-white transition-colors">Developers</Link>
         <Link href="/about" className="hover:text-black dark:hover:text-white transition-colors">About</Link>
         <Link href="/contact" className="hover:text-black dark:hover:text-white transition-colors">Contact</Link>
         <Link href="/terms" className="hover:text-black dark:hover:text-white transition-colors">Terms</Link>
      </div>

      <div className="text-[10px] text-gray-400 dark:text-gray-600">
         © 2025 Fi.News
      </div>
    </footer>
  )
}
