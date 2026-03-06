import React, { useState, useRef } from 'react';
import { X, Sparkles, Type, FileImage, Upload, MapPin, CheckCircle2, Loader2 } from 'lucide-react';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    darkMode?: boolean;
    onSubmit?: (data: any, file?: File | null) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
    isOpen,
    onClose,
    darkMode = false,
    onSubmit
}) => {
    const [caption, setCaption] = useState('');
    const [location, setLocation] = useState('');
    const [activeImageTab, setActiveImageTab] = useState<'upload' | 'url'>('upload');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Theme classes
    const overlay = darkMode ? 'bg-black/50' : 'bg-amber-950/20';
    const card = darkMode
        ? 'bg-gray-900 border-gray-800'
        : 'bg-white/95 backdrop-blur-sm border-amber-200';
    const divider = darkMode ? 'border-gray-800' : 'border-amber-100';
    const heading = darkMode ? 'text-white' : 'text-amber-900';
    const label = darkMode ? 'text-gray-300' : 'text-amber-800';
    const subtext = darkMode ? 'text-gray-500' : 'text-amber-600';
    const input = darkMode
        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-amber-500'
        : 'bg-white border-amber-200 text-gray-900 placeholder-amber-400 focus:ring-amber-500';
    
    const tabActive = darkMode
        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
        : 'bg-amber-200 text-amber-800 border-amber-300';
    const tabInactive = darkMode
        ? 'text-gray-400 border-transparent hover:text-amber-400'
        : 'text-amber-600 border-transparent hover:text-amber-800';

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleReset = () => {
        setImageFile(null);
        setImagePreview(null);
        setImageUrl('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async () => {
        if (!caption.trim()) return;

        setIsLoading(true);
        
        const postData = {
            caption,
            location: location || undefined,
            imageUrl: activeImageTab === 'url' ? imageUrl : undefined,
        };

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));
            
            if (onSubmit) {
                await onSubmit(postData, imageFile);
            }
            
            setSubmitted(true);
            
            // Reset form after success
            setTimeout(() => {
                setSubmitted(false);
                setIsLoading(false);
                setCaption('');
                setLocation('');
                setImageFile(null);
                setImagePreview(null);
                setImageUrl('');
                setActiveImageTab('upload');
                onClose();
            }, 1500);
            
        } catch (error) {
            console.error('Error creating post:', error);
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${overlay} backdrop-blur-sm`}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className={`relative w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden ${card} transition-all`}
                style={{
                    boxShadow: darkMode
                        ? "0 25px 60px rgba(0,0,0,0.6)"
                        : "0 25px 60px rgba(180,83,9,0.15)",
                }}
            >
                {/* Decorative top bar */}
                <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400" />

                {/* Header */}
                <div className={`flex items-center justify-between px-6 py-4 border-b ${divider}`}>
                    <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg ${darkMode ? "bg-amber-500/20" : "bg-amber-100"}`}>
                            <Sparkles size={16} className={darkMode ? "text-amber-400" : "text-amber-600"} />
                        </div>
                        <h2 className={`text-lg font-semibold tracking-tight ${heading}`}>Create Post</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-xl transition-all ${
                            darkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-amber-50 text-amber-500"
                        }`}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">

                    {/* Caption */}
                    <div className="space-y-1.5">
                        <label className={`text-sm font-medium flex items-center gap-1.5 ${label}`}>
                            <Type size={13} />
                            Caption <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="What's on your mind? Share your story..."
                            rows={3}
                            className={`w-full px-4 py-3 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 transition-all ${input}`}
                        />
                        <div className={`text-xs text-right ${subtext}`}>{caption.length} chars</div>
                    </div>

                    {/* Image Section */}
                    <div className="space-y-2">
                        <label className={`text-sm font-medium flex items-center gap-1.5 ${label}`}>
                            <FileImage size={13} />
                            Image <span className={`text-xs font-normal ${subtext}`}>(optional)</span>
                        </label>

                        {/* Tab switcher */}
                        <div className="flex gap-1 p-1 rounded-lg bg-transparent border border-current/10"
                            style={{ borderColor: darkMode ? "#374151" : "#fde68a" }}>
                            {["upload", "url"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => { setActiveImageTab(tab as 'upload' | 'url'); handleReset(); }}
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-md border transition-all capitalize ${
                                        activeImageTab === tab ? tabActive : tabInactive
                                    }`}
                                >
                                    {tab === "upload" ? "📁 Upload File" : "🔗 Image URL"}
                                </button>
                            ))}
                        </div>

                        {activeImageTab === "upload" ? (
                            imagePreview ? (
                                <div className="relative rounded-xl overflow-hidden group">
                                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                            onClick={handleReset}
                                            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-white/30 transition"
                                        >
                                            <X size={14} /> Remove
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={(e) => e.preventDefault()}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`flex flex-col items-center justify-center gap-3 h-36 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                                        darkMode
                                            ? "border-gray-700 hover:border-amber-500/50 hover:bg-amber-500/5"
                                            : "border-amber-200 hover:border-amber-400 hover:bg-amber-50/50"
                                    }`}
                                >
                                    <div className={`p-3 rounded-full ${darkMode ? "bg-gray-800" : "bg-amber-100"}`}>
                                        <Upload size={20} className={darkMode ? "text-amber-400" : "text-amber-500"} />
                                    </div>
                                    <div className="text-center">
                                        <p className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-amber-700"}`}>
                                            Drop image here or click to browse
                                        </p>
                                        <p className={`text-xs mt-0.5 ${subtext}`}>PNG, JPG, WEBP up to 10MB</p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            )
                        ) : (
                            <div className="space-y-2">
                                <input
                                    type="url"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://example.com/image.jpg"
                                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${input}`}
                                />
                                {imageUrl && (
                                    <div className="relative rounded-xl overflow-hidden">
                                        <img
                                            src={imageUrl}
                                            alt="Preview"
                                            className="w-full h-36 object-cover rounded-xl"
                                            onError={(e) => (e.currentTarget.style.display = "none")}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Location */}
                    <div className="space-y-1.5">
                        <label className={`text-sm font-medium flex items-center gap-1.5 ${label}`}>
                            <MapPin size={13} />
                            Location <span className={`text-xs font-normal ${subtext}`}>(optional)</span>
                        </label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Add a location..."
                            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${input}`}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className={`px-6 py-4 border-t flex items-center justify-between gap-3 ${divider}`}>
                    <button
                        onClick={onClose}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            darkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        }`}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!caption.trim() || isLoading || submitted}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed
                            ${submitted
                                ? "bg-green-500"
                                : "bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25"
                            }`}
                    >
                        {submitted ? (
                            <><CheckCircle2 size={16} /> Posted!</>
                        ) : isLoading ? (
                            <><Loader2 size={16} className="animate-spin" /> Posting...</>
                        ) : (
                            <><Sparkles size={16} /> Share Post</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePostModal;