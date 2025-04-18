import React, { useState } from 'react';
// Import NavLink and Outlet from react-router-dom
import { NavLink, Outlet } from 'react-router-dom';

// Import placeholder pages (adjust paths if needed)
// These are needed here IF DashboardShell renders them directly via state,
// BUT with Outlet, they are rendered by the Routes in App.js, so imports here are not strictly necessary
// unless used for type checking or other logic within DashboardShell itself.
import DashboardOverview from '../../pages/DashboardOverview'; // Example import, adjust path
import ProductsPage from '../../pages/ProductsPage';
import ClientsPage from '../../pages/ClientsPage';
import CommissionsPage from '../../pages/CommissionsPage';
import MarketingPage from '../../pages/MarketingPage';
import HelpSupportPage from '../../pages/HelpSupportPage';
import NoticeBoardPage from '../../pages/NoticeBoardPage';
// Note: ClientProfilePage is usually rendered directly by a dynamic route in App.js, not listed here.


// Assume themeColors is available globally or via context/props
const themeColors = {
    brandPurple: '#5a239e',
    brandBeige: '#f6eeb4',
    brandPurpleHover: '#703abc', // Used for active/hover states
    purple100: '#ede9fe',
    purple300: '#c4b5fd',
    sidebarTextColor: '#e5e7eb', // Light text for dark sidebar (text-purple-100 equivalent)
    sidebarIconColor: '#d1d5db', // Slightly dimmer icons (text-purple-300 equivalent)
    sidebarBorder: '#4a0e8a', // darker purple for borders
};

