import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://prffhhkemxibujjjiyhg.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByZmZoaGtlbXhpYnVqamppeWhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MzM4NzMsImV4cCI6MjA1OTIwOTg3M30.pPFBIdXzXGNkIKK_bVOQjWyJQBFHILnX2tB0I8Tg5Rw";

// Server-side Supabase client (no cookies needed for public data)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
});

export type { BlogPost, PublicTrip, KeyFact } from "./types";
