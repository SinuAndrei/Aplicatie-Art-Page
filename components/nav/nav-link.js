'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classes from '@/styles/nav-link.module.css';

export default function NavLink({
  onClick,
  href,
  handler,
  children,
  delay,
  show,
  isAuthenticated,
}) {
  const pathname = usePathname();

  return handler ? (
    <button
      onClick={() => {
        handler();
        if (onClick) {
          onClick();
        }
      }}
      className={`${classes.link} ${show ? classes.show : ''} ${show ? classes.smallLink : ''}`}
      style={{ animationDelay: delay }}
    >
      {children}
    </button>
  ) : (
    <Link
      href={href}
      onClick={onClick ? onClick : undefined}
      className={`${classes.link} ${pathname === href ? classes.active : ''} ${show ? classes.show : ''} ${show ? classes.smallLink : ''}`}
      style={{ animationDelay: delay }}
    >
      {children}
    </Link>
  );
}