// Props:
// - userInfo: Object containing logged-in user details { userId, userType }
// - onLogout: Function passed from App to handle logout action
const DashboardShell = ({ userInfo, onLogout }) => {
    // No longer need internal state to track activePage, NavLink handles it
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const sidebarLinks = [
        // Use '/dashboard' for the index route (overview)
        // `end={true}` ensures only exact match is active for index route
        { name: 'Dashboard', path: '/dashboard', icon: 'fas fa-tachometer-alt', exact: true },
        { name: 'Products', path: '/dashboard/products', icon: 'fas fa-box-open' },
        { name: 'Clients', path: '/dashboard/clients', icon: 'fas fa-users' },
        { name: 'Commissions', path: '/dashboard/commissions', icon: 'fas fa-file-invoice-dollar' },
        { name: 'Marketing', path: '/dashboard/marketing', icon: 'fas fa-bullhorn' },
        { name: 'Help & Support', path: '/dashboard/support', icon: 'fas fa-life-ring' },
        { name: 'Notice Board', path: '/dashboard/notices', icon: 'fas fa-clipboard-list' },
        { name: 'Pricing', path: '/dashboard/pricing', icon: 'fas fa-tags' },
        { name: 'Grow', path: '/dashboard/grow', icon: 'fas fa-seedling' },
        // --- NEW Link ---
        { name: 'My Profile', path: '/dashboard/profile', icon: 'fas fa-user-circle' },
            ];

    // Function to determine NavLink active style based on isActive prop provided by NavLink
    const getNavLinkClass = ({ isActive }) => {
        
         const baseClasses = "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150";
         if (isActive) {
             // Classes for the active link
             return `${baseClasses} bg-[--brand-purple-hover] text-white font-semibold shadow-inner`;
         } else {
             // Classes for inactive links
             return `${baseClasses} text-purple-100 hover:bg-[--brand-purple-hover] hover:text-white`;
         }
    };

    return (
        // Main flex container for the whole screen
        <div className="flex h-screen overflow-hidden bg-gray-100" style={{'--brand-purple': themeColors.brandPurple, '--brand-purple-hover': themeColors.brandPurpleHover, '--brand-beige': themeColors.brandBeige }}>
            {/* Sidebar */}
            
            <aside className="hidden md:flex w-64 flex-shrink-0 bg-[--brand-purple] text-gray-200 flex-col overflow-y-auto">
            {/* Logo/Brand - Link back to dashboard overview */}
                <div className="h-16 flex items-center justify-center px-4 flex-shrink-0 border-b border-[--brand-purple-hover]">
                    <NavLink to="/dashboard" className="text-2xl font-semibold text-[--brand-beige]">clientwise</NavLink>
                </div>

                {/* Navigation using NavLink */}
                <nav className="flex-grow mt-5 px-4 space-y-1">
                    {sidebarLinks.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            // Use end prop for the index route to prevent it matching all /dashboard/* routes
                            end={link.exact}
                            className={getNavLinkClass} // Use function to apply active/inactive styles
                        >
                            {/* Icon */}
                            <i className={`${link.icon} w-6 h-6 mr-3 text-center text-purple-300 group-hover:text-white`} aria-hidden="true"></i>
                            {/* Link Text */}
                            {link.name}
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile / Logout Area */}
                <div className="p-4 mt-auto border-t border-[--brand-purple-hover] flex-shrink-0">
                   
                    {/* Logout Button */}
                    <button
                        onClick={onLogout} // Call the logout function passed from App
                        className="w-full text-left flex items-center px-3 py-2 rounded-md text-sm font-medium text-purple-200 hover:bg-[--brand-purple-hover] hover:text-white transition-colors duration-150"
                    >
                         <i className="fas fa-sign-out-alt w-6 h-6 mr-3 text-center" aria-hidden="true"></i>
                         Logout
                    </button>
                </div>
            </aside>
            <div
    className={`fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden transition-opacity duration-200 ${
        sidebarOpen ? 'block' : 'hidden'
    }`}
    onClick={() => setSidebarOpen(false)}
>
    <aside
        className={`absolute left-0 top-0 w-64 h-full bg-[--brand-purple] text-gray-200 flex flex-col overflow-y-auto transform transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
    >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center px-4 flex-shrink-0 border-b border-[--brand-purple-hover]">
            <NavLink to="/dashboard" className="text-2xl font-semibold text-[--brand-beige]">clientwise</NavLink>
        </div>

        {/* Nav */}
        <nav className="flex-grow mt-5 px-4 space-y-1">
            {sidebarLinks.map((link) => (
                <NavLink
                    key={link.name}
                    to={link.path}
                    end={link.exact}
                    className={getNavLinkClass}
                    onClick={() => setSidebarOpen(false)} // Close sidebar on nav click
                >
                    <i className={`${link.icon} w-6 h-6 mr-3 text-center text-purple-300`} aria-hidden="true"></i>
                    {link.name}
                </NavLink>
            ))}
        </nav>

        {/* User/Logout Section */}
        <div className="p-4 mt-auto border-t border-[--brand-purple-hover] flex-shrink-0">
            {/* <div className="flex items-center mb-3">
                <img className="h-9 w-9 rounded-full mr-3 object-cover ring-2 ring-purple-300" src={`https://placehold.co/40x40/${themeColors.brandBeige.substring(1)}/${themeColors.brandPurple.substring(1)}?text=${userInfo?.userType === 'agency' ? 'A' : 'U'}`} alt="User Avatar"/>
                <div>
                    <p className="text-sm font-medium text-white">{userInfo?.userType === 'agency' ? 'Agency Admin' : 'Agent Name'}</p>
                </div>
            </div> */}
            <button
                onClick={onLogout}
                className="w-full text-left flex items-center px-3 py-2 rounded-md text-sm font-medium text-purple-200 hover:bg-[--brand-purple-hover] hover:text-white transition-colors duration-150"
            >
                <i className="fas fa-sign-out-alt w-6 h-6 mr-3 text-center" aria-hidden="true"></i>
                Logout
            </button>
        </div>
    </aside>
</div>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                {/* Top Header Bar (Optional - could be removed or simplified) */}
                <header className="bg-white shadow-sm sticky top-0 z-10">
    <div className="px-4 py-3 flex justify-between items-center min-h-[64px] md:px-6">
        {/* Hamburger for mobile */}
        <button
            className="text-gray-600 focus:outline-none md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
        >
            <i className="fas fa-bars fa-lg"></i>
        </button>

        <h1 className="text-xl font-semibold text-gray-800">ClientWise Dashboard</h1>

        <div className="hidden md:block">
            <span className="text-sm text-gray-600">Welcome, {userInfo?.userType === 'agency' ? 'Admin' : 'Agent'}!</span>
        </div>
    </div>
</header>


                {/* Outlet renders the matched nested route component */}
                {/* (e.g., DashboardOverview, ClientsPage, ClientProfilePage) */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {/* --- Pass userInfo via Outlet context --- */}
          <Outlet context={{ userInfo }} />
          {/* -------------------------------------- */}
        </main>
            </main>
        </div>
    );
};

export default DashboardShell;
