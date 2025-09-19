import { NextRequest, NextResponse } from 'next/server'

// Types for Inventory Management System
interface Warehouse {
  id: string
  name: string
  location: string
  address: string
  manager: string
  phone: string
  email: string
  capacity: number
  currentUtilization: number
  status: 'active' | 'inactive' | 'maintenance'
  zones: string[]
  createdAt: string
}

interface InventoryItem {
  id: string
  productId: string
  productName: string
  sku: string
  warehouseId: string
  warehouseName: string
  category: string
  size: string
  color: string
  quantity: number
  reservedQuantity: number
  availableQuantity: number
  reorderLevel: number
  maxStockLevel: number
  unitCost: number
  totalValue: number
  location: {
    zone: string
    aisle: string
    shelf: string
    bin: string
  }
  lastUpdated: string
  lastStockCheck: string
  batchNumber?: string
  expiryDate?: string
  supplier: {
    id: string
    name: string
    contactPerson: string
    phone: string
    email: string
  }
}

interface StockAlert {
  id: string
  type: 'low_stock' | 'out_of_stock' | 'overstock' | 'expired' | 'damaged'
  severity: 'low' | 'medium' | 'high' | 'critical'
  itemId: string
  productName: string
  sku: string
  warehouseId: string
  warehouseName: string
  currentQuantity: number
  reorderLevel?: number
  message: string
  isResolved: boolean
  createdAt: string
  resolvedAt?: string
  resolvedBy?: string
}

interface PurchaseOrder {
  id: string
  orderNumber: string
  supplierId: string
  supplierName: string
  warehouseId: string
  warehouseName: string
  status: 'draft' | 'pending' | 'approved' | 'sent' | 'received' | 'completed' | 'cancelled'
  items: {
    productId: string
    productName: string
    sku: string
    quantityOrdered: number
    quantityReceived: number
    unitCost: number
    totalCost: number
  }[]
  totalAmount: number
  orderDate: string
  expectedDelivery: string
  actualDelivery?: string
  notes?: string
  createdBy: string
  approvedBy?: string
}

interface StockTransfer {
  id: string
  transferNumber: string
  fromWarehouseId: string
  fromWarehouseName: string
  toWarehouseId: string
  toWarehouseName: string
  status: 'pending' | 'in_transit' | 'completed' | 'cancelled'
  items: {
    productId: string
    productName: string
    sku: string
    quantity: number
    transferredQuantity?: number
  }[]
  requestedBy: string
  approvedBy?: string
  requestDate: string
  completedDate?: string
  trackingNumber?: string
  notes?: string
}

interface StockMovement {
  id: string
  type: 'inbound' | 'outbound' | 'transfer' | 'adjustment' | 'return' | 'damage'
  itemId: string
  productName: string
  sku: string
  warehouseId: string
  quantity: number
  previousQuantity: number
  newQuantity: number
  reason: string
  reference?: string
  performedBy: string
  timestamp: string
  notes?: string
}

// Mock Database
const mockWarehouses: Warehouse[] = [
  {
    id: 'wh-mumbai-001',
    name: 'Mumbai Central Warehouse',
    location: 'Mumbai, Maharashtra',
    address: 'Plot No. 45, Industrial Area, Andheri East, Mumbai - 400099',
    manager: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@fashun.co.in',
    capacity: 50000,
    currentUtilization: 75,
    status: 'active',
    zones: ['A', 'B', 'C', 'D'],
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'wh-delhi-002',
    name: 'Delhi North Warehouse',
    location: 'Delhi, India',
    address: 'Sector 25, Industrial Area, Gurgaon, Delhi NCR - 122001',
    manager: 'Priya Sharma',
    phone: '+91 87654 32109',
    email: 'priya.sharma@fashun.co.in',
    capacity: 30000,
    currentUtilization: 60,
    status: 'active',
    zones: ['A', 'B', 'C'],
    createdAt: '2024-02-01T10:00:00Z'
  },
  {
    id: 'wh-bangalore-003',
    name: 'Bangalore South Warehouse',
    location: 'Bangalore, Karnataka',
    address: 'Electronic City Phase 2, Bangalore - 560100',
    manager: 'Amit Patel',
    phone: '+91 76543 21098',
    email: 'amit.patel@fashun.co.in',
    capacity: 40000,
    currentUtilization: 45,
    status: 'active',
    zones: ['A', 'B'],
    createdAt: '2024-03-01T10:00:00Z'
  }
]

