import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button'; // Adjust path if needed

// Assume themeColors is available globally or via context/props
const themeColors = {
    brandPurple: '#5a239e', brandPurpleHover: '#703abc',
    gray100: '#f3f4f6', gray200: '#e5e7eb', gray400: '#9ca3af',
    gray500: '#6b7280', gray600: '#4b5563', gray700: '#374151',
    gray800: '#1f2937', white: '#ffffff', green500: '#22c55e',
    blue500: '#3b82f6', red100: '#fee2e2', red600: '#dc2626',
    red700: '#b91c1c', purple600: '#7c3aed', // Added for links
    // Add other colors if needed by Button or icons
};

// Helper function to format date strings (including time)
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
         // Handle potential null time from Go's sql.NullTime
         if (typeof dateString === 'object' && dateString !== null && dateString.Valid && dateString.Time) { dateString = dateString.Time; }
         else if (typeof dateString === 'object' && dateString !== null && !dateString.Valid) { return 'N/A'; }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        // Format date and time for activity log
        return date.toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short'});
    } catch (e) { console.warn("Date formatting error for:", dateString, e); return 'Error'; }
 };

 // Helper for activity icons (maps backend activity_type to Font Awesome)
const getActivityIcon = (activityType) => {
    switch(activityType?.toLowerCase()) {
        case 'client_added': return { icon: 'fas fa-user-check', color: 'text-green-500'};
        case 'policy_added': return { icon: 'fas fa-file-alt', color: 'text-blue-500'};
        case 'comm_logged': return { icon: 'fas fa-phone-alt', color: 'text-purple-500'}; // Changed icon
        case 'task_added': return { icon: 'fas fa-check-square', color: 'text-indigo-500'};
        case 'doc_uploaded': return { icon: 'fas fa-upload', color: 'text-cyan-500'};
        case 'client_updated': return { icon: 'fas fa-user-edit', color: 'text-orange-500'};
        case 'profile_updated': return { icon: 'fas fa-id-card', color: 'text-pink-500'};
        case 'goal_updated': return { icon: 'fas fa-bullseye', color: 'text-lime-500'};
        case 'insurer_pocs_updated':
        case 'insurer_details_updated': return { icon: 'fas fa-building', color: 'text-teal-500'};
        case 'proposal_sent': return { icon: 'fas fa-paper-plane', color: 'text-sky-500'};
        case 'lead_onboarded': return { icon: 'fas fa-user-plus', color: 'text-emerald-500'};
        case 'doc_uploaded_portal': return { icon: 'fas fa-cloud-upload-alt', color: 'text-cyan-600'};
        case 'task_suggested': return { icon: 'fas fa-lightbulb', color: 'text-yellow-500'};
        // Add more mappings as needed
        default: return { icon: 'fas fa-info-circle', color: 'text-gray-500'};
    }
};

