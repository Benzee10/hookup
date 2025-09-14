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
 * A custom fetch implementation that removes the Content-Type header from GET requests.
 * The Supabase client can send Content-Type for all requests, which may cause issues
 * with proxies or firewalls that block GET requests with a body-related header.
 * This wrapper mitigates "TypeError: Failed to fetch" in such environments.
 */
const customFetch: typeof fetch = (url, options) => {
    // If it's not a GET request or there are no options/headers, pass through.
    if (!options || options.method?.toUpperCase() !== 'GET' || !options.headers) {
        return fetch(url, options);
    }

    // It's a GET request with headers. Create a copy to modify.
    const newOptions = { ...options };
    
    // The Headers constructor is robust and can handle Headers object, array, or plain object.
    const headers = new Headers(newOptions.headers);
    headers.delete('Content-Type');
    newOptions.headers = headers;
    
    return fetch(url, newOptions);
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
    },
    global: {
      fetch: customFetch,
    }
});