import Link from 'next/link';
import type { ComponentProps } from 'react';

const styles = {
  solid: 'bg-forest text-white hover:bg-moss',
  lime: 'bg-lime text-forest hover:bg-sage',
  outline: 'border border-line bg-white text-forest hover:border-sage hover:bg-lime-soft',
} as const;

// Press feedback: a quick scale-down so every click feels heard.
const base =
  'inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-base font-semibold whitespace-nowrap transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss';

type Variant = keyof typeof styles;

export function Button({ variant = 'solid', className = '', ...props }: ComponentProps<'button'> & { variant?: Variant }) {
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
}

export function ButtonLink({ variant = 'solid', className = '', ...props }: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={`${base} ${styles[variant]} ${className}`} {...props} />;
}
