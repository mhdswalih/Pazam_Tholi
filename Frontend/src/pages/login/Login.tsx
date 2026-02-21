import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/user/userApi';
import { useDispatch } from 'react-redux';
import { addUser } from '../../redux/user/userSlice';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

  e.preventDefault();

  const newErrors = validateForm();

  if (Object.keys(newErrors).length !== 0) {
    setErrors(newErrors);
    return;
  }

  try {

    setIsLoading(true);

    const response = await login(formData.email, formData.password);

    if (!response || !response.accessToken) {
      throw new Error("Login failed");
    }

    dispatch(addUser({
      id: response.user.id,
      firstName: response.user.firstName,
      lastName: response.user.lastName,
      email: response.user.email,
      token: response.accessToken,
    }));

    navigate("/");

  } catch (error) {

    console.error(error);
    setErrors({ email: "Invalid email or password", password: "Invalid email or password" });

  } finally {

    setIsLoading(false);

  }
};

  const handleGoogleLogin = (): void => {
    setIsGoogleLoading(true);
    // Simulate Google auth API call
    setTimeout(() => {
      setIsGoogleLoading(false);
      alert('Google login successful!');
    }, 1500);
  };

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
            <Lock className="text-amber-800" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-amber-900 mb-2 drop-shadow-sm">
            Welcome Back
          </h1>
          <p className="text-amber-800 text-lg font-medium">
            Sign in to continue your journey
          </p>
        </div>

        {/* Form Card */}
        <div className="  ">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-amber-900 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600" size={18} />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border ${errors.email ? 'border-red-500' : 'border-amber-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-800 placeholder-amber-400/70 transition-all`}
                />
              </div>
              {errors.email && <p className="text-red-600 text-xs mt-1 font-medium">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-amber-900 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600" size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 bg-white/80 backdrop-blur-sm border ${errors.password ? 'border-red-500' : 'border-amber-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-800 placeholder-amber-400/70 transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-800 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-600 text-xs mt-1 font-medium">{errors.password}</p>}
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <span className="text-sm text-amber-800 font-medium cursor-pointer hover:text-amber-900 hover:underline transition-colors">
                Forgot Password?
              </span>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-yellow-600 text-white font-bold rounded-xl hover:from-amber-700 hover:to-yellow-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            {/* OR Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-amber-300/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white/20 backdrop-blur-sm text-amber-800 font-medium rounded-full">OR</span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/80 backdrop-blur-sm border border-amber-300 rounded-xl hover:bg-white hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-amber-800 font-medium">
                {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
              </span>
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-amber-800 mt-6">
              Don't have an account?{' '}
              <span 
                onClick={() => navigate('/signup')} 
                className="text-amber-900 font-bold cursor-pointer hover:underline hover:text-amber-950 transition-colors"
              >
                Sign Up
              </span>
            </p>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-6 text-amber-800/80 font-medium">
          By signing in, you agree to our{' '}
          <span className="text-amber-900 font-bold cursor-pointer hover:underline">Terms</span> and{' '}
          <span className="text-amber-900 font-bold cursor-pointer hover:underline">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;