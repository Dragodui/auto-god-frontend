import React, { InputHTMLAttributes, useState } from "react";
import Button from "./Button";
import { Eye, EyeClosed } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  addStyles?: string;
}

const Input: React.FC<InputProps> = ({ addStyles, type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const isPasswordField = type === "password";

  return (
    <div className="relative w-full">
      <input
        {...props}
        type={isPasswordField && showPassword ? "text" : type}
        className={`text-lg px-[15px] py-[6px] rounded-md font-medium placeholder:opacity-60 w-full pr-[50px] ${addStyles}`}
      />
      {isPasswordField && (
        <Button
          type="button"
          onClick={togglePasswordVisibility}
          addStyles="absolute top-1/2 right-[0px] transform -translate-y-1/2 cursor-pointer bg-transparent p-0 border-none"
        >
          {showPassword ? <Eye /> : <EyeClosed />}
        </Button>
      )}
    </div>
  );
};

export default Input;
