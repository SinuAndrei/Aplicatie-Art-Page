'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from '@/styles/product.module.css';

export default function ArtDetails() {
  const { slug } = useParams(); // Obține slug-ul din URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function fetchProduct(slug) {
      const response = await fetch(`/api/get-products?product_id=${slug}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }

      const productData = await response.json();
      setProduct(productData);
    }
    fetchProduct(slug);
  }, [slug]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.details}>
      <img
        src={`${product.image.replace('upload/', 'upload/q_20/')}?cache_control=public,max-age=31536000,immutable`}
        alt={product.title}
        className={styles.image}
      />
      <div className={styles.detailsContainer}>
        <h1>{product.title}</h1>
        <p>
          <strong>Collection:</strong> {product.coLLection}
        </p>
        <p>
          <strong>Description:</strong>
          {product.description}
        </p>
      </div>
    </div>
  );
}
