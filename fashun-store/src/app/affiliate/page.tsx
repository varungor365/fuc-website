'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CurrencyRupeeIcon,
  UsersIcon,
  StarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  GlobeAltIcon,
  CameraIcon
} from '@heroicons/react/24/outline'

export default function AffiliateRegistration() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
      bankDetails: {
        accountNumber: '',
        ifscCode: '',
        accountHolder: ''
      }
    },
    socialMedia: {
      instagram: '',
      youtube: '',
      tiktok: '',
      twitter: '',
      followers: 0
    },
    type: 'affiliate',
    experience: '',
    motivation: '',
    audience: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev as any)[section],
        [field]: value
      }
    }))
  }

  const handleNestedInputChange = (section: string, subsection: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev as any)[section],
        [subsection]: {
          ...((prev as any)[section] as any)[subsection],
          [field]: value
        }
      }
    }))
  }

  const nextStep = () => {
    if (step < 4) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    
    try {
      const response = await fetch('/api/affiliate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          ...formData
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setSubmitted(true)
      } else {
        alert('Error submitting application. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('Error submitting application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const affiliateTypes = [
    {
      id: 'affiliate',
      title: 'Affiliate Partner',
      description: 'Individual marketers who promote our products for commissions',
      commission: '10%',
      features: ['Standard commission rate', 'Basic promotional materials', 'Monthly payouts'],
      icon: CurrencyRupeeIcon
    },
    {
      id: 'influencer',
      title: 'Influencer',
      description: 'Social media influencers with engaged audiences',
      commission: '15%',
      features: ['Higher commission rate', 'Exclusive content access', 'Priority support'],
      icon: UsersIcon,
      popular: true
    },
    {
      id: 'brand_ambassador',
      title: 'Brand Ambassador',
      description: 'Long-term partners representing our brand',
      commission: '20%',
      features: ['Highest commission rate', 'Custom promotional materials', 'Direct brand partnership'],
      icon: StarIcon
    }
  ]

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-green-500/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircleIcon className="w-12 h-12 text-green-400" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-white mb-4">Application Submitted!</h1>
          <p className="text-gray-300 text-lg mb-8">
            Thank you for your interest in becoming a FASHUN affiliate! We'll review your application and get back to you within 2-3 business days.
          </p>
          
          <div className="bg-gray-800/50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">What's Next?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-500/20 rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-purple-400 font-bold text-sm">1</span>
                </div>
                <p className="text-gray-300">We'll review your application and social media presence</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-purple-500/20 rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-purple-400 font-bold text-sm">2</span>
                </div>
                <p className="text-gray-300">You'll receive an email with our decision</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-purple-500/20 rounded-full w-8 h-8 flex items-center justify-center">
                  <span className="text-purple-400 font-bold text-sm">3</span>
                </div>
                <p className="text-gray-300">If approved, you'll get access to your affiliate dashboard</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => router.push('/')}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Join the FASHUN Affiliate Program</h1>
          <p className="text-gray-400 text-lg">Partner with us and earn commissions on every sale</p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= stepNum ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`w-20 h-1 mx-4 ${
                    step > stepNum ? 'bg-purple-600' : 'bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-400">
            <span>Choose Type</span>
            <span>Personal Info</span>
            <span>Social Media</span>
            <span>Review</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Step 1: Choose Affiliate Type */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Choose Your Partnership Type</h2>
                <p className="text-gray-400">Select the option that best describes you</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {affiliateTypes.map((type) => (
                  <motion.div
                    key={type.id}
                    whileHover={{ scale: 1.05 }}
                    className={`relative bg-gray-800/50 rounded-xl p-6 cursor-pointer border-2 transition-all ${
                      formData.type === type.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => handleInputChange('type', '', type.id)}
                  >
                    {type.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <div className="bg-purple-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <type.icon className="w-8 h-8 text-purple-400" />
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white mb-2">{type.title}</h3>
                      <p className="text-gray-400 text-sm mb-4">{type.description}</p>
                      
                      <div className="bg-green-500/20 rounded-lg p-3 mb-4">
                        <p className="text-green-400 font-bold text-xl">{type.commission}</p>
                        <p className="text-green-300 text-sm">Commission Rate</p>
                      </div>
                      
                      <ul className="space-y-2">
                        {type.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                            <CheckCircleIcon className="w-4 h-4 text-green-400" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Personal Information */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Personal Information</h2>
                <p className="text-gray-400">Tell us about yourself</p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Full Name *</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.personalInfo.name}
                        onChange={(e) => handleInputChange('personalInfo', 'name', e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Email Address *</label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.personalInfo.email}
                        onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Phone Number *</label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.personalInfo.phone}
                        onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Location *</label>
                    <div className="relative">
                      <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.personalInfo.address}
                        onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-purple-500"
                        placeholder="City, State, Country"
                      />
                    </div>
                  </div>
                </div>

                {/* Bank Details */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Payment Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Account Holder Name *</label>
                      <input
                        type="text"
                        value={formData.personalInfo.bankDetails.accountHolder}
                        onChange={(e) => handleNestedInputChange('personalInfo', 'bankDetails', 'accountHolder', e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                        placeholder="As per bank records"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">Account Number *</label>
                      <input
                        type="text"
                        value={formData.personalInfo.bankDetails.accountNumber}
                        onChange={(e) => handleNestedInputChange('personalInfo', 'bankDetails', 'accountNumber', e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                        placeholder="Enter account number"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">IFSC Code *</label>
                      <input
                        type="text"
                        value={formData.personalInfo.bankDetails.ifscCode}
                        onChange={(e) => handleNestedInputChange('personalInfo', 'bankDetails', 'ifscCode', e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                        placeholder="e.g., HDFC0001234"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Social Media */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Social Media Presence</h2>
                <p className="text-gray-400">Share your social media profiles to help us understand your audience</p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Instagram Handle</label>
                    <input
                      type="text"
                      value={formData.socialMedia.instagram}
                      onChange={(e) => handleInputChange('socialMedia', 'instagram', e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      placeholder="@yourusername"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">YouTube Channel</label>
                    <input
                      type="text"
                      value={formData.socialMedia.youtube}
                      onChange={(e) => handleInputChange('socialMedia', 'youtube', e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      placeholder="Channel name or URL"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">TikTok Handle</label>
                    <input
                      type="text"
                      value={formData.socialMedia.tiktok}
                      onChange={(e) => handleInputChange('socialMedia', 'tiktok', e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      placeholder="@yourusername"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Twitter Handle</label>
                    <input
                      type="text"
                      value={formData.socialMedia.twitter}
                      onChange={(e) => handleInputChange('socialMedia', 'twitter', e.target.value)}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      placeholder="@yourusername"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-white font-medium mb-2">Total Followers (across all platforms)</label>
                    <input
                      type="number"
                      value={formData.socialMedia.followers}
                      onChange={(e) => handleInputChange('socialMedia', 'followers', parseInt(e.target.value) || 0)}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      placeholder="e.g., 10000"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-white font-medium mb-2">Tell us about your audience</label>
                  <textarea
                    value={formData.audience}
                    onChange={(e) => handleInputChange('audience', '', e.target.value)}
                    rows={4}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    placeholder="Describe your audience demographics, interests, and engagement style..."
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Review Your Application</h2>
                <p className="text-gray-400">Please review your information before submitting</p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Partnership Type</h3>
                    <p className="text-gray-300 capitalize">{formData.type.replace('_', ' ')}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <p><span className="text-gray-400">Name:</span> {formData.personalInfo.name}</p>
                      <p><span className="text-gray-400">Email:</span> {formData.personalInfo.email}</p>
                      <p><span className="text-gray-400">Phone:</span> {formData.personalInfo.phone}</p>
                      <p><span className="text-gray-400">Location:</span> {formData.personalInfo.address}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Social Media</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {formData.socialMedia.instagram && (
                        <p><span className="text-gray-400">Instagram:</span> {formData.socialMedia.instagram}</p>
                      )}
                      {formData.socialMedia.youtube && (
                        <p><span className="text-gray-400">YouTube:</span> {formData.socialMedia.youtube}</p>
                      )}
                      {formData.socialMedia.tiktok && (
                        <p><span className="text-gray-400">TikTok:</span> {formData.socialMedia.tiktok}</p>
                      )}
                      {formData.socialMedia.twitter && (
                        <p><span className="text-gray-400">Twitter:</span> {formData.socialMedia.twitter}</p>
                      )}
                      <p><span className="text-gray-400">Total Followers:</span> {formData.socialMedia.followers.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-400 text-sm">
                    By submitting this application, you agree to our affiliate terms and conditions. 
                    We'll review your application and get back to you within 2-3 business days.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                step === 1
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              Previous
            </button>

            {step < 4 ? (
              <button
                onClick={nextStep}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}