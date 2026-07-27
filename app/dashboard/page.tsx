import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import DatasetUploader from '@/components/DatasetUploader';
import NNCanvas from '@/components/NNCanvas';

export const metadata: Metadata = {
  title: 'Dashboard | VWV Studio',
};

export default function DashboardPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">VWV AI Model Studio</h1>
          <p className="text-zinc-400 mt-1">Fine-tune, merge, build, and deploy custom neural architectures.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1"><DatasetUploader /></div>
          <div className="lg:col-span-2"><NNCanvas /></div>
        </div>
      </main>
    </div>
  );
}
