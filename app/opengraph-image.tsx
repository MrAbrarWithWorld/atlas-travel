import { ImageResponse } from 'next/og';

export const alt = 'Atlas AI Technology: every lead answered in seconds';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'linear-gradient(135deg, #0a0c0d 0%, #15191a 60%, #2a2110 100%)',
          color: '#f1eee7',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 30, fontWeight: 700, color: '#e6b854' }}>
          ATLAS AI TECHNOLOGY
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            Every lead answered in seconds.
          </div>
          <div style={{ fontSize: 34, color: '#aaa79f' }}>
            Missed-call text-back · instant replies · follow-ups you approve
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 28, color: '#f1eee7' }}>
          <span>Free missed-lead audit · from $29/month</span>
          <span style={{ color: '#e6b854' }}>getatlas.ca</span>
        </div>
      </div>
    ),
    size,
  );
}
