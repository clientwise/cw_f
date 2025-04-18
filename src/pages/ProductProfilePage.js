import React, { useState, useEffect, useCallback } from 'react';
// Import hooks from react-router-dom
import { useParams, useNavigate, Link } from 'react-router-dom';
// Import common components (adjust paths as needed)
import Button from '../components/common/Button';
// Import the modal component (adjust path if needed)
import GenerateProposalModal from '../components/products/GenerateProposalModal';

// Assume themeColors is available globally or via context/props
const themeColors = {
    brandPurple: '#5a239e', brandPurpleHover: '#703abc', lightGray: '#f9fafb',
    mediumGray: '#6b7280', darkGray: '#1f2937', white: '#ffffff',
    purple100: '#ede9fe', green100: '#dcfce7', green800: '#166534',
    yellow100: '#fef9c3', yellow800: '#854d0e', red50: '#fef2f2',
    red100: '#fee2e2', red600: '#dc2626', red800: '#991b1b',
    blue100: '#dbeafe', blue600: '#2563eb', blue800: '#1e40af',
    gray100: '#f3f4f6', gray200: '#e5e7eb', gray500: '#6b7280',
    gray600: '#4b5563', gray700: '#374151', gray800: '#1f2937',
    gray900: '#111827', green500: '#22c55e',
};

// Helper function to format date strings or return 'N/A'
 const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
         // Handle potential null time from Go's sql.NullTime
         if (typeof dateString === 'object' && dateString !== null && dateString.Valid && dateString.Time) {
             dateString = dateString.Time;
         } else if (typeof dateString === 'object' && dateString !== null && !dateString.Valid) {
             return 'N/A'; // Explicitly handle invalid NullTime
         }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date'; // Check if date is valid
        return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
        console.warn("Date formatting error for:", dateString, e);
        return 'Error'; // Indicate a formatting problem
    }
 };


// Placeholder data for a single product - Replace with API call
const fetchProductDetailsPlaceholder = async (productId) => {
  console.log(`Fetching details for product ID: ${productId} (Placeholder)`);
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  // Find product in placeholder list or return a default structure
  // In a real app, this function would make the actual API call
  const products = [
      { id: 'prod_health_01', category: 'Health Insurance', name: 'MediSecure Plus', insurer: 'SecureHealth General', description: {String: 'The MediSecure Plus plan is a comprehensive family floater health insurance policy offered by SecureHealth General Insurance...', Valid: true}, status: 'Active', code: 'SHG-MSP-01', features: {String: '["Family Floater (5L to 50L)", "Cashless Treatment (8000+ hospitals)", "60 days Pre-hospitalization", "90 days Post-hospitalization", "Day Care procedures covered", "No Claim Bonus up to 100%", "Optional Critical Illness Rider"]', Valid: true}, eligibility: {String: 'Adult: 18-65 yrs, Child: 91 days - 25 yrs', Valid: true}, term: {String: '1, 2, or 3 years', Valid: true}, exclusions: {String: 'Pre-existing diseases (waiting period applies), cosmetic treatments, non-allopathic treatments.', Valid: true}, roomRent: {String: 'Up to 1% of Sum Insured per day (Standard Room)', Valid: true}, premiumIndication: {String: '~ ₹8,500 (+ GST) for 30yo/10L cover', Valid: true}, insurerLogoURL: {String: `https://placehold.co/40x40/${themeColors.purple100.substring(1)}/${themeColors.brandPurple.substring(1)}?text=SH`, Valid: true}, brochureUrl: { String: '#', Valid: true }, wordingUrl: { String: '#', Valid: true }, claimFormUrl: { String: '#', Valid: true }, createdAt: new Date(), updatedAt: {Time: new Date(), Valid: true} },
      { id: 'prod_life_01', category: 'Life Insurance', name: 'TermProtect Max', insurer: 'InsureCo Life', description: {String: 'High cover term plan with riders.', Valid: true}, status: 'Active', code: 'ICL-TPM-05', features: {String: '["High Sum Assured Options", "Critical Illness Rider Option", "Waiver of Premium"]', Valid: true}, eligibility: {String: '18-60 years', Valid: true}, term: {String: '5 to 40 years', Valid: true}, exclusions: {String: 'Suicide clause (first year)', Valid: true}, roomRent: { Valid: false }, premiumIndication: {String: '~ ₹12,000 (+ GST) for 30yo/1 Cr cover/30yr term', Valid: true}, insurerLogoURL: {String: `https://placehold.co/40x40/dcfce7/15803d?text=IL`, Valid: true}, brochureUrl: { String: '#', Valid: true }, wordingUrl: { String: '#', Valid: true }, claimFormUrl: { Valid: false }, createdAt: new Date(), updatedAt: {Time: new Date(), Valid: true} },
       // Add other products as needed for testing different IDs
    ];
  const product = products.find(p => p.id === productId);
  if (!product) { throw new Error(`Product with ID '${productId}' not found.`); }
  return product;
};


