import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Folder, ChevronRight } from 'lucide-react';

interface SermonSeries {
  id: string;
  title: string;
  description: string;
  cover_image_url: string;
  sermon_count: number;
}

export function SermonSeries({ onSelectSeries }: { onSelectSeries: (seriesId: string) => void }) {
  const [series, setSeries] = useState<SermonSeries[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSeries();
  }, []);

  const loadSeries = async () => {
    const { data, error } = await supabase
      .from('sermon_series')
      .select(`
        *,
        sermons(count)
      `)
      .eq('is_active', true)
      .order('start_date', { ascending: false });

    if (!error && data) {
      setSeries(data.map(s => ({
        ...s,
        sermon_count: s.sermons?.[0]?.count || 0
      })));
    }
    setLoading(false);
  };

  if (loading) return <div className="text-center py-8">Loading series...</div>;

  if (series.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Folder className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p>No sermon series available</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {series.map((s) => (
        <div
          key={s.id}
          onClick={() => onSelectSeries(s.id)}
          className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
        >
          {s.cover_image_url && (
            <img 
              src={s.cover_image_url} 
              alt={s.title}
              className="w-full h-40 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="font-semibold text-navy mb-2 flex items-center justify-between">
              {s.title}
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{s.description}</p>
            <span className="text-xs text-gray-500">{s.sermon_count} sermons</span>
          </div>
        </div>
      ))}
    </div>
  );
}
