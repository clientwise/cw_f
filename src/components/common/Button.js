import React from 'react';

// Defined outside for clarity, or import from a theme file
const themeColors = {
  brandPurple: '#5a239e', brandBeige: '#f6eeb4', brandBeigeHover: '#fbf8e9',
  brandPurpleHover: '#703abc', darkGray: '#1f2937',
};

export const Button = ({ children, onClick, type = 'button', variant = 'brand', className = '', disabled = false, href }) => {
  const baseClasses = "inline-flex items-center justify-center px-6 py-2.5 border rounded-lg font-semibold text-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";
  let variantClasses = '';
  const styles = {
    primary: `bg-[${themeColors.brandPurple}] text-white border-[${themeColors.brandPurple}] hover:bg-[${themeColors.brandPurpleHover}] hover:border-[${themeColors.brandPurpleHover}] focus:ring-[${themeColors.brandPurple}]`,
    secondary: `bg-transparent text-[${themeColors.brandBeige}] border-[${themeColors.brandBeige}] hover:bg-white/10 hover:text-[${themeColors.brandBeigeHover}] hover:border-[${themeColors.brandBeigeHover}] focus:ring-[${themeColors.brandBeige}]`,
    header: `bg-[${themeColors.brandBeige}] text-[${themeColors.brandPurple}] border-[${themeColors.brandBeige}] hover:bg-[${themeColors.brandBeigeHover}] hover:border-[${themeColors.brandBeigeHover}] focus:ring-[${themeColors.brandPurple}] px-4 py-1.5 text-xs font-medium`,
    brand: `bg-[${themeColors.brandPurple}] text-white border-[${themeColors.brandPurple}] hover:bg-[${themeColors.brandPurpleHover}] hover:border-[${themeColors.brandPurpleHover}] focus:ring-[${themeColors.brandPurple}]`,
    outlineSm: `bg-white text-[${themeColors.darkGray}] border-gray-300 hover:bg-gray-50 px-3 py-1.5 text-xs`,
};

  switch (variant) {
    case 'primary': variantClasses = styles.primary; break;
    case 'secondary': variantClasses = styles.secondary; break;
    case 'header': variantClasses = styles.header; break;
    case 'outlineSm': variantClasses = styles.outlineSm; break;
    case 'brand': default: variantClasses = styles.brand; break;
  }
   const combinedClassName = `${baseClasses} ${variantClasses} ${className}`;

   // Pass CSS variables inline for Tailwind JIT compiler
   const style = {
        '--brand-purple': themeColors.brandPurple,
        '--brand-beige': themeColors.brandBeige,
        '--brand-beige-hover': themeColors.brandBeigeHover,
        '--brand-purple-hover': themeColors.brandPurpleHover,
    };

   if (href) {
       return ( <a href={href} className={combinedClassName} style={style}> {children} </a> );
   }
  return ( <button type={type} onClick={onClick} disabled={disabled} className={combinedClassName} style={style} > {children} </button> );
};

export default Button; // Exporting Button as default for convenience, or use named export
