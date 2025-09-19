'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Upload, 
  X, 
  Camera, 
  Video, 
  Check,
  AlertCircle,
  Loader2,
  ThumbsUp,
  Image as ImageIcon
} from 'lucide-react';

interface ReviewFormProps {
  productId: string;
  orderId?: string;
  verifiedPurchase?: boolean;
  onSubmit: (reviewData: any) => void;
  onClose: () => void;
}

interface MediaFile {
  file: File;
  preview: string;
  type: 'image' | 'video';
}

export default function AdvancedReviewForm({ 
  productId, 
  orderId, 
  verifiedPurchase = false, 
  onSubmit, 
  onClose 
}: ReviewFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form data
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    content: '',
    reviewer_name: '',
    reviewer_email: '',
    size_purchased: '',
    fit_rating: 'true_to_size',
    quality_rating: 0,
    comfort_rating: 0,
    style_rating: 0,
    value_rating: 0,
    would_recommend: true
  });

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const fitOptions = [
    { value: 'runs_small', label: 'Runs Small', desc: 'Order a size up' },
    { value: 'true_to_size', label: 'True to Size', desc: 'Perfect fit' },
    { value: 'runs_large', label: 'Runs Large', desc: 'Order a size down' }
  ];

  const handleRatingChange = (field: string, rating: number) => {
    setFormData(prev => ({ ...prev, [field]: rating }));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      if (mediaFiles.length >= 5) {
        setError('Maximum 5 media files allowed');
        return;
      }

      // Validate file size (10MB for images, 50MB for videos)
      const maxSize = type === 'image' ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
      if (file.size > maxSize) {
        setError(`File too large. Max size: ${type === 'image' ? '10MB' : '50MB'}`);
        return;
      }

      const preview = URL.createObjectURL(file);
      setMediaFiles(prev => [...prev, { file, preview, type }]);
    });
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const validateForm = () => {
    if (!formData.rating) {
      setError('Overall rating is required');
      return false;
    }
    if (!formData.title.trim()) {
      setError('Review title is required');
      return false;
    }
    if (!formData.content.trim()) {
      setError('Review content is required');
      return false;
    }
    if (!formData.reviewer_name.trim()) {
      setError('Your name is required');
      return false;
    }
    if (!formData.reviewer_email.trim()) {
      setError('Email address is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Upload media files first
      const uploadedImages = [];
      const uploadedVideos = [];

      for (const media of mediaFiles) {
        const formData = new FormData();
        formData.append('files', media.file);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          if (media.type === 'image') {
            uploadedImages.push(uploadData[0].id);
          } else {
            uploadedVideos.push(uploadData[0].id);
          }
        }
      }

      // Submit review
      const reviewData = {
        ...formData,
        product: productId,
        order: orderId,
        verified_purchase: verifiedPurchase,
        images: uploadedImages,
        videos: uploadedVideos
      };

      await onSubmit(reviewData);
      
    } catch (err) {
      setError('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const StarRating = ({ value, onChange, label }: { value: number; onChange: (rating: number) => void; label: string }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 transition-colors"
          >
            <Star 
              className={`w-6 h-6 ${
                star <= value 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'text-gray-300 hover:text-yellow-400'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold">Write a Review</h2>
            {verifiedPurchase && (
              <span className="inline-flex items-center gap-1 text-sm text-green-600 mt-1">
                <Check className="w-4 h-4" />
                Verified Purchase
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNum}
                  </div>
                  {stepNum < 3 && <div className={`w-12 h-0.5 ${step > stepNum ? 'bg-black' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700"
            >
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {/* Step 1: Basic Rating */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">How would you rate this product?</h3>
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange('rating', star)}
                        className="p-2 transition-all hover:scale-110"
                      >
                        <Star 
                          className={`w-10 h-10 ${
                            star <= formData.rating 
                              ? 'fill-yellow-400 text-yellow-400' 
                              : 'text-gray-300 hover:text-yellow-400'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {formData.rating > 0 && (
                    <p className="text-sm text-gray-600">
                      {formData.rating === 1 && "Poor"}
                      {formData.rating === 2 && "Fair"}
                      {formData.rating === 3 && "Good"}
                      {formData.rating === 4 && "Very Good"}
                      {formData.rating === 5 && "Excellent"}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <StarRating
                    value={formData.quality_rating}
                    onChange={(rating) => handleRatingChange('quality_rating', rating)}
                    label="Quality"
                  />
                  <StarRating
                    value={formData.comfort_rating}
                    onChange={(rating) => handleRatingChange('comfort_rating', rating)}
                    label="Comfort"
                  />
                  <StarRating
                    value={formData.style_rating}
                    onChange={(rating) => handleRatingChange('style_rating', rating)}
                    label="Style"
                  />
                  <StarRating
                    value={formData.value_rating}
                    onChange={(rating) => handleRatingChange('value_rating', rating)}
                    label="Value"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size Purchased
                    </label>
                    <select
                      value={formData.size_purchased}
                      onChange={(e) => handleInputChange('size_purchased', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="">Select size</option>
                      {sizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      How does it fit?
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {fitOptions.map(option => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleInputChange('fit_rating', option.value)}
                          className={`p-3 rounded-lg border text-center transition-all ${
                            formData.fit_rating === option.value
                              ? 'border-black bg-black text-white'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="font-medium text-sm">{option.label}</div>
                          <div className="text-xs opacity-75">{option.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!formData.rating}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Written Review & Media */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Summarize your experience"
                    maxLength={100}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {formData.title.length}/100
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Review *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Tell others about your experience with this product..."
                    maxLength={1000}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {formData.content.length}/1000
                  </div>
                </div>

                {/* Media Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Add Photos or Videos (Optional)
                  </label>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                    >
                      <Camera className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-600">Add Photos</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                    >
                      <Video className="w-5 h-5 text-gray-500" />
                      <span className="text-sm text-gray-600">Add Videos</span>
                    </button>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'image')}
                    className="hidden"
                  />
                  
                  <input
                    ref={videoInputRef}
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={(e) => handleFileUpload(e, 'video')}
                    className="hidden"
                  />

                  {/* Media Preview */}
                  {mediaFiles.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {mediaFiles.map((media, index) => (
                        <div key={index} className="relative group">
                          {media.type === 'image' ? (
                            <img
                              src={media.preview}
                              alt="Preview"
                              className="w-full h-24 object-cover rounded-lg"
                            />
                          ) : (
                            <video
                              src={media.preview}
                              className="w-full h-24 object-cover rounded-lg"
                              muted
                            />
                          )}
                          <button
                            onClick={() => removeMedia(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    Max 5 files. Images: 10MB each, Videos: 50MB each
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="recommend"
                      checked={formData.would_recommend}
                      onChange={(e) => handleInputChange('would_recommend', e.target.checked)}
                      className="w-4 h-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <label htmlFor="recommend" className="text-sm font-medium text-gray-700">
                      I would recommend this product to a friend
                    </label>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!formData.title.trim() || !formData.content.trim()}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Contact Information */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={formData.reviewer_name}
                      onChange={(e) => handleInputChange('reviewer_name', e.target.value)}
                      placeholder="Enter your name"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.reviewer_email}
                      onChange={(e) => handleInputChange('reviewer_email', e.target.value)}
                      placeholder="Enter your email"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Review Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Overall Rating:</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`w-4 h-4 ${
                            star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                          }`} />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Title:</span>
                      <span className="font-medium">{formData.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Would Recommend:</span>
                      <span className={formData.would_recommend ? 'text-green-600' : 'text-red-600'}>
                        {formData.would_recommend ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Media Attached:</span>
                      <span>{mediaFiles.length} files</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  <p>By submitting this review, you agree to our terms of service and privacy policy. 
                  Your review will be moderated before being published.</p>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
