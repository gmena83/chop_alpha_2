'use client';

import { useState } from "react";
import { Train, ChevronLeft, ChevronRight, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";

const heroImage = "/images/public_transit_bus_c_2c9db796.jpg";
const motherDaughterImage = "/images/mother_and_teenage_d_cdeb60a5.jpg";
const skateboardImage = "/images/teenage_girl_student_936ca063.jpg";

const resources = [
  { title: "TeenDriverSource: The Basics" },
  { title: "TeenDriverSource: Adjust the wheel" },
  { title: "TeenDriverSource: Adjust the seat" },
  { title: "TeenDriverSource: The Mirrors" },
  { title: "TeenDriverSource: Understanding the Car" }
];

const readinessQuestions = [
  "Can you tolerate rides from unfamiliar people to unfamiliar places?",
  "Can you sit or stand without being disruptive, such as spinning or shouting?",
  "Can you plan a route to a specified destination?"
];

export default function PublicTransitPage() {
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
        {/* Hero Section - Pink/Magenta with diagonal */}
        <section className="relative min-h-[380px] overflow-hidden">
          <div className="absolute inset-0 bg-[#b5446e]" />
          
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
              <polygon points="0,0 100,0 0,100" fill="#b5446e" />
            </svg>
          </div>

          <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative py-12 md:py-16">
            <div className="max-w-lg">
              <div className="mb-6">
                <Train className="h-10 w-10 text-white" />
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-8">
                Public Transit
              </h1>
            </div>
          </div>
        </section>

        {/* What to expect Section */}
        <section className="py-16 md:py-20 bg-[#f5f5f0]">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
              What to expect.
            </h2>
            <p className="text-gray-700 max-w-5xl text-lg leading-relaxed">
              Public transit can pose challenges for autistic individuals due to sensory sensitivities, anxiety, and the need for predictability. Tools like noise-canceling headphones, visual aids, and transit apps can help manage these difficulties. Rehearsing routes, using social stories, and support systems like travel training or companions enhance confidence. With improved accessibility and understanding, public transit can become a viable option for many autistic individuals. Building awareness among transit providers and passengers is key to creating a more inclusive environment.
            </p>
          </div>
        </section>

        {/* Common Fears and Misconceptions Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#1a5276]">
              Common Fears and Misconceptions
            </h2>
            <p className="text-gray-700 max-w-5xl text-lg leading-relaxed">
              Public transit can pose challenges for autistic individuals due to sensory sensitivities, anxiety, and the need for predictability. Tools like noise-canceling headphones, visual aids, and transit apps can help manage these difficulties. Rehearsing routes, using social stories, and support systems like travel training or companions enhance confidence. With improved accessibility and understanding, public transit can become a viable option for many autistic individuals. Building awareness among transit providers and passengers is key to creating a more inclusive environment.
            </p>
          </div>
        </section>

        {/* How to Prepare Section */}
        <section className="py-16 md:py-20 bg-[#f5f5f0]">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#1a5276]">
              How to Prepare
            </h2>
            <p className="text-gray-700 max-w-5xl text-lg leading-relaxed mb-8">
              Public transit can pose challenges for autistic individuals due to sensory sensitivities, anxiety, and the need for predictability. Tools like noise-canceling headphones, visual aids, and transit apps can help manage these difficulties. Rehearsing routes, using social stories, and support systems like travel training or companions enhance confidence. With improved accessibility and understanding, public transit can become a viable option for many autistic individuals. Building awareness among transit providers and passengers is key to creating a more inclusive environment.
            </p>
            
            <p className="text-gray-700 mb-6">
              Below are additional resources that may help you get started with public transit
            </p>

            <div className="grid md:grid-cols-2 gap-4 max-w-3xl">
              {resources.map((resource, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
                >
                  <span className="text-gray-700">{resource.title}</span>
                  <Video className="h-5 w-5 text-[#1a5276]" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Are You Ready Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1a5276]">
              Are You Ready?
            </h2>
            <p className="text-gray-700 max-w-3xl mb-8 text-lg">
              Placeholder text to the effect of — if you think you are ready, here is a checklist of skills you should be prepared to practice to ride public transit successfully.
            </p>
            
            <div className="max-w-3xl space-y-4">
              {readinessQuestions.map((question, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1a5276] text-white font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 pt-1">{question}</p>
                </div>
              ))}
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

        {/* What mobility options are you ready for? Section */}
        <section className="py-16 md:py-20 bg-[#f5f5dc]/30">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2 text-[#1a5276] italic">
                  What mobility options are you
                </h2>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1a5276] italic">
                  ready for?
                </h2>
                <div className="w-16 h-1 bg-[#1a5276] mb-8" />
                
                <p className="text-gray-700 leading-relaxed mb-8 text-lg">
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
                    Explore All Mobility Options
                  </Button>
                </div>
              </div>
              <div className="flex justify-center">
                <img 
                  src={skateboardImage} 
                  alt="Teen with skateboard" 
                  className="max-w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
