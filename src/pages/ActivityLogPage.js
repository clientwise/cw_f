import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

// Assume themeColors and helpers are defined or imported
const themeColors = { brandPurple: '#5a239e', /* ... */ };
const formatDate = (dateString) => { /* ... */ }; // Ensure it handles time
const getActivityIcon = (activityType) => { /* ... */ }; // Reuse from dashboard

// Reusing Pagination Component from AllTasksPage (or import if separate)
const Pagination = ({ currentPage, totalPages, onPageChange }) => { /* ... */ };

const ActivityLogPage = () => {
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const pageSize = 25; // Items per page

    const fetchActivities = useCallback(async () => {
        setIsLoading(true); setError(null);
        const token = localStorage.getItem('authToken');
        if (!token) { setError("Authentication error"); setIsLoading(false); return; }

        const params = new URLSearchParams();
        params.append('page', currentPage.toString());
        params.append('limit', pageSize.toString());

        try {
            const response = await fetch(`https://api.goclientwise.com/api/activity?${params.toString()}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch activity log');
            const data = await response.json(); // Expect PaginatedResponse
            setActivities(data.items || []);
            setTotalItems(data.totalItems || 0);
            setCurrentPage(data.currentPage || 1);
            setTotalPages(data.totalPages || 1);
        } catch (err) { setError(err.message); setActivities([]); }
        finally { setIsLoading(false); }
    }, [currentPage, pageSize]);

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

     const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
         <div style={{'--brand-purple': themeColors.brandPurple}}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Full Activity Log</h2>
                <Link to="/dashboard" className="text-sm text-purple-600 hover:underline"> Back to Dashboard </Link>
            </div>

            {/* Add Filters later if needed (e.g., by type, date range) */}

            {isLoading && <div className="text-center p-6"><i className="fas fa-spinner fa-spin text-2xl text-[--brand-purple]"></i></div>}
            {error && <div className="text-red-600 bg-red-100 p-3 rounded">{error}</div>}

            {!isLoading && !error && (
                <>
                <div className="bg-white rounded-lg shadow">
                    <ul className="divide-y divide-gray-200">
                        {activities.length === 0 ? (
                            <li className="text-center py-10 text-gray-500 italic">No activities found.</li>
                        ) : (
                            activities.map(activity => {
                                const iconInfo = getActivityIcon(activity.activityType);
                                return (
                                    <li key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 text-sm">
                                        <i className={`${iconInfo.icon} ${iconInfo.color} w-5 text-center text-lg`}></i>
                                        <span className="flex-grow text-gray-700">{activity.description}</span>
                                        {/* Link related ID if it's numeric (likely client ID) */}
                                        {activity.relatedId && !isNaN(Number(activity.relatedId)) &&
                                            <Link to={`/dashboard/clients/${activity.relatedId}`} className="text-xs text-purple-600 hover:underline" title="View Client">
                                                (Client: {activity.relatedId})
                                            </Link>
                                        }
                                         <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(activity.timestamp)}</span>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
                 <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </>
            )}
        </div>
    );
};

export default ActivityLogPage;

