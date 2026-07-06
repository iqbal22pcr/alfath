import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                // bg-primary-foreground-safe (not bg-primary): same contrast
                // reasoning as Button's default variant — badge text is
                // text-xs, normal-size text, needs 4.5:1.
                default: 'border-transparent bg-primary-foreground-safe text-primary-foreground hover:bg-primary-foreground-safe/80',
                secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
                destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
                // Status "calon" (non-kritis).
                accent: 'border-transparent bg-accent text-accent-foreground hover:bg-accent/80',
                // Status "aktif" / "lunas".
                success: 'border-transparent bg-success text-success-foreground hover:bg-success/80',
                outline: 'text-foreground',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
