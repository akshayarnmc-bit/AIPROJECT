import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Complaint {
  id: string;
  complaint_text: string;
  category: string;
  urgency: string;
  priority_score: number;
  user_email: string | null;
  status: string;
  created_at: string;
}
