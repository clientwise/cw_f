import React from 'react';
import { Link } from 'react-router-dom'; // For linking back
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';


const TermsPage = () => {
    const companyName = "18Novem Technologies"; // Use the registered entity name
    const websiteUrl = "https://www.goclientwise.com"; // Replace with your actual website URL

    return (
        <div>
            <Header />
            <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-white p-8 sm:p-10  rounded-lg">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">Terms and Conditions</h1>

                    <div className="prose prose-indigo max-w-none text-gray-700">
                        <p className="text-sm text-gray-600">Last Updated: May 10, 2025</p>

                        <p>Welcome to ClientWise! These terms and conditions ("Terms") outline the rules and regulations for the use of {companyName}'s website, located at <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{websiteUrl}</a>, and its CRM software, ClientWise (collectively referred to as the "Service"). {companyName} is a software company providing Customer Relationship Management (CRM) and agency management solutions designed for insurance agents and agencies in India.</p>

                        <p>By accessing this website and using our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree with any part of these terms and conditions, you must not use our Service.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-3">1. Definitions</h2>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li><strong>"ClientWise," "Service," "Software"</strong> refers to the CRM and agency management software, website, and any related services provided by {companyName}, including any features powered by artificial intelligence.</li>
                            <li><strong>"Company," "We," "Us," "Our"</strong> refers to {companyName}.</li>
                            <li><strong>"User," "You," "Your"</strong> refers to the individual agent, agency, or entity accessing or using the Service.</li>
                            <li><strong>"Client Data"</strong> refers to any information, data, content, or materials uploaded or entered into the Software by You or on Your behalf, relating to your clients or insurance policies.</li>
                            <li><strong>"Account"</strong> refers to the User's registered account to access and use the Service.</li>
                            <li><strong>"AI Services"</strong> refers to proprietary artificial intelligence technologies developed by {companyName} or third-party artificial intelligence services integrated into the Service.</li>
                        </ul>

                        <h2 className="text-xl font-semibold mt-6 mb-3">2. Service Description & Scope</h2>
                        <p>ClientWise provides a platform for insurance agents and agencies to manage client relationships, policies, commissions, tasks, and communications. The Service includes features that may utilize AI Services to provide insights, suggestions, or automate certain tasks. The Service is a tool to aid in the organization and management of an insurance agency's operations.</p>
                        <p><strong>Important Clarification:</strong> {companyName} is a technology provider. We do not sell insurance policies, nor do we act as an insurance intermediary, broker, or agent. The Service is not intended to solicit or procure insurance business. Consequently, {companyName} does not hold and is not required to hold any license from the Insurance Regulatory and Development Authority of India (IRDAI) for providing the Service.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-3">3. License to Use</h2>
                        <p>Subject to your compliance with these Terms, {companyName} grants you a limited, non-exclusive, non-transferable, non-sublicensable license to access and use the Service for your internal business purposes as an insurance agent or agency.</p>
                        <p>You must not:</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Republish material from the Service (unless it is your own Client Data).</li>
                            <li>Sell, rent, or sub-license material or access to the Service.</li>
                            <li>Reproduce, duplicate, or copy material from the Service for purposes other than your internal business use as permitted.</li>
                            <li>Redistribute content from the Service (other than your Client Data as necessary for your business operations).</li>
                            <li>Reverse engineer, decompile, or disassemble any aspect of the Software, including any AI models or algorithms.</li>
                        </ul>

                        <h2 className="text-xl font-semibold mt-6 mb-3">4. User Accounts</h2>
                        <p>To use the Service, you must register for an Account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all activities that occur under your Account. You agree to notify us immediately of any unauthorized use of your Account.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-3">5. Fees and Payments</h2>
                        <p>Access to certain features of the Service may be subject to subscription fees. All applicable fees will be clearly outlined on our pricing page or in a separate agreement. Current pricing involves a free trial for 1 month (up to 20 clients), followed by a Pro Plan at ₹1500 for 3 months, granting access to all features including AI products. {companyName} reserves the right to change its fees upon reasonable notice. Payments are due as per the selected subscription plan. Failure to pay fees may result in suspension or termination of your access to the Service.</p>
                        <p className="text-sm">Refunds, if any, will be processed according to the refund policy stated on our website at the time of purchase or as otherwise agreed in writing.</p>


                        <h2 className="text-xl font-semibold mt-6 mb-3">6. Client Data and Responsibility</h2>
                        <p><strong>Data Storage:</strong> All Client Data you input into the Service is stored on secure servers located within India.</p>
                        <p><strong>Data Accuracy and Ownership:</strong> You retain all ownership rights to your Client Data. You are solely responsible for the accuracy, quality, integrity, legality, reliability, and appropriateness of all Client Data you input into the Service. {companyName} does not verify, endorse, or take responsibility for any Client Data.</p>
                        <p><strong>Data Backup:</strong> While {companyName} implements regular data backup procedures, you are encouraged to maintain your own backups of your Client Data. {companyName} shall not be liable for any loss or corruption of Client Data.</p>
                        <p><strong>Use of AI Services and Data Sharing:</strong> To provide and enhance certain features of the Service, including but not limited to AI-powered insights, recommendations, and automation, {companyName} utilizes its proprietary AI Services and/or integrates with third-party AI Services. By using the Service, you acknowledge and agree that Client Data you provide may be processed by these AI Services. This processing is essential for the functionality of such features and for the maintenance and improvement of the platform. We take measures to ensure that any third-party AI Services we use adhere to strict data privacy and security standards. For more information on how your data is handled by third-party services, please refer to our Privacy Policy.</p>


                        <h2 className="text-xl font-semibold mt-6 mb-3">7. Disclaimer of Warranties</h2>
                        <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, ACCURACY, RELIABILITY, OR UPTIME. {companyName} DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.</p>
                        <p>YOU ACKNOWLEDGE THAT THE ACCURACY, COMPLETENESS, AND UTILITY OF ANY INFORMATION OR INSIGHTS DERIVED FROM THE SERVICE, INCLUDING THOSE GENERATED BY AI SERVICES, DEPEND SIGNIFICANTLY ON THE ACCURACY AND COMPLETENESS OF THE CLIENT DATA YOU PROVIDE. {companyName} IS NOT RESPONSIBLE FOR ANY DECISIONS OR ACTIONS TAKEN BASED ON INFORMATION PROVIDED BY THE SERVICE. ALL AI-GENERATED CONTENT OR SUGGESTIONS SHOULD BE REVIEWED BY YOU FOR ACCURACY AND APPROPRIATENESS BEFORE USE.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-3">8. Limitation of Liability</h2>
                        <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL {companyName}, ITS AFFILIATES, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO THE USE OF, OR INABILITY TO USE, THE SERVICE.</p>
                        <p>THIS LIMITATION APPLIES WHETHER THE ALLEGED LIABILITY IS BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT LIABILITY, OR ANY OTHER BASIS, EVEN IF {companyName} HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. SPECIFICALLY, {companyName} SHALL NOT BE LIABLE UNDER ANY CIRCUMSTANCES FOR:</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>ANY LOSS, CORRUPTION, OR UNAUTHORIZED ACCESS/DISCLOSURE OF YOUR CLIENT DATA, INCLUDING IN CONNECTION WITH THE USE OF AI SERVICES.</li>
                            <li>ANY FRAUDULENT ACTIVITY OR MISREPRESENTATION CONDUCTED BY ANY USER OF THE SERVICE.</li>
                            <li>ANY ERRORS OR OMISSIONS IN THE SERVICE OR ANY INFORMATION OBTAINED THROUGH THE SERVICE (INCLUDING AI-GENERATED CONTENT).</li>
                            <li>ANY INTERRUPTION OR CESSATION OF THE SERVICE.</li>
                            <li>ANY DAMAGES RESULTING FROM YOUR RELIANCE ON THE ACCURACY OR COMPLETENESS OF DATA ENTERED BY YOU OR OTHER USERS, OR ON SUGGESTIONS PROVIDED BY AI SERVICES.</li>
                        </ul>
                        <p>NOTWITHSTANDING THE FOREGOING, IF {companyName} IS FOUND TO BE LIABLE, OUR TOTAL AGGREGATE LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THE SERVICE OR THESE TERMS SHALL NOT EXCEED THE TOTAL AMOUNT OF FEES PAID BY YOU TO {companyName} FOR THE SERVICE DURING THE THREE (3) MONTH PERIOD IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM.</p>


                        <h2 className="text-xl font-semibold mt-6 mb-3">9. Indemnification</h2>
                        <p>You agree to defend, indemnify, and hold harmless {companyName}, its affiliates, officers, directors, employees, and agents from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees) arising from: (i) your use of and access to the Service, including your use of any AI Services; (ii) your violation of any term of these Terms; (iii) your violation of any third-party right, including without limitation any copyright, property, or privacy right; or (iv) any claim that your Client Data caused damage to a third party. This defense and indemnification obligation will survive these Terms and your use of the Service.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-3">10. Governing Law & Jurisdiction</h2>
                        <p>These Terms will be governed by and interpreted in accordance with the laws of India, without regard to its conflict of law provisions. You agree to submit to the exclusive jurisdiction of the courts located in Mumbai, Maharashtra, India for the resolution of any disputes arising out of or relating to these Terms or the Service.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-3">11. Changes to Terms</h2>
                        <p>{companyName} reserves the right, at its sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms.</p>
                        
                        <h2 className="text-xl font-semibold mt-6 mb-3">12. Termination</h2>
                        <p>{companyName} may terminate or suspend your Account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including but not limited to a breach of these Terms.</p>
                        <p>Upon termination, your right to use the Service will immediately cease. If you wish to terminate your Account, you may simply discontinue using the Service or contact us for account deletion. Provisions of these Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-3">13. Severability</h2>
                        <p>If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-3">14. Entire Agreement</h2>
                        <p>These Terms constitute the entire agreement between you and {companyName} concerning your use of the Service and supersede all prior and contemporaneous agreements, proposals, or representations, written or oral, concerning its subject matter.</p>

                        <h2 className="text-xl font-semibold mt-6 mb-3">15. Contact Information</h2>
                        <p>If you have any questions about these Terms, please contact us at: <a href="mailto:support@goclientwise.com" className="text-indigo-600 hover:underline">support@goclientwise.com</a> or 18novem1987@gmail.com
.</p>

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

export default TermsPage;
