import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, ShieldCheck } from 'lucide-react';
import { verifyOtp } from '../../api/user/userApi';
import { useDispatch } from 'react-redux';
import { addUser } from '../../redux/user/userSlice';

const OtpPage: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(60);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const location = useLocation();

  // Get data from location state
  const email = location.state?.email;



  // Initialize timer from storage or set default
  useEffect(() => {
    const initializeTimer = () => {
      const storedExpiry = localStorage.getItem('otpExpiry');
      const storedEmail = localStorage.getItem('otpEmail');

      // Check if stored data exists and matches current email
      if (storedExpiry && storedEmail === email) {
        const expiryTime = parseInt(storedExpiry);
        const currentTime = Date.now();
        const remainingSeconds = Math.max(0, Math.floor((expiryTime - currentTime) / 1000));

        if (remainingSeconds > 0) {
          setTimer(remainingSeconds);
          setIsResendDisabled(true);
        } else {
          // Timer expired
          setTimer(0);
          setIsResendDisabled(false);
          // Clear expired storage
          localStorage.removeItem('otpExpiry');
          localStorage.removeItem('otpEmail');
        }
      } else {
        // New OTP session - store with 60 seconds expiry
        const expiryTime = Date.now() + 60 * 1000;
        localStorage.setItem('otpExpiry', expiryTime.toString());
        localStorage.setItem('otpEmail', email || '');
        setTimer(60);
        setIsResendDisabled(true);
      }
    };

    if (email) {
      initializeTimer();
    }
  }, [email]);

  // Timer effect with storage update
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (timer > 0 && isResendDisabled) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer - 1;
          
          // Update expiry time in storage
          if (email) {
            const newExpiryTime = Date.now() + newTimer * 1000;
            localStorage.setItem('otpExpiry', newExpiryTime.toString());
          }
          
          return newTimer;
        });
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
      // Clear storage when timer reaches 0
      localStorage.removeItem('otpExpiry');
      localStorage.removeItem('otpEmail');
    }
    
    return () => clearInterval(interval);
  }, [timer, isResendDisabled, email]);

  // Clean up storage when component unmounts (optional - only if you want to clear on unmount)
  useEffect(() => {
    return () => {
    //   Uncomment the next line if you want to clear timer when navigating away
      localStorage.removeItem('otpExpiry');
      localStorage.removeItem('otpEmail');
    };
  }, []);

  useEffect(() => {
    if(!email){
        navigate('/login')
    }
  },[])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;
    
    const pastedArray = pastedData.split('');
    const newOtp = [...otp];
    
    pastedArray.forEach((value, index) => {
      if (index < 6) newOtp[index] = value;
    });
    
    setOtp(newOtp);
    
    const nextEmptyIndex = newOtp.findIndex(val => val === '');
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is missing. Please try signing up again.');
      return;
    }

    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await verifyOtp(email, otpString);
      
      // Clear timer storage on successful verification
      localStorage.removeItem('otpExpiry');
      localStorage.removeItem('otpEmail');
      
      if(response){
        dispatch(addUser({
          id : response.user?.id || "",
          firstName : response.user?.firstName || "",
          lastName : response.user?.lastName || "",
          email : response.user?.email || "",
          token : response.accessToken || ""
        }))
          navigate('/');
      }
      
       
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setError('Email is missing. Please try signing up again.');
      return;
    }

    setIsResendDisabled(true);
    setTimer(60);
    setOtp(['', '', '', '', '', '']);
    setError('');
    
    // Store new expiry time
    const expiryTime = Date.now() + 60 * 1000;
    localStorage.setItem('otpExpiry', expiryTime.toString());
    localStorage.setItem('otpEmail', email);
    
    try {
      // Call your resend OTP API here
      // const response = await resendOtp(email);
      console.log('Resending OTP to:', email);
      
      setTimeout(() => inputRefs.current[0]?.focus(), 0);
      alert('OTP resent successfully!');
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.');
      setIsResendDisabled(false);
      setTimer(0);
      localStorage.removeItem('otpExpiry');
      localStorage.removeItem('otpEmail');
    }
  };

  // If no email or userData, show error message
  if (!email ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-300 via-yellow-200 to-amber-400 flex items-center justify-center p-4">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/30 text-center">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Error</h2>
          <p className="text-amber-800 mb-4">{error || 'Missing user information'}</p>
          <button
            onClick={() => navigate('/signup')}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Go to Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-300 via-yellow-200 to-amber-400 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-300 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-400 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-200 rounded-full filter blur-3xl opacity-20"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-white/30 backdrop-blur-sm rounded-full mb-4">
            <ShieldCheck className="text-amber-800" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-amber-900 mb-2 drop-shadow-sm">
            Verify OTP
          </h1>
          <p className="text-amber-800 text-lg font-medium mb-2">
            Enter the 6-digit code sent to your email
          </p>
          <p className="text-amber-700 text-sm font-mono bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg inline-block">
            {email}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/20 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/30">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input Fields */}
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-3 text-center">
                Verification Code
              </label>
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className={`w-12 h-14 text-center text-xl font-bold bg-white/80 backdrop-blur-sm border-2 ${error ? 'border-red-500' : 'border-amber-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-amber-900 transition-all shadow-md`}
                    disabled={isLoading}
                  />
                ))}
              </div>
              {error && (
                <p className="text-red-600 text-xs mt-2 text-center font-medium bg-red-100/50 backdrop-blur-sm py-1 px-2 rounded">
                  {error}
                </p>
              )}
            </div>

            {/* Timer */}
            <div className="flex items-center justify-center gap-2 text-amber-800">
              <Clock size={18} className="text-amber-700" />
              <span className="font-medium">Code expires in:</span>
              <span className={`font-bold ${timer < 10 ? 'text-red-600 animate-pulse' : 'text-amber-900'}`}>
                {formatTime(timer)}
              </span>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-bold rounded-xl hover:from-amber-700 hover:to-yellow-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Verify OTP'
              )}
            </button>

            {/* Resend OTP Link */}
            <div className="text-center">
              <p className="text-amber-800 text-sm">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResendDisabled || isLoading}
                  className={`font-bold transition-colors ${
                    isResendDisabled || isLoading
                      ? 'text-amber-400 cursor-not-allowed'
                      : 'text-amber-900 hover:text-amber-950 hover:underline cursor-pointer'
                  }`}
                >
                  Resend OTP
                </button>
              </p>
            </div>

            {/* Back to Login Link */}
            <div className="text-center mt-4">
              <span 
                onClick={() => navigate('/login')} 
                className="text-amber-800 text-sm font-medium cursor-pointer hover:text-amber-900 hover:underline transition-colors"
              >
                ← Back to Login
              </span>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-6 text-amber-800/80 font-medium">
          For your security, this code expires in 60 seconds
        </p>
      </div>
    </div>
  );
};

export default OtpPage;