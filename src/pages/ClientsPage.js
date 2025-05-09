import React, { useState, useEffect, useCallback } from 'react';
import { Link, useOutletContext } from 'react-router-dom'; // Import useOutletContext
import Button from '../components/common/Button'; // Adjust path if needed
import AddClientModal from '../components/clients/AddClientModal'; // Adjust path if needed
import BulkClientUploadModal from '../components/clients/BulkClientUploadModal'; // NEW: Import Bulk Upload Modal

// Assume themeColors and helper functions are defined or imported
const themeColors = { /* ... */ };
const getStatusClass = (status) => { /* ... */ };
const formatDate = (dateString) => { /* ... */ };

const ClientsPage = () => {
    // --- Get userInfo from Outlet context ---
    const { userInfo } = useOutletContext();
    // ----------------------------------------

    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- State for onboarding link ---
    const [onboardingLink, setOnboardingLink] = useState('');
    const [linkCopied, setLinkCopied] = useState(false);


    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false); // NEW

    // Construct onboardi
    // ng link when userInfo is available
    useEffect(() => {
        if (userInfo?.userId) {
            // Construct the base URL carefully
            const baseUrl = window.location.origin; // Gets https://api.goclientwise.com or your domain
            const formPath = '/onboarding_form.html'; // Assumes form is in public folder
            const fullLink = `${baseUrl}${formPath}?agentId=${userInfo.userId}`;
            setOnboardingLink(fullLink);
        }
    }, [userInfo]);


    // Fetch clients function
    const fetchClients = useCallback(async () => {
        setIsLoading(true); setError(null);
        const token = localStorage.getItem('authToken');
        if (!token) { setError("Authentication error: Not logged in."); setIsLoading(false); return; }
// https://api.goclientwise.com
        const params = new URLSearchParams();
        if (statusFilter && statusFilter !== 'All Statuses') params.append('status', statusFilter);
        if (searchTerm) params.append('search', searchTerm);
        // Add pagination params later if needed: params.append('limit', '50'); params.append('offset', '0');

        const url = `https://api.goclientwise.com/api/clients?${params.toString()}`;
        try {
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) { let e = `Err: ${response.status}`; try { const d = await response.json(); e = d.error || e; } catch {} throw new Error(e); }
            const data = await response.json();
            setClients(data || []);
        } catch (err) { console.error("Failed fetch clients:", err); setError(err.message || "Error."); setClients([]);
        } finally { setIsLoading(false); }
    }, [statusFilter, searchTerm]); // Depend on filters

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);


    // Modal Handlers
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const handleClientAdded = () => { closeModal(); fetchClients(); }; // Refresh list after adding


    const openBulkUploadModal = () => setIsBulkUploadModalOpen(true);
    const closeBulkUploadModal = () => setIsBulkUploadModalOpen(false);
    const handleUploadComplete = () => {
        // Don't close modal automatically, user might want to see results/errors
        fetchClients(); // Refresh client list in the background
    };

    // --- Onboarding Link Sharing Handlers ---
    const handleCopyLink = () => {
        if (!onboardingLink) return;
        navigator.clipboard.writeText(onboardingLink)
            .then(() => {
                setLinkCopied(true);
                setTimeout(() => setLinkCopied(false), 2000); // Hide message after 2s
            })
            .catch(err => {
                console.error('Failed to copy link: ', err);
                alert('Failed to copy link.');
            });
    };

    const handleShareEmail = () => {
        if (!onboardingLink) return;
        const subject = encodeURIComponent("Let's Get Started - Client Information");
        const body = encodeURIComponent(`Hello,\n\nPlease use the following secure link to provide your details for insurance planning:\n\n${onboardingLink}\n\nBest regards,\n[Your Name/Agency Name]`); // Agent should customize name
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

     const handleShareWhatsApp = () => {
        if (!onboardingLink) return;
        const message = encodeURIComponent(`Hello, please use this secure link to provide your details for insurance planning: ${onboardingLink}`);
        window.open(`https://wa.me/?text=${message}`, '_blank');
    };
    // ----------------------------------------

    return (
        <div style={{'--brand-purple': themeColors.brandPurple}}>
            {/* Header Bar */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
  <h2 className="text-2xl font-semibold text-gray-800">Clients</h2>
  <div className="flex gap-2"> {/* Container for the buttons */}
    <Button onClick={openBulkUploadModal} variant="outlineSm" className="px-3 py-1.5 text-sm">
      <i className="fas fa-file-csv mr-2"></i>Bulk Upload
    </Button>
    <Button onClick={openModal} variant="brand" className="px-4 py-2 text-sm">
      <i className="fas fa-plus mr-2"></i>Add New Client
    </Button>
  </div>
</div>

            {/* --- NEW: Share Onboarding Link Section --- */}
            {userInfo?.userId && onboardingLink && (
                <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-md font-semibold text-gray-700 mb-3">Share Onboarding Form Link</h3>
                    <p className="text-xs text-gray-500 mb-3">Share this link with potential clients to collect their information directly.</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <input
                            type="text"
                            readOnly
                            value={onboardingLink}
                            className="flex-grow px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-xs text-gray-600 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[--brand-purple]"
                        />
                        <div className="flex items-center space-x-2 flex-shrink-0">
                             <button
                                onClick={handleCopyLink}
                                title="Copy Link"
                                className="p-2 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[--brand-purple]"
                            >
                                <i className={`fas ${linkCopied ? 'fa-check text-green-500' : 'fa-copy'} w-4 h-4`}></i>
                            </button>
                             <button
                                onClick={handleShareEmail}
                                title="Share via Email"
                                className="p-2 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[--brand-purple]"
                            >
                                <i className="fas fa-envelope w-4 h-4"></i>
                            </button>
                            <button
                                onClick={handleShareWhatsApp}
                                title="Share via WhatsApp"
                                className="p-2 border border-gray-300 rounded-md bg-white text-green-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[--brand-purple]"
                            >
                                <i className="fab fa-whatsapp w-4 h-4"></i>
                            </button>
                        </div>
                    </div>
                     {linkCopied && <p className="text-xs text-green-600 mt-1">Link copied to clipboard!</p>}
                </div>
            )}
            {/* ---------------------------------------- */}


            {/* Filters and Search Bar */}
            <div className="p-4 md:p-6 mb-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
                    {/* Status Filter */}
                    <div>
                        <label htmlFor="status" className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                        <select id="status" name="status" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} disabled={isLoading} className="block w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm">
                            <option>All Statuses</option>
                            <option>Lead</option>
                            <option>Active</option>
                            <option>Lapsed</option>
                        </select>
                    </div>
                    {/* Search Input */}
                    <div className="sm:col-span-2 md:col-span-2">
                        <label htmlFor="search" className="block text-xs font-medium text-gray-700 mb-1">Search Clients</label>
                        <div className="flex">
                            <input type="search" id="search" name="search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} disabled={isLoading} placeholder="Search by name, email, phone..." className="flex-grow px-3 py-1.5 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm"/>
                            <button onClick={fetchClients} className="px-3 py-1.5 border border-[--brand-purple] bg-[--brand-purple] text-white rounded-r-md hover:bg-[--brand-purple-hover] focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[--brand-purple]" disabled={isLoading}> <i className="fas fa-search"></i> </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading & Error States */}
            {isLoading && <div className="text-center p-6"><i className="fas fa-spinner fa-spin text-2xl text-[--brand-purple]"></i></div>}
            {!isLoading && error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">{error}</div>}

            {/* Clients Table */}
            {!isLoading && !error && (
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead><tr className="bg-gray-50"> <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th> <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th> <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tags</th> <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added On</th> <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> </tr></thead>
                        <tbody className="divide-y divide-gray-200">
                            {clients.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-10 text-gray-500 italic">No clients found.</td></tr>
                            ) : (
                                clients.map(client => (
                                    <tr key={client.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{client.name}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {client.email?.Valid && <div><i className="fas fa-envelope w-4 mr-1 text-gray-400"></i>{client.email.String}</div>}
                                            {client.phone?.Valid && <div><i className="fas fa-phone w-4 mr-1 text-gray-400"></i>{client.phone.String}</div>}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap"><span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(client.status)}`}>{client.status}</span></td>
                                        <td className="px-4 py-3 text-xs text-gray-500">{(client.tags?.String || '').split(',').map(tag => tag.trim()).filter(t=>t).map((tag, i) => <span key={i} className="mr-1 mb-1 inline-block bg-gray-100 px-1.5 py-0.5 rounded">{tag}</span>)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(client.createdAt)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                            <Link to={`/dashboard/clients/${client.id}`} className="text-purple-600 hover:text-purple-800">View</Link>
                                            {/* Add Edit/Delete buttons here later */}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Client Modal */}
            <AddClientModal isOpen={isModalOpen} onClose={closeModal} onClientAdded={handleClientAdded} />
            <BulkClientUploadModal
                isOpen={isBulkUploadModalOpen}
                onClose={closeBulkUploadModal}
                onUploadComplete={handleUploadComplete}
            />
        </div>
    );
};

export default ClientsPage;
