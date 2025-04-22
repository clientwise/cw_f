import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import Button from '../components/common/Button'; // Adjust path if needed
import EditAgentProfileModal from '../components/agent/EditAgentProfileModal'; // Adjust path
import EditAgentGoalModal from '../components/agent/EditAgentGoalModal'; // Adjust path
import EditInsurerPOCsModal from '../components/agent/EditInsurerPOCsModal'; // Adjust path

// Assume themeColors and helpers are defined or imported globally/context
const themeColors = {
    brandPurple: '#5a239e', brandPurpleHover: '#703abc',
    gray100: '#f3f4f6', gray200: '#e5e7eb', gray400: '#9ca3af',
    gray500: '#6b7280', gray700: '#374151', gray800: '#1f2937',
    white: '#ffffff', green100: '#dcfce7', green600: '#16a34a',
    red100: '#fee2e2', red700: '#b91c1c', yellow100: '#fef9c3',
    yellow800: '#854d0e',
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
         if (typeof dateString === 'object' && dateString !== null && dateString.Valid && dateString.Time) { dateString = dateString.Time; }
         else if (typeof dateString === 'object' && dateString !== null && !dateString.Valid) { return 'N/A'; }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) { console.warn("Date formatting error for:", dateString, e); return 'Error'; }
 };


const AgentProfilePage = () => {
    const { userInfo } = useOutletContext();
    const [agentProfileData, setAgentProfileData] = useState(null); // Holds FullAgentProfileWithPOCs
    const [agentGoal, setAgentGoal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for modals
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    const [isEditGoalModalOpen, setIsEditGoalModalOpen] = useState(false);
    const [isEditPocModalOpen, setIsEditPocModalOpen] = useState(false);

    // Fetch agent profile (includes POCs) and goal data
    const fetchAgentData = useCallback(async () => {
        // Reset states on refetch only if needed, keep isLoading for initial load
        setError(null);
        const token = localStorage.getItem('authToken');
        if (!token) { setError("Authentication error."); setIsLoading(false); return; }

        const headers = { 'Authorization': `Bearer ${token}` };
        const profileUrl = `https://api.goclientwise.com/api/agents/profile`;
        const goalUrl = `https://api.goclientwise.com/api/agents/goals`;

        try {
            // Set loading true only if it's not already loading (prevent flicker on refresh)
             if (!isLoading) setIsLoading(true);

            const [profileRes, goalRes] = await Promise.all([
                fetch(profileUrl, { headers }),
                fetch(goalUrl, { headers })
            ]);

            // Process Profile Response
            if (!profileRes.ok) { let e = `Profile Error (${profileRes.status})`; try{const d=await profileRes.json();e=d.error||e;}catch{} throw new Error(e); }
            const profileData = await profileRes.json();
            setAgentProfileData(profileData || null); // Expects FullAgentProfileWithPOCs

             // Process Goal Response
            if (!goalRes.ok) { let e = `Goal Error (${goalRes.status})`; try{const d=await goalRes.json();e=d.error||e;}catch{} console.error(e); setAgentGoal(null); }
            else { const goalData = await goalRes.json(); setAgentGoal(goalData || null); }

        } catch (err) { console.error("Failed fetch agent data:", err); setError(err.message || "Could not load data."); setAgentProfileData(null); setAgentGoal(null); }
        finally { setIsLoading(false); } // Stop loading after all fetches attempt
    }, [isLoading]); // Depend on isLoading to avoid loop if fetchAgentData causes state change triggering useEffect

    useEffect(() => {
        setIsLoading(true); // Set loading true on initial mount fetch
        fetchAgentData();
    }, [fetchAgentData]); // Rerun if fetchAgentData definition changes (it shouldn't here)

    // Handlers for modals
    const openEditProfileModal = () => setIsEditProfileModalOpen(true);
    const closeEditProfileModal = () => setIsEditProfileModalOpen(false);
    const handleProfileUpdated = () => { fetchAgentData(); }; // Refetch all data

    const openEditGoalModal = () => setIsEditGoalModalOpen(true);
    const closeEditGoalModal = () => setIsEditGoalModalOpen(false);
    const handleGoalUpdated = () => { fetchAgentData(); }; // Refetch all

    const openEditPocModal = () => setIsEditPocModalOpen(true);
    const closeEditPocModal = () => setIsEditPocModalOpen(false);
    const handlePocsUpdated = () => { fetchAgentData(); }; // Refetch all


    // --- Rendering Logic ---
    if (isLoading) { return <div className="text-center p-10 text-gray-500"><i className="fas fa-spinner fa-spin text-3xl text-[--brand-purple]"></i><p className="mt-2">Loading Profile...</p></div>; }
    if (error && !agentProfileData) { return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{error}</span></div>; }
    if (!agentProfileData) { return <div className="text-center p-10 text-gray-500">Could not load agent profile.</div>; }

    // Extract parts for easier access
    const userPart = agentProfileData?.User; // Basic user info
    const profilePart = agentProfileData?.AgentProfile; // Extended profile
    const insurerPOCs = agentProfileData?.InsurerPOCs || []; // Insurer contacts

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
                     <h3 className="text-lg font-semibold text-gray-700">Insurer Contacts (POCs)</h3>
                     <Button onClick={openEditPocModal} variant="outlineSm" className="text-xs"> <i className="fas fa-pencil-alt mr-2"></i>Edit Contacts </Button>
                </div>
                 {insurerPOCs.length === 0 ? ( <p className="text-sm text-gray-500 italic">No insurer contacts saved. Click 'Edit Contacts' to add.</p> ) : (
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
                currentProfileData={profilePart} // Pass only AgentProfile part
            />
             <EditAgentGoalModal
                isOpen={isEditGoalModalOpen}
                onClose={closeEditGoalModal}
                onGoalUpdated={handleGoalUpdated}
                currentGoal={agentGoal}
            />
             <EditInsurerPOCsModal
                isOpen={isEditPocModalOpen}
                onClose={closeEditPocModal}
                onPocsUpdated={handlePocsUpdated}
                currentPocs={insurerPOCs} // Pass the POCs array
            />
        </div>
    );
};

export default AgentProfilePage;
