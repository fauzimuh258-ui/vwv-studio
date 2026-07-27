import Link from 'next/link';

/**
 * Top navigation for VWV Studio. Server component — no client-side state.
 */
export default function Navbar(): JSX.Element {
  return (
    <nav className="border-b border-zinc-800 bg-zinc-950 px-6 py-4 flex items-center justify-between text-white">
      <div className="flex items-center gap-2">
        <span className="font-bold text-xl tracking-wider text-blue-500">VWV</span>
        <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">STUDIO</span>
      </div>
      <div className="flex gap-6 text-sm font-medium text-zinc-400">
        <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
        <Link href="/dataset" className="hover:text-white transition">Dataset Studio</Link>
        <Link href="/fine-tune" className="hover:text-white transition">Fine-Tune</Link>
        <Link href="/merge" className="hover:text-white transition">Model Merge</Link>
        <Link href="/nn-builder" className="hover:text-white transition">NN Canvas</Link>
      </div>
    </nav>
  );
}
