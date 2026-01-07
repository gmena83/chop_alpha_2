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
  Footprints,
  Car,
  Bus,
  Bike,
  Train
} from "lucide-react";

const heroImage = "/images/young_woman_driving__7b985bdb.jpg";
const walkingImage = "/images/person_walking_pedes_36789b8e.jpg";
const busImage = "/images/yellow_school_bus_pu_7ccb2dbe.jpg";
const wheelchairImage = "/images/woman_using_wheelcha_6786a8a3.jpg";
const motherDaughterImage = "/images/mother_and_teenage_d_ba2a8fe8.jpg";
const teenBackpackImage = "/images/teenage_girl_with_ba_72c61475.jpg";
const therapistImage1 = "/images/therapist_counselor__e700294e.jpg";
const therapistImage2 = "/images/therapist_counselor__2a96f4ad.jpg";

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
    <div className="flex flex-col min-h-screen bg-white" style={{ 
      '--chop-blue': '#1a5276',
      '--chop-dark-blue': '#154360',
      '--eta-green': '#17a589',
      '--eta-yellow': '#f4d03f',
      '--eta-purple': '#5b2c6f',
      '--eta-light-green': '#7cb342'
    } as React.CSSProperties}>
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full text-white" style={{ backgroundColor: 'var(--eta-purple)' }}>
        <div className="w-full px-4 md:px-8 flex h-16 items-center justify-between max-w-[1400px] mx-auto">
          <div className="flex items-center gap-6">
            {/* ETA Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="flex items-center">
                <span className="text-2xl font-bold" style={{ color: 'var(--eta-yellow)' }}>ET</span>
                <span className="text-2xl font-bold flex items-center" style={{ color: 'var(--eta-yellow)' }}>
                  <svg viewBox="0 0 24 24" className="h-5 w-5 inline mx-[-2px]" style={{ color: 'var(--eta-yellow)' }} fill="currentColor">
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

          {/* Navigation - Matching Figma menu items */}
          <nav className="hidden lg:flex items-center gap-1">
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm px-3 py-2 hover:text-[#f4d03f] transition-colors">
                Pedestrian
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm px-3 py-2 hover:text-[#f4d03f] transition-colors">
                Driving
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm px-3 py-2 hover:text-[#f4d03f] transition-colors">
                Public Transit
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm px-3 py-2 hover:text-[#f4d03f] transition-colors">
                Rideshare
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm px-3 py-2 hover:text-[#f4d03f] transition-colors">
                Biking
              </button>
            </div>
          </nav>

          {/* Search and Login */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-sm hover:text-[#f4d03f] transition-colors">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
            <Link href="/auth/login" className="flex items-center gap-1 text-sm hover:text-[#f4d03f] transition-colors">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[520px] overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a5276] via-[#2e86ab] to-[#17a589]" />
          
          {/* Hero image on right side */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#2e86ab] via-transparent to-transparent" />
          </div>

          <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative py-16 md:py-24">
            <div className="max-w-xl">
              {/* Transportation Icons Row */}
              <div className="flex items-center gap-6 mb-8">
                <Footprints className="h-7 w-7 text-white/80" />
                <div className="w-7 h-7 text-white/80 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
                    <circle cx="12" cy="5" r="3"/>
                    <path d="M12 8v8M8 12h8"/>
                  </svg>
                </div>
                <Car className="h-7 w-7 text-white/80" />
                <Bus className="h-7 w-7 text-white/80" />
                <Train className="h-7 w-7 text-white/80" />
                <Bike className="h-7 w-7 text-white/80" />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-white leading-[1.1] mb-6">
                Empowering<br />
                Transportation<br />
                among Autistic<br />
                adolescents
              </h1>
              
              <p className="text-white/90 text-lg mb-8 max-w-md leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget luctus est, ut blandit dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>

              <Button 
                className="text-white px-8 py-3 rounded-full text-base font-medium"
                style={{ backgroundColor: 'var(--chop-blue)' }}
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Mobility Provides Independence Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--chop-blue)' }}>
              Mobility Provides Independence
            </h2>
            <p className="text-gray-600 max-w-4xl mb-12 text-lg leading-relaxed">
              Gaining independent mobility is a key milestone in achieving a greater sense of autonomy and freedom. It allows individuals to take charge of their daily routines, explore new places, and participate in various activities without transportation assistance. This newfound independence builds self-esteem, enhances decision-making skills, and fosters a sense of empowerment, opening doors to a world of possibilities.
            </p>

            {/* Three Images Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-md">
                <img 
                  src={walkingImage} 
                  alt="Person walking independently" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-md">
                <img 
                  src={busImage} 
                  alt="Public transportation" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-md">
                <img 
                  src={wheelchairImage} 
                  alt="Independent mobility options" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Become Independently Mobile Section - Three Column Value Props */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            {/* Yellow accent line */}
            <div className="w-full h-1 mb-8" style={{ backgroundColor: 'var(--eta-yellow)' }} />
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--chop-blue)' }}>
              Become Independently Mobile
            </h2>
            <p className="text-gray-600 max-w-4xl mb-12 text-lg">
              The ETA program guides you on a journey to independent mobility, ensuring you understand the benefits, find the best mobility option for you, and have the tools needed to start getting around independently.
            </p>

            {/* Three Column Layout - Value Props matching Figma */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Column 1: Understand the Benefits */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-center w-14 h-14 rounded-full mb-6" style={{ backgroundColor: 'var(--eta-yellow)' }}>
                  <span className="text-xl font-bold" style={{ color: 'var(--chop-blue)' }}>1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--chop-blue)' }}>
                  Understand the Benefits
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Independent mobility empowers individuals to access essential services, pursue vocational and educational opportunities, and engage in social activities without relying on others. It fosters a sense of confidence and self-reliance.
                </p>
              </div>

              {/* Column 2: Find your Mobility Fit */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-center w-14 h-14 rounded-full mb-6" style={{ backgroundColor: 'var(--eta-yellow)' }}>
                  <span className="text-xl font-bold" style={{ color: 'var(--chop-blue)' }}>2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--chop-blue)' }}>
                  Find your Mobility Fit
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  There are lots of different ways to get around independently including walking, riding a bike, taking a bus or train, and even driving. The ETA program will help you discover which of these options is best for your family.
                </p>
              </div>

              {/* Column 3: Prepare to be Mobile */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-center w-14 h-14 rounded-full mb-6" style={{ backgroundColor: 'var(--eta-yellow)' }}>
                  <span className="text-xl font-bold" style={{ color: 'var(--chop-blue)' }}>3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--chop-blue)' }}>
                  Prepare to be Mobile
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Once you identify the mobility option to pursue, there are many steps you can take to get ready. The ETA program offers resources like video training, at-home activities, and daily living tasks to help develop the skills needed.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="/assessments">
                <Button 
                  className="text-white px-6 py-3 font-medium"
                  style={{ backgroundColor: 'var(--chop-blue)' }}
                >
                  Take Our Mobility Assessment
                </Button>
              </Link>
              <Link href="/modules">
                <Button 
                  variant="outline" 
                  className="px-6 py-3 font-medium border-2"
                  style={{ borderColor: 'var(--chop-blue)', color: 'var(--chop-blue)' }}
                >
                  Think you are ready to drive? Find out!
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stories from People Section - Testimonial Slider */}
        <section className="py-16 md:py-20" style={{ backgroundColor: 'var(--chop-blue)' }}>
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
              Stories from People Like You
            </h2>

            <div className="relative">
              {/* Testimonial Card */}
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Left Arrow */}
                <button 
                  onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                  className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                {/* Testimonial Content */}
                <div className="flex-1 flex flex-col lg:flex-row items-center gap-8 bg-white/10 backdrop-blur-sm p-8 rounded-xl">
                  <div className="flex-1">
                    <div className="text-6xl mb-4" style={{ color: 'var(--eta-yellow)' }}>"</div>
                    <p className="text-white text-xl italic mb-6 leading-relaxed">
                      {testimonials[currentTestimonial].quote}
                    </p>
                    <p className="text-white/80 text-base font-medium">
                      — {testimonials[currentTestimonial].author}
                    </p>
                  </div>
                  <div className="w-72 h-72 flex-shrink-0 overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src={motherDaughterImage} 
                      alt="Family testimonial" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Right Arrow */}
                <button 
                  onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                  className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-3 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* The Latest Research Section - Three Card Grid */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--chop-blue)' }}>
              The Latest Research
            </h2>
            <p className="text-gray-600 mb-10 text-lg">
              Check out some of the latest research on independent mobility.
            </p>

            {/* Research Cards - Three Column Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-10">
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={therapistImage1} 
                    alt="Research study" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4 line-clamp-3" style={{ color: 'var(--chop-blue)' }}>
                    Independent community mobility and driving experiences of adults on the autism spectrum: A scoping review
                  </h3>
                  <Button 
                    className="text-white text-sm px-5 py-2"
                    style={{ backgroundColor: 'var(--chop-blue)' }}
                  >
                    Read More
                  </Button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={therapistImage2} 
                    alt="Research study" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4 line-clamp-3" style={{ color: 'var(--chop-blue)' }}>
                    The role for occupational therapists in community mobility training for people with autism spectrum disorders
                  </h3>
                  <Button 
                    className="text-white text-sm px-5 py-2"
                    style={{ backgroundColor: 'var(--chop-blue)' }}
                  >
                    Read More
                  </Button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-video overflow-hidden bg-gray-100">
                  <img 
                    src={walkingImage} 
                    alt="Research study" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-4 line-clamp-3" style={{ color: 'var(--chop-blue)' }}>
                    Promoting pedestrian safety and independent mobility in autism spectrum disorder
                  </h3>
                  <Button 
                    className="text-white text-sm px-5 py-2"
                    style={{ backgroundColor: 'var(--chop-blue)' }}
                  >
                    Read More
                  </Button>
                </div>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="font-medium border-2"
              style={{ borderColor: 'var(--chop-blue)', color: 'var(--chop-blue)' }}
            >
              View all research
            </Button>
          </div>
        </section>

        {/* Are You Ready Section - Assessment CTA */}
        <section className="relative py-16 md:py-20 overflow-hidden" style={{ backgroundColor: 'var(--eta-light-green)' }}>
          {/* Background image on right */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${teenBackpackImage})` }}
            />
            <svg className="absolute left-0 top-0 bottom-0 h-full w-32" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="0,0 100,0 0,100" style={{ fill: 'var(--eta-light-green)' }} />
            </svg>
          </div>

          <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative">
            <div className="max-w-lg">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-2" style={{ color: 'var(--chop-blue)' }}>
                Are You Ready to Be
              </h2>
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--chop-blue)' }}>
                Independently Mobile?
              </h2>
              <div className="w-20 h-1 mb-6" style={{ backgroundColor: 'var(--chop-blue)' }} />
              <p className="mb-8 text-lg leading-relaxed" style={{ color: 'var(--chop-blue)' }}>
                Not sure if you are ready to be independently mobile? Click the link below to take the independent mobility assessment. This quick questionnaire will give you more information about what mobility option might be best for you and what skills you need for each.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/assessments">
                  <Button 
                    className="text-white px-6 py-3 font-medium w-full sm:w-auto"
                    style={{ backgroundColor: 'var(--chop-blue)' }}
                  >
                    Take our Assessment
                  </Button>
                </Link>
                <Link href="/modules">
                  <Button 
                    variant="outline" 
                    className="px-6 py-3 font-medium border-2 w-full sm:w-auto"
                    style={{ borderColor: 'var(--chop-blue)', color: 'var(--chop-blue)' }}
                  >
                    Think you are ready to drive?
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Pre-Footer with CHOP Logo */}
        <section className="py-12 bg-[#f5f5f5]">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div style={{ color: 'var(--chop-blue)' }}>
                <div className="flex items-center gap-3">
                  <div className="border-2 rounded-lg p-2" style={{ borderColor: 'var(--chop-blue)' }}>
                    <span className="text-2xl font-bold">CH</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Children's Hospital</p>
                    <p className="font-bold text-sm">of Philadelphia</p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--eta-green)' }}>RESEARCH INSTITUTE</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right text-gray-600">
              <p className="text-sm">3401 Civic Center Blvd.</p>
              <p className="text-sm">Philadelphia, PA 19104</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Full Site Map */}
      <footer className="text-white py-12" style={{ backgroundColor: 'var(--chop-blue)' }}>
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          {/* Footer Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">What is Independent Mobility?</h4>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Independent Mobility Options</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Pedestrian</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Biking</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Driving</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Public Transit</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Rideshare</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Explore all Options</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Prepare to be Mobile</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">The Ready to be Mobile Assessment</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ready for Driving Assessment</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Getting to Ready</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">Driving with Autism</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">What it is</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Participants</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Study Information</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Login to a Study</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">About ETA</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Research</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-white/20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-6 text-sm text-white/70">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
                <a href="#" className="hover:text-white transition-colors">Accessibility</a>
              </div>
              <p className="text-sm text-white/70">
                &copy; {new Date().getFullYear()} The Children's Hospital of Philadelphia. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
