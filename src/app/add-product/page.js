'use client';

import { useRef, useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import AddForm from '@/components/forms/addForm';
import { removeExif, uploadToCloudinary } from '@/utils/imageUtils';

function AddProductContent() {
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
      router.push('/'); // Redirecționează la pagina de login dacă nu există token
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
          console.log(productId);
          if (productId) {
            const productResponse = await fetch(
              `/api/get-products?product_id=${productId}`,
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
          router.push('/'); // Redirecționează la pagina de login dacă validarea token-ului eșuează
        }
      }
      validateToken(token);
    }
  }, [router, productId]);

  if (loading) {
    return <p>Loading...</p>; // Afișează un mesaj de încărcare până când autentificarea este verificată
  }

  async function handleSubmit(event) {
    setLoadingBtn(true);
    event.preventDefault();
    const token = Cookies.get('token');

    if (!token) {
      setError('You must be logged in to add a product.');
      return;
    }

    const formData = new FormData(formRef.current);
    if (productId) {
      formData.append('productId', productId);
    }

    const imageFile = formData.get('image');
    console.log('Image size:', imageFile.size);
    const type = formData.get('artType');
    let imageUrl = '';
    if (imageFile && imageFile.name) {
      try {
        const compressedFile = await removeExif(imageFile);
        console.log('Size after compression:', compressedFile.size);
        const imageData = await uploadToCloudinary(compressedFile, type);
        console.log('Image data:', imageData);
        imageUrl = imageData.secure_url; // Stochează URL-ul imaginii încărcate
      } catch (error) {
        console.error('Image processing error:', error);
        setError('Failed to process the image');
        return;
      }
    }
    formData.set('image', imageUrl);

    try {
      const response = await fetch('/api/add-product', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          productId ? 'Failed to edit product' : 'Failed to add product'
        );
      }

      router.push(`/`); // Redirecționează la pagina corespunzătoare colecției
    } catch (error) {
      console.error('Error adding product:', error);
      setError(error.message);
    } finally {
      setLoadingBtn(false);
    }
  }

  return (
    <AddForm
      ref={formRef}
      onSubmit={handleSubmit}
      error={error}
      product={product}
      loadingBtn={loadingBtn}
    />
  );
}

export default function AddProduct() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AddProductContent />
    </Suspense>
  );
}
