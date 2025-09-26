/**
 * React Hook for Automatic Stock Image Replacement
 */

import { useState, useEffect, useCallback } from 'react';
import StockImageReplacer, { ImageRequest, ImageResult, ReplacementJob } from '@/utils/stockImageReplacer';

interface UseStockImageReplacerResult {
  isReplacing: boolean;
  progress: number;
  completed: number;
  total: number;
  results: ImageResult[];
  error: string | null;
  replaceAllImages: () => Promise<void>;
  getImageUrl: (id: string, fallback?: string) => string;
  generateSingleImage: (request: ImageRequest) => Promise<void>;
}

export function useStockImageReplacer(): UseStockImageReplacerResult {
  const [isReplacing, setIsReplacing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);
  const [results, setResults] = useState<ImageResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);

  const replacer = StockImageReplacer.getInstance();

  // Poll job status
  const pollJobStatus = useCallback(async (jobId: string) => {
    try {
      const status = await replacer.checkJobStatus(jobId);
      
      setProgress(status.progress || 0);
      setCompleted(status.completed || 0);
      setTotal(status.total || 0);
      setResults(status.results || []);

      if (status.status === 'completed') {
        setIsReplacing(false);
        setCurrentJobId(null);
        
        // Store generated images
        if (status.results) {
          replacer.storeGeneratedImages(status.results);
        }
        
        // Trigger page refresh to show new images
        window.dispatchEvent(new CustomEvent('stockImagesUpdated'));
        
      } else if (status.status === 'failed') {
        setIsReplacing(false);
        setCurrentJobId(null);
        setError(status.error || 'Image replacement failed');
      } else {
        // Continue polling
        setTimeout(() => pollJobStatus(jobId), 2000);
      }
    } catch (err) {
      console.error('Failed to poll job status:', err);
      setError('Failed to check replacement progress');
      setIsReplacing(false);
      setCurrentJobId(null);
    }
  }, [replacer]);

  // Replace all stock images
  const replaceAllImages = useCallback(async () => {
    try {
      setIsReplacing(true);
      setError(null);
      setProgress(0);
      setCompleted(0);
      setTotal(0);
      setResults([]);

      const jobId = await replacer.replaceAllStockImages();
      setCurrentJobId(jobId);
      
      // Start polling
      setTimeout(() => pollJobStatus(jobId), 1000);
      
    } catch (err) {
      console.error('Failed to start image replacement:', err);
      setError('Failed to start image replacement');
      setIsReplacing(false);
    }
  }, [replacer, pollJobStatus]);

  // Generate single image
  const generateSingleImage = useCallback(async (request: ImageRequest) => {
    try {
      setError(null);
      const jobId = await replacer.generateStockImage(request);
      
      // Poll for single image result
      const pollSingle = async () => {
        try {
          const status = await replacer.checkJobStatus(jobId);
          
          if (status.status === 'completed') {
            const newResult: ImageResult = {
              id: request.id,
              imageUrl: status.imageUrl,
              category: request.category,
              description: request.description
            };
            
            // Store and update
            replacer.storeGeneratedImages([newResult]);
            setResults(prev => [...prev.filter(r => r.id !== request.id), newResult]);
            
            // Trigger update
            window.dispatchEvent(new CustomEvent('stockImagesUpdated'));
            
          } else if (status.status === 'failed') {
            setError(`Failed to generate image: ${status.error}`);
          } else {
            setTimeout(pollSingle, 1000);
          }
        } catch (err) {
          console.error('Failed to poll single image:', err);
        }
      };
      
      setTimeout(pollSingle, 1000);
      
    } catch (err) {
      console.error('Failed to generate single image:', err);
      setError('Failed to generate image');
    }
  }, [replacer]);

  // Get image URL with automatic fallback
  const getImageUrl = useCallback((id: string, fallback?: string) => {
    return replacer.getImageUrl(id, fallback);
  }, [replacer]);

  return {
    isReplacing,
    progress,
    completed,
    total,
    results,
    error,
    replaceAllImages,
    getImageUrl,
    generateSingleImage
  };
}

export default useStockImageReplacer;