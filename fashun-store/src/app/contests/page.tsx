'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Calendar, 
  Users, 
  Heart, 
  Eye, 
  MessageCircle, 
  Star,
  Clock,
  Award,
  Filter,
  Search,
  Upload,
  Gift,
  Target,
  Palette,
  Sparkles,
  Timer,
  Medal,
  Crown,
  ChevronRight,
  Play,
  Pause,
  TrendingUp,
  Zap
} from 'lucide-react';

// Note: metadata export removed due to 'use client' directive
// Metadata should be handled in a separate layout or server component

// Types
interface Contest {
  id: number;
  title: string;
  description: string;
  brief: string;
  cover_image: string;
  start_date: string;
  end_date: string;
  voting_end_date: string;
  status: 'upcoming' | 'active' | 'voting' | 'ended' | 'cancelled';
  contest_type: string;
  theme: string;
  prizes: Array<{
    position: number;
    title: string;
    value: string;
    description: string;
  }>;
  total_participants: number;
  total_submissions: number;
  total_votes: number;
  entry_fee: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  voting_type: 'community' | 'judges' | 'hybrid';
  is_featured: boolean;
  tags: string[];
}

interface Submission {
  id: number;
  title: string;
  description: string;
  design_image: string;
  author: {
    username: string;
    avatar: string;
    verified: boolean;
  };
  votes_count: number;
  likes_count: number;
  views_count: number;
  rank?: number;
  submission_date: string;
  tags: string[];
}

// Mock Data
const mockContests: Contest[] = [
  {
    id: 1,
    title: "Urban Street Revolution",
    description: "Design the next generation of streetwear that defines urban culture",
    brief: "Create innovative streetwear designs that capture the essence of modern urban life. Think bold graphics, unique cuts, and cultural significance.",
    cover_image: "/api/placeholder/800/600",
    start_date: "2024-01-20T00:00:00Z",
    end_date: "2024-02-20T23:59:59Z",
    voting_end_date: "2024-02-27T23:59:59Z",
    status: "active",
    contest_type: "themed",
    theme: "Urban Culture",
    prizes: [
      { position: 1, title: "Grand Prize", value: "$5,000", description: "Cash prize + production deal" },
      { position: 2, title: "Runner Up", value: "$2,500", description: "Cash prize + feature on website" },
      { position: 3, title: "Third Place", value: "$1,000", description: "Cash prize + merchandise package" }
    ],
    total_participants: 1247,
    total_submissions: 892,
    total_votes: 15634,
    entry_fee: 0,
    difficulty_level: "intermediate",
    voting_type: "hybrid",
    is_featured: true,
    tags: ["streetwear", "urban", "culture", "graphics"]
  },
  {
    id: 2,
    title: "Sustainable Future",
    description: "Eco-friendly designs that don't compromise on style",
    brief: "Design sustainable fashion pieces using eco-friendly materials and processes. Show how fashion can be both stylish and environmentally conscious.",
    cover_image: "/api/placeholder/800/600",
    start_date: "2024-01-15T00:00:00Z",
    end_date: "2024-02-15T23:59:59Z",
    voting_end_date: "2024-02-22T23:59:59Z",
    status: "voting",
    contest_type: "themed",
    theme: "Sustainability",
    prizes: [
      { position: 1, title: "Eco Champion", value: "$3,000", description: "Cash prize + sustainable materials kit" },
      { position: 2, title: "Green Runner Up", value: "$1,500", description: "Cash prize + eco-certification" }
    ],
    total_participants: 856,
    total_submissions: 634,
    total_votes: 12453,
    entry_fee: 0,
    difficulty_level: "advanced",
    voting_type: "community",
    is_featured: false,
    tags: ["sustainable", "eco-friendly", "green", "ethical"]
  },
  {
    id: 3,
    title: "Retro Revival 90s",
    description: "Bring back the best of 90s fashion with a modern twist",
    brief: "Reimagine iconic 90s fashion trends for today's generation. Combine nostalgia with contemporary style.",
    cover_image: "/api/placeholder/800/600",
    start_date: "2024-02-01T00:00:00Z",
    end_date: "2024-03-01T23:59:59Z",
    voting_end_date: "2024-03-08T23:59:59Z",
    status: "upcoming",
    contest_type: "themed",
    theme: "90s Revival",
    prizes: [
      { position: 1, title: "Retro Master", value: "$4,000", description: "Cash prize + vintage collection" },
      { position: 2, title: "90s Star", value: "$2,000", description: "Cash prize + feature article" }
    ],
    total_participants: 0,
    total_submissions: 0,
    total_votes: 0,
    entry_fee: 0,
    difficulty_level: "beginner",
    voting_type: "hybrid",
    is_featured: true,
    tags: ["retro", "90s", "vintage", "nostalgia"]
  }
];

