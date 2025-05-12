import React, { useState } from 'react';

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e', purple50: '#f5f3ff' };

const WhyClientWiseSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const features = [
      { icon: 'fas fa-tachometer-alt', title: 'Personal AI Agent ', description: 'Get an personalized AI Agent to guide you every week on Sales, and Performance. Track Business, Leads, Commissions, Renewals,  Upcoming Meetings easily ', image: 'https://placehold.co/400x400/703abc/f6eeb4?text=Agency+Mgmt+Visual' },
    { icon: 'fas fa-brain', title: '360 View of Client with AI Recommendations', description: ' Get Cover Overview, AI Based Recommendations, Create Client Portals, Store Documents and Policies, Setup Reminders and Call Logs at a single place', image: 'https://placehold.co/400x400/5a239e/f6eeb4?text=AI+Sales+Visual' },
      { icon: 'fas fa-handshake', title: 'Real Time  Upfront and Trail Commissions', description: 'Manage and View your commissions real time, with active reminders and support for Renewal business ', image: 'https://placehold.co/400x400/3b0770/f6eeb4?text=Trust+Visual' },
    ];

    return (
     <section id="why-clientwise" className="bg-white py-16 lg:py-24 relative overflow-hidden">
         <div className="absolute inset-0 pointer-events-none" style={{background: `radial-gradient(ellipse 80% 50% at 5% 5%, rgba(90, 35, 158, 0.15), transparent 70%)`}}></div>
        <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                <div className="animate-on-scroll">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight font-serif">CRM <span className="text-[--brand-purple]">built for Insurance Business </span> </h2>
                    {/* <p className="text-lg text-gray-600 mb-10"> Stop wasting time fighting diaries, excel sheets or clunky softwares. ClientWise is built from the ground up for the unique needs of Indian insurance professionals and companies, helping you close more deals and build lasting client relationships. </p> */}
                    <div className="space-y-4">
                        {features.map((feature, index) => (
                            <div key={index} onClick={() => setActiveIndex(index)} className={`p-4 md:p-6 rounded-lg border cursor-pointer transition-all duration-300 ease-in-out animate-on-scroll delay-${index * 100} ${ activeIndex === index ? 'bg-purple-50 border-[--brand-purple] shadow-md scale-[1.02]' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50' }`} style={{'--brand-purple': themeColors.brandPurple}}>
                                <div className="flex items-start space-x-4"> <i className={`${feature.icon} text-2xl text-[--brand-purple] mt-1 flex-shrink-0 w-8 text-center`}></i> <div> <h3 className={`text-lg font-semibold mb-1 ${activeIndex === index ? 'text-[--brand-purple]' : 'text-gray-900'}`}>{feature.title}</h3> {activeIndex === index && ( <p className="text-gray-600 text-sm">{feature.description}</p> )} </div> </div>
                            </div>
                        ))}
                    </div>
                </div>
                 <div className="animate-on-scroll delay-200"> <div className="bg-gradient-to-br from-purple-50 via-white to-yellow-50 p-8 rounded-3xl shadow-xl aspect-square flex items-center justify-center overflow-hidden"> <img key={activeIndex} src={features[activeIndex].image} alt={`${features[activeIndex].title} visual`} className="rounded-2xl shadow-lg object-cover w-full h-full animate-slide-down" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x400/cccccc/ffffff?text=Error'; }}/> </div> </div>
            </div>
        </div>
    </section>
);
};

export default WhyClientWiseSection;
