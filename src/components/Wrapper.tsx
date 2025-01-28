import React from 'react';

interface WrapperProps {
  children: React.ReactElement;
}

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center h-full">
      <div className="max-w-[1300px] mt-[40px] w-full flex flex-col items-center px-3 justify-center h-full">
        {children}
      </div>
    </div>
  );
};

export default Wrapper;
