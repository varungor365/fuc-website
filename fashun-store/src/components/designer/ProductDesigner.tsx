'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  PhotoIcon, 
  PlusIcon, 
  TrashIcon, 
  ArrowDownTrayIcon,
  SwatchIcon,
  PaintBrushIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'
import * as fabric from 'fabric'

const garmentTypes = [
  { id: 'hoodie', name: 'Hoodie', price: 2499, printAreas: ['front', 'back'] },
  { id: 'tee', name: 'T-Shirt', price: 1299, printAreas: ['front', 'back'] },
  { id: 'polo', name: 'Polo', price: 1899, printAreas: ['front', 'back'] }
]

const colors = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Navy', value: '#1e3a8a' },
  { name: 'Grey', value: '#6b7280' },
  { name: 'Olive', value: '#365314' }
]

export function ProductDesigner() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null)
  const [selectedGarment, setSelectedGarment] = useState(garmentTypes[0])
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const [printArea, setPrintArea] = useState<'front' | 'back'>('front')
  const [isGeneratingMockup, setIsGeneratingMockup] = useState(false)

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (canvasRef.current && !canvas) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: 400,
        height: 500,
        backgroundColor: '#f3f4f6',
        selection: true,
        preserveObjectStacking: true
      })

      // Add print area guidelines
      const printArea = new fabric.Rect({
        left: 50,
        top: 100,
        width: 300,
        height: 300,
        fill: 'transparent',
        stroke: '#e5e7eb',
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false
      })
      
      fabricCanvas.add(printArea)
      
      // Add garment outline
      const garmentOutline = new fabric.Rect({
        left: 20,
        top: 50,
        width: 360,
        height: 400,
        fill: '#000000', // Default black color, will be updated by the color useEffect
        stroke: '#d1d5db',
        strokeWidth: 2,
        selectable: false,
        evented: false,
        rx: 10,
        ry: 10
      })
      
      fabricCanvas.add(garmentOutline)
      fabricCanvas.sendObjectToBack(garmentOutline)
      
      setCanvas(fabricCanvas)

      return () => {
        fabricCanvas.dispose()
      }
    }
  }, [])

  // Update garment color when color changes
  useEffect(() => {
    if (canvas) {
      const garmentOutline = canvas.getObjects().find((obj: any) =>
        obj.type === 'rect' && !obj.strokeDashArray
      )
      if (garmentOutline) {
        garmentOutline.set('fill', selectedColor.value)
        canvas.renderAll()
      }
    }
  }, [canvas, selectedColor.value])

  const addText = () => {
    if (!canvas) return
    
    const text = new fabric.IText('Your Text Here', {
      left: 150,
      top: 200,
      fontFamily: 'Inter',
      fontSize: 32,
      fill: '#000000',
      fontWeight: 'bold',
      textAlign: 'center'
    })
    
    canvas.add(text)
    canvas.setActiveObject(text)
  }

  const addImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !event.target.files?.[0]) return

    const file = event.target.files[0]
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const imgElement = new Image()
      imgElement.onload = () => {
        const fabricImg = new fabric.Image(imgElement, {
          left: 150,
          top: 200,
          scaleX: 0.5,
          scaleY: 0.5
        })
        
        canvas.add(fabricImg)
        canvas.setActiveObject(fabricImg)
      }
      imgElement.src = e.target?.result as string
    }
    
    reader.readAsDataURL(file)
  }

  const deleteSelected = () => {
    if (!canvas) return
    
    const activeObjects = canvas.getActiveObjects()
    activeObjects.forEach((obj: any) => {
      // Don't delete garment outline or print area guidelines
      if (!obj.strokeDashArray && obj.type !== 'rect') {
        canvas.remove(obj)
      } else if (obj.strokeDashArray) {
        return // Don't delete guidelines
      } else if (obj.type === 'rect' && obj.fill !== 'transparent') {
        return // Don't delete garment outline
      } else {
        canvas.remove(obj)
      }
    })
    canvas.discardActiveObject()
  }

  const generateMockup = async () => {
    if (!canvas) return
    
    setIsGeneratingMockup(true)
    
    // Export canvas as image
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    })
    
    // Here you would typically send this to your AI mockup service
    console.log('Generating mockup with design:', dataURL)
    
    // Simulate API call
    setTimeout(() => {
      setIsGeneratingMockup(false)
      // Show success message or generated mockup
    }, 3000)
  }

  const downloadDesign = () => {
    if (!canvas) return
    
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 3
    })
    
    const link = document.createElement('a')
    link.download = `fashun-design-${Date.now()}.png`
    link.href = dataURL
    link.click()
  }

  return (
    <div className="min-h-screen bg-primary-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Toolbar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Garment Selection */}
            <div className="card">
              <h3 className="text-lg font-semibold text-primary-100 mb-4">Select Garment</h3>
              <div className="space-y-3">
                {garmentTypes.map((garment) => (
                  <button
                    key={garment.id}
                    onClick={() => setSelectedGarment(garment)}
                    className={`w-full p-3 rounded-lg border text-left transition-colors ${
                      selectedGarment.id === garment.id
                        ? 'border-accent-500 bg-accent-500/10 text-accent-500'
                        : 'border-primary-600 text-primary-200 hover:border-primary-500'
                    }`}
                  >
                    <div className="font-medium">{garment.name}</div>
                    <div className="text-sm opacity-80">₹{garment.price.toLocaleString()}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="card">
              <h3 className="text-lg font-semibold text-primary-100 mb-4">Garment Color</h3>
              <div className="grid grid-cols-5 gap-2">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-lg border-2 transition-all ${
                      selectedColor.value === color.value
                        ? 'border-accent-500 scale-110'
                        : 'border-primary-600 hover:border-primary-500'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Print Area */}
            <div className="card">
              <h3 className="text-lg font-semibold text-primary-100 mb-4">Print Area</h3>
              <div className="flex space-x-2">
                {selectedGarment.printAreas.map((area) => (
                  <button
                    key={area}
                    onClick={() => setPrintArea(area as 'front' | 'back')}
                    className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                      printArea === area
                        ? 'bg-accent-500 text-primary-900'
                        : 'bg-primary-600 text-primary-200 hover:bg-primary-500'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Tools */}
            <div className="card">
              <h3 className="text-lg font-semibold text-primary-100 mb-4">Design Tools</h3>
              <div className="space-y-3">
                <button
                  onClick={addText}
                  className="w-full btn-secondary flex items-center justify-center space-x-2"
                >
                  <PaintBrushIcon className="h-5 w-5" />
                  <span>Add Text</span>
                </button>
                
                <label className="w-full btn-secondary flex items-center justify-center space-x-2 cursor-pointer">
                  <PhotoIcon className="h-5 w-5" />
                  <span>Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={addImage}
                    className="hidden"
                  />
                </label>
                
                <button
                  onClick={deleteSelected}
                  className="w-full btn-secondary flex items-center justify-center space-x-2 text-red-400 hover:text-red-300"
                >
                  <TrashIcon className="h-5 w-5" />
                  <span>Delete Selected</span>
                </button>
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary-100">
                  Design Canvas - {selectedGarment.name} ({printArea})
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-primary-300">Print Area</span>
                  <div className="w-4 h-1 bg-primary-400 border border-dashed"></div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="relative bg-primary-700 p-6 rounded-lg">
                  <canvas ref={canvasRef} className="border border-primary-600 rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* Preview & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* 3D Preview */}
            <div className="card">
              <h3 className="text-lg font-semibold text-primary-100 mb-4">3D Preview</h3>
              <div className="aspect-square bg-primary-700 rounded-lg flex items-center justify-center">
                <div className="text-center text-primary-400">
                  <SwatchIcon className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">3D preview will appear here</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-primary-100 mb-4">Actions</h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={generateMockup}
                  disabled={isGeneratingMockup}
                  className="w-full btn-accent flex items-center justify-center space-x-2"
                >
                  <AdjustmentsHorizontalIcon className="h-5 w-5" />
                  <span>{isGeneratingMockup ? 'Generating...' : 'Generate Mockup'}</span>
                </motion.button>
                
                <button
                  onClick={downloadDesign}
                  className="w-full btn-secondary flex items-center justify-center space-x-2"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                  <span>Download Design</span>
                </button>
                
                <button className="w-full btn-primary flex items-center justify-center space-x-2">
                  <PlusIcon className="h-5 w-5" />
                  <span>Add to Cart - ₹{selectedGarment.price.toLocaleString()}</span>
                </button>
              </div>
            </div>

            {/* Design Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-primary-100 mb-4">Design Info</h3>
              <div className="space-y-2 text-sm text-primary-300">
                <div className="flex justify-between">
                  <span>Garment:</span>
                  <span className="text-primary-100">{selectedGarment.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Color:</span>
                  <span className="text-primary-100">{selectedColor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Print Area:</span>
                  <span className="text-primary-100 capitalize">{printArea}</span>
                </div>
                <div className="flex justify-between">
                  <span>Elements:</span>
                  <span className="text-primary-100">{canvas?.getObjects().filter((obj: any) => obj.type !== 'rect').length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
