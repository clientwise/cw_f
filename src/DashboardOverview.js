import React, { useState } from 'react';

// Assume themeColors is available globally or passed via Context/props
// Included here for standalone context if needed
const themeColors = {
  brandPurple: '#5a239e',
  brandBeige: '#f6eeb4',
  brandPurpleHover: '#703abc',
  lightGray: '#f9fafb',
  mediumGray: '#6b7280',
  darkGray: '#1f2937',
  white: '#ffffff',
  purple100: '#ede9fe',
  purple200: '#ddd6fe',
  purple300: '#c4b5fd',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  green100: '#dcfce7',
  green500: '#22c55e',
  green600: '#16a34a',
  green800: '#166534',
  yellow100: '#fef9c3',
  yellow600: '#ca8a04',
  red100: '#fee2e2',
  red600: '#dc2626',
  blue100: '#dbeafe',
  blue600: '#2563eb',
};

// --- Placeholder Content Screens ---
// These would be replaced with actual page components later
const ProductsPage = () => <div className="p-4">Products Page Content</div>;
const ClientsPage = () => <div className="p-4">Clients Page Content</div>;
const CommissionsPage = () => <div className="p-4">Commissions Page Content</div>;
const MarketingPage = () => <div className="p-4">Marketing Page Content</div>;
const HelpSupportPage = () => <div className="p-4">Help & Support Page Content</div>;
const NoticeBoardPage = () => <div className="p-4">Notice Board Page Content</div>;

// --- Dashboard Overview Screen ---
// Content for the main dashboard view
const DashboardOverview = () => {
  // Placeholder data - replace with data fetched from backend
  const metrics = [
    { label: 'Policies Sold (Month)', value: '12', change: '+5%', icon: 'fas fa-file-signature', color: 'purple' },
    { label: 'Upcoming Renewals (30d)', value: '8', change: 'View Renewals', icon: 'fas fa-calendar-check', color: 'yellow' },
    { label: 'Commission (Month)', value: '₹45,600', change: 'Estimated', icon: 'fas fa-rupee-sign', color: 'green' },
    { label: 'New Leads (Week)', value: '5', change: 'Manage Leads', icon: 'fas fa-user-plus', color: 'blue' },
  ];

  const tasks = [
      { text: 'Follow up with R. Sharma (Policy Query)', due: 'Due Today', urgent: true },
      { text: 'Prepare quote for Acme Corp', due: 'Due Tomorrow', urgent: false },
      { text: 'Renewal meeting - Priya Singh', due: 'Apr 15, 2025', urgent: false },
      { text: 'Send birthday wish to A. Khan', due: 'Apr 16, 2025', urgent: false },
  ];

   const activities = [
      { icon: 'fas fa-user-check', color: 'text-green-500', text: "Client 'V. Kumar' added.", time: '1h ago' },
      { icon: 'fas fa-file-alt', color: 'text-blue-500', text: "Policy #POL456 issued for 'S. Mehta'.", time: '3h ago' },
      { icon: 'fas fa-envelope', color: 'text-yellow-600', text: "Marketing email sent to 'Prospect List A'.", time: 'Yesterday' },
  ];

  const getIconBgColor = (color) => {
      switch(color) {
          case 'purple': return 'bg-purple-100 text-[--brand-purple]';
          case 'yellow': return 'bg-yellow-100 text-yellow-600';
          case 'green': return 'bg-green-100 text-green-600';
          case 'blue': return 'bg-blue-100 text-blue-600';
          default: return 'bg-gray-100 text-gray-600';
      }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Metric Cards */}
        {metrics.map((metric, index) => (
            <div key={index} className="bg-white p-5 rounded-lg shadow border border-gray-100 animate-on-scroll" style={{animationDelay: `${index * 100}ms`}}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">{metric.label}</p>
                        <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${getIconBgColor(metric.color)}`}>
                         <i className={`${metric.icon} fa-lg`}></i>
                    </div>
                </div>
                {metric.change.startsWith('+') || metric.change.startsWith('-') ? (
                     <p className={`text-xs mt-2 ${metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{metric.change}</p>
                ) : (
                     <a href="#" className="text-xs text-purple-600 hover:underline mt-2 block">{metric.change}</a>
                )}
            </div>
        ))}

        {/* Upcoming Tasks Card */}
        <div className="bg-white p-5 rounded-lg shadow border border-gray-100 md:col-span-2 lg:col-span-2 animate-on-scroll delay-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Tasks & Reminders</h3>
            <ul className="space-y-3">
                {tasks.map((task, index) => (
                     <li key={index} className={`flex items-center justify-between text-sm p-2 rounded ${task.urgent ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                        <span>{task.text}</span>
                        <span className={`text-xs font-medium ${task.urgent ? 'text-red-600' : 'text-gray-500'}`}>{task.due}</span>
                    </li>
                ))}
            </ul>
             <a href="#" className="text-xs text-purple-600 hover:underline mt-4 block text-right">View All Tasks</a>
        </div>

         {/* Recent Activity Card */}
        <div className="bg-white p-5 rounded-lg shadow border border-gray-100 md:col-span-2 lg:col-span-2 animate-on-scroll delay-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
            <ul className="space-y-3 text-sm">
                {activities.map((activity, index) => (
                    <li key={index} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50">
                        <i className={`${activity.icon} ${activity.color}`}></i>
                        <span>{activity.text}</span>
                        <span className="text-xs text-gray-400 ml-auto flex-shrink-0">{activity.time}</span>
                    </li>
                ))}
            </ul>
             <a href="#" className="text-xs text-purple-600 hover:underline mt-4 block text-right">View Full Log</a>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white p-5 rounded-lg shadow border border-gray-100 lg:col-span-1 xl:col-span-1 animate-on-scroll delay-300">
             <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
             <div className="space-y-2">
                 <button className="w-full text-left text-sm p-2 rounded bg-purple-50 text-purple-700 hover:bg-purple-100"><i className="fas fa-user-plus w-4 mr-2"></i>Add New Client</button>
                 <button className="w-full text-left text-sm p-2 rounded bg-purple-50 text-purple-700 hover:bg-purple-100"><i className="fas fa-file-medical w-4 mr-2"></i>Add New Policy</button>
                 <button className="w-full text-left text-sm p-2 rounded bg-purple-50 text-purple-700 hover:bg-purple-100"><i className="fas fa-tasks w-4 mr-2"></i>Add New Task</button>
             </div>
        </div>

         {/* Performance Chart Placeholder */}
         <div className="bg-white p-5 rounded-lg shadow border border-gray-100 lg:col-span-3 xl:col-span-3 animate-on-scroll delay-400">
             <h3 className="text-lg font-semibold text-gray-800 mb-4">Sales Performance (Placeholder)</h3>
             <div className="bg-gray-200 h-40 rounded flex items-center justify-center text-gray-500">
                 Chart Area
             </div>
         </div>
    </div>
  );
};

