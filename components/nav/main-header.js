'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import classes from '@/styles/main-header.module.css';
import NavLink from './nav-link';
import { useAuth } from '@/context/AuthContext';
import { navLinksData, authNavLinksData } from '../textData';

export default function MainHeader() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isStickyEffect, setIsStickyEffect] = useState(false);
  const [hasTriggeredStickyEffect, setHasTriggeredStickyEffect] =
    useState(false);

  async function handleLogout() {
    logout();
    router.push('/');
  }

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleBarScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY === 0) {
        setHasTriggeredStickyEffect(false);
      }

      // Activăm efectul doar la prima derulare în jos
      if (currentScrollY > lastScrollY && !hasTriggeredStickyEffect) {
        setIsStickyEffect(true);
        setHasTriggeredStickyEffect(true); // Nu mai permitem efectul în viitor
        setTimeout(() => setIsStickyEffect(false), 300); // Efect temporar
      }

      // Menținem header-ul sticky după primul scroll
      if (currentScrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }

      lastScrollY = currentScrollY; // Actualizăm poziția curentă
    };

    window.addEventListener('scroll', handleBarScroll);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleBarScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isSticky, isStickyEffect, hasTriggeredStickyEffect]);

  return (
    <>
      <header
        className={`${classes.header} ${isSticky ? classes.sticky : ''} ${menuOpen ? classes.headerOverlay : ''}`}
      >
        <h1 className={classes.logo}>
          <Link
            href="/"
            className={`${menuOpen ? classes.headerOverlay : ''}`}
            onClick={menuOpen ? toggleMenu : null}
          >
            CIPRIAN TOMA
          </Link>
        </h1>
        <div
          className={`${classes.menuToggle} ${menuOpen ? classes.open : ''}`}
          onClick={toggleMenu}
        >
          <div className={classes.bar1}></div>
          <div className={classes.bar2}></div>
          <div className={classes.bar3}></div>
        </div>
        <nav className={`${classes.nav} ${menuOpen ? classes.open : ''}`}>
          <ul>
            {navLinksData.map((link, index) =>
              link.href ? (
                <li key={index}>
                  <NavLink
                    isAuthenticated={isAuthenticated}
                    href={link.href}
                    delay={`${index * 0.1}s`}
                    show={menuOpen}
                    onClick={menuOpen ? toggleMenu : null}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ) : null
            )}
            {isAuthenticated && (
              <>
                {authNavLinksData.map((link, index) =>
                  link.href ? (
                    <li key={index}>
                      <NavLink
                        isAuthenticated={isAuthenticated}
                        href={link.href}
                        delay={`${(navLinksData.length + index) * 0.1}s`}
                        show={menuOpen}
                        onClick={menuOpen ? toggleMenu : null}
                      >
                        {link.label}
                      </NavLink>
                    </li>
                  ) : null
                )}
                <li>
                  <NavLink
                    handler={handleLogout}
                    onClick={menuOpen ? toggleMenu : null}
                    className={classes.logoutButton}
                    style={`${(navLinksData.length + authNavLinksData.length) * 0.1}s`}
                    show={menuOpen}
                    isAuthenticated={isAuthenticated}
                  >
                    LOGOUT
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
      {menuOpen && <div className={classes.overlay} onClick={toggleMenu}></div>}
    </>
  );
}
