"use client";
import React, { useState } from 'react';
import Link from 'next/link';

interface DNANode {
  id: string;
  title: string;
  description: string;
  x: number;
  y: number;
  color: string;
  icon: string;
  content: {
    story: string;
    values: string[];
    inspiration: string[];
    playlist?: string[];
    moodboard: string[];
  };
}

const dnaNodes: DNANode[] = [
  {
    id: 'art-culture',
    title: 'Art & Culture Fusion',
    description: 'Where creativity meets streetwear',
    x: 20,
    y: 30,
    color: 'from-purple-500 to-pink-500',
    icon: '🎨',
    content: {
      story: 'Born from the vibrant street art scenes of Mumbai and Delhi, we believe fashion is the ultimate canvas for self-expression. Every thread tells a story, every design breaks boundaries.',
      values: ['Artistic Expression', 'Cultural Diversity', 'Creative Freedom', 'Visual Storytelling'],
      inspiration: ['Mumbai Street Art', 'Bollywood Typography', 'Traditional Motifs', 'Modern Minimalism'],
      playlist: ['Divine - Jungli', 'Nucleya - Bass Rani', 'Ritviz - Udd Gaye', 'DIVINE x Naezy - Mere Gully Mein'],
      moodboard: ['/images/brand-dna/art-1.jpg', '/images/brand-dna/art-2.jpg', '/images/brand-dna/art-3.jpg']
    }
  },
  {
    id: 'counter-culture',
    title: 'Counter-Culture Spirit',
    description: 'Challenging fashion norms',
    x: 70,
    y: 20,
    color: 'from-orange-500 to-red-500',
    icon: '✊',
    content: {
      story: 'We stand against fast fashion, cookie-cutter designs, and exclusionary sizing. Our rebellion is inclusive, sustainable, and unapologetically bold.',
      values: ['Authenticity Over Trends', 'Inclusive Sizing', 'Sustainable Practices', 'Individual Expression'],
      inspiration: ['Punk Movement', 'Hip-Hop Origins', 'Skateboard Culture', 'Youth Rebellion'],
      playlist: ['Prabh Deep - Class-Sikh Maut', 'MC Stan - Khuja Mat', 'Raftaar - Swag Mera Desi'],
      moodboard: ['/images/brand-dna/rebel-1.jpg', '/images/brand-dna/rebel-2.jpg', '/images/brand-dna/rebel-3.jpg']
    }
  },
  {
    id: 'modern-india',
    title: 'Modern India',
    description: 'Contemporary Indian identity',
    x: 50,
    y: 50,
    color: 'from-green-500 to-teal-500',
    icon: '🇮🇳',
    content: {
      story: 'We represent the new India - tech-savvy, globally connected, yet deeply rooted in our culture. Our designs bridge tradition and modernity.',
      values: ['Cultural Pride', 'Global Perspective', 'Tech Innovation', 'Youth Empowerment'],
      inspiration: ['Digital India', 'Startup Culture', 'Bollywood Evolution', 'Traditional Crafts'],
      playlist: ['Seedhe Maut - Namastute', 'Krsna - Vyanjan', 'Ikka - Angaar'],
      moodboard: ['/images/brand-dna/india-1.jpg', '/images/brand-dna/india-2.jpg', '/images/brand-dna/india-3.jpg']
    }
  },
  {
    id: 'hip-hop-culture',
    title: 'Hip-Hop DNA',
    description: 'The rhythm of the streets',
    x: 30,
    y: 70,
    color: 'from-blue-500 to-purple-500',
    icon: '🎤',
    content: {
      story: 'Hip-hop gave us our voice, our style, our attitude. From Gully Boy to the underground rap scene, we embody the hustle and authenticity of Indian hip-hop.',
      values: ['Street Authenticity', 'Hustle Mentality', 'Community Support', 'Raw Expression'],
      inspiration: ['Gully Rap', 'B-Boy Culture', 'Graffiti Art', 'Cypher Sessions'],
      playlist: ['Divine - Mirchi', 'Naezy - Aafat', 'MC Altaf - Paisa', 'EPR - Bhot Hard'],
      moodboard: ['/images/brand-dna/hiphop-1.jpg', '/images/brand-dna/hiphop-2.jpg', '/images/brand-dna/hiphop-3.jpg']
    }
  },
  {
    id: 'gender-freedom',
    title: 'Gender Freedom',
    description: 'Fashion without boundaries',
    x: 80,
    y: 60,
    color: 'from-pink-500 to-purple-500',
    icon: '🌈',
    content: {
      story: 'We believe fashion should celebrate identity, not constrain it. Our gender-neutral designs embrace fluidity and self-expression for everyone.',
      values: ['Inclusive Design', 'Gender Neutrality', 'Body Positivity', 'Self-Expression'],
      inspiration: ['Fluid Fashion', 'Unisex Movement', 'LGBTQ+ Culture', 'Body Acceptance'],
      playlist: ['Prateek Kuhad - Cold/Mess', 'Lifafa - Jaago', 'Peter Cat Recording Co. - Floated By'],
      moodboard: ['/images/brand-dna/gender-1.jpg', '/images/brand-dna/gender-2.jpg', '/images/brand-dna/gender-3.jpg']
    }
  }
];