const mockInventoryItems: InventoryItem[] = [
  {
    id: 'inv-001',
    productId: 'prod-hoodie-001',
    productName: 'Premium Oversized Hoodie',
    sku: 'FUC-HOD-001-L-BLK',
    warehouseId: 'wh-mumbai-001',
    warehouseName: 'Mumbai Central Warehouse',
    category: 'Hoodies',
    size: 'L',
    color: 'Black',
    quantity: 45,
    reservedQuantity: 5,
    availableQuantity: 40,
    reorderLevel: 20,
    maxStockLevel: 200,
    unitCost: 1200,
    totalValue: 54000,
    location: {
      zone: 'A',
      aisle: '01',
      shelf: '03',
      bin: 'B12'
    },
    lastUpdated: '2025-01-16T14:30:00Z',
    lastStockCheck: '2025-01-15T09:00:00Z',
    batchNumber: 'BATCH-001-2025',
    supplier: {
      id: 'sup-001',
      name: 'Urban Threads Pvt Ltd',
      contactPerson: 'Vikram Singh',
      phone: '+91 98765 11111',
      email: 'orders@urbanthreads.com'
    }
  },
  {
    id: 'inv-002',
    productId: 'prod-tshirt-001',
    productName: 'Designer Graphic T-Shirt',
    sku: 'FUC-TSH-001-M-WHT',
    warehouseId: 'wh-mumbai-001',
    warehouseName: 'Mumbai Central Warehouse',
    category: 'T-Shirts',
    size: 'M',
    color: 'White',
    quantity: 15,
    reservedQuantity: 2,
    availableQuantity: 13,
    reorderLevel: 25,
    maxStockLevel: 150,
    unitCost: 450,
    totalValue: 6750,
    location: {
      zone: 'B',
      aisle: '02',
      shelf: '01',
      bin: 'T08'
    },
    lastUpdated: '2025-01-16T12:15:00Z',
    lastStockCheck: '2025-01-14T16:00:00Z',
    batchNumber: 'BATCH-002-2025',
    supplier: {
      id: 'sup-002',
      name: 'Cotton Craft Industries',
      contactPerson: 'Sunita Devi',
      phone: '+91 87654 22222',
      email: 'supply@cottoncraft.in'
    }
  },
  {
    id: 'inv-003',
    productId: 'prod-polo-001',
    productName: 'Classic Polo Shirt',
    sku: 'FUC-POL-001-L-NVY',
    warehouseId: 'wh-delhi-002',
    warehouseName: 'Delhi North Warehouse',
    category: 'Polo Shirts',
    size: 'L',
    color: 'Navy',
    quantity: 8,
    reservedQuantity: 1,
    availableQuantity: 7,
    reorderLevel: 15,
    maxStockLevel: 100,
    unitCost: 650,
    totalValue: 5200,
    location: {
      zone: 'A',
      aisle: '01',
      shelf: '02',
      bin: 'P05'
    },
    lastUpdated: '2025-01-16T11:45:00Z',
    lastStockCheck: '2025-01-13T10:30:00Z',
    batchNumber: 'BATCH-003-2025',
    supplier: {
      id: 'sup-001',
      name: 'Urban Threads Pvt Ltd',
      contactPerson: 'Vikram Singh',
      phone: '+91 98765 11111',
      email: 'orders@urbanthreads.com'
    }
  }
]

