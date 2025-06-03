import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchItems, fetchUserItems } from '@/store/slices/itemsSlice';
import { RootState, AppDispatch } from '@/store/store';
import type { Item } from '@/types/index';
import Wrapper from '@/components/Wrapper';
import { MessageCircle, Plus, Package, Store } from 'lucide-react';

const ItemList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, userItems, loading, error } = useSelector(
    (state: RootState) => state.items
  );
  const [activeTab, setActiveTab] = useState<'marketplace' | 'myItems'>('marketplace');

  useEffect(() => {
    dispatch(fetchItems());
    dispatch(fetchUserItems());
  }, [dispatch]);

  if (loading) {
    return (
      <Wrapper>
        <div className="flex justify-center items-center min-h-64">
          <div className="text-lg text-text">Loading...</div>
        </div>
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <div className="text-red-400 text-center p-4">{error}</div>
      </Wrapper>
    );
  }

  const currentItems = activeTab === 'marketplace' ? items : userItems;

  return (
    <Wrapper>
      <div className="space-y-6 w-full">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <h1 className="text-3xl font-bold text-text">
            {activeTab === 'marketplace' ? 'Marketplace' : 'My Items'}
          </h1>
          <div className="flex gap-2">
            <Link
              to="/create-item"
              className="bg-secondary text-text px-4 py-2 rounded-lg hover:bg-secondary/80 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add item
            </Link>
            <Link
              to="/market/chats"
              className="bg-blocks text-text px-4 py-2 rounded-lg hover:bg-blocks/80 transition-colors flex items-center gap-2"
            >
              <MessageCircle size={20} />
              Open chats
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-blocks/30">
          <button
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'marketplace'
                ? 'border-secondary text-secondary'
                : 'border-transparent text-text/60 hover:text-text'
            }`}
            onClick={() => setActiveTab('marketplace')}
          >
            <Store size={18} />
            Marketplace ({items.length})
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'myItems'
                ? 'border-secondary text-secondary'
                : 'border-transparent text-text/60 hover:text-text'
            }`}
            onClick={() => setActiveTab('myItems')}
          >
            <Package size={18} />
            My Items ({userItems.length})
          </button>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-text/60 text-lg">
                {activeTab === 'marketplace' 
                  ? 'No items available in the marketplace' 
                  : 'You haven\'t added any items yet'
                }
              </div>
              {activeTab === 'myItems' && (
                <Link
                  to="/create-item"
                  className="inline-block mt-4 bg-secondary text-text px-6 py-2 rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Add your first item
                </Link>
              )}
            </div>
          ) : (
            currentItems.map((item: Item) => (
              <Link
                key={item._id}
                to={`/market/${item._id}`}
                className="block bg-blocks rounded-lg shadow-md hover:shadow-lg hover:bg-blocks/80 transition-all overflow-hidden"
              >
                <div className="p-4">
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    {item.photos.length ? (
                      <img
                        src={`${import.meta.env.VITE_SERVER_HOST}/${item.photos[0]}`}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-bg rounded-lg flex items-center justify-center">
                        <Package size={48} className="text-text/40" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-text">
                    {item.title}
                  </h3>
                  <p className="text-text/70 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-secondary">
                      ${item.price}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === 'available' 
                        ? 'bg-secondary/20 text-secondary'
                        : item.status === 'sold'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-link/20 text-link'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default ItemList;