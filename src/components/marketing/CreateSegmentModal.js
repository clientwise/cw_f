import React, { useState, useEffect } from 'react';
import Button from '../common/Button'; // Adjust path if needed
import InputField from '../common/InputField'; // Adjust path if needed

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e', brandPurpleHover: '#703abc', red100: '#fee2e2', red700: '#b91c1c', /* ... */ };

const CreateSegmentModal = ({ isOpen, onClose, onSegmentCreated }) => {
    const [name, setName] = useState('');
    const [criteria, setCriteria] = useState(''); // Simple description for now
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Reset form when modal opens or closes
        if (!isOpen) {
            setName('');
            setCriteria('');
            setError('');
            setIsSubmitting(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) { setError('Segment name cannot be empty.'); return; }
        // Add more validation if needed (e.g., for criteria if it becomes structured)
        setIsSubmitting(true); setError('');
        const token = localStorage.getItem('authToken');
        if (!token) { setError("Authentication error."); setIsSubmitting(false); return; }

        const payload = { name, criteria };

        console.log("Submitting Segment (Simulation):", payload);
        // TODO: Replace with actual API call: POST /api/marketing/segments
        try {
           const response = await fetch(`http://localhost:8080/api/marketing/segments`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
           });
           const data = await response.json();
           if (!response.ok) throw new Error(data.error || 'Failed to create segment');
           onSegmentCreated(); // Callback to refresh parent data
           onClose();
        } catch (err) { setError(err.message); }
        finally { setIsSubmitting(false); }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 700));
        setIsSubmitting(false);
        onSegmentCreated(); // Simulate success
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col" style={{'--brand-purple': themeColors.brandPurple}}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-[--brand-purple]">Create New Client Segment</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times fa-lg"></i></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {error && <div className="text-sm text-red-700 p-2 bg-red-100 border border-red-200 rounded">{error}</div>}
                    <InputField id="segment-name" label="Segment Name*" value={name} onChange={e => setName(e.target.value)} required />
                    <div>
                        <label htmlFor="segment-criteria" className="block text-sm font-medium text-gray-700 mb-1">Criteria / Description</label>
                        <textarea
                            id="segment-criteria"
                            rows="4"
                            value={criteria}
                            onChange={e => setCriteria(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm"
                            placeholder="Describe the criteria for this segment (e.g., 'Clients with active Health policy, age > 40'). Future versions might allow structured rules."
                        />
                    </div>
                     <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button type="button" variant="outlineSm" onClick={onClose} className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-4 py-2">Cancel</Button>
                        <Button type="submit" variant="brand" disabled={isSubmitting} className="px-4 py-2">
                            {isSubmitting ? 'Saving...' : 'Create Segment'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateSegmentModal;
