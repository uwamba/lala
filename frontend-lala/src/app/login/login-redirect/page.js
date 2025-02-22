"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


const handleAuthResponse = (router) => {
  const params = new URLSearchParams(window.location.hash.substring(1));
  const idToken = params.get('id_token'); // Use id_token instead of access_token

  if (idToken) {
    // Send token to backend
    fetch('http://127.0.0.1:8000/auth/google/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: idToken,password:"password" }), // Send id_token
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Backend response:', data);

        if (data.user && data.user.role) {
          const tokenPayload = JSON.parse(atob(idToken.split('.')[1]));
          const expirationTime = tokenPayload.exp * 1000; // Convert exp to milliseconds
          sessionStorage.setItem('userEmail', data.user.email);
          sessionStorage.setItem('tokenKey', idToken);
          sessionStorage.setItem('token_expiration', expirationTime);

          // Navigate based on user role
          if (data.user.role === 'host') {
            router.push('/dashboard'); // Navigate to the dashboard page using Next.js navigation router
          } else {
            router.push('/'); // Navigate to the home page using Next.js navigation router
          }
        } else {
          alert('User role not found.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('Authentication failed. Please try again.');  // Show user-friendly message
      });
  } else {
    alert('No id_token found in URL.');
  }
};

const LoginRedirect = () => {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();  // Use the next/navigation router

  useEffect(() => {
    setIsClient(true); // Set client-side flag when component mounts
  }, []);

  useEffect(() => {
    if (isClient) {
      // Handle authentication response only when the component is client-side and router is available
      handleAuthResponse(router);
    }
  }, [isClient, router]);

  if (!isClient) {
    return null; // Return nothing until the component is mounted on the client side
  }

  return (
    <div>
      <p>Redirecting to page...</p>
    </div>
  );
};

export default LoginRedirect;
