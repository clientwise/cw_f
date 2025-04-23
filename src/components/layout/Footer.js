import React from 'react';

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e' };

const Footer = () => (
     <footer className="bg-gray-100 text-gray-600 pt-16 pb-8">
        <div className="container mx-auto px-6">
            {/* Footer Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-8 mb-12">
                {/* Column 1: About Us */}
                <div>
                    <h5 className="mb-3 text-sm font-semibold text-gray-700">About Us</h5>
                    <a href="https://www.goclientwise.com"  className="block mb-1.5 text-sm text-gray-600 hover:text-[--brand-purple]">Mission</a>
                    <a href="https://www.goclientwise.com"  className="block mb-1.5 text-sm text-gray-600 hover:text-[--brand-purple]">Team</a>
                    <a href="https://www.goclientwise.com"  className="block mb-1.5 text-sm text-gray-600 hover:text-[--brand-purple]">Why ClientWise</a>
                </div>
                {/* Column 2: AI Topics */}
                <div>
                    <h5 className="mb-3 text-sm font-semibold text-gray-700">AI Topics</h5>
                    <a href="https://www.goclientwise.com"  className="block mb-1.5 text-sm text-gray-600 hover:text-[--brand-purple]">Policy Summary</a>
                    <a href="https://www.goclientwise.com"  className="block mb-1.5 text-sm text-gray-600 hover:text-[--brand-purple]">Policy Recommendation</a>
                    <a href="https://www.goclientwise.com"  className="block mb-1.5 text-sm text-gray-600 hover:text-[--brand-purple]">AI Chatbot</a>
                </div>
                {/* Column 3: Blogs */}
                <div>
                    <h5 className="mb-3 text-sm font-semibold text-gray-700">Blogs</h5>
                    <a href="https://www.goclientwise.com"  className="block mb-1.5 text-sm text-gray-600 hover:text-[--brand-purple]">Agents</a>
                    <a href="https://www.goclientwise.com"  className="block mb-1.5 text-sm text-gray-600 hover:text-[--brand-purple]">Agencies</a>
                    <a href="https://www.goclientwise.com"  className="block mb-1.5 text-sm text-gray-600 hover:text-[--brand-purple]">Test Series</a>
                    <a href="https://www.goclientwise.com"  className="block mb-1.5 text-sm text-gray-600 hover:text-[--brand-purple]">Media</a>
                </div>
                {/* Column 4: Partner with Us */}
                <div>
                    <h5 className="mb-3 text-sm font-semibold text-gray-700">Partner with Us</h5>
                    <a href="https://www.goclientwise.com"  className="block mb-1.5 text-sm text-gray-600 hover:text-[--brand-purple]">Agencies</a>
                    <a href="https://www.goclientwise.com"  className="block mb-1.5 text-sm text-gray-600 hover:text-[--brand-purple]">Sales Program</a>
                    <a href="https://www.goclientwise.com"  className="block mb-1.5 text-sm text-gray-600 hover:text-[--brand-purple]">Refer and Earn</a>
                    <a href="https://www.goclientwise.com"  className="block mb-1.5 text-sm text-gray-600 hover:text-[--brand-purple]">Insurer Partnership</a>
                </div>
                 {/* Column 5: Disclosures */}
                 <div>
                    <h5 className="mb-3 text-sm font-semibold text-gray-700">Disclosures</h5>
                     <a href="https://www.goclientwise.com" className="block mb-1.5 text-sm text-gray-600 hover:text-[--brand-purple]">Privacy Policy</a>
                     <a href="https://www.goclientwise.com" className="block mb-1.5 text-sm text-gray-600 hover:text-[--brand-purple]">Terms and Conditions</a>
                     <a href="https://www.goclientwise.com" className="block mb-1.5 text-sm text-gray-600 hover:text-[--brand-purple]">Regulatory Disclosures</a>
                </div>
                 {/* Column 6: How it Works */}
                 <div>
                    <h5 className="mb-3 text-sm font-semibold text-gray-700">How it Works</h5>
                     <a href="https://www.goclientwise.com" className="block mb-1.5 text-sm text-gray-600 hover:text-[--brand-purple]">For Agents</a>
                     <a href="https://www.goclientwise.com" className="block mb-1.5 text-sm text-gray-600 hover:text-[--brand-purple]">For Agencies</a>
                </div>
                 {/* Column 7: Reach Us */}
                 <div>
                    <h5 className="mb-3 text-sm font-semibold text-gray-700">Reach Us</h5>
                    <a href="https://www.goclientwise.com"  className="block mb-1.5 text-sm text-gray-600 hover:text-[--brand-purple]">Book a Demo</a>
                    <a href="mailto:info@clientwise.example" className="block mb-1.5 text-sm text-gray-600 hover:text-[--brand-purple]">Email</a>
                    <p className="text-sm mb-2 text-gray-500">123 Main St, Anytown, USA</p>
                    {/* Social Media Icons */}
                    <div className="flex space-x-4 mt-3">
                        <a href="https://www.goclientwise.com" aria-label="Facebook" className="text-gray-400 hover:text-[--brand-purple]"> <i className="fab fa-facebook-f fa-lg"></i> </a>
                        <a href="https://www.goclientwise.com" aria-label="Twitter" className="text-gray-400 hover:text-[--brand-purple]"> <i className="fab fa-twitter fa-lg"></i> </a>
                        <a href="https://www.goclientwise.com" aria-label="LinkedIn" className="text-gray-400 hover:text-[--brand-purple]"> <i className="fab fa-linkedin-in fa-lg"></i> </a>
                        <a href="https://www.goclientwise.com" aria-label="Instagram" className="text-gray-400 hover:text-[--brand-purple]"> <i className="fab fa-instagram fa-lg"></i> </a>
                    </div>
                 </div>
            </div>
            {/* Bottom Bar */}
            <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                <div className="mb-4 md:mb-0">
                     <a href="https://www.goclientwise.com" className="text-xl font-semibold text-[--brand-purple]" style={{'--brand-purple': themeColors.brandPurple}}>clientwise</a>
                </div>
                <div>
                    <p>&copy; 2025 ClientWise Inc. All rights reserved.</p>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;

