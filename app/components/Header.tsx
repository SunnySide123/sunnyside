'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: '主页' },
  { href: '/daily', label: '日常' },
  { href: '/footprint', label: '足迹' },
  { href: '/vitae', label: '履历' },
  { href: '/about', label: '关于' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="w-full px-8 py-6 flex items-center justify-between border-b border-cream-dark">
      <Link href="/" className="font-serif text-xl tracking-wider text-charcoal hover:text-charcoal">
        SunnySide的秘密基地
      </Link>
      <nav className="hidden md:flex items-center gap-8">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`text-sm tracking-wide uppercase transition-colors ${
              pathname === href
                ? 'text-charcoal border-b border-charcoal pb-0.5'
                : 'text-charcoal-light hover:text-charcoal'
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
      {/* Mobile nav */}
      <div className="md:hidden flex items-center gap-4">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`text-xs tracking-wide ${
              pathname === href ? 'text-charcoal font-medium' : 'text-charcoal-light'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </header>
  )
}
