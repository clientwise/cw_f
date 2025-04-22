import React, { useState, useEffect } from 'react';
import Button from '../common/Button'; // Adjust path if needed
import InputField from '../common/InputField'; // Adjust path if needed

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e', brandPurpleHover: '#703abc', red100: '#fee2e2', red700: '#b91c1c', /* ... */ };

const CreateCampaignModal = ({ isOpen, onClose, onCampaignCreated, segments = [], templates = [] }) => {
    // Form state
    const [name, setName] = useState('');
    const [targetSegmentId, setTargetSegmentId] = useState(''); // Store segment ID
    const [templateId, setTemplateId] = useState(''); // Store template ID (optional)
    const [status, setStatus] = useState('Draft'); // Default status
    // const [sendAt, setSendAt] = useState(''); // Optional scheduling

    // API/UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Reset form when modal opens or closes
        if (!isOpen) {
            setName(''); setTargetSegmentId(''); setTemplateId('');
            setStatus('Draft'); setError(''); setIsSubmitting(false);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) { setError('Campaign name cannot be empty.'); return; }
        if (!targetSegmentId) { setError('Please select a target segment.'); return; }

        setIsSubmitting(true); setError('');
        const token = localStorage.getItem('authToken');
        if (!token) { setError("Authentication error."); setIsSubmitting(false); return; }

        // Find segment name from ID for the payload (backend might only need ID)
        const targetSegment = segments.find(s => s.id.toString() === targetSegmentId);

        const payload = {
            name,
            status,
            targetSegmentId: parseInt(targetSegmentId, 10), // Send ID
            targetSegmentName: targetSegment?.name || null, // Send name for easier display later?
            templateId: templateId ? parseInt(templateId, 10) : null,
            // sendAt: sendAt || null,
        };

        console.log("Submitting Campaign (Simulation):", payload);
        // TODO: Replace with actual API call: POST /api/marketing/campaigns
        try {
           const response = await fetch(`https://api.goclientwise.com/api/marketing/campaigns`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
           });
           const data = await response.json();
           if (!response.ok) throw new Error(data.error || 'Failed to create campaign');
           onCampaignCreated(); // Callback to refresh parent data
           onClose();
        } catch (err) { setError(err.message); }
        finally { setIsSubmitting(false); }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 700));
        setIsSubmitting(false);
        onCampaignCreated(); // Simulate success
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col" style={{'--brand-purple': themeColors.brandPurple}}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-[--brand-purple]">Create New Campaign</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times fa-lg"></i></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {error && <div className="text-sm text-red-700 p-2 bg-red-100 border border-red-200 rounded">{error}</div>}
                    <InputField id="campaign-name" label="Campaign Name*" value={name} onChange={e => setName(e.target.value)} required />

                    <div>
                        <label htmlFor="target-segment" className="block text-sm font-medium text-gray-700 mb-1">Target Client Segment*</label>
                        <select id="target-segment" value={targetSegmentId} onChange={e => setTargetSegmentId(e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm">
                            <option value="" disabled>Select a segment</option>
                            {segments.map(s => <option key={s.id} value={s.id}>{s.name} ({s.clientCount?.Int64 || 0} clients)</option>)}
                        </select>
                    </div>

                     <div>
                        <label htmlFor="template-id" className="block text-sm font-medium text-gray-700 mb-1">Select Template (Optional)</label>
                        <select id="template-id" value={templateId} onChange={e => setTemplateId(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm">
                            <option value="">None (Use custom content later)</option>
                            {templates.map(t => <option key={t.id} value={t.id}>{t.name} ({t.type} - {t.category})</option>)}
                        </select>
                    </div>

                     <div>
                        <label htmlFor="campaign-status" className="block text-sm font-medium text-gray-700 mb-1">Initial Status*</label>
                        <select id="campaign-status" value={status} onChange={e => setStatus(e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm">
                            <option>Draft</option>
                            <option>Active</option> {/* Maybe only allow Draft initially? */}
                        </select>
                    </div>

                     {/* Optional: Add scheduling field */}
                     {/* <div> <label htmlFor="send-at">Schedule Send Time (Optional)</label> <input type="datetime-local" id="send-at" value={sendAt} onChange={e=>setSendAt(e.target.value)} /> </div> */}

                     <div className="flex justify-end space-x-3 pt-4 border-t">
                        <Button type="button" variant="outlineSm" onClick={onClose} className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-4 py-2">Cancel</Button>
                        <Button type="submit" variant="brand" disabled={isSubmitting} className="px-4 py-2">
                            {isSubmitting ? 'Saving...' : 'Create Campaign'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCampaignModal;
