import dotenv from "dotenv"
import { createClient } from '@supabase/supabase-js';

dotenv.config()



// Replace with your Supabase project details
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY );

