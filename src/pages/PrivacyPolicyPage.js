import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const PrivacyPolicyPage = () => {
    const companyName = "18Novem Technologies";

    return (
        <div><Header></Header>
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 shadow rounded-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>

                <div className="prose prose-indigo max-w-none text-gray-700">
                    <p>Last Updated: April 24, 2025</p>

                    <p>{companyName} ("us", "we", or "our") operates the ClientWise website and software (the "Service").</p>
                    <p>This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>

                    <h2>1. Information Collection and Use</h2>
                    <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>
                    <h3>Types of Data Collected</h3>
                    <h4>Personal Data</h4>
                    <p>[Placeholder: Detail the types of personal data collected - e.g., email, name, phone, address, client data entered by agent, usage data.]</p>
                    <h4>Usage Data</h4>
                    <p>[Placeholder: Detail usage data collection - IP address, browser type, pages visited, time spent, etc.]</p>
                    <h4>Tracking & Cookies Data</h4>
                    <p>[Placeholder: Explain use of cookies and tracking technologies.]</p>

                    <h2>2. Use of Data</h2>
                    <p>{companyName} uses the collected data for various purposes:</p>
                    <ul>
                        <li>To provide and maintain the Service</li>
                        <li>To notify you about changes to our Service</li>
                        <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
                        <li>To provide customer care and support</li>
                        <li>To provide analysis or valuable information so that we can improve the Service</li>
                        <li>To monitor the usage of the Service</li>
                        <li>To detect, prevent and address technical issues</li>
                    </ul>

                    <h2>3. Data Storage and Security</h2>
                    <p>[Placeholder: Explain where data is stored (e.g., cloud providers), security measures taken, data retention policy.]</p>

                    <h2>4. Disclosure Of Data</h2>
                    <p>[Placeholder: Detail circumstances under which data might be disclosed - legal requirements, business transfers, service providers.]</p>

                    <h2>5. Your Data Protection Rights</h2>
                     <p>[Placeholder: Outline user rights - access, correction, deletion, objection, data portability, etc., and how to exercise them.]</p>

                    <h2>6. Service Providers</h2>
                    <p>[Placeholder: Mention use of third-party service providers (e.g., hosting, analytics, payment processors) and link to their privacy policies if applicable.]</p>

                    <h2>7. Children's Privacy</h2>
                    <p>Our Service does not address anyone under the age of 18 ("Children")...</p>

                    <h2>8. Changes To This Privacy Policy</h2>
                    <p>We may update our Privacy Policy from time to time...</p>

                    <h2>9. Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us: [Provide Contact Email/Address]</p>

                </div>

                <div className="mt-8 text-center">
                    <Link to="/" className="text-indigo-600 hover:text-indigo-800 text-sm">
                        &larr; Back to Home
                    </Link>
                </div></div>
            </div>
            <Footer>    </Footer>
        </div>
    );
};

export default PrivacyPolicyPage;
