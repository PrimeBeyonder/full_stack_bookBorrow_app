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

export default function Hero({ title, subtitle, description, ctaText, secondaryCtaText, stats, image }: HeroProps) {
  return (
    <section className="bg-gradient-to-b from-primary-50 to-white py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-10">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-neutral-900 leading-tight">
              {title}
            </h1>
            <p className="text-xl mb-4 text-neutral-700">{subtitle}</p>
            <p className="text-base mb-8 text-neutral-600">{description}</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/signup" className="btn btn-primary">
                {ctaText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="#how-it-works" className="btn btn-outline">
                {secondaryCtaText}
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl font-bold text-primary-600">{stat.value}</p>
                  <p className="text-sm text-neutral-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 mt-10 lg:mt-0">
            <div className="relative">
              <Image
                src={image || "/placeholder.svg"}
                alt="Books"
                width={600}
                height={400}
                className="rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}