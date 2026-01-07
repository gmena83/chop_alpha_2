'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
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

const heroImage = "/images/young_woman_driving__394b7a25.jpg";
const walkingImage = "/images/person_walking_on_si_cd47e8a3.jpg";
const busImage = "/images/public_transit_bus_c_2c9db796.jpg";
const wheelchairImage = "/images/wheelchair_user_inde_eba74f9d.jpg";
const motherDaughterImage = "/images/mother_and_teenage_d_cdeb60a5.jpg";
const teenBackpackImage = "/images/teenage_girl_student_936ca063.jpg";
const therapistImage1 = "/images/occupational_therapi_ca8af19f.jpg";
const therapistImage2 = "/images/occupational_therapi_c4615718.jpg";

export default function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      quote: "I think driving helped her have a good sense of independence that she was becoming a young adult and really able to dream big and see just how independent a life she could have",
      author: "Linda",
      role: "the Parent of an Autistic Driver"
    },
    {
      quote: "The ETA program gave us the tools and confidence we needed to support our son's journey to independent mobility.",
      author: "Maria",
      role: "Parent of a Teen with ADHD"
    },
    {
      quote: "Having structured guidance made all the difference in helping our family navigate this important milestone.",
      author: "James",
      role: "Parent of an Autistic Teen"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full text-white" style={{ backgroundColor: '#5b2c6f' }}>
        <div className="w-full px-4 md:px-8 flex h-16 items-center justify-between max-w-[1400px] mx-auto">
          <div className="flex items-center gap-6">
            {/* ETA Logo */}
            <a href="/" className="flex items-center gap-3">
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
            </a>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm px-3 py-2 hover:text-[#f4d03f] transition-colors">
                What is Independent Mobility?
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm px-3 py-2 hover:text-[#f4d03f] transition-colors">
                Independent Mobility Options
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm px-3 py-2 hover:text-[#f4d03f] transition-colors">
                Prepare to be Mobile
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </nav>

          {/* Search and Login */}
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 text-sm hover:text-[#f4d03f] transition-colors">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
            <a href="/en/auth/login" className="flex items-center gap-1 text-sm hover:text-[#f4d03f] transition-colors">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </a>
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
                <span className="block mb-2 text-[#f4d03f]">ETA</span>
                Empowering<br />
                Transportation<br />
                among Autistic<br />
                adolescents
              </h1>
              
              <p className="text-white/90 text-lg mb-8 max-w-md leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget luctus est, ut blandit dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>

              <Button 
                className="text-white px-8 py-3 rounded-full text-base font-medium bg-[#1a5276] hover:bg-[#154360]"
              >
                What is Independent Mobility?
              </Button>
            </div>
          </div>
        </section>

        {/* Mobility Provides Independence Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1a5276]">
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

        {/* Become Independently Mobile Section */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            {/* Yellow accent line */}
            <div className="w-full h-1 mb-8 bg-[#f4d03f]" />
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a5276]">
              Become Independently Mobile
            </h2>
            <p className="text-gray-600 max-w-4xl mb-12 text-lg">
              The ETA program guides you on a journey to independent mobility, ensuring you understand the benefits, find the best mobility option for you, and have the tools needed to start getting around independently.
            </p>

            {/* Three Column Layout */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {/* Column 1: Understand the Benefits */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-center w-14 h-14 rounded-full mb-6 bg-[#f4d03f]">
                  <span className="text-xl font-bold text-[#1a5276]">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[#1a5276]">
                  Understand the Benefits
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Independent mobility empowers individuals to access essential services, pursue vocational and educational opportunities, and engage in social activities without relying on others. It fosters a sense of confidence and self-reliance.
                </p>
              </div>

              {/* Column 2: Find your Mobility Fit */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-center w-14 h-14 rounded-full mb-6 bg-[#f4d03f]">
                  <span className="text-xl font-bold text-[#1a5276]">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[#1a5276]">
                  Find your Mobility Fit
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  There are lots of different ways to get around independently including walking, riding a bike, taking a bus or train, and even driving. The ETA program will help you discover which of these options is best for your family.
                </p>
              </div>

              {/* Column 3: Prepare to be Mobile */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-center w-14 h-14 rounded-full mb-6 bg-[#f4d03f]">
                  <span className="text-xl font-bold text-[#1a5276]">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[#1a5276]">
                  Prepare to be Mobile
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Once you identify the mobility option to pursue, there are many steps you can take to get ready. The ETA program offers resources like video training, at-home activities, and daily living tasks to help develop the skills needed.
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button className="text-white px-6 py-3 font-medium bg-[#1a5276] hover:bg-[#154360]">
                Take Our Mobility Assessment
              </Button>
              <Button 
                variant="outline" 
                className="px-6 py-3 font-medium border-2 border-[#1a5276] text-[#1a5276] hover:bg-[#1a5276] hover:text-white"
              >
                Think you are ready to drive? Find out!
              </Button>
            </div>
          </div>
        </section>

        {/* Stories from People Section */}
        <section className="py-16 md:py-20 bg-[#1a5276]">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
              Stories from People Like You
            </h2>

            <div className="relative">
              {/* Testimonial Card */}
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Left Arrow */}
                <button 
                  onClick={prevTestimonial}
                  className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                {/* Testimonial Content */}
                <div className="flex-1 flex flex-col lg:flex-row items-center gap-8 bg-white/10 backdrop-blur-sm p-8 rounded-xl">
                  <div className="flex-1">
                    <div className="text-6xl mb-4 text-[#f4d03f]">"</div>
                    <p className="text-white text-xl italic mb-6 leading-relaxed">
                      {testimonials[currentTestimonial].quote}
                    </p>
                    <p className="text-white/80 text-base font-medium">
                      — {testimonials[currentTestimonial].author}, {testimonials[currentTestimonial].role}
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
                  onClick={nextTestimonial}
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

        {/* The Latest Research Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a5276]">
              The Latest Research
            </h2>
            <p className="text-gray-600 mb-10 text-lg">
              Check out some of the latest research on independent mobility.
            </p>

            {/* Research Cards */}
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
                  <h3 className="text-lg font-semibold mb-4 line-clamp-3 text-[#1a5276]">
                    Independent community mobility and driving experiences of adults on the autism spectrum: A scoping review
                  </h3>
                  <Button className="text-white text-sm px-5 py-2 bg-[#1a5276] hover:bg-[#154360]">
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
                  <h3 className="text-lg font-semibold mb-4 line-clamp-3 text-[#1a5276]">
                    The role for occupational therapists in community mobility training for people with autism spectrum disorders
                  </h3>
                  <Button className="text-white text-sm px-5 py-2 bg-[#1a5276] hover:bg-[#154360]">
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
                  <h3 className="text-lg font-semibold mb-4 line-clamp-3 text-[#1a5276]">
                    Promoting pedestrian safety and independent mobility in autism spectrum disorder
                  </h3>
                  <Button className="text-white text-sm px-5 py-2 bg-[#1a5276] hover:bg-[#154360]">
                    Read More
                  </Button>
                </div>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="font-medium border-2 border-[#1a5276] text-[#1a5276] hover:bg-[#1a5276] hover:text-white"
            >
              View all research
            </Button>
          </div>
        </section>

        {/* Are You Ready Section - Assessment CTA */}
        <section className="relative py-16 md:py-20 overflow-hidden bg-[#7cb342]">
          {/* Background image on right */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${teenBackpackImage})` }}
            />
            <svg className="absolute left-0 top-0 bottom-0 h-full w-32" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="0,0 100,0 0,100" fill="#7cb342" />
            </svg>
          </div>

          <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative">
            <div className="max-w-lg">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-2 text-[#1a5276]">
                Are You Ready to Be
              </h2>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1a5276]">
                Independently Mobile?
              </h2>
              <div className="w-20 h-1 mb-6 bg-[#1a5276]" />
              <p className="mb-8 text-lg leading-relaxed text-[#1a5276]">
                Not sure if you are ready to be independently mobile? Click the link below to take the independent mobility assessment. This quick questionnaire will give you more information about what mobility option might be best for you and what skills you need for each.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="text-white px-6 py-3 font-medium w-full sm:w-auto bg-[#1a5276] hover:bg-[#154360]">
                  Take our Independent Mobility Assessment
                </Button>
                <Button 
                  variant="outline" 
                  className="px-6 py-3 font-medium border-2 w-full sm:w-auto border-[#1a5276] text-[#1a5276] hover:bg-[#1a5276] hover:text-white"
                >
                  Think you are ready to drive?
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CHOP Research Institute Pre-Footer */}
        <section className="py-12 bg-[#f5f5f5]">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#1a5276] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">CHOP</span>
              </div>
              <div>
                <p className="font-semibold text-[#1a5276]">CHOP Research Institute</p>
                <p className="text-gray-600 text-sm">Leading pediatric research innovation</p>
              </div>
            </div>
            <Button className="text-white bg-[#1a5276] hover:bg-[#154360]">
              Learn More About Our Research
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a5276] text-white py-12">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          {/* Footer Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
            <div>
              <h3 className="font-semibold mb-4 text-[#f4d03f]">About ETA</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Our Mission</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Our Team</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Research Partners</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-[#f4d03f]">Mobility Options</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Pedestrian</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Driving</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Public Transit</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Rideshare</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Biking</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-[#f4d03f]">Resources</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Assessments</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training Modules</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Video Library</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-[#f4d03f]">Research</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Publications</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Current Studies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Participate</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-[#f4d03f]">For Families</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Getting Started</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Parent Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Teen Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-[#f4d03f]">Legal</h3>
              <ul className="space-y-2 text-sm text-white/80">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-[#f4d03f]">ET</span>
              <span className="text-2xl font-bold text-[#f4d03f]">
                <svg viewBox="0 0 24 24" className="h-5 w-5 inline mx-[-2px]" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                A
              </span>
              <span className="text-sm text-white/60 ml-2">| A CHOP Research Initiative</span>
            </div>
            <p className="text-sm text-white/60">
              © 2025 The Children's Hospital of Philadelphia. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
