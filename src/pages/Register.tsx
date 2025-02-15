import React, { FormEvent, useState } from 'react';
import Wrapper from '../components/Wrapper';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { Link, useNavigate } from 'react-router-dom';
import Form from '../components/UI/Form';
import { register } from '../api/auth';
import { RegisterData } from '../types';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    name: '',
    lastName: '',
    nickname: '',
    password: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    try {
      console.log('reacting account...');
      e.preventDefault();
      await register(formData);
      setFormData({
        email: '',
        name: '',
        lastName: '',
        nickname: '',
        password: '',
      });
      await navigate('/login');
    } catch (error: any) {
      console.error('Register failed', error);
      if (Array.isArray(error)) {
        console.log(error);
        const lastError = error[error.length - 1];
        setError(`${lastError.path}: ${lastError.msg}`); 
      } else {
        setError(error.message || 'Invalid register credentials');
      }
    }
  };

  return (
    <Wrapper>
      <Form action="submit" onSubmit={(e) => handleSubmit(e)}>
        <h2 className="text-5xl font-bold mb-[30px]">Register</h2>
        <Input
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
          type="text"
          required
        />
        <Input
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Name"
          type="text"
          required
        />
        <Input
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          placeholder="Last name"
          type="text"
          required
        />
        <Input
          onChange={(e) =>
            setFormData({ ...formData, nickname: e.target.value })
          }
          placeholder="Nickname (optional)"
          type="text"
        />
        <Input
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="Password"
          type="password"
          required
        />
        <p>
          Have an account? <Link to="/login">Log in</Link>
        </p>
        <p className="text-red-500">{error}</p>
        <Button addStyles="max-w-[300px] w-full" type="submit">
          Create account
        </Button>
      </Form>
    </Wrapper>
  );
};

export default Register;
