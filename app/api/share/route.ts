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

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create unique ID for sharing
    const id = crypto.randomBytes(8).toString('hex');
    
    // Ensure upload directory exists inside public/shares
    const uploadDir = path.join(process.cwd(), 'public', 'shares');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, `${id}.png`);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ id });
  } catch (error: any) {
    console.error('API Share Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
