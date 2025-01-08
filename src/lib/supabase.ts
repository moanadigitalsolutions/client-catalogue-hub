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

// Function to check database connection and verify table existence
export const initializeDatabase = async () => {
  console.log('Checking database connection...');
  
  try {
    // Test the connection by attempting to query the clients table
    const { count, error } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error querying clients table:', error);
      throw error;
    }

    console.log('Successfully connected to database and verified clients table exists');
    console.log(`Number of clients in database: ${count}`);
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

// Initialize the database when the app starts
initializeDatabase()
  .then(() => {
    console.log('Database initialization completed successfully');
  })
  .catch((error) => {
    console.error('Failed to initialize database:', error);
  });