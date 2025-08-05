import React, { useState, useEffect } from 'react';
import { getUsers, getUserStats, deleteUser } from '../utils/database';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const allUsers = getUsers();
      const userStats = getUserStats();
      
      setUsers(allUsers.map(user => ({
        ...user,
        password: '***' // Hide actual passwords
      })));
      setStats(userStats);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        deleteUser(userId);
        loadData(); // Reload data
        alert('User deleted successfully');
      } catch (error) {
        alert('Error deleting user: ' + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
            
            {/* Statistics */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-blue-100 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900">Total Users</h3>
                  <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                </div>
                <div className="bg-green-100 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900">Guests</h3>
                  <p className="text-3xl font-bold text-green-600">{stats.guests}</p>
                </div>
                <div className="bg-purple-100 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900">Hosts</h3>
                  <p className="text-3xl font-bold text-purple-600">{stats.hosts}</p>
                </div>
                <div className="bg-orange-100 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-900">Recent Users</h3>
                  <p className="text-3xl font-bold text-orange-600">{stats.recent.length}</p>
                </div>
              </div>
            )}

            {/* Users Table */}
            <div className="overflow-x-auto">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">All Users</h2>
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-bold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'host' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recent Users */}
            {stats && stats.recent.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Users</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stats.recent.map((user) => (
                    <div key={user.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-xs text-gray-400">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={loadData}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 