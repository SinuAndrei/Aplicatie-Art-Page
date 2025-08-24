'use client';

import imageCompression from 'browser-image-compression';

// Funcția pentru a elimina metadatele EXIF
export const removeExif = async (file) => {
  const options = {
    maxSizeMB: 0.5, // Dimensiunea maximă a fișierului în MB
    maxWidthOrHeight: 1280, // Dimensiunea maximă a laturii imaginii
    useWebWorker: true,
    fileType: 'image/webp', // Formatul imaginii
  };
  // Comprimă imaginea
  const compressedFile = await imageCompression(file, options);
  return compressedFile;
};

// Funcția de redimensionare și încărcare în Cloudinary
export const uploadToCloudinary = async (file, folder, fileName) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append(
    'upload_preset',
    process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME
  );
  formData.append('folder', folder);
  formData.append('chunk_size', '6000000'); // 6MB bucăți
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    return await response.json();
  } catch (error) {
    console.log('eroare', error);
  }
};
