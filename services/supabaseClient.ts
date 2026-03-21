import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = 'https://yixjkiiwdbdaypxoupfm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpeGpraWl3ZGJkYXlweG91cGZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MTMyMTMsImV4cCI6MjA3MDM4OTIxM30.Ijeqgaqy8mWT_gcDBHul9Rgr5RVzze3Hk9MDWakiUS8';

export const isApiAvailable = !!(supabaseUrl && supabaseAnonKey);

if (!isApiAvailable) {
  throw new Error(`
      *******************************************************************************************
      ERROR: Supabase credentials are not set correctly.
      Please check the values in 'services/supabaseClient.ts'.
      *******************************************************************************************
    `);
}

/**
 * A custom fetch implementation that removes problematic headers from GET requests.
 * The Supabase client can send Content-Type for all requests, which may cause issues
 * with proxies or firewalls that block GET requests with a body-related header.
 * This wrapper mitigates "TypeError: Failed to fetch" in such environments.
 */
const customFetch: typeof fetch = (url, options) => {
    const method = options?.method?.toUpperCase() || 'GET';
    
    // For GET requests, we want to ensure no body-related headers are sent
    if (method === 'GET') {
        const newOptions = { ...options };
        const headers = new Headers(newOptions.headers || {});
        
        // Remove headers that should not be present in a GET request
        headers.delete('content-type');
        headers.delete('content-length');
        
        newOptions.headers = headers;
        
        // Ensure no body is sent with GET, as some environments strictly forbid it
        if ('body' in newOptions) {
            delete newOptions.body;
        }
        
        return fetch(url, newOptions);
    }
    
    return fetch(url, options);
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
    },
    global: {
      fetch: customFetch,
    }
});