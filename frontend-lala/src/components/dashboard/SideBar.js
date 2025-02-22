'use client';
import Link from 'next/link';
const SideBar = () => {
    return (
      <aside className="w-full md:w-64 bg-blue-900 text-white p-5 space-y-6 md:block hidden">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <nav className="space-y-3">

          <Link href="/dashboard"
            className="block p-2 bg-blue-700 rounded">Properties
          </Link>
          <Link href="/dashboard/add-property"
             className="block p-2 hover:bg-blue-700 rounded">Add Property
          </Link>
          <Link href="/dashboard/booking"
            className="block p-2 hover:bg-blue-700 rounded">Booking
          </Link>

        </nav>
      </aside>
    );
  };
  
  export default SideBar;
  