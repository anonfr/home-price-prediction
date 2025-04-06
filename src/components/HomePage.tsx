import React from 'react';
import { Home, Phone, Mail, Moon, Sun, LogOut, ArrowRight, MapPin, Bed, Bath, Square } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PropertyListing {
  id: string;
  ownerName: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  imageUrl: string;
  contact: {
    phone: string;
    email: string;
  };
}

interface HomePageProps {
  userEmail: string;
  onLogout: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  onNavigateToProject: () => void;
}

const SAMPLE_PROPERTIES: PropertyListing[] = [
  {
    id: '1',
    ownerName: 'Raj Sharma',
    location: 'Bandra West, Mumbai',
    price: 25000000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    contact: {
      phone: '+91 98765 43210',
      email: 'raj.sharma@email.com'
    }
  },
  {
    id: '2',
    ownerName: 'Priya Patel',
    location: 'Indiranagar, Bangalore',
    price: 18000000,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1000,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    contact: {
      phone: '+91 98765 43211',
      email: 'priya.patel@email.com'
    }
  },
  {
    id: '3',
    ownerName: 'Amit Kumar',
    location: 'Vasant Kunj, Delhi',
    price: 32000000,
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 1800,
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    contact: {
      phone: '+91 98765 43212',
      email: 'amit.kumar@email.com'
    }
  },
  {
    id: '4',
    ownerName: 'Meera Singh',
    location: 'Alipore, Kolkata',
    price: 28000000,
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1600566753051-f0b89df2dd90?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    contact: {
      phone: '+91 98765 43213',
      email: 'meera.singh@email.com'
    }
  },
  {
    id: '5',
    ownerName: 'Karthik Rajan',
    location: 'T Nagar, Chennai',
    price: 22000000,
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1300,
    imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    contact: {
      phone: '+91 98765 43214',
      email: 'karthik.rajan@email.com'
    }
  }
];

const HomePage: React.FC<HomePageProps> = ({
  userEmail,
  onLogout,
  isDarkMode,
  setIsDarkMode,
  onNavigateToProject
}) => {
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} Lac`;
    }
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-rose-50 dark:from-black dark:to-black p-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-[#111111] rounded-2xl shadow-xl p-8 transition-colors duration-300">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-8">
            <div className="flex items-center gap-3">
              <Home className="w-8 h-8 text-rose-600 dark:text-rose-500" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">Featured Properties</h1>
            </div>
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <button
                onClick={onNavigateToProject}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
              >
                Go to House Prediction
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome, {userEmail}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={onLogout}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut className="w-6 h-6 text-rose-600 dark:text-rose-500" />
                  </button>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Toggle dark mode"
                  >
                    {isDarkMode ? (
                      <Sun className="w-6 h-6 text-yellow-500" />
                    ) : (
                      <Moon className="w-6 h-6 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {SAMPLE_PROPERTIES.map((property) => (
              <div
                key={property.id}
                className="bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden transition-transform hover:scale-[1.02] duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={property.imageUrl}
                    alt={`Property in ${property.location}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-rose-600 font-semibold text-sm">
                    {formatPrice(property.price)}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 dark:text-white text-base sm:text-lg">{property.ownerName}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{property.location}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      {property.bedrooms}
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="w-4 h-4" />
                      {property.bathrooms}
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="w-4 h-4" />
                      {property.squareFeet} sq.ft
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm">
                    <a
                      href={`tel:${property.contact.phone}`}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </a>
                    <a
                      href={`mailto:${property.contact.email}`}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 