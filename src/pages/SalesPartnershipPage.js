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
                className={`block w-full appearance-none rounded-md border border-gray-300 px-2 py-1.5 sm:px-3 sm:py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm ${iconClass ? 'pl-8 sm:pl-10' : ''}`}
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
            className="block w-full rounded-md border border-gray-300 px-2 py-1.5 sm:px-3 sm:py-2 placeholder-gray-400 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
        />
    </div>
);

// New Banner Component
const PartnershipBanner = ({ commissionRate }) => (
    <div className="bg-green-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 md:flex md:items-center md:justify-between">
            <div className="flex-grow md:flex md:items-center">
                <i className="fas fa-bullhorn text-3xl sm:text-4xl text-green-300 mr-4 hidden md:block"></i>
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                        Become a Valued ClientWise Sales Partner
                    </h2>
                    <p className="mt-1 text-sm sm:text-base text-green-200">
                        Empower insurance agents & earn a <strong>{commissionRate}% recurring commission</strong> for every successful referral.
                    </p>
                </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                <Link
                    to="#sales-partner-form" // Link to the form section on the page
                    className="inline-block bg-white text-green-700 font-semibold py-2 px-5 rounded-lg shadow hover:bg-green-50 transition duration-150 ease-in-out text-sm sm:text-base"
                >
                    Register Interest
                </Link>
            </div>
        </div>
    </div>
);


