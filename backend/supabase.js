import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

let client = null;
if (url && key) {
  try {
    client = createClient(url, key);
  } catch {
    client = null;
  }
}

export const supabaseEnabled = !!client;

export async function getState(rowKey) {
  if (!client) return null;
  try {
    const { data, error } = await client
      .from("app_state")
      .select("value")
      .eq("key", rowKey)
      .maybeSingle();
    if (error) return null;
    return data?.value ?? null;
  } catch {
    return null;
  }
}

export async function setState(rowKey, value) {
  if (!client) return false;
  try {
    const { error } = await client
      .from("app_state")
      .upsert({ key: rowKey, value }, { onConflict: "key" });
    return !error;
  } catch {
    return false;
  }
}
