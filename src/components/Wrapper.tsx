import React from 'react';

interface WrapperProps {
  children: React.ReactElement[] | React.ReactElement;
  className?: string;
}

const Wrapper: React.FC<WrapperProps> = ({ children, className }) => {
  return (
    <main className="w-full flex flex-col items-center justify-center h-full">
      <div
        className={`max-w-[1300px] w-full flex flex-col items-center px-3 justify-center h-full ${className}`}
      >
        {children}
      </div>
    </main>
  );
};

export default Wrapper;
