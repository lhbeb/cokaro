const { createClient } = require('@supabase/supabase-js');
const { translate } = require('@vitalets/google-translate-api');
const http = require('http');

const supabase = createClient(
  'https://jzwztiyhjfxycerwkpfb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6d3p0aXloamZ4eWNlcndrcGZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTYyNjY1NCwiZXhwIjoyMTAxMjAyNjU0fQ.Pm3mbu08SOzOn6LH8Dv0DTFsVfMir2WT09ewLu3oG_M'
);

const delay = ms => new Promise(res => setTimeout(res, ms));

async function run() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, slug, title, description')
    .limit(1000); // adjust limit if needed

  if (error) { console.error('Error:', error); return; }

  const germanRegex = /\b(und|der|die|das|mit|fuer|von|ist|sind|oder|ein|eine|aus|auf|bei|nach)\b/i;
  const germanChars = /[äöüß]/i;

  const toTranslate = products.filter(p => {
    const title = p.title || '';
    const desc = p.description || '';
    return germanRegex.test(title) || germanChars.test(title) ||
           germanRegex.test(desc) || germanChars.test(desc);
  });

  console.log('Found ' + toTranslate.length + ' products to translate.');

  let updated = 0;
  let failed = 0;

  for (let i = 0; i < toTranslate.length; i++) {
    const p = toTranslate[i];
    try {
      let newTitle = p.title;
      let newDesc = p.description;

      if (p.title) {
        const res = await translate(p.title, { to: 'en' });
        newTitle = res.text;
      }
      if (p.description) {
        // chunk description if it's too long, but let's try direct first
        const res = await translate(p.description, { to: 'en' });
        newDesc = res.text;
      }

      const { error: upErr } = await supabase
        .from('products')
        .update({ title: newTitle, description: newDesc, updated_at: new Date().toISOString() })
        .eq('id', p.id);

      if (upErr) throw upErr;

      updated++;
      console.log('[' + (i+1) + '/' + toTranslate.length + '] Translated: ' + p.slug);
    } catch (e) {
      console.error('[' + (i+1) + '/' + toTranslate.length + '] Error on ' + p.slug + ':', e.message);
      failed++;
    }
    
    // rate limit protection
    await delay(1000);
  }

  console.log('Done! Updated: ' + updated + ' Failed: ' + failed);
}

run();
