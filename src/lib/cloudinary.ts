const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  resource_type: string;
  format: string;
  duration?: number;
}

export async function uploadToCloudinary(
  file: File,
  resourceType: 'image' | 'video' | 'audio' | 'raw' = 'image'
): Promise<CloudinaryUploadResult> {
  // Cloudinary has no `audio` resource type or endpoint — audio files are
  // stored and served under `video`. Posting to /audio/upload 404s.
  const endpoint = resourceType === 'audio' ? 'video' : resourceType;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('resource_type', endpoint);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${endpoint}/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return response.json();
}
