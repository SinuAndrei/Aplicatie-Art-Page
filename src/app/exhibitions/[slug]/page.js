'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from '@/styles/exhibitions.module.css';

export default function ExhibDetails() {
  const { slug } = useParams(); // Obține slug-ul din URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProduct(slug) {
      const response = await fetch(
        `/api/get-products?product_id=${slug}&artType=exhibition`,
        {
          method: 'GET',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      // Obține datele din răspuns
      const productData = await response.json();

      const imageProductsArray = productData.imageProducts
        ? productData.imageProducts[0].split(',')
        : [];

      setProduct({ ...productData, imageProducts: imageProductsArray });
    }
    fetchProduct(slug);
  }, [slug]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 className={styles.title}>{product.title}</h1>
      <div className={styles.detailsContainer}>
        <div className={styles.imageProducts}>
          {product.imageProducts.map((img, index) => (
            <img
              key={index}
              src={`${img.replace('upload/', 'upload/q_20/')}?cache_control=public,max-age=31536000,immutable`}
              alt={`Product Image ${index + 1}`}
              className={styles.productImage}
            />
          ))}
        </div>
        <div className={styles.details}>
          <p>
            <strong>Category:</strong> {product.category}
          </p>
          <p>
            <strong>Description:</strong>
            {product.description}
          </p>
        </div>
      </div>
    </>
  );
}
