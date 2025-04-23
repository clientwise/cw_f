import React from 'react';
import Button from '../common/Button'; // Adjust path if needed

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e', green500: '#22c55e' };

const PricingSection = () => (
     <section id="pricing" className="bg-gray-50 py-16 lg:py-24">
         <div className="container mx-auto px-6 text-center">
             <h2 className="text-3xl md:text-4xl font-bold text-[--brand-purple] mb-4 animate-on-scroll" style={{'--brand-purple': themeColors.brandPurple}}> Simple, Transparent Pricing </h2>
            <p className="text-lg text-gray-600 mb-12 max-w-xl mx-auto animate-on-scroll delay-100"> Choose the plan that fits your needs... </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
                {/* Individual Card */}
                <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 flex flex-col h-full animate-on-scroll delay-200 transform transition duration-300 hover:scale-[1.03] hover:shadow-xl">
                    <h3 className="text-[--brand-purple] text-xl font-semibold mb-4" style={{'--brand-purple': themeColors.brandPurple}}>For Individual Agents</h3>
                    <p className="text-4xl font-bold mb-2 text-gray-800">Free</p>
                    <p className="text-sm text-gray-500 mb-6">for life*</p>
                    <ul className="space-y-3 text-sm text-gray-600 text-left mb-8 flex-grow">
                        <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2 w-4"></i> All core CRM features</li>
                        <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2 w-4"></i> AI Sales Assistant (basic)</li>
                        <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2 w-4"></i> Pipeline Tracking</li>
                        <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2 w-4"></i> Client Management</li>
                        <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2 w-4"></i> Basic Reporting</li>
                    </ul>
                    <Button href="#" variant="brand" className="w-full mt-auto">Get Started Free</Button>
                </div>
                {/* Agency Card */}
                <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-[--brand-purple] flex flex-col h-full animate-on-scroll delay-300 transform transition duration-300 hover:scale-[1.03] hover:shadow-xl relative" style={{'--brand-purple': themeColors.brandPurple}}>
                     <span className="absolute top-0 right-0 -mt-3 mr-3 px-3 py-1 bg-[--brand-purple] text-white text-xs font-bold rounded-full shadow-lg">POPULAR</span>
                    <h3 className="text-[--brand-purple] text-xl font-semibold mb-4">For Agencies</h3>
                     <div className="space-y-3 text-left text-sm text-gray-700 mb-6 flex-grow">
                        <p><i className="fas fa-check text-green-500 mr-2 w-4"></i> Pay as you go</p>
                        <p><i className="fas fa-check text-green-500 mr-2 w-4"></i> No upfront onboarding costs</p>
                        <p><i className="fas fa-check text-green-500 mr-2 w-4"></i> 1 month free trial</p>
                        <p><i className="fas fa-check text-green-500 mr-2 w-4"></i> All Agent Features Included</p>
                        <p><i className="fas fa-check text-green-500 mr-2 w-4"></i> Agent Management & Analytics</p>
                        <p><i className="fas fa-check text-green-500 mr-2 w-4"></i> Centralized Content & Templates</p>
                    </div>
                    <div className="space-y-3 text-left border-t pt-4 mb-6">
                         <div><p className="font-semibold text-gray-800">Free <span className="font-normal text-gray-500">(Lifetime)</span><span className="text-xs block text-gray-500">Up to 10 agents</span></p></div> <hr className="my-2"/>
                         <div><p className="font-semibold text-gray-800">₹10,000 <span className="font-normal text-gray-500">/ month</span><span className="text-xs block text-gray-500">Up to 50 agents</span></p></div> <hr className="my-2"/>
                         <div><p className="font-semibold text-gray-800">₹12,000 <span className="font-normal text-gray-500">/ month</span><span className="text-xs block text-gray-500">50 to 100 agents</span></p></div> <hr className="my-2"/>
                         <div><p className="font-semibold text-gray-800">Custom Pricing <span className="text-xs block text-gray-500">More than 100 agents</span></p></div>
                    </div>
                     <Button href="#" variant="brand" className="w-full mt-auto">Contact Sales for Agency Plan</Button>
                </div>
            </div>
         </div>
    </section>
);

export default PricingSection;
