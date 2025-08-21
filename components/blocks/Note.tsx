import { ReactNode } from 'react';

interface NoteProps {
  children: ReactNode;
  type?: 'default' | 'tip' | 'warning' | 'info';
  title?: string;
  className?: string;
}

const noteStyles = {
  default: {
    bg: 'bg-gradient-to-br from-sepia/50 to-sepia-dark/50',
    border: 'border-border/50',
    iconBg: 'bg-gradient-to-br from-sage-400 to-sage-600',
    icon: (
      <svg
        className="w-5 h-5 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
      </svg>
    ),
  },
  tip: {
    bg: 'bg-gradient-to-br from-sage-50 to-sage-100',
    border: 'border-sage-200',
    iconBg: 'bg-gradient-to-br from-sage-400 to-sage-600',
    icon: (
      <svg
        className="w-5 h-5 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  warning: {
    bg: 'bg-gradient-to-br from-coral-50 to-coral-100',
    border: 'border-coral-200',
    iconBg: 'bg-gradient-to-br from-coral-400 to-coral-600',
    icon: (
      <svg
        className="w-5 h-5 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  info: {
    bg: 'bg-gradient-to-br from-lavender-50 to-lavender-100',
    border: 'border-lavender-200',
    iconBg: 'bg-gradient-to-br from-lavender-400 to-lavender-600',
    icon: (
      <svg
        className="w-5 h-5 text-white"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
};

export default function Note({
  children,
  type = 'default',
  title,
  className = '',
}: NoteProps) {
  const styles = noteStyles[type];

  return (
    <aside
      className={`my-8 rounded-2xl border ${styles.bg} ${styles.border} ${className} shadow-sm backdrop-blur-sm overflow-hidden`}
    >
      <div className="p-6">
        {(title || styles.icon) && (
          <div className="flex items-center gap-3 mb-4">
            {styles.icon && (
              <div
                className={`w-10 h-10 ${styles.iconBg} rounded-full flex items-center justify-center shadow-sm`}
              >
                {styles.icon}
              </div>
            )}
            {title && <h4 className="font-bold text-ink text-lg">{title}</h4>}
          </div>
        )}

        <div className="prose prose-sm font-reading text-ink-light leading-relaxed">
          {children}
        </div>
      </div>
    </aside>
  );
}
