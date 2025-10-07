import React from 'react';

const TestEnv = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.squadbox_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.squadbox_NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const dbProvider = import.meta.env.VITE_DB_PROVIDER || import.meta.env.squadbox_DB_PROVIDER;

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Environment Variables Test</h2>
      <p><strong>VITE_SUPABASE_URL:</strong> {import.meta.env.VITE_SUPABASE_URL || 'NOT FOUND'}</p>
      <p><strong>squadbox_SUPABASE_URL:</strong> {import.meta.env.squadbox_SUPABASE_URL || 'NOT FOUND'}</p>
      <p><strong>VITE_SUPABASE_ANON_KEY:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? `${import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 20)}...` : 'NOT FOUND'}</p>
      <p><strong>squadbox_NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {import.meta.env.squadbox_NEXT_PUBLIC_SUPABASE_ANON_KEY ? `${import.meta.env.squadbox_NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...` : 'NOT FOUND'}</p>
      <p><strong>DB Provider:</strong> {dbProvider || 'NOT FOUND'}</p>
      
      <h3>Resolved Values:</h3>
      <p><strong>Final Supabase URL:</strong> {supabaseUrl || 'NOT FOUND'}</p>
      <p><strong>Final Supabase Key:</strong> {supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT FOUND'}</p>
      
      {!supabaseUrl || !supabaseAnonKey ? (
        <div style={{ color: 'red', marginTop: '20px' }}>
          <h3>❌ Environment Variables Missing</h3>
          <p>Please check your .env.local file and ensure the variables are set.</p>
        </div>
      ) : (
        <div style={{ color: 'green', marginTop: '20px' }}>
          <h3>✅ Environment Variables Found</h3>
          <p>Supabase configuration is ready!</p>
        </div>
      )}
    </div>
  );
};

export default TestEnv;
