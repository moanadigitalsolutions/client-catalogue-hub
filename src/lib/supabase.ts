import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ffamaeearrzchaxuamcl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmYW1hZWVhcnJ6Y2hheHVhbWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzMzc3NTUsImV4cCI6MjA1MTkxMzc1NX0.BlU9-Xq9H-Z5eQ36XELQSryEeb1WQxeEui3pJrwLeiQ';

if (!supabaseUrl) throw new Error('Missing SUPABASE_URL');
if (!supabaseAnonKey) throw new Error('Missing SUPABASE_ANON_KEY');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Function to check database connection and create tables if they don't exist
export const initializeDatabase = async () => {
  console.log('Checking database connection and tables...');
  
  try {
    // Test the connection by attempting to query the clients table
    const { error: queryError } = await supabase
      .from('clients')
      .select('id')
      .limit(1);

    if (queryError) {
      console.log('Creating clients table as it does not exist...');
      
      // Create the clients table directly
      const { error: createError } = await supabase.rpc('exec', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.clients (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            street TEXT,
            suburb TEXT,
            city TEXT,
            postcode TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
          );
          
          -- Enable Row Level Security
          ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
          
          -- Create policy to allow all operations for authenticated users
          CREATE POLICY "Allow full access to authenticated users" ON public.clients
            FOR ALL USING (auth.role() = 'authenticated');
        `
      });

      if (createError) {
        console.error('Error creating clients table:', createError);
        throw createError;
      }
      
      console.log('Clients table created successfully');
    } else {
      console.log('Successfully connected to Supabase and verified clients table exists');
    }

    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

// Initialize the database when the app starts
initializeDatabase()
  .then(() => {
    console.log('Database initialization completed');
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
  });