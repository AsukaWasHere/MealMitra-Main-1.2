import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from './api';

export default function Donate() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        quantity: '',
        location: '',
        price: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [quality, setQuality] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');
    const [uploadError, setUploadError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setUploadError('Please upload a valid image file.');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('Image size must be less than 5MB.');
            return;
        }

        setUploadError('');
        setImageFile(file);
        setQuality(null);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Analyze image quality
        setIsAnalyzing(true);
        try {
            // Convert to base64
            const base64 = await fileToBase64(file);
            
            const response = await API.post('/api/ai/analyze-image', {
                imageBase64: base64.split(',')[1], // Remove data:image/jpeg;base64, prefix
                mimeType: file.type
            });

            if (response.data.success) {
                setQuality(response.data.quality);
                if (!response.data.canPost) {
                    setError('Food quality is not acceptable for donation. Please upload a better quality image.');
                } else {
                    setError('');
                }
            }
        } catch (err) {
            console.error('Image analysis error:', err);
            setUploadError('Failed to analyze image. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Check if image is uploaded
        if (!imageFile) {
            setError('Please upload an image of the food.');
            return;
        }

        // Check if quality is acceptable
        if (quality === 'Not Consumable') {
            setError('Food quality is not acceptable for donation. Please upload a better quality image.');
            return;
        }

        if (!quality || (quality !== 'Best Quality' && quality !== 'Good Quality')) {
            setError('Please wait for image analysis to complete.');
            return;
        }

        try {
            // Convert image to base64
            const base64 = await fileToBase64(imageFile);
            
            await API.post('/api/listings', {
                ...formData,
                quantity: Number(formData.quantity),
                price: Number(formData.price),
                imageUrl: base64, // Store base64 image
                quality: quality
            });
            
            alert('✅ Donation posted successfully!');
            navigate('/');
        } catch (err) {
            const message = err.response?.data?.message || "Failed to post donation.";
            setError(message);
        }
    };

    const getQualityColor = () => {
        if (quality === 'Best Quality') return 'text-green-600 bg-green-50 border-green-300';
        if (quality === 'Good Quality') return 'text-yellow-600 bg-yellow-50 border-yellow-300';
        if (quality === 'Not Consumable') return 'text-red-600 bg-red-50 border-red-300';
        return '';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 flex items-center justify-center p-4 py-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-2xl border border-green-100">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                        Post a Donation
                    </h2>
                    <p className="text-gray-600 text-lg">Share your surplus food with those in need</p>
                </div>

                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                    {/* Image Upload Section */}
                    <div className="space-y-3">
                        <label className="block text-lg font-semibold text-gray-700">
                            Food Image <span className="text-red-500">*</span>
                        </label>
                        <div className="border-2 border-dashed border-green-300 rounded-2xl p-6 bg-gradient-to-br from-green-50 to-emerald-50 hover:border-green-400 transition-all duration-300">
                            {!imagePreview ? (
                                <label className="flex flex-col items-center justify-center cursor-pointer">
                                    <div className="text-5xl mb-3">📸</div>
                                    <span className="text-green-700 font-medium">Click to upload food image</span>
                                    <span className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        required
                                    />
                                </label>
                            ) : (
                                <div className="space-y-4">
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Food preview"
                                            className="w-full h-64 object-cover rounded-xl shadow-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImageFile(null);
                                                setImagePreview(null);
                                                setQuality(null);
                                                setError('');
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    
                                    {isAnalyzing && (
                                        <div className="flex items-center justify-center gap-3 text-blue-600">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                            <span className="font-medium">Analyzing food quality...</span>
                                        </div>
                                    )}

                                    {quality && (
                                        <div className={`border-2 rounded-xl p-4 ${getQualityColor()}`}>
                                            <div className="flex items-center justify-between">
                                                <span className="font-semibold text-lg">Quality Assessment:</span>
                                                <span className="font-bold text-xl">{quality}</span>
                                            </div>
                                            {quality === 'Not Consumable' && (
                                                <p className="text-sm mt-2 text-red-700">
                                                    This food cannot be posted. Please upload a better quality image.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <input
                                type="text"
                                name="title"
                                placeholder="Food Title (e.g., Bread, Rice, Curry)"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-lg"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <textarea
                                name="description"
                                placeholder="Description (Optional)"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-lg resize-none"
                            />
                        </div>

                        <div>
                            <input
                                type="number"
                                name="quantity"
                                placeholder="Quantity (servings/items)"
                                value={formData.quantity}
                                onChange={handleChange}
                                min="1"
                                className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-lg"
                                required
                            />
                        </div>

                        <div>
                            <input
                                type="number"
                                name="price"
                                placeholder="Price per serving (₹)"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-lg"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <input
                                type="text"
                                name="location"
                                placeholder="Full Pickup Address"
                                value={formData.location}
                                onChange={handleChange}
                                className="w-full border-2 border-gray-200 rounded-xl px-5 py-3.5 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 text-lg"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                            <p className="text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isAnalyzing || quality === 'Not Consumable' || !imageFile}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
                            isAnalyzing || quality === 'Not Consumable' || !imageFile
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:shadow-xl transform hover:scale-[1.02]'
                        }`}
                    >
                        {isAnalyzing ? 'Analyzing Image...' : 'Post Donation'}
                    </button>
                </form>
            </div>
        </div>
    );
}
