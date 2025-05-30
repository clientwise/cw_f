import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button'; // Adjust path if needed
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Assume themeColors is available
const themeColors = { brandPurple: '#5a239e', /* ... */ };

const HowItWorksAgentsPage = () => {
    return (
        <div> 
            <Header></Header>
        
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-8 shadow-xl rounded-lg">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">How ClientWise Works for Individual Agents</h1>
                <p className="text-center text-gray-600 mb-10">Streamline your insurance business and focus on growth.</p>

                <div className="space-y-10">
                    {/* Step 1: Sign Up */}
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold">1</div>
                        <div className="flex-grow">
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">Sign Up & Setup</h2>
                            <p className="text-sm text-gray-600">Register for your ClientWise account in minutes. Start with our free trial to explore core features. Set up your basic profile and preferences.</p>
                        </div>
                    </div>

                    {/* Step 2: Add Clients */}
                     <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold">2</div>
                        <div className="flex-grow">
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">Onboard Your Clients</h2>
                            <p className="text-sm text-gray-600">Easily add new clients manually or use the bulk upload feature (CSV). Capture essential details, including contact info, profile data, and financial snapshots. Alternatively, share your unique onboarding link with clients.</p>
                        </div>
                    </div>

                     {/* Step 3: Manage Policies */}
                     <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold">3</div>
                        <div className="flex-grow">
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">Track Policies & Renewals</h2>
                            <p className="text-sm text-gray-600">Log existing policies for your clients, linking them to products from the catalog. Track key dates like expiry and receive automated reminders for upcoming renewals. Access policy documents easily.</p>
                        </div>
                    </div>

                     {/* Step 4: Engage & Grow */}
                     <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold">4</div>
                        <div className="flex-grow">
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">Engage & Grow</h2>
                            <p className="text-sm text-gray-600">Log client interactions, set follow-up tasks, and utilize marketing tools (templates, segments) to nurture leads and engage existing clients. Leverage AI insights (coming soon) for recommendations.</p>
                        </div>
                    </div>

                     {/* Step 5: Monitor & Earn */}
                     <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold">5</div>
                        <div className="flex-grow">
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">Monitor Performance & Commissions</h2>
                            <p className="text-sm text-gray-600">Track your sales performance with dashboard metrics and charts. View automatically calculated commission statements based on the policies you've added.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center border-t pt-8">
                    <p className="text-gray-600 mb-4">Ready to simplify your workflow?</p>
                  
                     <p className="mt-4">
                        <Link to="/" className="text-indigo-600 hover:text-indigo-800 text-sm">
                            &larr; Back to Home
                        </Link>
                    </p>
                </div>
            </div>
        </div><Footer></Footer></div>
    );
};

export default HowItWorksAgentsPage;
