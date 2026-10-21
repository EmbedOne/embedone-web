import { ImageResponse } from 'next/og'

export const alt = 'EmbedOne IDE — One IDE for Every Embedded Workflow'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #141416 0%, #1e1e24 50%, #0c1824 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          border: '1px solid #333333',
          boxSizing: 'border-box',
        }}
      >
        {/* Top bar with dots & badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#ff5f56' }} />
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#ffbd2e' }} />
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#27c93f' }} />
            <span style={{ marginLeft: '16px', color: '#888888', fontSize: '20px', letterSpacing: '1px' }}>
              embedone.dev
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              borderRadius: '999px',
              background: 'rgba(34, 211, 238, 0.12)',
              border: '1px solid rgba(34, 211, 238, 0.4)',
              color: '#22d3ee',
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22d3ee' }} />
            Rust-powered · MCU + MPU
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1000px' }}>
          <div
            style={{
              fontSize: '56px',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-1.5px',
              color: '#ffffff',
            }}
          >
            One IDE for every embedded workflow.
          </div>
          <div
            style={{
              fontSize: '24px',
              lineHeight: 1.4,
              color: '#a0a0a0',
              maxWidth: '850px',
            }}
          >
            Build, flash, debug, and monitor firmware across MCU and MPU platforms from a single, vendor-neutral environment.
          </div>
        </div>

        {/* Bottom bar with tool tags & platform info */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '30px',
            borderTop: '1px solid #2b2b2b',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {['STM32', 'NXP i.MX', 'Raspberry Pi', 'ESP32', 'GDB', 'OpenOCD'].map((name) => (
              <span
                key={name}
                style={{
                  background: '#252526',
                  border: '1px solid #3c3c3c',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '15px',
                  color: '#cccccc',
                }}
              >
                {name}
              </span>
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#007acc',
              color: '#ffffff',
              padding: '10px 22px',
              borderRadius: '6px',
              fontSize: '17px',
              fontWeight: 600,
            }}
          >
            Available for Linux & Windows
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
