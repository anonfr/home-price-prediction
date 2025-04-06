import React, { useEffect, useState } from 'react';
import { Home, Phone, Mail, Moon, Sun, LogOut, ArrowRight, MapPin, Bed, Bath, Square, IndianRupee, Building2, Calendar, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PropertyPrediction } from '../types/database.types';

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
  setIsDarkMode: (isDark: boolean) => void;
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
  onNavigateToProject,
}) => {
  const [savedPredictions, setSavedPredictions] = useState<PropertyPrediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedPredictions();
  }, []);

  const fetchSavedPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from('property_predictions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedPredictions(data || []);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatIndianPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      
      return new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date not available';
    }
  };

  const handleDelete = async (predictionId: string, predictionUserEmail: string) => {
    if (predictionUserEmail !== userEmail) {
      alert('You can only delete your own predictions');
      return;
    }

    if (!confirm('Are you sure you want to delete this prediction?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('property_predictions')
        .delete()
        .eq('id', predictionId);

      if (error) throw error;

      fetchSavedPredictions();
      alert('Prediction deleted successfully');
    } catch (error) {
      console.error('Error deleting prediction:', error);
      alert('Failed to delete prediction. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-rose-50 dark:from-black dark:to-black p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-[#111111] rounded-2xl shadow-xl p-8 transition-colors duration-300">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Home className="w-8 h-8 text-rose-600 dark:text-rose-500" />
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Indian House Price Predictor</h1>
            </div>
            <div className="flex items-center gap-4">
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

          {/* New Prediction Button */}
          <button
            onClick={onNavigateToProject}
            className="w-full bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 transition-colors mb-8 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Make New Prediction
          </button>

          {/* Saved Predictions */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Recent Predictions</h2>
            
            {loading ? (
              <div className="text-center text-gray-600 dark:text-gray-400">Loading predictions...</div>
            ) : savedPredictions.length === 0 ? (
              <div className="text-center text-gray-600 dark:text-gray-400">No predictions saved yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedPredictions.map((prediction) => (
                  <div
                    key={prediction.id}
                    className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 space-y-4 relative group"
                  >
                    {prediction.user_email === userEmail && (
                      <button
                        onClick={() => handleDelete(prediction.id, prediction.user_email)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-800 text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50 dark:hover:bg-gray-700"
                        title="Delete prediction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-rose-600 dark:text-rose-500" />
                          <span className="font-medium text-gray-900 dark:text-white">{prediction.location}</span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          by {prediction.user_email}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Saved on {formatDate(prediction.created_at)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Bed className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{prediction.bedrooms} Beds</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bath className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{prediction.bathrooms} Baths</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{prediction.floors} Floors</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Built {prediction.year_built}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-5 h-5 text-green-600 dark:text-green-500" />
                        <span className="text-lg font-semibold text-green-600 dark:text-green-500">
                          {formatIndianPrice(prediction.predicted_price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 