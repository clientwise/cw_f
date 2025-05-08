import React from 'react';
import { Link } from 'react-router-dom'; // For linking back
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';


const TermsPage = () => {
    const companyName = "18Novem Technologies"; // Use the registered entity name

    return (
        <div><Header></Header>
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 shadow rounded-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms and Conditions</h1>

                <div className="prose prose-indigo max-w-none text-gray-700">
                    <p>Last Updated: April 24, 2025</p>

                    <p>Welcome to ClientWise! These terms and conditions outline the rules and regulations for the use of {companyName}'s Website and CRM software, located at [Your Website URL].</p>

                    <p>By accessing this website and using our software, we assume you accept these terms and conditions. Do not continue to use ClientWise if you do not agree to take all of the terms and conditions stated on this page.</p>

                    <h2>1. Definitions</h2>
                    <p>[Placeholder: Define key terms like "Client", "User", "Agent", "Agency", "Software", "Service", "Content"]</p>

                    <h2>2. License to Use</h2>
                    <p>Unless otherwise stated, {companyName} and/or its licensors own the intellectual property rights for all material on ClientWise. All intellectual property rights are reserved. You may access this from ClientWise for your own personal or internal business use subjected to restrictions set in these terms and conditions.</p>
                    <p>You must not:</p>
                    <ul>
                        <li>Republish material from ClientWise</li>
                        <li>Sell, rent or sub-license material from ClientWise</li>
                        <li>Reproduce, duplicate or copy material from ClientWise</li>
                        <li>Redistribute content from ClientWise</li>
                    </ul>

                    <h2>3. User Accounts</h2>
                     <p>[Placeholder: Detail account registration requirements, responsibilities for account security, acceptable use policies, termination conditions.]</p>

                    <h2>4. Fees and Payments</h2>
                    <p>[Placeholder: Outline subscription fees, payment terms, refund policy (if any), consequences of non-payment.]</p>
                    <p>Current pricing involves a free trial for 1 month (up to 20 clients), followed by a Pro Plan at ₹1500 for 3 months, granting access to all features including AI products.</p>


                    <h2>5. Limitation of Liability</h2>
                    <p>In no event shall {companyName}, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website or Software whether such liability is under contract. {companyName}, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website or Software.</p>

                    <h2>6. Indemnification</h2>
                    <p>[Placeholder: Detail user's responsibility to indemnify the company against certain liabilities.]</p>

                    <h2>7. Governing Law & Jurisdiction</h2>
                    <p>These Terms will be governed by and interpreted in accordance with the laws of India, and you submit to the non-exclusive jurisdiction of the state and federal courts located in Mumbai, Maharashtra for the resolution of any disputes.</p>

                     <h2>8. Changes to Terms</h2>
                     <p>{companyName} reserves the right to revise these terms at any time as it sees fit, and by using this Website you are expected to review these terms on a regular basis.</p>

                    <p>...</p>
                    {/* Add other necessary sections like Termination, Privacy Policy link, etc. */}

                </div>

                <div className="mt-8 text-center">
                    <Link to="/" className="text-indigo-600 hover:text-indigo-800 text-sm">
                        &larr; Back to Home
                    </Link>
                </div>
            </div>
        </div><Footer></Footer></div>
    );
};

export default TermsPage;
