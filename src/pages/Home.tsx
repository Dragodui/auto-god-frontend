import React from 'react';
import Button from '../components/UI/Button';
import Wrapper from '../components/Wrapper';
import { useAuth } from '@/providers/AuthProvider';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { logout: logoutUser } = useAuth();
  return (
    <Wrapper>
      <>
        <h1>HomePage</h1>
        <Button onClick={async () => await logoutUser()}>logout</Button>
        <Link to="/me">Profile</Link>
      </>
    </Wrapper>
  );
};

export default Home;
