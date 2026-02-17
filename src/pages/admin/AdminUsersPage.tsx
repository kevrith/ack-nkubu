import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Edit2, Save, X, Trash2, UserPlus } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  phone: string;
  role: 'basic_member' | 'leader' | 'clergy' | 'admin';
  cell_group?: string;
  membership_number?: string;
  is_active: boolean;
  created_at: string;
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ role: '', full_name: '', phone: '', cell_group: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', password: '', full_name: '', phone: '', role: 'basic_member' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: editData.role,
          full_name: editData.full_name,
          phone: editData.phone || null,
          cell_group: editData.cell_group || null
        })
        .eq('id', userId);

      if (error) throw error;
      await loadUsers();
      setEditingId(null);
    } catch (error) {
      alert('Failed to update user');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', userId);
      if (error) throw error;
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const addUser = async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: { data: { full_name: newUser.full_name } }
      });
      if (authError) throw authError;
      
      if (authData.user) {
        await supabase.from('profiles').update({
          full_name: newUser.full_name,
          phone: newUser.phone || null,
          role: newUser.role
        }).eq('id', authData.user.id);
      }
      
      await loadUsers();
      setShowAddModal(false);
      setNewUser({ email: '', password: '', full_name: '', phone: '', role: 'basic_member' });
    } catch (error: any) {
      alert(error.message);
    }
  };

  const toggleActive = async (userId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !isActive })
        .eq('id', userId);

      if (error) throw error;
      setUsers(users.map(u => u.id === userId ? { ...u, is_active: !isActive } : u));
    } catch (error) {
      console.error('Failed to toggle active status:', error);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'clergy': return 'bg-purple-100 text-purple-800';
      case 'leader': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-8">Loading users...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-navy" />
          <h1 className="text-3xl font-playfair text-navy">User Management</h1>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-600"
        >
          <UserPlus className="w-5 h-5" />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cell Group</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className={!user.is_active ? 'bg-gray-50' : ''}>
                <td className="px-6 py-4">
                  {editingId === user.id ? (
                    <input
                      value={editData.full_name}
                      onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                    />
                  ) : (
                    <div className="font-medium text-gray-900">{user.full_name}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === user.id ? (
                    <input
                      value={editData.phone}
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                    />
                  ) : (
                    <span className="text-sm text-gray-600">{user.phone || 'N/A'}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === user.id ? (
                    <select
                      value={editData.role}
                      onChange={(e) => setEditData({...editData, role: e.target.value})}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="basic_member">Basic Member</option>
                      <option value="leader">Leader</option>
                      <option value="clergy">Clergy</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === user.id ? (
                    <input
                      value={editData.cell_group}
                      onChange={(e) => setEditData({...editData, cell_group: e.target.value})}
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                    />
                  ) : (
                    <span className="text-sm text-gray-600">{user.cell_group || 'N/A'}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {editingId === user.id ? (
                      <>
                        <button onClick={() => updateUser(user.id)} className="text-green-600 hover:text-green-700">
                          <Save className="h-4 w-4" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-gray-600 hover:text-gray-700">
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(user.id);
                            setEditData({ role: user.role, full_name: user.full_name, phone: user.phone || '', cell_group: user.cell_group || '' });
                          }}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleActive(user.id, user.is_active)}
                          className={`px-2 py-1 rounded text-xs ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {user.is_active ? 'Active' : 'Inactive'}
                        </button>
                        <button onClick={() => deleteUser(user.id)} className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New User</h2>
            <div className="space-y-4">
              <input
                placeholder="Full Name"
                value={newUser.full_name}
                onChange={(e) => setNewUser({...newUser, full_name: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <input
                placeholder="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <input
                placeholder="Password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <input
                placeholder="Phone (optional)"
                value={newUser.phone}
                onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="basic_member">Basic Member</option>
                <option value="leader">Leader</option>
                <option value="clergy">Clergy</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex gap-2">
                <button onClick={addUser} className="flex-1 bg-navy text-white py-2 rounded hover:bg-navy-600">
                  Add User
                </button>
                <button onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
