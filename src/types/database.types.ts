export type PropertyPrediction = {
  id: string;
  created_at: string;
  user_id: string;
  user_email: string;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  year_built: number;
  location: string;
  square_feet: number;
  predicted_price: number;
}

export type Database = {
  public: {
    Tables: {
      property_predictions: {
        Row: PropertyPrediction;
        Insert: Omit<PropertyPrediction, 'id' | 'created_at'>;
        Update: Partial<Omit<PropertyPrediction, 'id' | 'created_at'>>;
      };
    };
  };
}; 