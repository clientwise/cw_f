import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';


const AboutUsPage = () => {
    const companyName = "18Novem Techologies";

    return (
        <div className="">
            <Header></Header>
            <div className='min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
            <div className="max-w-3xl mx-auto bg-white p-8 shadow rounded-lg">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">About ClientWise</h1>

                <div className="prose prose-indigo max-w-none text-gray-700 space-y-6">
                    <p className="text-lg leading-relaxed">
                        ClientWise, developed by {companyName}, is a modern CRM solution designed specifically for the dynamic needs of insurance agents and advisors in India. We understand the challenges you face – managing client relationships, tracking policies, calculating commissions, staying compliant, and growing your business.
                    </p>

                    <h2>Our Mission</h2>
                    <p>
                        Our mission is to empower insurance professionals with intuitive, intelligent, and efficient tools that streamline workflows, enhance client engagement, and drive business growth. We aim to be the preferred technology partner for agents across India, helping them succeed in an increasingly digital world.
                    </p>

                    <h2>What We Offer</h2>
                    <p>
                        ClientWise provides a comprehensive suite of features including:
                    </p>
                    <ul>
                        <li>Intuitive Client Relationship Management</li>
                        <li>Policy Tracking and Renewal Reminders</li>
                        <li>Commission Calculation and Statements</li>
                        <li>AI-Powered Insights and Recommendations (Coming Soon!)</li>
                        <li>Marketing Automation Tools</li>
                        <li>Secure Document Management</li>
                        <li>Activity Logging and Task Management</li>
                        <li>And much more...</li>
                    </ul>

                    <h2>Our Team</h2>
                    <p>[Placeholder: Briefly introduce the team, founders, or company philosophy. Highlight relevant experience in insurance or technology.]</p>

                    <h2>Our Commitment</h2>
                    <p>We are committed to continuous improvement, data security, and providing exceptional support to our users. We actively listen to feedback and strive to evolve ClientWise to meet the ever-changing demands of the insurance industry.</p>

                     <p>Registered Entity: <strong>{companyName}</strong></p>
                     <p>Based in Mumbai, Maharashtra, India.</p>

                </div>

                <div className="mt-10 text-center">
                    <Link to="/" className="text-indigo-600 hover:text-indigo-800 text-sm">
                        &larr; Back to Home
                    </Link>
                </div>
            </div></div>
            <Footer></Footer>
        </div>
    );
};

export default AboutUsPage;
