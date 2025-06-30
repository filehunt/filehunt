import { useState, useCallback } from 'react';

export function useUpload() {
  const [uploadFiles, setUploadFiles] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState<any>({});

  const handleUploadFiles = useCallback((files: FileList) => {
    const fileArray = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'pending'
    }));

    setUploadFiles(prev => [...prev, ...fileArray]);
    return fileArray;
  }, []);

  return {
    uploadFiles,
    uploadProgress,
    setUploadFiles,
    setUploadProgress,
    handleUploadFiles
  };
}
