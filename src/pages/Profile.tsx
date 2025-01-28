import { getMyInfo } from '@/api/auth';
import Wrapper from '@/components/Wrapper';
import { User } from '@/types';
import React, { FC, useEffect, useState } from 'react';

const Profile: FC = () => {
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const userData = await getMyInfo();
      console.log(userData);
      setUserData(userData);
    } catch (error) {
      console.error('Error while getting me: ', error);
    }
  };

  return (
    <Wrapper>
      <p>{userData?.name} {userData?.lastName}</p>
    </Wrapper>
  );
};

export default Profile;
