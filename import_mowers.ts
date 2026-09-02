import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
  console.log('Fetching products from aio-vita.com...');
  try {
    const res = await fetch('https://aio-vita.com/wp-json/wc/store/products?per_page=100');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const products: any[] = await res.json();
    
    // Filter for mowers
    const mowers = products.filter((p: any) => 
      p.name.toLowerCase().includes('mower') || 
      p.name.toLowerCase().includes('mähroboter') ||
      p.slug.toLowerCase().includes('mower')
    );
    
    console.log(`Found ${mowers.length} mowers.`);
    
    for (const mower of mowers) {
      const price = mower.prices.price ? (parseInt(mower.prices.price, 10) / 100) : 0;
      const originalPrice = mower.prices.regular_price ? (parseInt(mower.prices.regular_price, 10) / 100) : price;
      
      const images = mower.images.map((img: any) => img.src);
      
      const newProduct = {
        id: mower.slug,
        slug: mower.slug,
        title: mower.name,
        description: mower.description,
        price: price,
        original_price: originalPrice,
        rating: 0,
        review_count: 0,
        images: images,
        condition: 'new',
        category: 'Lawn Mowers',
        brand: mower.name.includes('Husqvarna') ? 'Husqvarna' : 'Practixx',
        payee_email: 'support@cokaro.com', 
        currency: 'USD',
        checkout_link: '',
        checkout_flow: 'stripe',
        meta: {
          gmc_enabled: false,
          published: true
        },
        in_stock: mower.is_in_stock,
        is_featured: false,
        collections: ['electronics']
      };
      
      const { data: existing } = await supabaseAdmin
        .from('products')
        .select('id')
        .eq('slug', newProduct.slug)
        .single();
        
      if (existing) {
        console.log(`Updating ${newProduct.title} (slug: ${newProduct.slug})`);
        const { error } = await supabaseAdmin.from('products').update(newProduct).eq('id', existing.id);
        if (error) console.error(`Failed to update ${newProduct.title}:`, error);
      } else {
        console.log(`Inserting ${newProduct.title} (slug: ${newProduct.slug})`);
        const { error } = await supabaseAdmin.from('products').insert(newProduct);
        if (error) console.error(`Failed to insert ${newProduct.title}:`, error);
      }
    }
    console.log('Import completed!');
  } catch (error) {
    console.error('Error in script:', error);
  }
}
run();
