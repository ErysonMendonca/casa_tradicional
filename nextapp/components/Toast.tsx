'use client';

import { useEffect, useRef } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onDone: () => void;
}

export default function Toast({ message, type = 'success', onDone }: ToastProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Fade in
    const t1 = setTimeout(() => el.classList.add('active'), 10);
    // Fade out
    const t2 = setTimeout(() => {
      el.classList.remove('active');
      setTimeout(onDone, 400);
    }, 3200);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  const icon =
    type === 'success'
      ? '✓'
      : type === 'error'
        ? '✕'
        : 'ℹ';

  return (
    <div ref={ref} className={`toast-notification toast-${type}`} role="status" aria-live="polite">
      <span className="toast-icon">{icon}</span>
      <span className="toast-message">{message}</span>
    </div>
  );
}
