import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button'; // Adjust path if needed
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const InsurerPartnershipPage = () => {
    const companyName = "18Novem Technologies";

    return (
        <div> <Header>  </Header>
         <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                 <h1 className="text-4xl font-bold text-blue-800 mb-4">Insurer Partnership Program</h1>
                 <p className="text-lg text-gray-600 mb-10">Integrate and Collaborate for Agent Success</p>
            </div>

            <div className="max-w-4xl mx-auto bg-white p-8 shadow-xl rounded-lg grid md:grid-cols-2 gap-8 items-center">
                <div className="prose prose-indigo max-w-none text-gray-700">
                    <h2>Partner with ClientWise for Seamless Integration</h2>
                    <p>{companyName} invites insurance companies in India to partner with us. By integrating your APIs with ClientWise, we can create a powerful, streamlined experience for your agents.</p>
                    <p>Offer ClientWise as your preferred CRM solution to your agency force, enhancing their productivity and providing them with modern tools tailored to their needs.</p>

                    <h3>Potential Integration Areas:</h3>
                    <ul>
                        <li><strong>Product Information APIs:</strong> Automatically sync product details, brochures, and proposal requirements into ClientWise.</li>
                        <li><strong>Proposal Generation APIs:</strong> Enable agents to generate proposals or illustrations directly from ClientWise using your systems.</li>
                        <li><strong>Policy Issuance APIs:</strong> Streamline the policy issuance process after proposal acceptance.</li>
                        <li><strong>Commission Data APIs:</strong> Facilitate easier commission reconciliation for agents and agencies.</li>
                        <li><strong>Data Sync APIs:</strong> Allow for secure synchronization of relevant client or policy data between systems (where appropriate and compliant).</li>
                    </ul>
                     <h3>Benefits for Insurers:</h3>
                     <ul>
                        <li>Increase agent productivity and engagement with your products.</li>
                        <li>Provide a modern, preferred CRM tool to your distribution network.</li>
                        <li>Streamline data flow and reduce manual processes for agents.</li>
                        <li>Potential for co-marketing and reaching a wider agent base.</li>
                        <li>Enhance your digital offerings for agents PAN India.</li>
                     </ul>
                </div>

                 <div className="text-center bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <i className="fas fa-plug text-6xl text-blue-500 mb-4"></i>
                    <h3 className="text-xl font-semibold text-blue-800 mb-4">Let's Connect!</h3>
                    <p className="text-sm text-gray-600 mb-6">We are eager to explore API integration possibilities and discuss how ClientWise can become a valuable tool for your agents.</p>
                    {/* TODO: Link to a partnership contact form */}
                    <Button variant="brand" className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500" size="lg" onClick={() => alert('Contact Partnerships - Not Implemented')}>
                        Discuss Integration
                    </Button>
                </div>
            </div>
             <div className="mt-12 text-center">
                <Link to="/" className="text-indigo-600 hover:text-indigo-800 text-sm">
                    &larr; Back to Home
                </Link>
            </div></div>
            <Footer></Footer>
        </div>
    );
};

export default InsurerPartnershipPage;
