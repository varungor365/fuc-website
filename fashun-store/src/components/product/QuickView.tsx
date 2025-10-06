'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, ShoppingCart } from 'lucide-react';
import { useMedusaCart } from '@/hooks/useMedusaCart';
import { playSound } from '@/lib/sound-effects';
import toast from 'react-hot-toast';

export default function QuickView({ product, isOpen, onClose }: any) {
  const { addItem } = useMedusaCart();

  const handleAddToCart = async () => {
    await addItem(product.variants[0].id, 1);
    playSound('addToCart');
    toast.success('Added to cart!');
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full z-10"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-96 object-cover rounded-lg"
                  />

                  <div>
                    <h2 className="text-3xl font-bold mb-4">{product.title}</h2>
                    <p className="text-2xl text-purple-600 font-bold mb-4">
                      ₹{(product.variants[0].prices[0].amount / 100).toFixed(0)}
                    </p>
                    <p className="text-gray-600 mb-6">{product.description}</p>

                    <button
                      onClick={handleAddToCart}
                      className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
