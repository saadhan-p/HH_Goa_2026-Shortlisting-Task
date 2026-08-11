import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as Blob;
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const filename = `share-${crypto.randomBytes(8).toString('hex')}.png`;

    // 1. If running on Vercel and Vercel Blob is connected
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const { put } = await import('@vercel/blob');
        const blob = await put(filename, image, {
          access: 'public',
        });
        return NextResponse.json({ url: blob.url });
      } catch (blobErr) {
        console.error('Vercel Blob upload failed, trying fallback:', blobErr);
      }
    }

    // 2. If running on Vercel but Blob is not connected, use anonymous public upload (catbox.moe) as a zero-config fallback
    const isVercel = process.env.VERCEL === '1';
    if (isVercel) {
      try {
        const catboxFormData = new FormData();
        catboxFormData.append('reqtype', 'fileupload');
        catboxFormData.append('fileToUpload', image, filename);

        const catboxRes = await fetch('https://catbox.moe/user/api.php', {
          method: 'POST',
          body: catboxFormData,
        });

        if (catboxRes.ok) {
          const fileUrl = await catboxRes.text();
          return NextResponse.json({ url: fileUrl.trim() });
        } else {
          throw new Error(`Catbox upload status: ${catboxRes.status}`);
        }
      } catch (catboxErr) {
        console.error('Catbox upload fallback failed:', catboxErr);
        // Fall through to local write (which will fail with EROFS, showing the write error as a last resort)
      }
    }

    // 3. Local Fallback for local development
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadDir = path.join(process.cwd(), 'public', 'shares');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ url: `/shares/${filename}` });
  } catch (error: any) {
    console.error('API Share Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
