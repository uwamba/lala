'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '@/components/dashboard/Header';
import SideBar from '@/components/dashboard/SideBar';
import Footer from '@/components/dashboard/Footer';
import PropertyForm from '@/components/dashboard/PropertyForm';

export default function PropertyManagement() {
  const [bookings, setBookings] = useState([]);
  const userEmail = "user@example.com"; // Replace with logged-in user email
  const userIsAdmin = true; // Adjust based on user role
  const accessToken = "YOUR_ACCESS_TOKEN"; // Replace with actual token

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/bookings/", {
        headers: { 
          "Authorization": `Bearer ${accessToken}` 
        }
      });
      if (!response.ok) throw new Error("Failed to fetch bookings");
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const updateBooking = async (bookingId, status) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/bookings/${bookingId}/update/`, {
        method: "PATCH",
        headers: { 
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        alert(`Booking ${status}`);
        fetchBookings();
      } else {
        alert("Failed to update booking.");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
    }
  };

  const deleteBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/bookings/${bookingId}/delete/`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${accessToken}` 
        }
      });
      if (response.ok) {
        alert("Booking deleted successfully!");
        fetchBookings();
      } else {
        alert("Failed to delete booking.");
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <>
<div className="bg-gray-100 min-h-screen flex flex-col">
  <Header />

  <div className="flex flex-col md:flex-row flex-1">
    <SideBar />

    <main className="flex-1 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Bookings</h2>
      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-3">Property</th>
            <th className="p-3">Renter</th>
            <th className="p-3">Check-In</th>
            <th className="p-3">Check-Out</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className="p-3 text-black">{booking.property?.title || 'N/A'}</td>
              <td className="p-3 text-black">{booking.renter?.email || 'Unknown'}</td>
              <td className="p-3 text-black">{booking.check_in}</td>
              <td className="p-3 text-black">{booking.check_out}</td>
              <td className={`p-3 font-bold ${booking.status === 'confirmed' ? 'text-green-500' : 'text-red-500'}`}>
                {booking.status}
              </td>
              <td className="p-3 space-x-2">
                {userIsAdmin && (
                  <>
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() => updateBooking(booking.id, 'confirmed')}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => updateBooking(booking.id, 'canceled')}
                    >
                      Reject
                    </button>
                  </>
                )}
                {(userEmail === booking.renter?.email || userIsAdmin) && (
                  <button
                    className="bg-gray-500 text-white px-3 py-1 rounded"
                    onClick={() => deleteBooking(booking.id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  </div>

  <Footer />
</div>


    </>
  );
}
