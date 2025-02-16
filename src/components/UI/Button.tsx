import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  addStyles?: string;
}

const Button: React.FC<ButtonProps> = ({ children, addStyles, ...props }) => {
  return (
    <button
      className={` px-5 py-2 font-medium text-2xl rounded-lg bg-secondary ${addStyles}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