const SalesPartnershipPage = () => {
    const companyName = "18Novem Technologies";
    const commissionRate = 20; // As specified
    const adminEmail = "admin@goclientwise.com"; // Target for interest registration

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        networkDescription: '' // Optional field
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
        console.log("Form Data for Sales Partnership Interest:", formData);
        const emailContent = `
            New Sales Partnership Program Interest:
            ---------------------------------------
            Full Name: ${formData.fullName}
            Email: ${formData.email}
            Network Description/Message:
            ${formData.networkDescription || 'Not provided'}
            ---------------------------------------
        `;
        console.log(`Simulating email to ${adminEmail} with content:`, emailContent);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // **SIMULATION SUCCESS/FAILURE**
        const simulateSuccess = true; // Change to false to test error handling

        if (simulateSuccess) {
            setIsSubmitted(true);
            // Optionally reset form:
            // setFormData({ fullName: '', email: '', networkDescription: '' });
        } else {
            setSubmitError('Failed to register interest. Please try again later.');
        }
        setIsLoading(false);
    };

    const programSteps = [
        {
            title: "Sign Up & Get Approved",
            text: "Quickly register your interest through our simple form. Once the program officially launches, we'll guide you through the full onboarding process to become an official ClientWise Sales Partner.",
            icon: "fas fa-user-plus"
        },
        {
            title: "Receive Your Unique Referral Tools",
            text: "Upon approval, you'll receive a unique referral link and/or code, along with marketing materials to help you effectively introduce ClientWise to your network.",
            icon: "fas fa-share-alt"
        },
        {
            title: "Refer & Educate",
            text: "Share the benefits of ClientWise with insurance agents and professionals in your network. Help them understand how our CRM can streamline their operations and boost their productivity.",
            icon: "fas fa-bullhorn"
        },
        {
            title: "Earn Generous Commissions",
            text: `For every new agent who subscribes to ClientWise through your referral, you'll earn a competitive ${commissionRate}% commission on their initial and recurring subscription payments (specific terms will be detailed in the partnership agreement).`,
            icon: "fas fa-wallet"
        },
        {
            title: "Track Your Success",
            text: "Gain access to a dedicated partner dashboard (coming soon) to monitor your referrals, track conversions, and view your accumulated earnings in real-time.",
            icon: "fas fa-chart-pie"
        }
    ];

    return (
        <div>
            <Header />
            {/* --- Banner Added Here --- */}
            <PartnershipBanner commissionRate={commissionRate} />

            <div className="min-h-screen bg-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto text-center mb-12 sm:mb-16 pt-8"> {/* Added pt-8 to create space from banner */}
                    <h1 className="text-4xl lg:text-5xl font-bold text-green-800 mb-4 tracking-tight">ClientWise Sales Partnership Program</h1>
                    <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                        Partner with ClientWise, refer our industry-leading CRM to insurance agents across India, and earn attractive recurring commissions.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto bg-white p-6 sm:p-8  rounded-lg grid md:grid-cols-5 gap-8 lg:gap-12 items-start">
                    {/* Left Column: Information */}
                    <div className="md:col-span-3 prose prose-green max-w-none text-gray-700">
                        <h2 className="text-2xl font-semibold text-green-700 mb-4">Monetize Your Network by Promoting Excellence</h2>
                        <p className="text-base sm:text-lg leading-relaxed mb-4">
                            At {companyName}, we believe in the transformative power of ClientWise for insurance professionals. Our Sales Partnership Program is designed for individuals and entities who share this belief and have a network within the Indian insurance community.
                        </p>
                        <p className="text-base sm:text-lg leading-relaxed mb-6">
                            This is your opportunity to not only advocate for a solution that genuinely helps agents streamline their workflow and grow their business but also to generate a sustainable income stream through generous referral commissions.
                        </p>

                        <h3 className="text-xl font-semibold text-green-700 mt-8 mb-4">How the Sales Partnership Works:</h3>
                        <ul className="space-y-4">
                            {programSteps.map(step => (
                                <li key={step.title} className="flex items-start">
                                    <i className={`${step.icon} text-green-600 mt-1 mr-3 fa-fw text-lg`}></i>
                                    <div>
                                        <strong className="text-gray-800">{step.title}</strong>
                                        <p className="text-sm text-gray-600 leading-normal">{step.text}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                            <h4 className="text-lg font-semibold text-green-700 mb-2">Who is an Ideal Sales Partner?</h4>
                            <p className="text-sm text-gray-600">
                                Our program is a perfect fit if you are:
                            </p>
                            <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1 pl-2">
                                <li>An insurance trainer or mentor guiding new and existing agents.</li>
                                <li>A financial advisor or consultant with a network of insurance professionals.</li>
                                <li>An influencer or blogger focusing on the insurance or fintech space in India.</li>
                                <li>A community leader or association head within the insurance sector.</li>
                                <li>Anyone passionate about helping insurance agents succeed with technology.</li>
                            </ul>
                             <p className="text-sm text-gray-600 mt-3">
                                If you can connect us with agents who are looking for a top-tier CRM solution, we want to partner with you!
                            </p>
                        </div>
                         <p className="mt-8 text-base sm:text-lg">
                            Join us in empowering India's insurance agents. By becoming a ClientWise Sales Partner, you contribute to their success and share in ours.
                        </p>
                    </div>

                    {/* Right Column: Register Interest Form */}
                    {/* Added id="sales-partner-form" for banner link */}
                    <div id="sales-partner-form" className="md:col-span-2 bg-green-50 p-4 sm:p-6 rounded-lg border border-green-200 shadow-lg sticky top-24">
                        <div className="text-center mb-4 sm:mb-6">
                            <i className="fas fa-handshake text-4xl sm:text-5xl text-green-500 mb-3"></i>
                            <h3 className="text-xl sm:text-2xl font-semibold text-green-800">
                                {isSubmitted ? "Interest Registered!" : "Become a Sales Partner"}
                            </h3>
                        </div>

                        {isSubmitted ? (
                            <div className="text-center py-4">
                                <p className="text-green-700 bg-green-100 p-3 sm:p-4 rounded-md text-sm sm:text-base mb-4">
                                    Thank you for expressing your interest! We've received your details. We'll notify you with full program details and next steps when we officially launch.
                                </p>
                                <Button 
                                    variant="secondary" // You might need to define this variant in your Button component
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700" // Example styling for secondary
                                    size="sm" 
                                    onClick={() => {setIsSubmitted(false); setFormData({ fullName: '', email: '', networkDescription: '' });}}
                                >
                                    Register Another Interest
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <p className="text-xs sm:text-sm text-gray-600 text-center mb-4">
                                    The full program is launching soon. Register your interest below to be among the first to get notified and receive detailed information.
                                </p>
                                <FormInput
                                    id="fullName"
                                    label="Full Name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Your Full Name"
                                    required
                                    iconClass="fas fa-user"
                                />
                                <FormInput
                                    id="email"
                                    label="Email Address"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                    iconClass="fas fa-envelope"
                                />
                                <FormTextarea
                                    id="networkDescription"
                                    label="Tell Us About Your Network (Optional)"
                                    value={formData.networkDescription}
                                    onChange={handleChange}
                                    placeholder="Briefly describe your connection to insurance agents or your reach."
                                    rows={3}
                                />
                                {submitError && <p className="text-xs text-red-600 bg-red-50 p-2 rounded-md">{submitError}</p>}
                                <Button
                                    variant="brand" // Assuming 'brand' variant in your Button component uses appropriate green
                                    className="w-full flex justify-center items-center bg-green-600 hover:bg-green-700 focus:ring-green-500" // Explicit green styling
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
                                            Submitting...
                                        </>
                                    ) : (
                                        "Register Interest Now"
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

export default SalesPartnershipPage;
