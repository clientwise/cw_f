import React, { useState, useEffect } from 'react';
import Button from '../common/Button'; // Adjust path if needed
import InputField from '../common/InputField';
// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e', brandPurpleHover: '#703abc', red100: '#fee2e2', red700: '#b91c1c', /* ... */ };
const MAX_POCS = 6;

const EditInsurerPOCsModal = ({ isOpen, onClose, onPocsUpdated, currentPocs = [] }) => {
    // State for the list of POCs being edited
    const [pocs, setPocs] = useState([]);

    // API/UI State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Pre-fill form when modal opens or currentPocs change
    useEffect(() => {
        if (isOpen) {
            // Initialize POCs state from prop (ensure it's an array, max 6)
            const initialPocs = (currentPocs || []).slice(0, MAX_POCS).map(p => ({
                insurerName: p.insurerName || '',
                pocEmail: p.pocEmail || ''
                // We don't need ID for sending update payload
            }));
            setPocs(initialPocs);
            setError('');
            setIsSubmitting(false);
        }
    }, [isOpen, currentPocs]);

    // Handlers for managing POC list
    const handlePocChange = (index, field, value) => {
        const updatedPocs = [...pocs];
        updatedPocs[index][field] = value;
        setPocs(updatedPocs);
    };

    const addPocRow = () => {
        if (pocs.length < MAX_POCS) {
            setPocs([...pocs, { insurerName: '', pocEmail: '' }]);
        }
    };

    const removePocRow = (index) => {
        const updatedPocs = pocs.filter((_, i) => i !== index);
        setPocs(updatedPocs);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); setError('');
        const token = localStorage.getItem('authToken');
        if (!token) { setError("Authentication error."); setIsSubmitting(false); return; }

        // Filter out rows where both fields are empty, ensure email format is basic valid
        const validPocs = pocs.filter(p => p.insurerName.trim() || p.pocEmail.trim()).map(p => ({
             insurerName: p.insurerName.trim(),
             // Basic email check - more robust needed for production
             pocEmail: p.pocEmail.includes('@') ? p.pocEmail.trim() : ''
        })).filter(p => p.insurerName && p.pocEmail); // Ensure both are non-empty after trim/validation

        if (validPocs.length === 0 && pocs.length > 0) {
            // If user cleared all rows, still proceed to delete them on backend
             console.log("Submitting empty POC list to clear existing ones.");
        } else if (validPocs.length !== pocs.filter(p => p.insurerName.trim() || p.pocEmail.trim()).length) {
             setError("Please ensure all entered rows have both Insurer Name and a valid POC Email.");
             setIsSubmitting(false);
             return;
        }


        const payload = { pocs: validPocs }; // Send only valid ones
        console.log("Updating Insurer POCs (API Call):", payload);

        try {
           const response = await fetch(`http://localhost:8080/api/agents/insurer-pocs`, {
              method: 'PUT',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
           });
           const data = await response.json();
           if (!response.ok) throw new Error(data.error || 'Failed to update insurer contacts');

           console.log("Insurer POCs updated:", data);
           onPocsUpdated(); // Callback to refresh parent data
           onClose(); // Close modal
        } catch (err) {
            console.error("Update POCs Error:", err);
            setError(err.message || "An unknown error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col" style={{'--brand-purple': themeColors.brandPurple}}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-[--brand-purple]">Edit Insurer Contacts (POCs)</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times fa-lg"></i></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {error && <div className="text-sm text-red-700 p-2 bg-red-100 border border-red-200 rounded">{error}</div>}
                     <p className="text-xs text-gray-500 mb-3">Add up to {MAX_POCS} insurer contacts. These emails may be used for proposal generation.</p>
                     <div className="space-y-3">
                        {pocs.map((poc, index) => (
                            <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end border-b pb-3 last:border-b-0">
                                <div className="sm:col-span-5">
                                     <InputField id={`poc-insurer-${index}`} label={`Insurer ${index + 1}`} value={poc.insurerName} onChange={e => handlePocChange(index, 'insurerName', e.target.value)} placeholder="Insurer Name" noLabel={index > 0} required={poc.pocEmail.trim() !== ''} />
                                </div>
                                 <div className="sm:col-span-6">
                                     <InputField id={`poc-email-${index}`} label={`POC Email ${index + 1}`} type="email" value={poc.pocEmail} onChange={e => handlePocChange(index, 'pocEmail', e.target.value)} placeholder="pointofcontact@insurer.com" noLabel={index > 0} required={poc.insurerName.trim() !== ''} />
                                 </div>
                                 <div className="sm:col-span-1 text-right">
                                     <button type="button" onClick={() => removePocRow(index)} className="text-red-500 hover:text-red-700 p-1" title="Remove Row">
                                         <i className="fas fa-trash-alt"></i>
                                     </button>
                                 </div>
                            </div>
                        ))}
                     </div>
                     {pocs.length < MAX_POCS && (
                        <Button type="button" onClick={addPocRow} variant="outlineSm" className="mt-3 text-xs">
                            <i className="fas fa-plus mr-1"></i> Add Insurer Contact
                        </Button>
                     )}

                     <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                        <Button type="button" variant="outlineSm" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="brand" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving Contacts...' : 'Save Contacts'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditInsurerPOCsModal;
