'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PhotoIcon, 
  CloudArrowUpIcon, 
  XMarkIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface ImageKitUploadProps {
  onUpload: (url: string, fileId: string) => void;
  folder?: string;
  fileName?: string;
  className?: string;
  accept?: string;
  maxSize?: number; // in MB
  multiple?: boolean;
  children?: React.ReactNode;
}

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  status: 'uploading' | 'success' | 'error';
  progress: number;
}

const ImageKitUpload: React.FC<ImageKitUploadProps> = ({
  onUpload,
  folder = 'uploads',
  fileName,
  className = '',
  accept = 'image/*',
  maxSize = 10,
  multiple = false,
  children
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
  };

  const handleFiles = (selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
        return false;
      }
      return true;
    });

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      url: '',
      size: file.size,
      status: 'uploading',
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload process (replace with actual ImageKit upload)
    validFiles.forEach((file, index) => {
      simulateUpload(newFiles[index], file);
    });
  };

  const simulateUpload = async (uploadedFile: UploadedFile, file: File) => {
    // Simulate upload progress
    const interval = setInterval(() => {
      setFiles(prev => prev.map(f => 
        f.id === uploadedFile.id 
          ? { ...f, progress: Math.min(f.progress + 10, 90) }
          : f
      ));
    }, 200);

    // Simulate upload completion after 2 seconds
    setTimeout(() => {
      clearInterval(interval);
      
      // Create a mock ImageKit URL
      const mockUrl = `https://ik.imagekit.io/fashun/${folder}/${fileName || file.name}`;
      
      setFiles(prev => prev.map(f => 
        f.id === uploadedFile.id 
          ? { ...f, status: 'success', progress: 100, url: mockUrl }
          : f
      ));

      onUpload(mockUrl, uploadedFile.id);
    }, 2000);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <motion.div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
          isDragging
            ? 'border-purple-400 bg-purple-400/10 scale-105'
            : 'border-white/20 bg-white/5 hover:border-purple-400/50 hover:bg-white/10'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />

        {children || (
          <div className="space-y-4">
            <div className="flex justify-center">
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center"
                animate={{ rotate: isDragging ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <CloudArrowUpIcon className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {isDragging ? 'Drop files here' : 'Upload Images'}
              </h3>
              <p className="text-gray-400 text-sm">
                Drag and drop your images here, or click to browse
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Maximum file size: {maxSize}MB • Supported: JPG, PNG, WebP, GIF
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {file.status === 'uploading' && (
                    <ArrowPathIcon className="w-6 h-6 text-purple-400 animate-spin" />
                  )}
                  {file.status === 'success' && (
                    <CheckCircleIcon className="w-6 h-6 text-green-400" />
                  )}
                  {file.status === 'error' && (
                    <XMarkIcon className="w-6 h-6 text-red-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-white truncate">
                      {file.name}
                    </p>
                    <span className="text-xs text-gray-400">
                      {formatFileSize(file.size)}
                    </span>
                  </div>

                  {file.status === 'uploading' && (
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                        style={{ width: `${file.progress}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${file.progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  )}

                  {file.status === 'success' && (
                    <p className="text-xs text-green-400">
                      Upload complete • Ready to use
                    </p>
                  )}

                  {file.status === 'error' && (
                    <p className="text-xs text-red-400">
                      Upload failed • Please try again
                    </p>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                >
                  <XMarkIcon className="w-4 h-4 text-gray-400 hover:text-red-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageKitUpload;