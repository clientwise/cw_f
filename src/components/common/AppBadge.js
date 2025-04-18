import React from 'react';

// Placeholder SVG Badges
export const AppStoreBadge = ({ className = "h-12" }) => (
  <svg className={className} viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="40" rx="5" fill="#1f2937"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M21.8413 14.1151C21.8413 12.2702 23.2558 11.335 25.292 11.335C27.313 11.335 28.7072 12.2854 28.7072 14.1151C28.7072 16.0005 27.3537 16.9051 25.3072 16.9051C23.2761 16.9051 21.8413 15.9853 21.8413 14.1151ZM18.949 14.1151C18.949 17.4013 21.6182 19.5 25.3072 19.5C28.9962 19.5 31.6654 17.4013 31.6654 14.1151C31.6654 10.8441 29.0266 8.75 25.292 8.75C21.5878 8.75 18.949 10.8289 18.949 14.1151Z" fill="white"/>
    <text x="45" y="25" fontFamily="Arial, sans-serif" fontSize="10" fill="white">Download on the</text>
    <text x="45" y="15" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="white">App Store</text>
  </svg>
);

export const GooglePlayBadge = ({ className = "h-12" }) => (
   <svg className={className} viewBox="0 0 135 40" fill="none" xmlns="http://www.w3.org/2000/svg">
     <rect width="135" height="40" rx="5" fill="#1f2937"/>
     <path d="M18.8001 11.3199L26.0667 15.4666L18.8001 19.6132L18.8001 11.3199ZM17.0667 9.11987V25.8132C17.0667 26.7199 17.9934 27.2865 18.7934 26.8465L30.2 20.4999C30.9934 20.0532 30.9934 18.8799 30.2 18.4332L18.7934 12.0865C17.9934 11.6465 17.0667 12.2132 17.0667 13.1199V13.1199L17.0667 9.11987Z" fill="white"/>
     <text x="45" y="16" fontFamily="Arial, sans-serif" fontSize="9" fill="white">GET IT ON</text>
     <text x="45" y="29" fontFamily="Arial, sans-serif" fontSize="14" fontWeight="bold" fill="white">Google Play</text>
   </svg>
);
