'use client';

import { useState } from "react";
import { PersonStanding, Bike, Car, Bus, Train, Smartphone, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";

const heroImage = "/images/public_transit_bus_c_2c9db796.jpg";
const skateboardImage = "/images/teenage_girl_student_936ca063.jpg";

const mobilityIcons = [
  { icon: PersonStanding, label: "Walking" },
  { icon: Bike, label: "Biking" },
  { icon: Bike, label: "Scooter" },
  { icon: Car, label: "Car" },
  { icon: Bus, label: "Bus" },
  { icon: Train, label: "Train" },
];

const journeySteps = [
  { label: "Pedestrian", level: 1 },
  { label: "Rideshare", level: 2 },
  { label: "Public transportation", level: 3 },
  { label: "Bicycle, e-scooter", level: 4 },
  { label: "Driving", level: 5 },
];

const processSteps = [
  { label: "Learn about mobility", color: "#d4a84b" },
  { label: "Check your options", color: "#c9a43f" },
  { label: "Build your skills", color: "#5bb4d5" },
  { label: "Get assessed", color: "#6ab04c" },
  { label: "Check if ready", color: "#7cb342" },
];

const faqs = [
  {
    question: "What mobility option are you ready for?",
    answer: "Walking includes other ways of getting around on your own, such as running, using a wheelchair, or roller skating. While this may be the slowest mobility option, it still requires important skills to safely walk independently. By building these skills, it will make using other mobility options easier."
  },
  {
    question: "Can you physically maneuver in your everyday environment?",
    answer: "This includes being able to navigate sidewalks, crosswalks, and public spaces safely. Consider your balance, endurance, and ability to respond to environmental changes."
  },
  {
    question: "Can you physically maneuver in your everyday environment?",
    answer: "Walking includes other ways of getting around on your own, such as running, using a wheelchair, or roller skating. While this may be the slowest mobility option, it still requires important skills to safely walk independently. By building these skills, it will make using other mobility options easier."
  },
  {
    question: "Can you physically maneuver in your everyday environment?",
    answer: "This involves understanding traffic signals, recognizing safe crossing opportunities, and being aware of your surroundings at all times."
  },
  {
    question: "Can you physically maneuver in your everyday environment?",
    answer: "Consider factors like weather conditions, time of day, and familiarity with routes when planning your independent mobility journey."
  },
];

export default function PrepareToBeMobilePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(2);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PublicHeader />
      
      <main className="flex-1">
        {/* Hero Section - Blue with diagonal */}
        <section className="relative min-h-[320px] overflow-hidden">
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
              <div className="flex gap-4 mb-6">
                {mobilityIcons.map((item, index) => (
                  <item.icon key={index} className="h-8 w-8 text-white" />
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Prepare<br />to be Mobile
              </h1>
            </div>
          </div>
        </section>

        {/* Understanding your upcoming journey Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              Understanding your upcoming journey.
            </h2>
            <p className="text-gray-700 max-w-4xl mb-12 text-lg">
              Everyone will have their own unique mobility journey! Let's start with an overview of all the parts of the journey so you know which ones are right for you.
            </p>

            {/* Stair Step Diagram */}
            <div className="mb-12 overflow-x-auto">
              <div className="min-w-[700px] relative h-[200px]">
                {journeySteps.map((step, index) => (
                  <div 
                    key={index}
                    className="absolute flex items-end"
                    style={{
                      left: `${index * 18}%`,
                      bottom: `${(index) * 30}px`,
                    }}
                  >
                    <div className="flex flex-col items-start">
                      <div 
                        className="w-4 h-4 bg-[#d4a84b] transform rotate-45 mb-1"
                        style={{ marginLeft: '10px' }}
                      />
                      <div className="flex items-center">
                        <div className="w-32 h-3 bg-[#d4a84b]" />
                        {index < journeySteps.length - 1 && (
                          <div className="w-12 h-3 bg-[#d4a84b]" />
                        )}
                      </div>
                      <span className="text-gray-700 mt-2 font-medium whitespace-nowrap">
                        {step.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Process Steps - Chevron arrows */}
            <div className="flex flex-wrap gap-0 mb-8">
              {processSteps.map((step, index) => (
                <div 
                  key={index}
                  className="relative flex items-center"
                >
                  <div 
                    className="relative px-6 py-3 text-white font-medium text-center min-w-[140px]"
                    style={{ 
                      backgroundColor: step.color,
                      clipPath: index === 0 
                        ? 'polygon(0 0, calc(100% - 15px) 0, 100% 50%, calc(100% - 15px) 100%, 0 100%)' 
                        : index === processSteps.length - 1
                        ? 'polygon(15px 0, 100% 0, 100% 100%, 15px 100%, 0 50%)'
                        : 'polygon(15px 0, calc(100% - 15px) 0, 100% 50%, calc(100% - 15px) 100%, 15px 100%, 0 50%)',
                      marginLeft: index > 0 ? '-10px' : '0'
                    }}
                  >
                    <span className="text-sm">{step.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Prepare Section */}
        <section className="py-16 md:py-20 bg-[#f5f5f0]">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#1a5276]">
              How to Prepare
            </h2>
            <p className="text-gray-700 mb-12 text-lg">
              <strong>Getting started can be tough when you don't even know where to begin.</strong><br />
              Here are some helpful points to consider:
            </p>

            <div className="space-y-12 max-w-3xl">
              {/* What Options Do I Have */}
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-[#1a5276]">
                  What Options Do I Have
                </h3>
                <p className="text-gray-700 mb-4">
                  Understand what mobility is and what your options are. Click the link below to see what mobility options are available to you and what skills are needed for each of them.
                </p>
                <Button className="bg-[#1a5276] text-white px-6 py-3 font-medium hover:bg-[#154360]">
                  Family Resources Checklist
                </Button>
              </div>

              {/* Identify Support */}
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-[#1a5276]">
                  Identify Support
                </h3>
                <p className="text-gray-700 mb-4">
                  Lorem ipsum odor amet, consectetuer adipiscing elit. Pulvinar quam leo vel placerat rhoncus vehicula vivamus. Curabitur curae ridiculus a consequat pellentesque natoque hendrerit proin. Magna ullamcorper metus conubia; bibendum praesent diam condimentum nullam.
                </p>
                <Button className="bg-[#1a5276] text-white px-6 py-3 font-medium hover:bg-[#154360]">
                  Community Mobility Checklist
                </Button>
              </div>

              {/* Build Your Mobility Skills */}
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-[#1a5276]">
                  Build Your Mobility Skills
                </h3>
                <p className="text-gray-700 mb-4">
                  There are many things that you already do that are preparing you to get around your community! Here you can find how some of those everyday activities relate to mobility.
                </p>
                <Button className="bg-[#1a5276] text-white px-6 py-3 font-medium hover:bg-[#154360]">
                  Independent Mobility Assessment
                </Button>
              </div>

              {/* Consider Driving */}
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-[#1a5276]">
                  Consider Driving
                </h3>
                <p className="text-gray-700 mb-4">
                  A professional evaluation by a certified driving instructor or occupational therapist can provide valuable insights into your readiness to drive. This evaluation will assess your strengths and challenges and offer personalized recommendations to help you succeed. Click "Find a Local Evaluation Site" to find a professional near you.
                </p>
                <Button className="bg-[#1a5276] text-white px-6 py-3 font-medium hover:bg-[#154360] mb-4">
                  Find a Local Evaluation Site
                </Button>
                <p className="text-gray-700 mb-2">
                  If you don't have a local evaluation available, click the link below for a virtual evaluation option.
                </p>
                <a href="#" className="text-[#1a5276] underline font-medium hover:text-[#154360]">
                  Schedule a Telehealth Evaluation
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">
              FAQs
            </h2>

            <div className="max-w-3xl space-y-0">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-gray-700 font-medium pr-4">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="pb-6 pr-12">
                      <p className="text-gray-600 mb-4">{faq.answer}</p>
                      <Button className="bg-[#1a5276] text-white px-6 py-3 font-medium hover:bg-[#154360]">
                        Prepare to be a Pedestrian
                      </Button>
                    </div>
                  )}
                </div>
              ))}
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
