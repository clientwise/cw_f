import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

// Assume themeColors and helpers are defined or imported
const themeColors = { brandPurple: '#5a239e', /* ... */ };
const formatDate = (dateString) => { /* ... */ };

const RenewalsPage = () => {
    const [renewals, setRenewals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [daysFilter, setDaysFilter] = useState(30); // Default to next 30 days

    const fetchRenewals = useCallback(async () => {
        setIsLoading(true); setError(null);
        const token = localStorage.getItem('authToken');
        if (!token) { setError("Authentication error"); setIsLoading(false); return; }

        try {
            const response = await fetch(`https://api.goclientwise.com/api/policies/renewals?days=${daysFilter}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch renewals');
            const data = await response.json();
            setRenewals(data || []);
        } catch (err) { setError(err.message); setRenewals([]); }
        finally { setIsLoading(false); }
    }, [daysFilter]);

    useEffect(() => {
        fetchRenewals();
    }, [fetchRenewals]);

    return (
        <div style={{'--brand-purple': themeColors.brandPurple}}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Upcoming Renewals</h2>
                <Link to="/dashboard" className="text-sm text-purple-600 hover:underline"> Back to Dashboard </Link>
            </div>

            {/* Filters */}
            <div className="mb-4 flex items-center space-x-2">
                 <label htmlFor="days-filter" className="text-sm font-medium text-gray-700">Show renewals in next:</label>
                 <select
                    id="days-filter"
                    value={daysFilter}
                    onChange={(e) => setDaysFilter(parseInt(e.target.value, 10))}
                    className="form-select rounded-md shadow-sm text-sm py-1"
                    disabled={isLoading}
                 >
                    <option value={30}>30 days</option>
                    <option value={60}>60 days</option>
                    <option value={90}>90 days</option>
                 </select>
            </div>

            {isLoading && <div className="text-center p-6"><i className="fas fa-spinner fa-spin text-2xl text-[--brand-purple]"></i></div>}
            {error && <div className="text-red-600 bg-red-100 p-3 rounded">{error}</div>}

            {!isLoading && !error && (
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy #</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Premium (₹)</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {renewals.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-10 text-gray-500 italic">No upcoming renewals found for the selected period.</td></tr>
                            ) : (
                                renewals.map(r => (
                                    <tr key={r.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{r.policyNumber}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{r.clientName}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600 font-medium">{formatDate(r.endDate?.String)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">{r.premium.toLocaleString('en-IN')}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                            <Link to={`/dashboard/clients/${r.clientId}`} className="text-purple-600 hover:text-purple-800">View Client</Link>
                                            {/* Add more actions like 'Start Renewal' later */}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RenewalsPage;
