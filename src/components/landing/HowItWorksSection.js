import React from 'react';

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e', purple100: '#ede9fe', purple700: '#6d28d9' };

 const HowItWorksSection = () => (
    <section id="how-it-works" className="bg-gray-50 py-16 lg:py-24">
         <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[--brand-purple] mb-16 animate-on-scroll" style={{'--brand-purple': themeColors.brandPurple}}> Get Started in Minutes </h2>
             <div className="flex flex-col md:flex-row justify-between items-center gap-12 lg:gap-16">
                 <div className="md:w-1/2 space-y-6 animate-on-scroll">
                     <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200 transform transition duration-300 hover:scale-105 hover:shadow-lg"> <span className="inline-block bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full mb-3" style={{backgroundColor: themeColors.purple100, color: themeColors.purple700}}>Step 1</span> <h3 className="text-xl font-semibold text-gray-900 mb-2">Import & Organize</h3> <p className="text-gray-600 text-sm"> Easily upload existing client data... </p> </div>
                     <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200 transform transition duration-300 hover:scale-105 hover:shadow-lg"> <span className="inline-block bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full mb-3" style={{backgroundColor: themeColors.purple100, color: themeColors.purple700}}>Step 2</span> <h3 className="text-xl font-semibold text-gray-900 mb-2">Engage Intelligently</h3> <p className="text-gray-600 text-sm"> Use AI insights for reminders... </p> </div>
                     <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200 transform transition duration-300 hover:scale-105 hover:shadow-lg"> <span className="inline-block bg-purple-100 text-purple-700 text-sm font-semibold px-3 py-1 rounded-full mb-3" style={{backgroundColor: themeColors.purple100, color: themeColors.purple700}}>Step 3</span> <h3 className="text-xl font-semibold text-gray-900 mb-2">Track & Close</h3> <p className="text-gray-600 text-sm"> Monitor your sales pipeline... </p> </div>
                 </div>
                 <div className="md:w-1/2 animate-on-scroll delay-100"> <img src="https://placehold.co/600x500/ede9fe/5b21b6?text=Easy+Setup+Visual" alt="Visual representation of the process" className="rounded-lg shadow-xl border border-gray-200" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x500/cccccc/ffffff?text=Error'; }}/> </div>
             </div>
        </div>
    </section>
);

export default HowItWorksSection;
