'use client';

import { Bus, Train, CheckCircle, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import MobilityHero from "@/components/public/MobilityHero";

const transitImage = "/images/public_transit_bus_c_2c9db796.jpg";

export default function PublicTransitPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PublicHeader />
      
      <main className="flex-1">
        <MobilityHero
          title="Public Transit"
          subtitle="Navigate Your City with Confidence"
          description="Buses, trains, and subways connect communities and provide affordable, reliable transportation. Learn to use public transit independently."
          heroImage={transitImage}
          icon={<Bus className="h-8 w-8 text-white" />}
          bgColor="#5b2c6f"
        />

        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1a5276]">
              Why Public Transit?
            </h2>
            <p className="text-gray-600 max-w-4xl mb-12 text-lg leading-relaxed">
              Public transportation opens up a world of possibilities. It's often more affordable than driving, doesn't require a license, and connects you to work, school, shopping, and social activities throughout your community. For many autistic individuals, mastering public transit is a practical path to independence.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-md">
                <img 
                  src={transitImage} 
                  alt="Public bus" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-md">
                <img 
                  src="/images/yellow_school_bus_pu_7ccb2dbe.jpg" 
                  alt="Transit options" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-md">
                <img 
                  src="/images/wheelchair_user_inde_eba74f9d.jpg" 
                  alt="Accessible transit" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <div className="w-full h-1 mb-8 bg-[#f4d03f]" />
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a5276]">
              Essential Transit Skills
            </h2>
            <p className="text-gray-600 max-w-4xl mb-12 text-lg">
              Our program teaches practical skills for using buses, trains, and other public transportation safely and confidently.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-6 w-6 text-[#5b2c6f]" />
                  <h3 className="text-xl font-semibold text-[#1a5276]">Reading Maps & Schedules</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Learn to read transit maps, understand schedules, and use apps to plan your trips. Know when buses and trains arrive.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <Bus className="h-6 w-6 text-[#5b2c6f]" />
                  <h3 className="text-xl font-semibold text-[#1a5276]">Boarding & Riding</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Practice boarding procedures, paying fares, finding seats, and knowing when to exit. Handle crowded situations.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <Train className="h-6 w-6 text-[#5b2c6f]" />
                  <h3 className="text-xl font-semibold text-[#1a5276]">Transfers & Connections</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Master transfers between routes, navigate transit hubs, and handle delays or unexpected changes.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button className="text-white px-6 py-3 font-medium bg-[#1a5276] hover:bg-[#154360]">
                Take Transit Assessment
              </Button>
              <Button 
                variant="outline" 
                className="px-6 py-3 font-medium border-2 border-[#1a5276] text-[#1a5276] hover:bg-[#1a5276] hover:text-white flex items-center gap-2"
              >
                View Transit Training Videos <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#1a5276]">
              Transit Tips for Autistic Riders
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4 p-6 bg-[#5b2c6f]/5 rounded-lg border border-[#5b2c6f]/20">
                <CheckCircle className="h-6 w-6 text-[#7cb342] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[#1a5276]">Plan Ahead</h3>
                  <p className="text-gray-600">
                    Check routes and schedules before you leave. Know which stop to exit and have a backup plan for delays.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-[#5b2c6f]/5 rounded-lg border border-[#5b2c6f]/20">
                <CheckCircle className="h-6 w-6 text-[#7cb342] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[#1a5276]">Manage Sensory Input</h3>
                  <p className="text-gray-600">
                    Consider noise-canceling headphones, sunglasses, or sitting in quieter areas of the vehicle.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-[#5b2c6f]/5 rounded-lg border border-[#5b2c6f]/20">
                <CheckCircle className="h-6 w-6 text-[#7cb342] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[#1a5276]">Travel During Off-Peak Hours</h3>
                  <p className="text-gray-600">
                    When possible, travel when transit is less crowded to reduce stress and have more space.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-[#5b2c6f]/5 rounded-lg border border-[#5b2c6f]/20">
                <CheckCircle className="h-6 w-6 text-[#7cb342] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[#1a5276]">Have a Support Contact</h3>
                  <p className="text-gray-600">
                    Keep a trusted contact's number available in case you need help or get lost during your trip.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-16 md:py-20 overflow-hidden bg-[#5b2c6f]">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative">
            <div className="max-w-lg">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-2 text-white">
                Ready to Ride
              </h2>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Public Transit?
              </h2>
              <div className="w-20 h-1 mb-6 bg-[#f4d03f]" />
              <p className="mb-8 text-lg leading-relaxed text-white/90">
                Take our transit readiness assessment to evaluate your skills and get a personalized learning plan for mastering public transportation in your area.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-white text-[#5b2c6f] px-6 py-3 font-medium w-full sm:w-auto hover:bg-gray-100">
                  Take Transit Assessment
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
