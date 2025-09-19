'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import VirtualStyleAssistant from './VirtualStyleAssistant'

const StyleAssistantButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: "spring", duration: 0.6 }}
      >
        <AnimatePresence>
          {isHovered && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 whitespace-nowrap border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-2">
                <SparklesIcon className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Chat with Luna, your AI stylist!
                </span>
              </div>
              <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2">
                <div className="w-2 h-2 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700 rotate-45"></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center group overflow-hidden"
        >
          {/* Background Animation */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Pulse Animation */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ opacity: 0.3 }}
          />

          {/* Icon */}
          <motion.div
            className="relative z-10"
            animate={{ rotate: isHovered ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChatBubbleLeftRightIcon className="w-7 h-7" />
          </motion.div>

          {/* Sparkle Effects */}
          <motion.div
            className="absolute top-2 right-2"
            animate={{ 
              scale: [0, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              repeatType: "loop",
              ease: "easeInOut"
            }}
          >
            <SparklesIcon className="w-3 h-3 text-white/80" />
          </motion.div>

          <motion.div
            className="absolute bottom-2 left-2"
            animate={{ 
              scale: [0, 1, 0],
              rotate: [360, 180, 0]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              repeatType: "loop",
              ease: "easeInOut",
              delay: 0.75
            }}
          >
            <SparklesIcon className="w-2 h-2 text-white/60" />
          </motion.div>

          {/* Notification Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 3 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
          >
            !
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Virtual Style Assistant Modal */}
      <VirtualStyleAssistant
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}

export default StyleAssistantButton