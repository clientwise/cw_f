import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import Button from '../components/common/Button'; // Adjust path if needed
import EditAgentProfileModal from '../components/agent/EditAgentProfileModal'; // Adjust path
import EditAgentGoalModal from '../components/agent/EditAgentGoalModal'; // Adjust path
import EditInsurerDetailsModal from '../components/agent/EditInsurerDetailsModal'; // Adjust path

// Assume themeColors and helper functions are defined or imported globally/context
const themeColors = { brandPurple: '#5a239e', brandPurpleHover: '#703abc', /* ... */ };
const formatDate = (dateString) => { /* ... */ }; // Ensure this helper is defined/imported

const AgentProfilePage = () => {
    const { userInfo } = useOutletContext(); // Get logged-in user info (may be null initially)
    const [agentProfileData, setAgentProfileData] = useState(null); // Holds FullAgentProfileWithPOCs
    const [agentGoal, setAgentGoal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for modals
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    const [isEditGoalModalOpen, setIsEditGoalModalOpen] = useState(false);
    const [isEditPocModalOpen, setIsEditPocModalOpen] = useState(false);

    // Fetch agent profile (includes POCs) and goal data
    // useCallback ensures this function reference is stable unless dependencies change
    const fetchAgentData = useCallback(async (refreshType = 'all') => {
        // Only set loading true on full initial load triggered by useEffect mount
        const isFullLoad = refreshType === 'all';
        if (isFullLoad) setIsLoading(true);
        // Always clear error on fetch attempt
        setError(null);

        const token = localStorage.getItem('authToken');
        // Check userInfo availability as well, since some data depends on it
        if (!token || !userInfo?.userId) {
             // Don't set a persistent error here if userInfo is just loading, wait for it
             console.log("Fetch skipped, waiting for user info or token.");
             if (isFullLoad) setIsLoading(false); // Stop initial load if no token/user
             return;
        }

        const headers = { 'Authorization': `Bearer ${token}` };
        const profileUrl = `https://api.goclientwise.com/api/agents/profile`;
        const goalUrl = `https://api.goclientwise.com/api/agents/goals`;

        // Helper to fetch and handle errors for individual endpoints
        const fetchApi = async (url, setter, isList = false) => {
             try {
                const response = await fetch(url, { headers });
                if (!response.ok) { let e = `Error (${response.status})`; try { const d = await response.json(); e = d.error || e; } catch {} throw new Error(e); }
                const data = await response.json();
                setter(isList ? (data || []) : (data || null)); // Ensure lists are always arrays
                return { status: 'fulfilled' };
             } catch (err) { console.error(`Failed to fetch ${url}:`, err); setError(prev => prev || err.message || "Failed to load some data."); setter(isList ? [] : null); return { status: 'rejected', reason: err }; }
        };

        try {
            console.log("Starting agent data fetch...");
            const promisesToRun = [];
            // Fetch all data on full load or specific type on refresh
            if (isFullLoad || refreshType === 'profile') promisesToRun.push(fetchApi(profileUrl, setAgentProfileData, false));
            if (isFullLoad || refreshType === 'goal') promisesToRun.push(fetchApi(goalUrl, setAgentGoal, false));

            await Promise.allSettled(promisesToRun);
            console.log("Agent data fetch attempt finished.");

        } catch (err) { console.error("Error during fetchAgentData:", err); if (!error) setError(err.message || "Error fetching data."); }
        finally { if (isFullLoad) setIsLoading(false); } // Only stop initial load indicator
    // Dependencies: userInfo might be needed if API calls depended on it, but they use token.
    // Empty array means this function's identity is stable.
    }, [userInfo]); // Include userInfo as it's checked inside


    // --- UPDATED useEffect Hook ---
    useEffect(() => {
        // Fetch data only when userInfo is available (prevent fetch with null ID)
        if (userInfo?.userId) {
             console.log("useEffect triggered: Fetching initial agent data...");
             setIsLoading(true); // Set loading true for initial fetch run
             fetchAgentData('all');
        } else {
             console.log("useEffect triggered: Waiting for userInfo...");
             setIsLoading(false); // Not truly loading if no user info yet
        }
    // Use userInfo as dependency. fetchAgentData is stable due to useCallback.
    }, [userInfo, fetchAgentData]);
    // --- End Update ---


    // Handlers for modals
    const openEditProfileModal = () => setIsEditProfileModalOpen(true);
    const closeEditProfileModal = () => setIsEditProfileModalOpen(false);
    const handleProfileUpdated = () => { closeEditProfileModal(); fetchAgentData('profile'); }; // Refetch profile

    const openEditGoalModal = () => setIsEditGoalModalOpen(true);
    const closeEditGoalModal = () => setIsEditGoalModalOpen(false);
    const handleGoalUpdated = () => { closeEditGoalModal(); fetchAgentData('goal'); }; // Refetch goal

    const openEditPocModal = () => setIsEditPocModalOpen(true);
    const closeEditPocModal = () => setIsEditPocModalOpen(false);
    const handlePocsUpdated = () => { closeEditPocModal(); fetchAgentData('profile'); }; // Refetch profile (which includes POCs)


    // --- Rendering Logic ---
    if (isLoading) { return <div className="text-center p-10 text-gray-500"><i className="fas fa-spinner fa-spin text-3xl text-[--brand-purple]"></i><p className="mt-2">Loading Profile...</p></div>; }
    if (error && !agentProfileData) { return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{error}</span></div>; }
    // Handle case where userInfo loaded but profile fetch resulted in null (e.g., error after initial load)
    if (!agentProfileData && userInfo) { return <div className="text-center p-10 text-gray-500">Could not load agent profile data. {error && `(${error})`}</div>; }
    // Handle case where userInfo itself is not loaded (shouldn't happen if ProtectedRoute works)
    if (!userInfo) { return <div className="text-center p-10 text-gray-500">User information not available.</div>; }


    // Extract parts for easier access only after ensuring agentProfileData exists
    const userPart = agentProfileData;
    const profilePart = agentProfileData;
    const insurerPOCs = agentProfileData?.InsurerPOCs || [];

    return (
        <div style={{'--brand-purple': themeColors.brandPurple}}>
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">My Profile</h2>
                <Button onClick={openEditProfileModal} variant="brand" className="px-4 py-2 text-sm">
                    <i className="fas fa-pencil-alt mr-2"></i>Edit Profile
                </Button>
            </div>
            {/* Display non-fatal error if profile loaded but goals failed? */}
             {error && agentProfileData && <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded relative m-4 text-sm" role="alert"><strong>Warning: </strong><span className="block sm:inline">{error}</span></div>}


            {/* Profile Details Card */}
            <div className="bg-white rounded-lg shadow p-6 md:p-8 border border-gray-200 mb-6">
                {/* ... Rest of the display logic using userPart and profilePart ... */}
                 <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-3 border-b">Account & Personal Information</h3>
                <dl className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 text-sm">
                    {/* Column 1: Basic Info */}
                    <div className="md:col-span-1 space-y-4">
                        <div> <dt className="font-medium text-gray-500">Email Address</dt> <dd className="text-gray-800 mt-1">{userPart?.email || 'N/A'}</dd> </div>
                        <div> <dt className="font-medium text-gray-500">Mobile Number</dt> <dd className="text-gray-800 mt-1">{profilePart?.mobile?.String || <span className="italic text-gray-400">Not Set</span>}</dd> </div>
                        <div> <dt className="font-medium text-gray-500">Gender</dt> <dd className="text-gray-800 mt-1">{profilePart?.gender?.String || <span className="italic text-gray-400">Not Set</span>}</dd> </div>
                         <div> <dt className="font-medium text-gray-500">Profile Created</dt> <dd className="text-gray-800 mt-1">{formatDate(userPart?.createdAt) || 'N/A'}</dd> </div>
                         <div> <dt className="font-medium text-gray-500">User Type</dt> <dd className="text-gray-800 mt-1 capitalize">{userPart?.userType || 'N/A'}</dd> </div>
                    </div>
                    {/* Column 2&3: Address, Agency, PAN */}
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

            {/* Insurer Contacts Card */}
            <div className="bg-white rounded-lg shadow p-6 md:p-8 border border-gray-200 mb-6">
                <div className="flex justify-between items-center mb-4 pb-3 border-b">
                     <h3 className="text-lg font-semibold text-gray-700">Product Management</h3>
                     <Button onClick={openEditPocModal} variant="outlineSm" className="text-xs"> <i className="fas fa-pencil-alt mr-2"></i>Edit Contacts </Button>
                </div>
                 {insurerPOCs.length === 0 ? ( <p className="text-sm text-gray-500 italic">No insurer contacts saved.</p> ) : (
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                        {insurerPOCs.map((poc, index) => ( <div key={poc.id || index}> <dt className="font-medium text-gray-500">{poc.insurerName}</dt> <dd className="text-gray-800 mt-1 break-words">{poc.pocEmail}</dd> </div> ))}
                    </dl>
                 )}
            </div>

             {/* Goals Card */}
            <div className="bg-white rounded-lg shadow p-6 md:p-8 border border-gray-200">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-4 pb-3 border-b">
                    <h3 className="text-lg font-semibold text-gray-700">My Goals</h3>
                    <Button onClick={openEditGoalModal} variant="outlineSm" className="text-xs"> <i className="fas fa-pencil-alt mr-2"></i>Set/Update Goal </Button>
                </div>
                 <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                     <div> <dt className="font-medium text-gray-500">Target Income (₹)</dt> <dd className="text-gray-800 mt-1 text-lg font-semibold text-green-600"> {agentGoal?.targetIncome?.Valid ? agentGoal.targetIncome.Float64.toLocaleString('en-IN') : <span className="italic text-gray-400 text-sm font-normal">Not Set</span>} </dd> </div>
                     <div> <dt className="font-medium text-gray-500">Target Period</dt> <dd className="text-gray-800 mt-1"> {agentGoal?.targetPeriod?.String || <span className="italic text-gray-400">Not Set</span>} </dd> </div>
                 </dl>
            </div>

            {/* Render Modals */}
            <EditAgentProfileModal
                isOpen={isEditProfileModalOpen}
                onClose={closeEditProfileModal}
                onProfileUpdated={handleProfileUpdated}
                currentProfileData={profilePart} // Pass AgentProfile part
            />
             <EditAgentGoalModal
                isOpen={isEditGoalModalOpen}
                onClose={closeEditGoalModal}
                onGoalUpdated={handleGoalUpdated}
                currentGoal={agentGoal}
            />
             <EditInsurerDetailsModal
                isOpen={isEditPocModalOpen}
                onClose={closeEditPocModal}
                onPocsUpdated={handlePocsUpdated}
                currentPocs={insurerPOCs} // Pass POCs array
            />
        </div>
    );
};

export default AgentProfilePage;

