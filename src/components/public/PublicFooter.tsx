'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock } from "lucide-react";

export default function PublicFooter() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  return (
    <footer className="bg-[#f5f5f0]">
      {/* Top section with dark bar and CHOP logo */}
      <div className="relative">
        {/* Dark angular header bar */}
        <div className="bg-[#1E1E1E] h-24 relative overflow-hidden">
          <svg
            className="absolute bottom-0 left-0 w-full h-16"
            viewBox="0 0 1400 60"
            preserveAspectRatio="none"
          >
            <polygon points="0,60 500,0 1400,60" fill="#f5f5f0" />
          </svg>
        </div>

        {/* CHOP Logo and Address row */}
        <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            {/* CHOP Research Institute Logo */}
            <div className="flex items-center gap-2">
              <div className="w-12 h-14 flex items-center justify-center">
                <svg viewBox="0 0 50 60" className="w-12 h-14" fill="none">
                  <ellipse cx="25" cy="30" rx="24" ry="28" fill="#1a5276" />
                  <text x="25" y="35" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">CH</text>
                </svg>
              </div>
              <div>
                <p className="text-lg font-bold text-[#1a5276] leading-tight">Children's Hospital</p>
                <p className="text-lg font-bold text-[#1a5276] leading-tight">of Philadelphia<sup className="text-xs">®</sup></p>
                <p className="text-sm font-semibold text-[#17a589] tracking-wide">RESEARCH INSTITUTE</p>
              </div>
            </div>
          </div>
          <div className="text-right text-gray-700">
            <p>3401 Civic Center Blvd.</p>
            <p>Philadelphia, PA 19104</p>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* 4-column Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: What is Independent Mobility? */}
          <div>
            <h3 className="font-bold mb-4 text-gray-800">What is Independent Mobility?</h3>
          </div>

          {/* Column 2: Independent Mobility Options */}
          <div>
            <h3 className="font-bold mb-4 text-gray-800">Independent Mobility Options</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href={`/${locale}/mobility/pedestrian`} className="hover:text-[#1a5276] transition-colors">Pedestrian</Link></li>
              <li><Link href={`/${locale}/mobility/biking`} className="hover:text-[#1a5276] transition-colors">Biking</Link></li>
              <li><Link href={`/${locale}/mobility/driving`} className="hover:text-[#1a5276] transition-colors">Driving</Link></li>
              <li><Link href={`/${locale}/mobility/public-transit`} className="hover:text-[#1a5276] transition-colors">Public Transit</Link></li>
              <li><Link href={`/${locale}/mobility/rideshare`} className="hover:text-[#1a5276] transition-colors">Rideshare</Link></li>
              <li><Link href={`/${locale}/mobility`} className="hover:text-[#1a5276] transition-colors">Explore all Options</Link></li>
            </ul>
          </div>

          {/* Column 3: Prepare to be Mobile */}
          <div>
            <h3 className="font-bold mb-4 text-gray-800">Prepare to be Mobile</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-[#1a5276] transition-colors">How to Prepare</a></li>
              <li><a href="#" className="hover:text-[#1a5276] transition-colors">Build Mobility Skills</a></li>
              <li><a href="#" className="hover:text-[#1a5276] transition-colors">Resources and Support</a></li>
            </ul>
          </div>

          {/* Column 4: Driving with Autism */}
          <div>
            <h3 className="font-bold mb-4 text-gray-800">Driving with Autism</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-[#1a5276] transition-colors">Prepare to Drive</a></li>
              <li>
                <a href="#" className="hover:text-[#1a5276] transition-colors flex items-center gap-2 bg-[#d4edda] py-1 px-2 rounded -ml-2">
                  Driving Lessons
                  <Lock className="h-3 w-3 text-gray-500" />
                </a>
              </li>
              <li><a href="#" className="hover:text-[#1a5276] transition-colors">Driving Resource Library</a></li>
              <li><a href="#" className="hover:text-[#1a5276] transition-colors">Frequently Asked Questions</a></li>
            </ul>
          </div>
        </div>

        {/* Badge Section */}
        <div className="flex items-center gap-4 mb-8">
          {/* BEST Children's Hospitals Badge - Placeholder */}
          <div className="w-20 h-16 bg-white border border-gray-200 rounded flex flex-col items-center justify-center p-1">
            <span className="text-[8px] font-bold text-red-600 leading-tight text-center">BEST</span>
            <span className="text-[6px] text-gray-600 leading-tight text-center">CHILDREN'S</span>
            <span className="text-[6px] text-gray-600 leading-tight text-center">HOSPITALS</span>
            <span className="text-[5px] text-blue-600 leading-tight text-center">U.S.NEWS</span>
            <span className="text-[5px] text-yellow-600 leading-tight text-center">2024-2025</span>
          </div>

          {/* MAGNET Badge - Placeholder */}
          <div className="w-20 h-16 bg-white border border-gray-200 rounded flex flex-col items-center justify-center p-1">
            <span className="text-[7px] font-bold text-teal-600 leading-tight text-center">MAGNET</span>
            <span className="text-[5px] text-gray-600 leading-tight text-center">RECOGNIZED</span>
            <span className="text-[5px] text-gray-500 leading-tight text-center">AMERICAN NURSES</span>
            <span className="text-[5px] text-gray-500 leading-tight text-center">CREDENTIALING CENTER</span>
          </div>
        </div>

        {/* Bottom Links Bar */}
        <div className="border-t border-gray-300 pt-6">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-4">
            <a href="#" className="hover:text-[#1a5276] transition-colors">About Us</a>
            <span className="text-gray-400">|</span>
            <a href="#" className="hover:text-[#1a5276] transition-colors">Contact Us</a>
            <span className="text-gray-400">|</span>
            <a href="#" className="hover:text-[#1a5276] transition-colors">Privacy Policy</a>
            <span className="text-gray-400">|</span>
            <a href="#" className="hover:text-[#1a5276] transition-colors">Terms of Use</a>
            <span className="text-gray-400">|</span>
            <a href="#" className="hover:text-[#1a5276] transition-colors">Ethics & Compliance</a>
            <span className="text-gray-400">|</span>
            <a href="#" className="hover:text-[#1a5276] transition-colors">HIPAA Notice of Privacy Practices</a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-500">
            ©2025 The Children's Hospital of Philadelphia. Children's Hospital of Philadelphia is a charitable 501(c)(3) nonprofit organization.
          </p>
        </div>
      </div>
    </footer>
  );
}
