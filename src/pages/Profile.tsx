import { getMyInfo } from '@/api/auth';
import { User } from '@/types';
import React, { FC, useEffect, useState } from 'react';

const Profile: FC = () => {

    const [userData, setUserData] = useState<User | null>(null);

    useEffect(() => {
        getUserInfo();
    }, []);

    const getUserInfo = async() => {
        try {
            const userData = await getMyInfo();
            setUserData(userData);

        } catch (error) {
            console.error('Error while getting me: ', error);
        }
    }

    return (
        <div>
            {userData?.name} {userData?.lastName}
        </div>
    );
};

export default Profile;