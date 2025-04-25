// src/pages/AgentProfilePage.js (Example Path)
import React, { useState, useEffect, useCallback, useMemo } from 'react'; // Added useMemo
import { useOutletContext } from 'react-router-dom';
import Button from '../components/common/Button'; // Adjust path if needed
import EditAgentProfileModal from '../components/agent/EditAgentProfileModal'; // Adjust path
import EditAgentGoalModal from '../components/agent/EditAgentGoalModal'; // Adjust path
import EditInsurerDetailsModal from '../components/agent/EditInsurerDetailsModal'; // Adjust path

// Assume themeColors and helper functions are defined or imported globally/context
const themeColors = { brandPurple: '#5a239e', brandPurpleHover: '#703abc', /* ... */ };
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
        return 'Invalid Date';
    }
}; // Ensure this helper is defined/imported

const AgentProfilePage = () => {
    const { userInfo } = useOutletContext(); // Get logged-in user info (may be null initially)
    const [agentProfileData, setAgentProfileData] = useState(null); // Holds FullAgentProfileWithPOCs
    const [agentGoal, setAgentGoal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for modals
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    const [isEditGoalModalOpen, setIsEditGoalModalOpen] = useState(false);
    const [isEditPocModalOpen, setIsEditPocModalOpen] = useState(false); // State for the POC modal

    // Fetch agent profile (includes POCs) and goal data
    const fetchAgentData = useCallback(async (refreshType = 'all') => {
        // Only set loading true on full initial load triggered by useEffect mount
        const isFullLoad = refreshType === 'all';
        if (isFullLoad) setIsLoading(true);
        // Always clear error on fetch attempt
        setError(null);

        const token = localStorage.getItem('authToken');
        if (!token || !userInfo?.userId) {
            console.log("Fetch skipped, waiting for user info or token.");
            if (isFullLoad) setIsLoading(false);
            return;
        }

        const headers = { 'Authorization': `Bearer ${token}` };
        // Adjust API endpoint if your profile endpoint doesn't include InsurerPOCs
        const profileUrl = `https://api.goclientwise.com/api/agents/profile`; // Assumes this returns FullAgentProfileWithPOCs structure
        const goalUrl = `https://api.goclientwise.com/api/agents/goals`;

        // Helper to fetch and handle errors for individual endpoints
        const fetchApi = async (url, setter, isList = false) => {
             try {
                 const response = await fetch(url, { headers });
                 if (!response.ok) { let e = `Error (${response.status})`; try { const d = await response.json(); e = d.error || d.message || e; } catch {} throw new Error(e); }
                 const data = await response.json();
                 setter(isList ? (data || []) : (data || null));
                 return { status: 'fulfilled' };
             } catch (err) { console.error(`Failed to fetch ${url}:`, err); setError(prev => prev || err.message || "Failed to load some data."); setter(isList ? [] : null); return { status: 'rejected', reason: err }; }
        };

        try {
            console.log(`Starting agent data fetch (type: ${refreshType})...`);
            const promisesToRun = [];
            // Ensure correct endpoint is called based on refreshType
            if (isFullLoad || refreshType === 'profile') promisesToRun.push(fetchApi(profileUrl, setAgentProfileData, false));
            if (isFullLoad || refreshType === 'goal') promisesToRun.push(fetchApi(goalUrl, setAgentGoal, false));

            await Promise.allSettled(promisesToRun);
            console.log("Agent data fetch attempt finished.");

        } catch (err) { console.error("Error during fetchAgentData:", err); if (!error) setError(err.message || "Error fetching data."); }
        finally { if (isFullLoad) setIsLoading(false); }
    }, [userInfo]); // Include userInfo as it's checked inside

    // --- UPDATED useEffect Hook ---
    useEffect(() => {
        if (userInfo?.userId) {
            console.log("useEffect triggered: Fetching initial agent data...");
            // setIsLoading(true); // Set loading only within fetchAgentData for 'all' type
            fetchAgentData('all');
        } else {
            console.log("useEffect triggered: Waiting for userInfo...");
            setIsLoading(false); // Not truly loading if no user info yet
        }
    }, [userInfo, fetchAgentData]); // fetchAgentData is stable due to useCallback.


    // Handlers for modals
    const openEditProfileModal = () => setIsEditProfileModalOpen(true);
    const closeEditProfileModal = () => setIsEditProfileModalOpen(false);
    const handleProfileUpdated = () => { closeEditProfileModal(); fetchAgentData('profile'); };

    const openEditGoalModal = () => setIsEditGoalModalOpen(true);
    const closeEditGoalModal = () => setIsEditGoalModalOpen(false);
    const handleGoalUpdated = () => { closeEditGoalModal(); fetchAgentData('goal'); };

    const openEditPocModal = () => setIsEditPocModalOpen(true);
    const closeEditPocModal = () => setIsEditPocModalOpen(false);
    // Renamed handler to match prop passed to modal
    const handleInsurerDetailsUpdated = () => {
        closeEditPocModal();
        // POCs/Details are part of the main profile data, so refetch profile
        fetchAgentData('profile');
    };


    // **THE FIX PART 1: Stabilize the prop using useMemo**
    // This ensures the array reference passed to the modal only changes when the
    // actual InsurerPOCs data from the API changes.
    const stableInsurerDetailsForModal = useMemo(() => {
        console.log("Parent: useMemo recalculating stableInsurerDetailsForModal");
        // Extract the POCs/Details array from the main profile data
        // IMPORTANT: Adjust 'InsurerPOCs' if your API returns a different field name
        const pocsOrDetails = agentProfileData?.InsurerPOCs || []; // Or agentProfileData?.details or similar

        // Map the data to the structure expected by EditInsurerDetailsModal's internal state
        return pocsOrDetails.map(poc => ({
            insurerName: poc.insurerName || '',
            // Map pocEmail to spocEmail. Leave others blank/null if not available in POC data.
            spocEmail: poc.pocEmail || poc.spocEmail?.String || '', // Handle both direct email or NullString if API varies
            agentCode: poc.agentCode?.String || '', // Handle potential NullString for agent code
            commissionPercentage: poc.commissionPercentage?.Valid ? poc.commissionPercentage.Float64.toString() : '', // Handle potential NullFloat64
             // Add other fields expected by the modal, defaulting to empty/null
             // id: poc.id || null, // Keep track of original ID if needed for updates? Modal doesn't use it currently.
        }));
    }, [agentProfileData?.InsurerPOCs]); // Dependency is the specific array within the state


    // --- Rendering Logic ---
    if (isLoading) { return <div className="text-center p-10 text-gray-500"><i className="fas fa-spinner fa-spin text-3xl text-[--brand-purple]"></i><p className="mt-2">Loading Profile...</p></div>; }
    if (error && !agentProfileData && !isLoading) { return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{error}</span> <Button onClick={() => fetchAgentData('all')} variant="outlineSm" className="ml-2">Retry</Button></div>; }
    if (!agentProfileData && userInfo && !isLoading) { return <div className="text-center p-10 text-gray-500">Could not load agent profile data. {error && `(${error})`}</div>; }
    if (!userInfo) { return <div className="text-center p-10 text-gray-500">User information not available. Please log in.</div>; }


    // Extract parts for easier access only after ensuring agentProfileData exists
    // Assuming agentProfileData holds the entire structure now
    const userPart = agentProfileData;
    const profilePart = agentProfileData;
    // Display POCs directly from the source data
    const insurerPOCsToDisplay = agentProfileData?.InsurerPOCs || [];


    return (
        <div style={{'--brand-purple': themeColors.brandPurple}}>
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">My Profile</h2>
                {/* Edit Profile Button */}
                <Button onClick={openEditProfileModal} variant="brand" className="px-4 py-2 text-sm">
                    <i className="fas fa-pencil-alt mr-2"></i>Edit Profile
                </Button>
            </div>

            {/* Display non-fatal error if profile loaded but subsequent fetches failed */}
             {error && agentProfileData && <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded relative mb-4 text-sm" role="alert"><strong>Warning: </strong><span className="block sm:inline">{error}</span></div>}

            {/* Profile Details Card */}
            <div className="bg-white rounded-lg shadow p-6 md:p-8 border border-gray-200 mb-6">
                 <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-3 border-b">Account & Personal Information</h3>
                 <dl className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 text-sm">
                     {/* Column 1 */}
                     <div className="md:col-span-1 space-y-4">
                         <div> <dt className="font-medium text-gray-500">Email Address</dt> <dd className="text-gray-800 mt-1">{userPart?.email || 'N/A'}</dd> </div>
                         <div> <dt className="font-medium text-gray-500">Mobile Number</dt> <dd className="text-gray-800 mt-1">{profilePart?.mobile?.String || <span className="italic text-gray-400">Not Set</span>}</dd> </div>
                         <div> <dt className="font-medium text-gray-500">Gender</dt> <dd className="text-gray-800 mt-1">{profilePart?.gender?.String || <span className="italic text-gray-400">Not Set</span>}</dd> </div>
                         <div> <dt className="font-medium text-gray-500">Profile Created</dt> <dd className="text-gray-800 mt-1">{formatDate(userPart?.createdAt)}</dd> </div>
                         <div> <dt className="font-medium text-gray-500">User Type</dt> <dd className="text-gray-800 mt-1 capitalize">{userPart?.userType || 'N/A'}</dd> </div>
                     </div>
                     {/* Column 2&3 */}
                     <div className="md:col-span-2 space-y-4">
                         <div> <dt className="font-medium text-gray-500">Postal Address</dt> <dd className="text-gray-800 mt-1 whitespace-pre-line">{profilePart?.postalAddress?.String || <span className="italic text-gray-400">Not Set</span>}</dd> </div>
                         {userPart?.userType === 'agent' && ( <div> <dt className="font-medium text-gray-500">Agency Name</dt> <dd className="text-gray-800 mt-1">{profilePart?.agencyName?.String || <span className="italic text-gray-400">Not Set / Not Applicable</span>}</dd> </div> )}
                         <div> <dt className="font-medium text-gray-500">PAN</dt> <dd className="text-gray-800 mt-1">{profilePart?.pan?.String || <span className="italic text-gray-400">Not Set</span>}</dd> </div>
                     </div>
                 </dl>
             </div>


            {/* Banking Details Card */}
             <div className="bg-white rounded-lg shadow p-6 md:p-8 border border-gray-200 mb-6">
                 <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-3 border-b">Banking Details (for Payouts)</h3>
                 <dl className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 text-sm">
                     <div> <dt className="font-medium text-gray-500">Bank Name</dt> <dd className="text-gray-800 mt-1">{profilePart?.bankName?.String || <span className="italic text-gray-400">Not Set</span>}</dd> </div>
                     <div> <dt className="font-medium text-gray-500">Account Number</dt> <dd className="text-gray-800 mt-1">{profilePart?.bankAccountNo?.String || <span className="italic text-gray-400">Not Set</span>}</dd> </div>
                     <div> <dt className="font-medium text-gray-500">IFSC Code</dt> <dd className="text-gray-800 mt-1">{profilePart?.bankIfsc?.String || <span className="italic text-gray-400">Not Set</span>}</dd> </div>
                 </dl>
             </div>


            {/* Insurer Contacts/Details Card */}
            <div className="bg-white rounded-lg shadow p-6 md:p-8 border border-gray-200 mb-6">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-4 pb-3 border-b">
                    <h3 className="text-lg font-semibold text-gray-700">Insurer Details & Contacts</h3>
                    {/* This button now opens the modal for editing details/POCs */}
                    <Button onClick={openEditPocModal} variant="outlineSm" className="text-xs">
                        <i className="fas fa-pencil-alt mr-2"></i>Edit Details/Contacts
                    </Button>
                </div>
                {/* Display the POCs/Details from the source data */}
                {insurerPOCsToDisplay.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No insurer details or contacts saved.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left font-medium text-gray-500 tracking-wider">Insurer Name</th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-500 tracking-wider">Agent Code</th>
                                    <th className="px-4 py-2 text-left font-medium text-gray-500 tracking-wider">SPOC Email</th>
                                    <th className="px-4 py-2 text-right font-medium text-gray-500 tracking-wider">Commission %</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {insurerPOCsToDisplay.map((item, index) => (
                                    <tr key={item.id || index}>
                                        <td className="px-4 py-2 whitespace-nowrap text-gray-800">{item.insurerName || '-'}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-gray-800">{item.agent_code?.String || item.agentCode?.String || '-'}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-gray-800">{item.pocEmail || item.spoc_email?.String || item.spocEmail?.String || '-'}</td>
                                        <td className="px-4 py-2 whitespace-nowrap text-right text-gray-800">{item.commission_percentage?.Valid ? item.commission_percentage.Float64 + '%' : '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>


            {/* Goals Card */}
            <div className="bg-white rounded-lg shadow p-6 md:p-8 border border-gray-200">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-4 pb-3 border-b">
                    <h3 className="text-lg font-semibold text-gray-700">My Goals</h3>
                    <Button onClick={openEditGoalModal} variant="outlineSm" className="text-xs">
                        <i className="fas fa-pencil-alt mr-2"></i>Set/Update Goal
                    </Button>
                </div>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <div> <dt className="font-medium text-gray-500">Target Income (₹)</dt> <dd className="text-gray-800 mt-1 text-lg font-semibold text-green-600"> {agentGoal?.targetIncome?.Valid ? agentGoal.targetIncome.Float64.toLocaleString('en-IN') : <span className="italic text-gray-400 text-sm font-normal">Not Set</span>} </dd> </div>
                    <div> <dt className="font-medium text-gray-500">Target Period</dt> <dd className="text-gray-800 mt-1"> {agentGoal?.targetPeriod?.String || <span className="italic text-gray-400">Not Set</span>} </dd> </div>
                </dl>
            </div>

            {/* Render Modals */}
            {/* Ensure agentProfileData exists before rendering modals that depend on it */}
            {agentProfileData && (
                <>
                    <EditAgentProfileModal
                        isOpen={isEditProfileModalOpen}
                        onClose={closeEditProfileModal}
                        onProfileUpdated={handleProfileUpdated}
                        // Pass only the necessary profile part, excluding potentially large/complex nested objects if possible
                        currentProfileData={agentProfileData} // Or map to a simpler structure if needed
                    />

                    {/* ** THE FIX PART 2 & 3: Use stable prop + Correct prop name + Correct structure ** */}
                    <EditInsurerDetailsModal
                        isOpen={isEditPocModalOpen}
                        onClose={closeEditPocModal}
                        onDetailsUpdated={handleInsurerDetailsUpdated} // Use correct callback name expected by modal
                        currentDetails={stableInsurerDetailsForModal}  // Pass STABLE data with CORRECT prop name and STRUCTURE
                    />
                </>
            )}

             {/* Goal modal can be rendered even if profile data is missing */}
            <EditAgentGoalModal
                isOpen={isEditGoalModalOpen}
                onClose={closeEditGoalModal}
                onGoalUpdated={handleGoalUpdated}
                currentGoal={agentGoal}
            />

        </div>
    );
};

export default AgentProfilePage;