const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Manually parse .env.local
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    env[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/(^"|"$)/g, '');
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing config in .env.local", { url, key });
  process.exit(1);
}

const supabase = createClient(url, key);

async function check() {
  console.log("Checking DB with url:", url);
  const { data: profiles, error } = await supabase.from('profiles').select('*');
  if (error) {
    console.error("Profiles error:", error);
  } else {
    console.log("Profiles in DB:", profiles.map(p => ({ id: p.id, store_name: p.store_name, store_handle: p.store_handle, email: p.email })));
  }
}

check();
