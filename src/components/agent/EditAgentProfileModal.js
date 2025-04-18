import React, { useState, useEffect } from 'react';
import Button from '../common/Button'; // Adjust path if needed
import InputField from '../common/InputField'; // Adjust path if needed

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e', brandPurpleHover: '#703abc', red100: '#fee2e2', red700: '#b91c1c', /* ... */ };

const EditAgentProfileModal = ({ isOpen, onClose, onProfileUpdated, currentProfile }) => {
    // Initialize state with current profile data or defaults
    const [mobile, setMobile] = useState('');
    const [gender, setGender] = useState('');
    const [postalAddress, setPostalAddress] = useState('');
    const [agencyName, setAgencyName] = useState('');
    const [pan, setPan] = useState('');
    const [bankName, setBankName] = useState('');
    const [bankAccountNo, setBankAccountNo] = useState('');
    const [bankIfsc, setBankIfsc] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Pre-fill form when modal opens with current data
    useEffect(() => {
        if (isOpen && currentProfile) {
            setMobile(currentProfile.mobile?.String || '');
            setGender(currentProfile.gender?.String || '');
            setPostalAddress(currentProfile.postalAddress?.String || '');
            setAgencyName(currentProfile.agencyName?.String || '');
            setPan(currentProfile.pan?.String || '');
            setBankName(currentProfile.bankName?.String || '');
            setBankAccountNo(currentProfile.bankAccountNo?.String || '');
            setBankIfsc(currentProfile.bankIfsc?.String || '');
            setError('');
            setIsSubmitting(false);
        }
    }, [isOpen, currentProfile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Add basic validation if needed (e.g., PAN format)
        setIsSubmitting(true); setError('');
        const token = localStorage.getItem('authToken');
        if (!token) { setError("Authentication error."); setIsSubmitting(false); return; }

        const payload = {
             mobile: mobile || null, // Send null if empty
             gender: gender || null,
             postalAddress: postalAddress || null,
             agencyName: agencyName || null,
             pan: pan || null,
             bankName: bankName || null,
             bankAccountNo: bankAccountNo || null,
             bankIfsc: bankIfsc || null,
        };
        // Remove null fields before sending if backend prefers absence
        // Object.keys(payload).forEach(key => payload[key] === null && delete payload[key]);

        console.log("Updating Agent Profile (API Call):", payload);

        try {
           const response = await fetch(`http://localhost:8080/api/agents/profile`, {
              method: 'PUT',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
           });
           const data = await response.json();
           if (!response.ok) {
                if (response.status === 409) throw new Error(data.error || "PAN conflict."); // Handle specific conflict error
                throw new Error(data.error || 'Failed to update profile');
            }
           console.log("Profile updated:", data);
           onProfileUpdated(); // Callback to refresh parent data
           onClose(); // Close modal
        } catch (err) {
            console.error("Update Profile Error:", err);
            setError(err.message || "An unknown error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" style={{'--brand-purple': themeColors.brandPurple}}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-[--brand-purple]">Edit Profile Details</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times fa-lg"></i></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {error && <div className="text-sm text-red-700 p-2 bg-red-100 border border-red-200 rounded">{error}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField id="edit-mobile" label="Mobile Number" type="tel" value={mobile} onChange={e => setMobile(e.target.value)} required={false} />
                         <div>
                            <label htmlFor="edit-gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                            <select id="edit-gender" value={gender} onChange={e => setGender(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm">
                                <option value="">Prefer not to say</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                         <div className="md:col-span-2">
                            <label htmlFor="edit-address" className="block text-sm font-medium text-gray-700 mb-1">Postal Address</label>
                            <textarea id="edit-address" rows="3" value={postalAddress} onChange={e => setPostalAddress(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm"></textarea>
                        </div>
                        <InputField id="edit-agency" label="Agency Name (if applicable)" value={agencyName} onChange={e => setAgencyName(e.target.value)} required={false} />
                        <InputField id="edit-pan" label="PAN" value={pan} onChange={e => setPan(e.target.value)} required={false} />
                        <InputField id="edit-bank-name" label="Bank Name" value={bankName} onChange={e => setBankName(e.target.value)} required={false} />
                        <InputField id="edit-bank-acc" label="Bank Account No." value={bankAccountNo} onChange={e => setBankAccountNo(e.target.value)} required={false} />
                        <InputField id="edit-bank-ifsc" label="Bank IFSC Code" value={bankIfsc} onChange={e => setBankIfsc(e.target.value)} required={false} />
                    </div>
                     <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
                        <Button type="button" variant="outlineSm" onClick={onClose} className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-4 py-2">Cancel</Button>
                        <Button type="submit" variant="brand" disabled={isSubmitting} className="px-4 py-2">
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAgentProfileModal;
