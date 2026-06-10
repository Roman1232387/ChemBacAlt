import axiosInstance from './axiosInstance';

export interface UploadedFile {
  id: number;
  originalName: string;
  storedName: string;
  url: string;
  fileType: 'pdf' | 'docx' | 'image' | string;
  sizeBytes: number;
  category: string;
  uploadedAt: string;
  uploadedByUserId: number;
}

export const FileService = {
  async upload(file: File, category: string, onProgress?: (percent: number) => void): Promise<{ id: number; url: string; originalName: string }> {
    const form = new FormData();
    form.append('file', file);
    const response = await axiosInstance.post(`/files/upload?category=${encodeURIComponent(category)}`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (!event.total || !onProgress) return;
        onProgress(Math.round((event.loaded / event.total) * 100));
      },
    });
    return response.data;
  },

  async getAll(): Promise<UploadedFile[]> {
    const response = await axiosInstance.get('/files');
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/files/${id}`);
  },

  getDownloadUrl(url: string): string {
    return `http://localhost:5188${url}`;
  },
};
