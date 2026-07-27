/**
 * Shared type definitions for the VWV (Vazi Web Vision) AI Model Studio.
 */

export type NodeType = 'input' | 'dense' | 'conv2d' | 'output';
export type Activation = 'relu' | 'sigmoid' | 'softmax' | 'tanh' | 'linear';

export interface NodeData {
  id: string;
  type: NodeType;
  label: string;
  units?: number;
  activation?: Activation;
}

export interface TrainingConfig {
  baseModel: string;
  datasetUrl: string;
  epochs: number;
  learningRate: number;
}

export interface DatasetValidationResult {
  success: boolean;
  rowCount?: number;
  columns?: string[];
  message: string;
}
