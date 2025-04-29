import React from 'react';
import { Trash2 } from 'lucide-react';
import { deletePost, deleteComment, deleteNews } from '@/services/adminService';

interface AdminControlsProps {
  type: 'post' | 'comment' | 'news';
  id: string;
  onDelete?: () => void;
}

const AdminControls: React.FC<AdminControlsProps> = ({ type, id, onDelete }) => {
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
      return;
    }

    try {
      let success = false;
      switch (type) {
        case 'post':
          success = (await deletePost(id)).success;
          break;
        case 'comment':
          success = (await deleteComment(id)).success;
          break;
        case 'news':
          success = (await deleteNews(id)).success;
          break;
      }

      if (success && onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="p-2 text-red-500 hover:text-red-700 transition-colors"
      title={`Delete ${type}`}
    >
      <Trash2 size={20} />
    </button>
  );
};

export default AdminControls; 