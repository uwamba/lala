'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/dashboard/Header';
import SideBar from '@/components/dashboard/SideBar';
import Footer from '@/components/dashboard/Footer';
import PropertyForm from '@/components/dashboard/PropertyForm';

const EditProperty = () => {
  const router = useRouter();
  const [property, setProperty] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const propertyId = new URLSearchParams(window.location.search).get('id');
    if (propertyId) {
      fetch(`http://127.0.0.1:8000/api/properties/${propertyId}/`)
        .then(res => res.json())
        .then(data => {
          setProperty(data);
          setLoading(false);
        })
        .catch(err => console.error('Error fetching property:', err));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', property.title);
    formData.append('description', property.description);
    formData.append('price_per_night', property.price_per_night);
    formData.append('location', property.location);

    fetch(`http://127.0.0.1:8000/api/properties/${property.id}/update/`, {
      method: 'PUT',
      body: formData
    })
      .then(res => res.json())
      .then(() => router.push('/dashboard'))
      .catch(err => console.error('Error updating property:', err));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-gray-100 min-h-screen">
    <Header />

      <div className="flex flex-col md:flex-row h-screen">
      <SideBar />
      <main className="flex-1 p-6">
    
      <h2 className="text-2xl font-bold text-black">Edit Property</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={property.title || ''}
        onChange={(e) => setProperty({ ...property, title: e.target.value })}
        className="w-full p-2 border text-black"
        placeholder="Title"
        required
        />
        <textarea
        value={property.description || ''}
        onChange={(e) => setProperty({ ...property, description: e.target.value })}
        className="w-full p-2 border text-black"
        placeholder="Description"
        required
        ></textarea>
        <input
        type="number"
        value={property.price_per_night || ''}
        onChange={(e) => setProperty({ ...property, price_per_night: e.target.value })}
        className="w-full p-2 border text-black"
        placeholder="Price per Night"
        required
        />
        <input
        type="text"
        value={property.location || ''}
        onChange={(e) => setProperty({ ...property, location: e.target.value })}
        className="w-full p-2 border text-black"
        placeholder="Location"
        required
        />
                <button type="submit" className="bg-green-600 text-white p-2 rounded">Update Property</button>
      </form>
 
      </main>
      </div>


      <Footer />
  </div>

    
  );
};

export default EditProperty;
