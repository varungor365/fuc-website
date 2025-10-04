/**
 * Custom Image Loader for Deployment Independence
 * This ensures images work regardless of deployment platform
 */

export default function imageLoader({ src, width, quality }: {
  src: string;
  width: number;
  quality?: number;
}) {
  // For local development and self-hosted deployments
  if (src.startsWith('/') || src.startsWith('./')) {
    return src;
  }
  
  // For external images, return as-is (user responsibility)
  if (src.startsWith('http')) {
    return src;
  }
  
  // Default handling
  return src;
}