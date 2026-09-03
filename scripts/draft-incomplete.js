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

  let drafted = 0;
  for (const p of products) {
    const isPublished = p.meta && p.meta.published !== false;
    if (!isPublished) continue;

    let incomplete = false;
    const imgCount = Array.isArray(p.images) ? p.images.filter(Boolean).length : 0;
    if (imgCount < 2) incomplete = true;
    if (!p.title || p.title.trim() === '') incomplete = true;
    if (!p.description || p.description.trim() === '') incomplete = true;
    if (p.price == null || p.price <= 0) incomplete = true;

    if (incomplete) {
      const newMeta = { ...(p.meta || {}), published: false };
      const { error: updateError } = await supabase
        .from('products')
        .update({ meta: newMeta })
        .eq('id', p.id);
      
      if (!updateError) {
        drafted++;
        console.log('Drafted:', p.slug);
      }
    }
  }
  console.log('Done drafting. Total drafted:', drafted);
}
run();
