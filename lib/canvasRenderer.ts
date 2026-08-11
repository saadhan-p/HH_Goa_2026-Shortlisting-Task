import { BuilderState } from '../types/builder';

/**
 * Helper to dynamically scale font size to fit within a maximum width.
 */
function getFitFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  initialSize: number,
  fontSuffix: string
): string {
  let size = initialSize;
  ctx.font = `${size}px ${fontSuffix}`;
  while (ctx.measureText(text).width > maxWidth && size > 16) {
    size -= 2;
    ctx.font = `${size}px ${fontSuffix}`;
  }
  return `${size}px ${fontSuffix}`;
}

/**
 * Draws a grid pattern on the canvas for the hacker tech aesthetic.
 */
function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  gridSize: number,
  color: string
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  
  for (let x = gridSize; x < width; x += gridSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  
  for (let y = gridSize; y < height; y += gridSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  
  ctx.stroke();
}

/**
 * Draws tech corner brackets around a rect.
 */
function drawTechBrackets(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  length: number,
  thickness: number,
  color: string
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = thickness;
  ctx.beginPath();
  
  // Top-Left
  ctx.moveTo(x + length, y);
  ctx.lineTo(x, y);
  ctx.lineTo(x, y + length);
  
  // Top-Right
  ctx.moveTo(x + w - length, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + length);
  
  // Bottom-Left
  ctx.moveTo(x, y + h - length);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x + length, y + h);
  
  // Bottom-Right
  ctx.moveTo(x + w, y + h - length);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x + w - length, y + h);
  
  ctx.stroke();
}

/**
 * Draws a dummy barcode.
 */
function drawBarcode(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) {
  ctx.fillStyle = color;
  let currentX = x;
  const endX = x + w;
  
  while (currentX < endX) {
    const barWidth = Math.floor(Math.random() * 4) + 1; // 1 to 5px
    const gapWidth = Math.floor(Math.random() * 5) + 2; // 2 to 7px
    
    if (currentX + barWidth > endX) break;
    
    ctx.fillRect(currentX, y, barWidth, h);
    currentX += barWidth + gapWidth;
  }
}

/**
 * Draws a glowing vector palm tree silhouette on the canvas.
 */
function drawPalmTree(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  // Trunk (slightly curved for a natural beach look)
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-15, -60, -25, -120);
  ctx.quadraticCurveTo(-5, -120, 10, -60);
  ctx.lineTo(15, 0);
  ctx.closePath();
  ctx.fill();

  // Leaves
  const leaves = [
    { cx: -45, cy: -140, tx: -90, ty: -130 },
    { cx: -55, cy: -165, tx: -80, ty: -185 },
    { cx: -20, cy: -185, tx: -30, ty: -225 },
    { cx: 10, cy: -185, tx: 30, ty: -225 },
    { cx: 45, cy: -165, tx: 70, ty: -185 },
    { cx: 35, cy: -140, tx: 80, ty: -120 }
  ];

  leaves.forEach((l) => {
    ctx.beginPath();
    ctx.moveTo(-7, -120);
    ctx.quadraticCurveTo(l.cx, l.cy, l.tx, l.ty);
    ctx.quadraticCurveTo(l.cx + 10, l.cy + 10, -7, -120);
    ctx.fill();
  });

  ctx.restore();
}

/**
 * Draws neon cybernetic waves on the canvas.
 */
function drawWaves(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  color: string,
  lineWidth: number = 2
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  
  for (let sx = 0; sx <= w; sx += 5) {
    const sy = Math.sin(sx * 0.03) * 12 + Math.cos(sx * 0.015) * 6;
    if (sx === 0) {
      ctx.moveTo(x + sx, y + sy);
    } else {
      ctx.lineTo(x + sx, y + sy);
    }
  }
  ctx.stroke();
  ctx.restore();
}

/**
 * Draws a synthwave-styled sun with transparent horizontal slices.
 */
function drawSynthwaveSun(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  colorStart: string,
  colorEnd: string
) {
  ctx.save();
  const grad = ctx.createLinearGradient(cx, cy - r, cx, cy + r);
  grad.addColorStop(0, colorStart);
  grad.addColorStop(1, colorEnd);
  ctx.fillStyle = grad;

  // Draw the sun with horizontal slices
  const sliceHeight = 8;
  const gapHeight = 4;
  for (let y = cy - r; y < cy + r; y += sliceHeight + gapHeight) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    
    // Increase gap thickness towards the bottom of the sun
    const progress = (y - (cy - r)) / (r * 2);
    const customGap = Math.max(1, Math.floor(progress * gapHeight * 2.2));
    ctx.fillRect(cx - r, y, r * 2, sliceHeight + gapHeight - customGap);
  }
  ctx.restore();
}

