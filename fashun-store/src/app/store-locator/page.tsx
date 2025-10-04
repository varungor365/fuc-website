'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  MapIcon,
  BuildingStorefrontIcon,
  ArrowTopRightOnSquareIcon,
  StarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

export default function StoreLocatorPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('all')
  const [selectedStore, setSelectedStore] = useState<number | null>(null)

  const stores = [
    {
      id: 1,
      name: 'FASHUN Flagship - Bandra',
      type: 'Flagship Store',
      address: 'Shop 15, Linking Road, Bandra West, Mumbai, Maharashtra 400050',
      city: 'Mumbai',
      state: 'Maharashtra',
      phone: '+91 98765 43210',
      email: 'bandra@fashun.co.in',
      hours: {
        weekdays: '11:00 AM - 10:00 PM',
        weekend: '10:00 AM - 11:00 PM'
      },
      services: ['Personal Styling', 'Exclusive Drops', 'Custom Fittings', 'Click & Collect'],
      rating: 4.8,
      reviews: 324,
      image: '/api/placeholder/400/300',
      coordinates: { lat: 19.0544, lng: 72.8267 },
      status: 'Open',
      openUntil: '10:00 PM'
    },
    {
      id: 2,
      name: 'FASHUN Select - Connaught Place',
      type: 'Select Store',
      address: 'F-10, Inner Circle, Connaught Place, New Delhi, Delhi 110001',
      city: 'Delhi',
      state: 'Delhi',
      phone: '+91 98765 43211',
      email: 'cp@fashun.co.in',
      hours: {
        weekdays: '11:00 AM - 9:00 PM',
        weekend: '10:00 AM - 10:00 PM'
      },
      services: ['Personal Styling', 'Click & Collect', 'Returns & Exchange'],
      rating: 4.6,
      reviews: 189,
      image: '/api/placeholder/400/300',
      coordinates: { lat: 28.6315, lng: 77.2167 },
      status: 'Open',
      openUntil: '9:00 PM'
    },
    {
      id: 3,
      name: 'FASHUN Store - Koramangala',
      type: 'Regular Store',
      address: '80 Feet Road, 4th Block, Koramangala, Bangalore, Karnataka 560034',
      city: 'Bangalore',
      state: 'Karnataka',
      phone: '+91 98765 43212',
      email: 'koramangala@fashun.co.in',
      hours: {
        weekdays: '11:00 AM - 9:30 PM',
        weekend: '10:30 AM - 10:00 PM'
      },
      services: ['Click & Collect', 'Returns & Exchange'],
      rating: 4.5,
      reviews: 156,
      image: '/api/placeholder/400/300',
      coordinates: { lat: 12.9352, lng: 77.6245 },
      status: 'Open',
      openUntil: '9:30 PM'
    },
    {
      id: 4,
      name: 'FASHUN Outlet - Sector 18',
      type: 'Outlet Store',
      address: 'DLF Mall of India, Sector 18, Noida, Uttar Pradesh 201301',
      city: 'Noida',
      state: 'Uttar Pradesh',
      phone: '+91 98765 43213',
      email: 'noida@fashun.co.in',
      hours: {
        weekdays: '10:00 AM - 10:00 PM',
        weekend: '10:00 AM - 11:00 PM'
      },
      services: ['Outlet Prices', 'Click & Collect', 'Returns & Exchange'],
      rating: 4.4,
      reviews: 203,
      image: '/api/placeholder/400/300',
      coordinates: { lat: 28.5682, lng: 77.3248 },
      status: 'Open',
      openUntil: '10:00 PM'
    },
    {
      id: 5,
      name: 'FASHUN Express - Phoenix Mills',
      type: 'Express Store',
      address: 'Phoenix Mills, Lower Parel, Mumbai, Maharashtra 400013',
      city: 'Mumbai',
      state: 'Maharashtra',
      phone: '+91 98765 43214',
      email: 'phoenix@fashun.co.in',
      hours: {
        weekdays: '11:00 AM - 10:00 PM',
        weekend: '10:00 AM - 11:00 PM'
      },
      services: ['Quick Shop', 'Click & Collect'],
      rating: 4.3,
      reviews: 98,
      image: '/api/placeholder/400/300',
      coordinates: { lat: 19.0130, lng: 72.8302 },
      status: 'Closed',
      openUntil: 'Opens 11:00 AM'
    },
    {
      id: 6,
      name: 'FASHUN Store - Park Street',
      type: 'Regular Store',
      address: '22A, Park Street, Kolkata, West Bengal 700016',
      city: 'Kolkata',
      state: 'West Bengal',
      phone: '+91 98765 43215',
      email: 'parkstreet@fashun.co.in',
      hours: {
        weekdays: '11:30 AM - 9:00 PM',
        weekend: '11:00 AM - 10:00 PM'
      },
      services: ['Personal Styling', 'Click & Collect', 'Returns & Exchange'],
      rating: 4.7,
      reviews: 167,
      image: '/api/placeholder/400/300',
      coordinates: { lat: 22.5548, lng: 88.3514 },
      status: 'Open',
      openUntil: '9:00 PM'
    }
  ]

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Noida', 'Kolkata']
  const storeTypes = ['Flagship Store', 'Select Store', 'Regular Store', 'Outlet Store', 'Express Store']

  const filteredStores = stores.filter(store => {
    const matchesSearch = searchQuery === '' || 
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.city.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCity = selectedCity === 'all' || store.city === selectedCity
    
    return matchesSearch && matchesCity
  })

  const getStoreTypeColor = (type: string) => {
    const colors = {
      'Flagship Store': 'bg-accent-500/20 text-accent-400 border-accent-400/30',
      'Select Store': 'bg-blue-500/20 text-blue-400 border-blue-400/30',
      'Regular Store': 'bg-green-500/20 text-green-400 border-green-400/30',
      'Outlet Store': 'bg-orange-500/20 text-orange-400 border-orange-400/30',
      'Express Store': 'bg-purple-500/20 text-purple-400 border-purple-400/30'
    }
    return colors[type as keyof typeof colors] || 'bg-primary-500/20 text-primary-400 border-primary-400/30'
  }

  const getStatusColor = (status: string) => {
    return status === 'Open' 
      ? 'text-green-400' 
      : 'text-orange-400'
  }

  const getStatusIcon = (status: string) => {
    return status === 'Open' ? CheckCircleIcon : ExclamationCircleIcon
  }

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
            <MapPinIcon className="w-16 h-16 text-accent-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Find a
              <span className="block bg-gradient-to-r from-accent-400 to-accent-600 bg-clip-text text-transparent">
                Store
              </span>
            </h1>
            <p className="text-xl text-primary-200 max-w-3xl mx-auto leading-relaxed">
              Visit our physical stores across India for the complete FASHUN experience. 
              Try before you buy, get personal styling, and discover exclusive collections.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Search */}
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-400" />
                <input
                  type="text"
                  placeholder="Search by store name, address, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-primary-800/30 border border-white/10 rounded-xl text-white placeholder-primary-400 focus:outline-none focus:border-accent-400/50 focus:ring-2 focus:ring-accent-400/20"
                />
              </div>

              {/* City Filter */}
              <div className="md:w-64">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full p-3 bg-primary-800/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-accent-400/50"
                >
                  <option value="all">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-primary-300 text-sm">
              {filteredStores.length} store{filteredStores.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Store List */}
          <div className="lg:col-span-2 space-y-6">
            {filteredStores.map((store, index) => {
              const StatusIcon = getStatusIcon(store.status)
              return (
                <motion.div
                  key={store.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`bg-primary-900/30 backdrop-blur-sm border rounded-2xl overflow-hidden hover:border-accent-400/30 transition-all cursor-pointer ${
                    selectedStore === store.id ? 'border-accent-400/50 ring-1 ring-accent-400/20' : 'border-white/10'
                  }`}
                  onClick={() => setSelectedStore(selectedStore === store.id ? null : store.id)}
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Store Image */}
                    <div className="md:w-48 h-48 md:h-auto bg-primary-800/50 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-accent-400/10 to-transparent" />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStoreTypeColor(store.type)}`}>
                          {store.type}
                        </span>
                      </div>
                    </div>

                    {/* Store Info */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white mb-2">{store.name}</h3>
                          <div className="flex items-center text-primary-300 text-sm mb-2">
                            <MapPinIcon className="w-4 h-4 mr-1" />
                            {store.address}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className={`flex items-center text-sm mb-1 ${getStatusColor(store.status)}`}>
                            <StatusIcon className="w-4 h-4 mr-1" />
                            {store.status}
                          </div>
                          <div className="text-primary-400 text-xs">
                            {store.status === 'Open' ? `Until ${store.openUntil}` : store.openUntil}
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-primary-300 text-sm">
                          <PhoneIcon className="w-4 h-4 mr-2 text-accent-400" />
                          {store.phone}
                        </div>
                        
                        <div className="flex items-center text-primary-300 text-sm">
                          <StarIcon className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                          {store.rating} ({store.reviews} reviews)
                        </div>
                      </div>

                      {/* Services */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {store.services.map(service => (
                          <span key={service} className="bg-primary-700/30 text-primary-200 px-2 py-1 rounded text-xs">
                            {service}
                          </span>
                        ))}
                      </div>

                      {/* Hours */}
                      <div className="text-primary-300 text-sm">
                        <div className="flex items-center mb-1">
                          <ClockIcon className="w-4 h-4 mr-2 text-accent-400" />
                          <span className="font-medium">Hours:</span>
                        </div>
                        <div className="ml-6 space-y-1">
                          <div>Mon-Fri: {store.hours.weekdays}</div>
                          <div>Sat-Sun: {store.hours.weekend}</div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 mt-4">
                        <button className="btn btn-outline text-sm">
                          <MapIcon className="w-4 h-4 mr-2" />
                          Get Directions
                        </button>
                        <button className="btn btn-glass text-sm">
                          <PhoneIcon className="w-4 h-4 mr-2" />
                          Call Store
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Extended Info (when selected) */}
                  {selectedStore === store.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-white/10 p-6"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-white font-semibold mb-3">Store Details</h4>
                          <div className="space-y-2 text-sm text-primary-200">
                            <div>Email: {store.email}</div>
                            <div>State: {store.state}</div>
                            <div>Type: {store.type}</div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-white font-semibold mb-3">Available Services</h4>
                          <div className="space-y-2">
                            {store.services.map(service => (
                              <div key={service} className="flex items-center text-sm text-primary-200">
                                <CheckCircleIcon className="w-4 h-4 mr-2 text-green-400" />
                                {service}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}

            {filteredStores.length === 0 && (
              <div className="text-center py-12">
                <MapPinIcon className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                <p className="text-primary-300 text-lg mb-2">No stores found</p>
                <p className="text-primary-400 text-sm">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>

          {/* Map Placeholder & Info */}
          <div className="space-y-6">
            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <MapIcon className="w-5 h-5 mr-2 text-accent-400" />
                Store Locations
              </h3>
              
              <div className="aspect-square bg-primary-800/50 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-400/5 to-primary-600/5" />
                <div className="text-center text-primary-300">
                  <MapIcon className="w-16 h-16 mx-auto mb-4 text-accent-400/50" />
                  <p className="font-medium">Interactive Map</p>
                  <p className="text-sm">View all store locations</p>
                </div>
              </div>
              
              <button className="w-full mt-4 btn btn-glass">
                <ArrowTopRightOnSquareIcon className="w-4 h-4 mr-2" />
                Open Full Map
              </button>
            </motion.div>

            {/* Store Types Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-primary-900/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <BuildingStorefrontIcon className="w-5 h-5 mr-2 text-accent-400" />
                Store Types
              </h3>
              
              <div className="space-y-4">
                {storeTypes.map(type => (
                  <div key={type} className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border mr-3 ${getStoreTypeColor(type)}`}>
                      {type}
                    </span>
                    <span className="text-primary-200 text-sm">
                      {type === 'Flagship Store' && 'Full experience with all services'}
                      {type === 'Select Store' && 'Curated collection with key services'}
                      {type === 'Regular Store' && 'Standard store with basic services'}
                      {type === 'Outlet Store' && 'Discounted items and past collections'}
                      {type === 'Express Store' && 'Quick shopping experience'}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Store Services */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gradient-to-r from-accent-500/10 to-primary-700/10 backdrop-blur-sm border border-accent-400/20 rounded-3xl p-8"
            >
              <h3 className="text-xl font-bold text-white mb-6">Store Services</h3>
              
              <div className="space-y-3">
                {[
                  'Personal Styling Sessions',
                  'Click & Collect Orders',
                  'Returns & Exchanges',
                  'Custom Fittings',
                  'Exclusive Store Drops',
                  'VIP Shopping Hours'
                ].map(service => (
                  <div key={service} className="flex items-center text-sm text-primary-200">
                    <CheckCircleIcon className="w-4 h-4 mr-3 text-accent-400" />
                    {service}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-primary-800/30 rounded-xl">
                <p className="text-accent-400 font-medium text-sm mb-2">Store Hours</p>
                <p className="text-primary-200 text-sm">Most stores open 11 AM - 10 PM daily. Extended weekend hours at select locations.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}