import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/data';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const products = await getAllProducts();
    const categories = Array.from(new Set(products.map((p: any) => p.category?.trim()).filter(Boolean)));
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
