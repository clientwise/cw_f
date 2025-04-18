import React from 'react';
import { Link } from 'react-router-dom'; // For back button

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e', brandPurpleHover: '#703abc' };

// Placeholder Training Data
const trainingMaterials = [
  { id: 't1', title: 'Client Onboarding Workflow', type: 'Video', description: 'Step-by-step guide on adding new clients and collecting KYC.', icon: 'fas fa-video', url: '#' },
  { id: 't2', title: 'Using the Policy Recommendation AI', type: 'Guide (PDF)', description: 'Learn how to interpret and use the AI suggestions effectively.', icon: 'fas fa-file-pdf', url: '#' },
  { id: 't3', title: 'Commission Tracking Explained', type: 'Video', description: 'Understand how commissions are calculated and tracked in the system.', icon: 'fas fa-video', url: '#' },
  { id: 't4', title: 'Marketing Campaigns Setup', type: 'Guide (PDF)', description: 'Creating and managing email marketing campaigns and templates.', icon: 'fas fa-file-pdf', url: '#' },
  { id: 't5', title: 'Generating Client Reports', type: 'Article', description: 'How to generate and understand various client and sales reports.', icon: 'fas fa-newspaper', url: '#' },
];

const TrainingMaterialsPage = () => {
  return (
    <div style={{'--brand-purple': themeColors.brandPurple}}>
         {/* Header */}
        <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-semibold text-gray-800">Training Resources</h2>
             <Link to="/dashboard/support" className="text-sm text-purple-600 hover:underline flex items-center">
                <i className="fas fa-arrow-left mr-2"></i> Back to Help & Support
             </Link>
        </div>

        {/* Training Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingMaterials.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow p-5 border border-gray-100 flex flex-col hover:shadow-lg transition-shadow">
                    <div className="flex items-start mb-3">
                        <i className={`${item.icon} text-2xl text-[--brand-purple] mr-3 mt-1 w-8 text-center`}></i>
                        <div>
                            <h3 className="text-md font-semibold text-gray-800">{item.title}</h3>
                            <span className="text-xs text-gray-500">{item.type}</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 flex-grow">{item.description}</p>
                    <a
                        href={item.url}
                        target="_blank" // Open links in new tab
                        rel="noopener noreferrer"
                        className="mt-auto inline-flex items-center justify-center px-4 py-1.5 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-[--brand-purple] hover:bg-[--brand-purple-hover] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[--brand-purple]"
                        style={{'--brand-purple-hover': themeColors.brandPurpleHover}}
                    >
                        {item.type === 'Video' ? 'Watch Video' : (item.type.includes('PDF') ? 'Download PDF' : 'Read More')} <i className="fas fa-arrow-right ml-2 text-xs"></i>
                    </a>
                </div>
            ))}
        </div>
    </div>
  );
};

export default TrainingMaterialsPage;
