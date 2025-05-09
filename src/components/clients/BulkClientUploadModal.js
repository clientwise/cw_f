import React, { useState, useRef, useEffect } from 'react';
import Button from '../common/Button'; // Adjust path if needed

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e', brandPurpleHover: '#703abc', red100: '#fee2e2', red700: '#b91c1c', green100: '#dcfce7', green700: '#047857', /* ... */ };

// Define expected headers for the sample download and user info
const EXPECTED_HEADERS = [
    "Name", "Email", "Phone", "DOB (YYYY-MM-DD)", "Address", "Status (Lead/Active/Lapsed)", "Tags (comma-separated)",
    "Income", "MaritalStatus", "City", "JobProfile", "Dependents", "Liability", "HousingType",
    "VehicleCount", "VehicleType", "VehicleCost"
];

const BulkClientUploadModal = ({ isOpen, onClose, onUploadComplete }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null); // Stores { successCount, failureCount, errors }
    const [error, setError] = useState(''); // For general errors (e.g., network)
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        setError(''); // Clear previous errors
        setUploadResult(null); // Clear previous results
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            // Basic validation for CSV type
            if (file.type !== "text/csv" && !file.name.toLowerCase().endsWith(".csv")) {
                setError("Invalid file type. Please select a CSV file.");
                setSelectedFile(null);
                event.target.value = null; // Reset file input
            } else {
                setSelectedFile(file);
            }
        } else {
            setSelectedFile(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) { setError('Please select a CSV file to upload.'); return; }

        setIsUploading(true); setError(''); setUploadResult(null);
        const token = localStorage.getItem('authToken');
        if (!token) { setError("Authentication error."); setIsUploading(false); return; }

        const formData = new FormData();
        formData.append('clientFile', selectedFile); // Key must match backend FormFile key

        console.log("Uploading client file:", selectedFile.name);

        try {
           const response = await fetch(`https://api.goclientwise.com/api/clients/bulk-upload`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}` }, // No Content-Type for FormData
              body: formData
           });
           const data = await response.json();
           if (!response.ok) throw new Error(data.error || `Upload failed (${response.status})`);

           console.log("Bulk Upload Result:", data);
           setUploadResult(data); // Store the summary result
           onUploadComplete(); // Trigger refresh in parent component

        } catch (err) {
            console.error("Bulk Upload Error:", err);
            setError(err.message || "An unknown error occurred during upload.");
            setUploadResult(null);
        } finally {
            setIsUploading(false);
            // Optionally clear file input after upload attempt
            // setSelectedFile(null);
            // if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // Function to generate and download a sample CSV
    const downloadSampleCsv = () => {
        const csvContent = "data:text/csv;charset=utf-8," + EXPECTED_HEADERS.join(",") + "\n"; // Header row
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "client_upload_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setSelectedFile(null);
            setIsUploading(false);
            setUploadResult(null);
            setError('');
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col" style={{'--brand-purple': themeColors.brandPurple}}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-[--brand-purple]">Bulk Upload Clients (CSV)</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times fa-lg"></i></button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    {/* Instructions */}
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
                        <p className="font-medium mb-1">Instructions:</p>
                        <ul className="list-disc list-inside text-xs space-y-1">
                            <li>Upload a CSV file (.csv extension).</li>
                            <li>The first row must be a header row matching the template.</li>
                            <li>Required columns: <strong>Name</strong>, and either <strong>Email</strong> or <strong>Phone</strong>.</li>
                            <li>Other columns are optional. Leave blank if not applicable.</li>
                            <li>Status defaults to 'Lead' if left blank or invalid.</li>
                            <li>Tags should be comma-separated.</li>
                            <li><button onClick={downloadSampleCsv} className="text-purple-600 hover:underline font-medium">Download CSV Template</button></li>
                        </ul>
                    </div>

                    {/* File Input */}
                    <div>
                        <label htmlFor="client-csv-upload" className="block text-sm font-medium text-gray-700 mb-1">Select CSV File*</label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            id="client-csv-upload"
                            name="clientFile" // Match backend expected key
                            onChange={handleFileChange}
                            required
                            accept=".csv, text/csv"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border file:border-gray-300 file:text-sm file:font-medium file:bg-white file:text-gray-700 hover:file:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[--brand-purple] focus:border-[--brand-purple]"
                        />
                        {selectedFile && <p className="text-xs text-gray-500 mt-1">Selected: {selectedFile.name}</p>}
                    </div>

                    {/* Error Display */}
                    {error && <div className="text-sm text-red-700 p-2 bg-red-100 border border-red-200 rounded">{error}</div>}

                    {/* Upload Result Display */}
                    {uploadResult && (
                        <div className={`p-3 rounded border text-sm ${uploadResult.failureCount > 0 ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                            <p className="font-medium mb-1">Upload Summary:</p>
                            <p className={uploadResult.successCount > 0 ? 'text-green-700' : 'text-gray-700'}>Successfully imported: {uploadResult.successCount} clients.</p>
                            <p className={uploadResult.failureCount > 0 ? 'text-red-700' : 'text-gray-700'}>Failed to import: {uploadResult.failureCount} records.</p>
                            {uploadResult.errors && uploadResult.errors.length > 0 && (
                                <div className="mt-2 pt-2 border-t">
                                    <p className="text-xs font-medium text-red-700 mb-1">Errors:</p>
                                    <ul className="list-disc list-inside text-xs text-red-600 max-h-20 overflow-y-auto">
                                        {uploadResult.errors.map((err, index) => <li key={index}>{err}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                </div>
                {/* Footer Actions */}
                 <div className="flex justify-end space-x-3 p-4 border-t mt-auto">
                    <Button type="button" variant="outlineSm" onClick={onClose}>Close</Button>
                    <Button
                        type="button"
                        variant="brand"
                        onClick={handleUpload}
                        disabled={isUploading || !selectedFile}
                    >
                        {isUploading ? <><i className="fas fa-spinner fa-spin mr-2"></i>Uploading...</> : <><i className="fas fa-upload mr-2"></i>Upload File</>}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BulkClientUploadModal;
