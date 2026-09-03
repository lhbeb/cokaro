const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://jzwztiyhjfxycerwkpfb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6d3p0aXloamZ4eWNlcndrcGZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTYyNjY1NCwiZXhwIjoyMTAxMjAyNjU0fQ.Pm3mbu08SOzOn6LH8Dv0DTFsVfMir2WT09ewLu3oG_M'
);

async function run() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, slug, title, description, price, images, meta');

  if (error) { console.error('Error fetching:', error); return; }

  const toDraft = [];
  const needsTranslation = [];

  const germanRegex = /\b(und|der|die|das|mit|fuer|von|ist|sind|oder|ein|eine|aus|auf|bei|nach)\b/i;
  const germanChars = /[äöüß]/i;

  for (const p of products) {
    let incomplete = false;
    let reasons = [];

    const imgCount = Array.isArray(p.images) ? p.images.filter(Boolean).length : 0;
    if (imgCount < 2) { incomplete = true; reasons.push('images < 2'); }
    if (!p.title || p.title.trim() === '') { incomplete = true; reasons.push('no title'); }
    if (!p.description || p.description.trim() === '') { incomplete = true; reasons.push('no description'); }
    if (p.price == null || p.price <= 0) { incomplete = true; reasons.push('invalid price'); }

    // Consider product published if meta.published is not strictly false
    const isPublished = p.meta && p.meta.published !== false;

    if (incomplete && isPublished) {
      toDraft.push({ id: p.id, slug: p.slug, reasons });
    }

    const titleStr = p.title || '';
    const descStr = p.description || '';
    if (germanRegex.test(titleStr) || germanChars.test(titleStr) || 
        germanRegex.test(descStr) || germanChars.test(descStr)) {
      needsTranslation.push({ id: p.id, slug: p.slug, title: titleStr });
    }
  }

  console.log('--- PRODUCTS TO DRAFT ---');
  console.log('Found ' + toDraft.length + ' products to draft.');
  toDraft.slice(0, 20).forEach(p => console.log('- ' + p.slug + ' (' + p.reasons.join(', ') + ')'));

  console.log('\n--- PRODUCTS TO TRANSLATE ---');
  console.log('Found ' + needsTranslation.length + ' products needing translation.');
  needsTranslation.slice(0, 20).forEach(p => console.log('- ' + p.slug + ': ' + p.title));
}
run();
