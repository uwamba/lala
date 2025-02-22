"use client";
import { useEffect } from 'react';

const Login = () => {
  const YOUR_CLIENT_ID = '856025946443-ptk31n3kan2jmt8hvltsqo27j8n23k8c.apps.googleusercontent.com';
  const YOUR_REDIRECT_URI = 'http://localhost:3000/login/login-redirect';

  useEffect(() => {
    // Add the Google API script dynamically when the component mounts
    const script = document.createElement('script');
    script.src = 'https://cdn.tailwindcss.com';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  function oauthSignIn() {
    const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
  
    const form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', oauth2Endpoint);
  
    const params = {
      client_id: YOUR_CLIENT_ID,
      redirect_uri: YOUR_REDIRECT_URI,
      response_type: 'id_token', // This will request an ID token
      scope: 'email profile',    // You can include other scopes here
      state: 'pass-through value',
      access_type: 'offline',
      nonce: generateNonce(),
    };
  
    for (const p in params) {
      const input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', p);
      input.setAttribute('value', params[p]);
      form.appendChild(input);
    }
  
    document.body.appendChild(form);
    form.submit();
  }

  function generateNonce() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  function handleAuthResponse() {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const idToken = params.get('id_token'); // Use id_token instead of access_token
  
    if (idToken) {
      // Send token to backend
      fetch('http://127.0.0.1:8000/auth/google/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: idToken }), // Send id_token instead
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Backend response:', data);
          alert('User signed in successfully!');
        })
        .catch((error) => console.error('Error:', error));
    }
  }

  useEffect(() => {
    window.onload = handleAuthResponse;
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        <form className="mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="johndoe@example.com"
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
              required
            />
          </div>
          <button type="submit" className="w-full px-4 py-2 mt-6 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600">
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={oauthSignIn}
            className="w-full px-4 py-2 font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 flex items-center justify-center"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              className="w-5 h-5 mr-2"
              alt="Google Logo"
            />
            Login with Google
          </button>
        </div>
        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account? <a href="#" className="text-blue-500 hover:underline">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
