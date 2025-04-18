import React from 'react';
import Button from '../components/common/Button'; // Adjust path if needed

// Assume themeColors is available globally or via context/props
const themeColors = {
    brandPurple: '#5a239e', brandPurpleHover: '#703abc',
    white: '#ffffff', gray50: '#f9fafb', gray100: '#f3f4f6',
    gray700: '#374151', gray800: '#1f2937', green500: '#22c55e',
};

const PricingPage = () => {

    const handleUpgrade = () => {
        // TODO: Implement upgrade flow (e.g., redirect to payment gateway or contact form)
        alert('Upgrade Now - Not Implemented');
    };

    return (
        <div style={{'--brand-purple': themeColors.brandPurple}}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Pricing Plans</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

                {/* Free Trial Card */}
                <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 flex flex-col">
                    <h3 className="text-xl font-semibold text-center text-gray-700 mb-4">Free Trial</h3>
                    <p className="text-center text-gray-500 mb-6">Get started and explore core features.</p>
                    <div className="text-center mb-6">
                        <span className="text-4xl font-bold text-gray-800">Free</span>
                        <span className="text-gray-500">/ first month</span>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600 mb-8 flex-grow">
                        <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2"></i> Up to 20 Clients</li>
                        <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2"></i> Core CRM Features</li>
                        <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2"></i> Basic Reporting</li>
                        <li className="flex items-center"><i className="fas fa-times text-gray-400 mr-2"></i> Limited AI Features</li>
                        <li className="flex items-center"><i className="fas fa-times text-gray-400 mr-2"></i> Limited Marketing Tools</li>
                    </ul>
                    <Button variant="outlineSm" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50" disabled>
                        Currently Active
                    </Button>
                </div>

                {/* Pro Plan Card */}
                 <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-[--brand-purple] flex flex-col relative">
                    <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[--brand-purple] text-white text-xs font-semibold px-3 py-1 rounded-full">Recommended</span>
                    <h3 className="text-xl font-semibold text-center text-[--brand-purple] mb-4 mt-2">Pro Plan</h3>
                    <p className="text-center text-gray-500 mb-6">Unlock the full potential of ClientWise.</p>
                    <div className="text-center mb-6">
                        <span className="text-4xl font-bold text-gray-800">₹1500</span>
                        <span className="text-gray-500">/ 3 months</span>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-600 mb-8 flex-grow">
                        <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2"></i> Unlimited Clients</li>
                        <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2"></i> All Core Features</li>
                        <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2"></i> Advanced Reporting</li>
                        <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2"></i> **All AI Features**</li>
                        <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2"></i> Full Marketing Suite</li>
                         <li className="flex items-center"><i className="fas fa-check text-green-500 mr-2"></i> Priority Support</li>
                    </ul>
                    <Button onClick={handleUpgrade} variant="brand" className="w-full">
                        Upgrade Now
                    </Button>
                </div>

            </div>
             <p className="text-center text-xs text-gray-500 mt-8">
                Prices are exclusive of applicable taxes (GST). Plans auto-renew unless cancelled.
            </p>
        </div>
    );
};

export default PricingPage;

