import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { headers } from 'next/headers';

interface SharePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { id } = await params;
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const origin = `${protocol}://${host}`;
  const imageUrl = `${origin}/shares/${id}.png`;

  return {
    title: 'HH GOA 2026 — BUILDER IDENTITY',
    description: 'Check out my official Hacker House Goa 2026 Builder Card!',
    openGraph: {
      title: 'HH GOA 2026 — BUILDER IDENTITY',
      description: 'Check out my official Hacker House Goa 2026 Builder Card!',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 1500,
          alt: 'HH Goa 2026 Builder Card',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'HH GOA 2026 — BUILDER IDENTITY',
      description: 'Check out my official Hacker House Goa 2026 Builder Card!',
      images: [imageUrl],
    },
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;
  const imageUrl = `/shares/${id}.png`;

  return (
    <div className="flex flex-col min-h-screen bg-hh-dark tech-grid relative font-mono text-white selection:bg-hh-yellow selection:text-hh-dark">
      {/* Scanning bar overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
        <div className="w-full h-[1px] bg-hh-yellow/10 animate-scan top-0" />
      </div>

      <header className="w-full border-b border-[#053d24] bg-hh-darker/80 backdrop-blur-md sticky top-0 z-40 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <span className="font-bold text-sm tracking-wider hover:text-hh-yellow transition-colors flex items-center gap-1.5">
              HH GOA 2026 <span className="text-hh-pink group-hover:text-hh-yellow transition-colors">// IDENTITY</span>
            </span>
          </Link>

          <div className="flex items-center gap-3 text-[10px] text-gray-400">
            <span className="hidden sm:inline border border-[#053d24] bg-hh-darkest/60 px-2 py-0.5 rounded text-green-400 uppercase tracking-widest text-[9px] font-bold">
              SYS_REV // 1.0.2
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center justify-center gap-6">
        <div className="flex w-full max-w-md justify-start">
          <Link
            href="/"
            className="touch-target border border-[#053d24] hover:border-hh-yellow bg-hh-darker/40 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded flex items-center gap-2 transition-all hover:bg-hh-darkest/60 active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={14} />
            CREATE_YOUR_OWN
          </Link>
        </div>

        <div className="w-full max-w-md border border-[#053d24] bg-hh-darker/60 rounded-lg overflow-hidden shadow-2xl p-6 flex flex-col items-center gap-5">
          <div className="flex items-center justify-between w-full border-b border-[#053d24] pb-3 text-xs font-bold text-hh-yellow uppercase tracking-widest">
            <span>SHARED_IDENTITY</span>
            <span className="text-[10px] text-gray-500">ID: {id}</span>
          </div>

          <div className="relative w-full shadow-2xl border border-[#053d24] rounded-sm group overflow-hidden bg-hh-darkest scanlines">
            <img
              src={imageUrl}
              alt="HH Goa 2026 Builder Card"
              className="w-full h-auto object-contain block select-none"
            />
            <div className="absolute inset-0 pointer-events-none border border-transparent group-hover:border-hh-yellow/10 transition-colors">
              <div className="absolute left-0 w-full h-[2px] bg-hh-yellow/15 shadow-[0_0_8px_rgba(243,224,59,0.3)] animate-scan top-0" />
            </div>
          </div>

          <div className="w-full flex gap-3">
            <a
              href={imageUrl}
              download={`hh-goa-2026-builder-${id}.png`}
              className="flex-1 touch-target bg-hh-yellow text-hh-dark hover:bg-white transition-all font-bold text-xs tracking-wider uppercase py-3 px-5 rounded flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
            >
              <Download size={16} />
              <span>DOWNLOAD</span>
            </a>
            
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 touch-target border border-hh-pink hover:bg-hh-pink hover:text-white text-hh-pink transition-all font-bold text-xs tracking-wider uppercase py-3 px-5 rounded flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <ExternalLink size={16} />
              <span>OPEN FULL IMAGE</span>
            </a>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-[#053d24] bg-hh-darkest/60 py-6 text-center text-[10px] text-gray-500 uppercase tracking-widest font-mono">
        <div>GENESIS PROTOCOL 0x247 // HOSTED BY 2:47 PM STUDIO</div>
      </footer>
    </div>
  );
}
