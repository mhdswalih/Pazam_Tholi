import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import MainImage from '../assets/img/ChatGPT Image Feb 16, 2026, 08_42_25 PM.png'
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";


const LandingPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
 
  
  const modalVariants: Variants = {
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



  return (
    <div className={`min-h-screen transition-colors duration-300 relative overflow-hidden ${
      darkMode 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-gradient-to-br from-amber-300 via-yellow-200 to-amber-400 text-amber-900'
    }`}>
      
      {/* Decorative elements - only show in light mode */}
      {!darkMode && (
        <>
          <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-300 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-amber-400 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-200 rounded-full filter blur-3xl opacity-20"></div>
        </>
      )}
      
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row justify-between items-center gap-12 relative z-10">
        {/* Left side - Featured content */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/2 flex flex-col justify-center items-center"
        >
          <div className="mb-8 w-full flex justify-center">
            <div className="relative w-fit mx-auto">
              {/* Gradient background (changes with dark mode) */}
              <div className={`absolute inset-0 rounded-full blur-xl opacity-30 transform scale-95 -z-10 ${
                darkMode 
                  ? 'bg-gradient-to-b from-gray-700 to-gray-900' 
                  : 'bg-gradient-to-b from-amber-400 to-yellow-600'
              }`}></div>
              
              {/* Image with mode-sensitive drop-shadow */}
              <img 
                src={MainImage} 
                alt="Video chat illustration" 
                className={`max-w-full md:max-w-lg relative z-10 ${
                  darkMode ? 'drop-shadow-lg' : 'drop-shadow-xl'
                }`}
              />
              
              {/* Dynamic shadow */}
              <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-[50%] h-3 rounded-full blur-[8px] ${
                darkMode 
                  ? 'bg-gray-900 opacity-30' 
                  : 'bg-amber-900 opacity-20'
              }`}></div>
            </div>
          </div>
          
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center ${
            darkMode ? 'text-white' : 'text-amber-900'
          }`}>
            Connect with anyone, anywhere
          </h2>
          
          <p className={`text-lg mb-8 text-center max-w-lg mx-auto ${
            darkMode ? 'text-gray-300' : 'text-amber-800'
          }`}>
            Create video or audio rooms with friends, colleagues, or meet new people through our secure platform.
          </p>
          
          {/* Stats */}
          <div className="flex justify-center space-x-12 mb-8 w-full">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className={`text-3xl font-bold ${
                darkMode ? 'text-amber-400' : 'text-amber-700'
              }`}>10K+</div>
              <div className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-amber-700/80'
              }`}>Active Users</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className={`text-3xl font-bold ${
                darkMode ? 'text-amber-400' : 'text-amber-700'
              }`}>500+</div>
              <div className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-amber-700/80'
              }`}>Rooms Daily</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className={`text-3xl font-bold ${
                darkMode ? 'text-amber-400' : 'text-amber-700'
              }`}>99.9%</div>
              <div className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-amber-700/80'
              }`}>Uptime</div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Right side - Action buttons */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full lg:w-1/3 max-w-md"
        >
          <div className={`p-8 rounded-2xl shadow-xl ${
            darkMode 
              ? 'bg-gray-800/90 backdrop-blur-sm' 
              : 'bg-white/30 backdrop-blur-md border border-white/50'
          }`}>
            <h3 className={`text-2xl font-bold mb-20 text-center ${
              darkMode ? 'text-white' : 'text-amber-900'
            }`}>
              Start Connecting
            </h3>
            
            {/* Primary Action - Create Room */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center space-x-3 w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-6 py-4 rounded-xl font-medium mb-6 transition-all duration-200 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="16" rx="2" ry="2"></rect>
                <line x1="12" y1="10" x2="12" y2="16"></line>
                <line x1="8" y1="13" x2="16" y2="13"></line>
              </svg>
              <span>Create New Room</span>
            </motion.button>

            {/* Quick action links */}
            <div className="flex justify-center gap-4 mt-4">
              <span 
                onClick={() => navigate('/login')}
                className="text-amber-800 hover:text-amber-900 font-medium cursor-pointer hover:underline transition-colors"
              >
                Sign In
              </span>
              <span className="text-amber-800/50">•</span>
              <span 
                onClick={() => navigate('/register')}
                className="text-amber-800 hover:text-amber-900 font-medium cursor-pointer hover:underline transition-colors"
              >
                Register
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`mt-16 text-center text-sm pb-8 relative z-10 ${
          darkMode ? 'text-gray-400' : 'text-amber-800'
        }`}
      >
        <p>Join our community of thousands connecting daily</p>
      </motion.div>
    
      {/* Room Creation Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={() => setShowModal(false)}
              className="fixed inset-0 backdrop-blur-md bg-black/30 z-40"
            />
            
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl z-50 p-6 w-full max-w-md mx-4 border border-amber-200"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-amber-900">Create New Room</h3>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-amber-600 hover:text-amber-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate('/create-room');
                    setShowModal(false);
                  }}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 rounded-xl border border-amber-200 transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-amber-200 to-yellow-200 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-700">
                        <polygon points="23 7 16 12 23 17 23 7"></polygon>
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                      </svg>
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-amber-900">Video Room</h4>
                      <p className="text-sm text-amber-700">Up to 12 participants with video</p>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate('/create-audioroom');
                    setShowModal(false);
                  }}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 rounded-xl border border-amber-200 transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-amber-200 to-yellow-200 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-700">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                        <line x1="12" y1="19" x2="12" y2="23"></line>
                        <line x1="8" y1="23" x2="16" y2="23"></line>
                      </svg>
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-amber-900">Audio Room</h4>
                      <p className="text-sm text-amber-700">Voice-only conversation</p>
                    </div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </motion.button>
              </div>

              <div className="mt-6 pt-4 border-t border-amber-200">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full py-2 px-4 text-amber-700 hover:text-amber-900 font-medium rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;