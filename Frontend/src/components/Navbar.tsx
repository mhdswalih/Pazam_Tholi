import React from 'react';
import { Moon, Sun, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';


interface NavbarProps {
    darkMode: boolean;
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode }) => {
    const userName = useSelector((state:RootState) => state.auth.firstName)
    return (
        <div className='flex justify-center pt-5 px-4 relative z-20'>
            <div className={`${darkMode ? 'bg-gray-950' : 'bg-white/30 backdrop-blur-md'} w-full max-w-6xl rounded-2xl transition-colors duration-300 border ${darkMode ? 'border-gray-800' : 'border-amber-200/50'}`}>
                <nav className={`flex rounded-2xl justify-between items-center px-8 py-4 shadow-lg ${darkMode
                        ? 'bg-gray-900/90 backdrop-blur-sm'
                        : 'bg-white/40 backdrop-blur-md'
                    }`}>

                    {/* Logo / Brand */}
                    <div className="text-2xl flex rounded-lg font-bold">
                        <p className={darkMode ? 'text-amber-400' : 'text-amber-600'}>Pazam</p>
                        <p className={`bg-gradient-to-r ${darkMode ? 'from-amber-400 to-yellow-500' : 'from-amber-600 to-yellow-600'} bg-clip-text text-transparent`}>_Tholi</p>
                    </div>

                    {/* Navigation Links */}
                    <ul className="flex gap-8 text-base font-medium">
                        <li className={`cursor-pointer transition-all duration-300 ${
                            darkMode 
                                ? 'text-gray-300 hover:text-amber-400' 
                                : 'text-amber-800 hover:text-amber-600'
                        }`}>
                            Home
                        </li>
                        <li className={`cursor-pointer transition-all duration-300 ${
                            darkMode 
                                ? 'text-gray-300 hover:text-amber-400' 
                                : 'text-amber-800 hover:text-amber-600'
                        }`}>
                            Posts
                        </li>
                        <li className={`cursor-pointer transition-all duration-300 ${
                            darkMode 
                                ? 'text-gray-300 hover:text-amber-400' 
                                : 'text-amber-800 hover:text-amber-600'
                        }`}>
                            Chat
                        </li>
                    </ul>

                    {/* Right Side - Theme Toggle & Auth Buttons */}
                    <div className="flex items-center gap-4">

                        {/* Theme Toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-2.5 rounded-lg transition-all duration-300 hover:scale-110 ${
                                darkMode
                                    ? 'bg-gray-800 text-amber-400 hover:bg-gray-700'
                                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            }`}
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Sign In Button */}
                        <Link 
                            to={'/login'} 
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-300 border ${
                                darkMode
                                    ? 'border-amber-400 text-amber-300 hover:bg-amber-500/10 hover:border-amber-300'
                                    : 'border-amber-400 text-amber-700 hover:bg-amber-50 hover:border-amber-500'
                            }`}
                        >
                            <LogIn size={18} />
                            Sign In
                        </Link>

                        {/* Sign Up Button */}
                        <Link 
                            to={'/signup'} 
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 transition-all duration-300 shadow-lg hover:shadow-amber-500/50"
                        >
                            <UserPlus size={18} />
                            Sign Up
                        </Link>
                        
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Navbar;