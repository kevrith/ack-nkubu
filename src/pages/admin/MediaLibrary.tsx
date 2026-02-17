import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Image, Video, Music, File, Trash2, ExternalLink, Search } from 'lucide-react';
import { MediaUploader } from '@/components/shared/MediaUploader';

interface MediaFile {
  id: string;
  url: string;
  public_id: string;
  type: 'image' | 'video' | 'audio' | 'raw';
  created_at: string;
}

export function MediaLibrary() {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'audio'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    const { data: sermons } = await supabase
      .from('sermons')
      .select('media_url, cloudinary_public_id, type, created_at')
      .not('media_url', 'is', null);

    const files: MediaFile[] = (sermons || []).map(s => ({
      id: s.cloudinary_public_id,
      url: s.media_url,
      public_id: s.cloudinary_public_id,
      type: s.type as any,
      created_at: s.created_at,
    }));

    setMedia(files);
    setLoading(false);
  };

  const handleDelete = async (publicId: string) => {
    if (!confirm('Delete this file? This cannot be undone.')) return;
    
    await supabase
      .from('sermons')
      .update({ media_url: null, cloudinary_public_id: null })
      .eq('cloudinary_public_id', publicId);
    
    setMedia(media.filter(m => m.public_id !== publicId));
  };

  const filteredMedia = media.filter(m => {
    if (filter !== 'all' && m.type !== filter) return false;
    if (search && !m.public_id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-8 w-8" />;
      case 'video': return <Video className="h-8 w-8" />;
      case 'audio': return <Music className="h-8 w-8" />;
      default: return <File className="h-8 w-8" />;
    }
  };

  if (loading) return <div className="text-center py-12">Loading media...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-playfair text-navy">Media Library</h1>

      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
          </select>
        </div>

        <MediaUploader
          accept="*"
          resourceType="auto"
          onUploadComplete={() => loadMedia()}
          label="Upload New File"
        />
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map((file) => (
          <div key={file.id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center h-32 bg-gray-100 rounded mb-3 text-navy">
              {file.type === 'image' ? (
                <img src={file.url} alt="" className="h-full w-full object-cover rounded" />
              ) : (
                getIcon(file.type)
              )}
            </div>
            <p className="text-sm text-gray-600 truncate mb-2">{file.public_id}</p>
            <div className="flex gap-2">
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-3 py-1 bg-navy text-white rounded text-sm hover:bg-navy-600 flex items-center justify-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                View
              </a>
              <button
                onClick={() => handleDelete(file.public_id)}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <File className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No media files found</p>
        </div>
      )}
    </div>
  );
}
