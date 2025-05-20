import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchItems } from '../store/actions/itemActions';
import { RootState, AppDispatch } from '../store';
import type { Item } from '../types/index';
import Wrapper from '../components/Wrapper';
import { Plus } from 'lucide-react';

const ItemList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.items);

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <Wrapper>
      <div className='w-full flex items-center justify-between'>
      <h1 className="text-3xl font-bold mb-8">Marketplace</h1>
      <Link className='flex gap-2 items-center bg-secondary font-medium py-1 px-3 rounded-md' to="/create-item">Add item <Plus/></Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item: Item) => (
          <Link
            key={item._id}
            to={`/market/${item._id}`}
            className="block rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="relative pb-[75%]">
              <img
                src={`${import.meta.env.VITE_SERVER_HOST}/${item.photos[0]}`}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              <p className="text-white mb-2 line-clamp-2">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">${item.price}</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  item.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Wrapper>
  );
};

export default ItemList; 