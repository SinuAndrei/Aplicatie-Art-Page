'use client';

import { useEffect, useState, useRef } from 'react';
import styles from '@/styles/product.module.css';
import { useAuth } from '@/context/AuthContext';
import { parseCookies } from 'nookies';
import Product from '@/components/product/Product';

export default function Paintings() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const { isAuthenticated } = useAuth();
  const productRefs = useRef([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/get-products?artType=painting');
      const productsList = await response.json();
      setProducts(productsList);
      setFilteredProducts(productsList);

      const yearsSet = new Set();
      productsList.forEach((product) => {
        yearsSet.add(product.fabricationYear);
      });
      setYears([...yearsSet]);
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
  }, [filteredProducts]);

  const handleDelete = async (productId) => {
    const cookies = parseCookies();
    const response = await fetch('/api/delete-product?type=painting', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cookies.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId }), // Trimitem token-ul și ID-ul produsului
    });

    const result = await response.json();

    if (result.message === 'Product deleted successfully') {
      console.log('Product deleted successfully');
      setProducts(products.filter((product) => product._id !== productId));
      setFilteredProducts(
        filteredProducts.filter((product) => product._id !== productId)
      );
    } else {
      console.error('Error deleting product:', result.error);
    }
  };

  const handleYearFilter = (year) => {
    if (year === selectedYear) {
      setSelectedYear('');
      filterProducts('');
    } else {
      setSelectedYear(year);
      filterProducts(year);
    }
  };

  const filterProducts = (year) => {
    let filtered = products;
    if (year) {
      filtered = filtered.filter((product) => product.fabricationYear === year);
    }
    setFilteredProducts(filtered);
  };

  // Împarte produsele în trei coloane
  const columns = [[], [], []];
  if (loading) {
    return <div></div>; // Afișează mesajul de încărcare
  }
  console.log('filteredProducts:', filteredProducts);
  if (!Array.isArray(filteredProducts) || filteredProducts.length === 0) {
    return <div>No products found.</div>;
  } else {
    filteredProducts.forEach((product, index) => {
      columns[index % 3].push(product);
    });
  }

  return (
    <div className={styles.page}>
      <div className={styles.filters}>
        <div className={styles.yearFilter}>
          {years.map((year, index) => (
            <button
              key={index}
              onClick={() => handleYearFilter(year)}
              className={`${styles.filterBtn} ${selectedYear === year ? styles.filterBtnActive : ''}`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
      <div className={styles['photo-gallery']}>
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className={styles.column}>
            {column.map((product, productIndex) => (
              <Product
                key={`${product._id}-${selectedYear}`}
                product={product}
                handleDelete={handleDelete}
                isAuthenticated={isAuthenticated}
                type={'paintings'}
                ref={(el) => (productRefs.current[productIndex] = el)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
