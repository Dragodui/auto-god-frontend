import React, { FormEvent, useState } from 'react';
import Wrapper from '../components/Wrapper';
import Input from '../components/UI/Input';
import { Link } from 'react-router-dom';
import Button from '@/components/UI/Button';
import Form from '../components/UI/AuthForm';
import { useNavigate } from 'react-router-dom';
import { LoginData } from '../types';
import { useAuth } from '@/providers/AuthProvider';
import { forgetPassword } from '@/services/authService';
import { toast, ToastContainer } from 'react-toastify';

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
  const notify = (content: string, type?: string) => {
      if (type === 'error') {
        toast.error(content, { position: 'top-right', autoClose: 5000 });
      }
      else {
        toast.success(content, { position: 'top-right', autoClose: 5000 });
      }
    } 
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
      <ToastContainer theme="dark"/>
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
         <p>
          Forget password? <button onClick={async () => {
            const data = await forgetPassword(formData.login);
            if (data.includes("failed")) {
            notify(data?.message, "error");
            } else {
            notify("Link was send on your email!");
            }
          }}>Click here!</button>
        </p>
        <p className="text-red-500">{error}</p>
        <Button type="submit">Log in</Button>
      </Form>
    </Wrapper>
  );
};

export default Login;
