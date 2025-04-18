import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e' };

const HelpSupportPage = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 md:p-8 border border-gray-200" style={{'--brand-purple': themeColors.brandPurple}}>
        <h2 className="text-xl font-semibold text-[--brand-purple] mb-6 pb-4 border-b">
            <i className="fas fa-life-ring mr-2"></i>Help & Support
        </h2>

        <div className="space-y-6 text-sm text-gray-700">
            <p>
                Welcome to the ClientWise Help Center. Find answers to common questions or contact our support team.
            </p>

            {/* Link to FAQ Page */}
            <div className="p-4 bg-gray-50 rounded-md border hover:border-purple-200 transition-colors">
                <h3 className="font-semibold mb-2 text-gray-800">Frequently Asked Questions (FAQ)</h3>
                <p className="mb-2">Browse our FAQ section for quick answers to common queries about using ClientWise.</p>
                <Link to="/dashboard/support/faq" className="text-purple-600 hover:underline font-medium">
                    Go to FAQ &rarr;
                </Link>
            </div>

             <div className="p-4 bg-gray-50 rounded-md border">
                <h3 className="font-semibold mb-2 text-gray-800">Contact Support</h3>
                <p className="mb-1">For technical issues or specific questions, please reach out to our support team:</p>
                <ul className="list-disc list-inside ml-4">
                    <li>Email: <a href="mailto:support@clientwise.example" className="text-purple-600 hover:underline">support@clientwise.example</a></li>
                    <li>Phone: <a href="tel:+911234567890" className="text-purple-600 hover:underline">+91 1234 567 890</a> (Mon-Fri, 9 AM - 6 PM IST)</li>
                </ul>
            </div>

             {/* Link to Training Page */}
             <div className="p-4 bg-gray-50 rounded-md border hover:border-purple-200 transition-colors">
                <h3 className="font-semibold mb-2 text-gray-800">Training Resources</h3>
                <p className="mb-2">Access video tutorials and guides to get the most out of ClientWise.</p>
                 <Link to="/dashboard/support/training" className="text-purple-600 hover:underline font-medium">
                    View Training Materials &rarr;
                </Link>
            </div>
        </div>
    </div>
  );
};

export default HelpSupportPage;
