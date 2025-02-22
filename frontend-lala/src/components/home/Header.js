'use client';
import { useState, useEffect } from 'react';

const Header = () => {
  const [userEmail, setUserEmail] = useState(null); // State to store user email
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  useEffect(() => {
    // Check if the email is stored in sessionStorage
    const storedEmail = sessionStorage.getItem('userEmail');
    
    // If email exists in sessionStorage, set it to state
    if (storedEmail) {
      setUserEmail(storedEmail);
      setIsLoggedIn(true); // Set login status to true
    }

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", logout);
    }

    return () => {
      if (logoutBtn) {
        logoutBtn.removeEventListener("click", logout);
      }
    };

  }, []); // Empty dependency array to run this effect once on mount

  const logout = async () => {
    // Clear token from sessionStorage
    sessionStorage.clear();

    // Optionally, redirect to Google's logout page
    document.location.href = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://127.0.0.1:3000/login";
  };

  const handleLogin = () => {
    window.location.href = 'http://127.0.0.1:3000/login';
  };

  return (
    <nav id="navbar" className="fixed w-full top-0 left-0 z-50 transition-all duration-300 ease-in-out bg-transparent">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <a href="" className="text-3xl font-bold text-blue-600 transition-all duration-300">LaLa</a>
        <div className="hidden md:flex space-x-6">
          <a href="/about" className="text-blue-700 hover:text-blue-600 transition-all duration-300">About Us</a>
          <a href="/services" className="text-blue-700 hover:text-blue-600 transition-all duration-300">Services</a>
          <a href="/contact" className="text-blue-700 hover:text-blue-600 transition-all duration-300">Contact Us</a>
          <a href="/booking" className="text-blue-700 hover:text-blue-600 transition-all duration-300">Book Now</a>
        </div>
        <div className="flex items-center space-x-4">
          <span id="userEmail" className="text-gray-700">
            {userEmail ? userEmail : ''} {/* Display the email or a fallback */}
          </span>
        </div>
        {isLoggedIn ? (
          <button id="logoutBtn" onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
        ) : (
          <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all duration-300">Login</button>
        )}
      </div>
    </nav>
  );
};

export default Header;
