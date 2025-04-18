import React, { useState, useEffect } from 'react';
import Button from '../common/Button'; // Adjust path if needed

// Assume themeColors is available globally or via context/props
const themeColors = {
    brandPurple: '#5a239e', brandPurpleHover: '#703abc',
    lightGray: '#f9fafb', mediumGray: '#6b7280', darkGray: '#1f2937',
    white: '#ffffff', gray100: '#f3f4f6', gray200: '#e5e7eb',
    gray500: '#6b7280', gray600: '#4b5563', gray700: '#374151',
    red100: '#fee2e2', red700: '#b91c1c', green100: '#dcfce7', green700: '#15803d',
};

// Props:
// - isOpen: boolean - controls modal visibility
// - onClose: function - called to close the modal
// - policy: object - details of the policy being shared (e.g., { id, name, policyNo, ... })
const ShareSummaryModal = ({ isOpen, onClose, policy }) => {
    const [includeWording, setIncludeWording] = useState(true);
    const [includeProposal, setIncludeProposal] = useState(true);
    const [aiSummary, setAiSummary] = useState('');
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);
    const [isLoadingLink, setIsLoadingLink] = useState(false);
    const [isLoadingPdf, setIsLoadingPdf] = useState(false);
    const [generatedLink, setGeneratedLink] = useState('');
    const [error, setError] = useState('');

    // Fetch AI Summary when modal opens for a specific policy
    useEffect(() => {
        if (isOpen && policy?.id) {
            setGeneratedLink(''); // Clear previous link
            setError('');
            setAiSummary(''); // Clear previous summary
            setIsLoadingSummary(true);

            // --- Placeholder for API call to get AI Summary ---
            console.log(`TODO: Fetch AI Summary for policy ID: ${policy.id}`);
            const token = localStorage.getItem('authToken');
            // Example: fetch(`/api/policies/${policy.id}/summarize`, { headers: { 'Authorization': `Bearer ${token}` } })
            //   .then(res => res.json())
            //   .then(data => setAiSummary(data.summary))
            //   .catch(err => setError('Failed to load AI Summary'))
            //   .finally(() => setIsLoadingSummary(false));

            // Simulate fetch
            setTimeout(() => {
                setAiSummary(`This is a concise AI summary for ${policy.name} (${policy.policyNo}). It highlights key coverages like hospitalization up to X amount, critical illness benefits (if any), and major exclusions such as Y. The premium is Z, payable annually.`);
                setIsLoadingSummary(false);
            }, 800);
            // --- End Placeholder ---
        }
    }, [isOpen, policy]); // Rerun if modal opens or policy changes

    // Handler for generating sharable link
    const handleGenerateLink = async () => {
        setIsLoadingLink(true);
        setError('');
        setGeneratedLink('');
        const token = localStorage.getItem('authToken');
        console.log(`TODO: Call API to generate share link for policy ${policy?.id}`, { includeWording, includeProposal });

        // Example: fetch(`/api/policies/${policy.id}/share-link`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ includeWording, includeProposal }) }) ...
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        // Assume API returns { link: 'https://clientwise.public/s/xyz123' }
        setGeneratedLink(`https://clientwise.public/s/${policy?.id || 'xyz123'}`); // Placeholder link
        setIsLoadingLink(false);
    };

    // Handler for downloading PDF
    const handleDownloadPdf = async () => {
        setIsLoadingPdf(true);
        setError('');
        const token = localStorage.getItem('authToken');
        console.log(`TODO: Call API to download PDF summary for policy ${policy?.id}`, { includeWording, includeProposal });

        // Example: fetch(`/api/policies/${policy.id}/summary.pdf?wording=${includeWording}&proposal=${includeProposal}`, { headers: { 'Authorization': `Bearer ${token}` } })
        //  .then(response => response.blob())
        //  .then(blob => { /* Create a link and click it to download */ }) ...
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
        alert('PDF download started (Simulation)');
        setIsLoadingPdf(false);
        // onClose(); // Optionally close modal after triggering download
    };

    // Function to copy generated link
     const handleCopyLink = () => {
        if (!generatedLink) return;
        navigator.clipboard.writeText(generatedLink).then(() => {
            alert('Link copied to clipboard!'); // Simple feedback
        }).catch(err => console.error('Failed to copy link: ', err));
    };


    if (!isOpen || !policy) {
        return null;
    }

    return (
        // Modal Overlay
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            {/* Modal Content Box */}
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col" style={{'--brand-purple': themeColors.brandPurple}}>
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-[--brand-purple]">
                       <i className="fas fa-share-alt mr-2"></i> Share Policy Summary
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close modal">
                        <i className="fas fa-times fa-lg"></i>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4 overflow-y-auto">
                    <p className="text-sm text-gray-700">
                        Share an AI-generated summary for policy <span className="font-semibold">{policy.policyNo} ({policy.name})</span> with your client.
                    </p>

                    {/* AI Summary Section */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-800 mb-1">AI Generated Summary:</h4>
                        <div className="p-3 border rounded bg-gray-50 text-sm text-gray-700 min-h-[80px]">
                            {isLoadingSummary ? (
                                <span className="italic text-gray-500">Generating summary...</span>
                            ) : error ? (
                                <span className="text-red-600">{error}</span>
                            ) : (
                                aiSummary || <span className="italic text-gray-500">No summary available.</span>
                            )}
                        </div>
                    </div>

                    {/* Include Options */}
                    <div className="space-y-2">
                         <h4 className="text-sm font-medium text-gray-800 mb-1">Include Links To:</h4>
                         <label className="flex items-center text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={includeWording}
                                onChange={(e) => setIncludeWording(e.target.checked)}
                                className="h-4 w-4 text-[--brand-purple] focus:ring-[--brand-purple] border-gray-300 rounded mr-2"
                            />
                            Policy Wording Document
                         </label>
                          <label className="flex items-center text-sm text-gray-700">
                            <input
                                type="checkbox"
                                checked={includeProposal}
                                onChange={(e) => setIncludeProposal(e.target.checked)}
                                className="h-4 w-4 text-[--brand-purple] focus:ring-[--brand-purple] border-gray-300 rounded mr-2"
                            />
                            Original Proposal Document
                         </label>
                    </div>

                    {/* Generated Link Display */}
                    {generatedLink && (
                        <div className="p-3 border rounded bg-green-50 border-green-200">
                            <label className="block text-xs font-medium text-green-800 mb-1">Sharable Link Generated:</label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={generatedLink}
                                    className="flex-grow px-2 py-1 border border-green-300 rounded-md text-sm text-green-900 bg-white focus:outline-none focus:ring-1 focus:ring-[--brand-purple]"
                                    aria-label="Sharable Link"
                                />
                                <button
                                    onClick={handleCopyLink}
                                    title="Copy Link"
                                    className="p-1.5 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[--brand-purple]"
                                >
                                    <i className="fas fa-copy w-4 h-4"></i>
                                </button>
                            </div>
                        </div>
                    )}

                     {/* Display API Error during generation */}
                    {error && !isLoadingSummary && ( // Show only if not summary loading error
                        <div className="text-sm text-red-600" role="alert">
                           {error}
                        </div>
                     )}

                </div>

                {/* Modal Footer Actions */}
                <div className="flex justify-end items-center space-x-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <Button variant="outlineSm" onClick={onClose} className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-4 py-2">
                        Cancel
                    </Button>
                    <Button
                        variant="brand"
                        onClick={handleDownloadPdf}
                        disabled={isLoadingPdf || isLoadingSummary}
                        className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 border-blue-600 focus:ring-blue-500" // Example different color
                    >
                         <i className={`fas ${isLoadingPdf ? 'fa-spinner fa-spin' : 'fa-file-pdf'} w-4 h-4 mr-2`}></i>
                         {isLoadingPdf ? 'Generating...' : 'Download PDF'}
                    </Button>
                    <Button
                        variant="brand"
                        onClick={handleGenerateLink}
                        disabled={isLoadingLink || isLoadingSummary}
                        className="px-4 py-2 text-sm"
                    >
                         <i className={`fas ${isLoadingLink ? 'fa-spinner fa-spin' : 'fa-link'} w-4 h-4 mr-2`}></i>
                         {isLoadingLink ? 'Generating...' : 'Generate Link'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ShareSummaryModal;
