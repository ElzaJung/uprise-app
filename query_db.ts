const supabaseUrl = 'https://luokxzkqekitqdmzvrhf.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1b2t4emtxZWtpdHFkbXp2cmhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxNTA0NjYsImV4cCI6MjA5MDcyNjQ2Nn0.LwbGy5uOP2Po548JEJm48i3W_KJyAjI05dwEq_KPUF4';

async function fetchTable(tableName: string) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${tableName}?select=*&limit=1`, {
    headers: {
      'apikey': anonKey,
      'Authorization': `Bearer ${anonKey}`
    }
  });
  console.log(`\n--- ${tableName} ---`);
  if (!res.ok) {
    console.log(`Failed to fetch ${tableName}: ${await res.text()}`);
  } else {
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  }
}

async function run() {
  await fetchTable('listing');
  await fetchTable('listing_description');
  await fetchTable('listing_contacts');
  await fetchTable('contacts');
}

run();
