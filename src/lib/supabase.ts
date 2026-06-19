import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://oyhuhkmprgneouggidse.supabase.co";

const supabaseAnonKey =
  "sb_publishable_HOvNsqViIITzM8vSHP7yzg_OlKIYJe2";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);