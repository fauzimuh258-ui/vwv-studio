import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Fine-Tune | VWV Studio',
};

export default function FineTunePage(): JSX.Element {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fine-Tune</h1>
          <p className="text-zinc-400 mt-1">
            Configure and launch a LoRA fine-tuning job on your dataset.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 max-w-xl space-y-4">
          <div>
            <label htmlFor="base-model" className="block text-sm text-zinc-400 mb-1">
              Base model
            </label>
            <input
              id="base-model"
              type="text"
              placeholder="distilbert-base-uncased"
              className="w-full rounded-md bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600"
            />
          </div>
          <div>
            <label htmlFor="dataset-url" className="block text-sm text-zinc-400 mb-1">
              Dataset URL
            </label>
            <input
              id="dataset-url"
              type="text"
              placeholder="https://huggingface.co/datasets/..."
              className="w-full rounded-md bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600"
            />
          </div>
          <button
            type="button"
            className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition"
          >
            Start Fine-Tuning
          </button>
        </div>
      </main>
    </div>
  );
}
