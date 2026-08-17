import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'NN Canvas | VWV Studio',
};

export default function NnCanvasPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">NN Canvas</h1>
          <p className="text-zinc-400 mt-1">
            Visually compose a neural network architecture layer by layer.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex gap-2">
            <button type="button" className="px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 rounded border border-zinc-700">
              + Add Dense Layer
            </button>
            <button type="button" className="px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 rounded border border-zinc-700">
              + Add Conv2D Layer
            </button>
          </div>
          <div className="flex items-center justify-center py-8 px-4 bg-zinc-950 rounded-lg border border-zinc-800 text-sm text-zinc-500">
            Canvas will render your architecture here.
          </div>
        </div>
      </main>
    </div>
  );
}
