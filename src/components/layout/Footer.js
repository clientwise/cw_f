import React from 'react';
// Removed Link import as we are using standard <a> tags for new tab functionality
// import { Link } from 'react-router-dom';

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e' };

const Footer = () => (
    <footer className="bg-gray-800 text-gray-300 py-12" style={{background: themeColors.brandPurple}}> {/* Applied themeColor */}
    <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* About Column */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">ClientWise</h3>
                <p className="text-sm mb-4">The modern CRM for ambitious insurance agents in India.</p>
                <p className="text-xs mb-4">&copy; {new Date().getFullYear()} 18Novem Technologies. All rights reserved.</p>
                <p className="text-xs mb-4">
                    Reach us at: <a href="mailto:support@goclientwise.com" className="hover:text-white underline">support@goclientwise.com</a>
                </p>
                <p className="text-xs">
                    Address: 1413, Ocus Quantum, Sector 51, Gurugram (Haryana), 122003 INDIA
                </p>
            </div>

            {/* Quick Links Column 1 */}
            <div>
                <h4 className="font-semibold text-white mb-3">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                    <li><a href="/about-us" target="_blank" rel="noopener noreferrer" className="hover:text-white">About Us</a></li>
                    <li><a href="/why-clientwise" target="_blank" rel="noopener noreferrer" className="hover:text-white">Why ClientWise?</a></li>
                    <li><a href="/pricing" target="_blank" rel="noopener noreferrer" className="hover:text-white">Pricing</a></li>
                    <li><a href="/blog" target="_blank" rel="noopener noreferrer" className="hover:text-white">Blog</a></li>
                </ul>
            </div>

            {/* Quick Links Column 2 */}
            <div>
                <h4 className="font-semibold text-white mb-3">Explore</h4> {/* Changed title for differentiation */}
                <ul className="space-y-2 text-sm">
                    <li><a href="/features" target="_blank" rel="noopener noreferrer" className="hover:text-white">Features</a></li>
                    <li><a href="/for-agents" target="_blank" rel="noopener noreferrer" className="hover:text-white">How It Works (Agents)</a></li>
                    <li><a href="/for-agencies" target="_blank" rel="noopener noreferrer" className="hover:text-white">How It Works (Agencies)</a></li>
                </ul>
            </div>

            {/* Partnership Links */}
            <div>
                <h4 className="font-semibold text-white mb-3">Partnerships</h4>
                <ul className="space-y-2 text-sm">
                    <li><a href="/partners/agencies" target="_blank" rel="noopener noreferrer" className="hover:text-white">Agency Program</a></li>
                    <li><a href="/partners/sales" target="_blank" rel="noopener noreferrer" className="hover:text-white">Sales Partner Program</a></li>
                    <li><a href="/partners/insurers" target="_blank" rel="noopener noreferrer" className="hover:text-white">Insurer Program</a></li>
                </ul>
            </div>

            {/* Legal Links & Social */}
            <div>
                <h4 className="font-semibold text-white mb-3">Legal & Connect</h4> {/* Changed title */}
                <ul className="space-y-2 text-sm">
                    <li><a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer" className="hover:text-white">Terms & Conditions</a></li>
                    <li><a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-white">Privacy Policy</a></li>
                    <li><a href="/disclaimer" target="_blank" rel="noopener noreferrer" className="hover:text-white">Disclaimer</a></li>
                    <li>
                        <a href="https://www.linkedin.com/company/18novem/" target="_blank" rel="noopener noreferrer" className="hover:text-white flex items-center"> {/* Corrected href, added rel, made it more descriptive */}
                            <i className="fab fa-linkedin mr-2"></i> LinkedIn {/* Assuming Font Awesome is available */}
                        </a>
                    </li>
                    <li className="flex items-center">
                        <i className="fas fa-heart mr-2" style={{color: '#ff0040'}}></i>Made in India
                    </li>
                </ul>
            </div>
        </div>
        {/* Optional: Add a small centered line for social media icons if you have more */}
        {/* <div className="text-center mt-8 pt-8 border-t border-gray-700">
            <p className="text-sm">Follow us on:</p>
            <div className="flex justify-center space-x-4 mt-2">
                <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-white"><i className="fab fa-facebook-f"></i></a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-white"><i className="fab fa-twitter"></i></a>
                <a href="https://www.linkedin.com/company/18novem/" target="_blank" rel="noopener noreferrer" className="hover:text-white"><i className="fab fa-linkedin-in"></i></a>
            </div>
        </div> */}
    </div>
</footer>
);

export default Footer;
