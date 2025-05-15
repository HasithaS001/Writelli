"use client";

import React from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import SocialProof from './SocialProof';
import FeaturesSection from './FeaturesSection';
import GrammarCheckerPromo from './GrammarCheckerPromo';
import ReadabilityCheckerPromo from './ReadabilityCheckerPromo';
import TranslatorPromo from './TranslatorPromo';
import SummarizerPromo from './SummarizerPromo';
import TestimonialsSection from './TestimonialsSection';
import DidYouKnow from './DidYouKnow';
import PricingSection from './PricingSection';
import AuthorsReviewSection from './AuthorsReviewSection';
import CTASection from './CTASection';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <SocialProof />
        <FeaturesSection />
        <GrammarCheckerPromo />
        <ReadabilityCheckerPromo />
        <TranslatorPromo />
        <SummarizerPromo />
        <TestimonialsSection />
        <DidYouKnow />
        <PricingSection showComparisonToggle={false} initialComparisonState={false} />
        <AuthorsReviewSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
