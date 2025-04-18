import React, { useState, useEffect } from 'react';
import Button from '../common/Button'; // Adjust path if needed

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e', brandPurpleHover: '#703abc', red100: '#fee2e2', red700: '#b91c1c' };

const LogInteractionModal = ({ isOpen, onClose, clientId, onLogAdded }) => {
    const [type, setType] = useState('Call');
    const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 16));
    const [summary, setSummary] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setType('Call'); setDateTime(new Date().toISOString().slice(0, 16));
            setSummary(''); setError(''); setIsSubmitting(false);
        } else {
            setDateTime(new Date().toISOString().slice(0, 16)); // Reset time on open
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!summary.trim()) { setError('Summary/Notes cannot be empty.'); return; }
        setIsSubmitting(true); setError('');
        const token = localStorage.getItem('authToken');
        if (!token) { setError("Authentication error."); setIsSubmitting(false); return; }

        const payload = {
            type,
            timestamp: new Date(dateTime).toISOString(), // Send as ISO string
            summary,
        };

        console.log("Submitting Interaction Log:", payload);

        try {
           const response = await fetch(`http://localhost:8080/api/clients/${clientId}/communications`, {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
           });
           const data = await response.json(); // Attempt to parse JSON regardless of status
           if (!response.ok) {
               throw new Error(data.error || `Failed to log interaction (${response.status})`);
           }
           console.log("Log added response:", data);
           onLogAdded(); // Callback to refresh parent data
           onClose(); // Close modal on success
        } catch (err) {
            console.error("Log Interaction Error:", err);
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
                    <h2 className="text-lg font-semibold text-[--brand-purple]">Log New Interaction</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times fa-lg"></i></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {error && <div className="text-sm text-red-700 p-2 bg-red-50 border border-red-200 rounded">{error}</div>}
                    <div>
                        <label htmlFor="log-type" className="block text-sm font-medium text-gray-700 mb-1">Interaction Type</label>
                        <select id="log-type" value={type} onChange={e => setType(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm">
                            <option>Call</option> <option>Email</option> <option>Meeting</option> <option>Note</option> <option>Other</option>
                        </select>
                    </div>
                    <div>
                         <label htmlFor="log-datetime" className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                         <input type="datetime-local" id="log-datetime" value={dateTime} onChange={e => setDateTime(e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="log-summary" className="block text-sm font-medium text-gray-700 mb-1">Summary / Notes</label>
                        <textarea id="log-summary" rows="4" value={summary} onChange={e => setSummary(e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm" placeholder="Enter details about the interaction..."></textarea>
                    </div>
                     <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button type="button" variant="outlineSm" onClick={onClose} className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-4 py-2">Cancel</Button>
                        <Button type="submit" variant="brand" disabled={isSubmitting} className="px-4 py-2">
                            {isSubmitting ? 'Logging...' : 'Log Interaction'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LogInteractionModal;
