'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
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
const pedestrianImage = "/images/person_walking_pedes_36789b8e.jpg";
const drivingImage = "/images/young_woman_driving__394b7a25.jpg";
const bikingImage = "/images/person_walking_on_si_cd47e8a3.jpg";
const transitImage = "/images/yellow_school_bus_pu_7ccb2dbe.jpg";
const rideshareImage = "/images/teenage_girl_with_ba_72c61475.jpg";
const skateboardImage = "/images/teenage_girl_student_936ca063.jpg";

const mobilityOptions = [
  {
    title: "Pedestrian",
    image: pedestrianImage,
    href: "/en/mobility/pedestrian"
  },
  {
    title: "Driving",
    image: drivingImage,
    href: "/en/mobility/driving"
  },
  {
    title: "Biking",
    image: bikingImage,
    href: "/en/mobility/biking"
  },
  {
    title: "Public Transit",
    image: transitImage,
    href: "/en/mobility/public-transit"
  },
  {
    title: "Ride Share",
    image: rideshareImage,
    href: "/en/mobility/rideshare"
  }
];

export default function MobilityOptionsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero Section - Blue with diagonal */}
        <section className="relative min-h-[380px] overflow-hidden">
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
                Choose Your<br />Mobility Option
              </h1>

              <Button className="bg-[#f4d03f] text-[#1a5276] px-6 py-3 font-medium hover:bg-[#f1c40f] border-2 border-[#1a5276]">
                Take Our Independent Mobility Assessment
              </Button>
            </div>
          </div>
        </section>

        {/* Mobility Options Grid Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#1a5276] italic">
              Mobility Options
            </h2>
            <p className="text-gray-700 max-w-4xl mb-12 text-lg leading-relaxed">
              There are lots of ways for you to get around your community, from walking or riding a bicycle to riding in cars and busses. Here is an overview of some ways of getting around, skills you should have, and how to know you're ready for that option.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {mobilityOptions.map((option, index) => (
                <div key={index} className="group">
                  <div className="aspect-[16/10] rounded-lg overflow-hidden mb-4">
                    <img 
                      src={option.image} 
                      alt={option.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{option.title}</h3>
                  <Link href={option.href}>
                    <Button className="bg-[#1a5276] text-white px-6 py-2 hover:bg-[#154360]">
                      CTA
                    </Button>
                  </Link>
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
