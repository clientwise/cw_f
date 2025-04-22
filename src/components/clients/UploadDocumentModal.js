import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import Button from '../common/Button'; // Adjust path if needed
import InputField from '../common/InputField'; // Adjust path if needed

// Assume themeColors is available globally or via context/props
const themeColors = {
    brandPurple: '#5a239e',
    brandPurpleHover: '#703abc',
    red100: '#fee2e2',
    red700: '#b91c1c',
    // Add other colors if needed by Button/InputField
    darkGray: '#1f2937',
    white: '#ffffff',
    gray50: '#f9fafb',
    gray300: '#d1d5db',
    gray400: '#9ca3af', // Added for file input text
    gray500: '#6b7280',
    gray700: '#374151',
};

const UploadDocumentModal = ({ isOpen, onClose, clientId, onDocumentUploaded }) => {
    const [title, setTitle] = useState('');
    const [documentFile, setDocumentFile] = useState(null); // File object
    const [documentType, setDocumentType] = useState('Other'); // KYC, Proposal, Policy, Claim, Other
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null); // Ref to reset file input visually

    // Reset form state when the modal is opened or closed
    useEffect(() => {
        if (!isOpen) {
            setTitle('');
            setDocumentFile(null);
            setDocumentType('Other');
            setError('');
            setIsSubmitting(false);
            // Reset file input visually if the ref is attached
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [isOpen]);

    // Handle file selection from the input
    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setDocumentFile(event.target.files[0]);
            // Optionally set title from filename if title is empty
            if (!title) {
                // Remove extension for a cleaner default title
                setTitle(event.target.files[0].name.split('.').slice(0, -1).join('.'));
            }
        } else {
            setDocumentFile(null);
        }
    };

    // Handle form submission to the backend API
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validation
        if (!documentFile) { setError('Please select a file to upload.'); return; }
        if (!title.trim()) { setError('Please provide a title/description for the document.'); return; }

        setIsSubmitting(true);
        setError('');

        const token = localStorage.getItem('authToken');
        if (!token) {
            setError("Authentication error. Please log in again.");
            setIsSubmitting(false);
            return;
        }

        // Use FormData for file uploads
        const formData = new FormData();
        formData.append('clientId', clientId); // Backend might get this from URL param instead
        formData.append('title', title);
        formData.append('documentType', documentType);
        formData.append('file', documentFile); // Key must match backend FormFile key

        console.log("Uploading Document:", { title, type: documentType, fileName: documentFile.name });
        // Note: Cannot directly log FormData content easily like JSON

        try {
           // Make the API call
           const response = await fetch(`https://api.goclientwise.com/api/clients/${clientId}/documents`, {
              method: 'POST',
              headers: {
                  // DO NOT set 'Content-Type': 'multipart/form-data',
                  // The browser sets it automatically with the correct boundary for FormData
                  'Authorization': `Bearer ${token}`,
              },
              body: formData // Send FormData directly
           });

           const data = await response.json(); // Attempt to parse JSON response

           if (!response.ok) {
               // Throw error using message from backend if available
               throw new Error(data.error || `Failed to upload document (${response.status})`);
           }

           console.log("Document uploaded response:", data);
           onDocumentUploaded(); // Callback function to notify parent (e.g., refresh doc list)
           onClose(); // Close the modal on success

        } catch (err) {
            console.error("Upload Document Error:", err);
            setError(err.message || "An unknown error occurred during upload.");
        } finally {
            setIsSubmitting(false); // Re-enable submit button
        }
    };

    // Don't render the modal if it's not open
    if (!isOpen) return null;

    return (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col" style={{'--brand-purple': themeColors.brandPurple}}>
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-[--brand-purple]">Upload Document</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close modal">
                        <i className="fas fa-times fa-lg"></i>
                    </button>
                </div>
                {/* Modal Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {/* Display Error Message */}
                    {error && <div className="text-sm text-red-700 p-2 bg-red-100 border border-red-200 rounded">{error}</div>}

                    {/* Document Title */}
                    <InputField id="doc-title" label="Document Title/Description*" value={title} onChange={e => setTitle(e.target.value)} required />

                    {/* Document Type */}
                    <div>
                        <label htmlFor="doc-type" className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                        <select
                            id="doc-type"
                            value={documentType}
                            onChange={e => setDocumentType(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm"
                        >
                            <option>KYC</option>
                            <option>Proposal</option>
                            <option>Policy Copy</option>
                            <option>Claim Form</option>
                            <option>Other</option>
                        </select>
                    </div>

                    {/* File Input */}
                    <div>
                        <label htmlFor="client-doc-upload" className="block text-sm font-medium text-gray-700 mb-1">Select File*</label>
                        <input
                            ref={fileInputRef} // Assign ref to allow programmatic reset
                            type="file"
                            id="client-doc-upload"
                            name="file" // Name should match backend FormFile key
                            onChange={handleFileChange}
                            required
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" // Specify acceptable file types
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-white file:text-gray-700 hover:file:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[--brand-purple] focus:border-[--brand-purple]"
                        />
                        {/* Display selected filename */}
                        {documentFile && <p className="text-xs text-gray-500 mt-1">Selected: {documentFile.name}</p>}
                    </div>

                     {/* Modal Footer Actions */}
                     <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <Button type="button" variant="outlineSm" onClick={onClose} className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-4 py-2">Cancel</Button>
                        <Button type="submit" variant="brand" disabled={isSubmitting} className="px-4 py-2">
                            {isSubmitting ? 'Uploading...' : 'Upload Document'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadDocumentModal;
