'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/dashboard/Header';
import SideBar from '@/components/dashboard/SideBar';
import Footer from '@/components/dashboard/Footer';
import PropertyForm from '@/components/dashboard/PropertyForm';


const AddProperty = () => {
  return (
         
  <div className="bg-gray-100 min-h-screen">
    <Header />

      <div className="flex flex-col md:flex-row h-screen">
      <SideBar />
      <main className="flex-1 p-6">
        <div className="container mx-auto p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Property</h2>
          <PropertyForm />
        
        </div>
      </main>
      </div>


      <Footer />
  </div>


    

    
  );
};

export default AddProperty;



