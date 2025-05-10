import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const AboutUsPage = () => {
    const companyName = "18Novem Technologies";
    const founderName = "Amit Choudhary";

    return (
        <div className="">
            <Header />
            <div className='min-h-screen bg-white-50 py-16 px-4 sm:px-6 lg:px-8'>
                <div className="max-w-4xl mx-auto bg-white p-10  rounded-lg">
                    {/* Optional: General placeholder image for the page/product */}
                    <div className="mb-10" style={{    textAlign:  "-webkit-center"}}>
                        <img
                            src="https://storage.googleapis.com/policy-agency-documents/logo1.png"
                            alt="ClientWise CRM Solution"
                            className="w-full h-auto rounded-lg shadow-md object-cover" style={{width: "50%"}}
                        />
                    </div>

                    <h1 className="text-4xl font-bold text-center text-indigo-700 mb-10">About Us</h1>

                    <div className="prose prose-indigo max-w-none text-gray-700 space-y-8">
                        <p className="text-lg leading-relaxed">
                            ClientWise, a flagship product from <strong>{companyName}</strong>, is a state-of-the-art Customer Relationship Management (CRM) solution meticulously engineered for the unique and dynamic needs of insurance agents, advisors, and agencies across India. We recognize the multifaceted challenges you navigate daily – from cultivating and maintaining strong client relationships, diligently tracking numerous policies and their critical dates, to accurately calculating commissions, ensuring unwavering regulatory compliance, and strategically growing your business in a competitive landscape. ClientWise is built to be your trusted partner in overcoming these hurdles with ease and efficiency.
                        </p>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Our Mission</h2>
                            <p>
                                Our core mission is to empower every insurance professional in India with intuitive, intelligent, and highly efficient digital tools. We aim to fundamentally streamline your workflows, significantly enhance client engagement through personalized interactions, and ultimately drive sustainable business growth. We aspire to be the undisputed technology partner of choice for agents nationwide, equipping them with the capabilities to thrive and succeed in an increasingly digital-first world.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Meet Our Leadership & Team</h2>
                            <p className="mb-6">
                                ClientWise is driven by a passionate team of technologists and insurance industry enthusiasts dedicated to creating solutions that make a real difference. We are a part of <strong>{companyName}</strong>, a company committed to innovation and excellence.
                            </p>

                            {/* Founder and Director Section with Image */}
                            <div className="bg-indigo-50 p-6 rounded-lg shadow-md mb-8 flex flex-col sm:flex-row items-center sm:items-start">
                                <img
                                    src="https://media.licdn.com/dms/image/v2/D4D03AQFHKQfnCREDZw/profile-displayphoto-shrink_800_800/B4DZYjB1t0G4Ac-/0/1744344410435?e=1752105600&v=beta&t=rjGIk0Gm88gZpLBbq94qhjzXV-59t15Gx8VT4Pcmtu4"
                                    alt={founderName}
                                    className="w-32 h-32 rounded-full shadow-lg mb-4 sm:mb-0 sm:mr-6 object-cover flex-shrink-0"
                                />
                                <div className="text-center sm:text-left">
                                    <h3 className="text-xl font-semibold text-indigo-700 mb-1">{founderName}</h3>
                                    <p className="text-md font-medium text-gray-600 mb-2">Founder and Director</p>
                                    <p className="text-gray-700">
                                        {/* Placeholder for Amit Chowdharry's bio */}
                                        Amit brings 20+ years of experience in relevant fields like technology, insurance, or entrepreneurship. Previosuly, Amit was the Head of Design for Rapipay, and has worked with companies like Ernest  & Young, HT Media, NDTV, CarDekho etc. His vision for ClientWise stems from a deep understanding of the challenges faced by insurance professionals and a passion for leveraging technology to solve real-world problems.
                                    </p>
                                    <p className="text-xs font-semibold text-indigo-700 mb-1 mt-2"> <a href="https://www.linkedin.com/in/amitchoudhary18november/" target="_blank" rel="noopener noreferrer">View LinkedIn Profile</a></p>
                                </div>
                            </div>

                            <div className="space-y-4 ">
                                <h3 className="text-xl font-semibold text-gray-800 mb-2"> Team</h3>
                                {/* Optional: Placeholder image for the team */}
                                <img
                                    src="https://img.freepik.com/free-photo/group-people-working-out-business-plan-office_1303-15872.jpg?t=st=1746864742~exp=1746868342~hmac=70f16a52d2f24452a00660f9710d4de6c482c7e2e0e3ee77fd1031be2f7e975c&w=1380"
                                    alt="ClientWise Team"
                                    className="w-full h-auto rounded-lg shadow-sm mb-4 object-cover" style={{width: "50%"}}
                                />
                                <p className="text-gray-600">
                                    Our dedicated team includes experienced software developers, UI/UX designers, quality assurance specialists, and customer support professionals. While we are growing, our current key members focus on:
                                </p>
                                <ul className="list-disc space-y-2 pl-5 text-gray-600">
                                    <li><strong>Lead Development:</strong> Spearheading the technical architecture and development of ClientWise with cutting-edge technologies.</li>
                                    <li><strong>Product Management:</strong> Ensuring ClientWise evolves with user needs and market trends, translating user feedback into actionable features.</li>
                                    <li><strong>Customer Success & Support:</strong> Dedicated to providing exceptional onboarding, training, and ongoing support to ensure our users maximize the benefits of ClientWise.</li>
                                    <li><strong>Marketing & Business Development:</strong> Spreading the word about ClientWise and building strong partnerships within the insurance ecosystem.</li>
                                </ul>
                                <p className="mt-2 text-gray-600">
                                    Together, we blend technological expertise with a keen understanding of the insurance domain to deliver a product that is not only powerful but also user-friendly and perfectly aligned with the needs of agents in India.
                                </p>
                                {/* You could also add individual placeholders for team members if desired:
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="text-center">
                                            <img src={`https://via.placeholder.com/120.png?text=Team+Member+${i}`} alt={`Team Member ${i}`} className="w-24 h-24 rounded-full mx-auto mb-2 shadow-md object-cover" />
                                            <h4 className="font-semibold text-gray-700">Team Member {i}</h4>
                                            <p className="text-sm text-gray-500">Role/Specialty</p>
                                        </div>
                                    ))}
                                </div>
                                */}
                            </div>
                        </section>
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Our Vision</h2>
                            <p>
                                We envision a future where every insurance agent in India can leverage the power of technology to build more meaningful client relationships and achieve unprecedented levels of productivity and success. ClientWise aims to be at forefront of this transformation, continuously innovating and adapting to the evolving needs of the industry.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Offer: Key Features & Benefits</h2>
                            <p className="mb-4">
                                ClientWise provides a comprehensive suite of features designed to manage every aspect of your insurance business:
                            </p>
                            <ul className="list-disc space-y-3 pl-5">
                                <li>
                                    <strong>Intuitive Client Relationship Management:</strong> Effortlessly manage client data, interactions, and history in one centralized platform for a 360-degree view of your clients.
                                </li>
                                <li>
                                    <strong>Advanced Policy Tracking and Renewal Reminders:</strong> Never miss a renewal. Get automated alerts for upcoming policy expirations and critical dates, ensuring timely client service.
                                </li>
                                <li>
                                    <strong>Automated Commission Calculation and Statements:</strong> Simplify complex commission structures with accurate, automated calculations and generate detailed statements with ease.
                                </li>
                                <li>
                                    <strong>AI-Powered Insights and Recommendations (Coming Soon!):</strong> Leverage the power of Artificial Intelligence for predictive insights, sales recommendations, and identifying cross-selling or up-selling opportunities.
                                </li>
                                <li>
                                    <strong>Targeted Marketing Automation Tools:</strong> Design and execute effective marketing campaigns, send personalized communications, and nurture leads efficiently.
                                </li>
                                <li>
                                    <strong>Secure Document Management:</strong> Store and manage all client-related documents securely in a centralized, easily accessible repository, ensuring compliance and quick retrieval.
                                </li>
                                <li>
                                    <strong>Comprehensive Activity Logging and Task Management:</strong> Keep track of all communications, schedule follow-ups, and manage your daily tasks effectively to boost productivity.
                                </li>
                                <li>
                                    <strong>Robust Reporting and Analytics:</strong> Gain valuable insights into your business performance, client trends, and sales pipeline with customizable reports.
                                </li>
                                <li>
                                    <strong>Mobile Accessibility:</strong> Access your CRM on the go, ensuring you have critical information at your fingertips anytime, anywhere (Specify if this is a current or future feature).
                                </li>
                            </ul>
                        </section>

                        

                        

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Why Choose ClientWise?</h2>
                             <ul className="list-disc space-y-2 pl-5 text-gray-700">
                                <li><strong>Tailored for India:</strong> Designed from the ground up with the specific workflows, regulations, and market dynamics of the Indian insurance sector in mind.</li>
                                <li><strong>User-Centric Design:</strong> An intuitive and easy-to-navigate interface that requires minimal training, allowing you to focus on your clients, not on learning complex software.</li>
                                <li><strong>Comprehensive Solution:</strong> From client management and policy tracking to commission calculation and marketing, ClientWise offers an all-in-one platform.</li>
                                <li><strong>Future-Ready:</strong> With upcoming AI-powered features and a commitment to continuous updates, ClientWise is built to grow with your business.</li>
                                <li><strong>Dedicated Support:</strong> Our Mumbai-based team is here to provide timely and helpful support whenever you need it.</li>
                                <li><strong>Secure & Reliable:</strong> We prioritize the security of your data with robust measures and reliable infrastructure.</li>
                            </ul>
                        </section>

                    </div>

                    <div className="mt-12 text-center">
                        <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium text-md">
                            &larr; Back to Home
                        </Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AboutUsPage;