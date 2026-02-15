import React from 'react';
import { Moon, Sun, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';


interface NavbarProps {
    darkMode: boolean;
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode }) => {
    return (
        <div className='felx justify-items-center pt-5 '>
            <div className={`${darkMode ? 'bg-gray-950' : 'bg-white'} w-200  rounded-lg  transition-colors duration-300`}>
                <nav className={`flex rounded-lg  justify-between items-center px-8  py-5 shadow-lg border-b ${darkMode
                        ? 'border-gray-800 bg-gray-900'
                        : 'border-gray-100 bg-white'
                    }`}>

                    {/* Logo / Brand */}
                    <div className="text-2xl flex rounded-lg font-bold">
                        <p className='text-green-500'>Thenga</p>
                        <p className='bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent'>Pod</p>
                    </div>

                    {/* Navigation Links */}
                    <ul className="flex gap-8 text-base font-medium">
                        <li className={`cursor-pointer transition-all duration-300 hover:text-green-400 ${darkMode ? 'text-gray-300 hover:text-green-200' : 'text-gray-700 hover:text-green-500'
                            }`}>
                            Home
                        </li>
                        <li className={`cursor-pointer transition-all duration-300 hover:text-green-400 ${darkMode ? 'text-gray-300 hover:text-green-200' : 'text-gray-700 hover:text-green-500'
                            }`}>
                            Strangers
                        </li>
                        <li className={`cursor-pointer transition-all duration-300 hover:text-green-400 ${darkMode ? 'text-gray-300 hover:text-green-200' : 'text-gray-700 hover:text-green-500'
                            }`}>
                            Blog
                        </li>
                    </ul>

                    {/* Right Side - Theme Toggle & Auth Buttons */}
                    <div className="flex items-center gap-4">

                        {/* Theme Toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-2.5 rounded-lg transition-all duration-300 hover:scale-110 ${darkMode
                                    ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Sign In Button */}
                        <Link to={'/login'} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-300 border ${darkMode
                                ? 'border-green-400 text-green-200 hover:bg-green-500/10 hover:border-green-300'
                                : 'border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400'
                            }`}>
                            <LogIn size={18} />
                            Sign In
                        </Link>

                        {/* Sign Up Button */}
                        
                        <Link to={'/signup'} className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-green-400 to-green-500 hover:from-green-300 hover:to-green-400 transition-all duration-300 shadow-lg hover:shadow-green-500/50">
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