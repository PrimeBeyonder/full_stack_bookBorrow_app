import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  secondaryCtaText: string;
  stats: Array<{ value: string; label: string }>;
  image: string;
}

export function Hero({ title, subtitle, description, ctaText, secondaryCtaText, stats, image }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 to-white py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-10 mb-10 lg:mb-0">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-neutral-900 leading-tight animate-fade-in">
              {title}
            </h1>
            <p className="text-xl sm:text-2xl mb-4 text-neutral-700 animate-fade-in animation-delay-200">{subtitle}</p>
            <p className="text-base sm:text-lg mb-8 text-neutral-600 animate-fade-in animation-delay-400">{description}</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in animation-delay-600">
              <Link href="/signup" className="btn btn-primary group">
                {ctaText}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="#how-it-works" className="btn btn-outline">
                {secondaryCtaText}
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4 animate-fade-in animation-delay-800">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-primary-600">{stat.value}</p>
                  <p className="text-sm sm:text-base text-neutral-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 animate-fade-in animation-delay-1000">
            <div className="relative">
              <Image
                src={image || "/placeholder.svg"}
                alt="Books"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
