import React, { useState, useEffect } from 'react';
import { Moon, Sun, LogIn, Settings, Menu, X, PowerOff, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import UserEditModal from './modals/UserEditModal';
import { editProfile } from '../api/user/userApi';
import { addUser, removeUser } from '../redux/user/userSlice';

interface NavbarProps {
    darkMode: boolean;
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode }) => {
    const user = useSelector((state: RootState) => state.auth);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dispatch = useDispatch();

    // Load theme from localStorage on component mount
    useEffect(() => {
        const userId = user?.id || "guest";
        const themeKey = `theme_${userId}`;
        const savedTheme = localStorage.getItem(themeKey);

        if (savedTheme) {
            const isDark = savedTheme === "dark";
            // Only update if different from current
            if (isDark !== darkMode) {
                setDarkMode(isDark);
            }
        }
    }, [user?.id]); // Re-run when user changes

    // Apply dark mode class to html element whenever darkMode changes
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    // Close mobile menu when window resizes to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };
    const handleLogout = async() => {
        dispatch(removeUser())
    }
    const handleThemeToggle = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);

        const userId = user?.id || "guest";
        const themeKey = `theme_${userId}`;
        const themeValue = newMode ? "dark" : "light";

        localStorage.setItem(themeKey, themeValue);
        console.log("Saved theme:", themeKey, themeValue);
    };

    return (
        <div className='flex justify-center pt-5 px-4 relative z-20'>
            <div className={`${darkMode ? 'bg-gray-950' : 'bg-white/30 backdrop-blur-md'} w-full max-w-6xl rounded-2xl transition-colors duration-300 border ${darkMode ? 'border-gray-800' : 'border-amber-200/50'}`}>
                <nav className={`flex rounded-2xl justify-between items-center px-4 sm:px-6 lg:px-8 py-3 lg:py-4 shadow-lg ${darkMode
                    ? 'bg-gray-900/90 backdrop-blur-sm'
                    : 'bg-white/40 backdrop-blur-md'
                    }`}>

                    {/* Logo / Brand */}
                    <div className="text-xl sm:text-2xl flex rounded-lg font-bold">
                        <p className={darkMode ? 'text-amber-400' : 'text-amber-600'}>Pazam</p>
                        <p className={`bg-gradient-to-r ${darkMode ? 'from-amber-400 to-yellow-500' : 'from-amber-600 to-yellow-600'} bg-clip-text text-transparent`}>_Tholi</p>
                    </div>

                    {/* Desktop Navigation Links - Hidden on mobile */}
                    <ul className="hidden lg:flex gap-6 xl:gap-8 text-base font-medium">
                        <a
                            href='/'
                            className={`cursor-pointer transition-all duration-300 ${darkMode
                                ? 'text-gray-300 hover:text-amber-400'
                                : 'text-amber-800 hover:text-amber-600'
                                }`}
                        >
                            Home
                        </a>
                        <a
                            href='/feed'
                            className={`cursor-pointer transition-all duration-300 ${darkMode
                                ? 'text-gray-300 hover:text-amber-400'
                                : 'text-amber-800 hover:text-amber-600'
                                }`}
                        >
                            Posts
                        </a>
                        <li className={`cursor-pointer transition-all duration-300 list-none ${darkMode
                            ? 'text-gray-300 hover:text-amber-400'
                            : 'text-amber-800 hover:text-amber-600'
                            }`}>
                            Chat
                        </li>
                    </ul>

                    {/* Right Side - Theme Toggle & Auth Buttons */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={handleThemeToggle}
                            className={`p-2 sm:p-2.5 rounded-lg transition-all duration-300 hover:scale-110 ${darkMode
                                ? 'bg-gray-800 text-amber-400 hover:bg-gray-700'
                                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                }`}
                            aria-label="Toggle theme"
                        >
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                                    <button
                            onClick={handleLogout}
                            className={`p-2 sm:p-2.5 rounded-lg transition-all duration-300 hover:scale-110 ${darkMode
                                ? 'bg-gray-800 text-amber-400 hover:bg-gray-700'
                                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                }`}
                            aria-label="Toggle theme"
                        >
                            <LogOut size={18} />
                        </button>
                        {!user ? (
                            <Link
                                to={'/login'}
                                className={`hidden sm:flex items-center gap-2 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg font-medium transition-all duration-300 border ${darkMode
                                    ? 'border-amber-400 text-amber-300 hover:bg-amber-500/10 hover:border-amber-300'
                                    : 'border-amber-400 text-amber-700 hover:bg-amber-50 hover:border-amber-500'
                                    }`}
                            >
                                <LogIn size={16} className="sm:w-[18px] sm:h-[18px]" />
                                <span className="hidden sm:inline">Sign In</span>
                            </Link>
                        ) : (
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className={`hidden sm:flex p-2 sm:p-2.5 rounded-lg transition-all duration-300 hover:scale-110 ${darkMode
                                    ? 'bg-gray-800 text-amber-400 hover:bg-gray-700'
                                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                    }`}
                                aria-label="Settings"
                            >
                                <Settings size={18} className="sm:w-5 sm:h-5" />
                            </button>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className={`lg:hidden p-2 rounded-lg transition-all duration-300 ${darkMode
                                ? 'bg-gray-800 text-amber-400 hover:bg-gray-700'
                                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                }`}
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className={`lg:hidden rounded-b-2xl px-4 py-4 border-t ${darkMode
                        ? 'bg-gray-900/95 border-gray-800'
                        : 'bg-white/95 backdrop-blur-md border-amber-200/50'
                        }`}>
                        <div className="flex flex-col space-y-3">
                            {/* Mobile Navigation Links */}
                            <a
                                href='/'
                                onClick={closeMobileMenu}
                                className={`px-4 py-3 rounded-xl transition-all duration-300 ${darkMode
                                    ? 'text-gray-300 hover:bg-gray-800 hover:text-amber-400'
                                    : 'text-amber-800 hover:bg-amber-100 hover:text-amber-600'
                                    }`}
                            >
                                Home
                            </a>
                            <a
                                href='/feed'
                                onClick={closeMobileMenu}
                                className={`px-4 py-3 rounded-xl transition-all duration-300 ${darkMode
                                    ? 'text-gray-300 hover:bg-gray-800 hover:text-amber-400'
                                    : 'text-amber-800 hover:bg-amber-100 hover:text-amber-600'
                                    }`}
                            >
                                Posts
                            </a>
                            <li className={`px-4 py-3 rounded-xl transition-all duration-300 list-none ${darkMode
                                ? 'text-gray-300 hover:bg-gray-800 hover:text-amber-400'
                                : 'text-amber-800 hover:bg-amber-100 hover:text-amber-600'
                                }`}>
                                Chat
                            </li>

                            {/* Mobile Auth Buttons */}
                            <div className="border-t pt-3 mt-2 border-amber-200/30">
                                {!user ? (
                                    <Link
                                        to={'/login'}
                                        onClick={closeMobileMenu}
                                        className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 border ${darkMode
                                            ? 'border-amber-400 text-amber-300 hover:bg-amber-500/10'
                                            : 'border-amber-400 text-amber-700 hover:bg-amber-50'
                                            }`}
                                    >
                                        <LogIn size={18} />
                                        Sign In
                                    </Link>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setIsEditModalOpen(true);
                                            closeMobileMenu();
                                        }}
                                        className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 ${darkMode
                                            ? 'bg-gray-800 text-amber-400 hover:bg-gray-700'
                                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                            }`}
                                    >
                                        <Settings size={18} />
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
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
        </div>
    );
};

export default Navbar;