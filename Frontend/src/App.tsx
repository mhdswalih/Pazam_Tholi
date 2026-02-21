import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import SignUpPage from "./pages/login/Signup";
import LoginPage from "./pages/login/Login";
import OtpPage from "./pages/login/Otp";
import PostFeed from "./pages/feed/Feed";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<OtpPage />} /> 
        <Route path="/feed" element={<PostFeed darkMode={darkMode} setDarkMode={setDarkMode} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;