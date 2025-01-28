import React from 'react';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

const Form: React.FC<FormProps> = ({ children, ...props }) => {
  return (
    <form
      {...props}
      className="max-w-[400px] w-full px-[30px] py-[40px] text-center bg-[rgba(30,30,30)] rounded-xl"
    >
      <div className="flex flex-col gap-[20px] items-center w-full">
        {children}
      </div>
    </form>
  );
};

export default Form;
