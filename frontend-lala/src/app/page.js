"use client";
import { useState, useEffect } from 'react';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [bookingData, setBookingData] = useState({ check_in: '', check_out: '', propertyId: '' });
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/properties/')
      .then(response => response.json())
      .then(properties => setProperties(properties))
      .catch(error => console.error('Error fetching properties:', error));

    const handleScroll = () => {
      const navbar = document.getElementById('navbar');
      if (window.scrollY > 20) {
        navbar.classList.add('bg-white', 'shadow-md');
        navbar.classList.remove('bg-transparent');
      } else {
        navbar.classList.remove('bg-white', 'shadow-md');
        navbar.classList.add('bg-transparent');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const handleBookingClick = (propertyId) => {
    // Check if the user is logged in (e.g., if there's a session token)
    const isLoggedIn = sessionStorage.getItem('tokenKey'); // or another method to check login status
    console.log(isLoggedIn);
    if (!isLoggedIn) {
      // Redirect to the login page if not logged in
      window.location.href = '/login'; // Adjust this path to your actual login page
    } else {
      // Proceed with the booking if logged in
      setBookingData({ ...bookingData, propertyId });
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('check_in', bookingData.check_in);
    formData.append('check_out', bookingData.check_out);
    formData.append('property_id', bookingData.propertyId);
    formData.append('user_email', sessionStorage.getItem('userEmail')); // Add userEmail here

    fetch('http://127.0.0.1:8000/api/properties/bookings/', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          alert('✅ Booking request submitted! Awaiting confirmation.');
          setShowPopup(false);
        } else {
          alert('❌ Error: ' + data.message);
        }
      })
      .catch(error => console.error('Error:', error));
  };

  

  return (
    <div className="bg-gray-100">
      {/* Navbar */}
      <Header />

      {/* Hero Section */}
      <section className="bg-blue-600 text-white text-center py-20 mt-16 relative">
  <h1 className="text-5xl font-bold">Find Your Perfect Apartment</h1>
  <p className="mt-4 text-lg">Browse our listings and book your stay today!</p>

  {/* Search bar container */}
  <div className="mt-12"> {/* Adjust the margin-top here for space between header and form */}
    <form className="max-w-lg mx-auto">
      <div className="flex">
          <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Your Email</label>
          <button id="dropdown-button" data-dropdown-toggle="dropdown" className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-blue-600 border border-blue-500 rounded-s-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-500 dark:bg-blue-800 dark:hover:bg-blue-700 dark:focus:ring-blue-600 dark:text-white dark:border-blue-600" type="button">
              All categories 
              <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
              </svg>
          </button>
          <div id="dropdown" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700">
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdown-button">
                  <li><button type="button" className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Mockups</button></li>
                  <li><button type="button" className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Templates</button></li>
                  <li><button type="button" className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Design</button></li>
                  <li><button type="button" className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Logos</button></li>
              </ul>
          </div>
          <div className="relative w-full">
              <input type="search" id="search-dropdown" className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-blue-600 border border-blue-500 rounded-s-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-500 dark:bg-blue-800 dark:hover:bg-blue-700 dark:focus:ring-blue-600 dark:text-white rounded-e-lg  focus:border-blue-500 dark:border-gray-600 dark:placeholder-gray-400 " placeholder="Search booking any where.." required />
              <button type="submit" className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-600 rounded-e-lg border border-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-blue-900">
                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                  <span className="sr-only">Search</span>
              </button>
          </div>
      </div>
    </form>
  </div>
</section>



      {/* Apartment Listings */}
      <section id="property-listings" className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {properties.map(property => {
          const propertyImage = property.property_images.length > 0
            ? `http://127.0.0.1:8000${property.property_images[0].image.startsWith('/media/') ? '' : '/media'}${property.property_images[0].image}`
            : 'default-image.jpg';

          return (
            <div key={property.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img src={propertyImage} alt={property.title} className="w-full h-56 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800">{property.title}</h2>
                <p className="text-gray-600 mt-2">{property.location}</p>
                <p className="text-gray-600 mt-2">{property.description}</p>
                <p className="text-blue-600 font-semibold mt-4">${property.price_per_night} /night</p>
                <button className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 book-now-btn" onClick={() => handleBookingClick(property.id)}>Book Now</button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Booking Popup */}
      {showPopup && (
        <div id="bookingPopup" className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold text-center mb-4">Book Your Stay</h2>
            <form id="bookingForm" onSubmit={handleFormSubmit}>
              <label htmlFor="check_in" className="block text-sm text-gray-700">Check-in Date:</label>
              <input type="date" id="check_in" value={bookingData.check_in} onChange={(e) => setBookingData({ ...bookingData, check_in: e.target.value })} className="w-full p-2 border border-gray-300 rounded mb-4" required />
              <label htmlFor="check_out" className="block text-sm text-gray-700">Check-out Date:</label>
              <input type="date" id="check_out" value={bookingData.check_out} onChange={(e) => setBookingData({ ...bookingData, check_out: e.target.value })} className="w-full p-2 border border-gray-300 rounded mb-4" required />
              <div className="flex justify-between">
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">Confirm Booking</button>
                <button type="button" onClick={handleClosePopup} className="px-6 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
       <Footer />
    </div>
   
  );
}
