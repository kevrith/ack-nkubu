import { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary';

interface MediaUploaderProps {
  accept: string;
  resourceType: 'image' | 'video' | 'audio' | 'raw';
  onUploadComplete: (url: string, publicId?: string, duration?: number) => void;
  maxSizeMB?: number;
  label?: string;
}

export function MediaUploader({
  accept,
  resourceType,
  onUploadComplete,
  maxSizeMB = 100,
  label = 'Upload File',
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setError(null);
    setUploading(true);

    try {
      // Show preview for images
      if (resourceType === 'image') {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      }

      const result = await uploadToCloudinary(file, resourceType);
      onUploadComplete(result.secure_url, result.public_id, result.duration);
    } catch (err) {
      setError('Upload failed. Please try again.');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const clearPreview = () => {
    setPreview(null);
    setError(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      {preview && resourceType === 'image' ? (
        <div className="relative inline-block">
          <img src={preview} alt="Preview" className="h-32 w-auto rounded-lg" />
          <button
            onClick={clearPreview}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <label className="cursor-pointer">
            <input
              type="file"
              accept={accept}
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
            <div className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-600 disabled:opacity-50">
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              <span>{uploading ? 'Uploading...' : 'Choose File'}</span>
            </div>
          </label>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
