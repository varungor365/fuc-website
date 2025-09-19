import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { SparklesIcon, HeartIcon, LightBulbIcon, UsersIcon } from '@heroicons/react/24/outline'

export const metadata: Metadata = {
  title: 'About FASHUN.CO - Premium Streetwear Fashion Brand India',
  description: 'Learn about FASHUN.CO - India\'s leading premium streetwear fashion brand. Our mission, values, and commitment to creating unique custom apparel and streetwear that stands out.',
}

const values = [
  {
    icon: SparklesIcon,
    title: 'Innovation',
    description: 'We push boundaries with cutting-edge designs and AI-powered customization tools.'
  },
  {
    icon: HeartIcon,
    title: 'Passion',
    description: 'Every piece is crafted with love and attention to detail, reflecting our passion for fashion.'
  },
  {
    icon: LightBulbIcon,
    title: 'Creativity',
    description: 'We encourage self-expression through unique designs that tell your story.'
  },
  {
    icon: UsersIcon,
    title: 'Community',
    description: 'Building a community of fashion enthusiasts who dare to be different.'
  }
]

const team = [
  {
    name: 'Varun Gor',
    role: 'Founder & Creative Director',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    bio: 'Visionary behind FUC! with 10+ years in fashion industry.'
  },
  {
    name: 'Design Team',
    role: 'Creative Designers',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=face',
    bio: 'Talented designers bringing innovation to streetwear.'
  },
  {
    name: 'Tech Team',
    role: 'AI & Development',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face',
    bio: 'Building the future of fashion with AI technology.'
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-primary-950 text-white pt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About <span className="text-accent-400">FASHUN.CO</span>
          </h1>
          <p className="text-xl text-primary-300 max-w-3xl mx-auto leading-relaxed">
            India's premier streetwear fashion brand revolutionizing urban style. FASHUN.CO represents the fearless, 
            the unapologetic, and the uniquely creative. We believe premium streetwear should be personal, 
            bold, and authentically you - designed for the modern Indian fashion enthusiast.
          </p>
        </div>

        {/* Story Section */}
        <div className="py-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Our Streetwear Story</h2>
            <div className="space-y-4 text-primary-300 leading-relaxed">
              <p>
                Founded in 2024, FASHUN.CO emerged from a simple idea: premium streetwear fashion should be fearless and accessible to every Indian fashion enthusiast. 
                In a world of conformity, we saw an opportunity to create something different - 
                custom apparel and streetwear that doesn&apos;t just cover your body, but expresses your soul.
              </p>
              <p>
                Our brand philosophy challenges conventions in the Indian fashion market, sparks conversations, and empowers individuals to embrace 
                their authentic selves through bold, unapologetic streetwear choices. We specialize in premium hoodies, graphic t-shirts, 
                and custom apparel designed specifically for the modern Indian urban lifestyle.
              </p>
              <p>
                What started as a small streetwear brand has evolved into India's leading community of 
                fashion creators, dreamers, and style rebels who believe that streetwear is art, and everyone 
                deserves to be the artist of their own unique fashion statement. Our intelligent design platform and custom apparel services 
                make personalized fashion accessible to everyone.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=600&fit=crop&crop=center"
                alt="FUC! Fashion Studio"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-16 bg-primary-900 rounded-2xl px-8 md:px-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-xl text-primary-300 max-w-3xl mx-auto">
              To democratize fashion by providing tools, designs, and inspiration that 
              empower everyone to create and wear clothes that truly represent who they are.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-primary-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Innovation Section */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Innovation at Heart</h2>
            <p className="text-xl text-primary-300 max-w-3xl mx-auto">
              We&apos;re pioneering the future of fashion with AI-powered design tools, 
              sustainable practices, and a customer-first approach.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-primary-900 rounded-xl p-8 text-center">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold text-white mb-4">AI Design Tool</h3>
              <p className="text-primary-300">
                Our revolutionary AI designer lets you create unique patterns and 
                designs with just a description.
              </p>
            </div>
            
            <div className="bg-primary-900 rounded-xl p-8 text-center">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold text-white mb-4">Sustainable Fashion</h3>
              <p className="text-primary-300">
                Committed to eco-friendly materials and ethical production 
                processes for a better planet.
              </p>
            </div>
            
            <div className="bg-primary-900 rounded-xl p-8 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-4">Lightning Fast</h3>
              <p className="text-primary-300">
                From design to delivery, we&apos;ve optimized every step to get 
                your custom fashion to you quickly.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Meet the Team</h2>
            <p className="text-xl text-primary-300">
              The creative minds behind FUC! fashion revolution
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative w-48 h-48 rounded-full overflow-hidden mx-auto mb-6">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                <p className="text-accent-400 font-medium mb-3">{member.role}</p>
                <p className="text-primary-300">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 text-center">
          <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-black mb-6">
              Ready to Join the Revolution?
            </h2>
            <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto">
              Don&apos;t just wear fashion - create it. Start designing your unique style today 
              with our AI-powered tools and premium quality apparel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/designer"
                className="bg-black text-accent-400 px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors"
              >
                Start Designing
              </Link>
              <Link
                href="/collections/all"
                className="bg-transparent border-2 border-black text-black px-8 py-3 rounded-lg font-semibold hover:bg-black hover:text-accent-400 transition-colors"
              >
                Shop Collection
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
