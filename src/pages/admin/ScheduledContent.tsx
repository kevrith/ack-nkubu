import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, Eye, EyeOff } from 'lucide-react';

interface ScheduledContent {
  id: string;
  type: 'sermon' | 'notice' | 'event' | 'article';
  title: string;
  publish_date: string;
  is_published: boolean;
}

export function ScheduledContent() {
  const [content, setContent] = useState<ScheduledContent[]>([]);
  const [filter, setFilter] = useState<'all' | 'draft' | 'scheduled'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    const [sermons, notices, events, articles] = await Promise.all([
      supabase.from('sermons').select('id, title, sermon_date, is_published').order('sermon_date', { ascending: false }),
      supabase.from('notices').select('id, title, publish_date, is_published').order('publish_date', { ascending: false }),
      supabase.from('events').select('id, title, start_datetime, is_published').order('start_datetime', { ascending: false }),
      supabase.from('pastors_corner').select('id, title, publish_date, is_published').order('publish_date', { ascending: false }),
    ]);

    const allContent: ScheduledContent[] = [
      ...(sermons.data || []).map(s => ({ ...s, type: 'sermon' as const, publish_date: s.sermon_date })),
      ...(notices.data || []).map(n => ({ ...n, type: 'notice' as const })),
      ...(events.data || []).map(e => ({ ...e, type: 'event' as const, publish_date: e.start_datetime })),
      ...(articles.data || []).map(a => ({ ...a, type: 'article' as const })),
    ];

    setContent(allContent);
    setLoading(false);
  };

  const togglePublish = async (item: ScheduledContent) => {
    const table = item.type === 'sermon' ? 'sermons' : 
                  item.type === 'notice' ? 'notices' :
                  item.type === 'event' ? 'events' : 'pastors_corner';

    await supabase
      .from(table)
      .update({ is_published: !item.is_published })
      .eq('id', item.id);

    loadContent();
  };

  const filteredContent = content.filter(c => {
    if (filter === 'draft') return !c.is_published;
    if (filter === 'scheduled') return c.is_published;
    return true;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sermon': return 'bg-purple-100 text-purple-800';
      case 'notice': return 'bg-yellow-100 text-yellow-800';
      case 'event': return 'bg-blue-100 text-blue-800';
      case 'article': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-playfair text-navy">Scheduled Content</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-navy text-white' : 'bg-gray-100'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-4 py-2 rounded-lg ${filter === 'draft' ? 'bg-navy text-white' : 'bg-gray-100'}`}
          >
            Drafts
          </button>
          <button
            onClick={() => setFilter('scheduled')}
            className={`px-4 py-2 rounded-lg ${filter === 'scheduled' ? 'bg-navy text-white' : 'bg-gray-100'}`}
          >
            Published
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredContent.map((item) => (
          <div key={`${item.type}-${item.id}`} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(item.type)}`}>
                  {item.type}
                </span>
                <h3 className="font-semibold text-navy">{item.title}</h3>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(item.publish_date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date(item.publish_date).toLocaleTimeString()}
                </span>
              </div>
            </div>
            <button
              onClick={() => togglePublish(item)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                item.is_published
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {item.is_published ? (
                <>
                  <Eye className="h-4 w-4" />
                  Published
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4" />
                  Draft
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No content found</p>
        </div>
      )}
    </div>
  );
}
