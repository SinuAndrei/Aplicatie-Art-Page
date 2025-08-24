'use client';

import Link from 'next/link';
import styles from '@/styles/product.module.css';
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useSearchParams } from 'next/navigation';

const Product = forwardRef(
  ({ product, handleDelete, isAuthenticated, type = null }, ref) => {
    const { title, image } = product;
    const searchParams = useSearchParams();
    const imgRef = useRef(null);
    const photoRef = useRef(null);

    useImperativeHandle(ref, () => ({
      triggerAppear: () => {
        const imgElement = imgRef.current;
        if (imgElement) {
          imgElement.classList.remove(styles.appear);
          // Forțează reflow pentru a reseta animația
          void imgElement.offsetWidth;
          imgElement.classList.add(styles.appear);
        }
      },
    }));

    useEffect(() => {
      const imgElement = imgRef.current;
      if (imgElement) {
        const handleLoad = () => {
          imgElement.classList.add(styles.appear);
        };

        imgElement.addEventListener('load', handleLoad);

        // Dacă imaginea este deja încărcată (de exemplu, din cache), adaugă clasa imediat
        if (imgElement.complete) {
          handleLoad();
        }

        return () => {
          imgElement.removeEventListener('load', handleLoad);
        };
      }
    }, [image]);

    useEffect(() => {
      const photoElement = photoRef.current;

      const handleTouchStart = (event) => {
        if (event.target.closest(`.${styles['card-btn']}`)) {
          return; // Nu opri event-ul pentru butoane
        }

        event.stopPropagation(); // Previne propagarea evenimentului pentru a nu declanșa evenimentul de click pe document
        if (photoElement.classList.contains(styles.touch)) {
          photoElement.classList.remove(styles.touch);
        } else {
          // Elimină clasa `touch` de pe toate celelalte elemente `.photo`
          document.querySelectorAll(`.${styles.photo}`).forEach((el) => {
            el.classList.remove(styles.touch);
          });
          photoElement.classList.add(styles.touch);
        }
      };

      const handleClickOutside = (event) => {
        if (event.target.closest(`.${styles['card-btn']}`)) {
          return; // Nu elimina `touch` dacă ai dat click pe un buton
        }
        // Elimină clasa `touch` de pe toate elementele `.photo`
        document.querySelectorAll(`.${styles.photo}`).forEach((el) => {
          el.classList.remove(styles.touch);
        });
      };

      photoElement.addEventListener('click', handleTouchStart);
      document.addEventListener('click', handleClickOutside);

      return () => {
        photoElement.removeEventListener('click', handleTouchStart);
        document.removeEventListener('click', handleClickOutside);
      };
    }, []);

    return (
      <div key={product._id} className={styles.photo} ref={photoRef}>
        <img
          ref={imgRef}
          src={`${product.image.replace('upload/', 'upload/q_20/')}?cache_control=public,max-age=31536000,immutable`}
          alt={title}
          className={styles['card-img']}
          width="960"
          height="600"
        />
        <div className={styles['card-body']}>
          <div className={styles.dataProd}>
            <h3 className={styles['card-title']}>{title}</h3>
            <p className={styles['card-text']}>{product.coLLection}</p>
          </div>
          <div className={styles.buttons}>
            <Link
              href={`/${type}/${product._id}`}
              className={styles['card-btn']}
            >
              View
            </Link>
            {isAuthenticated && (
              <>
                <button
                  onClick={() => {
                    console.log('Delete button clicked!');
                    handleDelete(product._id);
                  }}
                  className={styles['card-btn']}
                >
                  Delete
                </button>{' '}
                <Link
                  href={`/${type === 'exhibitions' ? 'add-exhib' : 'add-product'}?productId=${product._id}`}
                  className={styles['card-btn']}
                >
                  Edit
                </Link>{' '}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
);
export default Product;
