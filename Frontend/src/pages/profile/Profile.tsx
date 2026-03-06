import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
    User, Mail, Calendar, Edit2, Camera,
    Heart, MessageCircle, Bookmark, Grid,
    List, MapPin, ChevronLeft, ChevronRight,
    Upload, X,
    Settings
} from 'lucide-react';
import type { RootState } from '../../redux/store';
import Navbar from '../../components/Navbar';
import { editProfile } from '../../api/user/userApi';
import { addUser } from '../../redux/user/userSlice';
import UserEditModal from '../../components/modals/UserEditModal';
import CreatePostModal from '../../components/modals/CreatePostModal';
// import { editProfile } from '../api/user/userApi';
// import { addUser } from '../redux/user/userSlice';

interface UserPost {
    id: string;
    image: string;
    likes: number;
    comments: number;
    caption: string;
}

interface ProfilePageProps {
    darkMode: boolean;
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ darkMode, setDarkMode }) => {
    const user = useSelector((state: RootState) => state.auth);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const dispatch = useDispatch();

    // State for edit mode
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
    });
    const [profileFile, setProfileFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(user?.profilePic || null);
    const [isLoading, setIsLoading] = useState(false);

    // State for posts view
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
    const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

    // Mock user posts data
    const [userPosts, setUserPosts] = useState<UserPost[]>([])


    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Handle edit mode
    // const handleEditToggle = () => {
    //     if (isEditing) {
    //         // Cancel editing
    //         setEditedData({
    //             firstName: user?.firstName || '',
    //             lastName: user?.lastName || '',
    //             email: user?.email || '',
    //         });
    //         setPreviewImage(user?.profilePic || null);
    //         setProfileFile(null);
    //     }
    //     setIsEditing(!isEditing);
    // };

    const handleSaveUserData = async (data: any, imageFile?: File | null) => {
        try {

            const response = await editProfile(user.id, data, imageFile || undefined);
            if (response) {
                dispatch(addUser({
                    id: response.id,
                    firstName: response.firstName,
                    lastName: response.lastName,
                    email: response.email,
                    profilePic: response.profilePic,
                    token: user.token
                }));
            }


        } catch (error) {
            console.error('Error saving user data:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setPreviewImage(null);
        setProfileFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // const handleSaveProfile = async () => {
    //     setIsLoading(true);
    //     try {
    //         const response = await editProfile(user.id, editedData, profileFile || undefined);
    //         if (response) {
    //             dispatch(addUser({
    //                 id: response.id,
    //                 firstName: response.firstName,
    //                 lastName: response.lastName,
    //                 email: response.email,
    //                 profilePic: response.profilePic,
    //                 token: user.token
    //             }));
    //             setIsEditing(false);
    //         }
    //     } catch (error) {
    //         console.error('Error saving profile:', error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

      const handleCreatePostSubmit = async (data: any, file?: File | null) => {
        // Handle post submission
        console.log('Post data:', data, 'File:', file);
    };

    // Theme classes
    const bgClass = darkMode
        ? 'bg-gray-950 text-gray-100'
        : 'bg-gradient-to-b from-amber-50 via-yellow-50 to-orange-50 text-gray-900';

    const cardClass = darkMode
        ? 'bg-gray-900 border-gray-800'
        : 'bg-white/80 backdrop-blur-sm border-amber-100';

    const textClass = darkMode ? 'text-gray-300' : 'text-amber-800';
    const headingClass = darkMode ? 'text-white' : 'text-amber-900';
    const subtextClass = darkMode ? 'text-gray-400' : 'text-amber-700';
    const inputClass = darkMode
        ? 'bg-gray-800 border-gray-700 text-white focus:ring-amber-500'
        : 'bg-white/80 border-amber-200 text-gray-900 focus:ring-amber-500';
    const buttonClass = darkMode
        ? 'bg-gray-800 text-amber-400 hover:bg-gray-700'
        : 'bg-amber-100 text-amber-700 hover:bg-amber-200';
    const activeButtonClass = darkMode
        ? 'bg-amber-500/20 text-amber-400'
        : 'bg-amber-200 text-amber-800';

    return (
        <>

            <div className={`min-h-screen pb-12 ${bgClass} transition-colors duration-300`}>
                <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
                <div className="max-w-5xl mx-auto px-4 pt-8">

                    {/* Profile Header */}
                    <div className={`rounded-2xl border ${cardClass} shadow-xl overflow-hidden mb-8`}>

                        {/* Cover Photo Placeholder */}
                        <div className={`h-32 w-full ${darkMode ? 'bg-gray-800' : 'bg-amber-200/50'}`} />

                        {/* Profile Info */}
                        <div className="relative px-6 pb-6">
                            {/* Profile Picture */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16">
                                <div className="relative">
                                    <div className={`w-32 h-32 rounded-full border-4 overflow-hidden ${darkMode ? 'border-gray-900' : 'border-white'
                                        }`}>
                                        {previewImage ? (
                                            <img
                                                src={previewImage}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className={`w-full h-full flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-amber-100'
                                                }`}>
                                                <User size={40} className={darkMode ? 'text-gray-600' : 'text-amber-400'} />
                                            </div>
                                        )}
                                    </div>


                                    {isEditing && (
                                        <>
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className={`absolute bottom-0 right-0 p-2 rounded-full shadow-lg ${darkMode
                                                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                                                    : 'bg-amber-600 text-white hover:bg-amber-700'
                                                    }`}
                                            >
                                                <Camera size={16} />
                                            </button>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleImageUpload}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </>
                                    )}
                                </div>

                                {/* User Name and Edit Button */}
                                <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        {isEditing ? (
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={editedData.firstName}
                                                    onChange={handleInputChange}
                                                    placeholder="First Name"
                                                    className={`px-3 py-2 rounded-lg border ${inputClass} focus:ring-2 focus:outline-none`}
                                                />
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={editedData.lastName}
                                                    onChange={handleInputChange}
                                                    placeholder="Last Name"
                                                    className={`px-3 py-2 rounded-lg border ${inputClass} focus:ring-2 focus:outline-none`}
                                                />
                                            </div>
                                        ) : (
                                            <h1 className={`text-3xl font-bold ${headingClass}`}>
                                                {user?.firstName} {user?.lastName}
                                            </h1>
                                        )}
                                        <div className={`flex items-center gap-2 mt-1 ${subtextClass}`}>
                                            <Mail size={16} />
                                            <span>{user?.email}</span>
                                        </div>
                                    </div>

                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditModalOpen(true)}
                                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${darkMode
                                                ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                                                : 'bg-amber-200 text-amber-800 hover:bg-amber-300'
                                                }`}
                                        >
                                            <Settings size={18} />
                                            
                                        </button>
                                    ) : (
                                        <div className="flex gap-2">
                                            <button
                                                // onClick={handleEditToggle}
                                                className={`px-4 py-2 rounded-lg ${buttonClass}`}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                // onClick={handleSaveProfile}
                                                disabled={isLoading}
                                                className={`px-4 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-medium hover:from-amber-700 hover:to-yellow-700 disabled:opacity-50`}
                                            >
                                                {isLoading ? 'Saving...' : 'Save'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-8 mt-6 pt-4 border-t border-amber-200/30">
                                <div className="text-center">
                                    <div className={`text-2xl font-bold ${headingClass}`}>156</div>
                                    <div className={`text-sm ${subtextClass}`}>Posts</div>
                                </div>

                                <div className="text-center">
                                    <div className={`text-2xl font-bold ${headingClass}`}>2.3k</div>
                                    <div className={`text-sm ${subtextClass}`}>Followers</div>
                                </div>

                                <div className="text-center">
                                    <div className={`text-2xl font-bold ${headingClass}`}>482</div>
                                    <div className={`text-sm ${subtextClass}`}>Following</div>
                                </div>

                                <div className="ml-auto">
                                    <button
                                        onClick={() => setIsCreatePostModalOpen(true)}
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all ${darkMode
                                            ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                                            : 'bg-amber-200 text-amber-800 hover:bg-amber-300'
                                            }`}
                                    >
                                        <Edit2 size={18} />
                                        Create Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs and View Mode */}
                    <div className={`rounded-xl border ${cardClass} p-4 mb-6`}>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            {/* Tabs */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveTab('posts')}
                                    className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'posts'
                                        ? activeButtonClass
                                        : buttonClass
                                        }`}
                                >
                                    <Grid size={18} />
                                    Posts
                                </button>
                                <button
                                    onClick={() => setActiveTab('saved')}
                                    className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === 'saved'
                                        ? activeButtonClass
                                        : buttonClass
                                        }`}
                                >
                                    <Bookmark size={18} />
                                    Saved
                                </button>
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? activeButtonClass : buttonClass
                                        }`}
                                >
                                    <Grid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? activeButtonClass : buttonClass
                                        }`}
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Posts Grid/List */}
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {userPosts.map((post) => (
                                <div
                                    key={post.id}
                                    className={`group relative rounded-xl overflow-hidden border ${cardClass} hover:shadow-xl transition-all cursor-pointer`}
                                >
                                    <img
                                        src={post.image}
                                        alt={post.caption}
                                        className="w-full aspect-square object-cover"
                                    />

                                    {/* Overlay on Hover */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                                        <div className="flex items-center gap-2 text-white">
                                            <Heart size={20} className="fill-white" />
                                            <span>{post.likes}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-white">
                                            <MessageCircle size={20} />
                                            <span>{post.comments}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {userPosts.map((post) => (
                                <div
                                    key={post.id}
                                    className={`flex gap-4 p-4 rounded-xl border ${cardClass} hover:shadow-lg transition-all cursor-pointer`}
                                >
                                    <img
                                        src={post.image}
                                        alt={post.caption}
                                        className="w-24 h-24 rounded-lg object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className={`mb-2 ${textClass}`}>{post.caption}</p>
                                        <div className="flex gap-4">
                                            <span className={`flex items-center gap-1 text-sm ${subtextClass}`}>
                                                <Heart size={16} /> {post.likes}
                                            </span>
                                            <span className={`flex items-center gap-1 text-sm ${subtextClass}`}>
                                                <MessageCircle size={16} /> {post.comments}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Load More Button */}
                    {userPosts.length > 0 && (
                        <div className="text-center mt-8">
                            <button className={`px-8 py-3 rounded-xl font-medium ${buttonClass}`}>
                                Load More
                            </button>
                        </div>
                    )}
                </div>
                {/* User Edit Modal */}
                <UserEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    darkMode={darkMode}
                    userData={user}
                    onSave={handleSaveUserData}
                />
                <CreatePostModal
                    isOpen={isCreatePostModalOpen}
                    onClose={() => setIsCreatePostModalOpen(false)}
                    darkMode={darkMode}
                    onSubmit={handleCreatePostSubmit}
                />
            </div>
        </>
    );
};

export default ProfilePage;