const mockSubmissions: Submission[] = [
  {
    id: 1,
    title: "Neon Dreams",
    description: "Cyberpunk-inspired streetwear with interactive LED elements",
    design_image: "/api/placeholder/400/500",
    author: {
      username: "cyber_designer",
      avatar: "/api/placeholder/40/40",
      verified: true
    },
    votes_count: 2341,
    likes_count: 1876,
    views_count: 5432,
    rank: 1,
    submission_date: "2024-01-25T14:30:00Z",
    tags: ["cyberpunk", "led", "interactive", "neon"]
  },
  {
    id: 2,
    title: "Urban Poetry",
    description: "Typography-based design inspired by street art and poetry",
    design_image: "/api/placeholder/400/500",
    author: {
      username: "street_poet",
      avatar: "/api/placeholder/40/40",
      verified: false
    },
    votes_count: 1987,
    likes_count: 1543,
    views_count: 4321,
    rank: 2,
    submission_date: "2024-01-24T09:15:00Z",
    tags: ["typography", "poetry", "street-art", "text"]
  },
  {
    id: 3,
    title: "Geometric Fusion",
    description: "Bold geometric patterns meet organic street elements",
    design_image: "/api/placeholder/400/500",
    author: {
      username: "geo_master",
      avatar: "/api/placeholder/40/40",
      verified: true
    },
    votes_count: 1745,
    likes_count: 1287,
    views_count: 3876,
    rank: 3,
    submission_date: "2024-01-23T16:45:00Z",
    tags: ["geometric", "patterns", "bold", "fusion"]
  }
];

// Status Badge Component
const StatusBadge: React.FC<{ status: Contest['status'] }> = ({ status }) => {
  const configs = {
    upcoming: { color: 'bg-blue-100 text-blue-800', icon: Clock, text: 'Upcoming' },
    active: { color: 'bg-green-100 text-green-800', icon: Play, text: 'Active' },
    voting: { color: 'bg-purple-100 text-purple-800', icon: Trophy, text: 'Voting' },
    ended: { color: 'bg-gray-100 text-gray-800', icon: Medal, text: 'Ended' },
    cancelled: { color: 'bg-red-100 text-red-800', icon: Pause, text: 'Cancelled' }
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.text}
    </span>
  );
};

// Countdown Timer Component
const CountdownTimer: React.FC<{ endDate: string; type: string }> = ({ endDate, type }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endDate).getTime();
      const distance = end - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  return (
    <div className="flex items-center gap-2 text-sm">
      <Timer className="w-4 h-4 text-red-500" />
      <span className="font-medium">{type} ends in:</span>
      <div className="flex gap-1">
        {timeLeft.days > 0 && <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">{timeLeft.days}d</span>}
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">{timeLeft.hours}h</span>
        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">{timeLeft.minutes}m</span>
      </div>
    </div>
  );
};

