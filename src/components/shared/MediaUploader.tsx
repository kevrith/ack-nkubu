import { useState } from 'react';
import { Upload, X, Loader2, CheckCircle } from 'lucide-react';
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setError(null);
    setDone(false);
    setSelectedFile(file);

    if (resourceType === 'image' || file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);
    try {
      const result = await uploadToCloudinary(selectedFile, resourceType);
      onUploadComplete(result.secure_url, result.public_id, result.duration);
      setDone(true);
      setPreview(null);
      setSelectedFile(null);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const clearSelection = () => {
    setPreview(null);
    setSelectedFile(null);
    setError(null);
    setDone(false);
  };

  return (
    <div className="space-y-3">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      {/* File picker */}
      {!selectedFile && (
        <label className="cursor-pointer">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex items-center gap-2 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy/90 w-fit">
            <Upload className="h-4 w-4" />
            <span>Choose File</span>
          </div>
        </label>
      )}

      {/* Preview + upload button */}
      {selectedFile && (
        <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
          {preview && (
            <img src={preview} alt="Preview" className="h-40 w-auto rounded-lg object-cover" />
          )}
          <p className="text-sm text-gray-700 font-medium truncate">{selectedFile.name}</p>
          <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          <div className="flex gap-2">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            <button
              onClick={clearSelection}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {done && (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle className="h-4 w-4" />
          Uploaded successfully!
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
