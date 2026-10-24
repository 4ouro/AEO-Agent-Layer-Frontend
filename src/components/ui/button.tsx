import * as React from 'react';
import Link from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import { cn } from '@/lib/utils';

// Press feedback: a quick scale-down so every click feels heard.
const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-full text-base font-semibold whitespace-nowrap transition-[background-color,border-color,transform] duration-150 ease-out outline-none active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss',
  {
    variants: {
      variant: {
        default: 'bg-forest text-white hover:bg-moss',
        lime: 'bg-lime text-forest hover:bg-sage',
        outline: 'border border-line bg-white text-forest hover:border-sage hover:bg-lime-soft',
      },
      size: {
        default: 'h-12 px-6',
        sm: 'h-10 px-4',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

type ButtonProps = React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

function ButtonLink({ className, variant, size, ...props }: React.ComponentProps<typeof Link> & VariantProps<typeof buttonVariants>) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link {...props} />
    </Button>
  );
}

export { Button, ButtonLink, buttonVariants };
