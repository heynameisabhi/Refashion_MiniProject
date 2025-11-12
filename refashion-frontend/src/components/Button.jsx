import classNames from 'classnames';

const variantStyles = {
  primary:
    'bg-brand hover:bg-brand-dark text-white focus-visible:ring-brand-dark focus-visible:ring-offset-2',
  secondary:
    'bg-white text-brand border border-brand hover:bg-brand-light focus-visible:ring-brand focus-visible:ring-offset-2',
  ghost:
    'bg-transparent text-brand hover:bg-brand-light focus-visible:ring-brand focus-visible:ring-offset-2',
};

const sizeStyles = {
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({ children, className, variant = 'primary', size = 'md', type = 'button', ...rest }) => (
  <button
    type={type}
    className={classNames(
      'inline-flex items-center justify-center rounded-full font-semibold transition-colors duration-150 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60',
      variantStyles[variant],
      sizeStyles[size],
      className,
    )}
    {...rest}
  >
    {children}
  </button>
);

export default Button;

