import React, { useState, useEffect } from 'react';
import Button from '../common/Button'; // Adjust path if needed
import InputField from '../common/InputField'; // Adjust path if needed

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e', brandPurpleHover: '#703abc', red100: '#fee2e2', red700: '#b91c1c', /* ... */ };

const EditAgentGoalModal = ({ isOpen, onClose, onGoalUpdated, currentGoal }) => {
    const [targetIncome, setTargetIncome] = useState('');
    const [targetPeriod, setTargetPeriod] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Pre-fill form when modal opens
    useEffect(() => {
        if (isOpen) {
            setTargetIncome(currentGoal?.targetIncome?.Float64 || '');
            setTargetPeriod(currentGoal?.targetPeriod?.String || '');
            setError('');
            setIsSubmitting(false);
        }
    }, [isOpen, currentGoal]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!targetPeriod.trim()) { setError('Target Period cannot be empty.'); return; }
        // Validate period format if needed (e.g., YYYY-QQ or YYYY-Annual)
        setIsSubmitting(true); setError('');
        const token = localStorage.getItem('authToken');
        if (!token) { setError("Authentication error."); setIsSubmitting(false); return; }

        const incomeValue = parseFloat(targetIncome);
        const payload = {
            targetIncome: !isNaN(incomeValue) ? incomeValue : null, // Send null if empty/invalid
            targetPeriod: targetPeriod.trim(),
        };

        console.log("Updating Agent Goal (API Call):", payload);

        try {
           const response = await fetch(`http://localhost:8080/api/agents/goals`, {
              method: 'PUT',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
           });
           const data = await response.json();
           if (!response.ok) throw new Error(data.error || 'Failed to update goal');
           console.log("Goal updated:", data);
           onGoalUpdated(); // Callback to refresh parent data
           onClose(); // Close modal
        } catch (err) {
            console.error("Update Goal Error:", err);
            setError(err.message || "An unknown error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col" style={{'--brand-purple': themeColors.brandPurple}}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-[--brand-purple]">Set/Update Income Goal</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times fa-lg"></i></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {error && <div className="text-sm text-red-700 p-2 bg-red-100 border border-red-200 rounded">{error}</div>}
                    <InputField
                        id="target-income"
                        label="Target Income (₹)"
                        type="number"
                        value={targetIncome}
                        onChange={e => setTargetIncome(e.target.value)}
                        required={false}
                        placeholder="e.g., 500000"
                    />
                    <InputField
                        id="target-period"
                        label="Target Period*"
                        value={targetPeriod}
                        onChange={e => setTargetPeriod(e.target.value)}
                        required={true}
                        placeholder="e.g., 2025-Q2, 2025-Annual"
                    />
                     <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
                        <Button type="button" variant="outlineSm" onClick={onClose} className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-4 py-2">Cancel</Button>
                        <Button type="submit" variant="brand" disabled={isSubmitting} className="px-4 py-2">
                            {isSubmitting ? 'Saving...' : 'Set Goal'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAgentGoalModal;
