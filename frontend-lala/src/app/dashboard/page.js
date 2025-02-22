'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/dashboard/Header';
import SideBar from '../../components/dashboard/SideBar';
import Footer from '../../components/dashboard/Footer';

export default function PropertyDashboard() {
  const [properties, setProperties] = useState([]);
  const router = useRouter();

  useEffect(() => {
    checkAuthentication();
    fetchProperties();
  }, []);

  const checkAuthentication = () => {
    const token = sessionStorage.getItem('tokenKey');
    if (!token) {
      router.push('/login');
    }
  };

  const fetchProperties = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/properties/');
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleEdit = (id) => {
    router.push(`/dashboard/edit-property?id=${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
    try {
      const response = await fetch(`http://localhost:8000/api/properties/delete/${id}/`, {
        method: 'DELETE',
      });
  
      if (response.status === 204) {
        console.log('Property deleted successfully');
        fetchProperties(); 
        // Optionally update UI after deletion
      } else if (response.status === 404) {
        console.error('Property not found');
      } else {
        console.error('Failed to delete property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  }
  };
  
  

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Top Menu */}
      <Header />

      <div className="flex flex-col md:flex-row h-screen">
        {/* Sidebar */}
        <SideBar />

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-3xl font-semibold mb-6 text-black">Manage Properties</h2>

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
                
                <div className="mt-2 flex gap-2">
                    <button
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-700"
                      onClick={() => handleEdit(property.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                      onClick={() => handleDelete(property.id)}
                    >
                      Delete
                    </button>
                  </div>
            </div>
            </div>
          );
        })}
      </section>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
