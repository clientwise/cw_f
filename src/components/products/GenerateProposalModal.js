import React, { useState, useEffect, useMemo } from 'react';
import InputField from '../common/InputField'; // Adjust path if needed
import Button from '../common/Button'; // Adjust path if needed

// Assume themeColors is available globally or via context/props
const themeColors = { /* ... include necessary theme colors ... */
    brandPurple: '#5a239e', brandPurpleHover: '#703abc',
    lightGray: '#f9fafb', mediumGray: '#6b7280', darkGray: '#1f2937',
    white: '#ffffff', gray100: '#f3f4f6', gray200: '#e5e7eb',
    gray500: '#6b7280', gray600: '#4b5563', gray700: '#374151',
    red100: '#fee2e2', red700: '#b91c1c', green100: '#dcfce7', green700: '#15803d',
};

// Helper to calculate age (ensure robustness)
const calculateAge = (dobValue) => {
    // Handle potential {String, Valid} object for DOB as well
    const dobString = (dobValue && dobValue.Valid) ? dobValue.String : dobValue;
    if (!dobString || typeof dobString !== 'string') return 'N/A';

    try {
        const birthDate = new Date(dobString);
        if (isNaN(birthDate.getTime())) {
            console.warn(`Invalid date format received for DOB: ${dobString}`);
            return 'N/A';
        }
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age >= 0 ? age : 'N/A';
    } catch (e) {
        console.error("Error calculating age:", e);
        return 'N/A';
    }
};

// Helper function to safely get string value from potential {String, Valid} object
const getStringValue = (value) => {
    if (value && typeof value === 'object' && value.hasOwnProperty('Valid') && value.hasOwnProperty('String')) {
        return value.Valid ? value.String : ''; // Return empty string if Valid is false
    }
    // If it's already a string or other primitive, return it (or empty string if null/undefined)
    return (typeof value === 'string' || typeof value === 'number') ? String(value) : '';
};


