import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
  console.log('Fetching all products...');
  try {
    const { data: products, error } = await supabaseAdmin.from('products').select('id, title, price, original_price');
    
    if (error) {
      throw error;
    }
    
    console.log(`Found ${products.length} products. Applying 10% discount...`);
    
    for (const product of products) {
      if (!product.price) continue;
      
      const oldPrice = product.price;
      const newPrice = Number((oldPrice * 0.90).toFixed(2));
      
      // We also need to keep the original price in meta or original_price column if we want the sale to be visible
      const updateData = {
        price: newPrice,
        original_price: product.original_price || oldPrice // Keep the very first original price if it exists
      };
      
      const { error: updateError } = await supabaseAdmin
        .from('products')
        .update(updateData)
        .eq('id', product.id);
        
      if (updateError) {
        console.error(`Failed to update ${product.title}:`, updateError);
      } else {
        console.log(`[Verify] ${product.title}: $${oldPrice} -> $${newPrice}`);
      }
    }
    console.log('Price reduction completed!');
  } catch (error) {
    console.error('Error in script:', error);
  }
}
run();
