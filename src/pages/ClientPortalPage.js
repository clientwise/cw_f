import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom'; // Added Link
import Button from '../components/common/Button'; // Assuming Button is accessible
import InputField from '../components/common/InputField'; // Assuming InputField is accessible

// Assume themeColors is available globally or via context/props
const themeColors = {
    brandPurple: '#5a239e', brandPurpleHover: '#703abc', lightGray: '#f9fafb',
    // ... include all necessary colors from ClientProfilePage ...
    gray100: '#f3f4f6', gray200: '#e5e7eb', gray500: '#6b7280',
    gray600: '#4b5563', gray700: '#374151', gray800: '#1f2937',
    white: '#ffffff', green100: '#dcfce7', green600: '#16a34a', green800: '#166534',
    yellow100: '#fef9c3', yellow600: '#ca8a04', yellow800: '#854d0e',
    red50: '#fef2f2', red100: '#fee2e2', red600: '#dc2626', red800: '#991b1b',
    blue100: '#dbeafe', blue600: '#2563eb', blue800: '#1e40af', blue500: '#3b82f6',
    purple100: '#ede9fe', purple600: '#7e22ce',
};

// Helper function to format date strings or return 'N/A'
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
         if (typeof dateString === 'object' && dateString !== null && dateString.Valid && dateString.Time) { dateString = dateString.Time; }
         else if (typeof dateString === 'object' && dateString !== null && !dateString.Valid) { return 'N/A'; }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        // Format date and time for communication log/timestamp fields
        if (date.getHours() !== 0 || date.getMinutes() !== 0 || date.getSeconds() !== 0) {
            return date.toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short'});
        }
        return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) { console.warn("Date formatting error for:", dateString, e); return 'Error'; }
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

