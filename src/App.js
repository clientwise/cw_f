import React, { useState, useEffect } from 'react';
// Import React Router components
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    Outlet // Used for nested routes within DashboardShell
} from 'react-router-dom';

// Import Page Components (Make sure these paths match your folder structure)
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardShell from './components/layout/DashboardShell'; // Assuming DashboardShell is in layout components
import DashboardOverview from './pages/DashboardOverview';
import ProductsPage from './pages/ProductsPage';
import ProductProfilePage from './pages/ProductProfilePage';
import ClientsPage from './pages/ClientsPage';
import ClientProfilePage from './pages/ClientProfilePage';
import CommissionsPage from './pages/CommissionsPage';
import MarketingPage from './pages/MarketingPage';
import HelpSupportPage from './pages/HelpSupportPage'; // Main help page
import NoticeBoardPage from './pages/NoticeBoardPage';
// --- Import FAQ and Training pages ---
import FAQPage from './pages/FAQPage';
import TrainingMaterialsPage from './pages/TrainingMaterialsPage';
import ClientPortalPage from './pages/ClientPortalPage';
import PricingPage from './pages/PricingPage';
import GrowPage from './pages/GrowPage';
import AgentProfilePage from './pages/AgentProfilePage';

// ------------------------------------------
// Import PasswordResetPage if you create it
// import PasswordResetPage from './pages/PasswordResetPage';

// Assume themeColors is defined globally or via Context/props
const themeColors = {
    brandPurple: '#5a239e', brandBeige: '#f6eeb4', brandBeigeHover: '#fbf8e9',
    brandPurpleHover: '#703abc', brandPurpleDeep: '#3b0770',
    // Add other colors if needed directly in this file
};

// --- Protected Route Component ---
// Wraps routes that require authentication
const ProtectedRoute = ({ isLoggedIn, children }) => {
    if (!isLoggedIn) {
        // Redirect to login page if not logged in, saving the intended location
        // The 'replace' prop prevents adding the login route to the history stack
        return <Navigate to="/login" replace />;
    }
    // If logged in, render the child component (which is <Outlet /> for the main dashboard route)
    return children ? children : <Outlet />;
};


export default function App() {
    // Authentication state
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [authChecked, setAuthChecked] = useState(false); // To prevent flicker on load

    // Check for existing token on initial load
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const expiry = localStorage.getItem('authTokenExpiry');
        const storedUserInfo = localStorage.getItem('userInfo');
        let validToken = false;

        if (token && expiry) {
            const expiryTime = parseInt(expiry, 10);
            const now = Math.floor(Date.now() / 1000);
            if (now < expiryTime) {
                validToken = true;
                setIsLoggedIn(true);
                // Don't set currentPage here, router handles the view based on isLoggedIn
                if (storedUserInfo) {
                    try { setUserInfo(JSON.parse(storedUserInfo)); } catch (e) { localStorage.removeItem('userInfo'); }
                }
                console.log("User authenticated from stored token.");
            } else {
                localStorage.removeItem('authToken'); localStorage.removeItem('authTokenExpiry'); localStorage.removeItem('userInfo');
                console.log("Stored token expired.");
            }
        }
        setAuthChecked(true); // Mark authentication check as complete

        // Handle redirects from verification/reset - This might be better handled on the LoginPage itself
        if (!validToken) {
             const queryParams = new URLSearchParams(window.location.search);
             if (queryParams.get('verified') === 'true' || queryParams.get('reset') === 'success') {
                 // No state change needed here for page, LoginPage useEffect handles message
                 // Ensure URL is cleaned up on LoginPage mount if needed
             }
        }

    }, []); // Run only once on initial mount

    // Apply theme colors & setup animations - This effect might be better placed elsewhere or use Context
    useEffect(() => {
        const root = document.documentElement;
        Object.entries(themeColors).forEach(([key, value]) => {
            const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            root.style.setProperty(cssVarName, value);
        });

        // Setup Intersection Observer for animations
        // This needs to re-run when the main rendered component changes to observe new elements
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
        const observerCallback = (entries, observer) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }); };
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        // Use a timer to ensure elements are mounted before observing
        const timer = setTimeout(() => { const targets = document.querySelectorAll('.animate-on-scroll'); targets.forEach(target => { target.classList.remove('is-visible'); observer.observe(target); }); }, 50);
        // Cleanup function
        return () => { clearTimeout(timer); observer.disconnect(); };
    }, [isLoggedIn]); // Re-run when login state changes (which changes the main component)

    // --- Auth Handler Functions ---
    const handleLoginSuccess = (data) => {
        console.log("Storing token and user info...");
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('authTokenExpiry', data.expiresAt.toString());
        const userData = { userId: data.userId, userType: data.userType };
        localStorage.setItem('userInfo', JSON.stringify(userData));
        setUserInfo(userData);
        setIsLoggedIn(true);
        // Navigation is now handled by the Router redirecting from /login when isLoggedIn becomes true
    };

    const handleLogout = () => {
        console.log("Logging out...");
        localStorage.removeItem('authToken'); localStorage.removeItem('authTokenExpiry'); localStorage.removeItem('userInfo');
        setUserInfo(null);
        setIsLoggedIn(false);
        // Navigation is handled by the Router redirecting from protected routes
    };

    // Prevent rendering routes until initial auth check is complete
    if (!authChecked) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>; // Or a proper loading spinner
    }

    return (
        <Router>
            <div style={{ /* Pass CSS variables if needed by components */ }}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <LandingPage navigateToLogin={() => { /* Use Link component now */ }} />} />
                    <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <LoginPage onLoginSuccess={handleLoginSuccess} navigateToLanding={()=>{/* Use Link/navigate instead */}} />} />
                    <Route path="/client-portal/:token" element={<ClientPortalPage />} />

                    {/* <Route path="/reset-password" element={<PasswordResetPage />} /> */}


                    {/* Protected Dashboard Routes */}
                    <Route path="/dashboard" element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
                        {/* DashboardShell provides the layout (sidebar/header) and an Outlet */}
                        <Route element={<DashboardShell userInfo={userInfo} onLogout={handleLogout} />}>
                            {/* Child routes render inside DashboardShell's Outlet */}
                            <Route index element={<DashboardOverview />} /> {/* Default for /dashboard */}
                            <Route path="products" element={<ProductsPage />} />
                            <Route path="products/:productId" element={<ProductProfilePage />} />
                            <Route path="clients" element={<ClientsPage />} />
                            <Route path="clients/:clientId" element={<ClientProfilePage />} />
                            <Route path="commissions" element={<CommissionsPage />} />
                            <Route path="marketing" element={<MarketingPage />} />
                            {/* Updated Help/Support Route */}
                            <Route path="support" element={<HelpSupportPage />} />

                            <Route path="grow" element={<GrowPage />} />

                            <Route path="pricing" element={<PricingPage />} />
                            {/* --- NEW: Nested routes for Help section --- */}
                            <Route path="support/faq" element={<FAQPage />} />
                            <Route path="support/training" element={<TrainingMaterialsPage />} />
                            {/* ------------------------------------------ */}
                            <Route path="notices" element={<NoticeBoardPage />} />
                            <Route path="profile" element={<AgentProfilePage />} />

                            {/* Fallback INSIDE dashboard to redirect to overview */}
                            <Route path="*" element={<Navigate to="/dashboard" replace />} />
                        </Route>
                    </Route>

                    {/* Fallback for any other unknown routes */}
                    <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} replace />} />
                </Routes>
            </div>
        </Router>
    );
}

// --- Make sure necessary page/layout components are imported correctly ---
// (No need to define placeholders here if using separate files and imports)
