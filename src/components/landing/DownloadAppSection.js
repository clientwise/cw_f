import React from 'react';
import { AppStoreBadge, GooglePlayBadge } from '../common/AppBadge'; // Adjust path if needed

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e', brandPurpleDeep: '#3b0770', brandBeige: '#f6eeb4' };

const DownloadAppSection = () => (
    <section id="download-app" className="py-16 lg:py-24" style={{ background: `linear-gradient(to top left, ${themeColors.brandPurple}, ${themeColors.brandPurpleDeep})` }}>
         <div className="container mx-auto px-6 text-center animate-on-scroll">
             <h2 className="font-serif text-3xl md:text-4xl font-bold text-[--brand-beige] mb-4" style={{'--brand-beige': themeColors.brandBeige}}> Manage Your Business On The Go </h2>
             <p className="text-lg text-[--brand-beige] opacity-90 mb-8 max-w-xl mx-auto" style={{'--brand-beige': themeColors.brandBeige}}> Download the ClientWise mobile app for agents and agencies. Access client data, track policies, and manage tasks anytime, anywhere. </p>
             <div className="flex justify-center items-center space-x-4">
                 <a href="#your-ios-app-link" target="_blank" rel="noopener noreferrer" className="transform transition duration-300 hover:scale-105"> <AppStoreBadge className="h-12 md:h-14" /> </a>
                 <a href="#your-android-app-link" target="_blank" rel="noopener noreferrer" className="transform transition duration-300 hover:scale-105"> <GooglePlayBadge className="h-12 md:h-14" /> </a>
             </div>
         </div>
    </section>
);

export default DownloadAppSection;
