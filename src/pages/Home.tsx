import React from 'react';
import Button from '../components/UI/Button';
import Wrapper from '../components/Wrapper';
import { getMe } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const authContext = useAuth();
  if (!authContext) { 
    throw new Error("AuthContext is null");
  }
  const { logoutAuth } = authContext;

  const getUserData = async(): Promise<void> => {
    try {
      const response = await getMe();
      console.log(response);
      if (!response) {
        return;
      }
      console.log(response.status);
    } catch (error) {
      console.error(error);
    }
  }

  const logOutOfAccount = async(): Promise<void> => {
    try {
      logoutAuth();
      await navigate("/login");
    } catch (error) {
      console.error(error);
    }
  }

    return (
        <Wrapper>
          <>
            <h1>HomePage</h1>  
            <Button onClick={getUserData}>Test Button</Button>
            <Button onClick={logOutOfAccount}>Log out</Button>
          </>
        </Wrapper>
    );
};

export default Home;