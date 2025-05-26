import React, { useState, useEffect, useCallback } from 'react';
import ImageGenerator from '../components/marketing/ImageGenerator'; // Import the new component

// Assume themeColors and helper functions are defined or imported
const themeColors = { brandPurple: '#7c3aed', brandPurpleHover: '#6d28d9' };

const MarketingPage = () => {
    // State for the remaining data list
    const [contentItems, setContentItems] = useState([]);

    // State for loading/error
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch only the content library data
    const fetchContentData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem('authToken');
        if (!token) {
            setError("Authentication error: Not logged in.");
            setIsLoading(false);
            return;
        }

        const headers = { 'Authorization': `Bearer ${token}` };
        const url = 'https://api.goclientwise.com/api/marketing/content';

        try {
            const response = await fetch(url, { headers });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || `Error fetching content: ${response.status}`);
            }
            const data = await response.json();
            setContentItems(data || []);
        } catch (err) {
            console.error(`Failed to fetch content:`, err);
            setError(err.message || 'Failed to load content library.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContentData(); // Initial fetch
    }, [fetchContentData]);

    const handleDownloadContent = (url) => {
        if (url) window.open(url, '_blank');
        else alert('No URL available');
    };

    // --- Main Render ---
    return (
        <div className="space-y-8" style={{ '--brand-purple': themeColors.brandPurple, '--brand-purple-hover': themeColors.brandPurpleHover }}>
            {/* Display general error non-fatally */}
            {error && <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded relative m-4 text-sm" role="alert"><strong className="font-bold">Warning: </strong><span className="block sm:inline">{error}</span></div>}

            {/* --- AI Image Generator Section --- */}
            <ImageGenerator />

            {/* --- Content Library Section (Kept as a place to view assets) --- */}
            <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-[--brand-purple] mb-4 pb-4 border-b">
                    <i className="fas fa-photo-video mr-2"></i>Content Library
                </h2>
                <p className="text-sm text-gray-600 mb-4">Your saved and generated media assets.</p>

                {isLoading ? (
                     <div className="text-center p-6 text-gray-500"><i className="fas fa-spinner fa-spin text-2xl text-[--brand-purple]"></i><p className="mt-2 text-sm">Loading Content...</p></div>
                ) : contentItems.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No content available.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {contentItems.map(item => (
                            <div key={item.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                <img
                                    src={item.thumbnailUrl?.String || `https://placehold.co/300x150/cccccc/ffffff?text=${item.contentType}`}
                                    alt={item.title}
                                    className="w-full h-24 object-cover bg-gray-100"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/300x150/cccccc/ffffff?text=Error'; }}
                                />
                                <div className="p-3">
                                    <h4 className="text-sm font-medium mb-1 truncate" title={item.title}>{item.title}</h4>
                                    <p className="text-xs text-gray-500 mb-2">{item.contentType}</p>
                                    <button
                                        onClick={() => handleDownloadContent(item.gcsUrl)}
                                        className="text-xs text-purple-600 hover:underline disabled:text-gray-400 disabled:no-underline"
                                        disabled={!item.gcsUrl}
                                    >
                                        {item.gcsUrl ? 'View/Download' : 'No Link'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketingPage;