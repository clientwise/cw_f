import React from 'react';
import Button from '../common/Button'; // Adjust path if needed
// import ExternalLinkIcon from '../common/ExternalLinkIcon'; // Assuming ExternalLinkIcon is common

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e', brandPurpleDeep: '#3b0770', brandBeige: '#f6eeb4' };

const FinalCTASection = ({ navigateToLogin }) => (
    <section className="py-16 lg:py-24" style={{ background: `linear-gradient(to bottom right, ${themeColors.brandPurple}, ${themeColors.brandPurpleDeep})` }}>
        <div className="container mx-auto px-6 text-center animate-on-scroll">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-[--brand-beige] mb-6" style={{'--brand-beige': themeColors.brandBeige}}> Ready to increase your insurance conversions? </h2>
            <p className="text-lg md:text-xl text-[--brand-beige] opacity-90 mb-8 max-w-2xl mx-auto" style={{'--brand-beige': themeColors.brandBeige}}> Get started with ClientWise and let AI power your sales process. </p>
            <Button onClick={() => navigateToLogin('signup')} variant="primary"> Sign Up Now </Button>
        </div>
    </section>
);

export default FinalCTASection;
