import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
// import { AuthContext } from '../../context/AuthContext'; // Assuming you have an AuthContext
// import { AgencyContext } from '../../context/AgencyContext'; // Assuming you have an AgencyContext

// Placeholder for theme colors if not using Tailwind extensively for this
const themeColors = {
  brandPurple: '#5a239e',
  brandPurpleHover: '#703abc',
  textPrimary: '#1f2937', // gray-800
  textSecondary: '#6b7280', // gray-500
  bgLight: '#f9fafb', // gray-50
  borderLight: '#e5e7eb', // gray-200
};

// Mock AuthContext and AgencyContext for example if you don't have them yet
// In a real app, these would provide the logged-in user and their agency details
const MockAuthContext = React.createContext();
const useAuth = () => {
  // Replace with your actual AuthContext logic
  return useContext(MockAuthContext) || { 
    user: { name: 'Alice Admin', email: 'alice.admin@example.com', userType: 'AgencyAdmin', agencyId: 'agency_123' }, 
    loading: false 
  };
};

const MockAgencyContext = React.createContext();
const useAgency = () => {
  // Replace with your actual AgencyContext logic or fetch agency data
  const { user } = useAuth();
  const [agencyDetails, setAgencyDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.agencyId) {
      // Simulate fetching agency details
      setTimeout(() => {
        setAgencyDetails({
          id: user.agencyId,
          name: 'Innovate Insure Group',
          // Add other details if needed from backend later
        });
        setLoading(false);
      }, 500);
    } else {
      setLoading(false);
    }
  }, [user]);

  return { agency: agencyDetails, loading };
};


// Reusable Stat Card Component
const DashboardStatCard = ({ title, value, icon, unit, trend }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        {icon && <div className="text-brand-purple">{icon}</div>}
      </div>
      <p className="text-3xl font-bold text-brand-purple">
        {value}
        {unit && <span className="text-xl font-medium text-gray-500 ml-1">{unit}</span>}
      </p>
      {trend && (
        <p className={`text-sm mt-1 ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </p>
      )}
    </div>
  );
};

// Navigation Links Component
const DashboardNavigation = () => {
  const navItems = [
    { href: '/agency/manage-agents', label: 'Manage Agents', description: 'View, invite, and manage your team.' },
    { href: '/agency/policies', label: 'Policy Overview', description: 'Track all policies under your agency.' },
    { href: '/agency/reports', label: 'Performance Reports', description: 'Analyze agency and agent performance.' },
    { href: '/agency/profile', label: 'Agency Profile', description: 'Update your agency details.' },
  ];

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {navItems.map((item) => (
        <Link href={item.href} key={item.label} legacyBehavior>
          <a className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:border-brand-purple border-2 border-transparent transition-all duration-300 group">
            <h4 className="text-xl font-semibold text-brand-purple group-hover:underline">{item.label}</h4>
            <p className="text-gray-600 mt-1 text-sm">{item.description}</p>
          </a>
        </Link>
      ))}
    </div>
  );
};


const AgencyDashboardPage = () => {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth(); // Use your actual AuthContext
  const { agency, loading: agencyLoading } = useAgency(); // Use your actual AgencyContext

  // Mock Data for Dashboard Stats
  const [dashboardStats, setDashboardStats] = useState({
    totalAgents: 0,
    activePolicies: 0,
    premiumThisMonth: 0,
    pendingInvitations: 0,
  });

  useEffect(() => {
    // In a real app, you would fetch these stats from your backend
    // For now, using hardcoded data or simulating a fetch
    if (user && user.userType === 'AgencyAdmin' && agency) {
      // Simulate fetching stats based on agencyId
      setTimeout(() => {
        setDashboardStats({
          totalAgents: 12,
          activePolicies: 256,
          premiumThisMonth: 125000, // Example in INR
          pendingInvitations: 3,
        });
      }, 700);
    }
  }, [user, agency]);


  useEffect(() => {
    if (!authLoading && (!user || user.userType !== 'AgencyAdmin')) {
      // router.push('/login'); // Redirect if not an AgencyAdmin
      console.warn("Redirecting: Not an Agency Admin or not logged in");
      // For this example, we'll just show a message if not admin
    }
  }, [user, authLoading, router]);

  if (authLoading || agencyLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-gray-700">Loading Dashboard...</p>
        {/* Add a spinner here */}
      </div>
    );
  }

  if (!user || user.userType !== 'AgencyAdmin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <h1 className="text-2xl font-semibold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-700 mb-6">You do not have permission to view this page.</p>
        <Link href="/" legacyBehavior>
          <a className="px-6 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-purple-hover transition-colors">
            Go to Homepage
          </a>
        </Link>
      </div>
    );
  }
  
  if (!agency) {
     return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <h1 className="text-2xl font-semibold text-yellow-600 mb-4">Agency Not Found</h1>
        <p className="text-gray-700 mb-6">Your user account is not associated with an active agency.</p>
        <p className="text-gray-600 text-sm mb-6">Please contact support or ensure your agency setup is complete.</p>
        <Link href="/" legacyBehavior>
          <a className="px-6 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-purple-hover transition-colors">
            Go to Homepage
          </a>
        </Link>
      </div>
    );   
  }


  return (
    // Assuming you have a main layout component, otherwise wrap with a basic div
    // For example: <MainLayout> ... </MainLayout>
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-yellow-50 p-4 sm:p-6 md:p-8 font-sans"
         style={{ '--brand-purple': themeColors.brandPurple, '--brand-purple-hover': themeColors.brandPurpleHover }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 p-4 bg-white shadow rounded-lg">
          <h1 className="text-3xl font-bold text-brand-purple">Agency Dashboard</h1>
          {agency && <p className="text-xl text-gray-600">Managing: {agency.name}</p>}
          {user && <p className="text-sm text-gray-500">Welcome, {user.name}!</p>}
        </header>

        {/* Stats Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardStatCard
            title="Total Agents"
            value={dashboardStats.totalAgents}
            icon={ // SVG Icon for users
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <DashboardStatCard
            title="Active Policies"
            value={dashboardStats.activePolicies}
            icon={ // SVG Icon for documents
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <DashboardStatCard
            title="Premium This Month"
            value={`₹${dashboardStats.premiumThisMonth.toLocaleString('en-IN')}`} // Format as INR
            icon={ // SVG Icon for currency
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            }
            trend="+5.2% from last month" // Example trend
          />
           <DashboardStatCard
            title="Pending Invitations"
            value={dashboardStats.pendingInvitations}
            icon={ // SVG Icon for mail
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            }
          />
        </section>

        {/* Navigation Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <DashboardNavigation />
        </section>

        {/* Placeholder for recent activity or alerts (Future) */}
        {/* <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600">No recent activity to display.</p>
          </div>
        </section> */}
      </div>
    </div>
  );
};

export default AgencyDashboardPage;

