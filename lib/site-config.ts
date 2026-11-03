export const SITE_CONFIG = {
  name: 'EmbedOne IDE',
  shortName: 'EmbedOne',
  description:
    'A unified, vendor-neutral IDE for MCU and MPU firmware development. Build, flash, debug with GDB, and monitor serial output across STM32, NXP, ESP32, and Raspberry Pi from one environment.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://embedone.dev',
  ogImage: '/og-image.png',
  keywords: [
    'EmbedOne',
    'EmbedOne IDE',
    'Embedded IDE',
    'MCU development',
    'MPU development',
    'firmware development',
    'STM32 IDE',
    'ESP32 IDE',
    'NXP i.MX',
    'Raspberry Pi Pico',
    'Rust embedded',
    'GDB debugger',
    'OpenOCD',
    'bare-metal firmware',
    'embedded Linux',
    'hardware bring-up',
    'serial monitor',
    'toolchain manager',
    'vendor-neutral IDE',
    'C and C++ embedded development',
  ],
  authors: [
    {
      name: 'EmbedOne Team',
      url: 'https://embedone.dev',
    },
  ],
  creator: 'EmbedOne Team',
  twitterHandle: '@embedone',
} as const

export const RELEASES_URL = "https://github.com/EmbedOne/embedone-web/releases"
export const RELEASE_NOTES_URL = `${RELEASES_URL}/tag/v1.0.0`

export const DOWNLOADS = {
  // An empty url renders the button as "Coming soon". Paste a release asset URL to enable it.
  linux: { label: "Download for Linux", url: "", version: "", fileType: ".deb / .AppImage" },
  windows: {
    label: "Download for Windows",
    url: `${RELEASES_URL}/download/v1.0.0/EmbedOne-1.0.0-Setup-x64.exe`,
    version: "1.0.0",
    fileType: ".exe installer",
  },
} as const

export const CONTACT_URL = "#"
