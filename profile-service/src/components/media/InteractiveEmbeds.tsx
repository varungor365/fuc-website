'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InteractiveEmbed {
  id: string;
  title: string;
  embed_type: 'calendar' | 'form' | 'poll' | 'widget' | 'iframe';
  embed_code: string;
  configuration: Record<string, any>;
  display_order: number;
  is_active: boolean;
}

interface InteractiveEmbedsProps {
  userId: string;
  isEditable?: boolean;
}

export default function InteractiveEmbeds({ userId, isEditable = false }: InteractiveEmbedsProps) {
  const [embeds, setEmbeds] = useState<InteractiveEmbed[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmbed, setNewEmbed] = useState({
    title: '',
    embed_type: 'iframe' as InteractiveEmbed['embed_type'],
    embed_code: '',
    configuration: {}
  });

  // Sample embed templates
  const embedTemplates = {
    calendar: {
      title: 'Booking Calendar',
      description: 'Allow visitors to book appointments',
      icon: '📅',
      placeholder: '<iframe src="https://calendly.com/your-link" width="100%" height="600"></iframe>'
    },
    form: {
      title: 'Contact Form',
      description: 'Collect leads and inquiries',
      icon: '📝',
      placeholder: '<iframe src="https://forms.gle/your-form-id" width="100%" height="500"></iframe>'
    },
    poll: {
      title: 'Interactive Poll',
      description: 'Engage visitors with polls',
      icon: '📊',
      placeholder: '<iframe src="https://poll-service.com/your-poll" width="100%" height="400"></iframe>'
    },
    widget: {
      title: 'Custom Widget',
      description: 'Add interactive elements',
      icon: '⚙️',
      placeholder: '<div>Your custom widget code here</div>'
    },
    iframe: {
      title: 'Custom Embed',
      description: 'Embed any external content',
      icon: '🔗',
      placeholder: '<iframe src="https://example.com" width="100%" height="400"></iframe>'
    }
  };

  // Handle adding new embed
  const handleAddEmbed = async () => {
    try {
      const response = await fetch('/api/media/interactive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...newEmbed
        })
      });

      if (response.ok) {
        const embed = await response.json();
        setEmbeds(prev => [...prev, embed]);
        setShowAddForm(false);
        setNewEmbed({
          title: '',
          embed_type: 'iframe',
          embed_code: '',
          configuration: {}
        });
      }
    } catch (error) {
      console.error('Error adding embed:', error);
    }
  };

  // Render embed content safely
  const renderEmbedContent = (embed: InteractiveEmbed) => {
    // In production, sanitize and validate embed code
    return (
      <div 
        className="w-full"
        dangerouslySetInnerHTML={{ __html: embed.embed_code }}
      />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Interactive Elements</h2>
          <p className="text-gray-600">Add interactive content to engage your visitors</p>
        </div>

        {isEditable && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            ➕ Add Element
          </button>
        )}
      </div>

      {/* Add Embed Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white border border-gray-200 rounded-xl p-6 space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Add Interactive Element</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Embed Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose Element Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(embedTemplates).map(([type, template]) => (
                  <button
                    key={type}
                    onClick={() => setNewEmbed(prev => ({ 
                      ...prev, 
                      embed_type: type as InteractiveEmbed['embed_type'],
                      embed_code: template.placeholder
                    }))}
                    className={`p-4 border rounded-lg text-left transition-all ${
                      newEmbed.embed_type === type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{template.icon}</div>
                    <div className="font-semibold text-gray-900 mb-1">{template.title}</div>
                    <div className="text-sm text-gray-600">{template.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Element Title
              </label>
              <input
                type="text"
                value={newEmbed.title}
                onChange={(e) => setNewEmbed(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter a title for this element"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Embed Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Embed Code
              </label>
              <textarea
                value={newEmbed.embed_code}
                onChange={(e) => setNewEmbed(prev => ({ ...prev, embed_code: e.target.value }))}
                placeholder={embedTemplates[newEmbed.embed_type].placeholder}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Paste your embed code or iframe here. Make sure it's from a trusted source.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEmbed}
                disabled={!newEmbed.title || !newEmbed.embed_code}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Add Element
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Embeds List */}
      <div className="space-y-6">
        {embeds.map((embed, index) => (
          <motion.div
            key={embed.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden"
          >
            {/* Embed Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{embedTemplates[embed.embed_type].icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{embed.title}</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {embed.embed_type.replace('_', ' ')} • {embed.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>

              {isEditable && (
                <div className="flex items-center gap-2">
                  <button className="text-gray-400 hover:text-gray-600 p-2">
                    ✏️
                  </button>
                  <button className="text-gray-400 hover:text-red-600 p-2">
                    🗑️
                  </button>
                </div>
              )}
            </div>

            {/* Embed Content */}
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                {renderEmbedContent(embed)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {embeds.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Interactive Elements</h3>
          <p className="text-gray-600 mb-4">
            Add calendars, forms, polls, and other interactive content to engage your visitors
          </p>
          {isEditable && (
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Your First Element
            </button>
          )}
        </div>
      )}

      {/* Preview Mode Notice */}
      {!isEditable && embeds.length > 0 && (
        <div className="text-center text-sm text-gray-500 bg-gray-50 py-4 rounded-lg">
          💡 Interactive elements are fully functional for visitors
        </div>
      )}
    </div>
  );
}