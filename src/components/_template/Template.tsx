import { type HTMLAttributes, type ReactNode, type Ref } from 'react';
import clsx from 'clsx';
import styles from './Template.module.css';

export interface TemplateProps extends HTMLAttributes<HTMLDivElement> {
  /** Content to render inside the template. */
  children?: ReactNode;
  /** Visual variant. */
  variant?: 'default' | 'subtle';
  /** Disable user interactions. */
  disabled?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export const Template = ({
  children,
  variant = 'default',
  disabled = false,
  className,
  ref,
  ...rest
}: TemplateProps) => (
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
