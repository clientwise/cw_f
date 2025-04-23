import React from 'react';
import { Link } from 'react-router-dom';

import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';


const WhyClientWisePage = () => {
    return (
<div> <Header>  </Header>
<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-8 shadow rounded-lg">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Why Choose ClientWise?</h1>

                <div className="prose prose-indigo max-w-none text-gray-700 space-y-8">
                    <p className="text-lg text-center leading-relaxed">
                        In today's competitive insurance market, efficiency and client relationships are key. ClientWise is built from the ground up to help Indian insurance agents and advisors thrive.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                            <h3 className="font-semibold text-purple-800 mb-2"><i className="fas fa-cogs mr-2"></i>Streamlined Workflow</h3>
                            <p className="text-sm">Manage clients, policies, tasks, and communications all in one place. Reduce manual effort and save valuable time.</p>
                        </div>
                         <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h3 className="font-semibold text-green-800 mb-2"><i className="fas fa-users mr-2"></i>Enhanced Client Management</h3>
                            <p className="text-sm">Keep detailed client profiles, track interactions, and set reminders. Never miss a renewal or follow-up opportunity.</p>
                        </div>
                         <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h3 className="font-semibold text-blue-800 mb-2"><i className="fas fa-percent mr-2"></i>Simplified Commissions</h3>
                            <p className="text-sm">Automated commission calculations (based on product setup) and clear statement views help you track your earnings effortlessly.</p>
                        </div>
                         <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <h3 className="font-semibold text-yellow-800 mb-2"><i className="fas fa-lightbulb mr-2"></i>AI-Powered Insights (Coming Soon!)</h3>
                            <p className="text-sm">Leverage AI for coverage estimations, task suggestions, and policy recommendations to better serve clients and identify opportunities.</p>
                        </div>
                         <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <h3 className="font-semibold text-red-800 mb-2"><i className="fas fa-bullhorn mr-2"></i>Effective Marketing</h3>
                            <p className="text-sm">Utilize templates, manage client segments, and track campaign performance to engage prospects and clients effectively.</p>
                        </div>
                         <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                            <h3 className="font-semibold text-indigo-800 mb-2"><i className="fas fa-shield-alt mr-2"></i>Secure & Reliable</h3>
                            <p className="text-sm">Built with security in mind to protect your valuable client data. Hosted on reliable infrastructure.</p>
                        </div>
                    </div>

                    <p className="text-center font-medium pt-6">
                        Focus on what you do best – advising clients and closing deals. Let ClientWise handle the rest.
                    </p>

                </div>

                <div className="mt-10 text-center">
                    <Link to="/" className="text-indigo-600 hover:text-indigo-800 text-sm">
                        &larr; Back to Home
                    </Link>
                     <Link to="/#pricing" className="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                        View Pricing
                    </Link>
                </div>
            </div>
        </div>
        <Footer>    </Footer>
        </div>
    );
};

export default WhyClientWisePage;
