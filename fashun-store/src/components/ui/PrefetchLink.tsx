import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

export default function PrefetchLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const router = useRouter();

  const handleMouseEnter = () => {
    router.prefetch(href);
  };

  return (
    <Link href={href} className={className} onMouseEnter={handleMouseEnter} prefetch={true}>
      {children}
    </Link>
  );
}
