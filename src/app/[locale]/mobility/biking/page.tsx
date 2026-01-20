'use client';

import { Bike, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import MobilityHero from "@/components/public/MobilityHero";

export default function BikingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PublicHeader />
      
      <main className="flex-1">
        <MobilityHero
          title="Biking"
          subtitle="Freedom on Two Wheels"
          description="Cycling offers an affordable, healthy, and environmentally friendly way to travel independently. Learn the skills needed to bike safely in your community."
          heroImage="/images/person_walking_pedes_36789b8e.jpg"
          icon={<Bike className="h-8 w-8 text-white" />}
          bgColor="#17a589"
        />

        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1a5276]">
              Benefits of Biking
            </h2>
            <p className="text-gray-600 max-w-4xl mb-12 text-lg leading-relaxed">
              Biking combines physical activity with practical transportation. For autistic adolescents, cycling can provide a sense of freedom and accomplishment while building motor skills, coordination, and spatial awareness. It's also a great way to extend your travel range beyond walking distance.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-[#1a5276]">Physical Benefits</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#7cb342] mt-0.5 flex-shrink-0" />
                    <span>Improves cardiovascular health and endurance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#7cb342] mt-0.5 flex-shrink-0" />
                    <span>Builds leg strength and coordination</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#7cb342] mt-0.5 flex-shrink-0" />
                    <span>Enhances balance and motor planning</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-[#1a5276]">Independence Benefits</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#7cb342] mt-0.5 flex-shrink-0" />
                    <span>Travel further than walking allows</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#7cb342] mt-0.5 flex-shrink-0" />
                    <span>No fuel costs or license requirements</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#7cb342] mt-0.5 flex-shrink-0" />
                    <span>Access bike lanes and paths</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-gray-50">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <div className="w-full h-1 mb-8 bg-[#f4d03f]" />
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a5276]">
              Essential Biking Skills
            </h2>
            <p className="text-gray-600 max-w-4xl mb-12 text-lg">
              Our program covers everything from basic bike handling to navigating traffic safely.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-center w-14 h-14 rounded-full mb-6 bg-[#f4d03f]">
                  <span className="text-xl font-bold text-[#1a5276]">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[#1a5276]">
                  Basic Riding Skills
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Learn balance, pedaling, steering, and stopping. Practice in safe environments before moving to streets.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-center w-14 h-14 rounded-full mb-6 bg-[#f4d03f]">
                  <span className="text-xl font-bold text-[#1a5276]">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[#1a5276]">
                  Traffic Rules & Signals
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Understand traffic signs, signals, and right-of-way rules. Learn hand signals for turning and stopping.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-center w-14 h-14 rounded-full mb-6 bg-[#f4d03f]">
                  <span className="text-xl font-bold text-[#1a5276]">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[#1a5276]">
                  Route Planning
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Identify safe routes, use bike lanes and paths, and plan trips to school, work, or recreational destinations.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button className="text-white px-6 py-3 font-medium bg-[#1a5276] hover:bg-[#154360]">
                Take Biking Assessment
              </Button>
              <Button 
                variant="outline" 
                className="px-6 py-3 font-medium border-2 border-[#1a5276] text-[#1a5276] hover:bg-[#1a5276] hover:text-white flex items-center gap-2"
              >
                Find Bike Training Programs <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className="relative py-16 md:py-20 overflow-hidden bg-[#17a589]">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative">
            <div className="max-w-lg">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-2 text-white">
                Is Biking Right
              </h2>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                For You?
              </h2>
              <div className="w-20 h-1 mb-6 bg-white" />
              <p className="mb-8 text-lg leading-relaxed text-white/90">
                Take our biking readiness assessment to evaluate your current skills and receive a personalized plan for learning to ride safely in your community.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-white text-[#17a589] px-6 py-3 font-medium w-full sm:w-auto hover:bg-gray-100">
                  Take Biking Assessment
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
