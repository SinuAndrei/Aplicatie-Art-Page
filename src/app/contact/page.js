'use client';

import styles from '@/styles/contact.module.css';
import { useRouter } from 'next/navigation';
import ContactForm from '@/components/forms/contactForm';

export default function ContactPage() {
  const router = useRouter();

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/');
        //form.reset(); // Resetează formularul după trimitere
      } else {
        console.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className={styles.contactForm}>
      <h1 className={styles.contactTitle}>Contact Us</h1>
      <ContactForm handleSubmit={handleSubmit} />
    </div>
  );
}