const ProductProfilePage = () => {
    // Get productId from URL parameters using useParams hook
    const { productId } = useParams();
    // Initialize navigate function using useNavigate hook
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- State for Proposal Modal ---
    const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);

    // Fetch product details based on productId from URL
    const fetchData = useCallback(async () => {
        if (!productId) { setError("Product ID not found in URL."); setIsLoading(false); return; }
        setIsLoading(true); setError(null);
        const token = localStorage.getItem('authToken'); // Get auth token
        // We need the token even for product details if the API is protected
        if (!token) { setError("Authentication error: Not logged in."); setIsLoading(false); return; }

        try {
            // --- Replace placeholder fetch with actual API call ---
            console.log(`FETCHING: /api/products/${productId}`);
            const url = `http://localhost:8080/api/products/${productId}`;
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                let errorMsg = `Error fetching product: ${response.status}`;
                try { const errData = await response.json(); errorMsg = errData.error || errorMsg; } catch (e) {}
                if (response.status === 404) { errorMsg = `Product with ID '${productId}' not found.`; }
                throw new Error(errorMsg);
            }
            const data = await response.json();
            setProduct(data || null); // Set product data
            // const data = await fetchProductDetailsPlaceholder(productId); // Using placeholder for now
            // setProduct(data);
             // --- End API Call ---

        } catch (err) {
            console.error("Failed to fetch product details:", err);
            setError(err.message || "An unexpected error occurred.");
            setProduct(null); // Clear product data on error
        } finally {
            setIsLoading(false);
        }
    }, [productId]); // Depend on clientId from useParams

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // --- Action Handlers ---
    const handleAiSummary = () => alert(`Show AI Summary for product ${productId} (Not Implemented)`);
    // --- Modal Handlers ---
    const openProposalModal = () => setIsProposalModalOpen(true);
    const closeProposalModal = () => setIsProposalModalOpen(false);

    // Helper to safely parse features JSON
    const getFeaturesList = (featuresData) => {
        if (featuresData?.Valid && featuresData.String) {
            try {
                const parsed = JSON.parse(featuresData.String);
                return Array.isArray(parsed) ? parsed : [featuresData.String]; // Ensure it's an array or fallback
            } catch (e) {
                console.error("Failed to parse product features JSON:", e);
                return [featuresData.String]; // Fallback to showing raw string if parse fails
            }
        }
        return []; // Return empty array if no valid features string
    };


    // --- Rendering Logic ---
    if (isLoading) { return <div className="text-center p-10 text-gray-500"><i className="fas fa-spinner fa-spin text-3xl text-[--brand-purple]"></i><p className="mt-2">Loading Product Details...</p></div>; }
    if (error) { return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{error}</span></div>; }
    if (!product) { return <div className="text-center p-10 text-gray-500">Product data could not be loaded or not found.</div>; }

    // Parse features safely
    const featuresList = getFeaturesList(product.features);

    // Main component JSX
    return (
        <div style={{'--brand-purple': themeColors.brandPurple, '--brand-purple-hover': themeColors.brandPurpleHover}}>
             {/* Header Bar */}
             <div className="flex flex-wrap justify-between items-center gap-4 mb-6 p-4 bg-white rounded-t-lg shadow-sm border border-gray-200 sticky top-[32px] z-10"> {/* Adjust top value based on actual header height */}
                 <div>
                     {/* Updated Back button using navigate */}
                     <button onClick={() => navigate('/dashboard/products')} className="text-sm text-purple-600 hover:underline flex items-center mb-1">
                        <i className="fas fa-arrow-left mr-2"></i> Back to Products
                     </button>
                     <h1 className="text-xl font-semibold text-gray-800">{product.name}</h1>
                 </div>
                <div className="flex items-center space-x-2">
                    {/* Generate Proposal Button */}
                    <Button onClick={openProposalModal} variant="brand" className="px-4 py-2 text-sm">
                        <i className="fas fa-file-signature mr-2"></i> Generate Proposal
                    </Button>
                </div>
            </div>

            {/* Product Detail Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column (Details) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Summary Section */}
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-[--brand-purple] mb-4 pb-3 border-b">Summary</h3>
                        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                            <div className="sm:col-span-1"><dt className="text-gray-500 font-medium">Product Name</dt><dd className="text-gray-800">{product.name}</dd></div>
                            <div className="sm:col-span-1"><dt className="text-gray-500 font-medium">Insurer</dt><dd className="text-gray-800">{product.insurer}</dd></div>
                            <div className="sm:col-span-1"><dt className="text-gray-500 font-medium">Category</dt><dd className="text-gray-800">{product.category}</dd></div>
                            <div className="sm:col-span-1"><dt className="text-gray-500 font-medium">Product Code</dt><dd className="text-gray-800">{product.id || 'N/A'}</dd></div>
                            <div className="sm:col-span-1"><dt className="text-gray-500 font-medium">Status</dt><dd><span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{product.status}</span></dd></div>
                        </dl>
                    </div>
                    {/* Description & AI Summary Section */}
                     <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <div className="flex justify-between items-center mb-4 pb-3 border-b"> <h3 className="text-lg font-semibold text-[--brand-purple]">Description</h3> <Button onClick={handleAiSummary} variant="outlineSm" className="text-xs text-purple-600 border-purple-300 hover:bg-purple-50"><i className="fas fa-robot mr-1"></i> AI Summary</Button> </div>
                        <p className="text-sm text-gray-700 leading-relaxed"> {product.description?.String || 'N/A'} </p>
                     </div>
                     {/* Key Features Section */}
                     <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-[--brand-purple] mb-4 pb-3 border-b">Key Features</h3>
                        <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700">
                            {featuresList.length > 0 ? featuresList.map((feature, index) => ( <li key={index}>{feature}</li> )) : <li>No features listed.</li>}
                        </ul>
                    </div>
                     {/* Coverage Details Section */}
                     <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-[--brand-purple] mb-4 pb-3 border-b">Coverage & Eligibility</h3>
                         <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                            <div><dt className="text-gray-500 font-medium">Eligibility</dt><dd className="text-gray-800">{product.eligibility?.String || 'N/A'}</dd></div>
                            <div><dt className="text-gray-500 font-medium">Policy Term</dt><dd className="text-gray-800">{product.term?.String || 'N/A'}</dd></div>
                            <div className="sm:col-span-2"><dt className="text-gray-500 font-medium">Key Exclusions</dt><dd className="text-gray-800">{product.exclusions?.String || 'N/A'}</dd></div>
                            <div className="sm:col-span-2"><dt className="text-gray-500 font-medium">Room Rent Limit</dt><dd className="text-gray-800">{product.roomRent?.String || 'N/A'}</dd></div>
                        </dl>
                    </div>
                </div>
                {/* Right Column */}
                <div className="lg:col-span-1 space-y-6">
                     {/* Premium Info Section */}
                     <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-[--brand-purple] mb-4 pb-3 border-b">Premium Indication</h3>
                        <p className="text-sm text-gray-600 mb-3">{product.premiumIndication?.String || 'Contact for premium details.'}</p>
                     </div>
                     {/* Documents Section */}
                     <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-[--brand-purple] mb-4 pb-3 border-b">Documents</h3>
                        <div className="space-y-2">
                            {product.brochureUrl?.Valid ? ( <a href={product.brochureUrl.String} target="_blank" rel="noreferrer" className="flex items-center text-sm text-purple-600 hover:underline p-1 hover:bg-gray-50 rounded"> <i className="fas fa-file-pdf w-4 mr-2 text-gray-400"></i> Product Brochure </a> ) : <p className="text-xs text-gray-400 italic">No Brochure</p>}
                            {product.wordingUrl?.Valid ? ( <a href={product.wordingUrl.String} target="_blank" rel="noreferrer" className="flex items-center text-sm text-purple-600 hover:underline p-1 hover:bg-gray-50 rounded"> <i className="fas fa-file-contract w-4 mr-2 text-gray-400"></i> Policy Wording </a> ) : <p className="text-xs text-gray-400 italic">No Wording</p>}
                            {product.claimFormUrl?.Valid ? ( <a href={product.claimFormUrl.String} target="_blank" rel="noreferrer" className="flex items-center text-sm text-purple-600 hover:underline p-1 hover:bg-gray-50 rounded"> <i className="fas fa-file-invoice w-4 mr-2 text-gray-400"></i> Claim Form </a> ) : <p className="text-xs text-gray-400 italic">No Claim Form</p>}
                        </div>
                     </div>
                </div>
            </div>

            {/* Render the Proposal Modal */}
            {/* Ensure GenerateProposalModal is imported */}
            <GenerateProposalModal
                isOpen={isProposalModalOpen}
                onClose={closeProposalModal}
                product={product} // Pass current product data to the modal
            />
        </div>
    );
};

// If saving as a separate file:
export default ProductProfilePage;

// --- Need to import GenerateProposalModal if it's in a separate file ---
// Example assuming it's in ../components/products/GenerateProposalModal.js
// Make sure this component is also defined or imported correctly
// const GenerateProposalModal = ({ isOpen, onClose, product }) => { /* ... Full definition from react_proposal_modal_js ... */ };

