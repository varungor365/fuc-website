"use client"
import { useState } from 'react'

const steps = ['Order Placed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered']

export default function TrackingPage() {
  const [id, setId] = useState('')
  const [idx, setIdx] = useState<number | null>(null)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock: derive a deterministic progress
    const n = id.trim().length % steps.length
    setIdx(n)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-display font-bold mb-4">Track your order</h1>
      <form onSubmit={submit} className="flex gap-3">
        <input value={id} onChange={e=>setId(e.target.value)} placeholder="Enter order ID or email" className="input-primary flex-1" />
        <button className="btn-accent" type="submit">Track</button>
      </form>
      {idx !== null && (
        <div className="mt-8 grid grid-cols-6 gap-2">
          {steps.map((s, i) => (
            <div key={s} className={`card text-center ${i<=idx ? 'border-accent-500' : ''}`}>
              <div className="text-sm font-medium">{s}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
