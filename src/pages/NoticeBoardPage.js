import React, { useState, useEffect } from 'react';

// Assume themeColors is available globally or via context/props
// You might want to import this from a central theme file
const themeColors = {
    brandPurple: '#5a239e',
    red600: '#dc2626',
    red100: '#fee2e2',
    green100: '#dcfce7', // For success messages if needed later
    green700: '#15803d',
    gray500: '#6b7280',
    gray700: '#374151',
    gray800: '#1f2937',
};

const NoticeBoardPage = () => {
    // State for notices, loading status, errors, and filter
    const [notices, setNotices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('All Categories');

    // Effect hook to fetch notices when component mounts or filter changes
    useEffect(() => {
        const fetchNotices = async () => {
            setIsLoading(true);
            setError(null);
            setNotices([]); // Clear previous notices

            // --- Authentication: Get JWT Token ---
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError("Authentication error: Not logged in.");
                setIsLoading(false);
                // In a real app, you might redirect to login here
                // e.g., using useNavigate() from react-router-dom
                return;
            }
            // --- End Authentication ---

            // Construct API URL with optional category filter
            let url = 'http://localhost:8080/api/notices'; // Your backend API endpoint
            if (categoryFilter && categoryFilter !== 'All Categories') {
                url += `?category=${encodeURIComponent(categoryFilter)}`;
            }

            try {
                // Make the API call with Authorization header
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Include JWT token
                        'Content-Type': 'application/json',
                    },
                });

                // Check if the response was successful
                if (!response.ok) {
                    let errorMsg = `Error fetching notices: ${response.status}`;
                    try {
                        // Try to get a more specific error from backend JSON response
                        const errData = await response.json();
                        errorMsg = errData.error || errorMsg;
                    } catch (e) { /* Ignore if response body isn't JSON */ }
                    throw new Error(errorMsg);
                }

                // Parse the JSON response
                const data = await response.json();
                setNotices(data || []); // Set notices, handle null response

            } catch (err) {
                // Handle errors during fetch or parsing
                console.error("Failed to fetch notices:", err);
                setError(err.message || "An unexpected error occurred.");
            } finally {
                // Always set loading to false after attempt
                setIsLoading(false);
            }
        };

        fetchNotices(); // Call the fetch function

    }, [categoryFilter]); // Re-run the effect if categoryFilter changes

    // Helper function to format date strings
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            // Attempt to parse assuming common formats, adjust if your backend sends differently
            const date = new Date(dateString);
            if (isNaN(date.getTime())) { return 'Invalid Date'; }
            return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
        } catch (e) {
            console.warn("Date formatting error for:", dateString, e);
            return dateString; // Return original string if parsing fails
        }
    };

    return (
        <div style={{'--brand-purple': themeColors.brandPurple}}>
             {/* Filters */}
             <div className="p-4 md:p-6 mb-6 border-b border-gray-200 bg-white rounded-t-lg shadow-sm">
                 <div className="flex flex-wrap items-center gap-4">
                     <div>
                        <label htmlFor="category" className="block text-xs font-medium text-gray-700 mb-1">Filter by Category</label>
                        <select
                            id="category"
                            name="category"
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                            className="block w-full sm:w-auto px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm"
                            disabled={isLoading} // Disable filter while loading
                        >
                            <option>All Categories</option>
                            <option>Product Updates</option>
                            <option>Compliance</option>
                            <option>Training</option>
                            <option>General</option>
                        </select>
                    </div>
                    {/* Optional: Add Admin "Add Notice" button here */}
                 </div>
             </div>

             {/* Loading State Indicator */}
             {isLoading && (
                <div className="text-center p-10 text-gray-500">
                    <i className="fas fa-spinner fa-spin text-3xl text-[--brand-purple]"></i>
                    <p className="mt-2">Loading Notices...</p>
                </div>
             )}

             {/* Error Message Display */}
             {!isLoading && error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
             )}

             {/* Notice List Display */}
             {!isLoading && !error && (
                <div className="space-y-6">
                    {/* Handle case where notices array is empty */}
                    {notices.length === 0 ? (
                        <p className="text-center text-gray-500 py-10">No notices found matching your criteria.</p>
                    ) : (
                        // Map over the notices array to display each notice
                        notices.map(notice => (
                            <div key={notice.id} className={`bg-white rounded-lg shadow p-5 border animate-on-scroll ${notice.isImportant ? 'border-l-4 border-red-500' : 'border-gray-100'}`}>
                                <div className="flex justify-between items-start mb-2 gap-4">
                                    <div>
                                        {/* Notice Title */}
                                        <h2 className="text-lg font-semibold text-[--brand-purple]">{notice.title}</h2>
                                        {/* Metadata */}
                                        <p className="text-xs text-gray-500">
                                            Posted on: {formatDate(notice.createdAt)} by {notice.postedBy || 'Admin'} | Category: <span className="font-medium">{notice.category || 'General'}</span>
                                        </p>
                                    </div>
                                    {/* Important Flag */}
                                    {notice.isImportant && (
                                        <span className="flex-shrink-0 text-xs font-bold text-red-600 uppercase bg-red-100 px-2 py-0.5 rounded">Important</span>
                                    )}
                                </div>
                                {/* Notice Content */}
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {notice.content}
                                </p>
                            </div>
                        ))
                    )}
                </div>
             )}

             {/* Optional Pagination */}
             {/* <div className="mt-8 text-center"> ... </div> */}
        </div>
    );
};

// If saving as a separate file:
export default NoticeBoardPage;
