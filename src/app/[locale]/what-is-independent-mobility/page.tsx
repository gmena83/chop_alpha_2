'use client';

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft,
  ChevronRight,
  Footprints,
  Plane,
  Bike,
  Bus,
  Train,
  Car
} from "lucide-react";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";

const heroImage = "/images/public_transit_bus_c_2c9db796.jpg";
const motherDaughterImage = "/images/mother_and_teenage_d_cdeb60a5.jpg";
const teenBackpackImage = "/images/teenage_girl_student_936ca063.jpg";
const mobilityIllustration = "/images/wheelchair_user_inde_eba74f9d.jpg";

export default function WhatIsIndependentMobilityPage() {
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
        {/* Hero Section - Blue with diagonal */}
        <section className="relative min-h-[420px] overflow-hidden">
          <div className="absolute inset-0 bg-[#1a5276]" />
          
          <div className="absolute right-0 top-0 bottom-0 w-[55%] hidden lg:block overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <svg 
              className="absolute left-0 top-0 h-full w-48" 
              viewBox="0 0 100 100" 
              preserveAspectRatio="none"
            >
              <polygon points="0,0 100,0 0,100" fill="#1a5276" />
            </svg>
          </div>

          <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative py-12 md:py-16">
            <div className="max-w-lg">
              <div className="flex items-center gap-4 mb-8">
                <Footprints className="h-6 w-6 text-white" />
                <Plane className="h-6 w-6 text-white" />
                <Bike className="h-6 w-6 text-white" />
                <Bus className="h-6 w-6 text-white" />
                <Train className="h-6 w-6 text-white" />
                <Car className="h-6 w-6 text-white" />
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-8">
                Independent<br />Mobility
              </h1>

              <Button className="bg-[#f4d03f] text-[#1a5276] px-6 py-3 font-medium hover:bg-[#f1c40f] border-2 border-[#1a5276]">
                Take Our Independent Mobility Assessment
              </Button>
            </div>
          </div>
        </section>

        {/* What is Independent Mobility Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1a5276]">
                  What is Independent Mobility?
                </h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Independent mobility is being able to get around your community without help. Mobility options include walking, riding a bicycle or e-scooter, using a bus or train, calling a taxi or rideshare, and driving a personal vehicle and more. Developing the skills to use these options by yourself safely can take some time but it will greatly improve your quality of life.
                </p>
              </div>
              <div className="aspect-video bg-[#333] rounded-lg flex items-center justify-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits of Mobility Section */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1a5276]">
              Benefits of Mobility
            </h2>
            <p className="text-gray-700 max-w-5xl mb-12 text-lg leading-relaxed">
              The transition to adulthood for autistic adolescents is a complex process with a unique set of challenges for in-dependent living, employment, and social engagement (Chun 2023). Safe independent transport—whether via personal vehicle, public transit, rideshare, bicycle, foot, or micromobility device—has great potential to improve autistic teens' opportunities, and ultimately well-being and health.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Physical Development</h3>
                <p className="text-gray-600 leading-relaxed">
                  Independent mobility encourages increased physical activity, which can lead to improved motor skills and overall physical health. It allows for the development of coordination and balance as individuals navigate different environments. Regular movement and exercise can enhance cardiovascular health and strengthen muscles, contributing to a healthier lifestyle.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Social Development</h3>
                <p className="text-gray-600 leading-relaxed">
                  Independent mobility provides opportunities for autistic individuals to interact with others in various settings, fostering social engagement and communication skills. Navigating public spaces and engaging in community activities can help build confidence and independence in social situations. Additionally, it encourages participation in group activities and events, promoting a sense of belonging and improving social networks.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Independence</h3>
                <p className="text-gray-600 leading-relaxed">
                  Most autistic adults rely on family and friends to meet their transport needs (Deka 2016; Feeley 2010). This reliance limits daily activities and opportunities and places a burden on family and friends who provide rides or supervision (Feeley 2010).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stories from People Section */}
        <section className="relative py-16 md:py-20 overflow-hidden bg-[#1a5276]">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white">
              Stories from People
            </h2>

            <div className="relative bg-white rounded-lg overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-8 md:p-12 relative">
                  <div className="absolute top-0 left-0 w-24 h-24">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                      <polygon points="0,0 100,0 0,100" fill="#1a5276" />
                    </svg>
                  </div>
                  
                  <div className="relative z-10 pt-8">
                    <span className="text-[#1a5276] text-6xl font-serif">"</span>
                    <p className="text-[#1a5276] text-lg leading-relaxed mb-6 italic">
                      {testimonials[currentTestimonial].quote}
                    </p>
                    <span className="text-[#1a5276] text-6xl font-serif float-right -mt-4">"</span>
                    <div className="clear-both pt-4">
                      <p className="text-gray-600">
                        <span className="font-medium">{testimonials[currentTestimonial].author}</span>, {testimonials[currentTestimonial].role}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <img 
                    src={motherDaughterImage} 
                    alt="Parent and teen" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <button 
                  onClick={prevTestimonial}
                  className="w-12 h-12 rounded-full bg-[#1a5276] text-white flex items-center justify-center hover:bg-[#154360] transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <button 
                  onClick={nextTestimonial}
                  className="w-12 h-12 rounded-full bg-[#1a5276] text-white flex items-center justify-center hover:bg-[#154360] transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              <div className="flex justify-center gap-2 pb-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      currentTestimonial === index ? 'bg-[#1a5276]' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Explore Mobility Options Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-[#1a5276]">
                  Explore Mobility
                </h2>
                <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#1a5276]">
                  Options
                </h2>
                <div className="w-16 h-1 bg-[#1a5276] mb-8" />
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  Autistic adolescents have a variety of mobility options to support their independence and development. These options include personal mobility devices such as bicycles, scooters, and skateboards, which can enhance their physical coordination and provide a sense of freedom. Additionally, public transportation systems like buses and trains are accessible options, often with accommodations such as priority seating and assistance from transit staff. For those who prefer more personalized solutions, ride-sharing services and community-based transportation programs offer convenient and flexible options.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Some adolescents may also benefit from specialized mobility training programs that teach them how to safely navigate different environments and use various transportation modes confidently. These diverse mobility options empower autistic adolescents to explore their surroundings, engage in social activities, and develop essential life skills.
                </p>
              </div>
              <div className="flex justify-center">
                <img 
                  src={mobilityIllustration} 
                  alt="Mobility illustration" 
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Green background */}
        <section className="relative py-16 md:py-20 overflow-hidden bg-[#7B8C2A]">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${teenBackpackImage})` }}
            />
            <svg className="absolute left-0 top-0 bottom-0 h-full w-32" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="0,0 100,0 0,100" fill="#7B8C2A" />
            </svg>
          </div>

          <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative">
            <div className="max-w-lg">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-2 text-[#1a5276] italic">
                Are You Ready to Be
              </h2>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#1a5276] italic">
                Independently Mobile?
              </h2>
              <div className="w-16 h-1 bg-[#1a5276] mb-8" />
              <p className="mb-8 text-lg leading-relaxed text-[#1a5276]">
                Not sure if you are ready to be independently mobile? Click the link below to take the independent mobility assessment. This quick questionnaire will give you more information about what mobility option might be best for you and what skills you need for each.
              </p>

              <div className="flex flex-col gap-4">
                <Button 
                  variant="outline"
                  className="px-6 py-3 font-medium w-fit border-2 border-[#1a5276] text-[#1a5276] bg-transparent hover:bg-[#1a5276] hover:text-white"
                >
                  Take our Independent Mobility Assessment
                </Button>
                <Button 
                  variant="outline"
                  className="px-6 py-3 font-medium w-fit border-2 border-[#1a5276] text-[#1a5276] bg-transparent hover:bg-[#1a5276] hover:text-white"
                >
                  Think you are ready to drive? Find out!
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
