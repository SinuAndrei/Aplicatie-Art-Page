import MainHeader from '@/components/nav/main-header';
import styles from '@/styles/page.module.css';
import { AuthProvider } from '@/context/AuthContext';
import Error from '@/src/app/error';
import { DefaultSeo } from 'next-seo';
import SEO from '@/next-seo.config';

import { ErrorBoundary } from 'next/dist/client/components/error-boundary';
import '@/styles/globals.css';

export default function RootLayout({ children, pageProps }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta
          httpEquiv="Cache-Control"
          content="public, max-age=3600, immutable"
        ></meta>
        <title>Ciprian Toma</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
        <script
          src="https://cdn.lordicon.com/lordicon.js"
          type="text/javascript"
        ></script>
      </head>
      <body>
        <AuthProvider>
          <MainHeader {...pageProps} />
          <ErrorBoundary FallbackComponent={Error}>
            <div {...pageProps} className={styles.page}>
              <main className={styles.main}>{children}</main>
              <footer className={styles.footer}>
                <a
                  href="https://www.facebook.com/ciprian.toma.1422"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <lord-icon src="/facebook.json" trigger="hover"></lord-icon>
                </a>
                <a
                  href="https://www.instagram.com/cipriantoma77/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <lord-icon src="/instagram.json" trigger="hover"></lord-icon>
                </a>
              </footer>
            </div>
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  );
}
