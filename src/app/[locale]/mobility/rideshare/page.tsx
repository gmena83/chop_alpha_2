'use client';

import { Smartphone, CheckCircle, ArrowRight, Shield, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import MobilityHero from "@/components/public/MobilityHero";

export default function RidesharePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PublicHeader />
      
      <main className="flex-1">
        <MobilityHero
          title="Rideshare"
          subtitle="On-Demand Transportation"
          description="Services like Uber and Lyft provide flexible, door-to-door transportation. Learn how to use rideshare apps safely and confidently."
          heroImage="/images/young_woman_driving__7b985bdb.jpg"
          icon={<Smartphone className="h-8 w-8 text-white" />}
          bgColor="#e67e22"
        />

        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1a5276]">
              Understanding Rideshare Services
            </h2>
            <p className="text-gray-600 max-w-4xl mb-12 text-lg leading-relaxed">
              Rideshare services like Uber and Lyft offer flexible transportation through smartphone apps. You request a ride, a driver picks you up, and takes you to your destination. While convenient, using rideshare requires specific skills around app usage, safety awareness, and social interaction.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-[#1a5276]">Advantages</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#7cb342] mt-0.5 flex-shrink-0" />
                    <span>Door-to-door service - no walking to transit stops</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#7cb342] mt-0.5 flex-shrink-0" />
                    <span>Available 24/7 in most areas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#7cb342] mt-0.5 flex-shrink-0" />
                    <span>No need for a driver's license</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-[#7cb342] mt-0.5 flex-shrink-0" />
                    <span>Track your ride and share location with family</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-[#1a5276]">Considerations</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-[#e67e22] mt-0.5 flex-shrink-0" />
                    <span>Requires a smartphone with data plan</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-[#e67e22] mt-0.5 flex-shrink-0" />
                    <span>More expensive than public transit for regular use</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-[#e67e22] mt-0.5 flex-shrink-0" />
                    <span>Riding with unknown drivers requires safety awareness</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-[#e67e22] mt-0.5 flex-shrink-0" />
                    <span>Payment method (card/account) needed</span>
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
              Using Rideshare Safely
            </h2>
            <p className="text-gray-600 max-w-4xl mb-12 text-lg">
              Our program teaches essential skills for using rideshare services confidently and safely.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-center w-14 h-14 rounded-full mb-6 bg-[#e67e22]">
                  <Smartphone className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[#1a5276]">
                  App Navigation
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Learn to use the app to enter your destination, request rides, track your driver, and rate your experience.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-center w-14 h-14 rounded-full mb-6 bg-[#e67e22]">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[#1a5276]">
                  Safety Verification
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Always verify your driver's name, photo, license plate, and car before getting in. Share your trip with trusted contacts.
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-center w-14 h-14 rounded-full mb-6 bg-[#e67e22]">
                  <CreditCard className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-[#1a5276]">
                  Payment & Budgeting
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Understand pricing, surge pricing, and how to budget for rideshare costs. Set up payment methods safely.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button className="text-white px-6 py-3 font-medium bg-[#1a5276] hover:bg-[#154360]">
                Take Rideshare Assessment
              </Button>
              <Button 
                variant="outline" 
                className="px-6 py-3 font-medium border-2 border-[#1a5276] text-[#1a5276] hover:bg-[#1a5276] hover:text-white flex items-center gap-2"
              >
                View Rideshare Safety Tips <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#1a5276]">
              Rideshare Safety Checklist
            </h2>
            
            <div className="max-w-2xl">
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-6 w-6 text-[#7cb342] flex-shrink-0" />
                  <span className="text-gray-700">Match the license plate to what's shown in the app</span>
                </div>
                <div className="flex gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-6 w-6 text-[#7cb342] flex-shrink-0" />
                  <span className="text-gray-700">Confirm the driver's name before getting in the car</span>
                </div>
                <div className="flex gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-6 w-6 text-[#7cb342] flex-shrink-0" />
                  <span className="text-gray-700">Sit in the back seat for your safety</span>
                </div>
                <div className="flex gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-6 w-6 text-[#7cb342] flex-shrink-0" />
                  <span className="text-gray-700">Share your trip status with a family member or friend</span>
                </div>
                <div className="flex gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-6 w-6 text-[#7cb342] flex-shrink-0" />
                  <span className="text-gray-700">Follow along on the app to make sure you're going the right way</span>
                </div>
                <div className="flex gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-6 w-6 text-[#7cb342] flex-shrink-0" />
                  <span className="text-gray-700">Trust your instincts - cancel if something feels wrong</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-16 md:py-20 overflow-hidden bg-[#e67e22]">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative">
            <div className="max-w-lg">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-2 text-white">
                Ready to Try
              </h2>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Rideshare?
              </h2>
              <div className="w-20 h-1 mb-6 bg-white" />
              <p className="mb-8 text-lg leading-relaxed text-white/90">
                Take our rideshare readiness assessment to learn if you have the skills needed to use rideshare services safely, and get personalized recommendations for building your confidence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-white text-[#e67e22] px-6 py-3 font-medium w-full sm:w-auto hover:bg-gray-100">
                  Take Rideshare Assessment
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
