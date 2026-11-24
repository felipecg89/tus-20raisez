import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://rkddhfwmtvajiswgkonw.supabase.co";
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_Ep0C3M_8J6OFhoF26DDMAw_vf1h_oSv";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
