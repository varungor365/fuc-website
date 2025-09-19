'use client'
import { useCart } from '@/hooks/useCart'
import { products } from '@/data/products'

export function AddToCartForm({ id }: { id: string }) {
  const { addItem } = useCart()
  const product = products.find(p => p.id === id)!
  const defaultSize = product.sizes[0]
  const defaultColor = product.colors[0]

  return (
    <button
      onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.images[0], size: defaultSize, color: defaultColor })}
      className="btn-accent w-full mt-4"
    >
      Add to cart
    </button>
  )
}
