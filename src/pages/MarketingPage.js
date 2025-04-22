import React, { useState, useEffect, useCallback } from 'react';
import Button from '../components/common/Button'; // Adjust path if needed
// Import the new modals
import CreateSegmentModal from '../components/marketing/CreateSegmentModal'; // Adjust path
import CreateCampaignModal from '../components/marketing/CreateCampaignModal'; // Adjust path

// Assume themeColors and helper functions are defined or imported
const themeColors = { /* ... */ };
const formatDate = (dateString) => { /* ... */ };
const getCampaignStatusClass = (status) => { /* ... */ };
const getTemplateIcon = (type) => { /* ... */ };
const getContentIcon = (type) => { /* ... */ };

const MarketingPage = () => {
    // State for data lists
    const [campaigns, setCampaigns] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [contentItems, setContentItems] = useState([]);
    const [segments, setSegments] = useState([]);

    // State for loading/error
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- NEW: State for Modals ---
    const [isSegmentModalOpen, setIsSegmentModalOpen] = useState(false);
    const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

    // Fetch all marketing data
    const fetchAllMarketingData = useCallback(async (refreshType = 'all') => {
        // Only show main loader on initial load
        if (refreshType === 'all') setIsLoading(true);
        // Clear general error only on full refresh, allow specific errors maybe?
        if (refreshType === 'all') setError(null);

        const token = localStorage.getItem('authToken');
        if (!token) { setError("Authentication error: Not logged in."); setIsLoading(false); return; }

        const headers = { 'Authorization': `Bearer ${token}` };
        const baseUrl = 'https://api.goclientwise.com/api/marketing';

        const fetchDataFor = async (endpoint, setter) => {
            // Don't reset individual lists if just refreshing one type
            try {
                const response = await fetch(`${baseUrl}/${endpoint}`, { headers });
                if (!response.ok) { let e = `Err ${endpoint}: ${response.status}`; try{const d=await response.json();e=d.error||e;}catch{} throw new Error(e); }
                const data = await response.json();
                setter(data || []);
                return { status: 'fulfilled' };
            } catch (err) {
                 console.error(`Failed to fetch ${endpoint}:`, err);
                 // Set general error if not already set
                 setError(prev => prev || err.message || `Failed to load ${endpoint}`);
                 return { status: 'rejected', reason: err };
            }
        };

        try {
            const promises = [];
            if (refreshType === 'all' || refreshType === 'campaigns') promises.push(fetchDataFor('campaigns', setCampaigns));
            if (refreshType === 'all' || refreshType === 'templates') promises.push(fetchDataFor('templates', setTemplates));
            if (refreshType === 'all' || refreshType === 'content') promises.push(fetchDataFor('content', setContentItems));
            if (refreshType === 'all' || refreshType === 'segments') promises.push(fetchDataFor('segments', setSegments));

            await Promise.allSettled(promises);

        } catch (err) { /* Error already set in fetchApi */ }
        finally { if (refreshType === 'all') setIsLoading(false); }
    // Include state variables used in the function if needed, or keep empty array if it should only run once / manually triggered
    }, []); // Dependencies removed to only run once, refresh handled by callbacks

    useEffect(() => {
        fetchAllMarketingData('all'); // Initial fetch
    }, [fetchAllMarketingData]); // Depend on the function itself

    // --- Modal Handlers ---
    const openSegmentModal = () => setIsSegmentModalOpen(true);
    const closeSegmentModal = () => setIsSegmentModalOpen(false);
    const handleSegmentCreated = () => { fetchAllMarketingData('segments'); }; // Refetch segments

    const openCampaignModal = () => setIsCampaignModalOpen(true);
    const closeCampaignModal = () => setIsCampaignModalOpen(false);
    const handleCampaignCreated = () => { fetchAllMarketingData('campaigns'); }; // Refetch campaigns

    // Placeholder action handlers
    const handleUseTemplate = (id) => alert(`Use Template ${id} - Not Implemented`);
    const handleDownloadContent = (url) => { if(url) window.open(url, '_blank'); else alert('No URL available'); };
    const handleViewEditSegment = (id) => alert(`View/Edit Segment ${id} - Not Implemented`);
    const handleCampaignAction = (action, id) => alert(`${action} campaign ${id} - Not Implemented`);


    // --- Rendering Logic ---
    if (isLoading) { return <div className="text-center p-10 text-gray-500"><i className="fas fa-spinner fa-spin text-3xl text-[--brand-purple]"></i><p className="mt-2">Loading Marketing Center...</p></div>; }
    // Show fatal error only if initial load failed badly
    if (error && campaigns.length === 0 && templates.length === 0 && contentItems.length === 0 && segments.length === 0) {
        return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{error}</span></div>;
    }

    return (
        <div className="space-y-8" style={{'--brand-purple': themeColors.brandPurple, '--brand-purple-hover': themeColors.brandPurpleHover}}>
            {/* Display general error non-fatally */}
             {error && !isLoading && <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded relative m-4 text-sm" role="alert"><strong className="font-bold">Warning: </strong><span className="block sm:inline">{error}</span></div>}

            {/* Campaigns Section */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-4 pb-4 border-b">
                    <h2 className="text-xl font-semibold text-[--brand-purple]"><i className="fas fa-paper-plane mr-2"></i>Campaigns</h2>
                    {/* Connect Button to open modal */}
                    <Button onClick={openCampaignModal} variant="brand" className="px-4 py-1.5 text-xs"><i className="fas fa-plus mr-2"></i>New Campaign</Button>
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead><tr className="bg-gray-50"> <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th> <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th> <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent</th> <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Open%</th> <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Click%</th> <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Leads</th> <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> </tr></thead>
                        <tbody className="divide-y divide-gray-200">
                            {campaigns.length === 0 ? ( <tr><td colSpan="8" className="text-center py-6 text-gray-500 italic">No campaigns found.</td></tr> ) : (
                                campaigns.map(c => ( <tr key={c.id} className="hover:bg-gray-50"> <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{c.name}</td> <td className="px-4 py-3 whitespace-nowrap"><span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getCampaignStatusClass(c.status)}`}>{c.status || 'N/A'}</span></td> <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{c.targetSegmentName?.String || 'N/A'}</td> <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(c.sentAt?.Time)}</td> <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">{c.statsOpens?.Valid ? c.statsOpens.Int64 + '%' : '-'}</td> <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">{c.statsClicks?.Valid ? c.statsClicks.Int64 + '%' : '-'}</td> <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">{c.statsLeads?.Valid ? c.statsLeads.Int64 : '-'}</td> <td className="px-4 py-3 whitespace-nowrap text-xs font-medium space-x-2"> <button onClick={() => handleCampaignAction('Stats', c.id)} className="text-purple-600 hover:text-purple-800" title="View Stats"><i className="fas fa-chart-bar"></i></button> <button onClick={() => handleCampaignAction('Edit', c.id)} className="text-blue-600 hover:text-blue-800" title="Edit"><i className="fas fa-pencil-alt"></i></button> <button onClick={() => handleCampaignAction('Duplicate', c.id)} className="text-gray-500 hover:text-gray-700" title="Duplicate"><i className="fas fa-copy"></i></button> </td> </tr> ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Templates Section */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                 <h2 className="text-xl font-semibold text-[--brand-purple] mb-4 pb-4 border-b"><i className="fas fa-envelope-open-text mr-2"></i>Templates</h2>
                 {templates.length === 0 ? ( <p className="text-sm text-gray-500 italic">No templates available.</p> ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {templates.map(t => ( <div key={t.id} className="border rounded-lg p-3 text-center hover:shadow-md transition-shadow flex flex-col"> <i className={`${getTemplateIcon(t.type)} text-3xl text-purple-400 mb-2 mx-auto`}></i> <h4 className="text-sm font-medium mb-1">{t.name}</h4> <p className="text-xs text-gray-500 mb-1">({t.category || 'General'})</p> <p className="text-xs text-gray-500 mb-3 flex-grow">{t.previewText?.String || 'No preview.'}</p> <Button onClick={() => handleUseTemplate(t.id)} variant="outlineSm" className="w-full mt-auto text-purple-700 border-purple-300 hover:bg-purple-50 text-xs">Use Template</Button> </div> ))}
                    </div>
                 )}
            </div>

            {/* Content Library Section */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                 <h2 className="text-xl font-semibold text-[--brand-purple] mb-4 pb-4 border-b"><i className="fas fa-photo-video mr-2"></i>Content Library</h2>
                  {contentItems.length === 0 ? ( <p className="text-sm text-gray-500 italic">No content available.</p> ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {contentItems.map(item => ( <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"> <img src={item.thumbnailUrl?.String || `https://placehold.co/300x150/cccccc/ffffff?text=${item.contentType}`} alt={item.title} className="w-full h-24 object-cover bg-gray-100" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/300x150/cccccc/ffffff?text=Error'; }}/> <div className="p-3"> <h4 className="text-sm font-medium mb-1 truncate" title={item.title}>{item.title}</h4> <p className="text-xs text-gray-500 mb-2">{item.contentType}</p> <button onClick={() => handleDownloadContent(item.gcsUrl)} className="text-xs text-purple-600 hover:underline disabled:text-gray-400 disabled:no-underline" disabled={!item.gcsUrl}> {item.gcsUrl ? 'View/Download' : 'No Link'} </button> </div> </div> ))}
                    </div>
                 )}
            </div>

            {/* Client Segments Section */}
             <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                 <div className="flex flex-wrap justify-between items-center gap-4 mb-4 pb-4 border-b">
                    <h2 className="text-xl font-semibold text-[--brand-purple]"><i className="fas fa-users-cog mr-2"></i>Client Segments</h2>
                    {/* Connect Button to open modal */}
                    <Button onClick={openSegmentModal} variant="outlineSm" className="text-xs"><i className="fas fa-plus mr-1"></i> Create Segment</Button>
                 </div>
                 <p className="text-sm text-gray-600 mb-4">Manage client groups for targeted marketing or analysis.</p>
                 <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-md text-sm text-purple-800"> <i className="fas fa-lightbulb mr-1"></i> **AI Suggestion:** Create segments based on AI policy recommendations. </div>
                 {segments.length === 0 ? ( <p className="text-sm text-gray-500 italic">No segments created yet.</p> ) : (
                    <ul className="space-y-2">
                        {segments.map(s => ( <li key={s.id} className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50"> <div> <span className="font-medium text-sm text-gray-800">{s.name}</span> <span className="text-xs text-gray-500 ml-2">({s.clientCount?.Int64 || 0} Clients)</span> {s.criteria?.Valid && <p className="text-xs text-gray-500 italic mt-1">Criteria: {s.criteria.String}</p>} </div> <Button onClick={() => handleViewEditSegment(s.id)} variant="outlineSm" className="px-3 py-1 text-xs">View/Edit</Button> </li> ))}
                    </ul>
                 )}
             </div>

             {/* Render Modals */}
             <CreateSegmentModal
                isOpen={isSegmentModalOpen}
                onClose={closeSegmentModal}
                onSegmentCreated={handleSegmentCreated}
             />
              <CreateCampaignModal
                isOpen={isCampaignModalOpen}
                onClose={closeCampaignModal}
                onCampaignCreated={handleCampaignCreated}
                segments={segments} // Pass fetched segments to modal
                templates={templates} // Pass fetched templates to modal
             />
        </div>
      );
    };

     export default MarketingPage; // Use this if saving as separate file
    