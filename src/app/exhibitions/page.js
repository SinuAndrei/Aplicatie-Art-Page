'use client';

import { useEffect, useState, useRef } from 'react';
import styles from '@/styles/product.module.css';
import { useAuth } from '@/context/AuthContext';
import { parseCookies } from 'nookies';
import Product from '@/components/product/Product';

export default function Exhibitions() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const productRefs = useRef([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/get-products?artType=exhibition');
      const productsList = await response.json();
      setProducts(productsList);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Declanșează animația pentru fiecare produs atunci când filteredProducts se schimbă
    productRefs.current.forEach((ref) => {
      if (ref && ref.triggerAppear) {
        ref.triggerAppear();
      }
    });
  }, []);

  const handleDelete = async (productId) => {
    console.log('handleDelete called with productId:', productId); // Adaugă acest log
    const cookies = parseCookies();
    const response = await fetch('/api/delete-product?type=exhibitions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cookies.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }), // Trimitem token-ul și ID-ul produsului
    });

    const result = await response.json();
    console.log('Result:', result); // Adaugă acest log

    if (result.message === 'Exhibition deleted successfully') {
      console.log('Product deleted successfully');
      setProducts(products.filter((product) => product._id !== productId));
    } else {
      console.error('Error deleting product:', result.error);
    }
  };

  // Împarte produsele în trei coloane
  const columns = [[], [], []];
  if (loading) {
    return <div></div>; // Afișează mesajul de încărcare
  }
  if (!Array.isArray(products) || products.length === 0) {
    return <div>No products found.</div>;
  } else {
    products.forEach((product, index) => {
      columns[index % 3].push(product);
    });
  }

  return (
    <div className={styles.page}>
      <div className={styles['photo-gallery']}>
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className={styles.column}>
            {column.map((product, productIndex) => (
              <Product
                key={product._id}
                product={product}
                handleDelete={(id) => {
                  console.log('Calling handleDelete from Product:', id);
                  handleDelete(id);
                }}
                isAuthenticated={isAuthenticated}
                type={'exhibitions'}
                ref={(el) => (productRefs.current[productIndex] = el)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
