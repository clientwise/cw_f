import React from 'react';

const themeColors = { brandPurple: '#5a239e' }; // Define or import

export const InputField = ({ id, label, type = 'text', value, onChange, placeholder, required = true }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[--brand-purple] focus:border-[--brand-purple] sm:text-sm"
      style={{ '--brand-purple': themeColors.brandPurple }}
    />
  </div>
);

export default InputField;
