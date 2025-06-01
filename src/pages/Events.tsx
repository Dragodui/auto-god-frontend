import Loader from '@/components/UI/Loader';
import Wrapper from '@/components/Wrapper';
import { getEvents } from '@/services/eventsService';
import { getCurrentProfileData } from '@/services/userService';
import { getImage } from '@/utils/getImage';
import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { acceptEvent, deleteEvent, getUnacceptedEvents } from '@/services/adminService';
import Button from '@/components/UI/Button';

const Events = () => {
  const [events, setEvents] = React.useState<any[] | null>(null);
  const [unacceptedEvents, setUnacceptedEvents] = React.useState<any[] | null>(
    null
  );
  const [loading, setLoading] = React.useState<boolean>(true);
  const [currentUser, setCurrentUser] = React.useState<any | null>(null);

  const getData = async () => {
    setEvents(await getEvents());
    setLoading(false);
  };

  const getUnacceptedEventsData = async () => {
    const parsedUser = await getCurrentProfileData();
    setCurrentUser(parsedUser);
    if (parsedUser && 'role' in parsedUser && parsedUser?.role === 'admin') {
      console.log((await getUnacceptedEvents()).data);
      setUnacceptedEvents((await getUnacceptedEvents()).data);
    }
  };

  useEffect(() => {
    getData();
    getUnacceptedEventsData();
  }, []);

  return (
    <Wrapper>
      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-[#222225] text-white w-full">
          <section className="container mx-auto py-16">
            <div className="flex justify-between items-center">
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-5xl font-bold mb-8"
              >
                Events
              </motion.h2>
              <div>
                <Link
                  to="/create-event"
                  className=" text-white px-4 py-2 rounded-md"
                >
                  Request event
                </Link>
              </div>
            </div>
            {currentUser &&
            currentUser.role === 'admin' &&
            unacceptedEvents &&
            unacceptedEvents.length > 0 ? (
              <>
                <h2>Unaccepted events</h2>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 font-sansation"
                >
                  {unacceptedEvents.map((topic, index) => (
                    <motion.div
                      key={topic._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative rounded-lg overflow-hidden"
                    >
                      <Link
                        to={`/events/${topic?._id}`}
                        className="bg-[#2A2A35] p-6 min-h-[200px] rounded-lg hover:bg-[#32323E] transition-colors h-full flex flex-col justify-between bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: topic.image
                            ? `url(${getImage(topic.image)})`
                            : 'none',
                        }}
                      >
                        <div className="absolute inset-0 bg-black/40"></div>
                        <div className="relative z-10 flex flex-col gap-2">
                          <h3 className="text-2xl font-semibold text-white">
                            {topic?.title}
                          </h3>

                          <p className="text-sm text-gray-300">
                            <strong>Place:</strong> {topic.place}
                          </p>

                          <p className="text-sm text-gray-300">
                            <strong>Date:</strong>{' '}
                            {new Date(topic.date).toLocaleString()}
                          </p>

                          {topic.authorId && (
                            <div className="flex items-center gap-2 mt-2">
                              <img
                                src={getImage(topic.authorId.avatar)}
                                alt="Author avatar"
                                className="w-6 h-6 rounded-full object-cover"
                              />
                              <span className="text-sm text-gray-300">
                                {topic.authorId.name}
                              </span>
                            </div>
                          )}
                          <div className='flex gap-2 mt-4'>
                            <Button onClick = {async (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              await acceptEvent(topic._id);
                              await getUnacceptedEventsData();
                              await getData();
                            }} addStyles='bg-green-500 text-md'>Accept</Button>
                            <Button onClick = {async (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              await deleteEvent(topic._id);
                              await getUnacceptedEventsData();
                              await getData();
                            }} addStyles='bg-red-400 text-md'>Remove</Button>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="text-gray-400"
              >
                No events available.
              </motion.div>
            )}

            {events && events.length > 0 ? (
              <>
                {
                  currentUser && currentUser.role === 'admin' && (
                    <h2 className="mt-8 py-3">Accepted events</h2>
                  ) 
                }
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sansation"
              >
                {events.map((topic, index) => (
                  <motion.div
                    key={topic._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative rounded-lg overflow-hidden"
                  >
                    <Link
                      to={`/events/${topic?._id}`}
                      className="bg-[#2A2A35] p-6 min-h-[200px] rounded-lg hover:bg-[#32323E] transition-colors h-full flex flex-col justify-between bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: topic.image
                          ? `url(${getImage(topic.image)})`
                          : 'none',
                      }}
                    >
                      <div className="absolute inset-0 bg-black/40"></div>
                      <div className="relative z-10 flex flex-col gap-2">
                        <h3 className="text-2xl font-semibold text-white">
                          {topic?.title}
                        </h3>

                        <p className="text-sm text-gray-300">
                          <strong>Place:</strong> {topic.place}
                        </p>

                        <p className="text-sm text-gray-300">
                          <strong>Date:</strong>{' '}
                          {new Date(topic.date).toLocaleString()}
                        </p>

                        {topic.authorId && (
                          <div className="flex items-center gap-2 mt-2">
                            <img
                              src={getImage(topic.authorId.avatar)}
                              alt="Author avatar"
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <span className="text-sm text-gray-300">
                              {topic.authorId.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="text-gray-400"
              >
                No events available.
              </motion.div>
            )}
          </section>
        </div>
      )}
    </Wrapper>
  );
};

export default Events;
