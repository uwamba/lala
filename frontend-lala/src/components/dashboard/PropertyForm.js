'use client';
import React, { useState } from 'react';

const PropertyForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]);

  const handleImageChange = (e, index) => {
    const updatedImages = [...images];
    updatedImages[index] = e.target.files[0];
    setImages(updatedImages);
  };

  const handleAddImage = () => {
    setImages([...images, null]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price_per_night', pricePerNight);
    formData.append('location', location);
    
    images.forEach(image => {
      if (image) {
        formData.append('images', image);
      }
    });
  
    const token = sessionStorage.getItem('tokenKey'); // Or get from localStorage/context/state depending on where your token is stored
  
    fetch('http://127.0.0.1:8000/api/properties/add/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,  // Add the token to the Authorization header
      },
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log('Property created:', data);
        window.location.href = "/dashboard"; // Redirect to dashboard after success
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          required
        ></textarea>
      </div>
      <div className="mb-4">
        <label htmlFor="price_per_night" className="block text-gray-700">Price per Night</label>
        <input
          type="number"
          id="price_per_night"
          value={pricePerNight}
          onChange={(e) => setPricePerNight(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="location" className="block text-gray-700">Location</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="images" className="block text-sm font-medium text-gray-700">Property Images</label>
        {images.map((image, index) => (
          <div key={index} className="flex items-center space-x-4">
            <input
              type="file"
              onChange={(e) => handleImageChange(e, index)}
              className="p-2 border border-gray-300 rounded-md"
              accept="image/*"
            />
          </div>
        ))}
        <button type="button" onClick={handleAddImage} className="mt-2 text-white bg-blue-600 p-2 rounded-md hover:bg-blue-700">
          Add Image
        </button>
      </div>

      <button type="submit" className="mt-4 text-white bg-green-600 p-2 rounded-md hover:bg-green-700">Submit Property</button>
    </form>
  );
};

export default PropertyForm;
