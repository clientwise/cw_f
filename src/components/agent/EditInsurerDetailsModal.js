import React, { useState, useEffect } from 'react';
import Button from '../common/Button'; // Adjust path if needed
import InputField from '../common/InputField'; // Adjust path if needed

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e', brandPurpleHover: '#703abc', red100: '#fee2e2', red700: '#b91c1c', /* ... */ };
const MAX_INSURERS = 10; // Allow more insurers than just POCs

const EditInsurerDetailsModal = ({ isOpen, onClose, onDetailsUpdated, currentDetails = [] }) => {
    // State for the list of insurer details being edited
    const [details, setDetails] = useState([]);

    // API/UI State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Pre-fill form when modal opens or currentDetails change
    useEffect(() => {
        if (isOpen) {
            // Initialize details state from prop
            const initialDetails = (currentDetails || []).slice(0, MAX_INSURERS).map(d => ({
                insurerName: d.insurerName || '',
                agentCode: d.agentCode?.String || '', // Handle NullString
                spocEmail: d.spocEmail?.String || '', // Handle NullString
                commissionPercentage: d.commissionPercentage?.Valid ? d.commissionPercentage.Float64.toString() : '', // Handle NullFloat64
            }));
            setDetails(initialDetails);
            setError('');
            setIsSubmitting(false);
        }
    }, [isOpen, currentDetails]);

    // Handlers for managing details list
    const handleDetailChange = (index, field, value) => {
        const updatedDetails = [...details];
        updatedDetails[index][field] = value;
        setDetails(updatedDetails);
    };

    const addDetailRow = () => {
        if (details.length < MAX_INSURERS) {
            setDetails([...details, { insurerName: '', agentCode: '', spocEmail: '', commissionPercentage: '' }]);
        }
    };

    const removeDetailRow = (index) => {
        const updatedDetails = details.filter((_, i) => i !== index);
        setDetails(updatedDetails);
    };

    // Basic email validation helper
    const isValidEmail = (email) => {
        // Simple check, consider a more robust regex for production
        return email && email.includes('@') && email.includes('.');
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); setError('');
        const token = localStorage.getItem('authToken');
        if (!token) { setError("Authentication error."); setIsSubmitting(false); return; }

        // Validate and format payload
        const payloadDetails = [];
        let validationError = null;
        for (const detail of details) {
            const insurerName = detail.insurerName.trim();
            const agentCode = detail.agentCode.trim();
            const spocEmail = detail.spocEmail.trim();
            const commissionStr = detail.commissionPercentage.trim();
            let commission = null;

            // Insurer name is mandatory if any other field in the row is filled
            if (!insurerName && (agentCode || spocEmail || commissionStr)) {
                validationError = "Insurer Name is required for each row with other details.";
                break;
            }
            if (!insurerName) continue; // Skip completely empty rows silently

            // Validate SPOC email format if provided
            if (spocEmail && !isValidEmail(spocEmail)) {
                 validationError = `Invalid SPOC Email format for insurer "${insurerName}".`;
                 break;
            }
            // Validate commission percentage if provided
            if (commissionStr) {
                 const parsedComm = parseFloat(commissionStr);
                 if (isNaN(parsedComm) || parsedComm < 0 || parsedComm > 100) {
                     validationError = `Invalid Commission % for insurer "${insurerName}". Must be between 0 and 100.`;
                     break;
                 }
                 commission = parsedComm;
            }

            payloadDetails.push({
                insurerName: insurerName,
                agentCode: agentCode || null, // Send null if empty
                spocEmail: spocEmail || null,
                commissionPercentage: commission // Already parsed or null
            });
        }

        if (validationError) {
            setError(validationError);
            setIsSubmitting(false);
            return;
        }

        const payload = { details: payloadDetails };
        console.log("Updating Insurer Details (API Call):", payload);

        try {
           const response = await fetch(`https://api.goclientwise.com/api/agents/insurer-details`, { // Updated endpoint
              method: 'PUT',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
           });
           const data = await response.json();
           if (!response.ok) throw new Error(data.error || 'Failed to update insurer details');

           console.log("Insurer details updated:", data);
           onDetailsUpdated(); // Callback to refresh parent data
           onClose(); // Close modal
        } catch (err) {
            console.error("Update Insurer Details Error:", err);
            setError(err.message || "An unknown error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            {/* Increased max-w-4xl */}
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" style={{'--brand-purple': themeColors.brandPurple}}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-[--brand-purple]">Edit Insurer Details & Codes</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times fa-lg"></i></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {error && <div className="text-sm text-red-700 p-2 bg-red-100 border border-red-200 rounded">{error}</div>}
                     <p className="text-xs text-gray-500 mb-3">Manage your agent codes, SPOC emails, and default commission rates for insurers (Max {MAX_INSURERS}). SPOC Email is used for proposal generation.</p>
                     <div className="space-y-3">
                        {/* Header Row (Optional) */}
                         <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 px-1 pb-1 border-b">
                             <div className="col-span-4">Insurer Name*</div>
                             <div className="col-span-2">Agent Code</div>
                             <div className="col-span-4">SPOC Email</div>
                             <div className="col-span-1 text-right">Comm %</div>
                             <div className="col-span-1"></div> {/* Spacer for delete */}
                         </div>

                        {details.map((detail, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-4">
                                     <InputField id={`ins-name-${index}`} value={detail.insurerName} onChange={e => handleDetailChange(index, 'insurerName', e.target.value)} placeholder="Insurer Name" noLabel required={detail.agentCode || detail.spocEmail || detail.commissionPercentage} />
                                </div>
                                 <div className="col-span-2">
                                     <InputField id={`ins-code-${index}`} value={detail.agentCode} onChange={e => handleDetailChange(index, 'agentCode', e.target.value)} placeholder="Code" noLabel />
                                 </div>
                                 <div className="col-span-4">
                                     <InputField id={`ins-email-${index}`} type="email" value={detail.spocEmail} onChange={e => handleDetailChange(index, 'spocEmail', e.target.value)} placeholder="spoc@insurer.com" noLabel />
                                 </div>
                                 <div className="col-span-1">
                                      <InputField id={`ins-comm-${index}`} type="number" step="0.01" min="0" max="100" value={detail.commissionPercentage} onChange={e => handleDetailChange(index, 'commissionPercentage', e.target.value)} placeholder="%" noLabel className="text-right"/>
                                 </div>
                                 <div className="col-span-1 text-right">
                                     <button type="button" onClick={() => removeDetailRow(index)} className="text-red-500 hover:text-red-700 p-1" title="Remove Row">
                                         <i className="fas fa-trash-alt"></i>
                                     </button>
                                 </div>
                            </div>
                        ))}
                     </div>
                     {details.length < MAX_INSURERS && (
                        <Button type="button" onClick={addDetailRow} variant="outlineSm" className="mt-3 text-xs">
                            <i className="fas fa-plus mr-1"></i> Add Insurer Row
                        </Button>
                     )}

                     <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                        <Button type="button" variant="outlineSm" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="brand" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving Details...' : 'Save Insurer Details'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Helper component used above
// const InputField = ({ id, label, noLabel = false, ...props }) => (
//     <div>
//         {!noLabel && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
//         <input id={id} {...props} className={`mt-1 block w-full form-input rounded-md shadow-sm ${props.type === 'number' ? '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' : ''} sm:text-sm ${props.className || ''}`} />
//     </div>
// );


export default EditInsurerDetailsModal;
