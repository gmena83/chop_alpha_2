'use client';

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft,
  ChevronRight,
  Footprints,
  Car,
  Bus,
  Bike,
  Train
} from "lucide-react";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";

const heroImage = "/images/hero-driver.jpg";
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
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[480px] overflow-hidden">
          {/* Green background */}
          <div className="absolute inset-0 bg-[#7B8C2A]" />
          
          {/* Hero image on right side with diagonal cut */}
          <div className="absolute right-0 top-0 bottom-0 w-[55%] hidden lg:block overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${heroImage})`, backgroundPosition: '100% 50%', backgroundSize: 'auto 150%' }}
            />
            {/* Diagonal overlay from green side */}
            <svg 
              className="absolute left-0 top-0 h-full w-48" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none"
            >
              <polygon points="0,0 100,0 0,100" fill="#7B8C2A" />
            </svg>
          </div>

          <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative py-12 md:py-16">
            <div className="max-w-lg">
              {/* Transportation Icons Row */}
              <div className="flex items-center gap-5 mb-8">
                {/* Walking person */}
                <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="4" r="2"/>
                  <path d="M15.89 8.11C15.5 7.72 14.83 7 13.53 7c-.21 0-1.42 0-2.54 0-.72 0-1.42.3-1.93.81L6.8 10.08c-.39.39-.39 1.03 0 1.42.39.39 1.01.39 1.41 0L10 9.71V22h2v-6h2v6h2V9.17l3.35 3.35c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-4.87-3z"/>
                </svg>
                {/* Scooter/kick scooter */}
                <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7.5 18A2.5 2.5 0 0 1 5 15.5A2.5 2.5 0 0 1 7.5 13A2.5 2.5 0 0 1 10 15.5A2.5 2.5 0 0 1 7.5 18M10.5 9H11V4.5A.5.5 0 0 1 11.5 4H13V9H14.5L18 15.5A2.5 2.5 0 0 1 16.5 18A2.5 2.5 0 0 1 14 15.5C14 14.74 14.27 14.05 14.71 13.5L13 10.77V16H9V10.77L10.5 9Z"/>
                </svg>
                {/* Bicycle */}
                <Bike className="h-8 w-8 text-white" />
                {/* Car */}
                <Car className="h-8 w-8 text-white" />
                {/* Bus */}
                <Bus className="h-8 w-8 text-white" />
                {/* Van/minibus */}
                <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 10H6V5H18M18.5 15A1.5 1.5 0 0 1 17 13.5A1.5 1.5 0 0 1 18.5 12A1.5 1.5 0 0 1 20 13.5A1.5 1.5 0 0 1 18.5 15M5.5 15A1.5 1.5 0 0 1 4 13.5A1.5 1.5 0 0 1 5.5 12A1.5 1.5 0 0 1 7 13.5A1.5 1.5 0 0 1 5.5 15M21 5H19V4C19 2.89 18.11 2 17 2H7C5.89 2 5 2.89 5 4V5H3C2.45 5 2 5.45 2 6V8C2 8.55 2.45 9 3 9H5V11H3C2.45 11 2 11.45 2 12V18C2 18.55 2.45 19 3 19H5V20C5 20.55 5.45 21 6 21H7C7.55 21 8 20.55 8 20V19H16V20C16 20.55 16.45 21 17 21H18C18.55 21 19 20.55 19 20V19H21C21.55 19 22 18.55 22 18V6C22 5.45 21.55 5 21 5Z"/>
                </svg>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[52px] font-bold text-white leading-[1.15] mb-10">
                Achieve<br />
                Independent Mobility.
              </h1>

              <Button 
                variant="outline"
                className="text-white px-6 py-3 rounded-sm text-sm font-medium bg-transparent border-2 border-white hover:bg-white hover:text-[#7B8C2A] transition-colors"
                onClick={() => document.getElementById('mobility-info')?.scrollIntoView({ behavior: 'smooth' })}
              >
                What is Independent Mobility?
              </Button>
            </div>
          </div>

          {/* Carousel dots indicator */}
          <div className="absolute bottom-6 right-8 hidden lg:flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-white/40"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-white/40"></div>
          </div>
        </section>

        {/* Mobility Provides Independence Section */}
        <section id="mobility-info" className="py-16 md:py-20 bg-white">
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
        <section id="about" className="py-16 md:py-20 bg-[#1a5276]">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-10">
              Stories from People
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

            {/* Research Cards - 2 columns per Figma */}
            <div className="grid md:grid-cols-2 gap-8 mb-10 max-w-3xl">
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={therapistImage1} 
                    alt="Research study" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-base font-semibold mb-4 line-clamp-3 text-[#1a5276]">
                    Independent community mobility and driving experiences of adults on the autism spectrum: A scoping review
                  </h3>
                  <Button className="text-white text-sm px-5 py-2 bg-[#1a5276] hover:bg-[#154360]">
                    CTA
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
                  <h3 className="text-base font-semibold mb-4 line-clamp-3 text-[#1a5276]">
                    The role for occupational therapists in community mobility training for people with autism spectrum disorders
                  </h3>
                  <Button className="text-white text-sm px-5 py-2 bg-[#1a5276] hover:bg-[#154360]">
                    CTA
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

      </main>

      <PublicFooter />
    </div>
  );
}
