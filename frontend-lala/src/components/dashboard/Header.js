'use client';
import { useState, useEffect } from 'react';

const Header = () => {
  const [userEmail, setUserEmail] = useState(null); // State to store user email

  useEffect(() => {
    // Check if the email is stored in sessionStorage
    const storedEmail = sessionStorage.getItem('userEmail');
    
    // If email exists in sessionStorage, set it to state
    if (storedEmail) {
      setUserEmail(storedEmail);
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

  // Function to load the JSON configuration file
  const loadConfig = async () => {
    try {
      const response = await fetch('/config.json'); // Assuming the JSON file is in the public directory
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error loading config:", error);
      return {}; // Return empty object if an error occurs
    }
  };


  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-black">Property Management</h1>
      <div className="flex items-center space-x-4">
        <span id="userEmail" className="text-gray-700">
          {userEmail ? userEmail : 'email'} {/* Display the email or a fallback */}
        </span>
        <button id="logoutBtn" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
      </div>
    </header>
  );
};

export default Header;
