import React from 'react';

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e' };

const CommandCenterSection = () => (
    <section id="command-center" className="bg-gray-50 py-16 lg:py-24 relative overflow-hidden">
         <div className="absolute inset-0 pointer-events-none" style={{background: `radial-gradient(ellipse 80% 50% at 95% 95%, rgba(90, 35, 158, 0.12), transparent 70%)`}}></div>
        <div className="container mx-auto px-6 text-center relative z-10">
             <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[--brand-purple] mb-6 animate-on-scroll" style={{'--brand-purple': themeColors.brandPurple}}> Your Agency's Command Center </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto animate-on-scroll delay-100"> Tired of scattered data and guesswork? ClientWise brings everything together, giving you the clarity and control needed to elevate your agency's performance. </p>
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto animate-on-scroll delay-200">
                 <img src="https://placehold.co/900x500/ffffff/5a239e?text=ClientWise+Dashboard+Mockup" alt="ClientWise Dashboard Mockup" className="rounded-lg border border-gray-200" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/900x500/cccccc/ffffff?text=Error'; }}/>
            </div>
        </div>
    </section>
);

export default CommandCenterSection;
