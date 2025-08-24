'use client';

import { forwardRef, useEffect } from 'react';
import styles from '@/styles/addExhib.module.css';
import AddFormInput from './addExhibFormInput';
import { textDataExhibForm } from '../textData';
import Form from 'next/form';

const AddForm = forwardRef(
  ({ onSubmit, error, product = null, loadingBtn }, ref) => {
    useEffect(() => {
      if (product) {
        ref.current.title.value = product.title || '';
        ref.current.category.value = product.category || '';
        ref.current.description.value = product.description || '';
      }
    }, [product, ref]);

    const lastIndex = textDataExhibForm.length - 2;

    return (
      <Form onSubmit={onSubmit} ref={ref} className={styles.addForm}>
        <div className={styles.containerInputs}>
          <div className={styles.leftContainer}>
            {textDataExhibForm.slice(0, lastIndex).map((inputProps, index) => (
              <AddFormInput key={index} {...inputProps}>
                {inputProps.label}
              </AddFormInput>
            ))}
            <button
              type="submit"
              className={`${styles.desktopSubmitButton}  ${loadingBtn ? styles.loadingBtn : ''}`}
            >
              {loadingBtn
                ? 'Submitting...'
                : product
                  ? 'Edit Exhibition'
                  : 'Add Exhibition'}
            </button>
          </div>
          <div className={styles.rightContainer}>
            {textDataExhibForm.slice(lastIndex).map((inputProps, index) => (
              <AddFormInput key={index + lastIndex} {...inputProps}>
                {inputProps.label}
              </AddFormInput>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className={`${styles.mobileSubmitButton} ${loadingBtn ? styles.loadingBtn : ''}`}
        >
          {loadingBtn
            ? 'Submitting...'
            : product
              ? 'Edit Exhibition'
              : 'Add Exhibition'}
        </button>
        {error && <p>{error}</p>}
      </Form>
    );
  }
);

export default AddForm;
