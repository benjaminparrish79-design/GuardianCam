import { createClient } from "@supabase/supabase-js";
import { ENV } from "./_core/env";

// Admin client (bypasses RLS) - use only on server
export const supabaseAdmin = createClient(
  ENV.supabaseUrl,
  ENV.supabaseSecretKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// User client (respects RLS) - use with user auth
export function createUserClient(accessToken: string) {
  return createClient(
    ENV.supabaseUrl,
    ENV.supabasePublishableKey,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

// Database types
export interface Camera {
  id: string;
  user_id: string;
  name: string;
  location: string;
  type: string;
  status: "online" | "offline";
  last_seen: string;
  created_at: string;
}

export interface Event {
  id: string;
  user_id: string;
  camera_id: string;
  camera_name: string;
  type: string;
  description: string;
  severity: "low" | "medium" | "high";
  time: string;
}

export interface ShareLink {
  id: string;
  user_id: string;
  camera_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}
