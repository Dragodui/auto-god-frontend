import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItemById, purchaseItem } from '@/store/slices/itemsSlice';
import { createChat } from '@/store/slices/chatsSlice';
import { RootState, AppDispatch } from '@/store/store';
import Wrapper from './Wrapper';
import { useAuth } from '@/providers/AuthProvider';
import Button from './UI/Button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '@/styles/swiper.css';
import { toast, ToastContainer } from 'react-toastify';

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const {
    currentItem: item,
    loading,
    error,
  } = useSelector((state: RootState) => state.items);
  const { userId } = useAuth();

  useEffect(() => {
    if (id) {
      dispatch(fetchItemById(id));
    }
  }, [dispatch, id]);

  const handlePurchase = async () => {
    if (!item || !userId) return;

    try {
      await dispatch(purchaseItem(item._id));
      toast.success('Item purchased successfully!');
      navigate('/market');
    } catch (error) {
      console.error('Error purchasing item:', error);
    }
  };

  const handleContactSeller = async () => {
    if (!item || !userId) return;

    try {
      const data = await dispatch(createChat(item._id));
      console.log(data);
      await navigate(`/market/chats/${data.payload._id}`);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  if (error || !item) {
    return (
      <div className="text-red-500 text-center">
        {error || 'Item not found'}
      </div>
    );
  }

  return (
    <Wrapper>
              <ToastContainer 
      theme="dark" />
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            className="w-full aspect-square rounded-lg"
          >
            {item.photos.map((photo, index) => (
              <SwiperSlide key={index}>
                <img
                  src={`${import.meta.env.VITE_SERVER_HOST}/${photo}`}
                  alt={`${item.title} - Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
            <p className="text-gray-600">{item.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">${item.price}</span>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                item.status === 'available'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {item.status}
            </span>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-xl font-semibold mb-2">Seller Information</h2>
            <p>
              Name: {item.seller.name} {item.seller.lastName}
            </p>
            <p>Email: {item.seller.email}</p>
          </div>

          <div className="space-y-4">
            {userId !== item.seller._id && (
              <>
                <Button onClick={handlePurchase} addStyles="w-full">
                  Purchase Item
                </Button>
                <Button onClick={handleContactSeller} addStyles="w-full">
                  Contact Seller
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ItemDetail;
