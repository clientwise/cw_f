import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const PrivacyPolicyPage = () => {
    const companyName = "18Novem Technologies";
    const websiteUrl = "https://www.goclientwise.com"; // Replace with your actual website URL
    const lastUpdatedDate = "May 10, 2025"; // Update as needed

    return (
        <div>
            <Header />
            <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-white p-8 sm:p-10  rounded-lg">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">Privacy Policy</h1>

                    <div className="prose prose-indigo max-w-none text-gray-700">
                        <p className="text-sm text-gray-600">Last Updated: {lastUpdatedDate}</p>

                        <p>{companyName} ("us", "we", or "our") operates the ClientWise website (<a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{websiteUrl}</a>) and the ClientWise CRM software (collectively, the "Service").</p>
                        <p>This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data. We are committed to protecting your privacy and ensuring the security of your personal information and the data you entrust to our Service.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-3">1. Information Collection and Use</h2>
                        <p>We collect several different types of information for various purposes to provide and improve our Service to you. All user-generated data within the ClientWise platform is considered private and confidential.</p>
                        
                        <h3 className="text-lg font-medium mt-4 mb-2">Types of Data Collected</h3>
                        
                        <h4 className="text-md font-medium mt-3 mb-1">Personal Data</h4>
                        <p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Email address</li>
                            <li>First name and last name</li>
                            <li>Phone number</li>
                            <li>Agency name and address (if applicable)</li>
                            <li>Billing information for subscription services</li>
                        </ul>
                        <p>As a CRM, the Service is designed for you (the insurance agent/agency) to input information about your clients ("Client Data"). This Client Data is uploaded and managed by you, and its contents are determined by you. This may include names, contact details, policy information, and notes related to your clients.</p>

                        <h4 className="text-md font-medium mt-3 mb-1">Usage Data</h4>
                        <p>We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data. This data helps us understand how our Service is being used and how to improve it.</p>

                        <h4 className="text-md font-medium mt-3 mb-1">Tracking & Cookies Data</h4>
                        <p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-3">2. Use of Data</h2>
                        <p>{companyName} uses the collected data for various purposes:</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>To provide, operate, and maintain the Service, including its AI-powered features.</li>
                            <li>To manage your account and your access to the Service.</li>
                            <li>To notify you about changes to our Service, including updates and new features.</li>
                            <li>To allow you to participate in interactive features of our Service when you choose to do so.</li>
                            <li>To provide customer care and support.</li>
                            <li>To gather analysis or valuable information so that we can improve the Service, its performance, and user experience.</li>
                            <li>To monitor the usage of the Service to ensure stability and security.</li>
                            <li>To detect, prevent, and address technical issues.</li>
                            <li>To fulfill any legal or regulatory obligations.</li>
                        </ul>
                        <p><strong>Crucially, we DO NOT sell any of your Personal Data or Client Data to any third party.</strong> We do not use the personal information contained within your Client Data for any purpose other than providing and improving the Service as described, or for any additional business activities unrelated to the core CRM functionality provided to you.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-3">3. Data Storage, Security, and Retention</h2>
                        <p><strong>Data Storage:</strong> All Personal Data and Client Data you input into the Service are stored on secure servers located within India. We utilize reputable cloud service providers that adhere to high security standards.</p>
                        <p><strong>Data Security:</strong> The security of your data is important to us. We implement a variety of security measures (including encryption, access controls, and regular security assessments) to maintain the safety of your Personal Data and Client Data when you enter, submit, or access your information. However, remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your data, we cannot guarantee its absolute security.</p>
                        <p><strong>Data Retention:</strong> We will retain your Personal Data and Client Data only for as long as is necessary for the purposes set out in this Privacy Policy, or as required to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies. Usage Data is generally retained for a shorter period, except when this data is used to strengthen the security or to improve the functionality of our Service, or we are legally obligated to retain this data for longer time periods.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-3">4. Disclosure Of Data</h2>
                        <p>We are committed to maintaining the privacy of your data. {companyName} will not disclose your Personal Data or Client Data to third parties except in the limited circumstances described below:</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li><strong>With Your Consent or at Your Direction:</strong> We may share data if you explicitly direct us to do so (e.g., integrating with a third-party service you authorize).</li>
                            <li><strong>Service Providers (including AI Services):</strong> We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), provide the Service on our behalf, perform Service-related services, or assist us in analyzing how our Service is used.
                                <ul className="list-circle pl-5 mt-1 space-y-1">
                                    <li>These third parties have access to your Personal Data and/or Client Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</li>
                                    <li>Specifically for AI-powered features, Client Data is processed by AI Services. Currently, we utilize <strong>Google AI services</strong> for these features. Data shared with Google AI services is governed by their respective privacy policies and terms, and we take measures to ensure such processing aligns with our privacy commitments. We do not permit these AI services to use your data to train their general models beyond the scope necessary for providing the service to you, nor for their own independent commercial purposes.</li>
                                </ul>
                            </li>
                            <li><strong>Legal Requirements:</strong> {companyName} may disclose your Personal Data or Client Data if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency). This includes situations where disclosure is necessary to:
                                <ul className="list-circle pl-5 mt-1 space-y-1">
                                    <li>Comply with a legal obligation.</li>
                                    <li>Protect and defend the rights or property of {companyName}.</li>
                                    <li>Prevent or investigate possible wrongdoing in connection with the Service.</li>
                                    <li>Protect the personal safety of users of the Service or the public.</li>
                                    <li>Protect against legal liability.</li>
                                </ul>
                            </li>
                            <li><strong>Business Transfers:</strong> If {companyName} is involved in a merger, acquisition, or asset sale, your Personal Data and Client Data may be transferred. We will provide notice before your data is transferred and becomes subject to a different privacy policy.</li>
                            <li><strong>No Sale of Data:</strong> We reiterate that <strong>we do not sell your Personal Data or Client Data to any third parties.</strong></li>
                            <li><strong>No Sharing with Competitors:</strong> We will not share your Client Data with other companies in similar businesses or competing CRM providers, unless:
                                <ul className="list-circle pl-5 mt-1 space-y-1">
                                    <li>You, as an agent, are part of an agency that has a direct contractual relationship with such a company, and data sharing is explicitly authorized under that agency's agreement with us and with you.</li>
                                    <li>Such disclosure is legally required as outlined above.</li>
                                </ul>
                            </li>
                        </ul>

                        <h2 className="text-xl font-semibold mt-6 mb-3">5. Your Data Protection Rights</h2>
                        <p>{companyName} aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data. Depending on your location and applicable laws, you may have the following data protection rights:</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li><strong>The right to access, update or delete</strong> the information we have on you. Whenever made possible, you can access, update or request deletion of your Personal Data directly within your account settings section. If you are unable to perform these actions yourself, please contact us to assist you.</li>
                            <li><strong>The right of rectification.</strong> You have the right to have your information rectified if that information is inaccurate or incomplete.</li>
                            <li><strong>The right to object.</strong> You have the right to object to our processing of your Personal Data in certain circumstances.</li>
                            <li><strong>The right of restriction.</strong> You have the right to request that we restrict the processing of your personal information.</li>
                            <li><strong>The right to data portability.</strong> You have the right to be provided with a copy of the information we have on you in a structured, machine-readable and commonly used format (for your Client Data, export functionalities may be available within the Service).</li>
                            <li><strong>The right to withdraw consent.</strong> You also have the right to withdraw your consent at any time where {companyName} relied on your consent to process your personal information.</li>
                        </ul>
                        <p>Please note that we may ask you to verify your identity before responding to such requests. Exercising these rights is free of charge, but we may charge a reasonable fee if your request is manifestly unfounded, repetitive, or excessive.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-3">6. Service Providers (Recap)</h2>
                        <p>As mentioned, we may employ third-party companies and individuals to facilitate our Service. These include hosting providers, payment processors (if applicable), analytics providers, and AI service providers (specifically Google AI services). These third parties are bound by contractual obligations to keep information confidential and use it only for the purposes for which we disclose it to them.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-3">7. Children's Privacy</h2>
                        <p>Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Child has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-3">8. Changes To This Privacy Policy</h2>
                        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-3">9. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact our Data Protection Officer at:</p>
                        <ul className="list-none pl-0 space-y-1 text-sm">
                            <li>By email: <a href="mailto:18novem1987@gmail.com
" className="text-indigo-600 hover:underline">18novem1987@gmail.com
</a> or <a href="mailto:support@goclientwise.com" className="text-indigo-600 hover:underline">support@goclientwise.com</a></li>
                            <li>By visiting this page on our website: <a href={`${websiteUrl}/contact-us`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{websiteUrl}/contact-us</a></li>
                        </ul>
                    </div>

                    <div className="mt-10 text-center">
                        <Link to="/" className="text-indigo-600 hover:text-indigo-800 text-sm">
                            &larr; Back to Home
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PrivacyPolicyPage;
