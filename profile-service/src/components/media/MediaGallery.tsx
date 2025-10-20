'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Video, 
  Music, 
  FileText, 
  Image as ImageIcon, 
  Grid3x3, 
  MoreHorizontal,
  Play,
  Pause,
  Download,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Move,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Volume2,
  VolumeX
} from 'lucide-react';

interface MediaItem {
  id: string;
  title: string;
  description?: string;
  media_type: 'video' | 'audio' | 'document' | 'image' | 'gallery';
  media_url: string;
  thumbnail_url?: string;
  file_size?: number;
  duration?: number;
  mime_type?: string;
  metadata: Record<string, any>;
  is_featured: boolean;
  display_order: number;
  visibility: 'public' | 'private' | 'unlisted';
}

interface MediaGalleryProps {
  userId: string;
  isEditable?: boolean;
}

export default function MediaGallery({ userId, isEditable = false }: MediaGalleryProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'carousel'>('grid');
  const [filter, setFilter] = useState<'all' | 'video' | 'audio' | 'image' | 'document'>('all');
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});

  // Handle file upload
  const handleFileUpload = useCallback(async (files: FileList) => {
    if (!files.length) return;

    setIsUploading(true);
    setUploadProgress(0);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90));
        }, 100);

        // Create form data
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name.split('.')[0]);
        formData.append('userId', userId);

        // Upload file
        const response = await fetch('/api/media/upload', {
          method: 'POST',
          body: formData
        });

        clearInterval(progressInterval);
        setUploadProgress(100);

        if (response.ok) {
          const newMedia = await response.json();
          setMediaItems(prev => [...prev, newMedia]);
        }

        // Reset progress for next file
        if (i < files.length - 1) {
          setUploadProgress(0);
        }

      } catch (error) {
        console.error('Upload error:', error);
      }
    }

    setIsUploading(false);
    setUploadProgress(0);
  }, [userId]);

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Filter media items
  const filteredMedia = mediaItems.filter(item => {
    if (filter === 'all') return true;
    return item.media_type === filter;
  });

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle media play/pause
  const toggleMediaPlayback = (mediaId: string, mediaType: 'video' | 'audio') => {
    if (mediaType === 'audio') {
      const audio = audioRefs.current[mediaId];
      if (audio) {
        if (isPlaying === mediaId) {
          audio.pause();
          setIsPlaying(null);
        } else {
          // Pause other audio
          Object.values(audioRefs.current).forEach(a => a.pause());
          audio.play();
          setIsPlaying(mediaId);
        }
      }
    } else if (mediaType === 'video') {
      const video = videoRefs.current[mediaId];
      if (video) {
        if (isPlaying === mediaId) {
          video.pause();
          setIsPlaying(null);
        } else {
          // Pause other videos
          Object.values(videoRefs.current).forEach(v => v.pause());
          video.play();
          setIsPlaying(mediaId);
        }
      }
    }
  };

  // Open lightbox
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setShowLightbox(true);
  };

  // Render media item based on type
  const renderMediaItem = (item: MediaItem, index: number) => {
    const isItemPlaying = isPlaying === item.id;

    return (
      <motion.div
        key={item.id}
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        {/* Media Preview */}
        <div className="relative aspect-video bg-gray-100">
          {item.media_type === 'image' && (
            <img
              src={item.media_url}
              alt={item.title}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => openLightbox(index)}
            />
          )}

          {item.media_type === 'video' && (
            <div className="relative w-full h-full">
              <video
                ref={el => { if (el) videoRefs.current[item.id] = el; }}
                src={item.media_url}
                poster={item.thumbnail_url}
                className="w-full h-full object-cover"
                muted={isMuted}
                onEnded={() => setIsPlaying(null)}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={() => toggleMediaPlayback(item.id, 'video')}
                  className="bg-black/50 text-white p-4 rounded-full hover:bg-black/70 transition-colors"
                >
                  {isItemPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
              </div>
              {item.duration && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {formatDuration(item.duration)}
                </div>
              )}
            </div>
          )}

          {item.media_type === 'audio' && (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-500 to-pink-500">
              <div className="text-center text-white">
                <Music className="w-16 h-16 mx-auto mb-4" />
                <button
                  onClick={() => toggleMediaPlayback(item.id, 'audio')}
                  className="bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                >
                  {isItemPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <audio
                  ref={el => { if (el) audioRefs.current[item.id] = el; }}
                  src={item.media_url}
                  onEnded={() => setIsPlaying(null)}
                />
              </div>
              {item.duration && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {formatDuration(item.duration)}
                </div>
              )}
            </div>
          )}

          {item.media_type === 'document' && (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-500 to-cyan-500">
              <div className="text-center text-white">
                <FileText className="w-16 h-16 mx-auto mb-4" />
                <button
                  onClick={() => window.open(item.media_url, '_blank')}
                  className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
                >
                  Open Document
                </button>
              </div>
            </div>
          )}

          {/* Overlay Actions */}
          {isEditable && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-1">
                <button className="bg-black/50 text-white p-2 rounded-lg hover:bg-black/70">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="bg-black/50 text-white p-2 rounded-lg hover:bg-black/70">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Featured Badge */}
          {item.is_featured && (
            <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-semibold">
              Featured
            </div>
          )}
        </div>

        {/* Media Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
          {item.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
          )}
          
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              {item.media_type === 'video' && <Video className="w-4 h-4" />}
              {item.media_type === 'audio' && <Music className="w-4 h-4" />}
              {item.media_type === 'document' && <FileText className="w-4 h-4" />}
              {item.media_type === 'image' && <ImageIcon className="w-4 h-4" />}
              <span className="capitalize">{item.media_type}</span>
            </div>
            {item.file_size && (
              <span>{formatFileSize(item.file_size)}</span>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Media Gallery</h2>
          <p className="text-gray-600">Share your multimedia content</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Upload Button */}
          {isEditable && (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              {isUploading ? 'Uploading...' : 'Upload Media'}
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {(['all', 'image', 'video', 'audio', 'document'] as const).map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filter === filterType
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Uploading...</span>
            <span className="text-sm text-blue-700">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Drop Zone */}
      {isEditable && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Drag and drop your files here, or click to select</p>
          <p className="text-sm text-gray-500">Supports images, videos, audio, and documents</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="hidden"
          />
        </div>
      )}

      {/* Media Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'grid-cols-1'
      }`}>
        <AnimatePresence>
          {filteredMedia.map((item, index) => renderMediaItem(item, index))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredMedia.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Media Files</h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all' 
              ? 'Upload your first media file to get started' 
              : `No ${filter} files found`
            }
          </p>
          {isEditable && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Upload Media
            </button>
          )}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setShowLightbox(false)}
          >
            <div className="relative max-w-4xl max-h-full p-4">
              <img
                src={filteredMedia[lightboxIndex]?.media_url}
                alt={filteredMedia[lightboxIndex]?.title}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              
              {/* Navigation */}
              {filteredMedia.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(prev => prev > 0 ? prev - 1 : filteredMedia.length - 1);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(prev => prev < filteredMedia.length - 1 ? prev + 1 : 0);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Close Button */}
              <button
                onClick={() => setShowLightbox(false)}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}