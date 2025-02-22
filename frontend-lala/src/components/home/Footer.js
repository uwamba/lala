'use client';
const Footer = () => {
    return (
      <footer className="bg-blue-600 shadow mt-6 p-6 text-center text-white">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Column 1 */}
        <div>
          <p className="text-gray-200 font-semibold">Property Listings</p>
          <ul className="mt-2 text-gray-300">
            <li><a href="#" className="text-white hover:underline">Hotel Room Listings</a></li>
            <li><a href="#" className="text-white hover:underline">Available Properties</a></li>
            <li><a href="#" className="text-white hover:underline">Property for Sale</a></li>
          </ul>
        </div>
    
        {/* Column 2 */}
        <div>
          <p className="text-gray-200 font-semibold">Booking</p>
          <ul className="mt-2 text-gray-300">
            <li><a href="#" className="text-white hover:underline">Book a Room</a></li>
            <li><a href="#" className="text-white hover:underline">Schedule a Viewing</a></li>
            <li><a href="#" className="text-white hover:underline">Manage My Booking</a></li>
          </ul>
        </div>
    
        {/* Column 3 */}
        <div>
          <p className="text-gray-200 font-semibold">Social Media</p>
          <div className="mt-2 flex justify-start space-x-4">
            <a href="#" className="text-white hover:text-blue-200">Facebook</a>
            <a href="#" className="text-white hover:text-blue-200">Twitter</a>
            <a href="#" className="text-white hover:text-blue-200">LinkedIn</a>
            <a href="#" className="text-white hover:text-blue-200">Instagram</a>
            <a href="#" className="text-white hover:text-blue-200">YouTube</a>
          </div>
        </div>
      </div>
    
      <div className="mt-6 text-gray-300 text-sm">
        <p>Need assistance? Contact our <a href="#" className="text-white hover:underline">support team</a> for help with your <a href="#" className="text-white hover:underline">booking</a> or <a href="#" className="text-white hover:underline">property listings</a>.</p>
      </div>
    
      <p className="text-gray-200 mt-4">&copy; 2025 Property Management. All rights reserved.</p>
    </footer>
    
    



    );
  };
  
  export default Footer;
  