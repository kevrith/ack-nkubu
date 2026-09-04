import { useState, useEffect, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Image, Video, Music, File, Trash2, ExternalLink, Search } from 'lucide-react';
import { MediaUploader } from '@/components/shared/MediaUploader';
import { useAuth } from '@/hooks/useAuth';

interface MediaFile {
  id: string;
  url: string;
  public_id: string;
  type: 'image' | 'video' | 'audio' | 'raw';
  file_name: string;
  created_at: string;
}

type UploadKind = 'photo' | 'video' | 'audio';

// Android/iOS resolve the file picker from `accept`. A single top-level type
// ("image/*") opens Photos/Gallery directly; a mixed list ("image/*,video/*,
// audio/*") does not resolve to any gallery app, so the OS falls back to the
// generic Camera / Camcorder / Files chooser. Hence one button per kind.
const UPLOAD_KINDS: {
  id: UploadKind;
  label: string;
  accept: string;
  resourceType: 'image' | 'video' | 'audio';
  icon: ReactNode;
}[] = [
  { id: 'photo', label: 'Photo', accept: 'image/*', resourceType: 'image', icon: <Image className="h-4 w-4" /> },
  { id: 'video', label: 'Video', accept: 'video/*', resourceType: 'video', icon: <Video className="h-4 w-4" /> },
  { id: 'audio', label: 'Audio', accept: 'audio/*', resourceType: 'audio', icon: <Music className="h-4 w-4" /> },
];

export function MediaLibrary() {
  const { user } = useAuth();
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'audio'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploadKind, setUploadKind] = useState<UploadKind>('photo');

  const activeKind = UPLOAD_KINDS.find((k) => k.id === uploadKind)!;

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('media_files')
      .select('*')
      .order('created_at', { ascending: false });
    setMedia(data || []);
    setLoading(false);
  };

  const handleUploadComplete = async (url: string, publicId?: string) => {
    // Detect type from URL
    const ext = url.split('.').pop()?.toLowerCase() || ''
    const type = ['mp4', 'mov', 'avi', 'webm'].includes(ext) ? 'video'
      : ['mp3', 'wav', 'ogg', 'm4a'].includes(ext) ? 'audio'
      : 'image'

    await supabase.from('media_files').insert({
      url,
      public_id: publicId || url,
      type,
      file_name: publicId?.split('/').pop() || '',
      uploaded_by: user?.id,
    });
    loadMedia();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this file? This cannot be undone.')) return;
    await supabase.from('media_files').delete().eq('id', id);
    setMedia(media.filter(m => m.id !== id));
  };

  const filteredMedia = media.filter(m => {
    if (filter !== 'all' && m.type !== filter) return false;
    if (search && !m.file_name?.toLowerCase().includes(search.toLowerCase()) && !m.public_id.toLowerCase().includes(search.toLowerCase())) return false;
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

        <div className="space-y-3">
          <p className="block text-sm font-medium text-gray-700">Upload New File</p>
          <div className="flex flex-wrap gap-2">
            {UPLOAD_KINDS.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => setUploadKind(k.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm ${
                  uploadKind === k.id
                    ? 'bg-navy text-white border-navy'
                    : 'bg-white text-navy border-gray-300 hover:bg-gray-50'
                }`}
              >
                {k.icon}
                {k.label}
              </button>
            ))}
          </div>
          <MediaUploader
            key={uploadKind}
            accept={activeKind.accept}
            resourceType={activeKind.resourceType}
            onUploadComplete={handleUploadComplete}
            label=""
          />
        </div>
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
            <p className="text-sm text-gray-600 truncate mb-1">{file.file_name || file.public_id}</p>
            <p className="text-xs text-gray-400 mb-2">{new Date(file.created_at).toLocaleDateString()}</p>
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
                onClick={() => handleDelete(file.id)}
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