export default function BrandDNA() {
  const [selectedNode, setSelectedNode] = useState<string | null>('art-culture');
  const [viewMode, setViewMode] = useState<'map' | 'timeline'>('map');

  const currentNode = dnaNodes.find(node => node.id === selectedNode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Header */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center bg-white/20 text-white px-6 py-2 rounded-full text-sm font-bold mb-6">
            🧬 BRAND DNA
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            OUR
            <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              GENETIC CODE
            </span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Explore the core elements that make FASHUN.CO unique. Click on each DNA strand to discover our story.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        {/* View Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/10 rounded-full p-1 backdrop-blur-sm">
            <button
              onClick={() => setViewMode('map')}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-purple-600 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              DNA Map
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                viewMode === 'timeline'
                  ? 'bg-purple-600 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Evolution Timeline
            </button>
          </div>
        </div>

        {viewMode === 'map' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Interactive DNA Map */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* Connection Lines */}
                  <defs>
                    <linearGradient id="connection" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#EC4899" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  
                  {/* Draw connections between nodes */}
                  {dnaNodes.map((node, index) => 
                    dnaNodes.slice(index + 1).map((otherNode) => (
                      <line
                        key={`${node.id}-${otherNode.id}`}
                        x1={node.x}
                        y1={node.y}
                        x2={otherNode.x}
                        y2={otherNode.y}
                        stroke="url(#connection)"
                        strokeWidth="0.5"
                        className="animate-pulse"
                      />
                    ))
                  )}

                  {/* DNA Nodes */}
                  {dnaNodes.map((node) => (
                    <g key={node.id}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={selectedNode === node.id ? "6" : "4"}
                        className={`cursor-pointer transition-all duration-300 ${
                          selectedNode === node.id 
                            ? 'fill-white' 
                            : 'fill-white/50 hover:fill-white/80'
                        }`}
                        onClick={() => setSelectedNode(node.id)}
                      />
                      
                      {/* Pulsing ring for selected node */}
                      {selectedNode === node.id && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="8"
                          fill="none"
                          stroke="white"
                          strokeWidth="0.5"
                          opacity="0.6"
                          className="animate-ping"
                        />
                      )}
                      
                      {/* Node Label */}
                      <text
                        x={node.x}
                        y={node.y - 8}
                        textAnchor="middle"
                        className="fill-white text-xs font-bold cursor-pointer"
                        onClick={() => setSelectedNode(node.id)}
                      >
                        {node.icon}
                      </text>
                    </g>
                  ))}
                </svg>

                {/* Node Labels */}
                <div className="absolute inset-0 p-8">
                  {dnaNodes.map((node) => (
                    <button
                      key={node.id}
                      onClick={() => setSelectedNode(node.id)}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold transition-all ${
                        selectedNode === node.id 
                          ? 'text-yellow-300 scale-110' 
                          : 'text-white/70 hover:text-white hover:scale-105'
                      }`}
                      style={{ 
                        left: `${node.x}%`, 
                        top: `${node.y + 8}%`
                      }}
                    >
                      {node.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Panel */}
            <div className="space-y-8">
              {currentNode && (
                <>
                  <div>
                    <div className={`inline-flex items-center bg-gradient-to-r ${currentNode.color} px-4 py-2 rounded-full text-sm font-bold mb-4`}>
                      <span className="mr-2">{currentNode.icon}</span>
                      {currentNode.title}
                    </div>
                    <h2 className="text-3xl font-black mb-4">{currentNode.description}</h2>
                    <p className="text-lg text-white/90 leading-relaxed">{currentNode.content.story}</p>
                  </div>

                  {/* Values */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">Core Values</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {currentNode.content.values.map((value) => (
                        <div key={value} className="bg-white/10 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                          {value}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Inspiration */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">Inspiration Sources</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentNode.content.inspiration.map((source) => (
                        <span key={source} className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 px-3 py-1 rounded-full text-sm backdrop-blur-sm border border-white/20">
                          {source}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Playlist */}
                  {currentNode.content.playlist && (
                    <div>
                      <h3 className="text-xl font-bold mb-4 flex items-center">
                        <span className="mr-2">🎵</span>
                        Soundtrack
                      </h3>
                      <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm">
                        {currentNode.content.playlist.map((track, index) => (
                          <div key={track} className="flex items-center py-2 border-b border-white/10 last:border-0">
                            <span className="text-purple-300 font-bold mr-3">{String(index + 1).padStart(2, '0')}</span>
                            <span className="text-white/90">{track}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mood Board */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">Visual Mood</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {currentNode.content.moodboard.map((image, index) => (
                        <div key={index} className="aspect-square rounded-xl overflow-hidden">
                          <img 
                            src={image}
                            alt={`${currentNode.title} mood ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          /* Timeline View */
          <div className="space-y-16">
            {dnaNodes.map((node, index) => (
              <div key={node.id} className={`flex items-center ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12' : 'pl-12'}`}>
                  <div className={`bg-gradient-to-br ${node.color} rounded-3xl p-8`}>
                    <div className="flex items-center mb-4">
                      <span className="text-3xl mr-4">{node.icon}</span>
                      <h3 className="text-2xl font-black">{node.title}</h3>
                    </div>
                    <p className="text-lg mb-6">{node.content.story}</p>
                    <div className="flex flex-wrap gap-2">
                      {node.content.values.slice(0, 3).map((value) => (
                        <span key={value} className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex-shrink-0 w-8 h-8 bg-white rounded-full border-4 border-purple-600 z-10"></div>
                
                <div className={`w-1/2 ${index % 2 === 0 ? 'pl-12' : 'pr-12'}`}>
                  <div className="grid grid-cols-2 gap-3">
                    {node.content.moodboard.slice(0, 4).map((image, imgIndex) => (
                      <div key={imgIndex} className="aspect-square rounded-xl overflow-hidden">
                        <img 
                          src={image}
                          alt={`${node.title} visual ${imgIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl p-12 backdrop-blur-sm border border-white/10">
            <h2 className="text-3xl font-black mb-4">Ready to Wear Your DNA?</h2>
            <p className="text-xl mb-8 text-white/90">
              Discover pieces that embody our core values and express your authentic self
            </p>
            <Link href="/collections">
              <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-full font-black text-lg hover:shadow-xl transition-all">
                SHOP BY VALUES 🧬
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}