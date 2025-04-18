import React, { useState, useEffect } from 'react';
import Button from '../common/Button'; // Adjust path if needed
import InputField from '../common/InputField'; // Adjust path if needed

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e', brandPurpleHover: '#703abc', red100: '#fee2e2', red700: '#b91c1c', /* ... */ };

const AddClientModal = ({ isOpen, onClose, onClientAdded }) => {
    // Existing State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [address, setAddress] = useState('');
    const [status, setStatus] = useState('Lead'); // Default status
    const [tags, setTags] = useState(''); // Comma-separated

    // --- NEW State for additional fields ---
    const [income, setIncome] = useState(''); // Store as string, parse on submit
    const [maritalStatus, setMaritalStatus] = useState(''); // Empty default, let user select
    const [city, setCity] = useState('');
    const [jobProfile, setJobProfile] = useState(''); // Empty default
    const [dependents, setDependents] = useState(''); // Store as string
    const [liability, setLiability] = useState(''); // Store as string
    const [housingType, setHousingType] = useState(''); // Empty default
    const [vehicleCount, setVehicleCount] = useState(''); // Store as string
    const [vehicleType, setVehicleType] = useState('');
    const [vehicleCost, setVehicleCost] = useState(''); // Store as string

    // API/UI State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Reset form when modal opens or closes
    useEffect(() => {
        if (!isOpen) {
            setName(''); setEmail(''); setPhone(''); setDob(''); setAddress('');
            setStatus('Lead'); setTags(''); setError(''); setIsSubmitting(false);
            // Reset new fields
            setIncome(''); setMaritalStatus(''); setCity(''); setJobProfile('');
            setDependents(''); setLiability(''); setHousingType('');
            setVehicleCount(''); setVehicleType(''); setVehicleCost('');
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Basic validation
        if (!name.trim() || (!email.trim() && !phone.trim())) {
            setError('Client Name and at least Email or Phone are required.');
            return;
        }
        setIsSubmitting(true); setError('');
        const token = localStorage.getItem('authToken');
        if (!token) { setError("Authentication error."); setIsSubmitting(false); return; }

        // Construct payload including new fields
        // Parse numbers, send null if empty/invalid
        const parseOptionalFloat = (val) => { const num = parseFloat(val); return !isNaN(num) ? num : null; };
        const parseOptionalInt = (val) => { const num = parseInt(val, 10); return !isNaN(num) ? num : null; };

        const payload = {
            name: name.trim(),
            email: email.trim() || null, // Send null if empty
            phone: phone.trim() || null, // Send null if empty
            dob: dob || null,
            address: address.trim() || null,
            status: status || 'Lead',
            tags: tags.split(',').map(t => t.trim()).filter(t => t).join(','), // Clean up tags
            // Add new fields to payload
            income: parseOptionalFloat(income),
            maritalStatus: maritalStatus || null,
            city: city.trim() || null,
            jobProfile: jobProfile || null,
            dependents: parseOptionalInt(dependents),
            liability: parseOptionalFloat(liability),
            housingType: housingType || null,
            vehicleCount: parseOptionalInt(vehicleCount),
            vehicleType: vehicleType.trim() || null,
            vehicleCost: parseOptionalFloat(vehicleCost),
        };

        // Optional: Remove null fields from payload if backend prefers absence over null
        // Object.keys(payload).forEach(key => payload[key] === null && delete payload[key]);

        console.log("Submitting Client (API Call):", payload);

        try {
           const response = await fetch(`http://localhost:8080/api/clients`, {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
           });
           const data = await response.json();
           if (!response.ok) throw new Error(data.error || 'Failed to add client');
           console.log("Client added:", data);
           onClientAdded(); // Callback to refresh list
           onClose(); // Close modal
        } catch (err) {
            console.error("Add Client Error:", err);
            setError(err.message || "An unknown error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            {/* Increased max-w-3xl */}
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" style={{'--brand-purple': themeColors.brandPurple}}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-[--brand-purple]">Add New Client</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times fa-lg"></i></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {error && <div className="text-sm text-red-700 p-2 bg-red-100 border border-red-200 rounded">{error}</div>}
                    {/* Use grid layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-1">
                        {/* --- Existing Fields --- */}
                        <InputField id="client-name" label="Full Name*" value={name} onChange={e => setName(e.target.value)} required />
                        <InputField id="client-email" label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required={false} />
                        <InputField id="client-phone" label="Phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required={false} />
                        <InputField id="client-dob" label="Date of Birth" type="date" value={dob} onChange={e => setDob(e.target.value)} required={false} />
                        <div className="md:col-span-2">
                             <InputField id="client-address" label="Address" value={address} onChange={e => setAddress(e.target.value)} required={false} />
                        </div>
                        <div>
                            <label htmlFor="client-status" className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
                            <select id="client-status" value={status} onChange={e => setStatus(e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm">
                                <option>Lead</option>
                                <option>Active</option>
                                <option>Lapsed</option>
                            </select>
                        </div>
                         <div className="md:col-span-3">
                            <InputField id="client-tags" label="Tags (comma-separated)" value={tags} onChange={e => setTags(e.target.value)} required={false} placeholder="e.g., HNI, Business Owner, Referred" />
                         </div>

                         {/* --- NEW Fields --- */}
                        <InputField id="client-income" label="Annual Income (₹)" type="number" value={income} onChange={e => setIncome(e.target.value)} required={false} placeholder="e.g., 1500000" />
                        <div>
                            <label htmlFor="client-marital" className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                            <select id="client-marital" value={maritalStatus} onChange={e => setMaritalStatus(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm">
                                <option value="">Select...</option>
                                <option>Single</option>
                                <option>Married</option>
                                <option>Divorced</option>
                                <option>Widowed</option>
                            </select>
                        </div>
                        <InputField id="client-city" label="Current City" value={city} onChange={e => setCity(e.target.value)} required={false} />
                        <div>
                             <label htmlFor="client-job" className="block text-sm font-medium text-gray-700 mb-1">Job Profile</label>
                            <select id="client-job" value={jobProfile} onChange={e => setJobProfile(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm">
                                <option value="">Select...</option>
                                <option>Salaried</option>
                                <option>Business Owner</option>
                                <option>Professional (Doctor, Lawyer, etc.)</option>
                                <option>Student</option>
                                <option>Homemaker</option>
                                <option>Retired</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <InputField id="client-dependents" label="No. of Dependents" type="number" value={dependents} onChange={e => setDependents(e.target.value)} required={false} />
                        <InputField id="client-liability" label="Current Liability (₹ Loans)" type="number" value={liability} onChange={e => setLiability(e.target.value)} required={false} placeholder="Approx. total loan amount" />
                        <div>
                             <label htmlFor="client-housing" className="block text-sm font-medium text-gray-700 mb-1">Housing Type</label>
                            <select id="client-housing" value={housingType} onChange={e => setHousingType(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm">
                                <option value="">Select...</option>
                                <option>Owned</option>
                                <option>Rented</option>
                                <option>Family-owned</option>
                            </select>
                        </div>
                         <InputField id="client-vehicles" label="No. of Vehicles" type="number" value={vehicleCount} onChange={e => setVehicleCount(e.target.value)} required={false} />
                         <InputField id="client-vehicle-type" label="Vehicle Type(s)" value={vehicleType} onChange={e => setVehicleType(e.target.value)} required={false} placeholder="e.g., Car, Bike" />
                         <InputField id="client-vehicle-cost" label="Total Vehicle Cost (₹ Approx)" type="number" value={vehicleCost} onChange={e => setVehicleCost(e.target.value)} required={false} placeholder="Approx. total cost" />

                    </div>
                     <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
                        <Button type="button" variant="outlineSm" onClick={onClose} className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-4 py-2">Cancel</Button>
                        <Button type="submit" variant="brand" disabled={isSubmitting} className="px-4 py-2">
                            {isSubmitting ? 'Saving...' : 'Add Client'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddClientModal;
