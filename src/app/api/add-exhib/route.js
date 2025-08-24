import authMiddleware from '@/middleware/authMiddleware';
import connectDB from '@/src/app/api/db/connect';
import Exhibition from '@/models/exhibitionModel';
import cloudinary from '@/cloudinary';
import { NextResponse } from 'next/server';

// Funcție pentru a obține public_id din URL-ul imaginii
function getPublicId(url) {
  const parts = url.split('/');
  return parts.slice(-2).join('/').split('.')[0];
}

export async function POST(req) {
  await connectDB();

  const authResponse = await authMiddleware(req);
  if (authResponse.status !== 200) {
    return authResponse;
  }

  const formData = await req.formData();

  const title = formData.get('title');
  const category = formData.get('category');
  const description = formData.get('description');
  const image = formData.get('image');
  const imageProducts = formData.getAll('imageProducts');
  const productId = formData.get('productId');

  try {
    if (productId) {
      const product = await Exhibition.findById(productId);
      if (!product) {
        return NextResponse.json(
          { message: 'Product not found' },
          { status: 404 }
        );
      }

      if (product.image) {
        const publicId = getPublicId(product.image);
        await cloudinary.uploader.destroy(publicId); // Șterge imaginea principală veche
      }

      if (product.imageProducts && product.imageProducts.length > 0) {
        for (const oldImg of product.imageProducts[0].split(',')) {
          const publicId = getPublicId(oldImg);
          await cloudinary.uploader.destroy(publicId); // Șterge imaginile suplimentare vechi
        }
      }

      // Actualizează informațiile produsului
      product.title = title;
      product.category = category;
      product.description = description;
      if (image) {
        product.image = image;
      }
      if (imageProducts && imageProducts.length > 0) {
        product.imageProducts = imageProducts;
      }

      await product.save();
      return NextResponse.json(
        { message: 'Product edited successfully' },
        { status: 200 }
      );
    } else {
      const newExhibition = new Exhibition({
        title,
        category,
        description,
        image,
        imageProducts,
        user: req.user._id,
      });

      await newExhibition.save();

      return NextResponse.json(
        { message: 'Exhibition added successfully' },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Error handling exhibition' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