const mockStockAlerts: StockAlert[] = [
  {
    id: 'alert-001',
    type: 'low_stock',
    severity: 'high',
    itemId: 'inv-002',
    productName: 'Designer Graphic T-Shirt',
    sku: 'FUC-TSH-001-M-WHT',
    warehouseId: 'wh-mumbai-001',
    warehouseName: 'Mumbai Central Warehouse',
    currentQuantity: 15,
    reorderLevel: 25,
    message: 'Stock level (15) is below reorder point (25). Immediate reorder recommended.',
    isResolved: false,
    createdAt: '2025-01-16T08:00:00Z'
  },
  {
    id: 'alert-002',
    type: 'low_stock',
    severity: 'critical',
    itemId: 'inv-003',
    productName: 'Classic Polo Shirt',
    sku: 'FUC-POL-001-L-NVY',
    warehouseId: 'wh-delhi-002',
    warehouseName: 'Delhi North Warehouse',
    currentQuantity: 8,
    reorderLevel: 15,
    message: 'Critical stock level (8) detected. Urgent reorder required to prevent stockout.',
    isResolved: false,
    createdAt: '2025-01-16T06:30:00Z'
  }
]

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po-001',
    orderNumber: 'PO-2025-001',
    supplierId: 'sup-001',
    supplierName: 'Urban Threads Pvt Ltd',
    warehouseId: 'wh-mumbai-001',
    warehouseName: 'Mumbai Central Warehouse',
    status: 'sent',
    items: [
      {
        productId: 'prod-hoodie-001',
        productName: 'Premium Oversized Hoodie',
        sku: 'FUC-HOD-001-L-BLK',
        quantityOrdered: 100,
        quantityReceived: 0,
        unitCost: 1200,
        totalCost: 120000
      }
    ],
    totalAmount: 120000,
    orderDate: '2025-01-15T10:00:00Z',
    expectedDelivery: '2025-01-22T10:00:00Z',
    notes: 'Urgent restock for high-demand item',
    createdBy: 'Rajesh Kumar',
    approvedBy: 'Inventory Manager'
  },
  {
    id: 'po-002',
    orderNumber: 'PO-2025-002',
    supplierId: 'sup-002',
    supplierName: 'Cotton Craft Industries',
    warehouseId: 'wh-mumbai-001',
    warehouseName: 'Mumbai Central Warehouse',
    status: 'pending',
    items: [
      {
        productId: 'prod-tshirt-001',
        productName: 'Designer Graphic T-Shirt',
        sku: 'FUC-TSH-001-M-WHT',
        quantityOrdered: 75,
        quantityReceived: 0,
        unitCost: 450,
        totalCost: 33750
      }
    ],
    totalAmount: 33750,
    orderDate: '2025-01-16T09:00:00Z',
    expectedDelivery: '2025-01-20T10:00:00Z',
    notes: 'Reorder for low stock item',
    createdBy: 'Rajesh Kumar'
  }
]

