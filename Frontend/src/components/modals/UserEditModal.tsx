import React, { useState, useRef } from 'react';
import { X, User, Camera, Upload, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface IUserData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePic : string;
    token: string;
}
interface UserEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    darkMode?: boolean;
    userData : IUserData;
    onSave?: (data: any) => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({
    isOpen,
    onClose,
    darkMode = false,
    userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        profilePic: ''
    },
    onSave
}) => {
    const [formData, setFormData] = useState({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        profilePic: userData.profilePic || ''
    });
    const [previewImage, setPreviewImage] = useState<string | null>(userData.profilePic || null);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ firstName?: string; lastName?: string }>({});

    const fileInputRef = useRef<HTMLInputElement>(null);

    const modalVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 25
            }
        },
        exit: { opacity: 0, y: 20 }
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
                setFormData(prev => ({ ...prev, profilePic: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setPreviewImage(null);
        setFormData(prev => ({ ...prev, profilePic: '' }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const validateForm = () => {
        const newErrors: { firstName?: string; lastName?: string } = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        return newErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length === 0) {
            setIsLoading(true);
            // Simulate API call
            setTimeout(() => {
                setIsLoading(false);
                if (onSave) {
                    onSave(formData);
                }
                onClose();
            }, 1500);
        } else {
            setErrors(newErrors);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        onClick={onClose}
                        className="fixed inset-0 backdrop-blur-md bg-black/30 z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
                    >
                        <div className={`rounded-2xl shadow-2xl overflow-hidden ${darkMode
                                ? 'bg-gray-900 border border-gray-800'
                                : 'bg-white/95 backdrop-blur-sm border border-amber-200'
                            }`}>
                            {/* Header */}
                            <div className={`flex justify-between items-center p-6 border-b ${darkMode ? 'border-gray-800' : 'border-amber-200'
                                }`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${darkMode ? 'bg-amber-500/20' : 'bg-amber-100'
                                        }`}>
                                        <User size={20} className={darkMode ? 'text-amber-400' : 'text-amber-700'} />
                                    </div>
                                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-amber-900'
                                        }`}>
                                        Edit Profile
                                    </h3>
                                </div>
                                <button
                                    onClick={onClose}
                                    className={`p-2 rounded-lg transition-colors ${darkMode
                                            ? 'hover:bg-gray-800 text-gray-400 hover:text-white'
                                            : 'hover:bg-amber-100 text-amber-600 hover:text-amber-800'
                                        }`}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                {/* Profile Picture */}
                                <div className="flex flex-col items-center">
                                    <div className="relative mb-3">
                                        <div className={`w-24 h-24 rounded-full overflow-hidden border-4 ${darkMode
                                                ? 'border-gray-700 bg-gray-800'
                                                : 'border-amber-200 bg-amber-50'
                                            }`}>
                                            {previewImage ? (
                                                <img
                                                    src={previewImage}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <User size={40} className={darkMode ? 'text-gray-600' : 'text-amber-400'} />
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`absolute bottom-0 right-0 p-2 rounded-full shadow-lg transition-all hover:scale-110 ${darkMode
                                                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                                                    : 'bg-amber-600 text-white hover:bg-amber-700'
                                                }`}
                                        >
                                            <Camera size={16} />
                                        </button>
                                    </div>

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />

                                    {previewImage && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className={`text-sm flex items-center gap-1 mt-2 ${darkMode
                                                    ? 'text-red-400 hover:text-red-300'
                                                    : 'text-red-600 hover:text-red-700'
                                                }`}
                                        >
                                            <Upload size={14} className="rotate-180" />
                                            Remove Photo
                                        </button>
                                    )}
                                </div>

                                {/* First Name */}
                                <div>
                                    <label htmlFor="firstName" className={`block text-sm font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-amber-900'
                                        }`}>
                                        First Name
                                    </label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="Enter first name"
                                        className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${errors.firstName
                                                ? 'border-red-500 focus:ring-red-500'
                                                : darkMode
                                                    ? 'border-gray-700 bg-gray-800 text-white focus:ring-amber-500 focus:border-transparent'
                                                    : 'border-amber-200 bg-white/80 text-gray-800 focus:ring-amber-500 focus:border-transparent'
                                            }`}
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-500 text-xs mt-1 font-medium">{errors.firstName}</p>
                                    )}
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label htmlFor="lastName" className={`block text-sm font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-amber-900'
                                        }`}>
                                        Last Name
                                    </label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Enter last name"
                                        className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all ${errors.lastName
                                                ? 'border-red-500 focus:ring-red-500'
                                                : darkMode
                                                    ? 'border-gray-700 bg-gray-800 text-white focus:ring-amber-500 focus:border-transparent'
                                                    : 'border-amber-200 bg-white/80 text-gray-800 focus:ring-amber-500 focus:border-transparent'
                                            }`}
                                    />
                                    {errors.lastName && (
                                        <p className="text-red-500 text-xs mt-1 font-medium">{errors.lastName}</p>
                                    )}
                                </div>

                                {/* Email (Read-only) */}
                                <div>
                                    <label htmlFor="email" className={`block text-sm font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-amber-900'
                                        }`}>
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className={`w-full px-4 py-3 rounded-xl border opacity-75 cursor-not-allowed ${darkMode
                                                ? 'border-gray-700 bg-gray-900 text-gray-400'
                                                : 'border-amber-200 bg-amber-50/50 text-gray-500'
                                            }`}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${darkMode
                                                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                            }`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-bold rounded-xl hover:from-amber-700 hover:to-yellow-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span>Saving...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Save size={18} />
                                                <span>Save Changes</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default UserEditModal;