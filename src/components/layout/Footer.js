import React from 'react';
import { Link } from 'react-router-dom';
// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e' };

const Footer = () => (
    <footer className="bg-gray-800 text-gray-300 py-12" style={{background:'#5a239e'}}>
    <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* About Column */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">ClientWise</h3>
                <p className="text-sm mb-4">The modern CRM for ambitious insurance agents in India.</p>
                <p className="text-xs  mb-4">&copy; {new Date().getFullYear()} 18Novem Techologies. All rights reserved.</p>
           <p  className="text-xs  mb-4">  Reach us at : getclientwise@gmail.com</p>
           <p  className="text-xs">
           Address:1413, Ocus Quantum, Sector 51, Gurugram (Haryana), 122003 INDIA </p>
            </div>
            {/* Quick Links */}
            <div>
                            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                            <li><Link to="/about-us" className="hover:text-white">About Us</Link></li>
                            <li><Link to="/why-clientwise" className="hover:text-white">Why ClientWise?</Link></li>

                                <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li> {/* Changed from /#pricing */}
                                <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
                                {/* NEW Links */}
                                
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/features" className="hover:text-white">Features</Link></li> {/* Changed from /#features */}
                                <li><Link to="/for-agents" className="hover:text-white">How It Works (Agents)</Link></li>
                                <li><Link to="/for-agencies" className="hover:text-white">How It Works (Agencies)</Link></li>
                                </ul>
                                </div>
            {/* Partnership Links */}
             <div>
                <h4 className="font-semibold text-white mb-3">Partnerships</h4>
                <ul className="space-y-2 text-sm">
                    <li><Link to="/partners/agencies" className="hover:text-white">Agency Program</Link></li>
                    <li><Link to="/partners/sales" className="hover:text-white">Sales Partner Program</Link></li>
                    <li><Link to="/partners/insurers" className="hover:text-white">Insurer Program</Link></li>
                </ul>
            </div>
            {/* Legal Links */}
            <div>
                <h4 className="font-semibold text-white mb-3">Legal</h4>
                <ul className="space-y-2 text-sm">
                    <li><Link to="/terms-and-conditions" className="hover:text-white">Terms & Conditions</Link></li>
                    <li><Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
                    <li><Link to="/disclaimer" className="hover:text-white">Disclaimer</Link></li>
                    <li><Link to="/disclaimer" className="hover:text-white"><a herf="https://www.linkedin.com/company/18novem/posts/?feedView=all" target='_blank'><i class="fa-brands fa-linkedin"></i></a> <i class="fas fa-heart" style={{color: '#ff0040'}}></i>Made in India</Link></li>

                </ul>
            </div>
          
        </div>
        {/* Social Media Links (Optional) */}
     
    </div>
</footer>
);

export default Footer;

