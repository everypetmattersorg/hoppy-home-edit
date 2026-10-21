// Site settings. The Supabase anon key is safe to publish: the database only
// lets visitors INSERT consult requests, never read them.
// Leave the Supabase values empty and the form falls back to opening an email.
window.HHE_CONFIG = {
  supabaseUrl: "",      // e.g. "https://abcd1234.supabase.co"
  supabaseAnonKey: "",  // Project Settings → API → anon public key
  contactEmail: "",     // Emma's email, used for the fallback and error messages
  instagramUrl: ""      // e.g. "https://instagram.com/hoppyhomeedit"
};