// --- Coverage Progress Bar Component --- (Copied from ClientProfilePage)
const CoverageProgressBar = ({ label, current, estimated, unit, color = 'purple' }) => {
    const [currentVal, setCurrentVal] = useState(0);
    const [estimatedVal, setEstimatedVal] = useState(0);
    useEffect(() => {
        let currentBase = current || 0;
        let estimatedBase = estimated?.amount || 0;
        const lowerUnit = estimated?.unit?.toLowerCase() || '';
        if (lowerUnit.includes('lakh')) { estimatedBase *= 100000; }
        else if (lowerUnit.includes('crore')) { estimatedBase *= 10000000; }
        setCurrentVal(currentBase); setEstimatedVal(estimatedBase);
    }, [current, estimated]);
    const percentage = useMemo(() => {
        if (!estimatedVal || estimatedVal <= 0) return 0;
        const progress = Math.min((currentVal / estimatedVal) * 100, 100);
        return Math.round(progress);
    }, [currentVal, estimatedVal]);
    const colorClasses = { purple: 'bg-purple-600', green: 'bg-green-600', blue: 'bg-blue-600' };
    const bgColorClass = colorClasses[color] || colorClasses.purple;
    const formatCurrency = (value) => {
        if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
        if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
        return `₹${value.toLocaleString('en-IN')}`;
    };
    return ( <div className="mb-4"> <div className="flex justify-between items-baseline mb-1 text-sm"> <span className="font-medium text-gray-700">{label}</span> <span className="text-xs text-gray-500"> {formatCurrency(currentVal)} / {formatCurrency(estimatedVal)} ({estimated?.unit}) </span> </div> <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700"> <div className={`${bgColorClass} h-2.5 rounded-full transition-all duration-500 ease-out`} style={{ width: `${percentage}%` }} title={`${percentage}% Covered`}></div> </div> {estimated?.notes && estimated.notes.length > 0 && ( <ul className="mt-1 list-disc list-inside pl-1 text-xs text-gray-500"> {estimated.notes.map((note, i) => <li key={i}>{note}</li>)} </ul> )} </div> );
};


const ClientPortalPage = () => {
    const { token } = useParams(); // Get token from URL
    const [clientViewData, setClientViewData] = useState(null); // Will hold PublicClientView
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for document upload form
    const [docTitle, setDocTitle] = useState('');
    const [docType, setDocType] = useState('PAN Card'); // Default to common type
    const [docFile, setDocFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');
    const fileInputRef = useRef(null);

    // Fetch public client data using the token
    const fetchPublicData = useCallback(async () => {
        if (!token) { setError("Access token missing."); setIsLoading(false); return; }
        // Don't reset loading on refresh, only initial
        setError(null); // Clear previous errors on fetch attempt

        try {
            const response = await fetch(`http://localhost:8080/api/portal/client/${token}`);
            if (!response.ok) { let e=`Error (${response.status})`; try{const d=await response.json();e=d.error||e;}catch{} if(response.status===404)e="Invalid/expired link."; throw new Error(e); }
            const data = await response.json();
            setClientViewData(data);
        } catch (err) { console.error("Fetch public data error:", err); setError(err.message || "Could not load information."); setClientViewData(null); }
        finally { setIsLoading(false); } // Stop loading indicator
    }, [token]);

    useEffect(() => {
        setIsLoading(true); // Set loading true for initial fetch
        fetchPublicData();
    }, [fetchPublicData]);

    // Calculate Current Coverage (Memoized) - based on fetched policies
     const currentCoverage = useMemo(() => {
        const activePolicies = clientViewData?.policies?.filter(p => p.status?.toLowerCase() === 'active') || [];
        const healthSum = activePolicies.filter(p => p.category?.toLowerCase().includes('health')).reduce((sum, p) => sum + (p.sumInsured || 0), 0);
        const lifeSum = activePolicies.filter(p => p.category?.toLowerCase().includes('life') || p.category?.toLowerCase().includes('term')).reduce((sum, p) => sum + (p.sumInsured || 0), 0);
        const motorSum = activePolicies.filter(p => p.category?.toLowerCase().includes('motor')).reduce((sum, p) => sum + (p.sumInsured || 0), 0);
        return { health: healthSum, life: lifeSum, motor: motorSum };
    }, [clientViewData?.policies]);


    // Handle file input change
    const handleFileChange = (event) => { /* ... same as before ... */ };

    // Handle document upload submission
    const handleDocumentSubmit = async (e) => {
        e.preventDefault();
        if (!docFile) { setUploadError('Please select a file.'); return; }
        if (!docTitle.trim()) { setUploadError('Please enter a document title.'); return; }
        setIsUploading(true); setUploadError(''); setUploadSuccess('');
        const formData = new FormData();
        formData.append('title', docTitle); formData.append('documentType', docType); formData.append('file', docFile);
        try {
            const response = await fetch(`http://localhost:8080/api/portal/client/${token}/documents`, { method: 'POST', body: formData });
            const result = await response.json();
            if (!response.ok) { throw new Error(result.error || `Upload failed (${response.status})`); }
            setUploadSuccess(`Document '${result.title}' uploaded successfully!`);
            setDocTitle(''); setDocType('PAN Card'); setDocFile(null);
            if(fileInputRef.current) fileInputRef.current.value = '';
            fetchPublicData(); // Refresh data to show new document
        } catch (err) { console.error("Doc Upload Error:", err); setUploadError(err.message || "Upload error."); }
        finally { setIsUploading(false); }
    };


    // --- Rendering Logic ---
    if (isLoading) { return <div className="flex h-screen items-center justify-center text-gray-600"><i className="fas fa-spinner fa-spin text-3xl mr-3"></i> Loading Information...</div>; }
    if (error) { return <div className="flex h-screen items-center justify-center text-red-600 p-6 bg-red-50 border border-red-200 rounded-md max-w-md mx-auto text-center">{error}<br/><Link to="/" className="text-sm text-blue-600 hover:underline mt-4 inline-block">Go to Homepage</Link></div>; }
    if (!clientViewData || !clientViewData.client) { return <div className="flex h-screen items-center justify-center text-gray-600">Could not load client data.</div>; }

    const client = clientViewData.client; // Shortcut

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4" style={{'--brand-purple': themeColors.brandPurple}}>
            {/* Header Bar (Simplified) */}
             <header className="max-w-5xl mx-auto mb-6">
                 <h1 className="text-2xl font-semibold text-gray-800">Client Portal</h1>
                 <p className="text-sm text-gray-500">Welcome, {client.name}!</p>
             </header>

            {/* Main Content Grid (Mirrors ClientProfilePage structure) */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Client Summary/Profile Section */}
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                         <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-4 border-b">
                             <div className="flex items-center mb-3 sm:mb-0">
                                 <img className="h-16 w-16 rounded-full mr-4 object-cover ring-2 ring-purple-200" src={`https://placehold.co/100x100/ede9fe/5b21b6?text=${client.name.charAt(0)}`} alt="Client Avatar"/>
                                 <div>
                                     <h2 className="text-2xl font-bold text-gray-800">{client.name}</h2>
                                     <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(client.status)}`}>
                                         {client.status || 'N/A'}
                                     </span>
                                 </div>
                             </div>
                             {/* No edit button for client */}
                         </div>
                         {/* Display all relevant client details */}
                         <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                            {/* Basic Info */}
                            <div><dt className="text-gray-500 font-medium">Email</dt><dd>{client.email?.String || 'N/A'}</dd></div>
                            <div><dt className="text-gray-500 font-medium">Phone</dt><dd>{client.phone?.String || 'N/A'}</dd></div>
                            <div><dt className="text-gray-500 font-medium">Date of Birth</dt><dd>{formatDate(client.dob?.String) || 'N/A'}</dd></div>
                            <div className="sm:col-span-2"><dt className="text-gray-500 font-medium">Address</dt><dd>{client.address?.String || 'N/A'}</dd></div>
                            <div><dt className="text-gray-500 font-medium">City</dt><dd>{client.city?.String || 'N/A'}</dd></div>
                            {/* Financial & Family Info */}
                            <div className="sm:col-span-3 pt-3 mt-2 border-t"></div>
                            <div><dt className="text-gray-500 font-medium">Marital Status</dt><dd>{client.maritalStatus?.String || 'N/A'}</dd></div>
                            <div><dt className="text-gray-500 font-medium">Job Profile</dt><dd>{client.jobProfile?.String || 'N/A'}</dd></div>
                            <div><dt className="text-gray-500 font-medium">Annual Income (₹)</dt><dd>{client.income?.Valid ? client.income.Float64.toLocaleString('en-IN') : 'N/A'}</dd></div>
                            <div><dt className="text-gray-500 font-medium">Dependents</dt><dd>{client.dependents?.Valid ? client.dependents.Int64 : 'N/A'}</dd></div>
                            <div className="sm:col-span-2"><dt className="text-gray-500 font-medium">Current Liability (₹ Loans)</dt><dd>{client.liability?.Valid ? client.liability.Float64.toLocaleString('en-IN') : 'N/A'}</dd></div>
                             {/* Assets Info */}
                             <div className="sm:col-span-3 pt-3 mt-2 border-t"></div>
                             <div><dt className="text-gray-500 font-medium">Housing Type</dt><dd>{client.housingType?.String || 'N/A'}</dd></div>
                             <div><dt className="text-gray-500 font-medium">No. of Vehicles</dt><dd>{client.vehicleCount?.Valid ? client.vehicleCount.Int64 : 'N/A'}</dd></div>
                             <div><dt className="text-gray-500 font-medium">Vehicle Type(s)</dt><dd>{client.vehicleType?.String || 'N/A'}</dd></div>
                             <div className="sm:col-span-2"><dt className="text-gray-500 font-medium">Total Vehicle Cost (₹ Approx)</dt><dd>{client.vehicleCost?.Valid ? client.vehicleCost.Float64.toLocaleString('en-IN') : 'N/A'}</dd></div>
                         </dl>
                    </div>

                    {/* Coverage Overview Section */}
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-[--brand-purple] mb-4 pb-3 border-b"><i className="fas fa-shield-alt mr-2"></i>Coverage Overview</h3>
                        {clientViewData.coverageEstimation ? (
                            <div>
                                <CoverageProgressBar label="Health Insurance" current={currentCoverage.health} estimated={clientViewData.coverageEstimation.health} unit="Lakhs" color="green" />
                                <CoverageProgressBar label="Life Insurance (Term)" current={currentCoverage.life} estimated={clientViewData.coverageEstimation.life} unit="Crores" color="blue" />
                                <CoverageProgressBar label="Motor Insurance (IDV)" current={currentCoverage.motor} estimated={clientViewData.coverageEstimation.motor} unit="IDV (₹)" color="purple" />
                            </div>
                        ) : ( <p className="text-sm text-gray-500 italic">Coverage estimation not available.</p> )}
                    </div>

                    {/* AI Recommendations Section */}
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                         <h3 className="text-lg font-semibold text-[--brand-purple] mb-4 pb-4 border-b"><i className="fas fa-lightbulb mr-2 text-yellow-500"></i>Recommendations from your Advisor</h3>
                         {clientViewData.aiRecommendation ? (
                            <div className="text-sm text-gray-700 space-y-2">
                                {clientViewData.aiRecommendation.split('\n').map((paragraph, index) => ( <p key={index}>{paragraph}</p> ))}
                            </div>
                         ) : ( <p className="text-sm text-gray-500 italic">No specific recommendations available at this time.</p> )}
                    </div>

                    {/* Policies Section */}
                     <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-[--brand-purple] mb-4 pb-4 border-b">Your Policies</h3>
                        <div className="overflow-x-auto">
                            {clientViewData.policies?.length > 0 ? (
                                <table className="w-full text-sm min-w-[500px]">
                                    <thead><tr className="bg-gray-50"><th className="px-3 py-1.5 text-left text-xs font-medium text-gray-500 uppercase">Type/Insurer</th><th className="px-3 py-1.5 text-left text-xs font-medium text-gray-500 uppercase">Policy #</th><th className="px-3 py-1.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-3 py-1.5 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th></tr></thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {clientViewData.policies.map((policy) => ( <tr key={policy.id}> <td className="px-3 py-2"><div>{policy.productId?.String || 'N/A'}</div><div className="text-xs text-gray-500">{policy.insurer}</div></td> <td className="px-3 py-2">{policy.policyNumber}</td> <td className="px-3 py-2"><span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(policy.status)}`}>{policy.status}</span></td> <td className="px-3 py-2">{formatDate(policy.endDate?.String)}</td> </tr> ))}
                                    </tbody>
                                </table>
                            ) : ( <p className="text-sm text-gray-500 italic">No policies found.</p> )}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 space-y-6">
                     {/* Communication Log Section */}
                     <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-[--brand-purple] mb-4 pb-4 border-b">Recent Communication</h3>
                        <ul className="space-y-3 text-sm max-h-60 overflow-y-auto pr-2">
                            {clientViewData.communications?.length > 0 ? ( clientViewData.communications.map(comm => ( <li key={comm.id} className="pb-2 border-b border-gray-100 last:border-b-0"> <p className="font-medium text-gray-700">{comm.type}: {comm.summary}</p> <p className="text-xs text-gray-500">{formatDate(comm.timestamp)}</p> </li> )) ) : ( <p className="text-sm text-gray-500 italic">No recent communications logged.</p> )}
                        </ul>
                     </div>

                     {/* Documents Section */}
                     <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-[--brand-purple] mb-4 pb-4 border-b">Your Documents</h3>
                        {/* Existing Documents List */}
                        <div className="space-y-2 mb-6">
                            {clientViewData.documents?.length > 0 ? ( clientViewData.documents.map(doc => ( <div key={doc.id} className="flex items-center text-sm text-gray-600 p-1"> <i className="fas fa-file-alt w-4 mr-2 text-gray-400"></i> {doc.title || doc.fileUrl} <span className="text-xs text-gray-400 ml-auto">({formatDate(doc.uploadedAt)})</span> </div> )) ) : ( <p className="text-sm text-gray-500 italic">No documents uploaded yet.</p> )}
                        </div>
                        {/* Document Upload Form */}
                        <div className="pt-4 border-t">
                            <h4 className="text-md font-semibold text-gray-700 mb-3">Upload New Document</h4>
                            <form onSubmit={handleDocumentSubmit} className="space-y-3">
                                 {uploadError && <div className="text-sm text-red-700 p-2 bg-red-100 border border-red-200 rounded">{uploadError}</div>}
                                 {uploadSuccess && <div className="text-sm text-green-700 p-2 bg-green-100 border border-green-200 rounded">{uploadSuccess}</div>}
                                <InputField id="doc-title" label="Document Title*" value={docTitle} onChange={e => setDocTitle(e.target.value)} required={true} placeholder="e.g., PAN Card" />
                                <div>
                                    <label htmlFor="doc-type" className="block text-sm font-medium text-gray-700 mb-1">Document Type*</label>
                                    <select id="doc-type" value={docType} onChange={e => setDocType(e.target.value)} required className="mt-1 block w-full form-select rounded-md shadow-sm"> <option>PAN Card</option> <option>Aadhaar Card</option> <option>Cancelled Cheque</option> <option>Photo</option> <option>Other</option> </select>
                                </div>
                                <div>
                                    <label htmlFor="doc-file" className="block text-sm font-medium text-gray-700 mb-1">Select File*</label>
                                    <input ref={fileInputRef} type="file" id="doc-file" name="file" onChange={handleFileChange} required accept=".pdf,.jpg,.jpeg,.png" className="block w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-medium file:bg-white file:text-gray-700 hover:file:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[--brand-purple] focus:border-[--brand-purple]" />
                                     {docFile && <p className="text-xs text-gray-500 mt-1">Selected: {docFile.name}</p>}
                                </div>
                                <Button type="submit" variant="brand" disabled={isUploading} className="w-full sm:w-auto"> {isUploading ? <><i className="fas fa-spinner fa-spin mr-2"></i>Uploading...</> : <><i className="fas fa-upload mr-2"></i>Upload Document</>} </Button>
                            </form>
                        </div>
                     </div>
                </div>
            </div>

             <footer className="text-center text-xs text-gray-500 mt-8 py-4 border-t">
                Client Portal powered by ClientWise | <Link to="/" className="hover:underline">Return to Main Site</Link>
             </footer>
        </div>
    );
};

// Helper component needed by the modal


export default ClientPortalPage;