const mockStockTransfers: StockTransfer[] = [
  {
    id: 'tr-001',
    transferNumber: 'TR-2025-001',
    fromWarehouseId: 'wh-mumbai-001',
    fromWarehouseName: 'Mumbai Central Warehouse',
    toWarehouseId: 'wh-delhi-002',
    toWarehouseName: 'Delhi North Warehouse',
    status: 'in_transit',
    items: [
      {
        productId: 'prod-polo-001',
        productName: 'Classic Polo Shirt',
        sku: 'FUC-POL-001-L-NVY',
        quantity: 20,
        transferredQuantity: 20
      }
    ],
    requestedBy: 'Priya Sharma',
    approvedBy: 'Rajesh Kumar',
    requestDate: '2025-01-15T14:00:00Z',
    trackingNumber: 'TR123456789',
    notes: 'Urgent transfer to meet Delhi demand'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const warehouseId = searchParams.get('warehouseId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    switch (action) {
      case 'dashboard':
        const totalStock = mockInventoryItems.reduce((sum, item) => sum + item.quantity, 0)
        const totalValue = mockInventoryItems.reduce((sum, item) => sum + item.totalValue, 0)
        const lowStockItems = mockInventoryItems.filter(item => item.quantity <= item.reorderLevel).length
        const outOfStockItems = mockInventoryItems.filter(item => item.quantity === 0).length
        const activeAlerts = mockStockAlerts.filter(alert => !alert.isResolved).length
        const pendingPOs = mockPurchaseOrders.filter(po => po.status === 'pending').length

        const warehouseUtilization = mockWarehouses.map(wh => ({
          name: wh.name,
          utilization: wh.currentUtilization,
          capacity: wh.capacity,
          status: wh.status
        }))

        return NextResponse.json({
          success: true,
          data: {
            overview: {
              totalStock,
              totalValue,
              lowStockItems,
              outOfStockItems,
              activeAlerts,
              pendingPOs
            },
            warehouses: warehouseUtilization,
            recentAlerts: mockStockAlerts.slice(0, 5),
            topProducts: mockInventoryItems
              .sort((a, b) => b.totalValue - a.totalValue)
              .slice(0, 5)
              .map(item => ({
                name: item.productName,
                sku: item.sku,
                quantity: item.quantity,
                value: item.totalValue,
                warehouse: item.warehouseName
              }))
          }
        })

      case 'inventory':
        let inventoryItems = [...mockInventoryItems]
        
        if (warehouseId) {
          inventoryItems = inventoryItems.filter(item => item.warehouseId === warehouseId)
        }

        const searchQuery = searchParams.get('search')
        if (searchQuery) {
          inventoryItems = inventoryItems.filter(item =>
            item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }

        const startIndex = (page - 1) * limit
        const paginatedItems = inventoryItems.slice(startIndex, startIndex + limit)

        return NextResponse.json({
          success: true,
          data: {
            items: paginatedItems,
            total: inventoryItems.length,
            page,
            totalPages: Math.ceil(inventoryItems.length / limit)
          }
        })

      case 'warehouses':
        return NextResponse.json({
          success: true,
          data: { warehouses: mockWarehouses }
        })

      case 'alerts':
        const alertType = searchParams.get('type')
        const severity = searchParams.get('severity')
        
        let alerts = [...mockStockAlerts]
        
        if (alertType) {
          alerts = alerts.filter(alert => alert.type === alertType)
        }
        
        if (severity) {
          alerts = alerts.filter(alert => alert.severity === severity)
        }

        return NextResponse.json({
          success: true,
          data: { alerts }
        })

      case 'purchase-orders':
        const poStatus = searchParams.get('status')
        let purchaseOrders = [...mockPurchaseOrders]
        
        if (poStatus) {
          purchaseOrders = purchaseOrders.filter(po => po.status === poStatus)
        }

        return NextResponse.json({
          success: true,
          data: { purchaseOrders }
        })

      case 'transfers':
        const transferStatus = searchParams.get('status')
        let transfers = [...mockStockTransfers]
        
        if (transferStatus) {
          transfers = transfers.filter(transfer => transfer.status === transferStatus)
        }

        return NextResponse.json({
          success: true,
          data: { transfers }
        })

      case 'movements':
        const itemId = searchParams.get('itemId')
        
        // Mock stock movements data
        const movements: StockMovement[] = [
          {
            id: 'mov-001',
            type: 'inbound',
            itemId: 'inv-001',
            productName: 'Premium Oversized Hoodie',
            sku: 'FUC-HOD-001-L-BLK',
            warehouseId: 'wh-mumbai-001',
            quantity: 50,
            previousQuantity: 25,
            newQuantity: 75,
            reason: 'Purchase Order Receipt',
            reference: 'PO-2024-089',
            performedBy: 'Rajesh Kumar',
            timestamp: '2025-01-10T14:30:00Z'
          }
        ]

        const filteredMovements = itemId 
          ? movements.filter(mov => mov.itemId === itemId)
          : movements

        return NextResponse.json({
          success: true,
          data: { movements: filteredMovements }
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Inventory API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'create-purchase-order':
        const { supplierId, warehouseId, items, expectedDelivery, notes } = body
        
        const supplier = {
          id: supplierId,
          name: supplierId === 'sup-001' ? 'Urban Threads Pvt Ltd' : 'Cotton Craft Industries'
        }
        
        const warehouse = mockWarehouses.find(wh => wh.id === warehouseId)
        
        const newPO: PurchaseOrder = {
          id: `po-${Date.now()}`,
          orderNumber: `PO-2025-${String(mockPurchaseOrders.length + 1).padStart(3, '0')}`,
          supplierId,
          supplierName: supplier.name,
          warehouseId,
          warehouseName: warehouse?.name || '',
          status: 'draft',
          items,
          totalAmount: items.reduce((sum: number, item: any) => sum + item.totalCost, 0),
          orderDate: new Date().toISOString(),
          expectedDelivery,
          notes,
          createdBy: 'System User'
        }
        
        mockPurchaseOrders.push(newPO)
        
        return NextResponse.json({
          success: true,
          message: 'Purchase order created successfully',
          data: newPO
        })

      case 'create-transfer':
        const { fromWarehouseId, toWarehouseId, transferItems, requestNotes } = body
        
        const fromWarehouse = mockWarehouses.find(wh => wh.id === fromWarehouseId)
        const toWarehouse = mockWarehouses.find(wh => wh.id === toWarehouseId)
        
        const newTransfer: StockTransfer = {
          id: `tr-${Date.now()}`,
          transferNumber: `TR-2025-${String(mockStockTransfers.length + 1).padStart(3, '0')}`,
          fromWarehouseId,
          fromWarehouseName: fromWarehouse?.name || '',
          toWarehouseId,
          toWarehouseName: toWarehouse?.name || '',
          status: 'pending',
          items: transferItems,
          requestedBy: 'System User',
          requestDate: new Date().toISOString(),
          notes: requestNotes
        }
        
        mockStockTransfers.push(newTransfer)
        
        return NextResponse.json({
          success: true,
          message: 'Stock transfer request created successfully',
          data: newTransfer
        })

      case 'adjust-stock':
        const { itemId, adjustment, reason, adjustmentNotes } = body
        
        const itemIndex = mockInventoryItems.findIndex(item => item.id === itemId)
        if (itemIndex === -1) {
          return NextResponse.json({ error: 'Item not found' }, { status: 404 })
        }
        
        const item = mockInventoryItems[itemIndex]
        const previousQuantity = item.quantity
        const newQuantity = Math.max(0, previousQuantity + adjustment)
        
        // Update item quantity
        mockInventoryItems[itemIndex] = {
          ...item,
          quantity: newQuantity,
          availableQuantity: newQuantity - item.reservedQuantity,
          totalValue: newQuantity * item.unitCost,
          lastUpdated: new Date().toISOString()
        }
        
        // Create stock movement record
        const movement: StockMovement = {
          id: `mov-${Date.now()}`,
          type: 'adjustment',
          itemId,
          productName: item.productName,
          sku: item.sku,
          warehouseId: item.warehouseId,
          quantity: adjustment,
          previousQuantity,
          newQuantity,
          reason,
          performedBy: 'System User',
          timestamp: new Date().toISOString(),
          notes: adjustmentNotes
        }
        
        return NextResponse.json({
          success: true,
          message: 'Stock adjustment completed successfully',
          data: { item: mockInventoryItems[itemIndex], movement }
        })

      case 'resolve-alert':
        const { alertId, resolutionNotes } = body
        
        const alertIndex = mockStockAlerts.findIndex(alert => alert.id === alertId)
        if (alertIndex === -1) {
          return NextResponse.json({ error: 'Alert not found' }, { status: 404 })
        }
        
        mockStockAlerts[alertIndex] = {
          ...mockStockAlerts[alertIndex],
          isResolved: true,
          resolvedAt: new Date().toISOString(),
          resolvedBy: 'System User'
        }
        
        return NextResponse.json({
          success: true,
          message: 'Alert resolved successfully'
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Inventory POST API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, id } = body

    switch (action) {
      case 'update-reorder-level':
        const { newReorderLevel } = body
        
        const itemIndex = mockInventoryItems.findIndex(item => item.id === id)
        if (itemIndex === -1) {
          return NextResponse.json({ error: 'Item not found' }, { status: 404 })
        }
        
        mockInventoryItems[itemIndex] = {
          ...mockInventoryItems[itemIndex],
          reorderLevel: newReorderLevel,
          lastUpdated: new Date().toISOString()
        }
        
        return NextResponse.json({
          success: true,
          message: 'Reorder level updated successfully',
          data: mockInventoryItems[itemIndex]
        })

      case 'update-po-status':
        const { status } = body
        
        const poIndex = mockPurchaseOrders.findIndex(po => po.id === id)
        if (poIndex === -1) {
          return NextResponse.json({ error: 'Purchase order not found' }, { status: 404 })
        }
        
        mockPurchaseOrders[poIndex] = {
          ...mockPurchaseOrders[poIndex],
          status
        }
        
        return NextResponse.json({
          success: true,
          message: 'Purchase order status updated successfully'
        })

      case 'update-transfer-status':
        const { transferStatus } = body
        
        const transferIndex = mockStockTransfers.findIndex(tr => tr.id === id)
        if (transferIndex === -1) {
          return NextResponse.json({ error: 'Transfer not found' }, { status: 404 })
        }
        
        mockStockTransfers[transferIndex] = {
          ...mockStockTransfers[transferIndex],
          status: transferStatus,
          ...(transferStatus === 'completed' && { completedDate: new Date().toISOString() })
        }
        
        return NextResponse.json({
          success: true,
          message: 'Transfer status updated successfully'
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Inventory PATCH API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}