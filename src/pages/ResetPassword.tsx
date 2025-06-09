import { resetPassword } from '@/services/authService';
import React, { FormEvent, useState, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

// Mock components - replace with your actual components
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
      {children}
    </div>
  </div>
);

const Input = ({ placeholder, type, onChange, value }: {
  placeholder: string;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}) => (
  <input
    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mb-4"
    placeholder={placeholder}
    type={type}
    onChange={onChange}
    value={value}
    required
  />
);

const Button = ({ children, type, disabled }: {
  children: React.ReactNode;
  type: 'submit' | 'button';
  disabled?: boolean;
}) => (
  <button
    type={type}
    disabled={disabled}
    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {children}
  </button>
);

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {token} = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError('Password must contain at least one lowercase letter, one uppercase letter, and one number');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
     const data = await resetPassword(token);

      if (!data.message.toLowerCase().include("failed")) {
        setMessage('Password reset successful! You can now log in with your new password.');
        setPassword('');
        setConfirmPassword('');
        
        await navigate('/login');
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (error: any) {
      console.error('Reset password failed:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <Wrapper>
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Invalid Reset Link
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            The password reset link is invalid or has expired.
          </p>
          <button
            onClick={() => window.location.href = '/forgot-password'}
            className="mt-4 font-medium text-indigo-600 hover:text-indigo-500"
          >
            Request a new reset link
          </button>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm">
          Enter your new password below
        </p>
      </div>
      
      <div className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm space-y-4">
          <Input
            placeholder="New password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            placeholder="Confirm new password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>Password requirements:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>At least 6 characters long</li>
            <li>Contains at least one lowercase letter</li>
            <li>Contains at least one uppercase letter</li>
            <li>Contains at least one number</li>
          </ul>
        </div>

        {message && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-700">{message}</div>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div onClick={handleSubmit}>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => window.location.href = '/login'}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Back to Login
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

export default ResetPassword;