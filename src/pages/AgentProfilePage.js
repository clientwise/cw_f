import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import Button from '../components/common/Button'; // Adjust path if needed
// Import the new modals
import EditAgentProfileModal from '../components/agent/EditAgentProfileModal'; // Adjust path
import EditAgentGoalModal from '../components/agent/EditAgentGoalModal'; // Adjust path

// Assume themeColors and helpers are defined or imported
const themeColors = { brandPurple: '#5a239e', /* ... */ };
const formatDate = (dateString) => { /* ... */ };

const AgentProfilePage = () => {
    // const { userInfo } = useOutletContext();
    const [agentProfile, setAgentProfile] = useState(null); // Will hold FullAgentProfile
    const [agentGoal, setAgentGoal] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for modals
    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    const [isEditGoalModalOpen, setIsEditGoalModalOpen] = useState(false);

    // Fetch agent profile and goal data
    const fetchAgentData = useCallback(async () => {
        // Don't reset loading on refresh, only on initial load
        setError(null);
        const token = localStorage.getItem('authToken');
        if (!token) { setError("Authentication error."); setIsLoading(false); return; }

        const headers = { 'Authorization': `Bearer ${token}` };
        const profileUrl = `http://localhost:8080/api/agents/profile`;
        const goalUrl = `http://localhost:8080/api/agents/goals`;

        try {
            const [profileRes, goalRes] = await Promise.all([
                fetch(profileUrl, { headers }),
                fetch(goalUrl, { headers })
            ]);

            // Process Profile Response
            if (!profileRes.ok) {
                let errorMsg = `Error fetching profile: ${profileRes.status}`;
                try { const d = await profileRes.json(); errorMsg = d.error || errorMsg; } catch (e) {}
                throw new Error(errorMsg);
            }
            const profileData = await profileRes.json();
            console.log(profileData,"profileData")
            setAgentProfile(profileData || null);

             // Process Goal Response
            if (!goalRes.ok) {
                // Don't throw fatal error if goals fail, just log & clear
                let errorMsg = `Error fetching goals: ${goalRes.status}`;
                try { const d = await goalRes.json(); errorMsg = d.error || errorMsg; } catch (e) {}
                console.error(errorMsg);
                setAgentGoal(null); // Set to null or default if fetch fails
            } else {
                 const goalData = await goalRes.json();
                 setAgentGoal(goalData || null); // Set to null if API returns empty/null
            }

        } catch (err) {
            console.error("Failed to fetch agent data:", err);
            setError(err.message || "Could not load agent data.");
            setAgentProfile(null);
            setAgentGoal(null);
        } finally {
            setIsLoading(false); // Stop loading after all fetches attempt
        }
    }, []); // No dependencies needed if only fetching logged-in user's data

    useEffect(() => {
        fetchAgentData();
    }, [fetchAgentData]);

    // Handlers for modals
    const openEditProfileModal = () => setIsEditProfileModalOpen(true);
    const closeEditProfileModal = () => setIsEditProfileModalOpen(false);
    const handleProfileUpdated = () => { fetchAgentData(); }; // Refetch all data on update

    const openEditGoalModal = () => setIsEditGoalModalOpen(true);
    const closeEditGoalModal = () => setIsEditGoalModalOpen(false);
    const handleGoalUpdated = () => { fetchAgentData(); }; // Refetch all data on update


    // --- Rendering Logic ---
    console.log(agentProfile,"agentProfile")
    if (isLoading) { return <div className="text-center p-10 text-gray-500"><i className="fas fa-spinner fa-spin text-3xl text-[--brand-purple]"></i><p className="mt-2">Loading Profile...</p></div>; }
    if (error && !agentProfile) { return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{error}</span></div>; }
    if (!agentProfile) { return <div className="text-center p-10 text-gray-500">Could not load agent profile.</div>; }

    // Extract embedded parts for clarity
    const userPart = agentProfile.User;
    const profilePart = agentProfile.AgentProfile;

    return (
        <div style={{'--brand-purple': themeColors.brandPurple}}>
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">My Profile</h2>
                <Button onClick={openEditProfileModal} variant="brand" className="px-4 py-2 text-sm">
                    <i className="fas fa-pencil-alt mr-2"></i>Edit Profile
                </Button>
            </div>
            {/* Display non-fatal error if profile loaded but goals failed */}
             {error && agentProfile && <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded relative m-4 text-sm" role="alert"><strong>Warning: </strong><span className="block sm:inline">{error}</span></div>}


            {/* Profile Details Card */}
            <div className="bg-white rounded-lg shadow p-6 md:p-8 border border-gray-200 mb-6">
                 <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-3 border-b">Account & Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 text-sm">
                    {/* Column 1 */}
                    <div className="md:col-span-1 space-y-4">
                        <div> <dt className="font-medium text-gray-500">Email Address</dt> <dd className="text-gray-800 mt-1">{userPart?.email || 'N/A'}</dd> </div>
                        <div> <dt className="font-medium text-gray-500">Mobile Number</dt> <dd className="text-gray-800 mt-1">{profilePart?.mobile?.String || <span className="italic text-gray-400">Not Set</span>}</dd> </div>
                        <div> <dt className="font-medium text-gray-500">Gender</dt> <dd className="text-gray-800 mt-1">{profilePart?.gender?.String || <span className="italic text-gray-400">Not Set</span>}</dd> </div>
                         <div> <dt className="font-medium text-gray-500">Profile Created</dt> <dd className="text-gray-800 mt-1">{formatDate(userPart?.createdAt) || 'N/A'}</dd> </div>
                    </div>
                    {/* Column 2 */}
                    <div className="md:col-span-2 space-y-4">
                         <div> <dt className="font-medium text-gray-500">Postal Address</dt> <dd className="text-gray-800 mt-1 whitespace-pre-line">{profilePart?.postalAddress?.String || <span className="italic text-gray-400">Not Set</span>}</dd> </div>
                        {userPart?.userType === 'agent' && (
                             <div> <dt className="font-medium text-gray-500">Agency Name</dt> <dd className="text-gray-800 mt-1">{profilePart?.agencyName?.String || <span className="italic text-gray-400">Not Set / Not Applicable</span>}</dd> </div>
                        )}
                         <div> <dt className="font-medium text-gray-500">PAN</dt> <dd className="text-gray-800 mt-1">{profilePart?.pan?.String || <span className="italic text-gray-400">Not Set</span>}</dd> </div>
                    </div>
                </div>
            </div>

             {/* Banking Details Card */}
            <div className="bg-white rounded-lg shadow p-6 md:p-8 border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 pb-3 border-b">Banking Details (for Payouts)</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4 text-sm">
                     <div> <dt className="font-medium text-gray-500">Bank Name</dt> <dd className="text-gray-800 mt-1">{profilePart?.bankName?.String || <span className="italic text-gray-400">Not Set</span>}</dd> </div>
                     <div> <dt className="font-medium text-gray-500">Account Number</dt> <dd className="text-gray-800 mt-1">{profilePart?.bankAccountNo?.String || <span className="italic text-gray-400">Not Set</span>}</dd> </div>
                     <div> <dt className="font-medium text-gray-500">IFSC Code</dt> <dd className="text-gray-800 mt-1">{profilePart?.bankIfsc?.String || <span className="italic text-gray-400">Not Set</span>}</dd> </div>
                 </div>
            </div>

             {/* Goals Card */}
            <div className="bg-white rounded-lg shadow p-6 md:p-8 border border-gray-200">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-4 pb-3 border-b">
                    <h3 className="text-lg font-semibold text-gray-700">My Goals</h3>
                    <Button onClick={openEditGoalModal} variant="outlineSm" className="text-xs">
                        <i className="fas fa-pencil-alt mr-2"></i>Set/Update Goal
                    </Button>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                     <div>
                        <dt className="font-medium text-gray-500">Target Income (₹)</dt>
                        <dd className="text-gray-800 mt-1 text-lg font-semibold text-green-600">
                            {agentGoal?.targetIncome?.Valid ? agentGoal.targetIncome.Float64.toLocaleString('en-IN') : <span className="italic text-gray-400 text-sm font-normal">Not Set</span>}
                        </dd>
                     </div>
                     <div>
                        <dt className="font-medium text-gray-500">Target Period</dt>
                        <dd className="text-gray-800 mt-1">
                            {agentGoal?.targetPeriod?.String || <span className="italic text-gray-400">Not Set</span>}
                        </dd>
                     </div>
                 </div>
            </div>

            {/* Render Modals */}
            <EditAgentProfileModal
                isOpen={isEditProfileModalOpen}
                onClose={closeEditProfileModal}
                onProfileUpdated={handleProfileUpdated}
                currentProfile={profilePart} // Pass only the profile part
            />
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

// --- Ensure necessary components are imported correctly ---
// (Button, InputField, EditAgentProfileModal, EditAgentGoalModal)

