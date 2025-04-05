import React, { useState } from 'react';
import { Users, UserPlus, Save, Trash2, Moon, Sun, LogOut, ArrowRight, Home, Phone, Mail, IndianRupee, MapPin, Bed, Bath, Square } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PersonDetail {
  id: string;
  name: string;
  age: number;
  occupation: string;
  income: number;
  email: string;
  phone: string;
}

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
  const [people, setPeople] = useState<PersonDetail[]>([]);
  const [currentPerson, setCurrentPerson] = useState<PersonDetail>({
    id: '',
    name: '',
    age: 0,
    occupation: '',
    income: 0,
    email: '',
    phone: ''
  });

  const handleAddPerson = () => {
    if (people.length >= 10) {
      alert('Maximum 10 people can be added');
      return;
    }
    
    if (!currentPerson.name || !currentPerson.email) {
      alert('Name and email are required');
      return;
    }

    const newPerson = {
      ...currentPerson,
      id: Date.now().toString()
    };

    setPeople([...people, newPerson]);
    setCurrentPerson({
      id: '',
      name: '',
      age: 0,
      occupation: '',
      income: 0,
      email: '',
      phone: ''
    });
  };

  const handleDeletePerson = (id: string) => {
    setPeople(people.filter(person => person.id !== id));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentPerson(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'income' ? Number(value) : value
    }));
  };

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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Home className="w-8 h-8 text-rose-600 dark:text-rose-500" />
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Featured Properties</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={onNavigateToProject}
                className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
              >
                Go to House Prediction
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, {userEmail}
              </div>
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

          {/* Featured Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
                  <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-rose-600 font-semibold">
                    {formatPrice(property.price)}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 dark:text-white">{property.ownerName}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm mb-2">
                    <MapPin className="w-4 h-4" />
                    {property.location}
                  </div>
                  <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 text-sm mb-3">
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
                  <div className="flex items-center gap-3 text-sm">
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

          {/* Add Person Section Title */}
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-8 h-8 text-rose-600 dark:text-rose-500" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Add Person Details</h2>
          </div>

          {/* Input Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <input
                type="text"
                name="name"
                value={currentPerson.name}
                onChange={handleInputChange}
                placeholder="Full Name *"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white mb-4"
              />
              <input
                type="email"
                name="email"
                value={currentPerson.email}
                onChange={handleInputChange}
                placeholder="Email Address *"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white mb-4"
              />
              <input
                type="tel"
                name="phone"
                value={currentPerson.phone}
                onChange={handleInputChange}
                placeholder="Phone Number"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <input
                type="number"
                name="age"
                value={currentPerson.age || ''}
                onChange={handleInputChange}
                placeholder="Age"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white mb-4"
              />
              <input
                type="text"
                name="occupation"
                value={currentPerson.occupation}
                onChange={handleInputChange}
                placeholder="Occupation"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white mb-4"
              />
              <input
                type="number"
                name="income"
                value={currentPerson.income || ''}
                onChange={handleInputChange}
                placeholder="Annual Income"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Add Person Button */}
          <button
            onClick={handleAddPerson}
            disabled={people.length >= 10}
            className="w-full bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed mb-8"
          >
            <UserPlus className="w-5 h-5" />
            Add Person ({people.length}/10)
          </button>

          {/* People List */}
          <div className="space-y-4">
            {people.map((person) => (
              <div
                key={person.id}
                className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">{person.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {person.occupation} • {person.age} years • ₹{person.income.toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {person.email} • {person.phone}
                  </p>
                </div>
                <button
                  onClick={() => handleDeletePerson(person.id)}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Bottom Buttons */}
          <div className="mt-8 space-y-4">
            {people.length >= 5 && (
              <button
                onClick={onNavigateToProject}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Continue to Project
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 