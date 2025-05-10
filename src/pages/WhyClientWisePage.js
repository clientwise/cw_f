import React from 'react';
import { Link } from 'react-router-dom';
// import Button from '../components/common/Button'; // Not used in this version, but keep if needed elsewhere
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Benefit Card Component
const BenefitCard = ({ icon, title, description, bgColor, borderColor, textColor, iconColor }) => (
    <div className={`rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col ${bgColor} border ${borderColor}`}>
        <div className={`p-6 flex flex-col items-center text-center flex-grow`}>
            <div className={`mb-4 inline-flex items-center justify-center p-3 rounded-full ${iconColor} bg-opacity-20`}>
                <i className={`${icon} text-2xl ${iconColor}`}></i>
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${textColor}`}>{title}</h3>
            <p className={`text-sm text-gray-700 leading-relaxed flex-grow`}>{description}</p>
        </div>
    </div>
);


const WhyClientWisePage = () => {
    const benefits = [
        {
            icon: "fas fa-cogs",
            title: "Streamlined Workflow",
            description: "Manage clients, policies, tasks, and communications all in one place. Reduce manual effort and save valuable time, allowing you to focus on building relationships.",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200",
            textColor: "text-purple-800",
            iconColor: "text-purple-600"
        },
        {
            icon: "fas fa-users-cog", // Changed icon for more specificity
            title: "Enhanced Client Management",
            description: "Keep detailed client profiles, track interaction history, and set intelligent reminders. Never miss a renewal, follow-up, or an opportunity to delight your clients.",
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
            textColor: "text-green-800",
            iconColor: "text-green-600"
        },
        {
            icon: "fas fa-calculator", // Changed icon
            title: "Simplified Commissions",
            description: "Automated commission calculations (based on your product setup) and clear, downloadable statements help you track your earnings effortlessly and accurately.",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
            textColor: "text-blue-800",
            iconColor: "text-blue-600"
        },
        {
            icon: "fas fa-brain", // Changed icon
            title: "AI-Powered Insights (Coming Soon!)",
            description: "Leverage Artificial Intelligence for predictive coverage estimations, proactive task suggestions, and personalized policy recommendations to better serve clients and uncover new opportunities.",
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-300", // Darker border for yellow
            textColor: "text-yellow-800",
            iconColor: "text-yellow-600"
        },
        {
            icon: "fas fa-bullhorn",
            title: "Effective Marketing Tools",
            description: "Utilize pre-built email templates, manage client segments for targeted campaigns, and track performance to engage prospects and nurture client relationships effectively.",
            bgColor: "bg-red-50",
            borderColor: "border-red-200",
            textColor: "text-red-800",
            iconColor: "text-red-600"
        },
        {
            icon: "fas fa-shield-alt",
            title: "Secure & Reliable Platform",
            description: "Built with bank-grade security measures to protect your valuable client data. Hosted on robust and reliable infrastructure, ensuring high availability and peace of mind.",
            bgColor: "bg-indigo-50",
            borderColor: "border-indigo-200",
            textColor: "text-indigo-800",
            iconColor: "text-indigo-600"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
                        Why Choose <span className="text-yellow-300">ClientWise</span>?
                    </h1>
                    <p className="text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">
                        In today's dynamic Indian insurance market, efficiency, strong client relationships, and smart decision-making are paramount. ClientWise is meticulously crafted to empower agents and advisors like you to not just compete, but to thrive.
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-grow bg-gray-100 py-12 sm:py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Benefits Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
                        {benefits.map((benefit) => (
                            <BenefitCard
                                key={benefit.title}
                                icon={benefit.icon}
                                title={benefit.title}
                                description={benefit.description}
                                bgColor={benefit.bgColor}
                                borderColor={benefit.borderColor}
                                textColor={benefit.textColor}
                                iconColor={benefit.iconColor}
                            />
                        ))}
                    </div>

                    {/* Concluding CTA Section */}
                    <div className="bg-white p-8 sm:p-10 rounded-xl shadow-xl text-center">
                        <i className="fas fa-rocket text-4xl text-purple-600 mb-4"></i>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                            Ready to Elevate Your Insurance Business?
                        </h2>
                        <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
                            Focus on what you do best – advising clients and closing deals. Let ClientWise streamline your operations, enhance your client engagement, and unlock new levels of productivity.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                            <Link 
                                to="/#pricing" // Assuming your pricing section is on the homepage
                                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-transform transform hover:scale-105 w-full sm:w-auto"
                            >
                                View Pricing Plans
                            </Link>
                            <Link 
                                to="/contact-us" // Example link, adjust as needed
                                className="inline-flex items-center justify-center px-8 py-3 border border-purple-600 text-base font-medium rounded-lg text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-transform transform hover:scale-105 w-full sm:w-auto"
                            >
                                Request a Demo
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Back to Home Link - Kept subtle if needed, or can be removed if CTA above is sufficient */}
             <div className="text-center py-8 bg-gray-100">
                <Link to="/" className="text-indigo-600 hover:text-indigo-800 hover:underline text-sm">
                    &larr; Back to Home
                </Link>
            </div>

            <Footer />
        </div>
    );
};

export default WhyClientWisePage;
