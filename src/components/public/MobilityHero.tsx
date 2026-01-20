'use client';

import { ReactNode } from "react";

interface MobilityHeroProps {
  title: string;
  subtitle?: string;
  description: string;
  heroImage: string;
  icon: ReactNode;
  bgColor?: string;
}

export default function MobilityHero({ 
  title, 
  subtitle,
  description, 
  heroImage, 
  icon,
  bgColor = '#7B8C2A'
}: MobilityHeroProps) {
  return (
    <section className="relative min-h-[400px] overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundColor: bgColor }} />
      
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
          <polygon points="0,0 100,0 0,100" fill={bgColor} />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative py-12 md:py-16">
        <div className="max-w-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              {icon}
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            {title}
          </h1>
          {subtitle && (
            <h2 className="text-2xl md:text-3xl font-semibold text-white/90 mb-6">
              {subtitle}
            </h2>
          )}
          <p className="text-white/90 text-lg leading-relaxed max-w-md">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
