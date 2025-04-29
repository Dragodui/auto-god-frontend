import React, { useState, useEffect } from 'react';
import { banUser, unbanUser, getBannedUsers } from '@/services/banService';
import { toast } from 'react-hot-toast';

interface BannedUser {
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  adminId: {
    username: string;
  };
  reason: string;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
}

const BanManagement: React.FC = () => {
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [banForm, setBanForm] = useState({
    userId: '',
    reason: '',
    duration: ''
  });

  useEffect(() => {
    fetchBannedUsers();
  }, []);

  const fetchBannedUsers = async () => {
    try {
      const response = await getBannedUsers();
      if (response.success) {
        setBannedUsers(response.data);
      }
    } catch (error) {
      toast.error('Failed to fetch banned users');
    } finally {
      setLoading(false);
    }
  };

  const handleBanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await banUser({
        userId: banForm.userId,
        reason: banForm.reason,
        duration: banForm.duration ? parseInt(banForm.duration) : undefined
      });

      if (response.success) {
        toast.success('User banned successfully');
        setBanForm({ userId: '', reason: '', duration: '' });
        fetchBannedUsers();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error('Failed to ban user');
    }
  };

  const handleUnban = async (userId: string) => {
    try {
      const response = await unbanUser(userId);
      if (response.success) {
        toast.success('User unbanned successfully');
        fetchBannedUsers();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error('Failed to unban user');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Ban User</h2>
        <form onSubmit={handleBanSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">User ID</label>
            <input
              type="text"
              value={banForm.userId}
              onChange={(e) => setBanForm({ ...banForm, userId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea
              value={banForm.reason}
              onChange={(e) => setBanForm({ ...banForm, reason: e.target.value })}
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
              value={banForm.duration}
              onChange={(e) => setBanForm({ ...banForm, duration: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="1"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Ban User
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Banned Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Banned By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bannedUsers.map((ban) => (
                <tr key={ban._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {ban.userId.username}
                    </div>
                    <div className="text-sm text-gray-500">{ban.userId.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{ban.adminId.username}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{ban.reason}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(ban.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {ban.expiresAt
                        ? new Date(ban.expiresAt).toLocaleDateString()
                        : 'Permanent'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleUnban(ban.userId._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Unban
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BanManagement; 