'use client';

import { forwardRef, useEffect } from 'react';
import styles from '@/styles/add.module.css';
import AddFormInput from './addFormInput';
import { textDataProductForm } from '../textData';

const AddForm = forwardRef(
  ({ onSubmit, error, product = null, loadingBtn }, ref) => {
    useEffect(() => {
      if (product) {
        ref.current.title.value = product.title || '';
        ref.current.artType.value = product.artType || '';
        ref.current.collection.value = product.coLLection || '';
        ref.current.description.value = product.description || '';
        ref.current.fabricationYear.value = product.fabricationYear || '';
      }
    }, [product, ref]);

    const lastIndex = textDataProductForm.length - 1;

    return (
      <form onSubmit={onSubmit} ref={ref} className={styles.addForm}>
        <div className={styles.containerInputs}>
          <div className={styles.leftContainer}>
            {textDataProductForm
              .slice(0, lastIndex)
              .map((inputProps, index) => (
                <AddFormInput key={index} {...inputProps}>
                  {inputProps.label}
                </AddFormInput>
              ))}
            <button
              type="submit"
              className={`${styles.desktopSubmitButton} ${loadingBtn ? styles.loadingBtn : ''}`}
            >
              {loadingBtn
                ? 'Submitting...'
                : product
                  ? 'Edit Product'
                  : 'Add Product'}
            </button>
          </div>
          <div className={styles.rightContainer}>
            {textDataProductForm[lastIndex] && (
              <AddFormInput {...textDataProductForm[lastIndex]}>
                {textDataProductForm[lastIndex].label}
              </AddFormInput>
            )}
          </div>
        </div>
        <button
          type="submit"
          className={`${styles.mobileSubmitButton} ${loadingBtn ? styles.loadingBtn : ''}`}
        >
          {loadingBtn
            ? 'Submitting...'
            : product
              ? 'Edit Product'
              : 'Add Product'}
        </button>
        {error && <p>{error}</p>}
      </form>
    );
  }
);

export default AddForm;
