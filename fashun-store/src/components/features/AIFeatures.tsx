'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  EyeIcon,
  MicrophoneIcon,
  CameraIcon,
  ShoppingBagIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import GlassCard from '@/components/ui/premium/GlassCard';
import NeonButton from '@/components/ui/premium/NeonButton';
import HolographicText from '@/components/ui/premium/HolographicText';
import FloatingElement from '@/components/ui/premium/FloatingElement';

interface AIRecommendation {
  id: string;
  productId: string;
  title: string;
  description: string;
  image: string;
  price: number;
  confidence: number;
  reason: string;
  tags: string[];
}

// Mock AI recommendation service
class AIRecommendationEngine {
  async getPersonalizedRecommendations(userId: string, limit: number = 10): Promise<AIRecommendation[]> {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockRecommendations: AIRecommendation[] = [
      {
        id: 'rec-1',
        productId: 'prod-001',
        title: 'Cyber Neon Hoodie Pro',
        description: 'Premium hoodie with LED accents and holographic details',
        image: '/images/products/hoodies/hoodie-1-main.jpg',
        price: 4999,
        confidence: 95,
        reason: 'Based on your interest in neon fashion and recent hoodie purchases',
        tags: ['trending', 'ai-curated', 'perfect-match']
      },
      {
        id: 'rec-2',
        productId: 'prod-002',
        title: 'Holographic Tech T-Shirt',
        description: 'Interactive t-shirt with AR-enabled holographic patterns',
        image: '/images/products/t-shirts/tshirt-1-main.jpg',
        price: 2999,
        confidence: 88,
        reason: 'Customers with similar taste also loved this',
        tags: ['ar-enabled', 'tech-fashion']
      },
      {
        id: 'rec-3',
        productId: 'prod-003',
        title: 'Quantum Gaming Jacket',
        description: 'Smart jacket with built-in LED matrix and gaming controls',
        image: '/images/products/jackets/jacket-1-main.jpg',
        price: 7999,
        confidence: 92,
        reason: 'Perfect for your gaming and tech interests',
        tags: ['gaming', 'smart-clothing', 'limited-edition']
      }
    ];

    return mockRecommendations.slice(0, limit);
  }

  async getVoiceRecommendations(voiceQuery: string): Promise<AIRecommendation[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      {
        id: 'voice-1',
        productId: 'prod-006',
        title: 'Voice-Curated Selection',
        description: 'Based on your voice search preferences',
        image: '/images/products/accessories/acc-1-main.jpg',
        price: 1999,
        confidence: 85,
        reason: `Matched your voice query: "${voiceQuery}"`,
        tags: ['voice-search', 'ai-curated']
      }
    ];
  }

  async getARRecommendations(bodyMeasurements: any): Promise<AIRecommendation[]> {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return [
      {
        id: 'ar-1',
        productId: 'prod-007',
        title: 'Perfect Fit Hoodie',
        description: 'AI-calculated perfect fit based on your measurements',
        image: '/images/products/hoodies/hoodie-2-main.jpg',
        price: 4499,
        confidence: 99,
        reason: 'AR analysis shows perfect fit for your body type',
        tags: ['perfect-fit', 'ar-verified', 'size-optimized']
      }
    ];
  }
}

