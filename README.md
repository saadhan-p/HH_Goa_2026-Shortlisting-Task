# HH Goa 2026 — Builder Identity Card & PFP Generator

A fast, mobile-first, client-side web tool designed for the **Hacker House Goa 2026** shortlisting challenge. 

Users upload their profile photo, configure their stack and role details, and instantly generate a themed digital **Builder ID Card** or **PFP Frame**.

---

## Overview

The Hacker House Goa 2026 builder experience is built around speed, minimal friction, and a striking raw-terminal cyber-tropical aesthetic (Forest Green `#021a10`, Canary Yellow `#f3e03b`, and Neon Magenta `#ff007f`). 

To align with the challenge goals, the app features:
1. **Zero Database/Auth Overhead**: 100% serverless, local browser execution.
2. **Instant Visual Compilation**: Leverages HTML5 Canvas rendering for responsive, high-resolution graphic outputs.
3. **Optimized Sharing Flow**: Leverages the native Web Share API to attach generated image binaries on mobile devices, with a seamless Twitter Intent fallback.

---

## Features

- **Format Selection**: 
  - **Mode A (Builder ID Card)**: Professional 4:5 aspect ratio (1200 x 1500 px) social-media-ready ID badge complete with system coordinates, barcodes, scanlines, and terminal headers.
  - **Mode B (PFP Frame)**: Square layout (1080 x 1080 px) overlaying brand headers, footer dates, and glowing corner brackets around profile images.
- **In-Browser HEIC/HEIF Support**: Direct iOS photo uploads are converted to JPEG seamlessly without needing manual file conversion.
- **Micro-Adjustment Controllers**: Touch-friendly sliders for interactive Zoom (100% to 300%) and Horizontal/Vertical positioning offsets to center faces perfectly.
- **Deterministic Title Generator**: Locally outputs hacker-themed classes (e.g. `THE SIGNAL HUNTER`, `INTERFACE SHAPER`, `API ARCHITECT`) based on selected developer stacks.
- **Graceful Sharing Mechanism**: Native image file attachment on support-enabled mobile platforms and pre-filled composition links using the mandatory `#FrameInGoa` hashtag.

---

## Tech Stack

- **Core**: Next.js 16 (App Router), React, TypeScript
- **Styling**: Tailwind CSS v4, Vanilla CSS
- **Graphics**: HTML5 Canvas API
- **File Parsing**: `heic2any` (dynamically imported for size optimization)
- **Icons**: `lucide-react`
- **Deployments**: Fully compatible with Vercel Static Exports and Node runtimes.

---

## Architecture & Data Flow

```
User Selects Photo (PNG/JPG/HEIC)
       │
       ▼
   HEIC Check ────────► [HEIC to JPEG Converter (heic2any)]
       │
       ▼
 Loaded in memory (HTMLImageElement)
       │
       ▼
 React State (Zoom, X/Y offsets, Stack, Name, Role)
       │
       ▼
 HTML5 Canvas Draw ───► High-Resolution Output (Blob/PNG)
       │
       ├─────────────────────────┐
       ▼                         ▼
 [1-Click Download]        [Share to X]
 (Trigger browser download)  ├── Mobile: Web Share API (File binary + Text)
                             └── Desktop: Download + Twitter Intent
```

---

## Image Processing

All photo operations occur on the browser side. The canvas drawing engine (`lib/canvasRenderer.ts`) calculates high-resolution coordinate crops dynamically:
- **Intelligent Crop Cover**: Preserves original image aspect ratio while adjusting sizing limits.
- **Safe Crop Boundaries**: Offsets are mathematically clamped to prevent cropping beyond the uploaded image edges, avoiding empty transparent space inside borders.
- **Dynamic Text Fitting**: Builder names and technology roles are calculated against canvas pixel boundaries and dynamically scaled down to prevent card boundary escapes.

---

## HEIC Support

To accommodate iPhone uploads, `lib/heic.ts` dynamically imports `heic2any` on the client thread. High-resolution HEIC binaries are converted into JPEG blobs, wrapped into a standard JavaScript `File` object, and passed directly into the image compiler state.

---

## X Sharing

The Web Share API is prioritized on mobile devices:
- **Native Sheet**: When sharing via the mobile action sheet, the generated PNG is attached as a binary file alongside the caption.
- **Desktop/Fallback Intent**: If native file sharing is unavailable, the app automatically downloads the high-res file to the user's local disk and opens a new tab directed to the X Compose intent containing:
  ```
  I just unlocked my HH Goa 2026 builder identity ⚡
  NAME: <Name>
  CLASS: <Builder Class>
  STACK: <Stack>

  Ready to build, break, and ship in Goa.

  #FrameInGoa #HHGoa @247pmstudio
  ```
  *(Note: Web browsers cannot programmatically attach local files to outbound external URL links due to security boundaries, so downloading + linking is the standard fallback).*

---

## Getting Started

### Installation

Clone the workspace and install standard node packages:
```bash
npm install
```

### Running Locally

Launch the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to inspect the app.

### Production Build

Verify production compiling and HTML outputs:
```bash
npm run build
```
To run the static outputs locally:
```bash
npm start
```

---

## Deployment (Vercel)

Deploying to Vercel is streamlined. Since the project contains no backend DB or server-side API demands, you can configure it as a standard static project:

1. Push code to your Git repository (GitHub / GitLab).
2. Connect the repository to your Vercel Dashboard.
3. Configure the build command as `npm run build` and output folder as `.next` or standard.
4. Click **Deploy**.

---

## Browser Support

- **Desktop**: Chrome (v80+), Safari (v14+), Edge (v80+), Firefox (v90+)
- **Mobile**: Safari on iOS 14.5+, Chrome on Android 9.0+
- **Notes**: Web Share API file attachment is natively supported on iOS Safari and Android Chrome.

---

## Known Limitations

- **X Intent Attachments**: Web intents cannot pre-populate image attachments from local URLs. Desktop users will find the image downloaded to their device automatically and the compose box open, requiring them to simply click the "Add Media" button on X and select the downloaded file.
- **HEIC Dynamic Load**: The first conversion of a HEIC photo on low-powered mobile devices may take 1-2 seconds as the WebAssembly module loads. A clear loading indicator is provided.
