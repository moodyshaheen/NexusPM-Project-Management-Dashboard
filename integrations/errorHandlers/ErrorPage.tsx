import { useRouteError } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { ErrorOverlay } from '../../vite-error-overlay-plugin';

export default function ErrorPage() {
  const ref = useRef<HTMLDivElement>(null);
  const error = useRouteError() as Error;

  useEffect(() => {
    if (ref.current) {
      const OverlayEl = window.customElements.get('vite-error-overlay');
      if (OverlayEl) ref.current.appendChild(new OverlayEl(error, 'runtime'));
    }
  }, [error]);

  return <div ref={ref} />;
}
