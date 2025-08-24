'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/addExhib.module.css';
import imageCompression from 'browser-image-compression';

export default function AddFormInput({
  name,
  placeHolder,
  type,
  children,
  value,
  multiple = false, // Adăugăm prop pentru selecția multiplă
}) {
  const [field, setField] = useState(value || '');
  const [previews, setPreviews] = useState([]); // Pentru previzualizarea imaginilor multiple

  useEffect(() => {
    setField(value || '');
  }, [value]); // Pentru previzualizarea imaginii

  const handleChange = async (e) => {
    if (type === 'file') {
      const files = e.target.files;
      if (files.length > 0) {
        const previewsArray = [];
        const compressedFilesArray = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          try {
            // Opțiuni pentru comprimarea imaginii
            const options = {
              maxSizeMB: 0.5, // Dimensiunea maximă a fișierului în MB
              maxWidthOrHeight: 1280, // Dimensiunea maximă a laturii imaginii
              useWebWorker: true, // Folosește Web Worker pentru a evita blocarea UI
            };

            // Comprimă imaginea
            const compressedFile = await imageCompression(file, options);
            console.log('Dimensiune după comprimare:', compressedFile.size);

            // Creează un URL pentru previzualizarea imaginii comprimate
            const compressedImageUrl = URL.createObjectURL(compressedFile);
            previewsArray.push(compressedImageUrl);
            compressedFilesArray.push(compressedFile);

            // Setăm previzualizările și fișierele comprimate numai după ce toate fișierele au fost procesate
            if (previewsArray.length === files.length) {
              setPreviews(previewsArray);
              setField(compressedFilesArray);
            }
          } catch (error) {
            console.error('Eroare la comprimarea imaginii:', error);
          }
        }
      }
    } else {
      setField(e.target.value);
    }
  };

  return (
    <div className={styles.container}>
      <label htmlFor={name}>{children}</label>
      {type === 'file' ? (
        <>
          <input
            id={name}
            name={name}
            type={type}
            onChange={handleChange}
            accept="image/*"
            multiple={multiple}
            required
          />
          {previews.length > 0 && (
            <div className={styles.imageContainer}>
              {previews.map((preview, index) => (
                <img
                  className={styles.imagePreview}
                  key={index}
                  src={preview}
                  alt={`Preview ${index + 1}`}
                />
              ))}
            </div>
          )}
        </>
      ) : type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={field}
          type={type}
          onChange={handleChange}
          placeholder={placeHolder}
          required
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={field}
          onChange={handleChange}
          placeholder={placeHolder}
          required
        />
      )}
    </div>
  );
}
