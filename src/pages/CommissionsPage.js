import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import Button from '../components/common/Button'; // Adjust path if needed
import InputField from '../components/common/InputField'; // Adjust path if needed

// Assume themeColors is available globally or via context/props
const themeColors = {
    brandPurple: '#5a239e', brandPurpleHover: '#703abc',
    // Add other colors used if not globally defined via CSS vars
    gray100: '#f3f4f6', gray200: '#e5e7eb', gray500: '#6b7280',
    gray600: '#4b5563', gray700: '#374151', gray800: '#1f2937',
    white: '#ffffff', green100: '#dcfce7', green800: '#166534',
    red100: '#fee2e2', red700: '#b91c1c',
};

// Helper function to format date strings or return 'N/A'
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
         if (typeof dateString === 'object' && dateString !== null && dateString.Valid && dateString.Time) { dateString = dateString.Time; }
         else if (typeof dateString === 'object' && dateString !== null && !dateString.Valid) { return 'N/A'; }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) { console.warn("Date formatting error for:", dateString, e); return 'Error'; }
 };

 // Helper for policy status badge
 const getPolicyStatusClass = (status) => {
    const lowerStatus = status?.toLowerCase() || '';
    switch(lowerStatus) {
        case 'active': return 'bg-green-100 text-green-800';
        case 'lapsed': return 'bg-red-100 text-red-800';
        case 'pending renewal': return 'bg-yellow-100 text-yellow-800';
        case 'cancelled': return 'bg-gray-100 text-gray-800';
        case 'expired': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
    }
 };


const CommissionsPage = () => {
    const [commissionRecords, setCommissionRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // State for date filters
    const [startDate, setStartDate] = useState(''); // Format: YYYY-MM-DD
    const [endDate, setEndDate] = useState('');     // Format: YYYY-MM-DD

    // Fetch commission data
    const fetchCommissions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');
        if (!token) { setError("Authentication error: Not logged in."); setIsLoading(false); return; }

        // Build query parameters for date range
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        // TODO: Add status filter (paid/pending) if implemented in backend

        const url = `http://localhost:8080/api/commissions?${params.toString()}`;
        console.log("Fetching commissions from:", url);

        try {
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                let errorMsg = `Error fetching commissions: ${response.status}`;
                try { const d = await response.json(); errorMsg = d.error || errorMsg; } catch (e) {}
                throw new Error(errorMsg);
            }
            const data = await response.json();
            setCommissionRecords(data || []); // Ensure it's always an array
            console.log("Fetched commissions:", data);
        } catch (err) {
            console.error("Failed to fetch commissions:", err);
            setError(err.message || "An error occurred fetching commission data.");
            setCommissionRecords([]); // Clear data on error
        } finally {
            setIsLoading(false);
        }
    }, [startDate, endDate]); // Refetch when date filters change

    // Initial fetch on mount
    useEffect(() => {
        fetchCommissions();
    }, [fetchCommissions]);

    // Calculate total commission for the displayed records
    const totalCommission = useMemo(() => {
        return commissionRecords.reduce((sum, record) => sum + (record.upfrontCommissionAmount?.Float64 || 0), 0);
    }, [commissionRecords]);

    // Handle filter application (currently triggers fetch via useEffect dependency)
    const handleFilter = () => {
        fetchCommissions(); // Manually trigger fetch if needed, though useEffect does it
    };

    return (
        <div style={{'--brand-purple': themeColors.brandPurple}}>
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Commission Statements</h2>
                {/* Add Export button later? */}
                {/* <Button variant="outlineSm">Export CSV</Button> */}
            </div>

            {/* Filters */}
            <div className="p-4 md:p-6 mb-6 bg-white rounded-lg shadow-sm border border-gray-200">
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
                    <InputField
                        id="start-date"
                        label="Start Date (Policy Created)"
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                        required={false} // Optional filter
                    />
                     <InputField
                        id="end-date"
                        label="End Date (Policy Created)"
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        required={false} // Optional filter
                    />
                    {/* Optional: Add Status Filter Dropdown */}
                    {/* <div> <label>Status</label> <select>...</select> </div> */}
                     {/* Filter button might not be needed if useEffect triggers on date change */}
                     {/* <Button onClick={handleFilter} disabled={isLoading} variant="brand" className="h-10">Filter</Button> */}
                 </div>
            </div>

            {/* Loading State */}
            {isLoading && ( <div className="text-center p-10 text-gray-500"> <i className="fas fa-spinner fa-spin text-3xl text-[--brand-purple]"></i> <p className="mt-2">Loading Commissions...</p> </div> )}

            {/* Error State */}
            {!isLoading && error && ( <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert"> <strong className="font-bold">Error: </strong> <span className="block sm:inline">{error}</span> </div> )}

            {/* Commission Table */}
            {!isLoading && !error && (
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy #</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client ID</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product / Insurer</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Premium (₹)</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Commission (₹)</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy Status</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Issued</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {commissionRecords.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-10 text-gray-500 italic">No commission records found for the selected period.</td></tr>
                            ) : (
                                commissionRecords.map((record) => (
                                    <tr key={record.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{record.policyNumber}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {/* TODO: Link to client profile or show name */}
                                            {record.clientId}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                             <div>{record.productId?.String || 'N/A'}</div> {/* Show Product ID if available */}
                                             <div className="text-xs">{record.insurer}</div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">{record.premium.toLocaleString('en-IN')}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 font-medium text-right">
                                            {record.upfrontCommissionAmount?.Valid ? record.upfrontCommissionAmount.Float64.toLocaleString('en-IN') : '0.00'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getPolicyStatusClass(record.status)}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(record.createdAt)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                         {/* Footer for Totals */}
                         {commissionRecords.length > 0 && (
                            <tfoot>
                                <tr className="bg-gray-100 font-semibold">
                                    <td colSpan="4" className="px-4 py-2 text-right text-sm text-gray-700">Total Commission:</td>
                                    <td className="px-4 py-2 text-right text-sm text-green-700">
                                        ₹{totalCommission.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td colSpan="2" className="px-4 py-2"></td>
                                </tr>
                            </tfoot>
                         )}
                    </table>
                </div>
            )}
        </div>
    );
};

export default CommissionsPage; // If saving as separate file
