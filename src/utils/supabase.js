import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create client if keys exist, otherwise return a mock to prevent crash
export const supabase = (supabaseUrl && supabaseKey)
    ? createClient(supabaseUrl, supabaseKey)
    : {
        auth: {
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithOAuth: async () => ({ error: { message: 'Supabase keys missing in .env.local' } }),
            signOut: async () => { },
            getUser: async () => ({ data: { user: null } })
        },
        storage: {
            from: () => ({
                upload: async () => ({ error: { message: 'Supabase keys missing' } }),
                getPublicUrl: () => ({ data: { publicUrl: '' } })
            })
        }
    };
