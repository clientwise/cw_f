import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button'; // Adjust path if needed
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// Simple Input component for the form (retained from previous version)
const FormInput = ({ id, label, type = 'text', value, onChange, placeholder, required = false, iconClass }) => (
    <div>
        <label htmlFor={id} className="block text-xs font-medium text-gray-700 mb-1"> {/* Reduced label size */}
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative rounded-md shadow-sm">
            {iconClass && (
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3"> {/* Adjusted icon padding */}
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
                className={`block w-full appearance-none rounded-md border border-gray-300 px-2 py-1.5 sm:px-3 sm:py-2 placeholder-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm ${iconClass ? 'pl-8 sm:pl-10' : ''}`} // Reduced padding
            />
        </div>
    </div>
);

// Simple Textarea component (retained from previous version)
const FormTextarea = ({ id, label, value, onChange, placeholder, required = false, rows = 3 }) => ( // Reduced default rows
    <div>
        <label htmlFor={id} className="block text-xs font-medium text-gray-700 mb-1"> {/* Reduced label size */}
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
            className="block w-full rounded-md border border-gray-300 px-2 py-1.5 sm:px-3 sm:py-2 placeholder-gray-400 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm" // Reduced padding
        />
    </div>
);


// New Banner Component
const PartnershipBanner = ({ commissionRate }) => (
    <div className=" text-white shadow-md" style={{ backgroundColor: '#5a239e' }}>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 md:flex md:items-center md:justify-between">
            <div className="flex-grow md:flex md:items-center">
                <i className="fas fa-bullhorn text-3xl sm:text-4xl text-white mr-4 hidden md:block"></i>
                <div>
                    <h2 className="text-lg sm:text-2xl font-bold tracking-tight">
                        Boost and Streamline Your Insurance Agency Operations with ClientWise
                    </h2>
                    <p className="mt-1 text-xs sm:text-base text-white-200">
                       Empower your agency with a centralized platform that simplifies operations, sales, finance and marketing,  boosts productivity, and ensures consistent client service across your entire team. 
                    </p>
                </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                <Link
                    to="#sales-partner-form" // Link to the form section on the page
                    className="inline-block bg-white  font-semibold py-2 px-5 rounded-lg shadow hover:bg-green-50 transition duration-150 ease-in-out text-sm sm:text-base"
               style={{color: '#5a239e'}}  >
                    Register Interest
                </Link>
            </div>
        </div>
    </div>
);


const AgencyPartnershipPage = () => {
    const companyName = "18Novem Technologies";
    const adminEmail = "admin@goclientwise.com";
    const commissionRate = 20; // As specified

    const [formData, setFormData] = useState({
        agencyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        numberOfAgents: '',
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
        console.log("Form Data to be sent:", formData);
        // ... (simulation logic remains the same as previous version) ...
        const emailContent = `
            New Agency Partnership Inquiry:
            --------------------------------
            Agency Name: ${formData.agencyName}
            Contact Person: ${formData.contactPerson}
            Email: ${formData.email}
            Phone: ${formData.phone || 'Not provided'}
            Number of Agents: ${formData.numberOfAgents || 'Not specified'}
            Message:
            ${formData.message}
            --------------------------------
        `;
        console.log(`Simulating email to ${adminEmail} with content:`, emailContent);
        await new Promise(resolve => setTimeout(resolve, 1500));
        const simulateSuccess = true;
        if (simulateSuccess) {
            setIsSubmitted(true);
        } else {
            setSubmitError('Failed to send inquiry. Please try again later or contact us directly.');
        }
        setIsLoading(false);
    };

    const benefits = [
        {
            title: "Centralized Agency Hub:",
            text: "Gain a unified dashboard to manage all your agents, view their client portfolios, track policies, and oversee overall agency operations. Eliminate data silos and ensure every team member is working with consistent, up-to-date information.",
            icon: "fas fa-sitemap"
        },
        {
            title: "Enhanced Team Collaboration:",
            text: "Foster a collaborative environment with features like shared client notes, internal communication tools, and synchronized calendars (feature availability may vary). Ensure seamless handoffs and a consistent client experience, regardless of which agent is interacting.",
            icon: "fas fa-users"
        },
        {
            title: "Comprehensive Performance Tracking:",
            text: "Access detailed reports on agent activity, lead conversion rates, policy sales, commission payouts, and overall agency growth trajectories. Make data-driven decisions to optimize strategies and identify high-performing agents.",
            icon: "fas fa-chart-line"
        },
        {
            title: "Standardized & Streamlined Processes:",
            text: "Implement consistent workflows for client onboarding, needs analysis, policy issuance, renewal management, and compliance checks. Reduce errors, improve efficiency, and ensure adherence to regulatory requirements across your entire team.",
            icon: "fas fa-check-double"
        },
        {
            title: "Attractive Volume Licensing & Dedicated Support:",
            text: "Benefit from tailored pricing plans designed for agencies, offering cost-effective solutions as your team grows. Receive priority support and dedicated account management to ensure your agency maximizes the value of ClientWise.",
            icon: "fas fa-tags"
        },
        {
            title: "Strengthen Your Agency Brand:",
            text: "Explore opportunities for co-branding or white-labeling the ClientWise platform, presenting a unified and professional technology front to your clients and agents (subject to specific partnership agreements and tiers).",
            icon: "fas fa-award"
        }
    ];


    return (
        <div>
            <Header />
            <PartnershipBanner commissionRate={commissionRate} />

            <div className="min-h-screen bg-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">

                
                <div className="max-w-5xl mx-auto text-center mb-12 sm:mb-16"> {/* Slightly increased max-width for header */}
                    <h1 className="text-4xl lg:text-5xl font-bold text-purple-800 mb-4 tracking-tight"> Be a 361 &#176; Insurance Agency  with ClientWise</h1>
                    <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                        Supercharge your insurance agency's growth and efficiency. Our partnership program provides the tools, support, and centralized platform your entire team needs to thrive in India's dynamic market.
                    </p>
                </div>

                {/* Main content area with two columns on medium screens and up */}
                <div className="max-w-6xl mx-auto bg-white p-6 sm:p-8  rounded-lg grid md:grid-cols-5 gap-8 lg:gap-12 items-start">
                    {/* Left Column: Information (takes up more space) */}
                    <div className="md:col-span-3 prose prose-indigo max-w-none text-gray-700">
                        <h2 className="text-2xl font-semibold text-purple-700 mb-4">Transform Your Agency with ClientWise</h2>
                        <p className="text-base sm:text-lg leading-relaxed mb-4">
                            In today's competitive insurance landscape in India, agencies face numerous challenges: managing a growing team of agents, ensuring consistent client service, tracking complex commission structures, and staying ahead of regulatory changes. Without a robust, centralized system, these can lead to operational inefficiencies, missed opportunities, and compliance risks.
                        </p>
                        <p className="text-base sm:text-lg leading-relaxed mb-6">
                            ClientWise, developed by {companyName}, offers a comprehensive CRM solution specifically designed to address these pain points for Indian insurance agencies. Our Agency Partnership Program is more than just software; it's a strategic alliance to equip your agency with the technological backbone for sustained growth and enhanced productivity.
                        </p>

                        <h3 className="text-xl font-semibold text-purple-700 mt-8 mb-4">Key Benefits of Partnering with Us:</h3>
                        <ul className="space-y-4">
                            {benefits.map(benefit => (
                                <li key={benefit.title} className="flex items-start">
                                    <i className={`${benefit.icon} text-purple-600 mt-1 mr-3 fa-fw text-lg`}></i>
                                    <div>
                                        <strong className="text-gray-800">{benefit.title}</strong>
                                        <p className="text-sm text-gray-600 leading-normal">{benefit.text}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <h4 className="text-lg font-semibold text-purple-700 mb-2">Who is this program for?</h4>
                            <p className="text-sm text-gray-600">
                                This program is ideal for ambitious insurance agencies in India of all sizes, from emerging teams to established enterprises, looking to:
                            </p>
                            <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1 pl-2">
                                <li>Scale their operations efficiently.</li>
                                <li>Improve agent productivity and satisfaction.</li>
                                <li>Enhance client relationship management across the team.</li>
                                <li>Gain better visibility and control over agency performance.</li>
                                <li>Leverage technology to build a future-ready agency.</li>
                            </ul>
                        </div>
                         <p className="mt-8 text-base sm:text-lg">
                            By partnering with ClientWise, you're not just adopting a CRM; you're investing in a platform that understands the nuances of the Indian insurance market and is committed to your agency's long-term success.
                        </p>
                    </div>

                    {/* Right Column: Contact Form (takes up less space) */}
                    <div id="sales-partner-form" className="md:col-span-2 bg-purple-50 p-4 sm:p-6 rounded-lg border border-purple-200 shadow-lg sticky top-24"> {/* Reduced padding, added sticky */}
                        <div className="text-center mb-4 sm:mb-6">
                            <i className="fas fa-hands-helping text-4xl sm:text-5xl text-purple-500 mb-3"></i>
                            <h3 className="text-xl sm:text-2xl font-semibold text-purple-800">
                                {isSubmitted ? "Inquiry Sent!" : "Partner with Us"}
                            </h3>
                        </div>

                        {isSubmitted ? (
                            <div className="text-center py-4">
                                <p className="text-green-700 bg-green-100 p-3 sm:p-4 rounded-md text-sm sm:text-base mb-4">
                                    Thank you for your interest! We've received your details and our partnership team will contact you within 24-48 business hours.
                                </p>
                                <Button variant="secondary" size="sm" onClick={() => {setIsSubmitted(false); setFormData({ agencyName: '', contactPerson: '', email: '', phone: '', numberOfAgents: '', message: '' });}}> {/* Reduced button size */}
                                    Submit Another Inquiry
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4"> {/* Reduced space-y */}
                                <p className="text-xs sm:text-sm text-gray-600 text-center mb-4">
                                    Fill out the form below to explore partnership opportunities.
                                </p>
                                <FormInput
                                    id="agencyName"
                                    label="Agency Name"
                                    value={formData.agencyName}
                                    onChange={handleChange}
                                    placeholder="Your Agency's Full Name"
                                    required
                                    iconClass="fas fa-building"
                                />
                                <FormInput
                                    id="contactPerson"
                                    label="Contact Person Name"
                                    value={formData.contactPerson}
                                    onChange={handleChange}
                                    placeholder="Your Full Name"
                                    required
                                    iconClass="fas fa-user-tie"
                                />
                                <FormInput
                                    id="email"
                                    label="Contact Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                    iconClass="fas fa-envelope"
                                />
                                <FormInput
                                    id="phone"
                                    label="Contact Phone" // Removed optional to encourage entry
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+91 XXXXX XXXXX"
                                    iconClass="fas fa-phone"
                                />
                                <FormInput
                                    id="numberOfAgents"
                                    label="Approx. Number of Agents" // Removed optional
                                    type="number"
                                    value={formData.numberOfAgents}
                                    onChange={handleChange}
                                    placeholder="e.g., 10"
                                    iconClass="fas fa-users-cog"
                                />
                                <FormTextarea
                                    id="message"
                                    label="Your Requirements / Questions"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us more about your agency..."
                                    required
                                />
                                {submitError && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-md">{submitError}</p>}
                                <Button
                                    variant="brand"
                                    size="md" // Reduced button size
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center items-center"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </>
                                    ) : (
                                        "Discuss Partnership"
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

export default AgencyPartnershipPage;