// Simple Pagination Component (Can be moved to common components)
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const handlePrev = () => { if (currentPage > 1) onPageChange(currentPage - 1); };
    const handleNext = () => { if (currentPage < totalPages) onPageChange(currentPage + 1); };

    // Basic page number generation (consider limiting for many pages)
    const pageNumbers = [];
    const maxPagesToShow = 5; // Example limit
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (totalPages > maxPagesToShow && endPage - startPage + 1 < maxPagesToShow) {
         startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }


    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="mt-6 flex justify-center items-center space-x-1">
            <Button onClick={handlePrev} disabled={currentPage <= 1} variant="outlineSm" className="text-xs px-2 py-1 rounded-md"> <i className="fas fa-chevron-left"></i> </Button>

            {startPage > 1 && (
                 <>
                    <Button onClick={() => onPageChange(1)} variant='outlineSm' className="text-xs px-2 py-1 w-7 h-7 rounded-md">1</Button>
                    {startPage > 2 && <span className="text-xs text-gray-500 px-1">...</span>}
                 </>
            )}

            {pageNumbers.map(p => (
                <Button key={p} onClick={() => onPageChange(p)} variant={p === currentPage ? 'brand' : 'outlineSm'} className="text-xs px-2 py-1 w-7 h-7 rounded-md">
                    {p}
                </Button>
            ))}

             {endPage < totalPages && (
                 <>
                    {endPage < totalPages - 1 && <span className="text-xs text-gray-500 px-1">...</span>}
                    <Button onClick={() => onPageChange(totalPages)} variant='outlineSm' className="text-xs px-2 py-1 w-7 h-7 rounded-md">{totalPages}</Button>
                 </>
            )}


            <Button onClick={handleNext} disabled={currentPage >= totalPages} variant="outlineSm" className="text-xs px-2 py-1 rounded-md"> <i className="fas fa-chevron-right"></i> </Button>
        </div>
    );
};


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
        // Don't reset loading if only page changes, only on initial/error
        // setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('authToken');
        if (!token) { setError("Authentication error"); setIsLoading(false); return; }

        const params = new URLSearchParams();
        params.append('page', currentPage.toString());
        params.append('limit', pageSize.toString());

        try {
            // Set loading true before fetch
            setIsLoading(true);
            const response = await fetch(`http://localhost:8080/api/activity?${params.toString()}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                 let errorMsg = `Error fetching activity: ${response.status}`;
                 try{ const d = await response.json(); errorMsg = d.error || errorMsg; } catch(e){}
                 throw new Error(errorMsg);
            }
            const data = await response.json(); // Expect PaginatedResponse
            setActivities(data.items || []);
            setTotalItems(data.totalItems || 0);
            setCurrentPage(data.currentPage || 1);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error("Fetch Activity Error:", err);
            setError(err.message || "Failed to load activity log.");
            setActivities([]); // Clear data on error
        }
        finally {
            setIsLoading(false);
        }
    }, [currentPage, pageSize]); // Depend on currentPage and pageSize

    // Initial fetch on mount
    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]); // fetchActivities is stable due to useCallback

     const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
            setCurrentPage(newPage);
            // Fetch will be triggered by useEffect dependency change
        }
    };

    return (
         <div style={{'--brand-purple': themeColors.brandPurple}}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Full Activity Log</h2>
                <Link to="/dashboard" className="text-sm text-purple-600 hover:underline"> Back to Dashboard </Link>
            </div>

            {/* Add Filters later if needed (e.g., by type, date range) */}
             <div className="mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                 <p className="text-sm text-gray-600">Showing recent activities for your account.</p>
                 {/* Placeholder for filters */}
             </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-lg shadow">
                {isLoading && <div className="text-center p-10"><i className="fas fa-spinner fa-spin text-3xl text-[--brand-purple]"></i></div>}
                {error && <div className="text-red-600 bg-red-100 p-4 rounded m-4">{error}</div>}

                {!isLoading && !error && (
                    <>
                    <ul className="divide-y divide-gray-200">
                        {activities.length === 0 ? (
                            <li className="text-center py-10 text-gray-500 italic">No activities found.</li>
                        ) : (
                            activities.map(activity => {
                                const iconInfo = getActivityIcon(activity.activityType);
                                // Check if relatedId looks like a number (potential client ID)
                                const isClientId = activity.relatedId && /^\d+$/.test(activity.relatedId);

                                return (
                                    <li key={activity.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 text-sm">
                                        <i className={`${iconInfo.icon} ${iconInfo.color} w-5 text-center text-lg flex-shrink-0`}></i>
                                        <span className="flex-grow text-gray-700">{activity.description}</span>
                                        {/* Link related ID only if it looks like a client ID */}
                                        {isClientId &&
                                            <Link to={`/dashboard/clients/${activity.relatedId}`} className="text-xs text-purple-600 hover:underline flex-shrink-0" title="View Client">
                                                (Client: {activity.relatedId})
                                            </Link>
                                        }
                                         <span className="text-xs text-gray-400 flex-shrink-0 ml-auto pl-2">{formatDate(activity.timestamp)}</span>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                    </>
                )}
            </div>
            {/* Render Pagination only if not loading and no error */}
            {!isLoading && !error && totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
        </div>
    );
};

export default ActivityLogPage;
