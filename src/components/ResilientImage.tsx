import { useState } from 'react';
import { Droplets } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  fallbackLabel?: string;
  className?: string;
}

export function ResilientImage({
  src,
  alt,
  fallbackLabel,
  className = '',
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-stone-200/70 text-stone-500 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Droplets className="w-7 h-7 mb-2 stroke-[1.5]" aria-hidden="true" />
        <span className="text-xs font-medium tracking-wide text-stone-600">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
