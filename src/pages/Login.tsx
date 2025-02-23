import React, { FormEvent, useState } from 'react';
import Wrapper from '../components/Wrapper';
import Input from '../components/ui/Input';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Form from '../components/ui/AuthForm';
import { useNavigate } from 'react-router-dom';
import { LoginData } from '../types';
import { useAuth } from '@/providers/AuthProvider';

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>({
    login: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const authContext = useAuth();
  if (!authContext) {
    throw new Error('AuthContext is null');
  }
  const { login: loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(formData);
      navigate('/');
    } catch (error: any) {
      console.error('Login failed:', error);

      if (Array.isArray(error)) {
        const lastError = error[error.length - 1];
        setError(`${lastError.path}: ${lastError.msg}`);
      } else {
        setError(error.message || 'Invalid login credentials');
      }
    }
  };

  return (
    <Wrapper>
      <Form action="submit" onSubmit={handleSubmit}>
        <h2 className="text-5xl font-bold mb-[30px]">Log in</h2>
        <Input
          onChange={(e) => setFormData({ ...formData, login: e.target.value })}
          placeholder="Email or nickname"
          type="text"
        />
        <Input
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="Password"
          type="password"
        />
        <p>
          Don`t have an account? <Link to="/register">Register</Link>
        </p>
        <p className="text-red-500">{error}</p>
        <Button type="submit">Log in</Button>
      </Form>
    </Wrapper>
  );
};

export default Login;
