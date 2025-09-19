'use client'

import { useState, useRef, useCallback } from 'react'
import {
  PhotoIcon,
  FolderIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  CloudArrowUpIcon,
  XMarkIcon,
  DocumentDuplicateIcon,
  ShareIcon
} from '@heroicons/react/24/outline'

interface MediaFile {
  id: string
  name: string
  url: string
  type: 'image' | 'video' | 'document'
  size: number
  dimensions?: { width: number; height: number }
  uploaded_at: string
  folder: string
  alt_text?: string
  tags: string[]
}

interface MediaFolder {
  id: string
  name: string
  parent_id?: string
  created_at: string
  file_count: number
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [folders, setFolders] = useState<MediaFolder[]>([])
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showFileDetails, setShowFileDetails] = useState(false)
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock data
  const mockFolders: MediaFolder[] = [
    { id: '1', name: 'Product Images', created_at: '2024-01-01', file_count: 45 },
    { id: '2', name: 'Category Banners', created_at: '2024-01-02', file_count: 12 },
    { id: '3', name: 'Marketing Materials', created_at: '2024-01-03', file_count: 23 },
    { id: '4', name: 'User Avatars', created_at: '2024-01-04', file_count: 156 },
  ]

  const mockFiles: MediaFile[] = [
    {
      id: '1',
      name: 'premium-tshirt-1.jpg',
      url: '/api/placeholder/300/400',
      type: 'image',
      size: 245760,
      dimensions: { width: 1200, height: 1600 },
      uploaded_at: '2024-01-10T10:30:00Z',
      folder: 'Product Images',
      alt_text: 'Premium cotton t-shirt in navy blue',
      tags: ['product', 'tshirt', 'navy', 'premium']
    },
    {
      id: '2',
      name: 'denim-jacket-hero.jpg',
      url: '/api/placeholder/300/400',
      type: 'image',
      size: 512000,
      dimensions: { width: 1920, height: 1080 },
      uploaded_at: '2024-01-09T14:20:00Z',
      folder: 'Product Images',
      alt_text: 'Vintage denim jacket hero image',
      tags: ['product', 'jacket', 'denim', 'hero']
    },
    {
      id: '3',
      name: 'category-banner-men.jpg',
      url: '/api/placeholder/400/200',
      type: 'image',
      size: 384000,
      dimensions: { width: 1600, height: 800 },
      uploaded_at: '2024-01-08T09:15:00Z',
      folder: 'Category Banners',
      alt_text: 'Men\'s category banner',
      tags: ['banner', 'category', 'men']
    },
    {
      id: '4',
      name: 'promotional-video.mp4',
      url: '/api/placeholder/300/200',
      type: 'video',
      size: 15728640,
      uploaded_at: '2024-01-07T16:45:00Z',
      folder: 'Marketing Materials',
      alt_text: 'Spring collection promotional video',
      tags: ['video', 'promotion', 'spring']
    },
    {
      id: '5',
      name: 'size-guide.pdf',
      url: '/api/placeholder/200/300',
      type: 'document',
      size: 102400,
      uploaded_at: '2024-01-06T11:30:00Z',
      folder: 'Marketing Materials',
      alt_text: 'Product size guide document',
      tags: ['document', 'guide', 'sizing']
    }
  ]

  useState(() => {
    setFolders(mockFolders)
    setFiles(mockFiles)
  })

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = filterType === 'all' || file.type === filterType
    const matchesFolder = !currentFolder || file.folder === currentFolder
    
    return matchesSearch && matchesType && matchesFolder
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return PhotoIcon
      case 'video': return PhotoIcon
      case 'document': return DocumentDuplicateIcon
      default: return PhotoIcon
    }
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    // Handle file upload logic here
    console.log('Files dropped:', droppedFiles)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    // Handle file upload logic here
    console.log('Files selected:', selectedFiles)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600">Manage your images, videos, and documents</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <CloudArrowUpIcon className="h-5 w-5" />
            <span>Upload Files</span>
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
            <FolderIcon className="h-5 w-5" />
            <span>New Folder</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <PhotoIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Files</p>
              <p className="text-2xl font-bold text-gray-900">{files.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FolderIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Folders</p>
              <p className="text-2xl font-bold text-gray-900">{folders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CloudArrowUpIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Storage Used</p>
              <p className="text-2xl font-bold text-gray-900">2.4 GB</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ShareIcon className="h-8 w-8 text-indigo-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Recent Uploads</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button onClick={() => setCurrentFolder(null)} className="hover:text-gray-900">
              Media Library
            </button>
            {currentFolder && (
              <>
                <span>/</span>
                <span className="text-gray-900 font-medium">{currentFolder}</span>
              </>
            )}
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
          </select>

          {/* View Mode */}
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <div className="grid grid-cols-2 gap-1 w-4 h-4">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <div className="space-y-1 w-4 h-4">
                <div className="bg-current h-1 rounded"></div>
                <div className="bg-current h-1 rounded"></div>
                <div className="bg-current h-1 rounded"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Folders (if in root) */}
      {!currentFolder && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Folders</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setCurrentFolder(folder.name)}
                className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center mb-2">
                  <FolderIcon className="h-8 w-8 text-blue-600" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{folder.name}</p>
                    <p className="text-xs text-gray-500">{folder.file_count} files</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Files */}
      <div className="bg-white rounded-lg shadow">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-6">
            {filteredFiles.map((file) => {
              const IconComponent = getFileIcon(file.type)
              return (
                <div
                  key={file.id}
                  className="relative group cursor-pointer"
                  onClick={() => {
                    setSelectedFile(file)
                    setShowFileDetails(true)
                  }}
                >
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {file.type === 'image' ? (
                      <img
                        src={file.url}
                        alt={file.alt_text || file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <IconComponent className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                  
                  {/* Hover Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-white rounded-full p-1 shadow-md hover:shadow-lg">
                      <EllipsisVerticalIcon className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modified</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFiles.map((file) => {
                  const IconComponent = getFileIcon(file.type)
                  return (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center mr-3">
                            {file.type === 'image' ? (
                              <img src={file.url} alt={file.name} className="w-8 h-8 object-cover rounded" />
                            ) : (
                              <IconComponent className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{file.name}</div>
                            <div className="text-sm text-gray-500">{file.folder}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {file.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatFileSize(file.size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(file.uploaded_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedFile(file)
                              setShowFileDetails(true)
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <ArrowDownTrayIcon className="h-5 w-5" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Upload Files</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Upload Area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Click to upload
                  </button>
                  {' '}or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Upload Files
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Details Modal */}
      {showFileDetails && selectedFile && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">File Details</h3>
                <button
                  onClick={() => setShowFileDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Preview */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    {selectedFile.type === 'image' ? (
                      <img
                        src={selectedFile.url}
                        alt={selectedFile.alt_text || selectedFile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {(() => {
                          const IconComponent = getFileIcon(selectedFile.type)
                          return <IconComponent className="h-16 w-16 text-gray-400" />
                        })()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">File Name</label>
                    <input
                      type="text"
                      value={selectedFile.name}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Alt Text</label>
                    <input
                      type="text"
                      value={selectedFile.alt_text || ''}
                      placeholder="Describe this image..."
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tags</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {selectedFile.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                          <button className="ml-1 text-blue-600 hover:text-blue-800">
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Size:</span>
                      <p className="text-gray-900">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Type:</span>
                      <p className="text-gray-900 capitalize">{selectedFile.type}</p>
                    </div>
                    {selectedFile.dimensions && (
                      <div className="col-span-2">
                        <span className="font-medium text-gray-700">Dimensions:</span>
                        <p className="text-gray-900">
                          {selectedFile.dimensions.width} × {selectedFile.dimensions.height}
                        </p>
                      </div>
                    )}
                    <div className="col-span-2">
                      <span className="font-medium text-gray-700">Uploaded:</span>
                      <p className="text-gray-900">{new Date(selectedFile.uploaded_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowFileDetails(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Delete
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
