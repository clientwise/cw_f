import React, { useState, useEffect } from 'react';
import Button from '../common/Button'; // Adjust path if needed
import InputField from '../common/InputField'; // Adjust path if needed

// Assume themeColors is available globally or via context/props
const themeColors = {
    brandPurple: '#5a239e',
    brandPurpleHover: '#703abc',
    red100: '#fee2e2',
    red700: '#b91c1c',
    darkGray: '#1f2937',
    white: '#ffffff',
    gray50: '#f9fafb',
    gray300: '#d1d5db',
    gray700: '#374151',
    // Add other necessary colors
};

// Placeholder products list is removed - will be fetched from API

const AddPolicyModal = ({ isOpen, onClose, clientId, onPolicyAdded }) => {
    // Form state
    const [productId, setProductId] = useState('');
    const [policyNumber, setPolicyNumber] = useState('');
    const [premium, setPremium] = useState('');
    const [sumInsured, setSumInsured] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState('Active');

    // API/UI state for form submission
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(''); // Renamed from 'error' for clarity

    // State for product list fetching
    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [productError, setProductError] = useState(''); // Specific error for product fetching

    // Fetch products for dropdown when modal opens
    useEffect(() => {
        if (isOpen) {
            // Reset form fields and submission state
            setProductId(''); setPolicyNumber(''); setPremium('');
            setSumInsured(''); setStartDate(''); setEndDate('');
            setStatus('Active');
            setSubmitError(''); setIsSubmitting(false);

            // Reset and fetch products
            setProducts([]); // Clear previous products
            setProductError(''); // Clear previous product errors
            setIsLoadingProducts(true);

            const fetchProducts = async () => {
                const token = localStorage.getItem('authToken');
                // Basic check, actual validation might be needed depending on API security
                // if (!token) {
                //     setProductError("Authentication error.");
                //     setIsLoadingProducts(false);
                //     return;
                // }

                try {
                    const response = await fetch('http://localhost:8080/api/product-list', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            // Include Authorization header if your /api/products endpoint requires it
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        let errorMsg = `HTTP error! status: ${response.status}`;
                        try {
                            const errorData = await response.json();
                            errorMsg = errorData.error || errorData.message || errorMsg;
                        } catch (parseError) { /* Ignore */ }
                        throw new Error(errorMsg);
                    }

                    const data = await response.json();
                    setProducts(data || []); // Ensure it's an array

                } catch (err) {
                    console.error("Failed to fetch products:", err);
                    setProductError(err.message || "Could not load products.");
                } finally {
                    setIsLoadingProducts(false);
                }
            };

            fetchProducts();
        }
    }, [isOpen]); // Re-run effect if modal is opened/closed

    // Handle form submission to the backend API
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!productId || !policyNumber || !premium || !startDate || !endDate || !status) {
            setSubmitError('Please fill in all required policy details (*).');
            return;
        }
        setIsSubmitting(true);
        setSubmitError('');

        const token = localStorage.getItem('authToken');
        if (!token) {
            setSubmitError("Authentication error. Please log in again.");
            setIsSubmitting(false);
            return;
        }

        // Find selected product to potentially extract insurer name (ensure products array is populated)
        const selectedProduct = products.find(p => p.id === productId);
        let insurerName = '';
        if (selectedProduct && selectedProduct.name) {
            // Attempt to extract name from parenthesis, fallback to full name or empty
            const match = selectedProduct.name.match(/\(([^)]+)\)/);
            insurerName = match ? match[1] : selectedProduct.name; // Use extracted or full name
        }

        const payload = {
            productId,
            policyNumber,
            insurer: insurerName,
            premium: parseFloat(premium) || 0,
            sumInsured: sumInsured ? parseFloat(sumInsured) : 0, // Handle empty string for sum insured
            startDate,
            endDate,
            status,
        };

        console.log("Submitting Policy Payload:", payload);

        try {
           const response = await fetch(`http://localhost:8080/api/clients/${clientId}/policies`, { // Ensure clientId is passed correctly as prop
               method: 'POST',
               headers: {
                   'Authorization': `Bearer ${token}`,
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify(payload)
           });

           const data = await response.json();

           if (!response.ok) {
               throw new Error(data.error || `Failed to add policy (${response.status})`);
           }

           console.log("Policy added response:", data);
           if(onPolicyAdded) { // Check if callback exists
               onPolicyAdded(data); // Pass added policy data back if needed
           }
           onClose(); // Close modal on success

        } catch (err) {
           console.error("Add Policy Error:", err);
           setSubmitError(err.message || "An unknown error occurred. Please try again.");
        } finally {
           setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" style={{'--brand-purple': themeColors.brandPurple}}>
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-[--brand-purple]">Add New Policy</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close modal">
                        <i className="fas fa-times fa-lg"></i>
                    </button>
                </div>
                {/* Modal Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {/* Display Submission Error Message */}
                    {submitError && <div className="text-sm text-red-700 p-2 bg-red-100 border border-red-200 rounded">{submitError}</div>}

                    {/* Form Fields Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Product Selection */}
                        <div>
                            <label htmlFor="product-id" className="block text-sm font-medium text-gray-700 mb-1">Product*</label>
                            <select
                                id="product-id"
                                value={productId}
                                onChange={e => setProductId(e.target.value)}
                                required
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm disabled:bg-gray-100"
                                disabled={isLoadingProducts} // Disable while loading
                            >
                                <option value="" disabled>
                                    {isLoadingProducts ? "Loading products..." : (productError ? "Error loading products" : "Select a product")}
                                </option>
                                {/* Render options only if not loading and no error */}
                                {!isLoadingProducts && !productError && products.map(p =>
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                )}
                            </select>
                            {/* Display product fetch error near the dropdown */}
                            {productError && !isLoadingProducts && <p className="text-xs text-red-600 mt-1">{productError}</p>}
                        </div>
                        {/* Policy Number */}
                        <InputField id="policy-number" label="Policy Number*" value={policyNumber} onChange={e => setPolicyNumber(e.target.value)} required />
                        {/* Premium */}
                        <InputField id="premium" label="Premium Amount (₹)*" type="number" step="0.01" min="0" value={premium} onChange={e => setPremium(e.target.value)} required />
                        {/* Sum Insured */}
                        <InputField id="sum-insured" label="Sum Insured (₹)" type="number" step="0.01" min="0" value={sumInsured} onChange={e => setSumInsured(e.target.value)} />
                        {/* Start Date */}
                        <InputField id="start-date" label="Start Date*" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                        {/* End Date */}
                        <InputField id="end-date" label="End Date/Renewal Date*" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                        {/* Status */}
                        <div>
                            <label htmlFor="policy-status" className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
                            <select id="policy-status" value={status} onChange={e => setStatus(e.target.value)} required className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm">
                                <option>Active</option>
                                <option>Lapsed</option>
                                <option>Pending Renewal</option>
                                <option>Cancelled</option>
                                <option>Expired</option>
                            </select>
                        </div>
                    </div>

                     {/* Modal Footer Actions */}
                     <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                         <Button type="button" variant="outlineSm" onClick={onClose} className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-4 py-2">Cancel</Button>
                         <Button type="submit" variant="brand" disabled={isSubmitting || isLoadingProducts} className="px-4 py-2">
                             {isSubmitting ? (
                                <> <i className="fas fa-spinner fa-spin mr-2"></i> Saving... </>
                             ) : (
                                'Add Policy'
                             )}
                         </Button>
                     </div>
                </form>
            </div>
        </div>
    );
};

export default AddPolicyModal;
