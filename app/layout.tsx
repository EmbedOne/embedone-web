import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EmbedOne IDE — One IDE for every embedded workflow',
  description: 'A unified, vendor-neutral development environment for MCU and MPU development.',
  openGraph: { title: 'EmbedOne IDE', description: 'Build, flash, debug, and monitor firmware from one environment.', type: 'website' },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