const GenerateProposalModal = ({ isOpen, onClose, product }) => {
    // State for client list and search
    const [clients, setClients] = useState([]);
    const [isLoadingClients, setIsLoadingClients] = useState(false);
    const [clientError, setClientError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showClientList, setShowClientList] = useState(false);

    // State for selected client and form data
    const [selectedClient, setSelectedClient] = useState(null); // Store the whole client object
    const [sumInsured, setSumInsured] = useState('');
    const [policyTerm, setPolicyTerm] = useState('');

    // State for submission
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');
    const [submitError, setSubmitError] = useState('');

    // Fetch clients when modal opens or isOpen changes
    useEffect(() => {
        if (isOpen) {
            // Reset state on open
            setClients([]);
            setSelectedClient(null);
            setSearchTerm('');
            setShowClientList(false);
            setSubmitMessage('');
            setSubmitError('');
            setSumInsured('');
            setPolicyTerm('');
            setClientError(null);

            const fetchClients = async () => {
                setIsLoadingClients(true);
                setClientError(null);

                const token = localStorage.getItem('authToken');
                if (!token) {
                    setClientError("Authentication token not found. Please log in.");
                    setIsLoadingClients(false);
                    return;
                }

                try {
                    const response = await fetch('http://localhost:8080/api/clients', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
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
                    console.log("Fetched Clients Data:", data); // Keep for debugging
                    setClients(data || []);

                } catch (error) {
                    console.error("Failed to fetch clients:", error);
                    setClientError(error.message || "An unexpected error occurred while fetching clients.");
                } finally {
                    setIsLoadingClients(false);
                }
            };

            fetchClients();

        }
    }, [isOpen]);

    // Filter clients based on search term - **UPDATED TO USE getStringValue**
    const filteredClients = useMemo(() => {
        if (!searchTerm) return clients;

        const lowerSearchTerm = searchTerm.toLowerCase();

        if (!Array.isArray(clients)) {
            console.error("Clients data is not an array:", clients);
            return [];
        }

        return clients.filter(client => {
            // Safely get string values using the helper
            const nameStr = getStringValue(client.name);
            const emailStr = getStringValue(client.email);
            const phoneStr = getStringValue(client.phone);

            // Perform case-insensitive search on the extracted strings
            const nameMatch = nameStr.toLowerCase().includes(lowerSearchTerm);
            const emailMatch = emailStr.toLowerCase().includes(lowerSearchTerm);
            const phoneMatch = phoneStr.toLowerCase().includes(lowerSearchTerm);

            return nameMatch || emailMatch || phoneMatch;
        });
    }, [clients, searchTerm]);

    // Handle selecting a client from the list
    const handleSelectClient = (client) => {
        setSelectedClient(client);
        // Use helper to get name safely for the input box
        setSearchTerm(getStringValue(client.name));
        setShowClientList(false);
    };

    // Handle opening the "Add New Client" flow (placeholder)
    const handleAddNewClient = () => {
         alert("Functionality to add a new client from here is not implemented yet. Please add the client from the main 'Clients' page first.");
    };

    // Handle proposal submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!selectedClient) {
            setSubmitError("Please select a client.");
            return;
        }
        setIsSubmitting(true);
        setSubmitError('');
        setSubmitMessage('');
        const token = localStorage.getItem('authToken');

        const payload = {
            // Ensure ID is accessed correctly, assuming ID is never a {String, Valid} object
            clientId: selectedClient.id,
            productId: product?.id,
            sumInsured: sumInsured ? parseFloat(sumInsured) : undefined,
            policyTerm: policyTerm ? parseInt(policyTerm, 10) : undefined,
        };

        console.log("Submitting Proposal Request Payload:", payload);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            setSubmitMessage("Proposal generation request created successfully! (Simulated)");
            // TODO: Replace simulation with actual POST request to proposal endpoint
            // setTimeout(onClose, 2000); // Optional: Close after success

        } catch (err) {
             setSubmitError(err.message || "An error occurred during submission.");
             console.error("Submission Error:", err);
        } finally {
             setIsSubmitting(false);
        }
    };

    // Handle closing dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showClientList && event.target.closest && !event.target.closest('.client-search-container')) {
                setShowClientList(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showClientList]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" style={{'--brand-purple': themeColors.brandPurple}}>
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-[--brand-purple]"> Generate Proposal for {product?.name || 'Product'} </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close modal"> <i className="fas fa-times fa-lg"></i> </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
                    {/* Client Selection */}
                    <div className="relative client-search-container">
                         <label htmlFor="client-search" className="block text-sm font-medium text-gray-700 mb-1">Select Existing Client</label>
                         <div className="flex items-center gap-2">
                             <input
                                 type="text"
                                 id="client-search"
                                 placeholder="Search by name, email, or phone..."
                                 autoComplete="off"
                                 value={searchTerm}
                                 onChange={(e) => { setSearchTerm(e.target.value); setShowClientList(true); setSelectedClient(null); }}
                                 onFocus={() => setShowClientList(true)}
                                 className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm"
                             />
                             <Button type="button" onClick={handleAddNewClient} variant="outlineSm" className="flex-shrink-0 text-xs">
                                 <i className="fas fa-plus mr-1"></i> New Client
                             </Button>
                         </div>
                         {/* Search Results Dropdown - **UPDATED TO USE getStringValue** */}
                         {showClientList && (
                             <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                 {isLoadingClients && <div className="p-2 text-sm text-gray-500">Loading...</div>}
                                 {!isLoadingClients && clientError && <div className="p-2 text-sm text-red-600">{clientError}</div>}
                                 {!isLoadingClients && !clientError && filteredClients.length === 0 && searchTerm && <div className="p-2 text-sm text-gray-500">No clients found matching "{searchTerm}".</div>}
                                 {!isLoadingClients && !clientError && filteredClients.length === 0 && !searchTerm && <div className="p-2 text-sm text-gray-500">Start typing to search for clients.</div>}
                                 {!isLoadingClients && !clientError && filteredClients.map(client => {
                                     // Safely get display strings
                                     const displayName = getStringValue(client.name) || 'Unnamed Client';
                                     const displayContact = getStringValue(client.email) || getStringValue(client.phone) || 'No contact info';

                                     return (
                                         <div
                                             key={client.id} // Assuming ID is always a primitive
                                             className="p-2 text-sm hover:bg-purple-50 cursor-pointer"
                                             onMouseDown={() => handleSelectClient(client)}
                                         >
                                             <p className="font-medium">{displayName}</p>
                                             <p className="text-xs text-gray-500">{displayContact}</p>
                                         </div>
                                     );
                                 })}
                             </div>
                         )}
                    </div>

                    {/* Auto-filled Client Info - **UPDATED TO USE getStringValue** */}
                    {selectedClient && (
                        <div className="p-4 border rounded-md bg-gray-50">
                             <h4 className="text-sm font-medium text-gray-800 mb-2">Selected Client Details:</h4>
                             <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 text-xs">
                                 {/* Use helper function for potentially nullable fields */}
                                 <div><dt className="text-gray-500">Name:</dt><dd className="text-gray-700 font-medium">{getStringValue(selectedClient.name) || 'N/A'}</dd></div>
                                 <div><dt className="text-gray-500">Age:</dt><dd className="text-gray-700 font-medium">{calculateAge(selectedClient.dob)}</dd></div>
                                 <div><dt className="text-gray-500">Email:</dt><dd className="text-gray-700 font-medium">{getStringValue(selectedClient.email) || 'N/A'}</dd></div>
                                 <div><dt className="text-gray-500">Phone:</dt><dd className="text-gray-700 font-medium">{getStringValue(selectedClient.phone) || 'N/A'}</dd></div>
                                 <div className="sm:col-span-2"><dt className="text-gray-500">Address:</dt><dd className="text-gray-700 font-medium">{getStringValue(selectedClient.address) || 'N/A'}</dd></div>
                                 {/* Assuming Salary/Job Type might also be nullable or not present */}
                                 <div><dt className="text-gray-500">Salary:</dt><dd className="text-gray-700 font-medium italic">{getStringValue(selectedClient.salary) || 'N/A'}</dd></div>
                                 <div><dt className="text-gray-500">Job Type:</dt><dd className="text-gray-700 font-medium italic">{getStringValue(selectedClient.jobType) || 'N/A'}</dd></div>
                             </dl>
                        </div>
                    )}

                    {/* Proposal Specific Fields */}
                    {selectedClient && (
                        <div>
                             <h3 className="text-md font-semibold text-gray-700 mb-3 pt-4 border-t">Proposal Details</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                 <div>
                                     <label htmlFor="sum_insured" className="block text-sm font-medium text-gray-700 mb-1">Sum Insured / Cover Amount (₹)</label>
                                     <input
                                        type="number"
                                        id="sum_insured"
                                        name="sum_insured"
                                        value={sumInsured}
                                        onChange={(e) => setSumInsured(e.target.value)}
                                        min="0"
                                        placeholder="e.g., 500000"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm" />
                                 </div>
                                 <div>
                                     <label htmlFor="policy_term" className="block text-sm font-medium text-gray-700 mb-1">Policy Term (Years)</label>
                                     <input
                                        type="number"
                                        id="policy_term"
                                        name="policy_term"
                                        value={policyTerm}
                                        onChange={(e) => setPolicyTerm(e.target.value)}
                                        min="1"
                                        placeholder="e.g., 10"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm" />
                                 </div>
                             </div>
                        </div>
                    )}

                     {/* Submission Messages */}
                     {submitMessage && <div className="p-3 rounded-md text-sm bg-green-100 text-green-700">{submitMessage}</div>}
                     {submitError && <div className="p-3 rounded-md text-sm bg-red-100 text-red-700">{submitError}</div>}

                </form>

                 {/* Modal Footer Actions */}
                 <div className="flex justify-end items-center space-x-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                     <Button type="button" variant="outlineSm" onClick={onClose} className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 px-4 py-2">
                         Cancel
                     </Button>
                     <Button
                         type="button"
                         onClick={handleSubmit}
                         variant="brand"
                         disabled={isSubmitting || !selectedClient}
                         className="px-4 py-2"
                     >
                         {isSubmitting ? (
                            <> <i className="fas fa-spinner fa-spin mr-2"></i> Generating... </>
                         ) : (
                            'Generate Proposal Request'
                         )}
                     </Button>
                 </div>

            </div>
        </div>
    );
};

export default GenerateProposalModal;
