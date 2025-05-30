import React, { useState } from 'react';
import Button from '../common/Button'; // Adjust path if needed

// --- Configuration ---
// Paste your API key from Google AI Studio here
const API_KEY = 'AIzaSyD9fhI0nZlTwkfQ-0rm2p-s23AUJdLlSjI';

// The specific Gemini model that can generate images
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;


const ImageGenerator = () => {
    // State for the form inputs
    const [description, setDescription] = useState('');
    const [occasion, setOccasion] = useState('General Marketing');
    const [colorTheme, setColorTheme] = useState('Vibrant & Energetic');
    const [style, setStyle] = useState('Photorealistic');

    // State for the API call
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [generatedImage, setGeneratedImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description) {
            setError('Please enter a description for the image.');
            return;
        }
        if (API_KEY === 'YOUR_GEMINI_API_KEY') {
            setError('Please replace "YOUR_GEMINI_API_KEY" in the code with your actual key.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        // Construct a detailed prompt from the user's selections
  const finalPrompt = `
      Create a stunning, high-resolution image perfect for an insurance marketing campaign.
    The visual should evoke feelings of trust, security, and peace of mind.
    It must be appropriate for all audiences (SFW) and convey a positive, inviting atmosphere.

    Crucially, the image must contain **ZERO text**. This includes no words, no letters, no numbers, no symbols, no logos, no watermarks, and no discernible typography of any kind. The focus should be purely on the visual composition.

    Consider these elements for generation:   
    - Art Style: ${style}.
    - Occasion/Theme: ${occasion}.
    - Color Palette: ${colorTheme}.
    - Core Subject: ${description}.
`;
        // Structure the request body according to the Gemini API specification
        const requestBody = {
            "contents": [
                { "parts": [{ "text": finalPrompt }] }
            ],
         
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const responseData = await response.json();
            console.log("API Ressponse:", responseData);
            if (!response.ok) {
                // Handle errors from the API
                const errorDetails = responseData.error?.message || 'An unknown error occurred.';
                throw new Error(errorDetails);
            }
            
            // Extract the base64 image data from the response
            const base64ImageData = responseData.candidates?.[0]?.content?.parts?.[0]?.blob?.data;

            if (!base64ImageData) {
                throw new Error("Image data was not found in the API response.");
            }

            const imageUrl = `data:image/png;base64,${base64ImageData}`;
            setGeneratedImage({ url: imageUrl, alt: description });

        } catch (err) {
            console.error("API Call Failed:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-[--brand-purple] mb-4 pb-4 border-b">
                <i className="fas fa-magic mr-2"></i>AI Image Generator
            </h2>


            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Image Description <span className="text-red-500">*</span>
                        </label>
                        <p className="text-xs text-gray-500 mb-2">Describe the main subject of the image (e.g., "a family celebrating a new home," "a business owner reviewing documents").</p>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                            placeholder="e.g., A smiling couple holding keys to their new car"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="occasion" className="block text-sm font-medium text-gray-700 mb-1">Occasion</label>
                        <select id="occasion" value={occasion} onChange={(e) => setOccasion(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                            <option>General Marketing</option>
                            <option>Holiday Greeting</option>
                            <option>New Policy Welcome</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="colorTheme" className="block text-sm font-medium text-gray-700 mb-1">Color Theme</label>
                        <select id="colorTheme" value={colorTheme} onChange={(e) => setColorTheme(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                            <option>Vibrant & Energetic</option>
                            <option>Warm & Welcoming</option>
                            <option>Cool & Professional</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-1">Art Style</label>
                        <select id="style" value={style} onChange={(e) => setStyle(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
                            <option>Photorealistic</option>
                            <option>Digital Illustration</option>
                            <option>Watercolor</option>
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-end">
                    <Button type="submit" variant="brand" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <i className="fas fa-spinner fa-spin mr-2" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-check mr-2" />
                                Generate Image
                            </>
                        )}
                    </Button>
                </div>
            </form>

            <div className="mt-6">
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm" role="alert"><strong className="font-bold">Error: </strong> {error}</div>}
                
                {generatedImage && (
                    <div className="border rounded-lg p-4 bg-gray-50 text-center">
                         <h3 className="text-md font-semibold text-gray-800 mb-2">Generation Complete:</h3>
                        <img
                            src={generatedImage.url}
                            alt={generatedImage.alt}
                            className="rounded-md w-full max-w-lg mx-auto shadow-md"
                        />
                         <div className="mt-4 flex justify-center space-x-4">
                            <a href={generatedImage.url} download="generated-image.png">
                                <Button variant="outlineSm">Download</Button>
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageGenerator;