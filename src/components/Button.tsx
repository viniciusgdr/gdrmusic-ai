import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

// eslint-disable-next-line react/display-name
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, disabled, children, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={
          'w-full rounded-full border border-transparent disabled:cursor-not-allowed disabled:opacity-50 text-black font-bold hover:opacity-75 transition ' +
          className
        }
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);
