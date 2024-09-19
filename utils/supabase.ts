import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_DATABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_DATABASE_ANON_KEY || "";


export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    localStorage: AsyncStorage as any,
    detectSessionInUrl: Platform.OS === 'web',
    autoRefreshToken: true,
    persistSession: true,
  },
});
