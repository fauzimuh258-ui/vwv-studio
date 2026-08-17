import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Model Merge | VWV Studio',
};

export default function MergePage(): JSX.Element {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Model Merge</h1>
          <p className="text-zinc-400 mt-1">
            Combine two models using SLERP, TIES, DARE, or linear interpolation.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 max-w-xl space-y-4">
          <div>
            <label htmlFor="model-a" className="block text-sm text-zinc-400 mb-1">
              Model A
            </label>
            <input
              id="model-a"
              type="text"
              placeholder="org/model-a"
              className="w-full rounded-md bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600"
            />
          </div>
          <div>
            <label htmlFor="model-b" className="block text-sm text-zinc-400 mb-1">
              Model B
            </label>
            <input
              id="model-b"
              type="text"
              placeholder="org/model-b"
              className="w-full rounded-md bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-600"
            />
          </div>
          <div>
            <label htmlFor="merge-method" className="block text-sm text-zinc-400 mb-1">
              Method
            </label>
            <select
              id="merge-method"
              className="w-full rounded-md bg-zinc-950 border border-zinc-800 px-3 py-2 text-sm text-white"
            >
              <option value="slerp">SLERP</option>
              <option value="ties">TIES</option>
              <option value="dare">DARE</option>
              <option value="linear">Linear</option>
            </select>
          </div>
          <button
            type="button"
            className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition"
          >
            Merge Models
          </button>
        </div>
      </main>
    </div>
  );
}
