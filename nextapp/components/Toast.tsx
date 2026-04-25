'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onDone: () => void;
}

export default function Toast({ message, type = 'success', onDone }: ToastProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setActive(true), 50);
    const hideTimer = setTimeout(() => setActive(false), 3000);
    const doneTimer = setTimeout(onDone, 3400);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        );
      case 'error':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        );
    }
  };

  return (
    <div className={`toast-notification ${active ? 'active' : ''} toast-${type}`} role="status" aria-live="polite">
      <div className="toast-icon-bg">
        {getIcon()}
      </div>
      <div className="toast-content">
        <span className="toast-message">{message}</span>
      </div>
      <div className="toast-progress">
        <div className="toast-progress-bar" />
      </div>
    </div>
  );
}

