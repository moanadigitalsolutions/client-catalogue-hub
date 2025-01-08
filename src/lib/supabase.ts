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

// Test the connection
supabase.from('clients').select('count', { count: 'exact', head: true })
  .then(() => {
    console.log('Successfully connected to Supabase');
  })
  .catch((error) => {
    console.error('Error connecting to Supabase:', error);
  });