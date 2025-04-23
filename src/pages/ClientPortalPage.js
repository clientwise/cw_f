import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../components/common/Button'; // Assuming Button is accessible
import InputField from '../components/common/InputField'; // Assuming InputField is accessible

// Assume themeColors is available globally or via context/props
const themeColors = {
    brandPurple: '#5a239e', brandPurpleHover: '#703abc',
    // Add other colors used if not globally defined via CSS vars
    gray100: '#f3f4f6', gray200: '#e5e7eb', gray500: '#6b7280',
    gray600: '#4b5563', gray700: '#374151', gray800: '#1f2937',
    white: '#ffffff', green100: '#dcfce7', green600: '#16a34a',
    red100: '#fee2e2', red700: '#b91c1c',
};
 // Helper for policy status badge
 const getPolicyStatusClass = (status) => {
    const lowerStatus = status?.toLowerCase() || '';
    switch(lowerStatus) {
        case 'active': return 'bg-green-100 text-green-800';
        case 'lapsed': return 'bg-red-100 text-red-800';
        case 'pending renewal': return 'bg-yellow-100 text-yellow-800';
        case 'cancelled': return 'bg-gray-100 text-gray-800';
        case 'expired': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
 };
// Helper function to format date strings or return 'N/A'
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

const ClientPortalPage = () => {
    const { token } = useParams(); // Get token from URL
    const [clientViewData, setClientViewData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for document upload form
    const [docTitle, setDocTitle] = useState('');
    const [docType, setDocType] = useState('Other');
    const [docFile, setDocFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');
    const fileInputRef = useRef(null);

    // Fetch public client data using the token
    const fetchPublicData = useCallback(async () => {
        if (!token) { setError("Access token missing."); setIsLoading(false); return; }
        setIsLoading(true); setError(null);

        try {
            const response = await fetch(`https://api.goclientwise.com/api/portal/client/${token}`);
            if (!response.ok) {
                let errorMsg = `Error (${response.status})`;
                try { const d = await response.json(); errorMsg = d.error || errorMsg; } catch (e) {}
                 if (response.status === 404) errorMsg = "Invalid or expired link.";
                throw new Error(errorMsg);
            }
            const data = await response.json();
            setClientViewData(data);
        } catch (err) {
            console.error("Failed to fetch public client data:", err);
            setError(err.message || "Could not load client information.");
            setClientViewData(null);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchPublicData();
    }, [fetchPublicData]);

    // Handle file input change
    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setDocFile(event.target.files[0]);
            if (!docTitle) { setDocTitle(event.target.files[0].name.split('.').slice(0, -1).join('.')); }
        } else {
            setDocFile(null);
        }
    };

    // Handle document upload submission
    const handleDocumentSubmit = async (e) => {
        e.preventDefault();
        if (!docFile) { setUploadError('Please select a file.'); return; }
        if (!docTitle.trim()) { setUploadError('Please enter a document title.'); return; }

        setIsUploading(true); setUploadError(''); setUploadSuccess('');

        const formData = new FormData();
        formData.append('title', docTitle);
        formData.append('documentType', docType);
        formData.append('file', docFile);

        try {
            const response = await fetch(`https://api.goclientwise.com/api/portal/client/${token}/documents`, {
                method: 'POST',
                // No Content-Type header needed for FormData
                body: formData,
            });
            const result = await response.json();
            if (!response.ok) { throw new Error(result.error || `Upload failed (${response.status})`); }

            setUploadSuccess(`Document '${result.title}' uploaded successfully!`);
            // Clear form and refresh document list
            setDocTitle(''); setDocType('Other'); setDocFile(null);
            if(fileInputRef.current) fileInputRef.current.value = '';
            fetchPublicData(); // Refresh data to show new document

        } catch (err) {
            console.error("Document Upload Error:", err);
            setUploadError(err.message || "An unknown error occurred during upload.");
        } finally {
            setIsUploading(false);
        }
    };


    // --- Rendering Logic ---
    if (isLoading) { return <div className="flex h-screen items-center justify-center text-gray-600"><i className="fas fa-spinner fa-spin text-3xl mr-3"></i> Loading Information...</div>; }
    if (error) { return <div className="flex h-screen items-center justify-center text-red-600 p-6 bg-red-50 border border-red-200 rounded-md max-w-md mx-auto">{error}</div>; }
    if (!clientViewData) { return <div className="flex h-screen items-center justify-center text-gray-600">Could not load client data.</div>; }

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8" style={{'--brand-purple': themeColors.brandPurple}}>
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
                {/* Header */}
                <div className="text-center mb-8 pb-4 border-b">
                    <h1 className="text-2xl font-semibold text-[--brand-purple]">Client Portal</h1>
                    <p className="text-lg text-gray-700 mt-1">Welcome, {clientViewData.name}!</p>
                    <p className="text-sm text-gray-500">View your details and upload required documents.</p>
                </div>

                {/* Client Details (Read Only) */}
                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Your Information</h2>
                    <div className="text-sm text-gray-700 space-y-1 bg-gray-50 p-4 rounded-md border">
                        <p><strong>Name:</strong> {clientViewData.name}</p>
                        {clientViewData.email && <p><strong>Email:</strong> {clientViewData.email}</p>}
                        {clientViewData.phone && <p><strong>Phone:</strong> {clientViewData.phone}</p>}
                        {/* Add other client-safe fields from PublicClientView here if needed */}
                    </div>
                </section>

                {/* Policies (Read Only) */}
                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">Your Policies</h2>
                    <div className="overflow-x-auto border rounded-md">
                        {clientViewData.policies?.length > 0 ? (
                             <table className="w-full min-w-[500px] text-sm">
                                <thead><tr className="bg-gray-50"> <th className="p-2 text-left font-medium text-gray-600">Policy #</th> <th className="p-2 text-left font-medium text-gray-600">Product/Insurer</th> <th className="p-2 text-left font-medium text-gray-600">Status</th> <th className="p-2 text-left font-medium text-gray-600">Expiry</th> </tr></thead>
                                <tbody className="divide-y">
                                    {clientViewData.policies.map(p => (
                                        <tr key={p.id}>
                                            <td className="p-2">{p.policyNumber}</td>
                                            <td className="p-2">{p.productId?.String || 'N/A'} ({p.insurer})</td>
                                            <td className="p-2"><span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getPolicyStatusClass(p.status)}`}>{p.status}</span></td>
                                            <td className="p-2">{formatDate(p.endDate?.String)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                             </table>
                        ) : (
                            <p className="text-sm text-gray-500 italic p-4">No active policies found.</p>
                        )}
                    </div>
                </section>

                {/* Existing Documents (Read Only) */}
                <section className="mb-8">
                     <h2 className="text-lg font-semibold text-gray-800 mb-3">Uploaded Documents</h2>
                     {clientViewData.documents?.length > 0 ? (
                        <ul className="space-y-2">
                            {clientViewData.documents.map(doc => (
                                <li key={doc.id} className="flex items-center justify-between p-2 border rounded-md bg-gray-50 text-sm">
                                    <span><i className="fas fa-file-alt mr-2 text-gray-400"></i>{doc.title || doc.fileUrl} ({doc.documentType})</span>
                                    <span className="text-xs text-gray-500">{formatDate(doc.uploadedAt)}</span>
                                    {/* Maybe add a download link if backend serves files? <a href={`/api/documents/${doc.id}/download`} download>Download</a> */}
                                </li>
                            ))}
                        </ul>
                     ) : (
                         <p className="text-sm text-gray-500 italic">No documents uploaded yet.</p>
                     )}
                </section>

                {/* Document Upload Section */}
                <section className="pt-6 border-t">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload Documents</h2>
                    <form onSubmit={handleDocumentSubmit} className="space-y-4 p-4 border rounded-md bg-gray-50">
                         {uploadError && <div className="text-sm text-red-700 p-2 bg-red-100 border border-red-200 rounded">{uploadError}</div>}
                         {uploadSuccess && <div className="text-sm text-green-700 p-2 bg-green-100 border border-green-200 rounded">{uploadSuccess}</div>}

                        <InputField id="doc-title" label="Document Title*" value={docTitle} onChange={e => setDocTitle(e.target.value)} required={true} placeholder="e.g., PAN Card" />
                        <div>
                            <label htmlFor="doc-type" className="block text-sm font-medium text-gray-700 mb-1">Document Type*</label>
                            <select id="doc-type" value={docType} onChange={e => setDocType(e.target.value)} required className="mt-1 block w-full form-select rounded-md shadow-sm">
                                <option>PAN Card</option>
                                <option>Aadhaar Card</option>
                                <option>Cancelled Cheque</option>
                                <option>Photo</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="doc-file" className="block text-sm font-medium text-gray-700 mb-1">Select File*</label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                id="doc-file"
                                name="file"
                                onChange={handleFileChange}
                                required
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-medium file:bg-white file:text-gray-700 hover:file:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[--brand-purple] focus:border-[--brand-purple]"
                            />
                             {docFile && <p className="text-xs text-gray-500 mt-1">Selected: {docFile.name}</p>}
                        </div>
                        <Button type="submit" variant="brand" disabled={isUploading} className="w-full sm:w-auto">
                            {isUploading ? <><i className="fas fa-spinner fa-spin mr-2"></i>Uploading...</> : <><i className="fas fa-upload mr-2"></i>Upload Document</>}
                        </Button>
                    </form>
                </section>

            </div>
        </div>
    );
};

export default ClientPortalPage;

// --- Ensure Button and InputField components are accessible ---
// // Example definitions if not imported:
// const Button = ({ children, onClick, type = 'button', variant = 'brand', className = '', disabled = false }) => { /* ... */ };
// const InputField = ({ id, label, type = 'text', value, onChange, placeholder, required = true }) => { /* ... */ };

