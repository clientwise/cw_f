import React, { useState, useEffect } from 'react';
import Button from '../common/Button'; // Adjust path if needed
import InputField from '../common/InputField'; // Adjust path if needed

// Assume themeColors is available globally or via context/props
const themeColors = { brandPurple: '#5a239e', brandPurpleHover: '#703abc', red100: '#fee2e2', red700: '#b91c1c', /* ... */ };

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
    // Form state for all product fields
    const [id, setId] = useState(''); // User provides ID like prod_health_01
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Health Insurance'); // Default category
    const [insurer, setInsurer] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Active');
    const [features, setFeatures] = useState(''); // Expect JSON array as string
    const [eligibility, setEligibility] = useState('');
    const [term, setTerm] = useState('');
    const [exclusions, setExclusions] = useState('');
    const [roomRent, setRoomRent] = useState('');
    const [premiumIndication, setPremiumIndication] = useState('');
    const [insurerLogoUrl, setInsurerLogoUrl] = useState('');
    const [brochureUrl, setBrochureUrl] = useState('');
    const [wordingUrl, setWordingUrl] = useState('');
    const [claimFormUrl, setClaimFormUrl] = useState('');

    // API/UI state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Reset form when modal opens or closes
    useEffect(() => {
        if (!isOpen) {
            setId(''); setName(''); setCategory('Health Insurance'); setInsurer('');
            setDescription(''); setStatus('Active'); setFeatures(''); setEligibility('');
            setTerm(''); setExclusions(''); setRoomRent(''); setPremiumIndication('');
            setInsurerLogoUrl(''); setBrochureUrl(''); setWordingUrl(''); setClaimFormUrl('');
            setError(''); setIsSubmitting(false);
        }
    }, [isOpen]);

    // Basic JSON validation helper
    const isValidJsonString = (str) => {
        if (!str || !str.trim()) return true; // Empty string is valid (optional field)
        try {
            const parsed = JSON.parse(str);
            return Array.isArray(parsed); // Ensure it's an array
        } catch (e) {
            return false;
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validation
        if (!id.trim() || !name.trim() || !category.trim() || !insurer.trim()) {
            setError('Product ID, Name, Category, and Insurer are required.');
            return;
        }
        if (features && !isValidJsonString(features)) {
             setError('Features must be a valid JSON array string (e.g., ["Feature 1", "Feature 2"]). Leave blank if none.');
             return;
        }

        setIsSubmitting(true); setError('');
        const token = localStorage.getItem('authToken');
        if (!token) { setError("Authentication error."); setIsSubmitting(false); return; }

        // Construct payload, handling optional fields
        const payload = {
            id: id.trim(), name: name.trim(), category, insurer: insurer.trim(),
            status: status || 'Active', // Default if empty
            description: description || null,
            features: features || null, // Send null if empty string
            eligibility: eligibility || null,
            term: term || null,
            exclusions: exclusions || null,
            roomRent: roomRent || null,
            premiumIndication: premiumIndication || null,
            insurerLogo: insurerLogoUrl || null, // Match backend payload field name
            brochureUrl: brochureUrl || null,
            wordingUrl: wordingUrl || null,
            claimFormUrl: claimFormUrl || null,
        };

        // Remove null fields before sending (optional, backend should handle nulls)
        Object.keys(payload).forEach(key => payload[key] === null && delete payload[key]);

        console.log("Submitting Product (API Call):", payload);

        try {
           const response = await fetch(`https://api.goclientwise.com/api/products`, {
              method: 'POST',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(payload)
           });
           const data = await response.json();
           if (!response.ok) {
                // Handle specific errors from backend
                if (response.status === 403) throw new Error("Permission denied: Only agency admins can add products.");
                if (response.status === 409) throw new Error(data.error || "Product ID already exists.");
                throw new Error(data.error || `Failed to add product (${response.status})`);
           }
           console.log("Product added:", data);
           onProductAdded(); // Callback to refresh parent data
           onClose(); // Close modal
        } catch (err) {
            console.error("Add Product Error:", err);
            setError(err.message || "An unknown error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            {/* Increased max-w-4xl for more space */}
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" style={{'--brand-purple': themeColors.brandPurple}}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-[--brand-purple]">Add New Insurance Product</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times fa-lg"></i></button>
                </div>
                {/* Added overflow-y-auto to form container */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {error && <div className="text-sm text-red-700 p-3 bg-red-100 border border-red-200 rounded mb-4">{error}</div>}
                    {/* Use grid layout for better spacing */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <InputField id="prod-id" label="Product ID*" value={id} onChange={e => setId(e.target.value)} required placeholder="e.g., prod_health_01" />
                        <InputField id="prod-name" label="Product Name*" value={name} onChange={e => setName(e.target.value)} required />
                         <div>
                            <label htmlFor="prod-category" className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                            <select id="prod-category" value={category} onChange={e => setCategory(e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm">
                                <option>Health Insurance</option>
                                <option>Life Insurance</option>
                                <option>Motor Insurance</option>
                                <option>Travel Insurance</option>
                                <option>Property Insurance</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <InputField id="prod-insurer" label="Insurer Name*" value={insurer} onChange={e => setInsurer(e.target.value)} required />
                         <div>
                            <label htmlFor="prod-status" className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
                            <select id="prod-status" value={status} onChange={e => setStatus(e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm">
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                        </div>
                        <InputField id="prod-logo-url" label="Insurer Logo URL" type="url" value={insurerLogoUrl} onChange={e => setInsurerLogoUrl(e.target.value)} placeholder="https://..."/>

                        <div className="md:col-span-3">
                            <label htmlFor="prod-desc" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea id="prod-desc" rows="2" value={description} onChange={e => setDescription(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm"></textarea>
                        </div>
                         <div className="md:col-span-3">
                            <label htmlFor="prod-features" className="block text-sm font-medium text-gray-700 mb-1">Features (JSON Array)</label>
                            <textarea id="prod-features" rows="3" value={features} onChange={e => setFeatures(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm font-mono text-xs" placeholder='e.g., ["Feature A", "Feature B"]'></textarea>
                            <p className="text-xs text-gray-500 mt-1">Enter as a valid JSON array of strings, or leave blank.</p>
                        </div>
                         <div className="md:col-span-3">
                            <label htmlFor="prod-eligibility" className="block text-sm font-medium text-gray-700 mb-1">Eligibility</label>
                            <textarea id="prod-eligibility" rows="2" value={eligibility} onChange={e => setEligibility(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm"></textarea>
                        </div>
                        <InputField id="prod-term" label="Policy Term" value={term} onChange={e => setTerm(e.target.value)} />
                        <InputField id="prod-roomrent" label="Room Rent Details" value={roomRent} onChange={e => setRoomRent(e.target.value)} />
                        <InputField id="prod-premium" label="Premium Indication" value={premiumIndication} onChange={e => setPremiumIndication(e.target.value)} />
                         <div className="md:col-span-3">
                            <label htmlFor="prod-exclusions" className="block text-sm font-medium text-gray-700 mb-1">Exclusions</label>
                            <textarea id="prod-exclusions" rows="2" value={exclusions} onChange={e => setExclusions(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm"></textarea>
                        </div>
                        <InputField id="prod-brochure" label="Brochure URL" type="url" value={brochureUrl} onChange={e => setBrochureUrl(e.target.value)} />
                        <InputField id="prod-wording" label="Policy Wording URL" type="url" value={wordingUrl} onChange={e => setWordingUrl(e.target.value)} />
                        <InputField id="prod-claim" label="Claim Form URL" type="url" value={claimFormUrl} onChange={e => setClaimFormUrl(e.target.value)} />

                    </div>
                     <div className="flex justify-end space-x-3 pt-4 border-t mt-4">
                        <Button type="button" variant="outlineSm" onClick={onClose} className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-4 py-2">Cancel</Button>
                        <Button type="submit" variant="brand" disabled={isSubmitting} className="px-4 py-2">
                            {isSubmitting ? 'Saving...' : 'Add Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;
