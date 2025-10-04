'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  SparklesIcon,
  UserGroupIcon,
  GlobeAltIcon,
  HeartIcon,
  ArrowRightIcon,
  PlayIcon
} from '@heroicons/react/24/outline'

export default function AboutPage() {
  const stats = [
    { label: 'Happy Customers', value: '50K+', icon: UserGroupIcon },
    { label: 'Products Designed', value: '1000+', icon: SparklesIcon },
    { label: 'Countries Shipped', value: '25+', icon: GlobeAltIcon },
    { label: 'Years of Experience', value: '5+', icon: HeartIcon },
  ]

  const timeline = [
    {
      year: '2019',
      title: 'The Beginning',
      description: 'Started as a small streetwear brand with a vision to democratize fashion.',
      image: '/images/products/hoodies/hoodie-1-main.jpg'
    },
    {
      year: '2021',
      title: 'AI Innovation',
      description: 'Introduced AI-powered design tools and personalization features.',
      image: '/images/products/t-shirts/tshirt-1-main.jpg'
    },
    {
      year: '2023',
      title: 'Global Expansion',
      description: 'Expanded to international markets and launched sustainable collections.',
      image: '/images/products/hoodies/hoodie-2-main.jpg'
    },
    {
      year: '2025',
      title: 'Future Ready',
      description: 'Leading the streetwear revolution with cutting-edge technology.',
      image: '/images/products/t-shirts/tshirt-2-main.jpg'
    },
  ]

  const team = [
    {
      name: 'Arjun Sharma',
      role: 'Founder & Creative Director',
      image: '/images/products/hoodies/hoodie-1-main.jpg',
      bio: 'Passionate about streetwear culture and technology innovation.'
    },
    {
      name: 'Priya Patel',
      role: 'Head of Design',
      image: '/images/products/t-shirts/tshirt-1-main.jpg',
      bio: 'Leading our design team with 8+ years in fashion industry.'
    },
    {
      name: 'Rahul Gupta',
      role: 'Tech Lead',
      image: '/images/products/hoodies/hoodie-2-main.jpg',
      bio: 'Building the future of fashion with AI and machine learning.'
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-primary-800/80 to-primary-900/90" />
        <div className="absolute inset-0 bg-[url('/images/products/hoodies/hoodie-1-main.jpg')] bg-cover bg-center opacity-20" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6"
          >
            REDEFINING
            <span className="block bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
              STREETWEAR
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-primary-200 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            We're not just another fashion brand. We're revolutionizing how you discover, 
            create, and experience streetwear through cutting-edge AI technology and 
            sustainable practices.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link href="/collections/all" className="btn btn-glass btn-lg group">
              Our Story <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="btn btn-ghost btn-lg text-white border-white/30 hover:bg-white/10 group">
              <PlayIcon className="w-5 h-5 mr-2" />
              Watch Our Journey
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-primary-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-4 mx-auto w-20 h-20 flex items-center justify-center">
                  <stat.icon className="w-10 h-10 text-accent-400" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-primary-300 text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-primary-200 mb-6 leading-relaxed">
                At FASHUN.CO, we believe fashion should be personal, sustainable, and accessible. 
                We're combining artificial intelligence with human creativity to democratize 
                fashion design and help everyone express their unique style.
              </p>
              <p className="text-lg text-primary-200 mb-8 leading-relaxed">
                Our AI-powered platform doesn't just sell clothes – it creates experiences. 
                From personalized recommendations to custom design tools, we're building 
                the future of fashion retail.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-primary-900/50 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2">
                  <span className="text-accent-400 font-semibold">Sustainable</span>
                </div>
                <div className="bg-primary-900/50 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2">
                  <span className="text-accent-400 font-semibold">AI-Powered</span>
                </div>
                <div className="bg-primary-900/50 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2">
                  <span className="text-accent-400 font-semibold">Community-First</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
                <Image
                  src="/images/products/hoodies/hoodie-1-main.jpg"
                  alt="FASHUN Mission"
                  width={600}
                  height={600}
                  className="rounded-2xl object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-primary-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Our Journey
            </h2>
            <p className="text-lg text-primary-200 max-w-3xl mx-auto">
              From a small startup to a global streetwear revolution
            </p>
          </motion.div>

          <div className="space-y-16">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="bg-accent-500 text-primary-900 font-bold text-sm px-3 py-1 rounded-full inline-block mb-4">
                    {item.year}
                  </div>
                  <h3 className="text-3xl font-display font-bold text-white mb-4">
                    {item.title}
                  </h3>
                  <p className="text-lg text-primary-200 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={500}
                      height={400}
                      className="rounded-2xl object-cover w-full"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Meet Our Team
            </h2>
            <p className="text-lg text-primary-200 max-w-3xl mx-auto">
              The passionate individuals behind FASHUN.CO's innovation
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-6 text-center hover:bg-primary-900/50 transition-all duration-300"
              >
                <div className="mb-6">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={120}
                    height={120}
                    className="rounded-full mx-auto object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-accent-400 font-semibold mb-4">{member.role}</p>
                <p className="text-primary-200 text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-accent-600 via-accent-500 to-accent-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-900 mb-6">
              Ready to Join the Revolution?
            </h2>
            <p className="text-lg text-primary-800 mb-8 max-w-2xl mx-auto">
              Discover the future of streetwear fashion with AI-powered personalization
            </p>
            <Link href="/collections/all" className="btn bg-primary-900 text-white hover:bg-primary-800 btn-lg">
              Shop Collection
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
