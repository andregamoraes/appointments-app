'use client'

import { Home, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useAuthGuard } from '@/hooks/useAuthGuard'

export default function BottomNav() {
    const { logout } = useAuthGuard()
  return (
    <nav className="fixed bottom-0 left-0 right-0">
      <div className="mx-auto max-w-sm bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
        <div className="px-8 py-4 flex items-center justify-between">
            <Link
                href="/home"
                className="p-3 rounded-2xl border border-gray-200 hover:bg-gray-50 transition text-gray-900"
            >
                <Home className="w-5 h-5" />
            </Link>
            <button className="p-3 rounded-2xl border border-gray-200 hover:bg-gray-50 transition cursor-pointer text" onClick={logout}>
                <LogOut className="w-5 h-5 text-red-500" />
            </button>
        </div>
      </div>
    </nav>
  )
}
