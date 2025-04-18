import React from 'react';
import Button from '../common/Button'; // Adjust path if needed
import { AppStoreBadge, GooglePlayBadge } from '../common/AppBadge'; // Adjust path if needed

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e', brandBeige: '#f6eeb4', brandBeigeHover: '#fbf8e9', brandPurpleHover: '#703abc', brandPurpleDeep: '#3b0770' };

const HeroSection = ({ navigateToLogin }) => (
    <section className="text-center py-24 lg:py-32" style={{ background: `linear-gradient(to bottom right, ${themeColors.brandPurple}, ${themeColors.brandPurpleDeep})` }}>
         <div className="container mx-auto px-6 relative z-10" style={{'--brand-purple': themeColors.brandPurple, '--brand-beige': themeColors.brandBeige, '--brand-beige-hover': themeColors.brandBeigeHover}}>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-[--brand-beige] mb-6 leading-tight animate-on-scroll">
                Increasing Conversions <br className="hidden md:block" /> for Insurance
            </h1>
            <p className="text-xl md:text-2xl text-[--brand-beige] opacity-90 mb-4 max-w-3xl mx-auto animate-on-scroll delay-100">
                ClientWise enables agents and agencies to keep track of clients using AI.
            </p>
            {/* Feature Chips */}
            <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 mb-10 max-w-4xl mx-auto animate-on-scroll delay-200">
                <span className="bg-white/20 backdrop-blur-sm text-[--brand-beige] text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full">360° Client View</span>
                <span className="bg-white/20 backdrop-blur-sm text-[--brand-beige] text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full">Real-Time Commissions</span>
                <span className="bg-white/20 backdrop-blur-sm text-[--brand-beige] text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full">AI Policy Recommendations</span>
                <span className="bg-white/20 backdrop-blur-sm text-[--brand-beige] text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full">Auto-Reminders</span>
                <span className="bg-white/20 backdrop-blur-sm text-[--brand-beige] text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full">And More...</span>
            </div>
            {/* Backed By */}
            <div className="flex justify-center items-center space-x-2 mb-10 text-[--brand-beige] opacity-80 text-sm animate-on-scroll delay-300">
                <span>Backed by</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"> <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/> <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill={themeColors.brandBeige} fontSize="12" fontWeight="bold">K</text> </svg>
                <span> Top Industry Experts</span>
            </div>
            {/* CTA Buttons */}
             <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 animate-on-scroll delay-400">
                <Button onClick={() => navigateToLogin('signup')} variant="primary" className="w-full sm:w-auto"> Sign Up Free </Button>
                <Button onClick={() => navigateToLogin('login')} variant="secondary" className="w-full sm:w-auto"> Login </Button>
            </div>
            {/* App Badges */}
             <div className="mt-10 flex justify-center items-center space-x-4 animate-on-scroll delay-500">
                 <a href="#your-ios-app-link" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"> <AppStoreBadge className="h-10" /> </a>
                 <a href="#your-android-app-link" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity"> <GooglePlayBadge className="h-10" /> </a>
             </div>
        </div>
    </section>
);

export default HeroSection;
