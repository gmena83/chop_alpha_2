'use client';

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { 
  Search, 
  User,
  ChevronDown,
  LayoutDashboard
} from "lucide-react";

export default function PublicHeader() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const mobilityOptions = [
    { label: 'Pedestrian', href: `/${locale}/mobility/pedestrian` },
    { label: 'Biking', href: `/${locale}/mobility/biking` },
    { label: 'Driving', href: `/${locale}/mobility/driving` },
    { label: 'Public Transit', href: `/${locale}/mobility/public-transit` },
    { label: 'Rideshare', href: `/${locale}/mobility/rideshare` },
    { label: 'Explore all Options', href: `/${locale}/mobility` },
  ];

  const prepareOptions = [
    { label: 'How to Prepare', href: '#' },
    { label: 'Build Mobility Skills', href: '#' },
    { label: 'Resources and Support', href: '#' },
  ];

  const drivingOptions = [
    { label: 'Prepare to Drive', href: '#' },
    { label: 'Driving Lessons', href: '#', locked: true },
    { label: 'Driving Resource Library', href: '#' },
    { label: 'Frequently Asked Questions', href: '#' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full text-white" style={{ backgroundColor: '#5b2c6f' }}>
      <div className="w-full px-4 md:px-8 flex h-16 items-center justify-between max-w-[1400px] mx-auto">
        <div className="flex items-center gap-6">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-[#f4d03f]">ET</span>
              <span className="text-2xl font-bold flex items-center text-[#f4d03f]">
                <svg viewBox="0 0 24 24" className="h-5 w-5 inline mx-[-2px] text-[#f4d03f]" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                A
              </span>
            </div>
            <div className="border-l border-white/30 pl-3 hidden md:block">
              <span className="text-xs font-medium leading-tight block">Empowering Transportation</span>
              <span className="text-xs font-medium leading-tight block">among Autistic adolescents</span>
            </div>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          <Link 
            href={`/${locale}/what-is-independent-mobility`} 
            className="flex items-center gap-1 text-sm px-3 py-2 hover:text-[#f4d03f] transition-colors"
          >
            What is Independent Mobility?
          </Link>
          
          <div 
            className="relative"
            onMouseEnter={() => setOpenDropdown('mobility')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button className="flex items-center gap-1 text-sm px-3 py-2 hover:text-[#f4d03f] transition-colors">
              Independent Mobility Options
              <ChevronDown className="h-4 w-4" />
            </button>
            {openDropdown === 'mobility' && (
              <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 min-w-[200px] z-50">
                {mobilityOptions.map((option) => (
                  <Link
                    key={option.label}
                    href={option.href}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#1a5276]"
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div 
            className="relative"
            onMouseEnter={() => setOpenDropdown('prepare')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button className="flex items-center gap-1 text-sm px-3 py-2 hover:text-[#f4d03f] transition-colors">
              Prepare to be Mobile
              <ChevronDown className="h-4 w-4" />
            </button>
            {openDropdown === 'prepare' && (
              <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 min-w-[200px] z-50">
                {prepareOptions.map((option) => (
                  <Link
                    key={option.label}
                    href={option.href}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#1a5276]"
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div 
            className="relative"
            onMouseEnter={() => setOpenDropdown('driving')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button className="flex items-center gap-1 text-sm px-3 py-2 hover:text-[#f4d03f] transition-colors">
              Driving with Autism
              <ChevronDown className="h-4 w-4" />
            </button>
            {openDropdown === 'driving' && (
              <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 min-w-[200px] z-50">
                {drivingOptions.map((option) => (
                  <Link
                    key={option.label}
                    href={option.href}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#1a5276] flex items-center justify-between"
                  >
                    {option.label}
                    {option.locked && <span className="text-gray-400">🔒</span>}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-sm hover:text-[#f4d03f] transition-colors">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
          {isLoggedIn ? (
            <Link href={`/${locale}/dashboard`} className="flex items-center gap-1 text-sm hover:text-[#f4d03f] transition-colors">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          ) : (
            <Link href={`/${locale}/auth/login`} className="flex items-center gap-1 text-sm hover:text-[#f4d03f] transition-colors">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Link>
          )}
          <Link href={`/${locale}/auth/login?callbackUrl=/${locale}/staff`} className="text-xs text-white/60 hover:text-white/80 transition-colors">
            Staff
          </Link>
        </div>
      </div>
    </header>
  );
}
