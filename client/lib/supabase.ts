import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ajnenxygedrazpvjdbdo.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqbmVueHlnZWRyYXpwdmpkYmRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNjg3NzgsImV4cCI6MjA4MDY0NDc3OH0.TQ3eoWUZWncx9EHt_T1oZruTVVQmXtrztyc8ZHC64RY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
