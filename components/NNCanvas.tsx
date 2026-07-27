'use client';

import { useState } from 'react';
import type { NodeData, NodeType } from '@/lib/types';

type BuildableLayer = Extract<NodeType, 'dense' | 'conv2d'>;

const INITIAL_NODES: NodeData[] = [
  { id: 'input-1', type: 'input', label: 'Input Layer (784)' },
  { id: 'dense-1', type: 'dense', label: 'Dense (128, ReLU)', units: 128, activation: 'relu' },
  { id: 'output-1', type: 'output', label: 'Output Layer (10, Softmax)', units: 10, activation: 'softmax' },
];

function createLayer(type: BuildableLayer): NodeData {
  const id = `${type}-${Date.now()}`;
  return type === 'conv2d'
    ? { id, type, label: 'Conv2D (32, 3x3)', units: 32, activation: 'relu' }
    : { id, type, label: 'Dense (64, ReLU)', units: 64, activation: 'relu' };
}

export default function NNCanvas(): JSX.Element {
  const [nodes, setNodes] = useState<NodeData[]>(INITIAL_NODES);

  const addLayer = (type: BuildableLayer): void => {
    setNodes((current) => {
      const newNode = createLayer(type);
      const insertAt = Math.max(current.length - 1, 0);
      const updated = [...current];
      updated.splice(insertAt, 0, newNode);
      return updated;
    });
  };

  const removeLayer = (id: string): void => {
    setNodes((current) => {
      const target = current.find((node) => node.id === id);
      if (!target || target.type === 'input' || target.type === 'output') {
        return current;
      }
      return current.filter((node) => node.id !== id);
    });
  };

  return (
    <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Visual Neural Network Builder</h3>
          <p className="text-sm text-zinc-400">Configure your architecture layer by layer</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => addLayer('dense')} className="px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 rounded border border-zinc-700">
            + Add Dense Layer
          </button>
          <button type="button" onClick={() => addLayer('conv2d')} className="px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 rounded border border-zinc-700">
            + Add Conv2D Layer
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 py-8 px-4 bg-zinc-950 rounded-lg border border-zinc-800 overflow-x-auto">
        {nodes.map((node, index) => (
          <div key={node.id} className="flex items-center gap-4">
            <div className="relative p-4 bg-zinc-900 border border-blue-500/30 rounded-lg min-w-[160px] text-center shadow-lg">
              {node.type !== 'input' && node.type !== 'output' && (
                <button
                  type="button"
                  onClick={() => removeLayer(node.id)}
                  aria-label={`Remove ${node.label}`}
                  className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 text-xs text-zinc-400 hover:text-white hover:bg-red-600 transition"
                >
                  ×
                </button>
              )}
              <span className="text-xs uppercase text-blue-400 font-bold block mb-1">{node.type}</span>
              <span className="text-sm font-medium">{node.label}</span>
            </div>
            {index < nodes.length - 1 && (
              <span className="text-zinc-600 font-bold text-xl" aria-hidden="true">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
