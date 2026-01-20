'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function PublicFooter() {
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  return (
    <footer className="bg-[#f5f5f0] pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 pb-12 border-b border-gray-300">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div className="w-12 h-14 flex items-center justify-center">
                <svg viewBox="0 0 40 48" className="w-10 h-12" fill="none">
                  <path d="M20 0C8.954 0 0 8.954 0 20v8c0 11.046 8.954 20 20 20s20-8.954 20-20v-8C40 8.954 31.046 0 20 0z" fill="#1a5276"/>
                  <text x="20" y="30" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">CH</text>
                </svg>
              </div>
              <div className="ml-2">
                <p className="text-lg font-bold text-[#1a5276]">Children's Hospital</p>
                <p className="text-lg font-bold text-[#1a5276]">of Philadelphia</p>
                <p className="text-sm font-medium text-[#17a589]">RESEARCH INSTITUTE</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-700">3401 Civic Center Blvd.</p>
            <p className="text-gray-700">Philadelphia, PA 19104</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-semibold mb-4 text-[#1a5276]">What is Independent Mobility?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href={`/${locale}`} className="hover:text-[#1a5276] transition-colors">Learn More</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-[#1a5276]">Independent Mobility Options</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href={`/${locale}/mobility/pedestrian`} className="hover:text-[#1a5276] transition-colors">Pedestrian</Link></li>
              <li><Link href={`/${locale}/mobility/biking`} className="hover:text-[#1a5276] transition-colors">Biking</Link></li>
              <li><Link href={`/${locale}/mobility/driving`} className="hover:text-[#1a5276] transition-colors">Driving</Link></li>
              <li><Link href={`/${locale}/mobility/public-transit`} className="hover:text-[#1a5276] transition-colors">Public Transit</Link></li>
              <li><Link href={`/${locale}/mobility/rideshare`} className="hover:text-[#1a5276] transition-colors">Rideshare</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-[#1a5276]">Prepare to be Mobile</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-[#1a5276] transition-colors">How to Prepare</a></li>
              <li><a href="#" className="hover:text-[#1a5276] transition-colors">Build Mobility Skills</a></li>
              <li><a href="#" className="hover:text-[#1a5276] transition-colors">Resources and Support</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-[#1a5276]">Driving with Autism</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-[#1a5276] transition-colors">Prepare to Drive</a></li>
              <li><a href="#" className="hover:text-[#1a5276] transition-colors flex items-center gap-2">Driving Lessons <span className="text-[#7cb342]">●</span></a></li>
              <li><a href="#" className="hover:text-[#1a5276] transition-colors">Driving Resource Library</a></li>
              <li><a href="#" className="hover:text-[#1a5276] transition-colors">Frequently Asked Questions</a></li>
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-6 mb-8">
          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500 font-semibold">
            BEST
          </div>
          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500 font-semibold">
            MAGNET
          </div>
        </div>

        <div className="border-t border-gray-300 pt-6">
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-4">
            <a href="#" className="hover:text-[#1a5276] transition-colors">About Us</a>
            <span>|</span>
            <a href="#" className="hover:text-[#1a5276] transition-colors">Contact Us</a>
            <span>|</span>
            <a href="#" className="hover:text-[#1a5276] transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-[#1a5276] transition-colors">Terms of Use</a>
            <span>|</span>
            <a href="#" className="hover:text-[#1a5276] transition-colors">Ethics & Compliance</a>
            <span>|</span>
            <a href="#" className="hover:text-[#1a5276] transition-colors">HIPAA Notice of Privacy Practices</a>
          </div>
          <p className="text-sm text-gray-500">
            ©2025 The Children's Hospital of Philadelphia. Children's Hospital of Philadelphia is a charitable 501(c)(3) nonprofit organization.
          </p>
        </div>
      </div>
    </footer>
  );
}
