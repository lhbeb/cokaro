const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://jzwztiyhjfxycerwkpfb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6d3p0aXloamZ4eWNlcndrcGZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTYyNjY1NCwiZXhwIjoyMTAxMjAyNjU0fQ.Pm3mbu08SOzOn6LH8Dv0DTFsVfMir2WT09ewLu3oG_M'
);

async function run() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, slug, title, description')
    .limit(1000);

  if (error) { console.error('Error:', error); return; }

  const germanRegex = /\b(und|der|die|das|mit|fuer|von|ist|sind|oder|ein|eine|aus|auf|bei|nach)\b/i;
  const germanChars = /[äöüß]/i;

  const toTranslate = products.filter(p => {
    const title = p.title || '';
    const desc = p.description || '';
    return germanRegex.test(title) || germanChars.test(title) ||
           germanRegex.test(desc) || germanChars.test(desc);
  });

  fs.writeFileSync('scripts/to_translate.json', JSON.stringify(toTranslate, null, 2));
  console.log('Saved ' + toTranslate.length + ' products to scripts/to_translate.json');
}

run();
