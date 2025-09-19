'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UserIcon,
  ScaleIcon,
  BookmarkIcon,
  XMarkIcon,
  CheckIcon,
  SparklesIcon,
  InformationCircleIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'

interface MeasurementGuideProps {
  isOpen: boolean
  onClose: () => void
  onSave: (measurements: UserMeasurements) => void
}

interface UserMeasurements {
  height: number
  weight: number
  chest: number
  waist: number
  hips: number
  shoulderWidth: number
  armLength: number
  preferredFit: 'tight' | 'regular' | 'loose' | 'oversized'
  units: 'metric' | 'imperial'
}

const MeasurementGuide: React.FC<MeasurementGuideProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [measurements, setMeasurements] = useState<UserMeasurements>({
    height: 175,
    weight: 70,
    chest: 95,
    waist: 80,
    hips: 90,
    shoulderWidth: 45,
    armLength: 60,
    preferredFit: 'regular',
    units: 'metric'
  })

  const steps = [
    {
      title: 'Basic Info',
      icon: UserIcon,
      description: 'Your height and weight help us understand your overall body type'
    },
    {
      title: 'Chest & Waist',
      icon: AcademicCapIcon,
      description: 'These are the most important measurements for fit'
    },
    {
      title: 'Additional Measurements',
      icon: ScaleIcon,
      description: 'For even more precise recommendations'
    },
    {
      title: 'Fit Preference',
      icon: BookmarkIcon,
      description: 'How do you prefer your clothes to fit?'
    }
  ]

  const handleInputChange = (field: keyof UserMeasurements, value: any) => {
    setMeasurements(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = () => {
    onSave(measurements)
    onClose()
  }

  const convertHeight = (value: number, toImperial: boolean) => {
    if (toImperial) {
      const totalInches = value / 2.54
      const feet = Math.floor(totalInches / 12)
      const inches = Math.round(totalInches % 12)
      return `${feet}'${inches}"`
    }
    return `${value}cm`
  }

  const convertWeight = (value: number, toImperial: boolean) => {
    if (toImperial) {
      return `${Math.round(value * 2.205)}lbs`
    }
    return `${value}kg`
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Measurement Guide</h3>
                <p className="text-white/80 text-sm">Get perfect size recommendations</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 bg-gray-800/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Step {currentStep + 1} of {steps.length}</span>
              <span className="text-sm text-gray-400">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full h-2"
                initial={{ width: "0%" }}
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: '50vh' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Step Header */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    {currentStep === 0 && <UserIcon className="w-6 h-6 text-white" />}
                    {currentStep === 1 && <AcademicCapIcon className="w-6 h-6 text-white" />}
                    {currentStep === 2 && <ScaleIcon className="w-6 h-6 text-white" />}
                    {currentStep === 3 && <BookmarkIcon className="w-6 h-6 text-white" />}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg">{steps[currentStep].title}</h4>
                    <p className="text-gray-400 text-sm">{steps[currentStep].description}</p>
                  </div>
                </div>

                {/* Step Content */}
                {currentStep === 0 && (
                  <div className="space-y-6">
                    {/* Units Toggle */}
                    <div>
                      <label className="block text-white font-medium mb-2">Units</label>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleInputChange('units', 'metric')}
                          className={`px-4 py-2 rounded-lg transition-all ${
                            measurements.units === 'metric'
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          Metric (cm/kg)
                        </button>
                        <button
                          onClick={() => handleInputChange('units', 'imperial')}
                          className={`px-4 py-2 rounded-lg transition-all ${
                            measurements.units === 'imperial'
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          Imperial (ft/lbs)
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white font-medium mb-2">
                          Height {measurements.units === 'metric' ? '(cm)' : '(ft/in)'}
                        </label>
                        <input
                          type="number"
                          value={measurements.height}
                          onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="175"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          {measurements.units === 'metric' 
                            ? convertHeight(measurements.height, true)
                            : convertHeight(measurements.height, false)
                          }
                        </p>
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">
                          Weight {measurements.units === 'metric' ? '(kg)' : '(lbs)'}
                        </label>
                        <input
                          type="number"
                          value={measurements.weight}
                          onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="70"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          {measurements.units === 'metric' 
                            ? convertWeight(measurements.weight, true)
                            : convertWeight(measurements.weight, false)
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <InformationCircleIcon className="w-5 h-5 text-blue-400" />
                        <span className="text-blue-300 font-medium">Measurement Tips</span>
                      </div>
                      <ul className="text-blue-200 text-sm space-y-1">
                        <li>• Measure around the fullest part of your chest</li>
                        <li>• For waist, measure around your natural waistline</li>
                        <li>• Keep the tape measure snug but not tight</li>
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white font-medium mb-2">Chest (cm)</label>
                        <input
                          type="number"
                          value={measurements.chest}
                          onChange={(e) => handleInputChange('chest', parseInt(e.target.value))}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="95"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Waist (cm)</label>
                        <input
                          type="number"
                          value={measurements.waist}
                          onChange={(e) => handleInputChange('waist', parseInt(e.target.value))}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="80"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white font-medium mb-2">Hips (cm)</label>
                        <input
                          type="number"
                          value={measurements.hips}
                          onChange={(e) => handleInputChange('hips', parseInt(e.target.value))}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="90"
                        />
                      </div>
                      <div>
                        <label className="block text-white font-medium mb-2">Shoulder Width (cm)</label>
                        <input
                          type="number"
                          value={measurements.shoulderWidth}
                          onChange={(e) => handleInputChange('shoulderWidth', parseInt(e.target.value))}
                          className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="45"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Arm Length (cm)</label>
                      <input
                        type="number"
                        value={measurements.armLength}
                        onChange={(e) => handleInputChange('armLength', parseInt(e.target.value))}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="60"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white font-medium mb-4">How do you prefer your clothes to fit?</label>
                      <div className="grid grid-cols-2 gap-3">
                        {(['tight', 'regular', 'loose', 'oversized'] as const).map((fit) => (
                          <button
                            key={fit}
                            onClick={() => handleInputChange('preferredFit', fit)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              measurements.preferredFit === fit
                                ? 'border-purple-500 bg-purple-600/20'
                                : 'border-gray-600 hover:border-gray-500'
                            }`}
                          >
                            <div className="text-white font-medium capitalize">{fit}</div>
                            <div className="text-gray-400 text-sm mt-1">
                              {fit === 'tight' && 'Form-fitting, shows body shape'}
                              {fit === 'regular' && 'Classic fit, not too tight or loose'}
                              {fit === 'loose' && 'Relaxed fit with more room'}
                              {fit === 'oversized' && 'Very loose, streetwear style'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-800/50 flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index <= currentStep ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <CheckIcon className="w-4 h-4" />
                <span>Save Measurements</span>
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default MeasurementGuide