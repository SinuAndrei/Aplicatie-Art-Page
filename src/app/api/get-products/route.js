import connectDB from '@/src/app/api/db/connect';
import Product from '@/models/productModel';
import Exhibition from '@/models/exhibitionModel';
import { NextResponse } from 'next/server';

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const artType = searchParams.get('artType');
  const productId = searchParams.get('product_id');

  try {
    const Model = artType === 'exhibition' ? Exhibition : Product;

    if (productId) {
      const product = await Model.findById(productId);
      if (!product) {
        return NextResponse.json(
          {
            message: `${artType === 'exhibition' ? 'Exhibition' : 'Product'} not found`,
          },
          { status: 404 }
        );
      }
      return NextResponse.json(product, { status: 200 });
    }
    let products = [];
    if (artType === 'exhibition') {
      products = await Model.find();
    } else {
      products = await Model.find({ artType: artType });
    }

    // Verificăm dacă s-au găsit produse
    if (products.length === 0) {
      return NextResponse.json(
        {
          message: `No ${artType === 'exhibition' ? 'exhibitions' : 'products'} found`,
        },
        { status: 404 }
      );
    }

    const response = NextResponse.json(products, { status: 200 });
    return response;
  } catch (error) {
    console.error('Failed to fetch Data:', error);
    return NextResponse.json(
      { message: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
