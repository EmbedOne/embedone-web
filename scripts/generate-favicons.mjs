// Generates public/icon.svg, public/favicon.ico, and PNG icon variants for EmbedOne IDE.
// Run with: node scripts/generate-favicons.mjs
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b0f19" />
      <stop offset="50%" stop-color="#101726" />
      <stop offset="100%" stop-color="#080c14" />
    </linearGradient>
    <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00e5ff" stop-opacity="0.7" />
      <stop offset="45%" stop-color="#007acc" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#00d4ff" stop-opacity="0.5" />
    </linearGradient>
    <linearGradient id="chipGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#162236" />
      <stop offset="100%" stop-color="#0d1522" />
    </linearGradient>
    <linearGradient id="pinGradV" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#00e5ff" />
      <stop offset="100%" stop-color="#007acc" />
    </linearGradient>
    <linearGradient id="pinGradH" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00e5ff" />
      <stop offset="100%" stop-color="#007acc" />
    </linearGradient>
    <linearGradient id="glyphGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="45%" stop-color="#00d4ff" />
      <stop offset="100%" stop-color="#007acc" />
    </linearGradient>
    <filter id="coreGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="#00d4ff" flood-opacity="0.45" />
    </filter>
  </defs>

  <!-- Background squircle -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)" />
  <rect x="6" y="6" width="500" height="500" rx="106" fill="none" stroke="url(#rimGrad)" stroke-width="4" />

  <!-- MCU Chip Connector Pins -->
  <!-- Top Pins -->
  <rect x="180" y="64" width="22" height="46" rx="6" fill="url(#pinGradV)" />
  <rect x="245" y="64" width="22" height="46" rx="6" fill="url(#pinGradV)" />
  <rect x="310" y="64" width="22" height="46" rx="6" fill="url(#pinGradV)" />

  <!-- Bottom Pins -->
  <rect x="180" y="402" width="22" height="46" rx="6" fill="url(#pinGradV)" />
  <rect x="245" y="402" width="22" height="46" rx="6" fill="url(#pinGradV)" />
  <rect x="310" y="402" width="22" height="46" rx="6" fill="url(#pinGradV)" />

  <!-- Left Pins -->
  <rect x="64" y="180" width="46" height="22" rx="6" fill="url(#pinGradH)" />
  <rect x="64" y="245" width="46" height="22" rx="6" fill="url(#pinGradH)" />
  <rect x="64" y="310" width="46" height="22" rx="6" fill="url(#pinGradH)" />

  <!-- Right Pins -->
  <rect x="402" y="180" width="46" height="22" rx="6" fill="url(#pinGradH)" />
  <rect x="402" y="245" width="46" height="22" rx="6" fill="url(#pinGradH)" />
  <rect x="402" y="310" width="46" height="22" rx="6" fill="url(#pinGradH)" />

  <!-- Chip Body -->
  <rect x="104" y="104" width="304" height="304" rx="36" fill="url(#chipGrad)" stroke="#1e2f47" stroke-width="6" />

  <!-- Pin 1 Marker -->
  <circle cx="138" cy="138" r="8" fill="#00e5ff" opacity="0.85" />

  <!-- Monogram: Unified E + 1 + Circuit Nodes -->
  <g filter="url(#coreGlow)">
    <!-- "1" Angled Top Serif -->
    <path d="M166 218 L196 174 L196 218 Z" fill="url(#glyphGrad)" />

    <!-- "1" and "E" Spine -->
    <rect x="194" y="174" width="36" height="164" rx="5" fill="url(#glyphGrad)" />

    <!-- "E" Top Bar & Pad -->
    <rect x="224" y="174" width="102" height="34" rx="5" fill="url(#glyphGrad)" />
    <circle cx="334" cy="191" r="14" fill="#38bdf8" />
    <circle cx="334" cy="191" r="6" fill="#0b0f19" />

    <!-- "E" Center Bar & Circuit Node -->
    <rect x="224" y="239" width="72" height="34" rx="5" fill="url(#glyphGrad)" />
    <circle cx="304" cy="256" r="17" fill="#00e5ff" />
    <circle cx="304" cy="256" r="7.5" fill="#ffffff" />

    <!-- "E" Bottom Bar & Pad -->
    <rect x="224" y="304" width="102" height="34" rx="5" fill="url(#glyphGrad)" />
    <circle cx="334" cy="321" r="14" fill="#007acc" />
    <circle cx="334" cy="321" r="6" fill="#0b0f19" />
  </g>
</svg>`

writeFileSync(resolve(root, 'public', 'icon.svg'), svgContent)
console.log('Updated public/icon.svg')
