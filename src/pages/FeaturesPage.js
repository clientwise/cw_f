import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button'; // Adjust path if needed
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
// Assume themeColors is available
const themeColors = { brandPurple: '#5a239e', /* ... */ };

// Feature data structure
const features = [
    {
        icon: 'fas fa-users',
        title: 'Client Management (CRM)',
        description: 'Store comprehensive client details, including personal, financial, and family information. Track interactions and log communications (calls, emails, meetings).',
        details: [
            'Detailed client profiles',
            'Contact & Address management',
            'Lead/Active/Lapsed status tracking',
            'Custom tags for segmentation',
            'Interaction logging',
        ],
    },
    {
        icon: 'fas fa-file-contract',
        title: 'Policy Management',
        description: 'Record and track all client policies. Link policies to products and clients. Get automatic reminders for upcoming renewals.',
        details: [
            'Add/View policy details (Number, Premium, Sum Insured, Dates)',
            'Link to Product Catalog',
            'Status tracking (Active, Lapsed, etc.)',
            'Renewal reminders (via Dashboard/Tasks)',
            'Document attachment (Policy Docs)',
        ],
    },
     {
        icon: 'fas fa-tasks',
        title: 'Task Management',
        description: 'Create and manage tasks related to specific clients or general activities. Prioritize with due dates and urgency flags.',
        details: [
            'Create tasks linked to clients',
            'Set due dates and urgency',
            'View pending tasks on dashboard and client profile',
            'Mark tasks as complete (future enhancement)',
        ],
    },
     {
        icon: 'fas fa-percent',
        title: 'Commission Tracking',
        description: 'Automated calculation of upfront commission based on product setup and policy premium. View detailed commission statements.',
        details: [
            'Product-level commission percentage setup (Agency Admin)',
            'Automatic upfront calculation on policy creation',
            'Dedicated commission statement page',
            'Filtering by date range',
        ],
    },
     {
        icon: 'fas fa-folder-open',
        title: 'Document Management',
        description: 'Securely upload and store client-related documents like KYC, proposals, policy copies, and claim forms.',
        details: [
            'Upload various document types',
            'Link documents to clients',
            'View uploaded documents on client profile',
            'Client Portal upload capabilities',
        ],
    },
    {
        icon: 'fas fa-bullhorn',
        title: 'Marketing & Communication',
        description: 'Engage clients and prospects with basic marketing tools. Create client segments for targeted outreach.',
        details: [
            'Manage communication templates (Email/SMS - future)',
            'Create and manage client segments',
            'Track basic campaign performance (future)',
            'Log all communications',
        ],
    },
     {
        icon: 'fas fa-lightbulb',
        title: 'AI-Powered Assistance',
        description: 'Leverage AI for insights and efficiency. Get coverage estimations, task suggestions, and policy recommendations.',
        details: [
            'Automated Coverage Estimation based on profile',
            'AI Task Suggestions for agents (Dashboard & Client)',
            'AI Policy Recommendations (future)',
            'AI Summary of policy documents (future)',
        ],
    },
    {
        icon: 'fas fa-share-alt',
        title: 'Client Collaboration Tools',
        description: 'Engage clients directly through secure, shareable links for onboarding and document collection.',
        details: [
            'Sharable Onboarding Form link per agent',
            'Secure Client Portal link per client',
            'Client document upload via Portal',
        ],
    },
     {
        icon: 'fas fa-building',
        title: 'Agency Management Portal',
        description: 'For agency owners: manage agents, oversee commissions, add products, and broadcast notices to your team.',
        details: [
            'Add/Manage agent users',
            'View agency-wide commission reports',
            'Manage Product Catalog for the agency',
            'Post agency-specific notices',
        ],
    },
];


const FeaturesPage = () => {
    return (
        <div>
            <Header></Header>

        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">ClientWise Features</h1>
                <p className="text-center text-lg text-gray-600 mb-12">Everything you need to manage and grow your insurance business.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 flex flex-col">
                            <div className="flex items-center mb-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                    <i className={`${feature.icon} text-xl`}></i>
                                </div>
                                <h2 className="ml-4 text-lg font-semibold text-gray-800">{feature.title}</h2>
                            </div>
                            <p className="text-sm text-gray-600 mb-4 flex-grow">{feature.description}</p>
                            {feature.details && feature.details.length > 0 && (
                                <ul className="space-y-1 text-xs text-gray-500 list-disc list-inside mb-4">
                                    {feature.details.map((detail, i) => <li key={i}>{detail}</li>)}
                                </ul>
                            )}
                             {/* Optional: Add a Learn More link if needed */}
                             {/* <Link to="#" className="text-xs text-purple-600 hover:underline mt-auto">Learn More</Link> */}
                        </div>
                    ))}
                </div>

                 <div className="mt-16 text-center">
                    <p className="text-gray-600 mb-4">Explore how ClientWise can transform your agency.</p>
                
                     <p className="mt-4">
                        <Link to="/" className="text-indigo-600 hover:text-indigo-800 text-sm">
                            &larr; Back to Home
                        </Link>
                    </p>
                </div>

            </div>        </div>
            <Footer></Footer>
        </div>
    );
};

export default FeaturesPage;
