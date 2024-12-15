import React from 'react';
import Button from '../components/UI/Button';
import Wrapper from '../components/Wrapper';
import { getMe, logOut } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

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
      const response = await logOut();
      if (!response) {
        return;
      }
      await navigate("/login");
      window.location.reload();
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