import React, { useState } from 'react';
// Adjust the import path based on your file structure
import Button from '../common/Button';

// Assume themeColors is available globally or define needed ones here
const themeColors = {
    brandPurple: '#5a239e',
    brandPurpleHover: '#703abc',
    green500: '#22c55e',
    yellow600: '#ca8a04', // Example for status color
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
};

// Props:
// - clientName: string - Name of the client
// - referralLink: string - The unique referral link for this client
// - referredLeads: array - List of leads referred by this client (e.g., [{ name: 'Amit Singh', status: 'Contacted' }])
const ClientReferralTools = ({ clientName = "Client", referralLink = "#", referredLeads = [] }) => {
    const [linkCopied, setLinkCopied] = useState(false);
    const [isSendingEmail, setIsSendingEmail] = useState(false); // Loading state for email

    // Function to copy the referral link to clipboard
    const handleCopyLink = () => {
        navigator.clipboard.writeText(referralLink).then(() => {
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2500); // Reset after 2.5 seconds
        }).catch(err => {
            console.error('Failed to copy referral link: ', err);
            alert('Failed to copy link.'); // Basic error feedback
        });
    };

    // Function to simulate sending the referral invite via email
    const handleSendEmail = async () => {
        setIsSendingEmail(true);
        console.log(`Simulating sending referral email for ${clientName} with link ${referralLink}`);

        // TODO: Replace with actual API call to your backend endpoint
        // This endpoint would likely take clientId or referralLink and trigger an email
        // Example:
        // try {
        //   const token = localStorage.getItem('authToken');
        //   const response = await fetch('/api/clients/send-referral-invite', { // Example endpoint
        //     method: 'POST',
        //     headers: {
        //          'Content-Type': 'application/json',
        //          'Authorization': `Bearer ${token}`
        //      },
        //     body: JSON.stringify({ clientId: /* pass client ID if needed */, referralLink })
        //   });
        //   if (!response.ok) {
        //      const errData = await response.json();
        //      throw new Error(errData.error || 'Failed to send email');
        //   }
        //   alert('Referral email sent successfully!');
        // } catch (error) {
        //   console.error("Send email error:", error);
        //   alert(`Error sending email: ${error.message}`);
        // } finally {
        //   setIsSendingEmail(false);
        // }

        // Simulate API call delay for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSendingEmail(false);
        alert('Referral email sent successfully! (Simulation)'); // Placeholder success feedback
    };

    return (
        // Card container for the referral tools
        <div
            className="bg-white rounded-lg shadow p-6 border border-gray-200"
            // Pass CSS variables needed by Button component if using arbitrary values there
            style={{
                '--brand-purple': themeColors.brandPurple,
                '--brand-purple-hover': themeColors.brandPurpleHover
             }}
        >
            <h3 className="text-lg font-semibold text-[--brand-purple] mb-4">
                <i className="fas fa-share-alt mr-2"></i> Client Referral Tools
            </h3>
            <p className="text-sm text-gray-600 mb-4">
                Encourage {clientName} to refer new clients using their unique link.
            </p>

            {/* Referral Link Display & Copy */}
            <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Unique Referral Link:</label>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        readOnly
                        value={referralLink}
                        className="flex-grow px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[--brand-purple]"
                        aria-label="Referral Link"
                    />
                    <button
                        onClick={handleCopyLink}
                        title="Copy Link"
                        className="p-2 border border-gray-300 rounded-md bg-white text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[--brand-purple]"
                    >
                        {/* Dynamically change icon based on copied state */}
                        <i className={`fas ${linkCopied ? 'fa-check text-green-500' : 'fa-copy'} w-4 h-4`} style={{'--brand-purple': themeColors.brandPurple, '--green-500': themeColors.green}}></i>
                    </button>
                </div>
                {linkCopied && <p className="text-xs text-green-600 mt-1">Link copied!</p>}
            </div>

            {/* Share Actions */}
            <div className="flex space-x-3 mb-6">
                <Button
                    onClick={handleSendEmail}
                    disabled={isSendingEmail}
                    variant="brand"
                    className="px-3 py-1.5 text-xs" // Smaller button
                >
                    <i className={`fas ${isSendingEmail ? 'fa-spinner fa-spin' : 'fa-envelope'} w-4 h-4 mr-2`}></i>
                    {isSendingEmail ? 'Sending...' : 'Email Invite to Client'}
                </Button>
                {/* Placeholder for potential SMS button */}
                {/* <Button variant="outlineSm" className="text-xs"> <i className="fas fa-comment-sms w-4 h-4 mr-2"></i> Send SMS Invite </Button> */}
            </div>

            {/* Referred Leads List (Optional) */}
            <div>
                <h4 className="text-sm font-medium text-gray-800 mb-2">Leads Referred by {clientName}:</h4>
                {referredLeads.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No referrals yet.</p>
                ) : (
                    <ul className="space-y-1 list-disc list-inside text-sm">
                        {/* Map over the referredLeads array passed as prop */}
                        {referredLeads.map((lead, index) => (
                            <li key={index} className="text-gray-700">
                                {lead.name} -
                                {/* Example status styling */}
                                <span className={`ml-1 text-xs font-medium ${lead.status === 'Converted' ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {lead.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ClientReferralTools;
