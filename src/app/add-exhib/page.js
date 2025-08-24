'use client';

import { useRef, useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import AddExhibForm from '@/components/forms/addExhibForm';
import { removeExif, uploadToCloudinary } from '@/utils/imageUtils';

function AddExhibContent() {
  const formRef = useRef();
  const [loading, setLoading] = useState(true);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const param = useSearchParams();
  const productId = param.get('productId');

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/');
    } else {
      async function validateToken(token) {
        try {
          const response = await fetch('/api/validate-token', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Token validation failed');
          }

          if (productId) {
            const productResponse = await fetch(
              `/api/get-products?product_id=${productId}&artType=exhibition`,
              {
                method: 'GET',
              }
            );

            if (!productResponse.ok) {
              throw new Error('Failed to fetch product');
            }

            const productData = await productResponse.json();
            setProduct(productData);
          }

          setLoading(false);
        } catch (error) {
          console.error('Token validation error:', error);
          router.push('/');
        }
      }
      validateToken(token);
    }
  }, [router, productId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  async function handleAddExhibition(event) {
    setLoadingBtn(true);
    event.preventDefault();

    const token = Cookies.get('token');
    const formData = new FormData(event.target);

    if (productId) {
      formData.append('productId', productId);
    }

    const imageFile = formData.get('image');
    const imageProducts = formData.getAll('imageProducts');

    // 🔹 Construim array-ul de imagini și folderele corespunzătoare
    const imagesToUpload = [imageFile, ...imageProducts].filter(Boolean);
    const folders = [
      'exhibitions',
      ...imageProducts.map(() => 'exhibitionProducts'),
    ]; // Prima imagine → exhibitions, restul → exhibitionProducts

    try {
      const uploadPromises = imagesToUpload.map(async (img, index) => {
        if (img && img.name) {
          const compressedFile = await removeExif(img);
          console.log('Size after compression:', compressedFile.size);
          const imgData = await uploadToCloudinary(
            compressedFile, // ✅ Folosim fișierul comprimat
            folders[index] // ✅ Trimitem folderul corespunzător
          );
          return imgData.secure_url;
        }
        return null;
      });

      // 🚀 Așteptăm toate upload-urile simultan
      const imageUrls = (await Promise.all(uploadPromises)).filter(Boolean);

      // 🔹 Setăm imaginea principală și produsele
      formData.set('image', imageUrls[0]); // Prima imagine
      formData.set('imageProducts', imageUrls.slice(1).join(',')); // Restul imaginilor
    } catch (error) {
      console.error('Image processing error:', error);
      setError('Failed to process the images');
      return;
    }

    try {
      const response = await fetch('/api/add-exhib', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add exhibition');
      }

      router.push('/exhibitions');
    } catch (error) {
      console.error('Error adding exhibition:', error);
      alert('Failed to add exhibition. Please try again.');
    } finally {
      setLoadingBtn(false);
    }
  }

  return (
    <AddExhibForm
      ref={formRef}
      onSubmit={handleAddExhibition}
      error={error}
      product={product}
      loadingBtn={loadingBtn}
    />
  );
}

export default function AddProduct() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AddExhibContent />
    </Suspense>
  );
}
