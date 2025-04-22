import React, { useState, useEffect } from 'react';
import Button from '../common/Button'; // Adjust path if needed
import InputField from '../common/InputField'; // Adjust path if needed

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e', brandPurpleHover: '#703abc', red100: '#fee2e2', red700: '#b91c1c', /* ... */ };

const EditClientModal = ({ isOpen, onClose, onClientUpdated, clientData }) => {
    // State for all editable fields, initialized from clientData prop
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [address, setAddress] = useState('');
    const [status, setStatus] = useState('Lead');
    const [tags, setTags] = useState('');
    const [income, setIncome] = useState('');
    const [maritalStatus, setMaritalStatus] = useState('');
    const [city, setCity] = useState('');
    const [jobProfile, setJobProfile] = useState('');
    const [dependents, setDependents] = useState('');
    const [liability, setLiability] = useState('');
    const [housingType, setHousingType] = useState('');
    const [vehicleCount, setVehicleCount] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [vehicleCost, setVehicleCost] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Pre-fill form when modal opens or clientData changes
    useEffect(() => {
        if (isOpen && clientData) {
            setName(clientData.name || '');
            setEmail(clientData.email?.String || '');
            setPhone(clientData.phone?.String || '');
            setDob(clientData.dob?.String || ''); // Assumes YYYY-MM-DD format
            setAddress(clientData.address?.String || '');
            setStatus(clientData.status || 'Lead');
            setTags(clientData.tags?.String || '');
            setIncome(clientData.income?.Valid ? clientData.income.Float64.toString() : '');
            setMaritalStatus(clientData.maritalStatus?.String || '');
            setCity(clientData.city?.String || '');
            setJobProfile(clientData.jobProfile?.String || '');
            setDependents(clientData.dependents?.Valid ? clientData.dependents.Int64.toString() : '');
            setLiability(clientData.liability?.Valid ? clientData.liability.Float64.toString() : '');
            setHousingType(clientData.housingType?.String || '');
            setVehicleCount(clientData.vehicleCount?.Valid ? clientData.vehicleCount.Int64.toString() : '');
            setVehicleType(clientData.vehicleType?.String || '');
            setVehicleCost(clientData.vehicleCost?.Valid ? clientData.vehicleCost.Float64.toString() : '');
            setError('');
            setIsSubmitting(false);
        }
    }, [isOpen, clientData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!clientData?.id) { setError("Client ID is missing."); return; }
        if (!name.trim() || (!email.trim() && !phone.trim())) { setError('Client Name and at least Email or Phone are required.'); return; }

        setIsSubmitting(true); setError('');
        const token = localStorage.getItem('authToken');
        if (!token) { setError("Authentication error."); setIsSubmitting(false); return; }

        const parseOptionalFloat = (val) => { const num = parseFloat(val); return !isNaN(num) ? num : null; };
        const parseOptionalInt = (val) => { const num = parseInt(val, 10); return !isNaN(num) ? num : null; };

        const payload = {
            name: name.trim(),
            email: email.trim() || null,
            phone: phone.trim() || null,
            dob: dob || null,
            address: address.trim() || null,
            status: status || 'Lead',
            tags: tags.split(',').map(t => t.trim()).filter(t => t).join(','),
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

        console.log(`Updating Client ${clientData.id} (API Call):`, payload);

        try {
           const response = await fetch(`http://localhost:8080/api/clients/${clientData.id}`, {
              method: 'PUT', // Use PUT for update
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
           });
           const data = await response.json();
           if (!response.ok) throw new Error(data.error || 'Failed to update client');
           console.log("Client updated:", data);
           onClientUpdated(); // Callback to refresh parent data
           onClose(); // Close modal
        } catch (err) {
            console.error("Update Client Error:", err);
            setError(err.message || "An unknown error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" style={{'--brand-purple': themeColors.brandPurple}}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-[--brand-purple]">Edit Client Details</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times fa-lg"></i></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {error && <div className="text-sm text-red-700 p-2 bg-red-100 border border-red-200 rounded">{error}</div>}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-1">
                        {/* Render all input fields similar to AddClientModal, but using state variables initialized by useEffect */}
                        <InputField id="edit-client-name" label="Full Name*" value={name} onChange={e => setName(e.target.value)} required />
                        <InputField id="edit-client-email" label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required={false} />
                        <InputField id="edit-client-phone" label="Phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required={false} />
                        <InputField id="edit-client-dob" label="Date of Birth" type="date" value={dob} onChange={e => setDob(e.target.value)} required={false} />
                        <div className="md:col-span-2"> <InputField id="edit-client-address" label="Address" value={address} onChange={e => setAddress(e.target.value)} required={false} /> </div>
                        <div>
                            <label htmlFor="edit-client-status" className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
                            <select id="edit-client-status" value={status} onChange={e => setStatus(e.target.value)} required className="mt-1 block w-full form-select rounded-md shadow-sm"> <option>Lead</option> <option>Active</option> <option>Lapsed</option> </select>
                        </div>
                         <div className="md:col-span-3"> <InputField id="edit-client-tags" label="Tags (comma-separated)" value={tags} onChange={e => setTags(e.target.value)} required={false} /> </div>

                         {/* --- New Fields --- */}
                        <InputField id="edit-client-income" label="Annual Income (₹)" type="number" value={income} onChange={e => setIncome(e.target.value)} required={false} />
                        <div>
                            <label htmlFor="edit-client-marital" className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                            <select id="edit-client-marital" value={maritalStatus} onChange={e => setMaritalStatus(e.target.value)} className="mt-1 block w-full form-select rounded-md shadow-sm"> <option value="">Select...</option> <option>Single</option> <option>Married</option> <option>Divorced</option> <option>Widowed</option> </select>
                        </div>
                        <InputField id="edit-client-city" label="Current City" value={city} onChange={e => setCity(e.target.value)} required={false} />
                        <div>
                             <label htmlFor="edit-client-job" className="block text-sm font-medium text-gray-700 mb-1">Job Profile</label>
                            <select id="edit-client-job" value={jobProfile} onChange={e => setJobProfile(e.target.value)} className="mt-1 block w-full form-select rounded-md shadow-sm"> <option value="">Select...</option> <option>Salaried</option> <option>Business Owner</option> <option>Professional</option> <option>Student</option> <option>Homemaker</option> <option>Retired</option> <option>Other</option> </select>
                        </div>
                        <InputField id="edit-client-dependents" label="No. of Dependents" type="number" value={dependents} onChange={e => setDependents(e.target.value)} required={false} />
                        <InputField id="edit-client-liability" label="Current Liability (₹ Loans)" type="number" value={liability} onChange={e => setLiability(e.target.value)} required={false} />
                        <div>
                             <label htmlFor="edit-client-housing" className="block text-sm font-medium text-gray-700 mb-1">Housing Type</label>
                            <select id="edit-client-housing" value={housingType} onChange={e => setHousingType(e.target.value)} className="mt-1 block w-full form-select rounded-md shadow-sm"> <option value="">Select...</option> <option>Owned</option> <option>Rented</option> <option>Family-owned</option> </select>
                        </div>
                         <InputField id="edit-client-vehicles" label="No. of Vehicles" type="number" value={vehicleCount} onChange={e => setVehicleCount(e.target.value)} required={false} />
                         <InputField id="edit-client-vehicle-type" label="Vehicle Type(s)" value={vehicleType} onChange={e => setVehicleType(e.target.value)} required={false} />
                         <InputField id="edit-client-vehicle-cost" label="Total Vehicle Cost (₹ Approx)" type="number" value={vehicleCost} onChange={e => setVehicleCost(e.target.value)} required={false} />

                    </div>
                     <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
                        <Button type="button" variant="outlineSm" onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="brand" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditClientModal;