// Voice Commerce Component
const VoiceCommerce = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceRecommendations, setVoiceRecommendations] = useState<AIRecommendation[]>([]);

  const startVoiceSearch = () => {
    setIsListening(true);
    setTimeout(() => {
      setTranscript('I want something trendy for gaming');
      setIsListening(false);
      const engine = new AIRecommendationEngine();
      engine.getVoiceRecommendations('trendy gaming').then(setVoiceRecommendations);
    }, 3000);
  };

  return (
    <GlassCard variant="crystal" glowColor="blue" className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <MicrophoneIcon className="w-8 h-8 text-blue-400" />
        <HolographicText variant="cyber" size="lg">
          Voice Commerce
        </HolographicText>
      </div>
      
      <div className="space-y-4">
        <p className="text-white/80">
          Speak naturally to find products. Our AI understands context, style preferences, and shopping intent.
        </p>
        
        <NeonButton
          variant={isListening ? "danger" : "primary"}
          size="lg"
          glowIntensity="high"
          animated={true}
          onClick={startVoiceSearch}
        >
          <div className="flex items-center gap-3">
            <MicrophoneIcon className={`w-6 h-6 ${isListening ? 'animate-pulse' : ''}`} />
            {isListening ? 'Listening...' : 'Start Voice Search'}
          </div>
        </NeonButton>
        
        {transcript && (
          <div className="p-4 bg-white/10 rounded-xl">
            <p className="text-white">You said: "{transcript}"</p>
          </div>
        )}
        
        {voiceRecommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white font-semibold">Voice Recommendations:</h4>
            {voiceRecommendations.map(rec => (
              <div key={rec.id} className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <img src={rec.image} alt={rec.title} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h5 className="text-white font-medium">{rec.title}</h5>
                    <p className="text-white/60 text-sm">{rec.reason}</p>
                  </div>
                  <span className="text-green-400 font-bold">₹{rec.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

// AR Try-On Component
const ARTryOn = () => {
  const [isARActive, setIsARActive] = useState(false);
  const [arRecommendations, setArRecommendations] = useState<AIRecommendation[]>([]);

  const startARTryOn = async () => {
    setIsARActive(true);
    setTimeout(() => {
      setIsARActive(false);
      const engine = new AIRecommendationEngine();
      engine.getARRecommendations({}).then(setArRecommendations);
    }, 4000);
  };

  return (
    <GlassCard variant="frost" glowColor="purple" className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <EyeIcon className="w-8 h-8 text-purple-400" />
        <HolographicText variant="aurora" size="lg">
          AR Try-On Experience
        </HolographicText>
      </div>
      
      <div className="space-y-4">
        <p className="text-white/80">
          Use your camera to virtually try on clothes. AI analyzes fit, style, and recommends perfect sizes.
        </p>
        
        <div className="aspect-video bg-black/50 rounded-xl flex items-center justify-center relative overflow-hidden">
          {isARActive ? (
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-white">Analyzing your measurements...</p>
            </div>
          ) : (
            <div className="text-center">
              <CameraIcon className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <p className="text-white/60">Camera preview will appear here</p>
            </div>
          )}
        </div>
        
        <NeonButton
          variant="secondary"
          size="lg"
          glowIntensity="high"
          animated={true}
          onClick={startARTryOn}
        >
          <div className="flex items-center gap-3">
            <EyeIcon className="w-6 h-6" />
            {isARActive ? 'Processing AR...' : 'Start AR Try-On'}
          </div>
        </NeonButton>
        
        {arRecommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-white font-semibold">AR-Optimized Recommendations:</h4>
            {arRecommendations.map(rec => (
              <div key={rec.id} className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl">
                <div className="flex items-center gap-4">
                  <img src={rec.image} alt={rec.title} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h5 className="text-white font-semibold">{rec.title}</h5>
                    <p className="text-purple-200 text-sm">{rec.description}</p>
                    <p className="text-white/60 text-xs mt-1">{rec.reason}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-green-400 font-bold text-lg">₹{rec.price}</span>
                    <div className="text-purple-300 text-sm">{rec.confidence}% match</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </GlassCard>
  );
};

// Main AI Features Component
const AIFeatures = () => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      const engine = new AIRecommendationEngine();
      const recs = await engine.getPersonalizedRecommendations('user-123', 6);
      setRecommendations(recs);
      setIsLoading(false);
    };
    
    loadRecommendations();
  }, []);

  return (
    <div className="space-y-8">
      {/* AI-Powered Personalized Recommendations */}
      <div>
        <div className="flex items-center gap-4 mb-6">
          <SparklesIcon className="w-10 h-10 text-purple-400" />
          <HolographicText variant="cyber" size="2xl">
            AI-Powered Recommendations
          </HolographicText>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <GlassCard variant="blur" className="p-6">
                  <div className="w-full h-48 bg-white/10 rounded-xl mb-4" />
                  <div className="h-4 bg-white/10 rounded mb-2" />
                  <div className="h-3 bg-white/10 rounded w-2/3" />
                </GlassCard>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {recommendations.map((rec, index) => (
              <FloatingElement key={rec.id} floatIntensity="gentle" glowEffect>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard variant="crystal" glowColor="purple" className="p-6 group cursor-pointer">
                    <div className="relative mb-4">
                      <img
                        src={rec.image}
                        alt={rec.title}
                        className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 flex gap-2">
                        {rec.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="absolute bottom-3 left-3 px-3 py-1 bg-purple-500/80 backdrop-blur-sm rounded-full text-sm font-semibold text-white">
                        {rec.confidence}% Match
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2">{rec.title}</h3>
                    <p className="text-white/70 text-sm mb-3">{rec.description}</p>
                    <p className="text-purple-300 text-xs mb-4 italic">{rec.reason}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-400">₹{rec.price}</span>
                      <NeonButton variant="primary" size="sm" glowIntensity="medium">
                        Add to Cart
                      </NeonButton>
                    </div>
                  </GlassCard>
                </motion.div>
              </FloatingElement>
            ))}
          </div>
        )}
      </div>
      
      {/* Advanced AI Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <VoiceCommerce />
        <ARTryOn />
      </div>
      
      {/* AI Insights Dashboard */}
      <GlassCard variant="blur" glowColor="cyan" className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <ChartBarIcon className="w-8 h-8 text-cyan-400" />
          <HolographicText variant="aurora" size="xl">
            AI Insights Dashboard
          </HolographicText>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-cyan-400 mb-2">94%</div>
            <div className="text-white/80">Recommendation Accuracy</div>
            <div className="text-white/60 text-sm">Based on user feedback</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">67%</div>
            <div className="text-white/80">Conversion Rate Increase</div>
            <div className="text-white/60 text-sm">With AI recommendations</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-pink-400 mb-2">12.3s</div>
            <div className="text-white/80">Average Decision Time</div>
            <div className="text-white/60 text-sm">Reduced with AI assistance</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default AIFeatures;