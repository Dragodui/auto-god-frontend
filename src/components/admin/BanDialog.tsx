import React, { useState } from 'react';
import { banUser } from '@/services/banService';
import { toast } from 'react-hot-toast';

interface BanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  username: string;
  onSuccess: () => void;
}

const BanDialog: React.FC<BanDialogProps> = ({
  isOpen,
  onClose,
  userId,
  username,
  onSuccess,
}) => {
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error('Please provide a reason for the ban');
      return;
    }

    setIsLoading(true);
    try {
      const response = await banUser({
        userId,
        reason,
        duration: duration ? parseInt(duration) : undefined,
      });

      if (response.success) {
        toast.success('User banned successfully');
        onSuccess();
        onClose();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error('Failed to ban user');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#15151a] rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Ban User</h2>
        <p className="mb-4">
          You are about to ban <span className="font-semibold">{username}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reason for ban
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration (days, leave empty for permanent)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="1"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {isLoading ? 'Banning...' : 'Ban User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BanDialog; 