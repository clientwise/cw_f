
// --- Dashboard Shell Component ---

// import AgentProfilePage from "./pages/AgentProfilePage";
// import GrowPage from "./pages/GrowPage";
// import PricingPage from "./pages/PricingPage";

// This component provides the main layout with sidebar and header
const DashboardShell = ({ userInfo, onLogout }) => {
    const [activePage, setActivePage] = useState('Dashboard'); // State to track current page

    const sidebarLinks = [
        { name: 'Dashboard', icon: 'fas fa-tachometer-alt' },
        { name: 'Products', icon: 'fas fa-box-open' },
        { name: 'Clients', icon: 'fas fa-users' },
        { name: 'Commissions', icon: 'fas fa-file-invoice-dollar' },
        { name: 'Marketing', icon: 'fas fa-bullhorn' },
        { name: 'Help & Support', icon: 'fas fa-life-ring' },
        { name: 'Notice Board', icon: 'fas fa-clipboard-list' },
        { name: 'Pricing', icon: 'fas fa-clipboard-list' },
        // { name: 'Grow', icon: 'fas fa-clipboard-list' },
        { name: 'My Profile', href: '/dashboard/profile' },

    ];

    // Function to render the currently selected page content
    const renderCurrentPage = () => {
        switch (activePage) {
            case 'Products': return <ProductsPage />;
            case 'Clients': return <ClientsPage />;
            case 'Commissions': return <CommissionsPage />;
            case 'Marketing': return <MarketingPage />;
            case 'Help & Support': return <HelpSupportPage />;
            case 'Notice Board': return <NoticeBoardPage />;
            case 'Pricing': return <PricingPage />;
            // case 'Grow':  return <GrowPage />;
            case 'My Profile' : return <AgentProfilePage />;
            case 'Dashboard':
            default:
                return <DashboardOverview />;
        }
    };

    // Function to handle sidebar navigation clicks
    const handleNavigation = (pageName) => {
        console.log(`Navigate to ${pageName}`);
        setActivePage(pageName);
        // In a real app with routing, you'd navigate using your router here
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100" style={{'--brand-purple': themeColors.brandPurple, '--brand-purple-hover': themeColors.brandPurpleHover, '--brand-beige': themeColors.brandBeige }}>
            {/* Sidebar */}
            <aside className="w-64 flex-shrink-0 bg-[--brand-purple] text-gray-200 flex flex-col overflow-y-auto">
                {/* Logo */}
                <div className="h-16 flex items-center justify-center px-4 flex-shrink-0 border-b border-purple-700">
                    <a href="#" className="text-2xl font-semibold text-[--brand-beige]">clientwise</a>
                </div>
                {/* Navigation */}
                <nav className="flex-grow mt-5 px-4 space-y-1">
                    {sidebarLinks.map((link) => {
                        const isActive = link.name === activePage;
                        return (
                            <a
                                key={link.name}
                                href=""
                                onClick={(e) => { e.preventDefault(); handleNavigation(link.name); }}
                                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                                    isActive
                                    ? 'bg-[--brand-purple-hover] text-white font-semibold shadow-inner'
                                    : 'text-purple-100 hover:bg-[--brand-purple-hover] hover:text-white'
                                }`}
                            >
                                <i className={`${link.icon} w-6 h-6 mr-3 text-center`} aria-hidden="true"></i>
                                {link.name}
                            </a>
                        );
                    })}
                </nav>
                {/* User Profile / Logout */}
                <div className="p-4 mt-auto border-t border-purple-700 flex-shrink-0">
                    <div className="flex items-center mb-3">
                        <img className="h-8 w-8 rounded-full mr-3 object-cover ring-2 ring-purple-300" src={`https://placehold.co/40x40/${themeColors.brandBeige.substring(1)}/${themeColors.brandPurple.substring(1)}?text=${userInfo?.userType === 'agency' ? 'A' : 'U'}`} alt="User Avatar"/>
                        <div>
                            <p className="text-sm font-medium text-white">{userInfo?.userType === 'agency' ? 'Agency Admin' : 'Agent Name'}</p>
                            {/* <a href="#" className="text-xs text-purple-300 hover:text-[--brand-beige]">View Profile</a> */}
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="w-full text-left flex items-center px-3 py-2 rounded-md text-sm font-medium text-purple-200 hover:bg-[--brand-purple-hover] hover:text-white transition-colors duration-150"
                    >
                         <i className="fas fa-sign-out-alt w-6 h-6 mr-3 text-center" aria-hidden="true"></i>
                         Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                {/* Top Header Bar */}
                <header className="bg-white shadow-sm sticky top-0 z-10">
                    <div className="container mx-auto px-6 py-3 flex justify-between items-center min-h-[64px]">
                        <h1 className="text-xl font-semibold text-gray-800">{activePage}</h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">Welcome, {userInfo?.userType === 'agency' ? 'Admin' : 'Agent'}!</span>
                        </div>
                    </div>
                </header>

                {/* Page Content Rendered Here */}
                <div className="p-6 md:p-8">
                    {renderCurrentPage()}
                </div>
            </main>
        </div>
    );
};

// --- Note: The main App component needs to be updated ---
// --- See the next artifact: react_full_frontend (Updated App) ---

