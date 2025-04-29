import Wrapper from '@/components/Wrapper';
import type { Activity, ChangeUserData, User } from '@/types';
import {
  CalendarIcon,
  CarIcon,
  StarIcon,
  PlusCircle,
  Loader,
} from 'lucide-react';
import type React from 'react';
import { type FC, useEffect, useState } from 'react';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import {
  getLastUserActivity,
  getCurrentProfileData,
  saveUserData,
  uploadUserAvatar,
} from '@/services/userService';

const Profile: FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [lastActivity, setLastActivity] = useState<Activity[] | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<ChangeUserData>({
    name: '',
    lastName: '',
    nickname: '',
    car: '',
  });

  useEffect(() => {
    getCurrentProfileData().then((data) => {
      if (data && 'name' in data) {
        setUserData(data as User);
        setEditForm({
          name: data.name,
          lastName: data.lastName,
          nickname: data.nickname || '',
          car: data.car || '',
        });
      }
    });

    getLastUserActivity().then((data) => {
      if (Array.isArray(data)) {
        setLastActivity(data);
      }
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveUserData(editForm);
    const data = await getCurrentProfileData();
    setUserData(data as User);
    setIsEditing(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await uploadUserAvatar(e);
    const data = await getCurrentProfileData();
    setUserData(data as User);
  };

  if (!userData) {
    return <Loader />;
  }

  return (
    <Wrapper>
      <div className="min-h-screen bg-bg text-text w-full">
        <div className="mx-auto">
          <div className=" rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex px-8 py-4">
              <div className="md:flex-shrink-0">
                <div className="relative w-48 h-48 mx-auto md:mx-0">
                  {userData.avatar ? (
                    <img
                      className="w-full h-full object-cover rounded-full"
                      src={`${import.meta.env.VITE_SERVER_HOST}${userData.avatar}`}
                      alt="User avatar"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center text-white">
                      No photo
                    </div>
                  )}
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-secondary text-white p-2 rounded-full cursor-pointer"
                  >
                    <PlusCircle size={24} />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </div>
              <div className="p-8 flex-grow">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      placeholder="Name"
                    />
                    <Input
                      name="lastName"
                      value={editForm.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                    />
                    <Input
                      name="nickname"
                      value={editForm.nickname}
                      onChange={handleInputChange}
                      placeholder="Nickname"
                    />
                    <Input
                      name="car"
                      value={editForm.car}
                      onChange={handleInputChange}
                      placeholder="Car"
                    />
                    <div className="flex items-center gap-3">
                      <Button addStyles="text-lg px-4 py-2" type="submit">
                        Save
                      </Button>
                      <Button
                        addStyles="text-lg px-4 py-2"
                        type="button"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="uppercase tracking-wide text-sm text-secondary font-semibold">
                      {userData.rank} Member
                    </div>
                    <h1 className="mt-2 text-3xl font-bold text-white">
                      {userData.name} {userData.lastName}
                    </h1>
                    <p className="mt-2 text-gray-400">@{userData.nickname}</p>
                    <Button onClick={() => setIsEditing(true)} className="mt-4">
                      Edit Profile
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="px-8 py-4 bg-blocks">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <CarIcon className="h-6 w-6 text-secondary mr-2" />
                  <span>{userData.car || 'No car specified'}</span>
                </div>
                <div className="flex items-center">
                  <StarIcon className="h-6 w-6 text-secondary mr-2" />
                  <span>
                    {userData.rank.charAt(0).toUpperCase() +
                      userData.rank.slice(1)}{' '}
                    Rank
                  </span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-6 w-6 text-secondary mr-2" />
                  <span>
                    Member since{' '}
                    {new Date(userData.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Recent Forum Activity
            </h2>
            <ul className="space-y-4">
              {lastActivity !== null && lastActivity.length > 0 ? (
                lastActivity?.map((activity: any) => (
                  <li key={activity.id}>
                    <a
                      href={`/post/${activity.id}`}
                      className="text-secondary hover:underline"
                    >
                      {activity.title}
                    </a>
                    <p className="text-gray-400">{activity.createdAt}</p>
                  </li>
                ))
              ) : (
                <li className="text-gray-400">No recent activity</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Profile;
