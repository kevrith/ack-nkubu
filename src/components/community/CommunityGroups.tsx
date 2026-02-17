import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, Lock, Globe, UserPlus } from 'lucide-react';

interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  cover_image_url: string;
  is_private: boolean;
  member_count: number;
  leader: { full_name: string };
}

export function CommunityGroups({ onSelectGroup }: { onSelectGroup: (groupId: string) => void }) {
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    const { data, error } = await supabase
      .from('community_groups')
      .select('*, leader:profiles!community_groups_leader_id_fkey(full_name)')
      .order('member_count', { ascending: false });

    if (!error) setGroups(data || []);
    setLoading(false);
  };

  if (loading) return <div className="text-center py-8">Loading groups...</div>;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => (
        <div
          key={group.id}
          onClick={() => onSelectGroup(group.id)}
          className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
        >
          {group.cover_image_url ? (
            <img 
              src={group.cover_image_url} 
              alt={group.name}
              className="w-full h-32 object-cover"
            />
          ) : (
            <div className="w-full h-32 bg-gradient-to-br from-navy to-navy-600 flex items-center justify-center">
              <Users className="h-12 w-12 text-white opacity-50" />
            </div>
          )}
          
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-navy">{group.name}</h3>
              {group.is_private ? (
                <Lock className="h-4 w-4 text-gray-400" />
              ) : (
                <Globe className="h-4 w-4 text-gray-400" />
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{group.description}</p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {group.member_count} members
              </span>
              <span>Led by {group.leader?.full_name}</span>
            </div>
            
            <button className="w-full mt-3 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-600 flex items-center justify-center gap-2 text-sm">
              <UserPlus className="h-4 w-4" />
              Join Group
            </button>
          </div>
        </div>
      ))}
      
      {groups.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-500">
          <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No community groups available yet</p>
        </div>
      )}
    </div>
  );
}
