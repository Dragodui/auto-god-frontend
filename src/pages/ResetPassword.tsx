import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import Wrapper from '@/components/Wrapper';
import { resetPassword } from '@/services/authService';
import React, { FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(password);
    console.log(confirmPassword);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError(
        'Password must contain at least one lowercase letter, one uppercase letter, and one number'
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    setMessage(null);

      const data = await resetPassword(token, password);

      if (!data.message.includes('failed')) {
        setMessage(
          'Password reset successful! You can now log in with your new password.'
        );
        setPassword('');
        setConfirmPassword('');
        await new Promise(res => setTimeout(res, 3000));
        await navigate('/login');
      setIsLoading(false);
      } else {
        setError(data.message || 'Something went wrong');
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
            onClick={async () => navigate("/login")}
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
      <ToastContainer theme="dark"/>
      <div className="w-full">
        <h2 className="mt-6 text-center text-3xl font-extrabold">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm">
          Enter your new password below
        </p>
      </div>

      <div className="mt-8 space-y-6 flex flex-col items-center" onSubmit={handleSubmit}>
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
          <div className="rounded-md p-4">
            <div className="text-sm text-green-700">{message}</div>
          </div>
        )}

        {error && (
          <div className="rounded-md p-4">
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
            onClick={() => (window.location.href = '/login')}
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
