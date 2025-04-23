import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button'; // Adjust path if needed
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
// Assume themeColors is available
const themeColors = { brandPurple: '#5a239e', /* ... */ };

const HowItWorksAgenciesPage = () => {
    return (
        <div> 
            <Header></Header>

        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-8 shadow-xl rounded-lg">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">How ClientWise Works for Agencies</h1>
                <p className="text-center text-gray-600 mb-10">Centralize operations, manage your team, and scale your business.</p>

                <div className="space-y-10">
                    {/* Step 1: Agency Setup */}
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold">1</div>
                        <div className="flex-grow">
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">Agency Setup & Admin Portal</h2>
                            <p className="text-sm text-gray-600">Register your agency account. The primary user becomes the Agency Admin with access to a dedicated portal for managing the agency's operations within ClientWise.</p>
                        </div>
                    </div>

                    {/* Step 2: Add Agents */}
                     <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold">2</div>
                        <div className="flex-grow">
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">Onboard Your Agents</h2>
                            <p className="text-sm text-gray-600">Invite your existing agents or add new agent users from the Agency Admin portal. Link them to your agency to enable centralized viewing and management.</p>
                        </div>
                    </div>

                     {/* Step 3: Centralized Management */}
                     <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold">3</div>
                        <div className="flex-grow">
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">Manage Products & Commissions</h2>
                            <p className="text-sm text-gray-600">Agency Admins can add and manage the product catalog available to their agents. Define commission structures per product for consistent calculations across the team.</p>
                        </div>
                    </div>

                     {/* Step 4: Oversight & Reporting */}
                     <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold">4</div>
                        <div className="flex-grow">
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">Monitor Performance & Commissions</h2>
                            <p className="text-sm text-gray-600">View consolidated commission reports for all agents within your agency. Track overall agency performance and individual agent metrics (requires relevant API implementation).</p>
                        </div>
                    </div>

                     {/* Step 5: Communication */}
                     <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-2xl font-bold">5</div>
                        <div className="flex-grow">
                            <h2 className="text-xl font-semibold text-gray-700 mb-2">Broadcast Notices</h2>
                            <p className="text-sm text-gray-600">Use the Notice Board feature to share important updates, announcements, or training materials specifically with your agency's agents.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-center border-t pt-8">
                    <p className="text-gray-600 mb-4">Empower your agency with a unified platform.</p>
                
                     <p className="mt-4">
                        <Link to="/" className="text-indigo-600 hover:text-indigo-800 text-sm">
                            &larr; Back to Home
                        </Link>
                    </p>
                </div>
            </div>
        </div>        <Footer></Footer></div>
    );
};

export default HowItWorksAgenciesPage;
