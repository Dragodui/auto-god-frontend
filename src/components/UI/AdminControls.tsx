import React, { useState } from 'react';
import { deletePost, deleteComment, deleteNews } from '@/services/adminService';
import { toast } from 'react-hot-toast';
import BanDialog from '../admin/BanDialog';
import { useAuth } from '@/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

interface AdminControlsProps {
  itemId: string;
  itemType: 'post' | 'comment' | 'news' | 'user' | 'event';
  banUser?: string;
  username?: string;
  isUserIncluded?: boolean;
}

const AdminControls: React.FC<AdminControlsProps> = ({
  itemId,
  itemType,
  banUser,
  username,
  isUserIncluded = false,
}) => {
  const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      let response;
      switch (itemType) {
        case 'post':
          response = await deletePost(itemId);
          navigate('/posts');
          break;
        case 'comment':
          response = await deleteComment(itemId);
          break;
        case 'news':
          response = await deleteNews(itemId);
          navigate('/news');
          break;
        case 'event':
          response = await deleteNews(itemId);
          navigate('/events');
          break;
        default:
          throw new Error('Invalid item type');
      }

      if (response.success) {
        toast.success(`${itemType} deleted successfully`);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error(`Failed to delete ${itemType}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer theme="dark" />
      <div className="flex items-center space-x-2">
        {isUserIncluded && banUser && username && banUser !== userId && (
          <button
            onClick={() => setIsBanDialogOpen(true)}
            className="text-red-600 hover:text-red-800"
            disabled={isLoading}
          >
            Ban
          </button>
        )}
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800"
          disabled={isLoading}
        >
          {isLoading ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      {isBanDialogOpen && banUser && username && (
        <BanDialog
          isOpen={isBanDialogOpen}
          onClose={() => setIsBanDialogOpen(false)}
          banUser={banUser}
          username={username}
          onSuccess={() => {
            setIsBanDialogOpen(false);
          }}
        />
      )}
    </>
  );
};

export default AdminControls;
