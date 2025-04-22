import React, { useState, useEffect } from 'react';
import Button from '../common/Button'; // Adjust path if needed

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
    gray700: '#374151',
};

const AddTaskModal = ({ isOpen, onClose, clientId, onTaskAdded }) => {
    // State for form fields
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(''); // Format: YYYY-MM-DD
    const [isUrgent, setIsUrgent] = useState(false); // Simple priority flag

    // State for API interaction
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Reset form state when the modal is opened or closed
    useEffect(() => {
        if (!isOpen) {
            setDescription('');
            setDueDate('');
            setIsUrgent(false);
            setError('');
            setIsSubmitting(false);
        }
    }, [isOpen]);

    // Handle form submission to the backend API
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        // Basic validation
        if (!description.trim()) {
            setError('Task description cannot be empty.');
            return;
        }
        setIsSubmitting(true);
        setError('');

        // Get auth token
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError("Authentication error. Please log in again.");
            setIsSubmitting(false);
            return;
        }

        // Prepare payload for the backend
        const payload = {
            description,
            dueDate: dueDate || null, // Send null if due date is empty
            isUrgent,
        };

        console.log("Submitting Task:", payload);

        try {
           // Make the API call to the backend endpoint
           const response = await fetch(`https://api.goclientwise.com/api/clients/${clientId}/tasks`, {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${token}`, // Include JWT token
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
           });

           const data = await response.json(); // Attempt to parse JSON response

           if (!response.ok) {
               // Throw error using message from backend if available
               throw new Error(data.error || `Failed to add task (${response.status})`);
           }

           console.log("Task added response:", data);
           onTaskAdded(); // Callback function to notify parent (e.g., to refresh task list)
           onClose(); // Close the modal on success

        } catch (err) {
            console.error("Add Task Error:", err);
            setError(err.message || "An unknown error occurred. Please try again.");
        } finally {
            setIsSubmitting(false); // Re-enable submit button
        }
    };

    // Don't render the modal if it's not open
    if (!isOpen) return null;

    // Render the modal structure
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col" style={{'--brand-purple': themeColors.brandPurple}}>
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-[--brand-purple]">Add New Task for Client</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close modal">
                        <i className="fas fa-times fa-lg"></i>
                    </button>
                </div>
                {/* Modal Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {/* Display error message if any */}
                    {error && <div className="text-sm text-red-700 p-2 bg-red-100 border border-red-200 rounded">{error}</div>}

                    {/* Task Description */}
                    <div>
                        <label htmlFor="task-desc" className="block text-sm font-medium text-gray-700 mb-1">Task Description*</label>
                        <textarea
                            id="task-desc"
                            rows="3"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm"
                            placeholder="E.g., Follow up on renewal quote..."
                        />
                    </div>

                     {/* Due Date */}
                     <div>
                        <label htmlFor="task-due" className="block text-sm font-medium text-gray-700 mb-1">Due Date (Optional)</label>
                        <input
                            type="date"
                            id="task-due"
                            value={dueDate}
                            onChange={e => setDueDate(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm"
                        />
                     </div>

                     {/* Urgency Checkbox */}
                     <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="task-urgent"
                            checked={isUrgent}
                            onChange={e => setIsUrgent(e.target.checked)}
                            className="h-4 w-4 text-[--brand-purple] focus:ring-[--brand-purple] border-gray-300 rounded mr-2"
                        />
                        <label htmlFor="task-urgent" className="text-sm font-medium text-gray-700">Mark as Urgent</label>
                     </div>

                     {/* Modal Footer Actions */}
                     <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <Button type="button" variant="outlineSm" onClick={onClose} className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-4 py-2">
                            Cancel
                        </Button>
                        <Button type="submit" variant="brand" disabled={isSubmitting} className="px-4 py-2">
                            {isSubmitting ? 'Saving...' : 'Add Task'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTaskModal;
