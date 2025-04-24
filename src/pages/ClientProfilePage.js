import React, { useState, useEffect, useCallback,useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Import common components (adjust paths as needed)
import Button from '../components/common/Button';
// Import the specific modal components for this page (adjust paths as needed)
import ClientReferralTools from '../components/clients/ClientReferralTools';
import ShareSummaryModal from '../components/clients/ShareSummaryModal';
import LogInteractionModal from '../components/clients/LogInteractionModal';
import AddTaskModal from '../components/clients/AddTaskModal';
import AddPolicyModal from '../components/clients/AddPolicyModal';
import UploadDocumentModal from '../components/clients/UploadDocumentModal';
import EditClientModal from '../components/clients/EditClientModal'; // Adjust path if needed

// Assume themeColors is available globally or via context/props
const themeColors = {
    brandPurple: '#5a239e', brandPurpleHover: '#703abc', lightGray: '#f9fafb',
    mediumGray: '#6b7280', darkGray: '#1f2937', white: '#ffffff',
    purple100: '#ede9fe', green100: '#dcfce7', green800: '#166534',
    yellow100: '#fef9c3', yellow800: '#854d0e', red50: '#fef2f2',
    red100: '#fee2e2', red600: '#dc2626', red800: '#991b1b',
    blue100: '#dbeafe', blue600: '#2563eb', blue800: '#1e40af',
    gray100: '#f3f4f6', gray200: '#e5e7eb', gray500: '#6b7280',
    gray600: '#4b5563', gray700: '#374151', gray800: '#1f2937',
    gray900: '#111827', green500: '#22c55e', green600: '#16a34a',
    yellow600: '#ca8a04', blue500: '#3b82f6',
};


// Helper function to get status badge color based on client/policy status
const getStatusClass = (status) => {
    const lowerStatus = status?.toLowerCase() || '';
    switch (lowerStatus) {
        case 'active': return 'bg-green-100 text-green-800';
        case 'lead': return 'bg-yellow-100 text-yellow-800';
        case 'lapsed': return 'bg-red-100 text-red-800';
        case 'pending renewal': return 'bg-yellow-100 text-yellow-800';
        case 'cancelled': return 'bg-gray-100 text-gray-800';
        case 'expired': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};
const calculateAge = (dobString) => {
    if (!dobString) return null;
    try {
        const dob = new Date(dobString);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return isNaN(age) ? null : age;
    } catch (e) {
        return null;
    }
};
// Helper function to format date strings or return 'N/A'
 const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
         // Handle potential null time from Go's sql.NullTime
         if (typeof dateString === 'object' && dateString !== null && dateString.Valid && dateString.Time) { dateString = dateString.Time; }
         else if (typeof dateString === 'object' && dateString !== null && !dateString.Valid) { return 'N/A'; }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        // Format date and time for communication log/timestamp fields
        if (date.getHours() !== 0 || date.getMinutes() !== 0 || date.getSeconds() !== 0) {
            return date.toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short'}); // Use locale string for combined date/time
        }
        // Format date only otherwise (e.g., DOB, expiry)
        return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) { console.warn("Date formatting error for:", dateString, e); return 'Error'; }
 };
 const CoverageProgressBar = ({ label, current, estimated, unit, color = 'purple' }) => {
    const [currentVal, setCurrentVal] = useState(0);
    const [estimatedVal, setEstimatedVal] = useState(0);

    // Convert Lakhs/Crores to base value (Rupees) for calculation
    useEffect(() => {
        let currentBase = current || 0; // Assume current is already in base if not specified otherwise
        let estimatedBase = estimated?.amount || 0;
        const lowerUnit = estimated?.unit?.toLowerCase() || '';

        if (lowerUnit.includes('lakh')) {
            estimatedBase *= 100000;
        } else if (lowerUnit.includes('crore')) {
            estimatedBase *= 10000000;
        }
        // Assume motor IDV is already in base Rupees

        setCurrentVal(currentBase);
        setEstimatedVal(estimatedBase);

    }, [current, estimated]);

    const percentage = useMemo(() => {
        if (!estimatedVal || estimatedVal <= 0) return 0; // Avoid division by zero
        const progress = Math.min((currentVal / estimatedVal) * 100, 100); // Cap at 100%
        return Math.round(progress);
    }, [currentVal, estimatedVal]);

    const colorClasses = {
        purple: 'bg-purple-600',
        green: 'bg-green-600',
        blue: 'bg-blue-600',
    };
    const bgColorClass = colorClasses[color] || colorClasses.purple;

    const formatCurrency = (value) => {
        if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
        if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
        return `₹${value.toLocaleString('en-IN')}`;
    };

    return (
        <div className="mb-4">
            <div className="flex justify-between items-baseline mb-1 text-sm">
                <span className="font-medium text-gray-700">{label}</span>
                <span className="text-xs text-gray-500">
                    {formatCurrency(currentVal)} / {formatCurrency(estimatedVal)} ({estimated?.unit})
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div
                    className={`${bgColorClass} h-2.5 rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                    title={`${percentage}% Covered`}
                ></div>
            </div>
             {estimated?.notes && estimated.notes.length > 0 && (
                 <ul className="mt-1 list-disc list-inside pl-1 text-xs text-gray-500">
                    {estimated.notes.map((note, i) => <li key={i}>{note}</li>)}
                 </ul>
             )}
        </div>
    );
};
// --- Client Profile Page Component ---
const ClientProfilePage = () => {
    const { clientId } = useParams();
    const navigate = useNavigate();

    // State for fetched data
    const [clientData, setClientData] = useState(null);
    const [policies, setPolicies] = useState([]);
    const [communications, setCommunications] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [documents, setDocuments] = useState([]);
    // const [aiRecommendations, setAiRecommendations] = useState([]); // Placeholder state
    const [coverageEstimation, setCoverageEstimation] = useState(null);
    const [isEstimationLoading, setIsEstimationLoading] = useState(true);
    const [estimationError, setEstimationError] = useState(null);
    const [aiRecommendationText, setAiRecommendationText] = useState('');
    const [isFetchingAiRec, setIsFetchingAiRec] = useState(false);
    const [aiRecError, setAiRecError] = useState(null);
    // State for UI control
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [selectedPolicyForShare, setSelectedPolicyForShare] = useState(null);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

// --- NEW: State for Portal Link ---
const [portalLink, setPortalLink] = useState('');
const [isGeneratingLink, setIsGeneratingLink] = useState(false);
const [linkCopied, setLinkCopied] = useState(false);
const [linkError, setLinkError] = useState('');
// ----------------------------------
    // Fetch client details and related data
    const fetchData = useCallback(async (refreshType = 'all') => {
        const isFullLoad = refreshType === 'all';
        if (isFullLoad) { setIsLoading(true); setError(null); }
        else { console.log(`Refreshing ${refreshType}...`); }

        const token = localStorage.getItem('authToken');
        if (!token) { setError("Authentication error: Not logged in."); setIsLoading(false); return; }

        const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
        const baseUrl = 'https://api.goclientwise.com/api/clients';

        const fetchApi = async (url, setter, isList = false) => {
             try {
                const response = await fetch(url, { headers });
                if (!response.ok) { let e = `Error (${response.status})`; try { const d = await response.json(); e = d.error || e; } catch {} if (isFullLoad && response.status === 404 && url === `${baseUrl}/${clientId}`) { e = `Client with ID '${clientId}' not found or not accessible.` } else if (response.status !== 404) { console.error(`Failed to fetch ${url}: ${e}`); } throw new Error(e); }
                const data = await response.json();
                setter(isList ? (data || []) : (data || null));
                return { status: 'fulfilled' };
             } catch (err) { console.error(`Failed to fetch ${url}:`, err); setError(prev => prev || err.message || "Failed to load some client details."); setter(isList ? [] : null); return { status: 'rejected', reason: err }; }
        };

        try {
            const promisesToRun = [];
            if (isFullLoad || refreshType === 'client') promisesToRun.push(fetchApi(`${baseUrl}/${clientId}`, setClientData, false));
            if (isFullLoad || refreshType === 'policies') promisesToRun.push(fetchApi(`${baseUrl}/${clientId}/policies`, setPolicies, true));
            if (isFullLoad || refreshType === 'comms') promisesToRun.push(fetchApi(`${baseUrl}/${clientId}/communications`, setCommunications, true));
            if (isFullLoad || refreshType === 'tasks') promisesToRun.push(fetchApi(`${baseUrl}/${clientId}/tasks`, setTasks, true));
            if (isFullLoad || refreshType === 'docs') promisesToRun.push(fetchApi(`${baseUrl}/${clientId}/documents`, setDocuments, true));
            // TODO: Add fetch for AI recommendations when API exists
            // if (isFullLoad || refreshType === 'recs') promisesToRun.push(fetchApi(`${baseUrl}/${clientId}/recommendations`, setAiRecommendations, true));
            if (isFullLoad || refreshType === 'estimation') {
                setIsEstimationLoading(true); setEstimationError(null); // Set loading specifically for estimation
                promisesToRun.push(
                    fetchApi(`${baseUrl}/${clientId}/coverage-estimation`, setCoverageEstimation, false)
                        .catch(err => setEstimationError(err.message || "Failed to load coverage estimation.")) // Catch specific estimation error
                        .finally(() => setIsEstimationLoading(false)) // Set loading false specifically for estimation
                );
            }
            await Promise.allSettled(promisesToRun);

        } catch (err) { if (!error) setError(err.message || "An unexpected error occurred."); }
        finally { if (isFullLoad) setIsLoading(false); }
    }, [clientId, error]); // Removed error dependency

    useEffect(() => {
        fetchData('all');
    }, [fetchData]);
    const fetchAiRecommendation = useCallback(async () => {
        // Ensure we have the necessary data
        if (!clientData || !coverageEstimation) {
            console.log("Skipping AI fetch: Missing client or estimation data.");
            return;
        }

        setIsFetchingAiRec(true);
        setAiRecError(null);
        setAiRecommendationText(''); // Clear previous recommendation

        // --- SECURITY WARNING ---
        // NEVER embed your real API key directly in frontend code in production!
        // Use a backend proxy or secure environment variables during build.
        // Replace this placeholder with your key ONLY for local testing.
        const GOOGLE_AI_API_KEY = "AIzaSyCg6QRS9EAKw2-Cu0NVzF6Oe62pktYPiCY"; // <<< REPLACE FOR TESTING ONLY
        if (GOOGLE_AI_API_KEY === "IzaSyCg6QRS9EAKw2-Cu0NVzF6Oe62pktYPiCY") {
             setAiRecError("API Key not configured in frontend code.");
             setIsFetchingAiRec(false);
             return;
        }
        // ------------------------

        // Format data for the prompt
        const age = calculateAge(clientData.dob?.String) || 'N/A';
        const city = clientData.city?.String || 'N/A';
        const income = clientData.income?.Valid ? `₹${clientData.income.Float64.toLocaleString('en-IN')} per year` : 'N/A';
        const maritalStatus = clientData.maritalStatus?.String || 'N/A';
        const dependents = clientData.dependents?.Valid ? clientData.dependents.Int64 : 'N/A';
        const liability = clientData.liability?.Valid ? `₹${clientData.liability.Float64.toLocaleString('en-IN')}` : 'N/A';
        const housing = clientData.housingType?.String || 'N/A';
        const vehicleCost = clientData.vehicleCost?.Valid ? `₹${clientData.vehicleCost.Float64.toLocaleString('en-IN')}` : 'N/A';

        const formatEst = (est) => est ? `${est.amount.toLocaleString('en-IN')} ${est.unit}` : 'N/A';
        const healthEst = formatEst(coverageEstimation.health);
        const lifeEst = formatEst(coverageEstimation.life);
        const motorEst = formatEst(coverageEstimation.motor);

        // Construct the prompt
        const promptText = `I am a ${age} year old person, living in ${city} with an annual income of ${income}, marital status is ${maritalStatus}, having ${dependents} dependents. I have current loans of approximately ${liability}. I live in ${housing} accommodation, and I own vehicles worth approximately ${vehicleCost}. I have been recommended to have a health cover of ${healthEst}, life cover of ${lifeEst}, and motor cover of ${motorEst}. Please elaborate briefly (2-3 short paragraphs) on why these recommended coverage amounts might be suitable for my profile, considering factors like income, dependents, location, and liabilities. Be encouraging and suggest discussing further with an advisor.`;

        console.log("Sending prompt to Gemini:", promptText);

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_AI_API_KEY}`;
        const requestBody = {
            contents: [{
                parts: [{"text": promptText}]
            }]
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                let errorMsg = `Google AI API Error: ${response.status}`;
                 try { const errData = await response.json(); errorMsg = errData.error?.message || errorMsg; } catch (e) {}
                throw new Error(errorMsg);
            }

            const data = await response.json();
            console.log("Gemini Response:", data);

            // Extract text - structure might vary slightly, adjust as needed
            const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (generatedText) {
                setAiRecommendationText(generatedText);
            } else {
                throw new Error("Could not extract recommendation text from API response.");
            }

        } catch (err) {
            console.error("AI Recommendation Fetch Error:", err);
            setAiRecError(err.message || "Failed to get AI recommendation.");
        } finally {
            setIsFetchingAiRec(false);
        }

    }, [clientData, coverageEstimation]); // Depend on client and estimation data

    // Trigger AI fetch when data is ready
    useEffect(() => {
        if (clientData && coverageEstimation && !isLoading && !isEstimationLoading) {
            fetchAiRecommendation();
        }
    }, [clientData, coverageEstimation, isLoading, isEstimationLoading, fetchAiRecommendation]); // Add fetchAiRecommendation dependency

    const currentCoverage = useMemo(() => {
        const activePolicies = policies?.filter(p => p.status?.toLowerCase() === 'active') || [];
        console.log(activePolicies,"activePolicies")
        const healthSum = activePolicies
            .filter(p => p.insurer?.toLowerCase().includes('health'))
            .reduce((sum, p) => sum + (p.sumInsured || 0), 100000);

        const lifeSum = activePolicies
            .filter(p => p.category?.toLowerCase().includes('life') || p.category?.toLowerCase().includes('term'))
            .reduce((sum, p) => sum + (p.sumInsured || 0), 0);

        // Assuming sumInsured for Motor represents IDV for now
        const motorSum = activePolicies
            .filter(p => p.category?.toLowerCase().includes('motor'))
            .reduce((sum, p) => sum + (p.sumInsured || 0), 0);

        return { health: healthSum, life: lifeSum, motor: motorSum };
    }, [policies]);
    // --- Action Handlers ---
    const handleViewPolicy = (policyId) => alert(`View policy ${policyId} (Not Implemented)`);
    const handleAiSummary = (policyId) => alert(`Show AI Summary for policy ${policyId} (Not Implemented)`);
    // const handleProposePolicy = (recId) => alert(`Propose recommended policy ${recId} (Not Implemented)`);

    // --- Modal Open/Close Handlers ---
    const openShareModal = (policy) => { setSelectedPolicyForShare(policy); setIsShareModalOpen(true); };
    const closeShareModal = () => { setIsShareModalOpen(false); setSelectedPolicyForShare(null); };
    const openLogModal = () => setIsLogModalOpen(true);
    const closeLogModal = () => setIsLogModalOpen(false);
    const handleLogAdded = () => { console.log("Log added"); fetchData('comms'); };
    const openTaskModal = () => setIsTaskModalOpen(true);
    const closeTaskModal = () => setIsTaskModalOpen(false);
    const handleTaskAdded = () => { console.log("Task added"); fetchData('tasks'); };
    const openPolicyModal = () => setIsPolicyModalOpen(true);
    const closePolicyModal = () => setIsPolicyModalOpen(false);
    const handlePolicyAdded = () => { console.log("Policy added"); fetchData('policies'); };
    const openDocumentModal = () => setIsDocumentModalOpen(true);
    const closeDocumentModal = () => setIsDocumentModalOpen(false);
    const handleDocumentUploaded = () => { console.log("Document uploaded"); fetchData('docs'); };
    const handleCloseEditModal = () => setIsEditModalOpen(false);
    const handleClientUpdated = () => {
        setIsEditModalOpen(false); // Close modal
        fetchData('client'); // Refetch client data to show updates
        fetchData('estimation'); // Also refetch estimation as profile changed
    };
