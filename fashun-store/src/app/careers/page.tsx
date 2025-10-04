'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BriefcaseIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  UsersIcon,
  RocketLaunchIcon,
  HeartIcon,
  GlobeAltIcon,
  ChevronRightIcon,
  ArrowUpRightIcon,
  StarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

export default function CareersPage() {
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  
  const jobOpenings = [
    {
      id: 1,
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'Mumbai, India',
      type: 'Full-time',
      salary: '₹15-25 LPA',
      experience: '4-6 years',
      description: 'Lead development of our next-gen e-commerce platform using React, Node.js, and cloud technologies.',
      requirements: ['React/Next.js', 'Node.js', 'TypeScript', 'AWS/GCP', 'MongoDB'],
      posted: '2 days ago'
    },
    {
      id: 2,
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'Delhi, India',
      type: 'Full-time',
      salary: '₹8-15 LPA',
      experience: '2-4 years',
      description: 'Create stunning user experiences for our streetwear platform. Focus on mobile-first design and user research.',
      requirements: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research', 'Design Systems'],
      posted: '5 days ago'
    },
    {
      id: 3,
      title: 'Digital Marketing Manager',
      department: 'Marketing',
      location: 'Bangalore, India',
      type: 'Full-time',
      salary: '₹10-18 LPA',
      experience: '3-5 years',
      description: 'Drive growth through innovative digital marketing campaigns across social media, influencer partnerships, and paid advertising.',
      requirements: ['Google Ads', 'Facebook Ads', 'SEO/SEM', 'Analytics', 'Content Marketing'],
      posted: '1 week ago'
    },
    {
      id: 4,
      title: 'Fashion Buyer',
      department: 'Merchandising',
      location: 'Mumbai, India',
      type: 'Full-time',
      salary: '₹6-12 LPA',
      experience: '2-4 years',
      description: 'Source and curate the hottest streetwear brands and trends. Work closely with international suppliers and brands.',
      requirements: ['Fashion Industry', 'Trend Analysis', 'Negotiation', 'Vendor Management', 'Market Research'],
      posted: '3 days ago'
    },
    {
      id: 5,
      title: 'Customer Success Associate',
      department: 'Customer Service',
      location: 'Remote',
      type: 'Full-time',
      salary: '₹4-8 LPA',
      experience: '1-3 years',
      description: 'Ensure exceptional customer experience through support, onboarding, and relationship management.',
      requirements: ['Customer Service', 'Communication', 'CRM Tools', 'Problem Solving', 'Empathy'],
      posted: '4 days ago'
    },
    {
      id: 6,
      title: 'Data Analyst',
      department: 'Analytics',
      location: 'Bangalore, India',
      type: 'Full-time',
      salary: '₹7-14 LPA',
      experience: '2-4 years',
      description: 'Turn data into actionable insights to drive business decisions across marketing, operations, and product.',
      requirements: ['SQL', 'Python/R', 'Tableau/PowerBI', 'Statistics', 'Machine Learning'],
      posted: '6 days ago'
    }
  ]

  const departments = ['Engineering', 'Design', 'Marketing', 'Merchandising', 'Customer Service', 'Analytics']
  const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Remote']

  const benefits = [
    {
      icon: CurrencyRupeeIcon,
      title: 'Competitive Salary',
      description: 'Industry-leading compensation with performance bonuses and equity options'
    },
    {
      icon: HeartIcon,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance, mental health support, and wellness programs'
    },
    {
      icon: AcademicCapIcon,
      title: 'Learning & Growth',
      description: 'Professional development budget, conferences, courses, and mentorship programs'
    },
    {
      icon: ClockIcon,
      title: 'Work-Life Balance',
      description: 'Flexible working hours, remote work options, and unlimited paid time off'
    },
    {
      icon: RocketLaunchIcon,
      title: 'Startup Culture',
      description: 'Fast-paced environment with direct impact, ownership, and career advancement'
    },
    {
      icon: GlobeAltIcon,
      title: 'Global Impact',
      description: 'Work on products used by millions, collaborate with international teams'
    }
  ]

  const companyValues = [
    {
      title: 'Innovation First',
      description: 'We constantly push boundaries and embrace new technologies to create the future of fashion.',
      icon: '🚀'
    },
    {
      title: 'Customer Obsessed',
      description: 'Every decision we make starts with our customers. Their success is our success.',
      icon: '💎'
    },
    {
      title: 'Diverse & Inclusive',
      description: 'We celebrate differences and create an environment where everyone can thrive.',
      icon: '🌍'
    },
    {
      title: 'Authentic & Bold',
      description: 'We stay true to ourselves and aren\'t afraid to take calculated risks.',
      icon: '⚡'
    }
  ]

  const filteredJobs = jobOpenings.filter(job => {
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment
    const matchesLocation = selectedLocation === 'all' || job.location.includes(selectedLocation)
    return matchesDepartment && matchesLocation
  })

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-primary-900/90" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <BriefcaseIcon className="w-16 h-16 text-accent-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Join Our
              <span className="block bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
                Team
              </span>
            </h1>
            <p className="text-xl text-primary-200 max-w-3xl mx-auto leading-relaxed mb-8">
              Help us revolutionize streetwear fashion. Work with passionate people who are 
              changing how the world shops for style.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-primary-200">
              <div className="flex items-center">
                <UsersIcon className="w-5 h-5 mr-2 text-accent-400" />
                <span>50+ Team Members</span>
              </div>
              <div className="flex items-center">
                <MapPinIcon className="w-5 h-5 mr-2 text-accent-400" />
                <span>Multiple Locations</span>
              </div>
              <div className="flex items-center">
                <RocketLaunchIcon className="w-5 h-5 mr-2 text-accent-400" />
                <span>Fast Growing</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Company Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Values</h2>
            <p className="text-primary-200 max-w-2xl mx-auto">
              These principles guide everything we do and shape the culture we're building together.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-white font-semibold mb-3">{value.title}</h3>
                <p className="text-primary-300 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Why Work With Us?</h2>
            <p className="text-primary-200 max-w-2xl mx-auto">
              We believe in taking care of our team members so they can do their best work.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                >
                  <div className="bg-accent-500/20 rounded-full p-3 w-fit mb-4">
                    <IconComponent className="w-6 h-6 text-accent-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-primary-300 text-sm">{benefit.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Job Openings */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Open Positions</h2>
            <p className="text-primary-200 max-w-2xl mx-auto">
              Find your next opportunity and help us build the future of fashion.
            </p>
          </div>

          {/* Filters */}
          <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-primary-200 text-sm font-medium mb-2">Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="bg-primary-800/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent-400/50"
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-primary-200 text-sm font-medium mb-2">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-primary-800/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent-400/50"
                >
                  <option value="all">All Locations</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-6">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-accent-400/30 transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-white group-hover:text-accent-400 transition-colors">
                        {job.title}
                      </h3>
                      <span className="bg-accent-500/20 text-accent-400 px-3 py-1 rounded-full text-xs font-medium">
                        {job.department}
                      </span>
                    </div>
                    
                    <p className="text-primary-200 mb-4">{job.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-primary-300 mb-4">
                      <div className="flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {job.type}
                      </div>
                      <div className="flex items-center">
                        <CurrencyRupeeIcon className="w-4 h-4 mr-1" />
                        {job.salary}
                      </div>
                      <div className="flex items-center">
                        <BriefcaseIcon className="w-4 h-4 mr-1" />
                        {job.experience}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.requirements.slice(0, 3).map(req => (
                        <span key={req} className="bg-primary-700/30 text-primary-200 px-2 py-1 rounded text-xs">
                          {req}
                        </span>
                      ))}
                      {job.requirements.length > 3 && (
                        <span className="text-primary-400 text-xs">+{job.requirements.length - 3} more</span>
                      )}
                    </div>
                    
                    <p className="text-primary-400 text-xs">Posted {job.posted}</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="btn btn-outline flex items-center">
                      Learn More
                      <ChevronRightIcon className="w-4 h-4 ml-2" />
                    </button>
                    <button className="btn btn-glass flex items-center">
                      Apply Now
                      <ArrowUpRightIcon className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <BriefcaseIcon className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <p className="text-primary-300 text-lg">No positions match your filters.</p>
              <p className="text-primary-400 text-sm">Try adjusting your search criteria.</p>
            </div>
          )}
        </motion.div>

        {/* Application Process */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Hiring Process</h2>
            <p className="text-primary-200 max-w-2xl mx-auto">
              We've designed a transparent and efficient process to help you showcase your skills.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Apply Online', description: 'Submit your application with resume and cover letter' },
              { step: '02', title: 'Initial Review', description: 'Our team reviews your application within 48 hours' },
              { step: '03', title: 'Interview Process', description: 'Technical and cultural fit interviews with the team' },
              { step: '04', title: 'Final Decision', description: 'Reference check and offer within 1 week' }
            ].map((process, index) => (
              <motion.div
                key={process.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-accent-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 border border-accent-400/30">
                  <span className="text-accent-400 font-bold text-lg">{process.step}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{process.title}</h3>
                <p className="text-primary-300 text-sm">{process.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-accent-500/10 to-primary-700/10 backdrop-blur-sm border border-accent-400/20 rounded-3xl p-12">
            <RocketLaunchIcon className="w-16 h-16 text-accent-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Join Us?</h2>
            <p className="text-primary-200 max-w-2xl mx-auto mb-8">
              Don't see a perfect fit? We're always looking for talented people. 
              Send us your resume and let's talk about creating a role for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-glass">
                View All Positions
              </button>
              <button className="btn btn-outline">
                Send General Application
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}