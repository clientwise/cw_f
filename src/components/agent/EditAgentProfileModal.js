import React, { useState, useEffect } from 'react';
import Button from '../common/Button'; // Adjust path if needed
import InputField from '../common/InputField';
// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e', brandPurpleHover: '#703abc', red100: '#fee2e2', red700: '#b91c1c', /* ... */ };
const MAX_POCS = 6;

const EditAgentProfileModal = ({ isOpen, onClose, onProfileUpdated, currentProfileData }) => {
    // State for main profile fields
    const [mobile, setMobile] = useState('');
    const [gender, setGender] = useState('');
    const [postalAddress, setPostalAddress] = useState('');
    const [agencyName, setAgencyName] = useState('');
    const [pan, setPan] = useState('');
    const [bankName, setBankName] = useState('');
    const [bankAccountNo, setBankAccountNo] = useState('');
    const [bankIfsc, setBankIfsc] = useState('');

    // --- NEW: State for Insurer POCs ---
    const [pocs, setPocs] = useState([]); // Array of { insurerName: '', pocEmail: '' }
    // ---------------------------------

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Pre-fill form when modal opens or data changes
    useEffect(() => {
        if (isOpen && currentProfileData) {
            const profilePart = currentProfileData.AgentProfile; // Get embedded profile part
            const pocsPart = currentProfileData.InsurerPOCs || []; // Get POCs array

            setMobile(profilePart?.mobile?.String || '');
            setGender(profilePart?.gender?.String || '');
            setPostalAddress(profilePart?.postalAddress?.String || '');
            setAgencyName(profilePart?.agencyName?.String || '');
            setPan(profilePart?.pan?.String || '');
            setBankName(profilePart?.bankName?.String || '');
            setBankAccountNo(profilePart?.bankAccountNo?.String || '');
            setBankIfsc(profilePart?.bankIfsc?.String || '');

            // Initialize POCs state (ensure it's an array, max 6)
            const initialPocs = pocsPart.slice(0, MAX_POCS).map(p => ({
                insurerName: p.insurerName || '',
                pocEmail: p.pocEmail || ''
            }));
            setPocs(initialPocs);

            setError('');
            setIsSubmitting(false);
        }
    }, [isOpen, currentProfileData]);

    // --- Handlers for managing POC list ---
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
    // ------------------------------------

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); setError('');
        const token = localStorage.getItem('authToken');
        if (!token) { setError("Authentication error."); setIsSubmitting(false); return; }

        // --- 1. Update Main Profile ---
        const profilePayload = {
             mobile: mobile || null, gender: gender || null, postalAddress: postalAddress || null,
             agencyName: agencyName || null, pan: pan || null, bankName: bankName || null,
             bankAccountNo: bankAccountNo || null, bankIfsc: bankIfsc || null,
        };
        console.log("Updating Agent Profile (API Call):", profilePayload);
        try {
           const profileResponse = await fetch(`http://localhost:8080/api/agents/profile`, {
              method: 'PUT',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify(profilePayload)
           });
           const profileData = await profileResponse.json();
           if (!profileResponse.ok) throw new Error(profileData.error || 'Failed to update profile details');
           console.log("Profile details updated:", profileData);

           // --- 2. Update Insurer POCs (only if profile update was successful) ---
           const validPocs = pocs.filter(p => p.insurerName.trim() && p.pocEmail.trim()); // Filter out empty rows
           const pocsPayload = { pocs: validPocs };
           console.log("Updating Insurer POCs (API Call):", pocsPayload);

           const pocsResponse = await fetch(`http://localhost:8080/api/agents/insurer-pocs`, {
               method: 'PUT',
               headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
               body: JSON.stringify(pocsPayload)
           });
           const pocsData = await pocsResponse.json();
           if (!pocsResponse.ok) throw new Error(pocsData.error || 'Failed to update insurer contacts');
           console.log("Insurer POCs updated:", pocsData);

           // --- Success ---
           onProfileUpdated(); // Callback to refresh parent data (fetches both profile & POCs)
           onClose(); // Close modal

        } catch (err) {
            console.error("Update Profile/POCs Error:", err);
            setError(err.message || "An unknown error occurred during update.");
            // Note: If profile succeeds but POCs fail, the profile change is already saved.
            // More robust error handling/rollback might be needed in production.
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" style={{'--brand-purple': themeColors.brandPurple}}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-[--brand-purple]">Edit Profile & Contacts</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times fa-lg"></i></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
                    {error && <div className="text-sm text-red-700 p-2 bg-red-100 border border-red-200 rounded">{error}</div>}

                    {/* Personal & Bank Details Section */}
                    <section>
                         <h3 className="text-md font-semibold text-gray-600 mb-3">Personal & Banking Details</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField id="edit-mobile" label="Mobile Number" type="tel" value={mobile} onChange={e => setMobile(e.target.value)} />
                            <div>
                                <label htmlFor="edit-gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select id="edit-gender" value={gender} onChange={e => setGender(e.target.value)} className="mt-1 block w-full form-select rounded-md shadow-sm"> <option value="">Prefer not to say</option> <option>Male</option> <option>Female</option> <option>Other</option> </select>
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="edit-address" className="block text-sm font-medium text-gray-700 mb-1">Postal Address</label>
                                <textarea id="edit-address" rows="3" value={postalAddress} onChange={e => setPostalAddress(e.target.value)} className="mt-1 block w-full form-textarea rounded-md shadow-sm"></textarea>
                            </div>
                            <InputField id="edit-agency" label="Agency Name (if applicable)" value={agencyName} onChange={e => setAgencyName(e.target.value)} />
                            <InputField id="edit-pan" label="PAN" value={pan} onChange={e => setPan(e.target.value)} />
                            <InputField id="edit-bank-name" label="Bank Name" value={bankName} onChange={e => setBankName(e.target.value)} />
                            <InputField id="edit-bank-acc" label="Bank Account No." value={bankAccountNo} onChange={e => setBankAccountNo(e.target.value)} />
                            <InputField id="edit-bank-ifsc" label="Bank IFSC Code" value={bankIfsc} onChange={e => setBankIfsc(e.target.value)} />
                        </div>
                    </section>

                    {/* Insurer Contacts Section */}
                    <section className="pt-4 border-t">
                         <h3 className="text-md font-semibold text-gray-600 mb-3">Insurer Contacts (Max {MAX_POCS})</h3>
                         <div className="space-y-3">
                            {pocs.map((poc, index) => (
                                <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                                    <div className="sm:col-span-5">
                                         <InputField id={`poc-insurer-${index}`} label={`Insurer ${index + 1}`} value={poc.insurerName} onChange={e => handlePocChange(index, 'insurerName', e.target.value)} placeholder="Insurer Name" noLabel={index > 0} />
                                    </div>
                                     <div className="sm:col-span-6">
                                         <InputField id={`poc-email-${index}`} label={`POC Email ${index + 1}`} type="email" value={poc.pocEmail} onChange={e => handlePocChange(index, 'pocEmail', e.target.value)} placeholder="pointofcontact@insurer.com" noLabel={index > 0} />
                                     </div>
                                     <div className="sm:col-span-1 text-right pt-3 sm:pt-0">
                                         <button type="button" onClick={() => removePocRow(index)} className="text-red-500 hover:text-red-700" title="Remove Row">
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
                    </section>


                     <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                        <Button type="button" variant="outlineSm" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="brand" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save All Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};



export default EditAgentProfileModal;
