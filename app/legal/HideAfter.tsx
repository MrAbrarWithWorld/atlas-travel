'use client';

// Shows its children until a moment in time, then hides them in the browser.
// Used for the "These terms take effect on …" note, so it disappears on the day
// without waiting for the next deploy (a redeploy also removes it from the HTML).
import { useEffect, useState, type ReactNode } from 'react';

export default function HideAfter({ until, children }: { until: number; children: ReactNode }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    if (Date.now() >= until) {
      setShow(false);
      return;
    }
    const wait = until - Date.now();
    if (wait > 2_147_000_000) return; // longer than setTimeout allows; the next page load decides
    const t = setTimeout(() => setShow(false), wait);
    return () => clearTimeout(t);
  }, [until]);
  return show ? <>{children}</> : null;
}
