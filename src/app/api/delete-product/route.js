import authMiddleware from '@/middleware/authMiddleware';
import connectDB from '@/src/app/api/db/connect';
import Product from '@/models/productModel';
import Exhibition from '@/models/exhibitionModel';
import cloudinary from '@/cloudinary';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await connectDB();

  const authResponse = await authMiddleware(req);
  if (authResponse.status !== 200) {
    return authResponse;
  }

  const url = new URL(req.url);
  const type = url.searchParams.get('type');

  const data = await req.json();

  try {
    if (type === 'exhibitions') {
      // Obține expoziția din baza de date
      const exhibition = await Exhibition.findById(data.productId);
      if (!exhibition) {
        console.log('Exhibition not found');
        return NextResponse.json(
          { message: 'Exhibition not found' },
          { status: 404 }
        );
      }

      // Șterge imaginea principală a expoziției din Cloudinary
      const mainImagePublicId = exhibition.image.split('/').pop().split('.')[0];
      console.log('Deleting main image', mainImagePublicId);
      const response = await cloudinary.uploader.destroy(
        `exhibitions/${mainImagePublicId}`
      );

      if (response.result === 'ok') {
        console.log('Image deleted successfully from cloudinary');
      }

      // Șterge imaginile produselor din expoziție din Cloudinary
      for (const img of exhibition.imageProducts[0].split(',')) {
        const imgPublicId = img.split('/').pop().split('.')[0];
        console.log('Deleting image', imgPublicId);
        const response = await cloudinary.uploader.destroy(
          `exhibitionProducts/${imgPublicId}`
        );
        if (response.result === 'ok') {
          console.log('Image deleted successfully from cloudinary');
        }
      }

      // Șterge expoziția din baza de date
      await Exhibition.findByIdAndDelete(data.productId);

      return NextResponse.json(
        { message: 'Exhibition deleted successfully' },
        { status: 200 }
      );
    } else {
      // Obține produsul din baza de date
      const product = await Product.findById(data.productId);
      if (!product) {
        return NextResponse.json(
          { message: 'Product not found' },
          { status: 404 }
        );
      }

      // Șterge imaginea produsului din Cloudinary
      const imagePublicId = product.image.split('/').pop().split('.')[0];
      console.log('Deleting image', imagePublicId);
      console.log('Deleting folder', type);
      await cloudinary.uploader.destroy(`${type}/${imagePublicId}`);

      // Șterge produsul din baza de date
      await Product.findByIdAndDelete(data.productId);

      return NextResponse.json(
        { message: 'Product deleted successfully' },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Error deleting product' },
      { status: 500 }
    );
  }
}
