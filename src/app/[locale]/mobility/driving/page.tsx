'use client';

import { Car, CheckCircle, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import MobilityHero from "@/components/public/MobilityHero";

const drivingImage = "/images/hero-driver.jpg";

export default function DrivingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PublicHeader />
      
      <main className="flex-1">
        <MobilityHero
          title="Driving"
          subtitle="Your Path to Complete Independence"
          description="Driving offers the greatest flexibility and independence in transportation. Learn about the journey to becoming a licensed driver with autism-informed support."
          heroImage={drivingImage}
          icon={<Car className="h-8 w-8 text-white" />}
          bgColor="#7B8C2A"
        />

        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1a5276]">
              Driving with Autism
            </h2>
            <p className="text-gray-600 max-w-4xl mb-12 text-lg leading-relaxed">
              Many autistic individuals are successful drivers. Research shows that with proper training and support, autistic teens and adults can learn to drive safely. The ETA program provides autism-informed resources and guidance throughout the licensing process.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-md">
                <img 
                  src="/images/young_woman_driving__394b7a25.jpg" 
                  alt="Teen learning to drive" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-md">
                <img 
                  src={drivingImage}
                  alt="Confident driver" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="aspect-[4/3] overflow-hidden rounded-lg shadow-md">
                <img 
                  src="/images/mother_and_teenage_d_cdeb60a5.jpg" 
                  alt="Parent teaching teen to drive" 
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
              The Path to Driving
            </h2>
            <p className="text-gray-600 max-w-4xl mb-12 text-lg">
              The ETA program breaks down the driving journey into manageable steps with autism-specific support at each stage.
            </p>

            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 rounded-full mb-4 bg-[#f4d03f]">
                  <span className="text-lg font-bold text-[#1a5276]">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-[#1a5276]">
                  Readiness Assessment
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Evaluate driving readiness and identify areas for skill development before starting lessons.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 rounded-full mb-4 bg-[#f4d03f]">
                  <span className="text-lg font-bold text-[#1a5276]">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-[#1a5276]">
                  Learner's Permit
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Study for and pass the written test. Get your learner's permit to begin supervised driving.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 rounded-full mb-4 bg-[#f4d03f]">
                  <span className="text-lg font-bold text-[#1a5276]">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-[#1a5276]">
                  Practice Driving
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Build skills through supervised practice with parents and professional driving instructors.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-center w-12 h-12 rounded-full mb-4 bg-[#f4d03f]">
                  <span className="text-lg font-bold text-[#1a5276]">4</span>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-[#1a5276]">
                  Driver's License
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Pass the road test and earn your driver's license. Continue building safe driving habits.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button className="text-white px-6 py-3 font-medium bg-[#1a5276] hover:bg-[#154360]">
                Take Driving Readiness Assessment
              </Button>
              <Button 
                variant="outline" 
                className="px-6 py-3 font-medium border-2 border-[#1a5276] text-[#1a5276] hover:bg-[#1a5276] hover:text-white flex items-center gap-2"
              >
                Find Autism-Friendly Driving Schools <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#1a5276]">
              Autism-Informed Support
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4 p-6 bg-gray-50 rounded-lg">
                <Shield className="h-8 w-8 text-[#7cb342] flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[#1a5276]">Sensory Considerations</h3>
                  <p className="text-gray-600">
                    Learn strategies for managing sensory input while driving, including traffic noise, bright lights, and visual distractions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-gray-50 rounded-lg">
                <Shield className="h-8 w-8 text-[#7cb342] flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[#1a5276]">Executive Function Support</h3>
                  <p className="text-gray-600">
                    Tools and techniques for planning routes, managing time, and handling unexpected situations on the road.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-gray-50 rounded-lg">
                <Shield className="h-8 w-8 text-[#7cb342] flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[#1a5276]">Social Situations</h3>
                  <p className="text-gray-600">
                    Navigate interactions with other drivers, traffic stops, and roadside assistance with confidence.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-gray-50 rounded-lg">
                <Shield className="h-8 w-8 text-[#7cb342] flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-[#1a5276]">Anxiety Management</h3>
                  <p className="text-gray-600">
                    Strategies for managing driving anxiety and building confidence behind the wheel over time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-16 md:py-20 overflow-hidden bg-[#7cb342]">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(/images/teenage_girl_student_936ca063.jpg)` }}
            />
            <svg className="absolute left-0 top-0 bottom-0 h-full w-32" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="0,0 100,0 0,100" fill="#7cb342" />
            </svg>
          </div>

          <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative">
            <div className="max-w-lg">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-2 text-[#1a5276]">
                Ready to Start Your
              </h2>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1a5276]">
                Driving Journey?
              </h2>
              <div className="w-20 h-1 mb-6 bg-[#1a5276]" />
              <p className="mb-8 text-lg leading-relaxed text-[#1a5276]">
                Take our comprehensive driving readiness assessment to understand where you are in your journey and get personalized next steps.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="text-white px-6 py-3 font-medium w-full sm:w-auto bg-[#1a5276] hover:bg-[#154360]">
                  Take Driving Assessment
                </Button>
                <Button 
                  variant="outline" 
                  className="px-6 py-3 font-medium border-2 w-full sm:w-auto border-[#1a5276] text-[#1a5276] hover:bg-[#1a5276] hover:text-white"
                >
                  View Driving Resources
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
