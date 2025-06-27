'use client';
import { useEffect, useRef } from 'react';

type Props = {
  reportId: string;
  pageId?: string;               // tab di Looker
  filters?: Record<string, string>;
  height?: number;
};

export default function LookerEmbedFrame({
  reportId,
  pageId = 'p',
  filters = {},
  height = 600,
}: Props) {
  const ref = useRef<HTMLIFrameElement>(null);
  const qs  = new URLSearchParams(filters).toString();
  const src = `https://lookerstudio.google.com/embed/reporting/${reportId}/page/${pageId}?${qs}`;

  // Propaga tema chiaro/scuro al report
  useEffect(() => {
    const theme = document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light';
    ref.current?.contentWindow?.postMessage({ event: 'theme', theme }, '*');
  }, []);

  return (
    <iframe
      ref={ref}
      src={src}
      allowFullScreen
      className="w-full rounded-lg border"
      style={{ height }}
    />
  );
}
