import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// This will help you see if the variables are empty strings or undefined
console.log("Supabase URL present:", !!supabaseUrl);
console.log("Supabase Key present:", !!supabaseKey);

export const supabase = createClient(
    supabaseUrl || 'https://missing-url.supabase.co',
    supabaseKey || 'missing-key'
);