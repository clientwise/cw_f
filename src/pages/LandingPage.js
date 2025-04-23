import React from 'react';

// Import Layout Components (adjust paths if needed)
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Import Landing Page Section Components (adjust paths if needed)
// Make sure you have saved the code for these components in the specified files!
import HeroSection from '../components/landing/HeroSection';
import WhyClientWiseSection from '../components/landing/WhyClientWiseSection';
import CommandCenterSection from '../components/landing/CommandCenterSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import PricingSection from '../components/landing/PricingSection';
// import DownloadAppSection from '../components/landing/DownloadAppSection';
import FinalCTASection from '../components/landing/FinalCTASection';

// This component now acts as a container for all actual landing page sections
const LandingPage = ({ navigateToLogin }) => {
    // Note: Scroll animations are handled globally by the IntersectionObserver in App.js
    // based on the 'animate-on-scroll' class applied within each section component.
    return (
        <div>
            {/* Render the actual Header component */}
            <Header navigateToLogin={navigateToLogin} />
            <main>
                {/* Render the actual section components, passing props if needed */}
                <HeroSection navigateToLogin={navigateToLogin} />
                <WhyClientWiseSection />
                <CommandCenterSection />
                <FeaturesSection />
                <HowItWorksSection />
                <TestimonialsSection />
                <PricingSection />
                {/* <DownloadAppSection /> */}
                <FinalCTASection navigateToLogin={navigateToLogin} />
            </main>
            {/* Render the actual Footer component */}
            <Footer />
        </div>
    );
};

export default LandingPage;
