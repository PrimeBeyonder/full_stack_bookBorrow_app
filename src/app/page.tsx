"use client"

import Hero from "./components/Landing/Hero";
import { landingPageData } from "./mockData/LandingPageData";

export default function Home() {
  return (
    <>
    <Hero {...landingPageData.hero} />
    </>
  );
}
