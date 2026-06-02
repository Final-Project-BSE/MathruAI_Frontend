'use client';

import React, { useEffect, useMemo, useState } from 'react';

interface ProtectedImageProps {
  src?: string | null;
  token: string;
  alt?: string;
  className?: string;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
}

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8081').replace(/\/$/, '');

const resolveImageUrl = (path?: string | null) => {
  if (!path) return '';

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

const ProtectedImage = ({
  src,
  token,
  alt = 'Protected image',
  className = '',
  fallback = null,
  loadingFallback = null,
}: ProtectedImageProps) => {
  const [blobUrl, setBlobUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const resolvedSrc = useMemo(() => resolveImageUrl(src), [src]);

  useEffect(() => {
    let active = true;
    let nextBlobUrl: string | null = null;

    const loadImage = async () => {
      if (!resolvedSrc || !token) {
        if (active) {
          setBlobUrl('');
          setFailed(false);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setFailed(false);

      try {
        const response = await fetch(resolvedSrc, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // Avoid throwing here to prevent noisy error stacks in the console.
          console.warn(`ProtectedImage: failed to load ${resolvedSrc} - ${response.status} ${response.statusText}`);
          if (active) {
            setBlobUrl('');
            setFailed(true);
          }
          return;
        }

        const blob = await response.blob();
        nextBlobUrl = URL.createObjectURL(blob);

        if (active) {
          setBlobUrl(nextBlobUrl);
        }
      } catch (error) {
        console.error('Protected image load failed:', error);

        if (active) {
          setBlobUrl('');
          setFailed(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      active = false;
      if (nextBlobUrl) {
        URL.revokeObjectURL(nextBlobUrl);
      }
    };
  }, [resolvedSrc, token]);

  if (loading) {
    return <>{loadingFallback}</>;
  }

  if (!blobUrl || failed) {
    return <>{fallback}</>;
  }

  return <img src={blobUrl} alt={alt} className={className} />;
};

export default ProtectedImage;