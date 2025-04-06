import React, { useState, useEffect } from 'react';
import { Home, Calendar, Bed, Bath, Building2, Calculator, IndianRupee, TrendingUp, MapPin, Square, Moon, Sun, LogOut, ArrowLeft } from 'lucide-react';
import AuthPage from './components/auth/AuthPage';
import HomePage from './components/HomePage';
import { supabase } from './lib/supabase';

interface PredictionInputs {
  bedrooms: number;
  bathrooms: number;
  floors: number;
  yearBuilt: number;
  location: string;
  squareFeet: number;
  projectionYears: number;
}

const LOCATIONS = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Nagpur', 'Bhopal', 'Chandigarh', 'Thiruvananthapuram',
  'Patna', 'Raipur', 'Gandhinagar', 'Ranchi', 'Bhubaneswar',
  'Dehradun', 'Shimla', 'Panaji', 'Shillong', 'Imphal',
  'Aizawl', 'Kohima', 'Agartala', 'Itanagar', 'Dispur'
].sort();

const FLOORS = Array.from({ length: 31 }, (_, i) => i.toString());
const YEARS = Array.from({ length: 126 }, (_, i) => (1900 + i).toString());

const LOCATION_MULTIPLIERS: { [key: string]: number } = {
  'Mumbai': 2.5,
  'Delhi': 2.2,
  'Bangalore': 2.0,
  'Hyderabad': 1.8,
  'Chennai': 1.7,
  'Kolkata': 1.5,
  'Pune': 1.6,
  'Ahmedabad': 1.4,
  'Jaipur': 1.3,
  'Lucknow': 1.2,
  'Nagpur': 1.3,
  'Bhopal': 1.2,
  'Chandigarh': 1.5,
  'Thiruvananthapuram': 1.4,
  'Patna': 1.1,
  'Raipur': 1.1,
  'Gandhinagar': 1.3,
  'Ranchi': 1.1,
  'Bhubaneswar': 1.2,
  'Dehradun': 1.3,
  'Shimla': 1.4,
  'Panaji': 1.5,
  'Shillong': 1.2,
  'Imphal': 1.1,
  'Aizawl': 1.1,
  'Kohima': 1.1,
  'Agartala': 1.1,
  'Itanagar': 1.1,
  'Dispur': 1.2
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [currentPage, setCurrentPage] = useState<'home' | 'project'>('home');

  const [inputs, setInputs] = useState<PredictionInputs>({
    bedrooms: 3,
    bathrooms: 2,
    floors: 1,
    yearBuilt: 2000,
    location: 'Mumbai',
    squareFeet: 1200,
    projectionYears: 5
  });
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [futurePrice, setFuturePrice] = useState<number | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        setUserEmail(session.user.email || '');
        setUser({
          id: session.user.id,
          email: session.user.email || ''
        });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setUserEmail(session?.user?.email || '');
      if (session) {
        setUser({
          id: session.user.id,
          email: session.user.email || ''
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleAuthentication = (email: string) => {
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setIsAuthenticated(false);
      setUserEmail('');
    }
  };

  const handleSquareFeetChange = (value: number) => {
    const clampedValue = Math.min(Math.max(value, 200), 20000);
    setInputs({ ...inputs, squareFeet: clampedValue });
  };

  const handleFloorsChange = (value: number) => {
    const clampedValue = Math.min(Math.max(value, 1), 30);
    setInputs({ ...inputs, floors: clampedValue });
  };

  const predictPrice = () => {
    // Basic formula: This is a simplified model for demonstration
    const basePrice = 2500000; // 25 Lakhs base price
    const bedroomValue = inputs.bedrooms * 1000000; // 10 Lakhs per bedroom
    const bathroomValue = inputs.bathrooms * 500000; // 5 Lakhs per bathroom
    const floorValue = inputs.floors * 1500000; // 15 Lakhs per floor
    const ageValue = (2024 - inputs.yearBuilt) * -20000; // Age depreciation
    const squareFeetValue = inputs.squareFeet * 3000; // 3000 INR per sq ft
    const locationMultiplier = LOCATION_MULTIPLIERS[inputs.location] || 1;

    const predicted = (basePrice + bedroomValue + bathroomValue + floorValue + ageValue + squareFeetValue) * locationMultiplier;
    setCurrentPrice(Math.max(predicted, 1000000));
    
    // Future price with 8% annual appreciation (typical Indian real estate appreciation)
    const futurePrice = predicted * Math.pow(1.08, inputs.projectionYears);
    setFuturePrice(Math.max(futurePrice, 1000000));
  };

  const formatIndianPrice = (price: number) => {
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    });
    return formatter.format(price);
  };

  const savePrediction = async () => {
    if (!currentPrice || !user) {
      console.error('Missing required data:', { currentPrice, user });
      alert('Missing required data for saving prediction');
      return;
    }

    setIsSaving(true);
    try {
      const predictionData = {
        user_id: user.id,
        user_email: user.email,
        bedrooms: inputs.bedrooms,
        bathrooms: inputs.bathrooms,
        floors: inputs.floors,
        year_built: inputs.yearBuilt,
        location: inputs.location,
        square_feet: inputs.squareFeet,
        predicted_price: currentPrice,
        created_at: new Date().toISOString()
      };

      console.log('Attempting to save prediction with data:', predictionData);

      const { data, error } = await supabase
        .from('property_predictions')
        .insert([predictionData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }

      console.log('Successfully saved prediction:', data);
      alert('Prediction saved successfully!');
    } catch (error) {
      console.error('Full error object:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to save prediction: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Project page content
  const ProjectContent = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-rose-50 dark:from-black dark:to-black p-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-[#111111] rounded-2xl shadow-xl p-8 transition-colors duration-300">
          {/* Project Header with Back Button */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage('home')}
                className="flex items-center gap-2 text-rose-600 dark:text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
                <span className="text-sm font-medium">Back to Home</span>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, {userEmail}
              </div>
              <button
                onClick={handleLogout}
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

          {/* Rest of the project content */}
          <div className="flex items-center gap-3 mb-8">
            <Home className="w-8 h-8 text-rose-600 dark:text-rose-500" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Indian House Price Predictor</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin className="w-5 h-5" />
                  <span>Location</span>
                </label>
                <select
                  value={inputs.location}
                  onChange={(e) => setInputs({ ...inputs, location: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white"
                >
                  {LOCATIONS.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
                  <Square className="w-5 h-5" />
                  <span>Square Feet (200-20,000)</span>
                </label>
                <input
                  type="number"
                  value={inputs.squareFeet}
                  onChange={(e) => handleSquareFeetChange(Number(e.target.value))}
                  onBlur={(e) => handleSquareFeetChange(Number(e.target.value))}
                  min="200"
                  max="20000"
                  step="50"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
                  <Bed className="w-5 h-5" />
                  <span>Number of Bedrooms</span>
                </label>
                <input
                  type="number"
                  value={inputs.bedrooms}
                  onChange={(e) => setInputs({ ...inputs, bedrooms: Math.min(Math.max(Number(e.target.value), 1), 120) })}
                  min="1"
                  max="120"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
                  <Bath className="w-5 h-5" />
                  <span>Number of Bathrooms</span>
                </label>
                <input
                  type="number"
                  value={inputs.bathrooms}
                  onChange={(e) => setInputs({ ...inputs, bathrooms: Math.min(Math.max(Number(e.target.value), 1), 100) })}
                  min="1"
                  max="100"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
                  <Building2 className="w-5 h-5" />
                  <span>Number of Floors</span>
                </label>
                <select
                  value={inputs.floors}
                  onChange={(e) => handleFloorsChange(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white"
                >
                  {FLOORS.map(floor => (
                    <option key={floor} value={floor}>
                      {floor === '0' ? 'Ground Floor' : `${floor} Floor${floor === '1' ? '' : 's'}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar className="w-5 h-5" />
                  <span>Year Built</span>
                </label>
                <select
                  value={inputs.yearBuilt}
                  onChange={(e) => setInputs({ ...inputs, yearBuilt: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-rose-500 focus:border-transparent bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white"
                >
                  {YEARS.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Projection Years: {inputs.projectionYears}</span>
                </label>
                <div className="relative py-2">
                  <input
                    type="range"
                    value={inputs.projectionYears}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setInputs({ ...inputs, projectionYears: value });
                    }}
                    min="1"
                    max="100"
                    step="1"
                    className="relative w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-5
                      [&::-webkit-slider-thumb]:h-5
                      [&::-webkit-slider-thumb]:bg-rose-600
                      [&::-webkit-slider-thumb]:dark:bg-rose-500
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:border-2
                      [&::-webkit-slider-thumb]:border-white
                      [&::-webkit-slider-thumb]:dark:border-gray-900
                      [&::-webkit-slider-thumb]:shadow-md
                      [&::-webkit-slider-thumb]:hover:shadow-lg
                      [&::-webkit-slider-thumb]:transition-all
                      [&::-webkit-slider-thumb]:hover:scale-110
                      [&::-webkit-slider-thumb]:translate-y-[-3px]
                      
                      [&::-moz-range-thumb]:appearance-none
                      [&::-moz-range-thumb]:w-5
                      [&::-moz-range-thumb]:h-5
                      [&::-moz-range-thumb]:bg-rose-600
                      [&::-moz-range-thumb]:dark:bg-rose-500
                      [&::-moz-range-thumb]:rounded-full
                      [&::-moz-range-thumb]:border-2
                      [&::-moz-range-thumb]:border-white
                      [&::-moz-range-thumb]:dark:border-gray-900
                      [&::-moz-range-thumb]:shadow-md
                      [&::-moz-range-thumb]:hover:shadow-lg
                      [&::-moz-range-thumb]:transition-all
                      [&::-moz-range-thumb]:hover:scale-110
                      [&::-moz-range-thumb]:translate-y-[-3px]
                      
                      [&::-webkit-slider-runnable-track]:h-2.5
                      [&::-webkit-slider-runnable-track]:rounded-lg
                      [&::-webkit-slider-runnable-track]:bg-gray-200
                      [&::-webkit-slider-runnable-track]:dark:bg-gray-700
                      
                      [&::-moz-range-track]:h-2.5
                      [&::-moz-range-track]:rounded-lg
                      [&::-moz-range-track]:bg-gray-200
                      [&::-moz-range-track]:dark:bg-gray-700
                      
                      focus:outline-none
                      focus:ring-2
                      focus:ring-rose-500
                      focus:ring-offset-2
                      dark:focus:ring-offset-gray-900"
                  />
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                    <span>1 year</span>
                    <span>100 years</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              onClick={predictPrice}
              className="flex-1 bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              Calculate Prediction
            </button>

            {currentPrice && (
              <button
                onClick={savePrediction}
                disabled={isSaving}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <span className="w-5 h-5">💾</span>
                    Save Prediction
                  </>
                )}
              </button>
            )}
          </div>

          {currentPrice && futurePrice && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <IndianRupee className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-800">Current Estimated Price</h3>
                </div>
                <p className="text-3xl font-bold text-blue-600">
                  {formatIndianPrice(currentPrice)}
                </p>
              </div>

              <div className="bg-green-50 p-6 rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  <h3 className="text-xl font-semibold text-gray-800">{inputs.projectionYears}-Year Projection</h3>
                </div>
                <p className="text-3xl font-bold text-green-600">
                  {formatIndianPrice(futurePrice)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return <AuthPage onAuthenticated={handleAuthentication} />;
  }

  if (currentPage === 'home') {
    return (
      <HomePage
        userEmail={userEmail}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onNavigateToProject={() => setCurrentPage('project')}
      />
    );
  }

  return <ProjectContent />;
}

export default App;