/**
 * Draws the user image onto the canvas target rectangle applying cover fit, zoom and XY positioning offsets.
 */
function drawUserPhoto(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  zoom: number,
  positionX: number,
  positionY: number
) {
  // Save context state
  ctx.save();
  
  // Create clipping region for the image frame
  ctx.beginPath();
  ctx.rect(dx, dy, dw, dh);
  ctx.clip();
  
  if (img) {
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const imgRatio = iw / ih;
    const targetRatio = dw / dh;
    
    let sw, sh;
    // Base cover calculation
    if (imgRatio > targetRatio) {
      sh = ih;
      sw = sh * targetRatio;
    } else {
      sw = iw;
      sh = sw / targetRatio;
    }
    
    // Apply zoom
    sw = sw / zoom;
    sh = sh / zoom;
    
    // Clamping to avoid crop going out of bounds
    sw = Math.min(sw, iw);
    sh = Math.min(sh, ih);
    
    // Calculate default center position
    const cx = (iw - sw) / 2;
    const cy = (ih - sh) / 2;
    
    // Adjust centers by position offset percentages (-100 to 100)
    // Scale offset relative to remaining scroll space
    const maxOffsetX = (iw - sw) / 2;
    const maxOffsetY = (ih - sh) / 2;
    
    const offsetX = maxOffsetX > 0 ? (positionX / 100) * maxOffsetX : 0;
    const offsetY = maxOffsetY > 0 ? (positionY / 100) * maxOffsetY : 0;
    
    let sx = cx - offsetX;
    let sy = cy + offsetY;
    
    // Clamping crop coordinates strictly inside source image limits
    sx = Math.max(0, Math.min(sx, iw - sw));
    sy = Math.max(0, Math.min(sy, ih - sh));
    
    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    
    // Subtle grid scanline overlays on photo
    ctx.fillStyle = 'rgba(2, 26, 16, 0.12)';
    ctx.fillRect(dx, dy, dw, dh);
    
    // Modern tech target overlays inside photo
    drawTechBrackets(ctx, dx + 20, dy + 20, dw - 40, dh - 40, 15, 1, 'rgba(243, 224, 59, 0.25)');
    
    // Tech crosshair center marks
    ctx.strokeStyle = 'rgba(255, 0, 127, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    // Center point (dx + dw/2, dy + dh/2)
    const midX = dx + dw / 2;
    const midY = dy + dh / 2;
    ctx.moveTo(midX - 15, midY); ctx.lineTo(midX + 15, midY);
    ctx.moveTo(midX, midY - 15); ctx.lineTo(midX, midY + 15);
    ctx.stroke();

    // Cyber-ocean horizon wave overlay at the bottom of the photo viewport
    drawWaves(ctx, dx, dy + dh - 10, dw, '#ff007f', 1.5);
    drawWaves(ctx, dx, dy + dh - 18, dw, 'rgba(0, 229, 255, 0.5)', 1);

  } else {
    // Placeholder when no photo is uploaded
    ctx.fillStyle = '#01120b';
    ctx.fillRect(dx, dy, dw, dh);
    
    // Draw grid in placeholder
    drawGrid(ctx, dw, dh, 30, 'rgba(5, 46, 28, 0.4)');
    
    // Tech prompt
    ctx.fillStyle = '#f3e03b';
    ctx.font = '24px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('NO_IMAGE_SOURCE', dx + dw / 2, dy + dh / 2 - 20);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '16px "Space Mono", monospace';
    ctx.fillText('UPLOAD PHOTOGRAPH TO COMPILE', dx + dw / 2, dy + dh / 2 + 15);
  }
  
  ctx.restore();
}

/**
 * High-Resolution HTML5 Canvas Builder Card Renderer (1200 x 1500 px)
 */
