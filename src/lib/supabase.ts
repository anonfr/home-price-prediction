import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://byajmalgonjavyqdjlse.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5YWptYWxnb25qYXZ5cWRqbHNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4NDIyNzEsImV4cCI6MjA1OTQxODI3MX0.bfXdRDi15g90o-dElljTYk-vzeVptu5SM0YZAmwrwJg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 