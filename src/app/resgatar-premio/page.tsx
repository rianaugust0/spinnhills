
'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { ResgateForm } from '@/components/resgatar-premio/ResgateForm';

function LoadingComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-deep-black">
      <Loader2 className="h-16 w-16 animate-spin text-gold" />
    </div>
  );
}

export default function ResgatarPremioPage() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <ResgateForm />
    </Suspense>
  );
}
