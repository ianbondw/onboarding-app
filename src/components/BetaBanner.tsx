// src/components/BetaBanner.tsx
'use client';

import { useEffect, useState } from 'react';

const STAGE = process.env.NEXT_PUBLIC_APP_STAGE ?? 'beta'; // 'beta' | 'prod' etc.
const DISMISS_KEY = 'mf_beta_banner_dismissed_v1';

export default function BetaBanner() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    // show only when in beta and not dismissed
    const dismissed = typeof window !== 'undefined' && localStorage.getItem(DISMISS_KEY) === '1';
    setHidden(!(STAGE === 'beta' && !dismissed));
  }, []);

  if (hidden) return null;

  return (
    <div className="w-full bg-amber-50 text-amber-900 text-center text-sm py-2 px-3 border-b border-amber-200">
      <div className="mx-auto max-w-6xl flex items-center justify-center gap-3">
        <span>🚧 <strong>Marengo Finance is in private beta</strong> — feedback welcome.</span>
        <button
          onClick={() => {
            localStorage.setItem(DISMISS_KEY, '1');
            setHidden(true);
          }}
          className="rounded-md border border-amber-300 bg-white/60 px-2 py-0.5 text-xs hover:bg-white"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}