export async function renderBuilderCard(
  canvas: HTMLCanvasElement,
  state: BuilderState,
  userImage: HTMLImageElement | null
): Promise<void> {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Wait for Google Fonts to load
  if (typeof document !== 'undefined') {
    await document.fonts.ready;
  }

  const w = 1200;
  const h = 1500;
  
  canvas.width = w;
  canvas.height = h;

  // 1. Draw premium radial gradient background (rich dark emerald to deep void)
  const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 200, w / 2, h / 2, h);
  bgGrad.addColorStop(0, '#042818');
  bgGrad.addColorStop(0.6, '#01130c');
  bgGrad.addColorStop(1, '#000704');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // 2. Draw grid overlay
  drawGrid(ctx, w, h, 60, '#032114');

  // 3. Draw Cyber-Tropical Background Assets (behind photo/text panels)
  // Glowing Sunset Sun in the upper-right corner
  drawSynthwaveSun(ctx, w - 160, 240, 110, '#ff007f', '#f3e03b');

  // Neon Waves running behind bottom panels
  drawWaves(ctx, 150, 850, 900, 'rgba(0, 229, 255, 0.2)', 2);
  drawWaves(ctx, 150, 862, 900, 'rgba(255, 0, 127, 0.2)', 1.5);

  // Palm tree watermarks in the background
  drawPalmTree(ctx, 85, 1280, 0.85, 'rgba(255, 0, 127, 0.08)');
  drawPalmTree(ctx, w - 125, 1370, 0.7, 'rgba(243, 224, 59, 0.08)');
  
  // 4. Draw coordinate markings / tech points
  ctx.fillStyle = '#ff007f';
  ctx.font = '11px "Space Mono", monospace';
  ctx.textAlign = 'left';
  
  const points = [
    { x: 60, y: 60, lbl: 'LOC: 15.2993° N' },
    { x: w - 180, y: 60, lbl: 'SYS_BOOT: OK' },
    { x: 60, y: h - 50, lbl: 'GRID_COORDS // P-01' },
    { x: w - 180, y: h - 50, lbl: 'HACKER_RESIDENCY' }
  ];
  
  points.forEach(p => {
    ctx.fillText(p.lbl, p.x, p.y);
    ctx.fillStyle = '#f3e03b';
    ctx.fillText('+', p.x - 15, p.y);
    ctx.fillStyle = '#ff007f';
  });

  // 5. Double borders
  ctx.strokeStyle = 'rgba(243, 224, 59, 0.15)';
  ctx.lineWidth = 1;
  ctx.strokeRect(40, 40, w - 80, h - 80);
  
  ctx.strokeStyle = '#053d24';
  ctx.lineWidth = 2;
  ctx.strokeRect(50, 50, w - 100, h - 100);

  // Brackets on outer card corners
  drawTechBrackets(ctx, 40, 40, w - 80, h - 80, 30, 4, '#f3e03b');

  // 6. Header Layout
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px "Space Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('HH GOA 2026', 90, 115);
  
  ctx.fillStyle = '#ff007f';
  ctx.font = '20px "Space Mono", monospace';
  ctx.fillText('// BUILDER_PASS_ID', 340, 115);

  // System Status Box
  ctx.strokeStyle = '#f3e03b';
  ctx.lineWidth = 1;
  ctx.strokeRect(w - 380, 85, 290, 40);
  ctx.fillStyle = 'rgba(243, 224, 59, 0.05)';
  ctx.fillRect(w - 380, 85, 290, 40);
  
  ctx.fillStyle = '#f3e03b';
  ctx.font = 'bold 15px "Space Mono", monospace';
  ctx.fillText('REG_ID: 247-HHG-' + (state.name ? state.name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X') : 'DEV') + '-2026', w - 365, 110);

  // 7. Profile Image Viewport
  const imgX = 150;
  const imgY = 180;
  const imgW = 900;
  const imgH = 660;

  // Viewport background
  ctx.fillStyle = 'rgba(1, 18, 11, 0.8)';
  ctx.fillRect(imgX, imgY, imgW, imgH);
  
  // Draw user image with zoom & position offsets
  drawUserPhoto(ctx, userImage, imgX, imgY, imgW, imgH, state.zoom, state.positionX, state.positionY);

  // Tech frame around photo
  ctx.strokeStyle = '#053d24';
  ctx.lineWidth = 3;
  ctx.strokeRect(imgX, imgY, imgW, imgH);
  
  // Coordinate subtext on photo
  ctx.fillStyle = '#ffffff';
  ctx.font = '12px "Space Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('VIEWPORT // PRIMARY_IMAGE_SOURCE', imgX + 15, imgY + 30);
  ctx.textAlign = 'right';
  ctx.fillText(`ZOOM: ${(state.zoom * 100).toFixed(0)}%  X: ${state.positionX}% Y: ${state.positionY}%`, imgX + imgW - 15, imgY + 30);

  drawTechBrackets(ctx, imgX - 5, imgY - 5, imgW + 10, imgH + 10, 20, 3, '#f3e03b');

  // 8. Terminal Details Section
  const termY = 890;
  ctx.fillStyle = '#ff007f';
  ctx.font = 'bold 24px "Space Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('$ ./builder_profile --init', imgX, termY);

  // Structured fields
  const startFieldY = termY + 55;
  const lineSpacing = 65;
  const fields = [
    { label: 'NAME', value: state.name || 'ANONYMOUS BUILDER' },
    { label: 'STACK', value: state.stack || 'STILL_DECIDING' },
    { label: 'ROLE', value: state.role || 'EXPERIMENTER' },
    { label: 'TEAM', value: state.builderTitle || 'STILL_SEARCHING', isAccent: true },
    { label: 'STATUS', value: 'READY_TO_BUILD' }
  ];

  // Draw elegant background panel for details
  ctx.strokeStyle = 'rgba(5, 61, 36, 0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(imgX - 10, termY + 15, imgW + 20, fields.length * lineSpacing - 10);
  ctx.fillStyle = 'rgba(1, 18, 11, 0.55)';
  ctx.fillRect(imgX - 10, termY + 15, imgW + 20, fields.length * lineSpacing - 10);

  fields.forEach((f, idx) => {
    const curY = startFieldY + idx * lineSpacing;
    
    // Draw horizontal split lines (except for the last one)
    if (idx < fields.length - 1) {
      ctx.strokeStyle = 'rgba(5, 61, 36, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(imgX, curY + 20);
      ctx.lineTo(imgX + imgW, curY + 20);
      ctx.stroke();
    }

    // Draw Label
    ctx.fillStyle = '#f3e03b';
    ctx.font = 'bold 22px "Space Mono", monospace';
    ctx.fillText(`${f.label.padEnd(10, ' ')}:`, imgX + 15, curY + 5);

    // Draw Value
    const valX = imgX + 195;
    const maxValW = imgW - 230;
    
    if (f.isAccent) {
      ctx.fillStyle = '#ff007f';
      ctx.font = getFitFontSize(ctx, f.value, maxValW, 26, '"Space Mono", monospace');
    } else if (f.label === 'STATUS') {
      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 22px "Space Mono", monospace';
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.font = getFitFontSize(ctx, f.value, maxValW, 22, '"Space Mono", monospace');
    }
    
    ctx.fillText(f.value.toUpperCase(), valX, curY + 5);
  });

  // Optional "WHAT I BUILD" field (renders smaller, bottom-left)
  const buildText = state.stack && state.role && state.name ? `BUILDS: ${state.role.toLowerCase()} tools in ${state.stack.toLowerCase()}` : '';
  const displayBuild = state.name ? (state.role ? buildText : 'CREATES CODE & SHIPS ARTIFACTS') : 'READY_TO_LOCK_IN_THE_SAND';
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.font = '14px "Space Mono", monospace';
  ctx.fillText(displayBuild.substring(0, 80).toUpperCase(), imgX, startFieldY + 5 * lineSpacing - 5);

  // 9. Event Information Panel
  const panelY = 1255;
  const panelH = 140;
  
  ctx.strokeStyle = '#053d24';
  ctx.lineWidth = 2;
  ctx.strokeRect(imgX, panelY, imgW, panelH);
  ctx.fillStyle = 'rgba(1, 18, 11, 0.7)';
  ctx.fillRect(imgX, panelY, imgW, panelH);

  // Draw tropical ocean ripples inside info panel
  drawWaves(ctx, imgX + 15, panelY + 125, 400, 'rgba(0, 229, 255, 0.15)', 1);

  // Left column in panel: Location / Dates
  ctx.fillStyle = '#f3e03b';
  ctx.font = 'bold 20px "Space Mono", monospace';
  ctx.fillText('GOA, INDIA', imgX + 30, panelY + 50);
  
  ctx.fillStyle = '#ffffff';
  ctx.font = '16px "Space Mono", monospace';
  ctx.fillText('28 – 31 OCT 2026', imgX + 30, panelY + 85);
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '12px "Space Mono", monospace';
  ctx.fillText('4 DAYS. ONE RHYTHM. SHIPS OR SHIPS.', imgX + 30, panelY + 112);

  // Right column in panel: Barcode & Host
  const barcodeW = 220;
  const barcodeH = 50;
  const barcodeX = imgX + imgW - barcodeW - 30;
  const barcodeY = panelY + 25;
  
  drawBarcode(ctx, barcodeX, barcodeY, barcodeW, barcodeH, '#f3e03b');
  
  ctx.fillStyle = '#ff007f';
  ctx.font = 'bold 12px "Space Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('HOST // 2:47 PM STUDIO', imgX + imgW - 30, panelY + 100);
  
  ctx.fillStyle = '#ffffff';
  ctx.font = '10px "Space Mono", monospace';
  ctx.fillText('#FrameInGoa', imgX + imgW - 30, panelY + 115);

  // Outer corner frames inside info panel
  drawTechBrackets(ctx, imgX - 2, panelY - 2, imgW + 4, panelH + 4, 15, 2, '#ff007f');
}

/**
 * High-Resolution HTML5 Canvas PFP Frame Renderer (1080 x 1080 px)
 */
export async function renderPfpFrame(
  canvas: HTMLCanvasElement,
  state: BuilderState,
  userImage: HTMLImageElement | null
): Promise<void> {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Wait for Google Fonts to load
  if (typeof document !== 'undefined') {
    await document.fonts.ready;
  }

  const size = 1080;
  canvas.width = size;
  canvas.height = size;

  // 1. Draw background void
  ctx.fillStyle = '#021a10';
  ctx.fillRect(0, 0, size, size);

  // Draw user image centered & zoomed
  drawUserPhoto(ctx, userImage, 0, 0, size, size, state.zoom, state.positionX, state.positionY);

  // 2. Neon wave overlays behind the top and bottom banner boxes
  drawWaves(ctx, 30, 115, size - 60, 'rgba(0, 229, 255, 0.4)', 2);
  drawWaves(ctx, 30, size - 118, size - 60, 'rgba(255, 0, 127, 0.5)', 3);
  drawWaves(ctx, 30, size - 128, size - 60, 'rgba(243, 224, 59, 0.3)', 1.5);

  // 3. Glowing palm trees framing the profile picture
  // Left palm tree
  drawPalmTree(ctx, 65, size - 100, 0.58, 'rgba(255, 0, 127, 0.85)');
  // Right palm tree
  drawPalmTree(ctx, size - 105, size - 100, 0.48, 'rgba(243, 224, 59, 0.85)');

  // 4. Overlay aesthetic Tech Borders
  ctx.strokeStyle = 'rgba(243, 224, 59, 0.45)';
  ctx.lineWidth = 12;
  ctx.strokeRect(6, 6, size - 12, size - 12);
  
  ctx.strokeStyle = '#021a10';
  ctx.lineWidth = 24;
  ctx.strokeRect(18, 18, size - 36, size - 36);

  // 5. Top Banner Box
  const topH = 75;
  ctx.fillStyle = '#021a10';
  ctx.fillRect(30, 30, size - 60, topH);
  
  ctx.strokeStyle = '#f3e03b';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, size - 60, topH);

  // Header texts
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px "Space Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('HH GOA 2026', 55, 75);

  ctx.fillStyle = '#ff007f';
  ctx.font = '16px "Space Mono", monospace';
  ctx.fillText('// BUILDER_PFP', 240, 75);

  // Top right details
  ctx.fillStyle = '#f3e03b';
  ctx.font = 'bold 16px "Space Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText('READY_TO_BUILD', size - 55, 75);

  // 6. Bottom Banner Box
  const btmH = 75;
  const btmY = size - btmH - 30;
  ctx.fillStyle = '#021a10';
  ctx.fillRect(30, btmY, size - 60, btmH);
  
  ctx.strokeStyle = '#f3e03b';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, btmY, size - 60, btmH);

  // Footer texts
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px "Space Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('GOA // 28-31 OCT 2026', 55, btmY + 45);

  // User details on the bottom right (if name is supplied)
  const pfpName = state.name ? state.name.substring(0, 15) : 'ANON_BUILDER';
  const pfpRole = state.role ? state.role.substring(0, 15) : 'DEVELOPER';
  ctx.fillStyle = '#ff007f';
  ctx.font = 'bold 16px "Space Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`${pfpName} // ${pfpRole}`.toUpperCase(), size - 55, btmY + 45);

  // Corner brackets inside the frame
  drawTechBrackets(ctx, 30, 30, size - 60, size - 60, 30, 4, '#ff007f');

  // Small coordinate details on borders
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = '10px "Space Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('LAT: 15.2993° N', 45, size - 48);
  ctx.textAlign = 'right';
  ctx.fillText('LNG: 74.1240° E', size - 45, size - 48);
}

