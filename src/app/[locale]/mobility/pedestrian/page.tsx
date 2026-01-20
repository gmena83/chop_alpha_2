'use client';

import { Footprints, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import MobilityHero from "@/components/public/MobilityHero";

const walkingImage = "/images/person_walking_on_si_cd47e8a3.jpg";

export default function PedestrianPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PublicHeader />
      
      <main className="flex-1">
        <MobilityHero
          title="Pedestrian Mobility"
          subtitle="Walking Towards Independence"
          description="Walking is often the first step toward independent mobility. Learn how to navigate sidewalks, crosswalks, and public spaces safely and confidently."
          heroImage={walkingImage}
          icon={<Footprints className="h-8 w-8 text-white" />}
          bgColor="#1a5276"
        />

        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1a5276]">
              Why Walking Matters
            </h2>
            <p className="text-gray-600 max-w-4xl mb-12 text-lg leading-relaxed">
              Pedestrian mobility is the foundation of independent travel. Walking allows individuals to access nearby destinations, connect to other forms of transportation, and build confidence in navigating their environment. For many autistic adolescents, mastering pedestrian skills is the gateway to greater independence.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-md">
                <img 
                  src="/images/person_walking_pedes_36789b8e.jpg" 
                  alt="Person walking safely" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-md">
                <img 
                  src={walkingImage}
                  alt="Walking in the community" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-md">
                <img 
                  src="/images/wheelchair_user_inde_eba74f9d.jpg" 
                  alt="Accessible pedestrian paths" 
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
              Key Pedestrian Skills
            </h2>
            <p className="text-gray-600 max-w-4xl mb-12 text-lg">
              The ETA program helps develop essential pedestrian skills that build confidence and safety awareness.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-[#7cb342]" />
                  <h3 className="text-xl font-semibold text-[#1a5276]">Crosswalk Safety</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Learn to recognize crosswalks, understand pedestrian signals, and make safe decisions about when to cross streets.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-[#7cb342]" />
                  <h3 className="text-xl font-semibold text-[#1a5276]">Route Planning</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Develop skills for planning walking routes, identifying landmarks, and navigating to familiar destinations.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-[#7cb342]" />
                  <h3 className="text-xl font-semibold text-[#1a5276]">Situational Awareness</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Build awareness of surroundings, recognize potential hazards, and practice safe pedestrian behaviors.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button className="text-white px-6 py-3 font-medium bg-[#1a5276] hover:bg-[#154360]">
                Take Pedestrian Assessment
              </Button>
              <Button 
                variant="outline" 
                className="px-6 py-3 font-medium border-2 border-[#1a5276] text-[#1a5276] hover:bg-[#1a5276] hover:text-white flex items-center gap-2"
              >
                View Training Resources <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className="relative py-16 md:py-20 overflow-hidden bg-[#7cb342]">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative">
            <div className="max-w-lg">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-2 text-[#1a5276]">
                Ready to Start Walking
              </h2>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1a5276]">
                Independently?
              </h2>
              <div className="w-20 h-1 mb-6 bg-[#1a5276]" />
              <p className="mb-8 text-lg leading-relaxed text-[#1a5276]">
                Take our pedestrian readiness assessment to discover your current skill level and get personalized recommendations for building your walking independence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="text-white px-6 py-3 font-medium w-full sm:w-auto bg-[#1a5276] hover:bg-[#154360]">
                  Take Pedestrian Assessment
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
