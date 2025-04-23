import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button'; // Adjust path if needed
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const AgencyPartnershipPage = () => {
    const companyName = "18Novem Techologies";

    return (
        <div >
           <Header></Header>
           
           <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
             <div className="max-w-4xl mx-auto text-center">
                 <h1 className="text-4xl font-bold text-purple-800 mb-4">Agency Partnership Program</h1>
                 <p className="text-lg text-gray-600 mb-10">Empower Your Entire Team with ClientWise</p>
            </div>

            <div className="max-w-4xl mx-auto bg-white p-8 shadow-xl rounded-lg grid md:grid-cols-2 gap-8 items-center">
                <div className="prose prose-indigo max-w-none text-gray-700">
                    <h2>Partner with ClientWise</h2>
                    <p>Designed for growing insurance agencies in India, our partnership program offers a centralized CRM solution to enhance team collaboration, streamline operations, and boost overall productivity.</p>
                    <p>Equip your agents with the tools they need to succeed while gaining valuable oversight and insights at the agency level.</p>

                    <h3>Benefits for Your Agency:</h3>
                    <ul>
                        <li><strong>Centralized Management:</strong> Manage agents, clients, and performance data from a single admin portal.</li>
                        <li><strong>Team Collaboration:</strong> Improve communication and data sharing within your agency (features may vary based on plan).</li>
                        <li><strong>Performance Tracking:</strong> Monitor agent activity, commission payouts, and overall agency growth.</li>
                        <li><strong>Standardized Processes:</strong> Implement consistent workflows for client onboarding, policy management, and compliance.</li>
                        <li><strong>Volume Licensing & Support:</strong> Access tailored pricing plans and dedicated support options for agencies.</li>
                        <li><strong>Branding Opportunities:</strong> Potential for co-branding or white-labeling (subject to discussion).</li>
                    </ul>
                     <p>Let ClientWise, by {companyName}, be the technology backbone that supports your agency's growth.</p>
                </div>

                 <div className="text-center bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <i className="fas fa-building text-6xl text-purple-500 mb-4"></i>
                    <h3 className="text-xl font-semibold text-purple-800 mb-4">Ready to Elevate Your Agency?</h3>
                    <p className="text-sm text-gray-600 mb-6">Contact us today to discuss your agency's specific needs and explore our partnership options.</p>
                    {/* TODO: Link to a contact form or provide contact details */}
                    <Button variant="brand" size="lg" onClick={() => alert('Contact Us - Not Implemented')}>
                        Contact Partnership Team
                    </Button>
                </div>
            </div>
             <div className="mt-12 text-center">
                <Link to="/" className="text-indigo-600 hover:text-indigo-800 text-sm">
                    &larr; Back to Home
                </Link>
      
      </div>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default AgencyPartnershipPage;
