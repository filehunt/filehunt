'use client';

import dynamic from 'next/dynamic';

// Dynamically import to avoid hydration issues
const FilehuntApp = dynamic(
  () => import('@/components/filehunt/FilehuntApp'),
  { 
    ssr: false,
    loading: () => <div className="h-screen bg-background flex items-center justify-center">Loading...</div>
  }
);

export default function Home() {
  return <FilehuntApp />;
}
