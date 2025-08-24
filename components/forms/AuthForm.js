'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation'; // Importăm useRouter
import Cookies from 'js-cookie';
import styles from '@/styles/auth.module.css';
import Form from 'next/form';
import { useAuth } from '@/context/AuthContext';

export default function AuthForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState('');
  const router = useRouter();
  const { validateToken } = useAuth();
  const [loading, setLoading] = useState(false);

  async function login(data) {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error(response.statusText);
      }

      const { token } = await response.json();
      Cookies.set('token', token, { expires: 1, path: '/' });

      setError(null);
      await validateToken(token);
      router.push('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form onSubmit={handleSubmit(login)} className={styles.authForm}>
      {error && <p className={styles.errorCentered}>{error}</p>}
      <div className={styles.container}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          ref={emailRef}
          placeholder="Enter your email"
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
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          ref={passwordRef}
          placeholder="Enter your password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters long',
            },
            pattern: {
              value: /^(?=.*\d).+$/,
              message: 'Password must contain at least one number',
            },
          })}
        />
        <p className={styles.error}>
          {errors.password ? errors.password.message : '\u00A0'}
        </p>
      </div>
      <div className={styles.formRow}>
        <button type="submit" className={loading ? styles.loading : ''}>
          {loading ? 'Submitting...' : 'Login'}
        </button>
      </div>
    </Form>
  );
}
