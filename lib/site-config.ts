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

export const DOWNLOADS = {
  // Paste the release URL into each url field to enable installers.
  linux: { label: "Download for Linux", url: "", version: "", fileType: ".deb / .AppImage" },
  windows: { label: "Download for Windows", url: "", version: "", fileType: ".exe installer" },
} as const

export const CONTACT_URL = "#"
