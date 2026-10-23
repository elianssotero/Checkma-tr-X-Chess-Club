
const SUPABASE_URL = "https://rnkyboxouwczcyoygaxc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_fBCgvVgimDYT4gYttlEJTA_-r8IfVL7";

if (!window.supabase) {
  console.error("Supabase library not loaded. Check the CDN script.");
} else if (!SUPABASE_PUBLISHABLE_KEY) {
  console.error("Supabase publishable key is missing.");
} else {
  window.clubSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );
}
