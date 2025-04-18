import React, { useState } from 'react';
import Button from '../components/common/Button'; // Adjust path if needed

// Assume themeColors is available globally or via context/props
const themeColors = {
    brandPurple: '#5a239e', brandPurpleHover: '#703abc',
    yellow500: '#f59e0b', gray200: '#e5e7eb', gray400: '#9ca3af',
    gray500: '#6b7280', gray700: '#374151', gray800: '#1f2937',
    red100: '#fee2e2', red700: '#b91c1c', green100: '#dcfce7', green700: '#047857',
};

const RatingAspects = [
    { id: 'easeOfUse', label: 'Ease of Use' },
    { id: 'features', label: 'Features & Functionality' },
    { id: 'value', label: 'Value for Money' },
    { id: 'support', label: 'Customer Support' },
    { id: 'performance', label: 'Speed & Performance' },
];

const GrowPage = () => {
    const [feedback, setFeedback] = useState('');
    const [ratings, setRatings] = useState({}); // Store ratings as { aspectId: ratingValue }
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    const [feedbackError, setFeedbackError] = useState('');
    const [feedbackSuccess, setFeedbackSuccess] = useState('');
    const [isSubmittingRating, setIsSubmittingRating] = useState(false);
    const [ratingError, setRatingError] = useState('');
    const [ratingSuccess, setRatingSuccess] = useState('');

    const handleRatingChange = (aspectId, value) => {
        setRatings(prev => ({ ...prev, [aspectId]: value }));
    };

    const handleReferralClick = () => {
        // TODO: Implement referral link generation/copy or show info
        alert('Referral Program details coming soon!');
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        if (!feedback.trim()) { setFeedbackError('Please enter your feedback.'); return; }
        setIsSubmittingFeedback(true); setFeedbackError(''); setFeedbackSuccess('');
        console.log("Submitting Feedback (Simulation):", feedback);
        // TODO: Replace with actual API call: POST /api/feedback
        await new Promise(resolve => setTimeout(resolve, 700));
        setIsSubmittingFeedback(false);
        setFeedbackSuccess('Thank you for your feedback!');
        setFeedback(''); // Clear textarea
        // Handle potential API errors here
    };

    const handleRatingSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(ratings).length !== RatingAspects.length) {
            setRatingError('Please rate all aspects.'); return;
        }
        setIsSubmittingRating(true); setRatingError(''); setRatingSuccess('');
        console.log("Submitting Ratings (Simulation):", ratings);
        // TODO: Replace with actual API call: POST /api/ratings
        await new Promise(resolve => setTimeout(resolve, 700));
        setIsSubmittingRating(false);
        setRatingSuccess('Thank you for rating ClientWise!');
        // Optionally disable rating after submission?
    };

    return (
        <div style={{'--brand-purple': themeColors.brandPurple}}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Grow with ClientWise</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column: Referrals & Feedback */}
                <div className="space-y-8">
                    {/* Referral Section */}
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-[--brand-purple] mb-3"><i className="fas fa-share-alt mr-2"></i>Refer & Earn</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Love using ClientWise? Share it with fellow agents and advisors! We appreciate your support in helping our community grow.
                            (Referral program details and rewards coming soon!)
                        </p>
                        <Button onClick={handleReferralClick} variant="outlineSm" className="text-purple-700 border-purple-300 hover:bg-purple-50">
                            Get Your Referral Link (Coming Soon)
                        </Button>
                    </div>

                    {/* Feedback Section */}
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-[--brand-purple] mb-3"><i className="fas fa-comment-dots mr-2"></i>Share Your Feedback</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Have ideas for new features or suggestions for improvement? We'd love to hear from you!
                        </p>
                        <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                            {feedbackError && <p className="text-xs text-red-600">{feedbackError}</p>}
                            {feedbackSuccess && <p className="text-xs text-green-600">{feedbackSuccess}</p>}
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows="5"
                                className="block w-full form-textarea rounded-md shadow-sm focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm"
                                placeholder="Enter your suggestions, feature requests, or any other feedback here..."
                            />
                            <Button type="submit" variant="brand" disabled={isSubmittingFeedback} className="w-full sm:w-auto">
                                {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Rating */}
                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                     <h3 className="text-lg font-semibold text-[--brand-purple] mb-3"><i className="fas fa-star mr-2"></i>Rate Your Experience</h3>
                     <p className="text-sm text-gray-600 mb-4">
                        Help us understand what you value most by rating different aspects of ClientWise (1 = Poor, 5 = Excellent).
                    </p>
                    <form onSubmit={handleRatingSubmit} className="space-y-4">
                         {ratingError && <p className="text-xs text-red-600 mb-2">{ratingError}</p>}
                         {ratingSuccess && <p className="text-xs text-green-600 mb-2">{ratingSuccess}</p>}
                        {RatingAspects.map(aspect => (
                            <div key={aspect.id}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{aspect.label}</label>
                                <div className="flex space-x-1">
                                    {[1, 2, 3, 4, 5].map(value => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => handleRatingChange(aspect.id, value)}
                                            className={`w-8 h-8 rounded border transition-colors duration-150 ${
                                                ratings[aspect.id] === value
                                                    ? 'bg-yellow-400 border-yellow-500 text-white'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-yellow-50'
                                            }`}
                                        >
                                            {value}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                         <Button type="submit" variant="brand" disabled={isSubmittingRating} className="w-full sm:w-auto mt-4">
                            {isSubmittingRating ? 'Submitting...' : 'Submit Ratings'}
                        </Button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default GrowPage;
