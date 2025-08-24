'use client';

import styles from '@/styles/contact.module.css';
import Form from 'next/form';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ContactForm({ handleSubmit }) {
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await handleSubmit(data);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleFormSubmit(onSubmit)}>
      <div className={styles.formRow}>
        <div className={styles.container}>
          <label htmlFor={'firstname'}>First Name</label>
          <input
            type={'text'}
            id={'firstname'}
            name={'firstname'}
            {...register('firstname', { required: 'First Name is required' })}
          />

          <p className={styles.error}>
            {errors.firstname ? errors.firstname.message : '\u00A0'}
          </p>
        </div>
        <div className={styles.container}>
          <label htmlFor={'lastname'}>Last Name</label>
          <input
            type={'text'}
            id={'lastname'}
            name={'lastname'}
            {...register('lastname', { required: 'Last Name is required' })}
          />

          <p className={styles.error}>
            {errors.lastname ? errors.lastname.message : '\u00A0'}
          </p>
        </div>
      </div>
      <div className={styles.formRow}>
        <div className={styles.container}>
          <label htmlFor={'email'}>Email</label>
          <input
            type={'email'}
            id={'email'}
            name={'email'}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address',
              },
            })}
          />

          <p className={styles.error}>
            {errors.email ? errors.email.message : '\u00A0'}
          </p>
        </div>
        <div className={styles.container}>
          <label htmlFor={'phone'}>Phone Number</label>
          <input
            type={'tel'}
            id={'phone'}
            name={'phone'}
            {...register('phone', {
              required: 'Phone Number is required',
              pattern: {
                value: /^\d{10}$/,
                message: 'Invalid phone number',
              },
            })}
          />

          <p className={styles.error}>
            {errors.phone ? errors.phone.message : '\u00A0'}
          </p>
        </div>
      </div>
      <div className={styles.containerTextarea}>
        <label htmlFor={'message'}>Message</label>
        <textarea
          type={'textarea'}
          id={'message'}
          name={'message'}
          {...register('message', { required: 'Message is required' })}
        />

        <p className={styles.error}>
          {errors.message ? errors.message.message : '\u00A0'}
        </p>
      </div>
      <div className={styles.formRow}>
        <button type="submit" className={loading ? styles.loading : ''}>
          {loading ? 'Submitting...' : 'Send Message'}
        </button>
      </div>
    </Form>
  );
}
