'use client';

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  User,
  ChevronDown,
  LayoutDashboard,
  Menu,
  X
} from "lucide-react";

export default function PublicHeader() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mobilityOptions = [
    { label: 'Pedestrian', href: `/${locale}/mobility/pedestrian` },
    { label: 'Biking', href: `/${locale}/mobility/biking` },
    { label: 'Driving', href: `/${locale}/mobility/driving` },
    { label: 'Public Transit', href: `/${locale}/mobility/public-transit` },
    { label: 'Rideshare', href: `/${locale}/mobility/rideshare` },
    { label: 'Explore all Options', href: `/${locale}/mobility` },
  ];

  const prepareOptions = [
    { label: 'How to Prepare', href: `/${locale}/prepare-to-be-mobile` },
    { label: 'Build Mobility Skills', href: `/${locale}/prepare-to-be-mobile#build-skills` },
    { label: 'Resources and Support', href: `/${locale}/prepare-to-be-mobile#resources` },
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
        {/* Logo - Image based per Figma spec */}
        <div className="flex items-center gap-6">
          <Link href={`/${locale}`} className="flex items-center">
            <Image
              src="/images/eta-logo.png"
              alt="ETA - Empowering Transportation among Autistic adolescents"
              width={280}
              height={48}
              className="h-10 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Desktop Navigation - 16px font per audit */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link
            href={`/${locale}/what-is-independent-mobility`}
            className="flex items-center gap-1 text-base px-3 py-2 hover:text-[#f4d03f] transition-colors font-medium"
          >
            What is Independent Mobility?
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setOpenDropdown('mobility')}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button className="flex items-center gap-1 text-base px-3 py-2 hover:text-[#f4d03f] transition-colors font-medium">
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
            <button className="flex items-center gap-1 text-base px-3 py-2 hover:text-[#f4d03f] transition-colors font-medium">
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
            <button className="flex items-center gap-1 text-base px-3 py-2 hover:text-[#f4d03f] transition-colors font-medium">
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

        {/* Right side utilities - unified 14px font per audit */}
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
          <Link href={`/${locale}/auth/login?callbackUrl=/${locale}/staff`} className="text-sm text-white/80 hover:text-white transition-colors">
            Staff
          </Link>

          {/* Mobile hamburger menu button */}
          <button
            className="lg:hidden flex items-center justify-center p-2 hover:text-[#f4d03f] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-[#5b2c6f] border-t border-white/20 shadow-lg">
          <nav className="max-w-[1400px] mx-auto px-4 py-4 flex flex-col gap-2">
            <Link
              href={`/${locale}/what-is-independent-mobility`}
              className="text-base py-2 hover:text-[#f4d03f] transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              What is Independent Mobility?
            </Link>

            <div className="border-t border-white/20 pt-2">
              <span className="text-sm text-white/60 mb-1 block">Independent Mobility Options</span>
              {mobilityOptions.map((option) => (
                <Link
                  key={option.label}
                  href={option.href}
                  className="block py-1.5 pl-4 text-sm hover:text-[#f4d03f] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {option.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-white/20 pt-2">
              <span className="text-sm text-white/60 mb-1 block">Prepare to be Mobile</span>
              {prepareOptions.map((option) => (
                <Link
                  key={option.label}
                  href={option.href}
                  className="block py-1.5 pl-4 text-sm hover:text-[#f4d03f] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {option.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-white/20 pt-2">
              <span className="text-sm text-white/60 mb-1 block">Driving with Autism</span>
              {drivingOptions.map((option) => (
                <Link
                  key={option.label}
                  href={option.href}
                  className="block py-1.5 pl-4 text-sm hover:text-[#f4d03f] transition-colors flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {option.label}
                  {option.locked && <span className="text-gray-400">🔒</span>}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
