import React from 'react';
import { Link } from 'react-router-dom'; // For back button

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e' };

// Placeholder Q&A data
const faqData = [
    { q: 'How do I add a new client?', a: 'Navigate to the "Clients" section using the sidebar, then click the "+ Add New Client" button. Fill in the required details in the modal that appears.' },
    { q: 'How is commission calculated?', a: 'Commission details are typically set per product. When you add a policy for a client, the commission is calculated based on the product\'s rate and the premium amount. You can view detailed statements in the "Commissions" section.' },
    { q: 'How do I use the AI Policy Recommendation?', a: 'On the Client Profile page, look for the "AI Recommendations" section. The AI analyzes the client\'s profile and existing policies to suggest potentially suitable additional products.' },
    { q: 'Can I import existing client data?', a: 'Functionality for bulk importing clients via CSV might be available. Please check the "Clients" page for an "Import" button or contact support for assistance.' },
    { q: 'How do I reset my password?', a: 'On the login screen, click the "Forgot Password?" link. Enter your registered email address, and if an account exists, you will receive instructions (check backend console log for the link in this demo version).' },
];

const FAQPage = () => {
  return (
    <div style={{'--brand-purple': themeColors.brandPurple}}>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-semibold text-gray-800">Frequently Asked Questions</h2>
             <Link to="/dashboard/support" className="text-sm text-purple-600 hover:underline flex items-center">
                <i className="fas fa-arrow-left mr-2"></i> Back to Help & Support
             </Link>
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200 space-y-4">
            {faqData.map((item, index) => (
                <details key={index} className="group border-b last:border-b-0 pb-2">
                    <summary className="flex justify-between items-center cursor-pointer py-2 text-md font-medium text-gray-700 hover:text-[--brand-purple] list-none">
                        {item.q}
                        <span className="ml-4 transition-transform duration-200 group-open:rotate-180">
                            <i className="fas fa-chevron-down text-sm text-gray-500"></i>
                        </span>
                    </summary>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed px-2">
                        {item.a}
                    </p>
                </details>
            ))}
        </div>
    </div>
  );
};

export default FAQPage;