// Contest Card Component
const ContestCard: React.FC<{ contest: Contest }> = ({ contest }) => {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      {/* Cover Image */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={contest.cover_image}
          alt={contest.title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        
        {/* Overlay badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <StatusBadge status={contest.status} />
          {contest.is_featured && (
            <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Star className="w-3 h-3" />
              Featured
            </span>
          )}
        </div>
        
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(contest.difficulty_level)}`}>
            {contest.difficulty_level}
          </span>
        </div>
        
        {/* Prize info */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="font-bold">{contest.prizes[0]?.value}</span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="font-bold text-xl mb-2">{contest.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{contest.description}</p>
        </div>
        
        {/* Theme */}
        {contest.theme && (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Palette className="w-4 h-4 text-purple-500" />
              <span className="font-medium">Theme:</span>
              <span className="text-purple-600">{contest.theme}</span>
            </div>
          </div>
        )}
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
          <div>
            <div className="font-bold text-lg">{contest.total_participants.toLocaleString()}</div>
            <div className="text-xs text-gray-600">Participants</div>
          </div>
          <div>
            <div className="font-bold text-lg">{contest.total_submissions.toLocaleString()}</div>
            <div className="text-xs text-gray-600">Submissions</div>
          </div>
          <div>
            <div className="font-bold text-lg">{contest.total_votes.toLocaleString()}</div>
            <div className="text-xs text-gray-600">Votes</div>
          </div>
        </div>
        
        {/* Timer */}
        {(contest.status === 'active' || contest.status === 'voting') && (
          <div className="mb-4">
            <CountdownTimer 
              endDate={contest.status === 'active' ? contest.end_date : contest.voting_end_date}
              type={contest.status === 'active' ? 'Submission' : 'Voting'}
            />
          </div>
        )}
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {contest.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
        
        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/contests/${contest.id}`}
            className="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors text-center"
          >
            View Contest
          </Link>
          {contest.status === 'active' && (
            <Link
              href={`/contests/${contest.id}/submit`}
              className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Upload className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Submission Card Component
const SubmissionCard: React.FC<{ submission: Submission }> = ({ submission }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      {/* Design Image */}
      <div className="relative aspect-[4/5] overflow-hidden group">
        <Image
          src={submission.design_image}
          alt={submission.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Rank badge */}
        {submission.rank && submission.rank <= 3 && (
          <div className="absolute top-3 left-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
              submission.rank === 1 ? 'bg-yellow-500' : 
              submission.rank === 2 ? 'bg-gray-400' : 'bg-orange-500'
            }`}>
              {submission.rank}
            </div>
          </div>
        )}
        
        {/* Quick stats overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex gap-4 text-white">
            <span className="flex items-center gap-1">
              <Heart className="w-5 h-5" />
              {submission.likes_count}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-5 h-5" />
              {submission.views_count}
            </span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Title & Description */}
        <h4 className="font-bold text-lg mb-2">{submission.title}</h4>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{submission.description}</p>
        
        {/* Author */}
        <div className="flex items-center gap-3 mb-3">
          <Image
            src={submission.author.avatar}
            alt={submission.author.username}
            width={32}
            height={32}
            className="rounded-full"
          />
          <div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-sm">@{submission.author.username}</span>
              {submission.author.verified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <Crown className="w-2 h-2 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Stats & Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              {submission.votes_count}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {submission.likes_count}
            </span>
          </div>
          
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full transition-colors ${
              isLiked ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Main Component
export default function DesignContestsPage() {
  const [activeTab, setActiveTab] = useState<'contests' | 'submissions'>('contests');
  const [statusFilter, setStatusFilter] = useState<'all' | Contest['status']>('all');
  const [contests, setContests] = useState<Contest[]>(mockContests);
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContests = contests.filter(contest => {
    const matchesStatus = statusFilter === 'all' || contest.status === statusFilter;
    const matchesSearch = contest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contest.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    all: contests.length,
    active: contests.filter(c => c.status === 'active').length,
    upcoming: contests.filter(c => c.status === 'upcoming').length,
    voting: contests.filter(c => c.status === 'voting').length,
    ended: contests.filter(c => c.status === 'ended').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold">Design Contests</h1>
              
              {/* Tabs */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('contests')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'contests'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Contests ({contests.length})
                </button>
                <button
                  onClick={() => setActiveTab('submissions')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'submissions'
                      ? 'bg-white text-black shadow-sm'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Top Submissions
                </button>
              </div>
            </div>
            
            {/* Search */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search contests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'contests' ? (
          <>
            {/* Filters */}
            <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
              <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-400" />
                <div className="flex gap-2">
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status as any)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        statusFilter === status
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredContests.map((contest) => (
                <ContestCard key={contest.id} contest={contest} />
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Top Submissions */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Top Submissions</h2>
              <p className="text-gray-600">Explore the most popular and highly-rated contest submissions</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {submissions.map((submission) => (
                <SubmissionCard key={submission.id} submission={submission} />
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {filteredContests.length === 0 && activeTab === 'contests' && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Trophy className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contests found</h3>
            <p className="text-gray-600">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
