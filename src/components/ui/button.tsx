import Link from 'next/link';
import type { ComponentProps } from 'react';

const styles = {
  solid: 'bg-leaf text-white hover:bg-pine',
  light: 'bg-white text-forest hover:bg-mint',
} as const;

const base =
  'inline-flex h-16 items-center justify-center px-10 text-xl font-bold transition-colors disabled:opacity-60 focus-visible:outline-4 focus-visible:outline-sprout';

type Variant = keyof typeof styles;

export function Button({ variant = 'solid', className = '', ...props }: ComponentProps<'button'> & { variant?: Variant }) {
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
}

export function ButtonLink({ variant = 'solid', className = '', ...props }: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={`${base} ${styles[variant]} ${className}`} {...props} />;
}
