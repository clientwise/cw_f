import React, { useState, useEffect } from 'react';
import Button from '../common/Button'; // Adjust path if needed
import InputField from '../common/InputField'; // Adjust path if needed

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e', brandPurpleHover: '#703abc', red100: '#fee2e2', red700: '#b91c1c', /* ... */ };

const EditSegmentModal = ({ isOpen, onClose, onSegmentUpdated, segmentData }) => {
    // State for form fields
    const [name, setName] = useState('');
    const [criteria, setCriteria] = useState('');

    // API/UI State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Pre-fill form when modal opens or segmentData changes
    useEffect(() => {
        if (isOpen && segmentData) {
            setName(segmentData.name || '');
            setCriteria(segmentData.criteria?.String || ''); // Handle NullString
            setError('');
            setIsSubmitting(false);
        }
    }, [isOpen, segmentData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!segmentData?.id) { setError("Segment ID missing."); return; }
        if (!name.trim()) { setError('Segment name cannot be empty.'); return; }

        setIsSubmitting(true); setError('');
        const token = localStorage.getItem('authToken');
        if (!token) { setError("Authentication error."); setIsSubmitting(false); return; }

        const payload = {
            name: name.trim(),
            criteria: criteria.trim() || null, // Send null if empty
        };

        console.log(`Updating Segment ${segmentData.id} (API Call):`, payload);

        try {
           // --- Actual API Call ---
           const response = await fetch(`https://api.goclientwise.com/api/marketing/segments/${segmentData.id}`, {
              method: 'PUT', // Use PUT for update
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
               },
              body: JSON.stringify(payload)
           });
           const data = await response.json();
           if (!response.ok) {
               throw new Error(data.error || `Failed to update segment (${response.status})`);
           }
           // --- End API Call ---

           console.log("Segment updated:", data);
           onSegmentUpdated(); // Callback to refresh parent data
           onClose(); // Close modal on success
        } catch (err) {
            console.error("Update Segment Error:", err);
            setError(err.message || "An unknown error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col" style={{'--brand-purple': themeColors.brandPurple}}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-[--brand-purple]">Edit Client Segment</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times fa-lg"></i></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {error && <div className="text-sm text-red-700 p-2 bg-red-100 border border-red-200 rounded">{error}</div>}
                    {/* Display Segment ID (read-only) */}
                    <p className="text-xs text-gray-500">Segment ID: {segmentData?.id || 'N/A'}</p>

                    <InputField id="edit-segment-name" label="Segment Name*" value={name} onChange={e => setName(e.target.value)} required />
                    <div>
                        <label htmlFor="edit-segment-criteria" className="block text-sm font-medium text-gray-700 mb-1">Criteria / Description</label>
                        <textarea
                            id="edit-segment-criteria"
                            rows="4"
                            value={criteria}
                            onChange={e => setCriteria(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm"
                            placeholder="Describe the criteria for this segment (e.g., 'Clients with active Health policy, age > 40')."
                        />
                    </div>
                     <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
                        <Button type="button" variant="outlineSm" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="brand" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Update Segment'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSegmentModal;
