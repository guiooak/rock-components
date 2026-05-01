import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Template.module.css';

export interface TemplateProps extends HTMLAttributes<HTMLDivElement> {
  /** Content to render inside the template. */
  children?: ReactNode;
  /** Visual variant. */
  variant?: 'default' | 'subtle';
  /** Disable user interactions. */
  disabled?: boolean;
}

/**
 * Template — the reference implementation. Every component should mirror
 * this file's structure: forwardRef, exported props, public block class
 * via :global(.sd-*), BEM modifiers via the CSS module, semantic tokens
 * only, full a11y handling.
 */
export const Template = forwardRef<HTMLDivElement, TemplateProps>(
  function Template(
    { children, variant = 'default', disabled = false, className, ...rest },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={clsx(
          'sd-template',
          styles.root,
          variant === 'subtle' && styles.rootSubtle,
          disabled && styles.rootDisabled,
          className,
        )}
        aria-disabled={disabled || undefined}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
