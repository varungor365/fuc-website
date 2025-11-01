import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const phoneNumber = '919310632271';
  const message = 'Hi! I have a question about FASHUN.CO';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition z-50"
    >
      <MessageCircle className="w-6 h-6" />
    </a>
  );
}
