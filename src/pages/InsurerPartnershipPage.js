import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button'; // Adjust path if needed
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Simple Input component for the form
const FormInput = ({ id, label, type = 'text', value, onChange, placeholder, required = false, iconClass }) => (
    <div>
        <label htmlFor={id} className="block text-xs font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative rounded-md shadow-sm">
            {iconClass && (
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3">
                    <i className={`${iconClass} text-gray-400`} aria-hidden="true"></i>
                </div>
            )}
            <input
                type={type}
                name={id}
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`block w-full appearance-none rounded-md border border-gray-300 px-2 py-1.5 sm:px-3 sm:py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm ${iconClass ? 'pl-8 sm:pl-10' : ''}`}
            />
        </div>
    </div>
);

// Simple Textarea component
const FormTextarea = ({ id, label, value, onChange, placeholder, required = false, rows = 3 }) => (
    <div>
        <label htmlFor={id} className="block text-xs font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
            name={id}
            id={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            rows={rows}
            className="block w-full rounded-md border border-gray-300 px-2 py-1.5 sm:px-3 sm:py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
        />
    </div>
);

// New Banner Component for Insurers
const InsurerPartnershipBanner = () => (
    <div className="bg-blue-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 md:flex md:items-center md:justify-between">
            <div className="flex-grow md:flex md:items-center">
                <i className="fas fa-cogs text-3xl sm:text-4xl text-blue-300 mr-4 hidden md:block"></i>
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                        Strategic Partnerships with Insurance Providers
                    </h2>
                    <p className="mt-1 text-sm sm:text-base text-blue-200">
                        Collaborate with ClientWise to enhance agent productivity through seamless API integrations.
                    </p>
                </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                <Link
                    to="#insurer-contact-form" // Link to the form section on the page
                    className="inline-block bg-white text-blue-700 font-semibold py-2 px-5 rounded-lg shadow hover:bg-blue-50 transition duration-150 ease-in-out text-sm sm:text-base"
                >
                    Discuss Integration
                </Link>
            </div>
        </div>
    </div>
);


const InsurerPartnershipPage = () => {
    const companyName = "18Novem Technologies";
    const adminEmail = "admin@goclientwise.com"; // Target for partnership inquiries

    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        integrationInterest: '', // e.g., Product APIs, Proposal APIs
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setSubmitError('');

        // **IMPORTANT: Backend Integration Needed Here for actual email sending**
        // This is a SIMULATION.
        console.log("Form Data for Insurer Partnership Inquiry:", formData);
        const emailContent = `
            New Insurer Partnership Inquiry:
            ---------------------------------
            Company Name: ${formData.companyName}
            Contact Person: ${formData.contactPerson}
            Email: ${formData.email}
            Phone: ${formData.phone || 'Not provided'}
            Area of Integration Interest: ${formData.integrationInterest || 'Not specified'}
            Message:
            ${formData.message}
            ---------------------------------
        `;
        console.log(`Simulating email to ${adminEmail} with content:`, emailContent);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // **SIMULATION SUCCESS/FAILURE**
        const simulateSuccess = true; // Change to false to test error handling

        if (simulateSuccess) {
            setIsSubmitted(true);
        } else {
            setSubmitError('Failed to send inquiry. Please try again later or contact us directly.');
        }
        setIsLoading(false);
    };

    const integrationAreas = [
        {
            title: "Product Information APIs",
            text: "Enable real-time synchronization of your latest product details, brochures, eligibility criteria, and premium tables directly into ClientWise, ensuring agents always have accurate information.",
            icon: "fas fa-book-open"
        },
        {
            title: "Proposal & Illustration APIs",
            text: "Allow agents to generate compliant and customized proposals or benefit illustrations using your core systems directly from within ClientWise, reducing errors and saving time.",
            icon: "fas fa-file-signature"
        },
        {
            title: "Policy Issuance & Onboarding APIs",
            text: "Streamline the journey from proposal acceptance to policy issuance. Facilitate digital application submission and status tracking for a faster turnaround.",
            icon: "fas fa-stamp"
        },
        {
            title: "Commission Data APIs",
            text: "Provide agents and their agencies with transparent and timely access to commission statements and payout details, simplifying reconciliation and financial planning.",
            icon: "fas fa-rupee-sign" // Changed from wallet for variety
        },
        {
            title: "Customer & Policy Data Sync APIs",
            text: "Enable secure and compliant synchronization of relevant client or policy data (e.g., renewal dates, servicing requests) between your systems and ClientWise, ensuring data consistency and a unified agent view.",
            icon: "fas fa-sync-alt"
        },
        {
            title: "Claims Information APIs",
            text: "Offer agents visibility into claim status updates for their clients, empowering them to provide better post-sales service and support.",
            icon: "fas fa-medkit"
        }
    ];

    const insurerBenefits = [
         {
            title: "Boost Agent Productivity & Adoption",
            text: "By providing a deeply integrated CRM, you empower your agents to work more efficiently, leading to higher productivity, better sales outcomes, and increased adoption of your digital tools.",
            icon: "fas fa-rocket"
        },
        {
            title: "Enhance Your Digital Ecosystem",
            text: "Position your company as a forward-thinking insurer by offering a modern, preferred CRM solution that seamlessly connects with your core systems, enriching your digital offerings to your distribution network.",
            icon: "fas fa-digital-tachograph"
        },
        {
            title: "Streamline Data Flow & Reduce Errors",
            text: "Automated data exchange through APIs minimizes manual data entry, reduces errors, ensures data accuracy, and provides a single source of truth for critical agent and client information.",
            icon: "fas fa-exchange-alt"
        },
        {
            title: "Drive Product Penetration",
            text: "With up-to-date product information and easy proposal generation within their CRM, agents are more likely to understand and promote a wider range of your offerings.",
            icon: "fas fa-bullseye"
        },
        {
            title: "Gain Valuable Insights",
            text: "Potential for aggregated and anonymized data insights (subject to data privacy and compliance) on agent CRM usage, popular product queries, and more, helping you refine your agent support strategies.",
            icon: "fas fa-chart-bar"
        },
        {
            title: "Strengthen Agent Loyalty",
            text: "Investing in tools that genuinely help your agents succeed fosters stronger relationships and loyalty towards your brand.",
            icon: "fas fa-link"
        }
    ];


    return (
        <div>
            <Header />
            <InsurerPartnershipBanner />

            <div className="min-h-screen bg-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto text-center mb-12 sm:mb-16 pt-8">
                    <h1 className="text-4xl lg:text-5xl font-bold text-blue-800 mb-4 tracking-tight">Insurer Partnership Program</h1>
                    <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                        Forge a strategic alliance with ClientWise. Integrate your systems to empower your agents and drive mutual growth in the Indian insurance market.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto bg-white p-6 sm:p-8  rounded-lg grid md:grid-cols-5 gap-8 lg:gap-12 items-start">
                    {/* Left Column: Information */}
                    <div className="md:col-span-3 prose prose-blue max-w-none text-gray-700"> {/* Adjusted prose class */}
                        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Collaborate for a Connected Agent Experience</h2>
                        <p className="text-base sm:text-lg leading-relaxed mb-4">
                            {companyName} is dedicated to enhancing the capabilities of insurance agents across India. We invite insurance companies to join us in this mission by forming strategic partnerships. By integrating your essential APIs with ClientWise, we can create a deeply connected and highly efficient ecosystem for your agency force.
                        </p>
                        <p className="text-base sm:text-lg leading-relaxed mb-6">
                            Imagine your agents having instant access to your latest product information, generating proposals, and tracking policy statuses, all from within their preferred CRM platform. This synergy not only boosts their productivity but also strengthens their relationship with your brand.
                        </p>

                        <h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">Key Areas for API Integration:</h3>
                        <ul className="space-y-4">
                            {integrationAreas.map(area => (
                                <li key={area.title} className="flex items-start">
                                    <i className={`${area.icon} text-blue-600 mt-1 mr-3 fa-fw text-lg`}></i>
                                    <div>
                                        <strong className="text-gray-800">{area.title}</strong>
                                        <p className="text-sm text-gray-600 leading-normal">{area.text}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        
                        <h3 className="text-xl font-semibold text-blue-700 mt-8 mb-4">Mutual Benefits of Partnership:</h3>
                        <ul className="space-y-4">
                            {insurerBenefits.map(benefit => (
                                <li key={benefit.title} className="flex items-start">
                                    <i className={`${benefit.icon} text-blue-600 mt-1 mr-3 fa-fw text-lg`}></i>
                                    <div>
                                        <strong className="text-gray-800">{benefit.title}</strong>
                                        <p className="text-sm text-gray-600 leading-normal">{benefit.text}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>


                        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="text-lg font-semibold text-blue-700 mb-2">Our Collaborative Approach</h4>
                            <p className="text-sm text-gray-600">
                                We believe in a flexible and collaborative partnership model. Our technical team will work closely with yours to define integration scopes, ensure data security, and provide ongoing support. We are committed to creating solutions that are robust, scalable, and compliant with Indian regulatory standards.
                            </p>
                        </div>
                         <p className="mt-8 text-base sm:text-lg">
                            Let's work together to build a more efficient and digitally empowered future for your agents with ClientWise.
                        </p>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div id="insurer-contact-form" className="md:col-span-2 bg-blue-50 p-4 sm:p-6 rounded-lg border border-blue-200 shadow-lg sticky top-24">
                        <div className="text-center mb-4 sm:mb-6">
                            <i className="fas fa-plug text-4xl sm:text-5xl text-blue-500 mb-3"></i>
                            <h3 className="text-xl sm:text-2xl font-semibold text-blue-800">
                                {isSubmitted ? "Inquiry Received!" : "Discuss Partnership & Integration"}
                            </h3>
                        </div>

                        {isSubmitted ? (
                            <div className="text-center py-4">
                                <p className="text-green-700 bg-green-100 p-3 sm:p-4 rounded-md text-sm sm:text-base mb-4">
                                    Thank you for your interest! Our partnership team has received your details and will be in touch shortly to discuss potential collaborations.
                                </p>
                                <Button 
                                    variant="secondary"
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700"
                                    size="sm" 
                                    onClick={() => {setIsSubmitted(false); setFormData({ companyName: '', contactPerson: '', email: '', phone: '', integrationInterest:'', message: '' });}}
                                >
                                    Submit Another Inquiry
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <p className="text-xs sm:text-sm text-gray-600 text-center mb-4">
                                   We're excited to 18novem1987@gmail.com
 we can work together. Please provide some initial details.
                                </p>
                                <FormInput
                                    id="companyName"
                                    label="Insurance Company Name"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    placeholder="Your Company's Full Name"
                                    required
                                    iconClass="fas fa-building"
                                />
                                <FormInput
                                    id="contactPerson"
                                    label="Key Contact Person"
                                    value={formData.contactPerson}
                                    onChange={handleChange}
                                    placeholder="Full Name of Contact"
                                    required
                                    iconClass="fas fa-user-tie"
                                />
                                <FormInput
                                    id="email"
                                    label="Contact Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="official.email@example.com"
                                    required
                                    iconClass="fas fa-envelope"
                                />
                                <FormInput
                                    id="phone"
                                    label="Contact Phone (Optional)"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+91 XXXXX XXXXX"
                                    iconClass="fas fa-phone"
                                />
                                 <FormInput
                                    id="integrationInterest"
                                    label="Primary Area of Integration Interest (Optional)"
                                    value={formData.integrationInterest}
                                    onChange={handleChange}
                                    placeholder="e.g., Product APIs, Proposal APIs"
                                    iconClass="fas fa-project-diagram"
                                />
                                <FormTextarea
                                    id="message"
                                    label="Message / Specific Ideas (Optional)"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Any specific thoughts or questions?"
                                    rows={3}
                                />
                                {submitError && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-md">{submitError}</p>}
                                <Button
                                    variant="brand"
                                    className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                                    size="md"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending Inquiry...
                                        </>
                                    ) : (
                                        "Initiate Discussion"
                                    )}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <Link to="/" className="text-indigo-600 hover:text-indigo-800 hover:underline text-sm">
                        &larr; Back to Home
                    </Link>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default InsurerPartnershipPage;
