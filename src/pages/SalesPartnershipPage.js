import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button'; // Adjust path if needed
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';


const SalesPartnershipPage = () => {
    const companyName = "18Novem Techologies";
    const commissionRate = 20; // As specified

    return (
        <div><Header>   </Header>
         <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                 <h1 className="text-4xl font-bold text-green-800 mb-4">Sales Partnership Program</h1>
                 <p className="text-lg text-gray-600 mb-10">Refer ClientWise and Earn!</p>
            </div>

            <div className="max-w-4xl mx-auto bg-white p-8 shadow-xl rounded-lg grid md:grid-cols-2 gap-8 items-center">
                <div className="prose prose-indigo max-w-none text-gray-700">
                    <h2>Become a ClientWise Sales Partner</h2>
                    <p>Do you believe in the power of ClientWise to help insurance agents succeed? Join our Sales Partnership program and earn commissions by referring new agents to our platform.</p>
                    <p>If you have a network of insurance professionals who could benefit from a modern, efficient CRM, this program is for you.</p>

                    <h3>How It Works:</h3>
                    <ul>
                        <li><strong>Sign Up:</strong> Register as a Sales Partner (details on registration process coming soon).</li>
                        <li><strong>Refer:</strong> Use your unique referral link or code to introduce agents to ClientWise.</li>
                        <li><strong>Earn Commission:</strong> Receive a generous <strong>{commissionRate}% commission</strong> on the subscription payments made by the agents you refer.</li>
                        <li><strong>Track:</strong> Access a dashboard to track your referrals and earnings (feature coming soon).</li>
                    </ul>
                     <h3>Who is this for?</h3>
                     <p>Insurance trainers, mentors, influencers, community leaders, or anyone with a strong network in the insurance agent community in India.</p>
                     <p>Help your network grow their business with ClientWise by {companyName}, and get rewarded for it!</p>
                </div>

                 <div className="text-center bg-green-50 p-6 rounded-lg border border-green-200">
                    <i className="fas fa-handshake text-6xl text-green-500 mb-4"></i>
                    <h3 className="text-xl font-semibold text-green-800 mb-4">Interested in Partnering?</h3>
                    <p className="text-sm text-gray-600 mb-6">Express your interest, and we'll notify you when the program officially launches with full details and registration.</p>
                    {/* TODO: Link to an interest form or provide contact */}
                    <Button variant="brand" className="bg-green-600 hover:bg-green-700 focus:ring-green-500" size="lg" onClick={() => alert('Register Interest - Not Implemented')}>
                        Register Interest
                    </Button>
                </div>
            </div>
             <div className="mt-12 text-center">
                <Link to="/" className="text-indigo-600 hover:text-indigo-800 text-sm">
                    &larr; Back to Home
                </Link>
            </div>
        </div><Footer > </Footer></div>
    );
};

export default SalesPartnershipPage;
