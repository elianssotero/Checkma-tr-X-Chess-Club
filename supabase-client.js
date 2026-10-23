/* Public browser configuration only. Never place a Supabase service-role key here. */
(function () {
  "use strict";
  window.CHECKMAITREX_SUPABASE_URL = "https://rnkyboxouwczcyoygaxc.supabase.co";
  window.CHECKMAITREX_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_fBCgvVgimDYT4gYttlEJTA_-r8IfVL7";
  if (window.supabase && window.supabase.createClient) {
    window.checkmaitrexSupabase = window.supabase.createClient(
      window.CHECKMAITREX_SUPABASE_URL,
      window.CHECKMAITREX_SUPABASE_PUBLISHABLE_KEY,
      { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
    );
  }
})();
