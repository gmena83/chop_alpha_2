'use client';

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  Search, 
  User,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Lock
} from "lucide-react";
import heroImage from "@assets/stock_images/young_woman_driving__7b985bdb.jpg";
import walkingImage from "@assets/stock_images/person_walking_pedes_36789b8e.jpg";
import busImage from "@assets/stock_images/yellow_school_bus_pu_7ccb2dbe.jpg";
import wheelchairImage from "@assets/stock_images/woman_using_wheelcha_6786a8a3.jpg";
import motherDaughterImage from "@assets/stock_images/mother_and_teenage_d_ba2a8fe8.jpg";
import teenBackpackImage from "@assets/stock_images/teenage_girl_with_ba_72c61475.jpg";
import therapistImage1 from "@assets/stock_images/therapist_counselor__e700294e.jpg";
import therapistImage2 from "@assets/stock_images/therapist_counselor__2a96f4ad.jpg";

export default function HomePage() {
  const t = useTranslations();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      quote: "I think driving helped her have a good sense of independence that she was becoming a young adult and really able to dream big and see just how independent a life she could have",
      author: "Linda, the Parent of an Autistic Driver"
    },
    {
      quote: "The ETA program gave us the tools and confidence we needed to support our son's journey to independent mobility.",
      author: "Maria, Parent of a Teen with ADHD"
    },
    {
      quote: "Having structured guidance made all the difference in helping our family navigate this important milestone.",
      author: "James, Parent of an Autistic Teen"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full text-white" style={{ backgroundColor: '#5b2c6f' }}>
        <div className="w-full px-4 md:px-8 flex h-16 items-center justify-between max-w-[1400px] mx-auto">
          <div className="flex items-center gap-8">
            {/* ETA Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-[#f4d03f]">ET</span>
                <span className="text-2xl font-bold text-[#f4d03f] flex items-center">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#f4d03f] inline mx-[-2px]" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  A
                </span>
              </div>
              <div className="border-l border-white/30 pl-3 hidden md:block">
                <span className="text-sm font-medium">Empowering Transportation</span>
                <br />
                <span className="text-sm font-medium">among Autistic adolescents</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm hover:text-[#f4d03f] transition-colors">
                What is Independent Mobility?
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm hover:text-[#f4d03f] transition-colors">
                Independent Mobility Options
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm hover:text-[#f4d03f] transition-colors">
                Prepare to be Mobile
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm hover:text-[#f4d03f] transition-colors">
                Driving with Autism
              </button>
            </div>
          </nav>

          {/* Search and Login */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-sm hover:text-[#f4d03f] transition-colors">
              <Search className="h-4 w-4" />
              Search
            </button>
            <Link href="/auth/login" className="flex items-center gap-1 text-sm hover:text-[#f4d03f] transition-colors">
              <User className="h-4 w-4" />
              Login
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[500px] overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a5276] via-[#2e86ab] to-[#17a589]" />
          
          {/* Hero image */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImage.src})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a5276] via-transparent to-transparent" />
          </div>

          <div className="container relative py-16 md:py-24">
            <div className="max-w-xl">
              {/* Transportation Icons */}
              <div className="flex items-center gap-4 mb-6">
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-white/80" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 4a8 8 0 0 0-8 8v0a8 8 0 0 0 8 8h0"/>
                  <path d="M12 4v4M12 16v4M8 8l2 2M14 14l2 2"/>
                </svg>
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-white/80" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="5" r="3"/>
                  <path d="M12 8v8M8 12h8"/>
                </svg>
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-white/80" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="5" cy="17" r="2"/>
                  <circle cx="19" cy="17" r="2"/>
                  <path d="M5 17H3V11l2-4h10l4 4v6h-2"/>
                  <path d="M7 17h10"/>
                </svg>
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-white/80" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="8" width="18" height="12" rx="2"/>
                  <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/>
                  <circle cx="7" cy="17" r="2"/>
                  <circle cx="17" cy="17" r="2"/>
                </svg>
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-white/80" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="6" width="20" height="12" rx="2"/>
                  <circle cx="6" cy="18" r="2"/>
                  <circle cx="18" cy="18" r="2"/>
                </svg>
                <svg viewBox="0 0 24 24" className="h-8 w-8 text-white/80" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 17h14v-5H5z"/>
                  <path d="M19 12V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v5"/>
                  <circle cx="7" cy="17" r="2"/>
                  <circle cx="17" cy="17" r="2"/>
                </svg>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Achieve<br />
                Independent Mobility.
              </h1>
              
              <p className="text-white/90 text-lg mb-8 max-w-md">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget luctus est, ut blandit dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>

              <Button 
                className="bg-[#1a5276] hover:bg-[#154360] text-white px-6 py-3 rounded-full"
              >
                What is Independent Mobility?
              </Button>
            </div>
          </div>
        </section>

        {/* Mobility Provides Independence Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a5276] mb-6">
              Mobility Provides Independence
            </h2>
            <p className="text-gray-600 max-w-4xl mb-10">
              Gaining independent mobility is a key milestone in achieving a greater sense of autonomy and freedom. It allows individuals to take charge of their daily routines, explore new places, and participate in various activities without transportation assistance. This newfound independence builds self-esteem, enhances decision-making skills, and fosters a sense of empowerment, opening doors to a world of possibilities.
            </p>

            {/* Three Images */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="aspect-[4/3] overflow-hidden rounded-lg">
                <img 
                  src={walkingImage.src} 
                  alt="Person walking" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-lg">
                <img 
                  src={busImage.src} 
                  alt="Public transportation" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-lg">
                <img 
                  src={wheelchairImage.src} 
                  alt="Independent mobility" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Become Independently Mobile Section */}
        <section className="py-16 md:py-20 bg-gray-50 border-t-4 border-[#f4d03f]">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a5276] mb-4">
              Become Independently Mobile
            </h2>
            <p className="text-gray-600 max-w-4xl mb-12">
              The ETA program guides you on a journey to independent mobility, ensuring you understand the benefits, find the best mobility option for you, and have the tools needed to start getting around independently.
            </p>

            {/* Three Steps */}
            <div className="space-y-8 max-w-4xl">
              {/* Step 1 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#f4d03f] text-[#1a5276] font-bold text-lg">
                    1
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1a5276] mb-2">
                    Understand the Benefits
                  </h3>
                  <p className="text-gray-600">
                    Independent mobility empowers individuals to access essential services, pursue vocational and educational opportunities, and engage in social activities without relying on others. It fosters a sense of confidence and self-reliance when someone is able to navigate the world independently. Additionally, it opens new possibilities for personal growth, exploration, and building meaningful connections within the community.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#f4d03f] text-[#1a5276] font-bold text-lg">
                    2
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1a5276] mb-2">
                    Find your Mobility Fit
                  </h3>
                  <p className="text-gray-600">
                    There are lots of different ways to get around independently including walking, riding a bike, taking a bus or train, and even driving. The ETA program will help you discover which of these options is best for your family.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#f4d03f] text-[#1a5276] font-bold text-lg">
                    3
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1a5276] mb-2">
                    Prepare to be Mobile
                  </h3>
                  <p className="text-gray-600">
                    Once you identify the mobility option to pursue, there are many steps you can take to get ready. The ETA program offers resources like video training, at-home activities, and daily living tasks (like budgeting) to help develop the skills needed for independent mobility.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mt-10">
              <Link href="/assessments">
                <Button className="bg-[#1a5276] hover:bg-[#154360] text-white px-6 py-3">
                  Take Our Mobility Assessment
                </Button>
              </Link>
              <Link href="/modules">
                <Button variant="outline" className="border-[#1a5276] text-[#1a5276] hover:bg-[#1a5276] hover:text-white px-6 py-3">
                  Think you are ready to drive? Find out!
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stories from People Section */}
        <section className="py-16 md:py-20 bg-[#1a5276]">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
              Stories from People
            </h2>

            <div className="relative">
              {/* Testimonial Card */}
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Left Arrow */}
                <button 
                  onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                  className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                {/* Testimonial Content */}
                <div className="flex-1 flex flex-col lg:flex-row items-center gap-8 bg-[#2e86ab]/30 p-8 rounded-lg">
                  <div className="flex-1">
                    <div className="text-6xl text-[#f4d03f] mb-4">"</div>
                    <p className="text-white text-lg italic mb-6">
                      {testimonials[currentTestimonial].quote}
                    </p>
                    <p className="text-white/80 text-sm">
                      — {testimonials[currentTestimonial].author}
                    </p>
                  </div>
                  <div className="w-64 h-64 flex-shrink-0 overflow-hidden rounded-lg">
                    <img 
                      src={motherDaughterImage.src} 
                      alt="Testimonial" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Right Arrow */}
                <button 
                  onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                  className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentTestimonial ? 'bg-white' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* The Latest Research Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a5276] mb-4">
              The Latest Research
            </h2>
            <p className="text-gray-600 mb-10">
              Check out some of the latest research on independent mobility.
            </p>

            {/* Research Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
              <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={therapistImage1.src} 
                    alt="Research article" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-[#1a5276] mb-4">
                    Independent community mobility and driving experiences of adults on the autism spectrum: A scoping review
                  </h3>
                  <Button className="bg-[#1a5276] hover:bg-[#154360] text-white text-sm px-4 py-2">
                    CTA
                  </Button>
                </div>
              </div>

              <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={therapistImage2.src} 
                    alt="Research article" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-[#1a5276] mb-4">
                    The role for occupational therapists in community mobility training for people with autism spectrum disorders
                  </h3>
                  <Button className="bg-[#1a5276] hover:bg-[#154360] text-white text-sm px-4 py-2">
                    CTA
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button variant="outline" className="border-[#1a5276] text-[#1a5276] hover:bg-[#1a5276] hover:text-white">
                View all research
              </Button>
            </div>
          </div>
        </section>

        {/* Are You Ready Section - Green Background */}
        <section className="relative py-16 md:py-20 overflow-hidden">
          {/* Green background with diagonal */}
          <div className="absolute inset-0 bg-[#7cb342]" />
          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${teenBackpackImage.src})` }}
            />
            <svg className="absolute left-0 top-0 bottom-0 h-full w-24" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="0,0 100,0 0,100" fill="#7cb342" />
            </svg>
          </div>

          <div className="container relative">
            <div className="max-w-lg">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a5276] mb-2">
                Are You Ready to Be
              </h2>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a5276] mb-6">
                Independently Mobile?
              </h2>
              <div className="w-16 h-1 bg-[#1a5276] mb-6" />
              <p className="text-[#1a5276] mb-8">
                Not sure if you are ready to be independently mobile? Click the link below to take the independent mobility assessment. This quick questionnaire will give you more information about what mobility option might be best for you and what skills you need for each.
              </p>

              <div className="space-y-4">
                <Link href="/assessments">
                  <Button className="w-full sm:w-auto bg-[#1a5276] hover:bg-[#154360] text-white px-6 py-3">
                    Take our Independent Mobility Assessment
                  </Button>
                </Link>
                <br />
                <Link href="/modules">
                  <Button variant="outline" className="w-full sm:w-auto border-[#1a5276] text-[#1a5276] hover:bg-[#1a5276] hover:text-white px-6 py-3 mt-4">
                    Think you are ready to drive? Find out!
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Pre-Footer with CHOP Logo */}
        <section className="py-12 bg-[#f5f5f5]">
          <div className="container flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="text-[#1a5276]">
                <div className="flex items-center gap-2">
                  <div className="border-2 border-[#1a5276] rounded-lg p-2">
                    <span className="text-2xl font-bold">CH</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Children's Hospital</p>
                    <p className="font-bold text-sm">of Philadelphia</p>
                    <p className="text-[#17a589] text-sm font-semibold">RESEARCH INSTITUTE</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right text-gray-600">
              <p>3401 Civic Center Blvd.</p>
              <p>Philadelphia, PA 19104</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a5276] text-white py-12">
        <div className="container">
          {/* Footer Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-semibold mb-4">What is Independent Mobility?</h4>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Independent Mobility Options</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white">Pedestrian</a></li>
                <li><a href="#" className="hover:text-white">Biking</a></li>
                <li><a href="#" className="hover:text-white">Driving</a></li>
                <li><a href="#" className="hover:text-white">Public Transit</a></li>
                <li><a href="#" className="hover:text-white">Rideshare</a></li>
                <li><a href="#" className="hover:text-white">Explore all Options</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Prepare to be Mobile</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white">How to Prepare</a></li>
                <li><a href="#" className="hover:text-white">Build Mobility Skills</a></li>
                <li><a href="#" className="hover:text-white">Resources and Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Driving with Autism</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white">Prepare to Drive</a></li>
                <li className="flex items-center gap-2">
                  <a href="#" className="hover:text-white">Driving Lessons</a>
                  <Lock className="h-3 w-3" />
                </li>
                <li><a href="#" className="hover:text-white">Driving Resource Library</a></li>
                <li><a href="#" className="hover:text-white">Frequently Asked Questions</a></li>
              </ul>
            </div>
          </div>

          {/* Awards/Badges */}
          <div className="flex items-center gap-6 mb-8 py-6 border-t border-white/20">
            <div className="bg-white text-[#1a5276] px-4 py-2 rounded text-xs font-bold">
              <div>BEST</div>
              <div>CHILDREN'S</div>
              <div>HOSPITALS</div>
            </div>
            <div className="bg-white text-[#1a5276] px-4 py-2 rounded text-xs font-bold">
              <div>MAGNET</div>
              <div>RECOGNIZED</div>
            </div>
          </div>

          {/* Bottom Links */}
          <div className="flex flex-wrap gap-4 text-sm text-white/80 mb-4">
            <a href="#" className="hover:text-white">About Us</a>
            <span>|</span>
            <a href="#" className="hover:text-white">Contact Us</a>
            <span>|</span>
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-white">Terms of Use</a>
            <span>|</span>
            <a href="#" className="hover:text-white">Ethics & Compliance</a>
            <span>|</span>
            <a href="#" className="hover:text-white">HIPAA Notice of Privacy Practices</a>
          </div>

          <p className="text-sm text-white/60">
            ©2025 The Children's Hospital of Philadelphia. Children's Hospital of Philadelphia is a charitable 501(c)(3) nonprofit organization.
          </p>
        </div>
      </footer>
    </div>
  );
}
