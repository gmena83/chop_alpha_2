'use client';

import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";

const heroImage = "/images/young_woman_driving__7b985bdb.jpg";
const skateboardImage = "/images/teenage_girl_student_936ca063.jpg";

const readinessQuestions = [
  "Can you tolerate rides from unfamiliar people to unfamiliar places?",
  "Can you sit or stand without being disruptive, such as spinning or shouting?",
  "Can you plan a route to a specified destination?"
];

export default function RidesharePage() {
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
                <Car className="h-10 w-10 text-white" />
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-8">
                Ride Share
              </h1>

              <Button 
                className="bg-[#f4d03f] text-gray-800 px-6 py-3 font-medium hover:bg-[#f1c40f]"
              >
                Take Our Independent Mobility Assessment
              </Button>
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

        {/* Are you ready to use public transit? Section */}
        <section className="py-16 md:py-20 bg-[#f5f5f0]">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">
              Are you ready to use public transit?
            </h2>
            
            <div className="max-w-3xl space-y-0">
              {readinessQuestions.map((question, index) => (
                <div key={index}>
                  <div className="border-t border-gray-300 py-4">
                    <p className="text-gray-700">{question}</p>
                  </div>
                </div>
              ))}
              <div className="border-t border-gray-300" />
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
                <div className="w-16 h-1 bg-[#5bb4d5] mb-8" />
                
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
                    Think you are ready to drive? Find Out!
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
