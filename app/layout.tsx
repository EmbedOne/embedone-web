import type { Metadata, Viewport } from 'next'
import { SITE_CONFIG } from '@/lib/site-config'
import './globals.css'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#1e1e1e' },
    { media: '(prefers-color-scheme: light)', color: '#1e1e1e' },
  ],
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: 'EmbedOne IDE — One IDE for Every Embedded Workflow',
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  applicationName: SITE_CONFIG.name,
  authors: [...SITE_CONFIG.authors],
  generator: 'Next.js',
  keywords: [...SITE_CONFIG.keywords],
  referrer: 'origin-when-cross-origin',
  creator: SITE_CONFIG.creator,
  publisher: SITE_CONFIG.creator,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: 'EmbedOne IDE — One IDE for Every Embedded Workflow',
    description: SITE_CONFIG.description,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EmbedOne IDE — Unified MCU and MPU Development Environment',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EmbedOne IDE — One IDE for Every Embedded Workflow',
    description: SITE_CONFIG.description,
    site: SITE_CONFIG.twitterHandle,
    creator: SITE_CONFIG.twitterHandle,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-dark-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
  category: 'technology',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': `${SITE_CONFIG.url}/#software`,
      name: 'EmbedOne IDE',
      alternateName: ['EmbedOne', 'EmbedOne Workbench'],
      operatingSystem: ['Linux', 'Windows'],
      applicationCategory: 'DeveloperApplication',
      softwareVersion: '0.8.4',
      description: SITE_CONFIG.description,
      url: SITE_CONFIG.url,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      featureList: [
        'Unified MCU & MPU development workflow',
        'Single loop for build, flash, debug, and serial monitoring',
        '33+ preconfigured board profiles (STM32, NXP i.MX, Raspberry Pi, Espressif)',
        'Built-in doctor toolchain dependency manager',
        'Integrated serial console with microsecond timestamps',
        'Live GDB debugging with breakpoints, call stacks, and peripheral inspection',
        'High-performance Rust-powered workbench core',
        'Extensible plugin architecture for custom boards and toolchains',
      ],
      screenshot: `${SITE_CONFIG.url}/og-image.png`,
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_CONFIG.url}/#organization`,
      name: 'EmbedOne',
      url: SITE_CONFIG.url,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/icon.svg`,
        width: '512',
        height: '512',
      },
      sameAs: [
        'https://github.com/embedone',
        'https://twitter.com/embedone',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_CONFIG.url}/#website`,
      url: SITE_CONFIG.url,
      name: 'EmbedOne IDE',
      description: SITE_CONFIG.description,
      publisher: {
        '@id': `${SITE_CONFIG.url}/#organization`,
      },
      inLanguage: 'en-US',
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
