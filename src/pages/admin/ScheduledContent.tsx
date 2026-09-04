import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, Eye, EyeOff, AlertTriangle } from 'lucide-react';

type ContentKind = 'sermon' | 'notice' | 'event' | 'article';

interface ScheduledContent {
  id: string;
  type: ContentKind;
  title: string;
  /** Raw value from the source column — may be date-only or a full timestamp. */
  publish_date: string | null;
  /**
   * Whether the source column carries a time. sermons.sermon_date and
   * notices.publish_date are DATE columns, so every row would otherwise render
   * as "12:00:00 AM" — which is why every item looked like it had the same time.
   */
  hasTime: boolean;
  is_published: boolean;
}

const TABLE_BY_TYPE: Record<ContentKind, string> = {
  sermon: 'sermons',
  notice: 'notices',
  event: 'events',
  article: 'pastors_corner',
};

/**
 * Parse a Postgres date/timestamp for display.
 * A bare "2026-09-04" is parsed as UTC midnight by `new Date()`, which renders
 * as the previous day anywhere west of UTC — so build date-only values in local
 * time instead.
 */
function parseStamp(value: string | null): Date | null {
  if (!value) return null;
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.exec(value);
  if (dateOnly) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function ScheduledContent() {
  const [content, setContent] = useState<ScheduledContent[]>([]);
  const [filter, setFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

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

    const failed = [sermons.error, notices.error, events.error, articles.error].filter(Boolean);
    if (failed.length) {
      setError(failed.map(e => e!.message).join(' · '));
      setLoading(false);
      return;
    }
    setError(null);

    const allContent: ScheduledContent[] = [
      // DATE column — no time of day exists for these.
      ...(sermons.data || []).map(s => ({
        id: s.id, title: s.title, is_published: s.is_published,
        type: 'sermon' as const, publish_date: s.sermon_date, hasTime: false,
      })),
      ...(notices.data || []).map(n => ({
        id: n.id, title: n.title, is_published: n.is_published,
        type: 'notice' as const, publish_date: n.publish_date, hasTime: false,
      })),
      // TIMESTAMPTZ columns — real times.
      ...(events.data || []).map(e => ({
        id: e.id, title: e.title, is_published: e.is_published,
        type: 'event' as const, publish_date: e.start_datetime, hasTime: true,
      })),
      ...(articles.data || []).map(a => ({
        id: a.id, title: a.title, is_published: a.is_published,
        type: 'article' as const, publish_date: a.publish_date, hasTime: true,
      })),
    ];

    allContent.sort((a, b) => {
      const da = parseStamp(a.publish_date)?.getTime() ?? 0;
      const db = parseStamp(b.publish_date)?.getTime() ?? 0;
      return db - da;
    });

    setContent(allContent);
    setLoading(false);
  };

  const togglePublish = async (item: ScheduledContent) => {
    setBusyId(item.id);
    const { error: updateError } = await supabase
      .from(TABLE_BY_TYPE[item.type])
      .update({ is_published: !item.is_published })
      .eq('id', item.id);

    if (updateError) {
      setError(`Could not update "${item.title}": ${updateError.message}`);
      setBusyId(null);
      return;
    }

    // Reflect the change locally so the row doesn't flicker while we refetch.
    setContent(prev =>
      prev.map(c => (c.id === item.id && c.type === item.type ? { ...c, is_published: !c.is_published } : c)),
    );
    setBusyId(null);
    loadContent();
  };

  const filteredContent = content.filter(c => {
    if (filter === 'draft') return !c.is_published;
    if (filter === 'published') return c.is_published;
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-playfair text-navy">Content Schedule</h1>
        <div className="flex gap-2">
          {(['all', 'draft', 'published'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg capitalize ${filter === f ? 'bg-navy text-white' : 'bg-gray-100'}`}
            >
              {f === 'draft' ? 'Drafts' : f === 'published' ? 'Published' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        {filteredContent.map((item) => {
          const stamp = parseStamp(item.publish_date);
          const isFuture = stamp ? stamp.getTime() > Date.now() : false;

          return (
            <div key={`${item.type}-${item.id}`} className="bg-white rounded-lg shadow p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1 min-w-[200px]">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(item.type)}`}>
                    {item.type}
                  </span>
                  <h3 className="font-semibold text-navy">{item.title}</h3>
                  {isFuture && item.is_published && (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-800">
                      Dated ahead — live now
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {stamp ? stamp.toLocaleDateString() : 'No date set'}
                  </span>
                  {/* Only sources with a real time column get a clock. */}
                  {stamp && item.hasTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {stamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => togglePublish(item)}
                disabled={busyId === item.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg disabled:opacity-50 ${
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
          );
        })}
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
