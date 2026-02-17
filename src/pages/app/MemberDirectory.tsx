import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Phone, Mail, MapPin, Search } from 'lucide-react';

interface Member {
  id: string;
  full_name: string;
  phone: string;
  cell_group: string;
  membership_number: string;
  avatar_url: string;
  role: string;
}

export function MemberDirectory() {
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState('all');

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [searchTerm, filterGroup, members]);

  const loadMembers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, phone, cell_group, membership_number, avatar_url, role')
      .eq('is_active', true)
      .order('full_name', { ascending: true });

    if (!error) {
      setMembers(data || []);
      setFilteredMembers(data || []);
    }
    setLoading(false);
  };

  const filterMembers = () => {
    let filtered = members;

    if (searchTerm) {
      filtered = filtered.filter(m =>
        m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.cell_group?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterGroup !== 'all') {
      filtered = filtered.filter(m => m.cell_group === filterGroup);
    }

    setFilteredMembers(filtered);
  };

  const cellGroups = Array.from(new Set(members.map(m => m.cell_group).filter(Boolean)));

  if (loading) {
    return <div className="text-center py-12">Loading directory...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-playfair text-navy">Member Directory</h1>
        <div className="text-sm text-gray-600">
          {filteredMembers.length} of {members.length} members
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone, or cell group..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Groups</option>
            {cellGroups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-navy text-white flex items-center justify-center text-xl font-semibold flex-shrink-0">
                {member.avatar_url ? (
                  <img src={member.avatar_url} alt={member.full_name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  member.full_name.charAt(0).toUpperCase()
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-navy mb-1">{member.full_name}</h3>
                {member.membership_number && (
                  <p className="text-xs text-gray-500 mb-2">#{member.membership_number}</p>
                )}
                
                <div className="space-y-1 text-sm text-gray-600">
                  {member.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      <span className="truncate">{member.phone}</span>
                    </div>
                  )}
                  {member.cell_group && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{member.cell_group}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    member.role === 'admin' ? 'bg-red-100 text-red-800' :
                    member.role === 'clergy' ? 'bg-purple-100 text-purple-800' :
                    member.role === 'leader' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {member.role.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No members found</p>
        </div>
      )}
    </div>
  );
}
