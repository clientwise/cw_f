import React from 'react';
import Button from '../common/Button'; // Adjust path if needed

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e' };

 const FeaturesSection = () => (
    <section id="features" className="bg-white py-16 lg:py-24">
         <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16 animate-on-scroll"> Core Features at a Glance </h2>
            <div className="grid md:grid-cols-3 gap-10">
                <div className="text-center animate-on-scroll"> <div className="inline-flex items-center justify-center p-4 bg-purple-100 rounded-xl mb-5 shadow-sm"> <i className="fas fa-users text-3xl text-[--brand-purple]" style={{'--brand-purple': themeColors.brandPurple}}></i> </div> <h3 className="text-xl font-semibold text-gray-900 mb-2">360° Client View</h3> <p className="text-gray-600 text-sm"> Manage interactions... </p> </div>
                <div className="text-center animate-on-scroll delay-100"> <div className="inline-flex items-center justify-center p-4 bg-purple-100 rounded-xl mb-5 shadow-sm"> <i className="fas fa-robot text-3xl text-[--brand-purple]" style={{'--brand-purple': themeColors.brandPurple}}></i> </div> <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Sales Assistant</h3> <p className="text-gray-600 text-sm"> Get smart reminders... </p> </div>
                <div className="text-center animate-on-scroll delay-200"> <div className="inline-flex items-center justify-center p-4 bg-purple-100 rounded-xl mb-5 shadow-sm"> <i className="fas fa-chart-line text-3xl text-[--brand-purple]" style={{'--brand-purple': themeColors.brandPurple}}></i> </div> <h3 className="text-xl font-semibold text-gray-900 mb-2">Performance Analytics</h3> <p className="text-gray-600 text-sm"> Track pipeline health... </p> </div>
            </div>
             <div className="text-center mt-16 animate-on-scroll delay-300"> <a href="/features"  rel="noopener noreferrer" target='_blank'><Button  variant="brand">Explore All Features</Button></a> </div>
        </div>
    </section>
);

export default FeaturesSection;