// --- NEW: Generate Portal Link Handler ---
const handleGeneratePortalLink = async () => {
    setIsGeneratingLink(true);
    setLinkError('');
    setPortalLink('');
    setLinkCopied(false);

    const token = localStorage.getItem('authToken');
    if (!token) {
        setLinkError("Auth error.");
        setIsGeneratingLink(false);
        return;
    }

    //  const clientId = 'your_client_id';  <--  No longer hardcoded
    const apiUrl = `https://api.goclientwise.com/api/clients/6/generate-portal-link`; // Construct the API URL

    try {
       
        if (!clientId) {
            setLinkError("Client ID is missing.");
            setIsGeneratingLink(false);
            return;
        }
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            let errorMessage = "Failed to generate link.";
            if (response.status === 400) {
                errorMessage = "Invalid request. Please check the client ID.";
            } else if (response.status === 401) {
                errorMessage = "Unauthorized.  Invalid or expired token.";
            } else if (response.status === 404) {
                errorMessage = "Client not found.";
            } else if (response.status === 500) {
                errorMessage = "Server error. Please try again later.";
            }
            const errorData = await response.json();
            if (errorData && errorData.error) {
                errorMessage += ` ${errorData.error}`;
            }
            setLinkError(errorMessage);
            setIsGeneratingLink(false);
            return;
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (data && data.portalLink) {
            setPortalLink(data.portalLink);
        } else {
            setLinkError("Invalid response from server: Missing portalLink.");
        }


    } catch (error) {
        console.error("Generate Link Error:", error);
        setLinkError("Network error: Could not connect to server.");
    } finally {
        setIsGeneratingLink(false);
    }
};

