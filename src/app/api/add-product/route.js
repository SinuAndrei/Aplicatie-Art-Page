import authMiddleware from '@/middleware/authMiddleware';
import connectDB from '@/src/app/api/db/connect';
import Product from '@/models/productModel';
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
  console.log('formData', formData);
  const productId = formData.get('productId');
  const title = formData.get('title');
  const artType = formData.get('artType');
  const collection = formData.get('collection');
  const description = formData.get('description');
  const fabricationYear = formData.get('fabricationYear');
  const image = formData.get('image');

  try {
    if (productId) {
      // Editare produs existent
      const product = await Product.findById(productId);
      if (!product) {
        return NextResponse.json(
          { message: 'Product not found' },
          { status: 404 }
        );
      }

      // Șterge imaginea veche dacă există
      if (image) {
        const oldImagePublicId = product.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(
          `${product.artType}/${oldImagePublicId}`
        );
      }

      product.title = title;
      product.artType = artType;
      product.coLLection = collection;
      product.description = description;
      product.fabricationYear = fabricationYear;
      if (image) {
        product.image = image;
      }

      await product.save();
      return NextResponse.json(
        { message: 'Product edited successfully' },
        { status: 200 }
      );
    } else {
      // Adăugare produs nou
      const newProduct = new Product({
        title,
        artType,
        image: image,
        coLLection: collection,
        description,
        fabricationYear,
        user: req.user._id,
      });
      console.log('newProduct', newProduct);
      await newProduct.save();
      return NextResponse.json(
        { message: 'Product added successfully' },
        { status: 201 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Error handling product' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
