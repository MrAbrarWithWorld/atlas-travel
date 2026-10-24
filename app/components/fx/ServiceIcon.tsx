import styles from '../../business.module.css';
import type { ServiceIconId } from '../../lib/services';

// One line-icon family for the seven services: 32px grid, 1.6 stroke, round joins.
// Stroked parts draw themselves in when their card is revealed; the accent is the "signal".
const D = styles.svgDraw;
const A = styles.svgAcc;

function Paths({ id }: { id: ServiceIconId }) {
  switch (id) {
    case 'lead-capture':
      return (
        <>
          <path className={D} pathLength={1} d="M13.5 7.2h-3.4a2 2 0 0 0-1.9 1.4L5 18v5a2.5 2.5 0 0 0 2.5 2.5h17A2.5 2.5 0 0 0 27 23v-5l-3.2-9.4a2 2 0 0 0-1.9-1.4h-3.4" />
          <path className={D} pathLength={1} d="M5 18h6l1.8 3h6.4l1.8-3h6" />
          <path className={D} pathLength={1} d="M16 3v10.5M12.6 10.2 16 13.6l3.4-3.4" />
          <circle className={A} cx="25.5" cy="4.6" r="1.9" />
        </>
      );
    case 'follow-ups':
      return (
        <>
          <rect className={D} pathLength={1} x="3" y="10" width="19" height="14" rx="2.5" />
          <path className={D} pathLength={1} d="m3.8 11.4 8.7 6.6 8.7-6.6" />
          <path className={D} pathLength={1} d="M16 10V7.5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 2 2V15" />
          <path className={A} d="m24.8 12.6 2.7 2.7 2.7-2.7" fill="none" />
        </>
      );
    case 'client-intake':
      return (
        <>
          <rect className={D} pathLength={1} x="4" y="5" width="24" height="22" rx="2.5" />
          <path className={D} pathLength={1} d="M4 10h24M8.5 14.5h9M8.5 18.5h13.5" />
          <rect className={D} pathLength={1} x="8.5" y="21.6" width="3.4" height="3.4" rx=".8" />
          <path className={A} d="m18.6 23 1.7 1.7 3.2-3.3" fill="none" />
        </>
      );
    case 'reports':
      return (
        <>
          <rect className={D} pathLength={1} x="4" y="5" width="24" height="22" rx="2.5" />
          <path className={D} pathLength={1} d="M10 23v-4.5M15 23v-7M20 23v-5.5M25 23v-8.5" />
          <path className={D} pathLength={1} d="m8.5 13.5 5-3.2 4 2 5.5-4" />
          <circle className={A} cx="23" cy="8.3" r="1.7" />
        </>
      );
    case 'process':
      return (
        <>
          <circle className={D} pathLength={1} cx="8" cy="9" r="3.2" />
          <circle className={D} pathLength={1} cx="24" cy="9" r="3.2" />
          <circle className={D} pathLength={1} cx="16" cy="24" r="3.2" />
          <path className={D} pathLength={1} d="M11.4 9h9.2M22.4 11.9l-4.8 9.2M14.4 21.1 9.6 11.9" />
          <circle className={A} cx="16" cy="9" r="1.6" />
        </>
      );
    case 'ai':
      return (
        <>
          <path className={D} pathLength={1} d="M13.5 5c.9 6 3.4 8.5 9.4 9.4-6 .9-8.5 3.4-9.4 9.4-.9-6-3.4-8.5-9.4-9.4 6-.9 8.5-3.4 9.4-9.4Z" />
          <circle className={D} pathLength={1} cx="25" cy="6.5" r="1.7" />
          <path className={A} d="M25 20c.3 2.1 1.1 2.9 3.2 3.2-2.1.3-2.9 1.1-3.2 3.2-.3-2.1-1.1-2.9-3.2-3.2 2.1-.3 2.9-1.1 3.2-3.2Z" />
        </>
      );
    case 'assistant':
      return (
        <>
          <path className={D} pathLength={1} d="M4 6.5A2.5 2.5 0 0 1 6.5 4h13A2.5 2.5 0 0 1 22 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 3.6V16A2.5 2.5 0 0 1 4 13.5Z" />
          <path className={D} pathLength={1} d="M13 6.8c.3 1.7 1 2.4 2.7 2.7-1.7.3-2.4 1-2.7 2.7-.3-1.7-1-2.4-2.7-2.7 1.7-.3 2.4-1 2.7-2.7Z" />
          <rect className={D} pathLength={1} x="16" y="19" width="12" height="9" rx="1.8" />
          <path className={D} pathLength={1} d="M16 23.5h12M19 21.2h3M19 25.8h3" />
          <circle className={A} cx="25" cy="21.2" r="1.1" />
        </>
      );
    case 'digital-base':
      return (
        <>
          <path className={D} pathLength={1} d="M16 4 28 10.5 16 17 4 10.5Z" />
          <path className={D} pathLength={1} d="m4 16 12 6.5L28 16" />
          <path className={D} pathLength={1} d="m4 21.5 12 6.5 12-6.5" />
          <circle className={A} cx="16" cy="10.5" r="1.6" />
        </>
      );
  }
}

export default function ServiceIcon({ id, size = 28 }: { id: ServiceIconId; size?: number }) {
  return (
    <svg
      className={styles.svgIcon}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <Paths id={id} />
    </svg>
  );
}
