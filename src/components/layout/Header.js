import React from 'react';
import Button from '../common/Button'; // Import reusable Button

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e', brandBeige: '#f6eeb4', brandBeigeHover: '#fbf8e9' };

const Header = ({ navigateToLogin }) => (
     <header className="bg-[--brand-purple] sticky top-0 z-50 shadow-md" style={{'--brand-purple': themeColors.brandPurple, '--brand-beige': themeColors.brandBeige, '--brand-beige-hover': themeColors.brandBeigeHover}}>
        <nav className="container mx-auto px-6 py-3 relative flex justify-between items-center min-h-[64px]">
            <a href="https://www.goclientwise.com"  className="text-2xl font-semibold text-[--brand-beige] flex-shrink-0">clientwise</a>
            <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 space-x-8">
                <a href="#features" className="text-[--brand-beige] hover:text-[--brand-beige-hover] font-medium text-sm">Product</a>
                <a href="#testimonials" className="text-[--brand-beige] hover:text-[--brand-beige-hover] font-medium text-sm">Customers</a>
                <a href="https://www.goclientwise.com"  className="text-[--brand-beige] hover:text-[--brand-beige-hover] font-medium text-sm">About Us</a>
            </div>
            <div className="hidden md:flex items-center">
                 <Button onClick={() => navigateToLogin('login')} variant="primary" className="mr-2">Login</Button>
                 <Button onClick={() => navigateToLogin('signup')} variant="primary">Sign Up</Button>
            </div>
            <button id="mobile-menu-button" className="md:hidden focus:outline-none text-[--brand-beige] hover:text-[--brand-beige-hover]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                {/* TODO: Implement mobile menu toggle logic */}
            </button>
        </nav>
        {/* TODO: Implement Mobile Menu dropdown */}
    </header>
);

export default Header;