const handleEditClient = () => setIsEditModalOpen(true); // Open the modal


 const handleCopyPortalLink = () => {
    if (!portalLink) return;
    navigator.clipboard.writeText(portalLink)
        .then(() => { setLinkCopied(true); setTimeout(() => setLinkCopied(false), 2000); })
        .catch(err => { console.error('Failed to copy link: ', err); setLinkError('Copy failed!'); });
};
// ---------------------------------------
    // --- Rendering Logic ---
    if (isLoading) { return <div className="text-center p-10 text-gray-500"><i className="fas fa-spinner fa-spin text-3xl text-[--brand-purple]"></i><p className="mt-2">Loading Client Details...</p></div>; }
    if (error && !clientData) { return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{error}</span></div>; }
    if (!clientData) { return <div className="text-center p-10 text-gray-500">Client data not found or could not be loaded.</div>; }

    // Main component JSX
    return (
        <div style={{'--brand-purple': themeColors.brandPurple, '--brand-purple-hover': themeColors.brandPurpleHover}}>
             {/* Header Bar */}
             <div className="flex flex-wrap justify-between items-center gap-4 mb-6 p-4 bg-white rounded-t-lg shadow-sm border border-gray-200 sticky top-[32px] ">
                 <div> <button onClick={() => navigate('/dashboard/clients')} className="text-sm text-purple-600 hover:underline flex items-center mb-1"> <i className="fas fa-arrow-left mr-2"></i> Back to Clients </button> <h1 className="text-xl font-semibold text-gray-800">{clientData.name}</h1> </div>
                 <div className="flex items-center space-x-2 flex-wrap gap-y-2"> <Button onClick={openLogModal} variant="outlineSm" className="text-xs px-2 py-1"><i className="fas fa-phone mr-1"></i> Log Call/Email</Button> <Button onClick={openTaskModal} variant="outlineSm" className="text-xs px-2 py-1"><i className="fas fa-check-square mr-1"></i> New Task</Button> <Button onClick={handleEditClient} variant="outlineSm" className="text-xs px-2 py-1"><i className="fas fa-pencil-alt mr-1"></i> Edit Client</Button> </div>
             </div>
             {error && clientData && <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded relative m-4 text-sm" role="alert"><strong className="font-bold">Warning: </strong><span className="block sm:inline">{error}</span></div>}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6  z-10">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6 mt-8">
              {/* --- NEW: Client Portal Link Section --- */}
 
 {/* -------------------------------------- */}
                    {/* Client Summary/Profile Section */}
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                         <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-4 border-b"> <div className="flex items-center mb-3 sm:mb-0"> <img className="h-16 w-16 rounded-full mr-4 object-cover ring-2 ring-purple-200" src={`https://placehold.co/100x100/ede9fe/5b21b6?text=${clientData.name.charAt(0)}`} alt="Client Avatar"/> <div> <h2 className="text-2xl font-bold text-gray-800">{clientData.name}</h2> <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(clientData.status)}`}> {clientData.status || 'N/A'} </span> </div> </div> </div>
                         <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                            {/* --- Basic Info --- */}
                            <div><dt className="text-gray-500 font-medium">Email</dt><dd><a href={`mailto:${clientData.email?.String}`} className="text-purple-600 hover:underline">{clientData.email?.String || 'N/A'}</a></dd></div>
                            <div><dt className="text-gray-500 font-medium">Phone</dt><dd><a href={`tel:${clientData.phone?.String}`} className="text-purple-600 hover:underline">{clientData.phone?.String || 'N/A'}</a></dd></div>
                            <div><dt className="text-gray-500 font-medium">Date of Birth</dt><dd>{formatDate(clientData.dob?.String) || 'N/A'}</dd></div>
                            <div className="sm:col-span-2"><dt className="text-gray-500 font-medium">Address</dt><dd>{clientData.address?.String || 'N/A'}</dd></div>
                             <div><dt className="text-gray-500 font-medium">City</dt><dd>{clientData.city?.String || 'N/A'}</dd></div>
                            <div className="sm:col-span-3"><dt className="text-gray-500 font-medium">Tags</dt><dd> {(clientData.tags?.String || '').split(',').map(tag => tag.trim()).filter(tag => tag).map((tag, index) => ( <span key={index} className="inline-block bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded">{tag}</span> )) || 'No tags'} </dd></div>
                             {/* --- Financial & Family Info --- */}
                            <div className="sm:col-span-3 pt-3 mt-2 border-t"></div>
                            <div><dt className="text-gray-500 font-medium">Marital Status</dt><dd>{clientData.maritalStatus?.String || 'N/A'}</dd></div>
                            <div><dt className="text-gray-500 font-medium">Job Profile</dt><dd>{clientData.jobProfile?.String || 'N/A'}</dd></div>
                            <div><dt className="text-gray-500 font-medium">Annual Income (₹)</dt><dd>{clientData.income?.Valid ? clientData.income.Float64.toLocaleString('en-IN') : 'N/A'}</dd></div>
                            <div><dt className="text-gray-500 font-medium">Dependents</dt><dd>{clientData.dependents?.Valid ? clientData.dependents.Int64 : 'N/A'}</dd></div>
                            <div className="sm:col-span-2"><dt className="text-gray-500 font-medium">Current Liability (₹ Loans)</dt><dd>{clientData.liability?.Valid ? clientData.liability.Float64.toLocaleString('en-IN') : 'N/A'}</dd></div>
                             {/* --- Assets Info --- */}
                             <div className="sm:col-span-3 pt-3 mt-2 border-t"></div>
                             <div><dt className="text-gray-500 font-medium">Housing Type</dt><dd>{clientData.housingType?.String || 'N/A'}</dd></div>
                             <div><dt className="text-gray-500 font-medium">No. of Vehicles</dt><dd>{clientData.vehicleCount?.Valid ? clientData.vehicleCount.Int64 : 'N/A'}</dd></div>
                             <div><dt className="text-gray-500 font-medium">Vehicle Type(s)</dt><dd>{clientData.vehicleType?.String || 'N/A'}</dd></div>
                             <div className="sm:col-span-2"><dt className="text-gray-500 font-medium">Total Vehicle Cost (₹ Approx)</dt><dd>{clientData.vehicleCost?.Valid ? clientData.vehicleCost.Float64.toLocaleString('en-IN') : 'N/A'}</dd></div>
                         </dl>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-[--brand-purple] mb-4 pb-3 border-b">
                            <i className="fas fa-shield-alt mr-2"></i>Coverage Overview
                        </h3>
                        {isEstimationLoading ? (
                             <div className="text-center p-4 text-gray-500"><i className="fas fa-spinner fa-spin mr-2"></i>Loading estimation...</div>
                        ) : estimationError ? (
                             <div className="text-sm text-red-700 p-2 bg-red-50 border border-red-200 rounded">{estimationError}</div>
                        ) : coverageEstimation ? (
                            <div>
                                <CoverageProgressBar
                                    label="Health Insurance"
                                    current={currentCoverage.health}
                                    estimated={coverageEstimation.health}
                                    unit="Lakhs"
                                    color="green"
                                />
                                <CoverageProgressBar
                                    label="Life Insurance (Term)"
                                    current={currentCoverage.life}
                                    estimated={coverageEstimation.life}
                                    unit="Crores"
                                    color="blue"
                                />
                                <CoverageProgressBar
                                    label="Motor Insurance (IDV)"
                                    current={currentCoverage.motor}
                                    estimated={coverageEstimation.motor}
                                    unit="IDV (₹)"
                                    color="purple"
                                />
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic">Coverage estimation data not available.</p>
                        )}
                    </div>
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                         <h3 className="text-lg font-semibold text-[--brand-purple] mb-4 pb-4 border-b"><i className="fas fa-lightbulb mr-2 text-yellow-500"></i>AI Recommendations</h3>
                         {isFetchingAiRec ? (
                            <div className="text-center p-4 text-gray-500"><i className="fas fa-spinner fa-spin mr-2"></i>Generating recommendations...</div>
                         ) : aiRecError ? (
                            <div className="text-sm text-red-700 p-2 bg-red-50 border border-red-200 rounded">{aiRecError}</div>
                         ) : aiRecommendationText ? (
                            // Format the text - replace newlines with paragraphs for better readability
                            <div className="text-sm text-gray-700 space-y-2">
                                {aiRecommendationText.split('\n').map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                         ) : (
                            <p className="text-sm text-gray-500 italic">Could not generate AI recommendations at this time.</p>
                         )}
                    </div>
                    {/* Policies Section - Restored Rendering Logic */}
                     <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b"> <h3 className="text-lg font-semibold text-[--brand-purple]">Policies Held</h3> <Button onClick={openPolicyModal} variant="outlineSm" className="text-xs"><i className="fas fa-plus mr-1"></i> Add Policy</Button> </div>
                        <div className="overflow-x-auto">
                            {policies?.length === 0 ? ( <p className="text-sm text-gray-500 italic">No policies found.</p> ) : (
                                <table className="w-full text-sm min-w-[500px]">
                                    <thead><tr className="bg-gray-50"><th className="px-3 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type/Insurer</th><th className="px-3 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy #</th><th className="px-3 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th><th className="px-3 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th><th className="px-3 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th></tr></thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {policies.map((policy) => (
                                            <tr key={policy.id}>
                                                <td className="px-3 py-2"><div>{policy.type || policy.productId?.String || 'N/A'}</div><div className="text-xs text-gray-500">{policy.insurer}</div></td>
                                                <td className="px-3 py-2">{policy.policyNumber}</td>
                                                <td className="px-3 py-2"><span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(policy.status)}`}>{policy.status}</span></td>
                                                <td className="px-3 py-2">{formatDate(policy.endDate?.String)}</td>
                                                <td className="px-3 py-2 whitespace-nowrap space-x-3"> <button onClick={() => handleViewPolicy(policy.id)} className="text-purple-600 hover:text-purple-800" title="View Policy"><i className="fas fa-eye"></i></button> <button onClick={() => handleAiSummary(policy.id)} className="text-blue-600 hover:text-blue-800" title="AI Summary"><i className="fas fa-robot"></i></button> <button onClick={() => openShareModal(policy)} className="text-green-600 hover:text-green-800" title="Share AI Summary"> <i className="fas fa-share-alt"></i> </button> </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                 
                  
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 space-y-6 mt-8">
                     {/* Communication Log Section - Restored Rendering Logic */}
                     <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
     <h3 className="text-lg font-semibold text-gray-800 mb-3">Client Portal Link</h3>
     <p className="text-xs text-gray-500 mb-3">Generate a secure link for the client to view details and upload documents.</p>
     {/* Display error if link generation failed */}
     {linkError && <p className="text-xs text-red-600 mb-2">{linkError}</p>}
     {/* Show generated link and copy button OR the generate button */}
     {portalLink ? (
          <div className="flex items-center gap-2">
             <input
                type="text"
                readOnly
                value={portalLink}
                className="flex-grow px-3 py-1 border border-gray-300 rounded-md text-xs text-gray-600 bg-gray-50 focus:outline-none"
                aria-label="Generated portal link"
             />
             <button
                onClick={handleCopyPortalLink}
                title="Copy Link"
                className="p-1.5 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-[--brand-purple]"
                style={{'--brand-purple': themeColors.brandPurple}}
             >
                 <i className={`fas ${linkCopied ? 'fa-check text-green-500' : 'fa-copy'} w-4 h-4`}></i>
             </button>
         </div>
     ) : (
          <Button
            onClick={handleGeneratePortalLink}
            disabled={isGeneratingLink}
            variant="outlineSm" // Use appropriate Button variant
            className="w-full text-purple-700 border-purple-300 hover:bg-purple-50 text-xs" // Example styling
          >
             {isGeneratingLink ? (
                <><i className="fas fa-spinner fa-spin mr-2"></i>Generating...</>
             ) : (
                <><i className="fas fa-link mr-2"></i>Generate Portal Link</>
             )}
         </Button>
     )}
      {/* Show 'Copied!' feedback message */}
      {linkCopied && <p className="text-xs text-green-600 mt-1">Link copied!</p>}
 </div>
                     <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b"> <h3 className="text-lg font-semibold text-[--brand-purple]">Communication Log</h3> <Button onClick={openLogModal} variant="outlineSm" className="text-xs"><i className="fas fa-plus mr-1"></i> Log</Button> </div>
                        <ul className="space-y-3 text-sm max-h-60 overflow-y-auto pr-2">
                            {communications?.length === 0 ? ( <p className="text-sm text-gray-500 italic">No logs.</p> ) : ( communications.map(comm => ( <li key={comm.id} className="pb-2 border-b border-gray-100 last:border-b-0"> <p className="font-medium text-gray-700">{comm.type}: {comm.summary}</p> <p className="text-xs text-gray-500">{formatDate(comm.timestamp)}</p> </li> )) )}
                        </ul>
                     </div>
                     {/* Tasks/Reminders Section - Restored Rendering Logic */}
                     <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b"> <h3 className="text-lg font-semibold text-[--brand-purple]">Tasks & Reminders</h3> <Button onClick={openTaskModal} variant="outlineSm" className="text-xs"><i className="fas fa-plus mr-1"></i> Add Task</Button> </div>
                        <ul className="space-y-2 text-sm">
                            {tasks?.length === 0 ? ( <p className="text-sm text-gray-500 italic">No tasks.</p> ) : ( tasks.map(task => ( <li key={task.id} className={`flex items-center justify-between p-2 rounded ${task.isUrgent ? 'bg-red-50' : 'hover:bg-gray-50'}`}> <span className={task.isUrgent ? 'text-red-700' : ''}><i className={`fas ${task.isUrgent ? 'fa-exclamation-circle' : 'fa-check-square'} mr-2`}></i>{task.description}</span> <span className={`text-xs font-medium ${task.isUrgent ? 'text-red-600' : 'text-gray-500'}`}>Due {formatDate(task.dueDate?.String)}</span> </li> )) )}
                        </ul>
                     </div>
                     {/* Client Referral Tools Section */}
                     {/* <ClientReferralTools clientName={clientData.name} referralLink={`https://clientwise.example/ref/${clientData.id}ABC`} /> */}
                     {/* Documents Section - Restored Rendering Logic */}
                     <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b"> <h3 className="text-lg font-semibold text-[--brand-purple]">Documents</h3> <Button onClick={openDocumentModal} variant="outlineSm" className="text-xs"><i className="fas fa-upload mr-1"></i> Upload</Button> </div>
                        <div className="space-y-2">
                            {documents?.length === 0 ? ( <p className="text-sm text-gray-500 italic">No documents.</p> ) : ( documents.map(doc => ( <a href={doc.fileUrl || '#'} target="_blank" rel="noreferrer" key={doc.id} className="flex items-center text-sm text-purple-600 hover:underline p-1 hover:bg-gray-50 rounded"> <i className="fas fa-file-alt w-4 mr-2 text-gray-400"></i> {doc.title || doc.fileUrl} <span className="text-xs text-gray-400 ml-auto">({formatDate(doc.uploadedAt)})</span> </a> )) )}
                        </div>
                     </div>
                        <ClientReferralTools clientName={clientData.name} referralLink={`https://clientwise.example/ref/${clientData.id}ABC`} />

                </div>
            </div>

            {/* Render ALL Modals */}
            <ShareSummaryModal isOpen={isShareModalOpen} onClose={closeShareModal} policy={selectedPolicyForShare} />
            <LogInteractionModal isOpen={isLogModalOpen} onClose={closeLogModal} clientId={clientId} onLogAdded={handleLogAdded} />
            <AddTaskModal isOpen={isTaskModalOpen} onClose={closeTaskModal} clientId={clientId} onTaskAdded={handleTaskAdded} />
            <AddPolicyModal isOpen={isPolicyModalOpen} onClose={closePolicyModal} clientId={clientId} onPolicyAdded={handlePolicyAdded} />
            <UploadDocumentModal isOpen={isDocumentModalOpen} onClose={closeDocumentModal} clientId={clientId} onDocumentUploaded={handleDocumentUploaded} />
            <EditClientModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onClientUpdated={handleClientUpdated}
                clientData={clientData} // Pass current client data to pre-fill form
            />
        </div>
    );
};

export default ClientProfilePage;

// --- Ensure necessary components are imported correctly ---
// const ClientReferralTools = ({ clientName = "Client", referralLink = "#", referredLeads = [] }) => { /* ... Full definition ... */ };
// const ShareSummaryModal = ({ isOpen, onClose, policy }) => { /* ... Full definition ... */ };
// const LogInteractionModal = ({ isOpen, onClose, clientId, onLogAdded }) => { /* ... Full definition ... */ };
// const AddTaskModal = ({ isOpen, onClose, clientId, onTaskAdded }) => { /* ... Full definition ... */ };
// const AddPolicyModal = ({ isOpen, onClose, clientId, onPolicyAdded }) => { /* ... Full definition ... */ };
// const UploadDocumentModal = ({ isOpen, onClose, clientId, onDocumentUploaded }) => { /* ... Full definition ... */ };
// // Import Button and InputField as well

