'use client';

import { useState, useEffect } from 'react';
import styles from '@/styles/add.module.css';
import imageCompression from 'browser-image-compression';

export default function AddFormInput({
  name,
  placeHolder,
  type,
  children,
  options,
  value,
}) {
  const [field, setField] = useState(value || '');
  const [preview, setPreview] = useState(null); // Pentru previzualizarea imaginii

  useEffect(() => {
    setField(value || '');
  }, [value]); // Pentru previzualizarea imaginii

  const handleChange = async (e) => {
    if (type === 'file') {
      const file = e.target.files[0];
      console.log('Dimensiune la adăugare:', file.size);

      if (file) {
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
          setPreview(compressedImageUrl);

          // Trimite fișierul comprimat la server sau gestionează-l după cum este necesar
          setField(compressedFile);
        } catch (error) {
          console.error('Eroare la comprimarea imaginii:', error);
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
            className={styles.fileInput}
            accept="image/*"
            required
          />
          {preview && (
            <div className={styles.imageContainer}>
              <img
                src={preview}
                alt="Preview"
                className={styles.imagePreview}
              />
            </div>
          )}
        </>
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          onChange={handleChange}
          value={field}
          required
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
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
