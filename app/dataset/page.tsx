import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Dataset Studio | VWV Studio',
};

export default function DatasetPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dataset Studio</h1>
          <p className="text-zinc-400 mt-1">
            Upload and validate datasets before training or synthetic augmentation.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 max-w-xl space-y-4">
          <div>
            <label htmlFor="dataset-file" className="block text-sm text-zinc-400 mb-1">
              Dataset file (CSV or JSON)
            </label>
            <input
              id="dataset-file"
              type="file"
              accept=".csv,.json"
              className="block w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer"
            />
          </div>
          <button
            type="button"
            className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition"
          >
            Upload & Validate
          </button>
        </div>
      </main>
    </div>
  );
}
