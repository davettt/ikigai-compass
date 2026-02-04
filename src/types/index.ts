export interface CategoryOption {
  id: string;
  label: string;
  description?: string;
}

export interface CategoryGroup {
  id: string;
  label: string;
  options: CategoryOption[];
}

export interface QuadrantData {
  id: 'love' | 'goodAt' | 'worldNeeds' | 'paidFor';
  label: string;
  description: string;
  color: string;
  groups: CategoryGroup[];
  selected: string[];
  customInputs: string[];
}

export interface AssessmentData {
  quadrants: QuadrantData[];
  timestamp?: string;
}

export interface SavedReport {
  id: string;
  timestamp: string;
  title?: string;
  quadrants: AssessmentData;
  markdownContent: string;
  hasPdf: boolean;
}

export type ViewState = 'welcome' | 'assessment' | 'review' | 'analysis' | 'report' | 'history';

export type LifeContext =
  | 'exploring'
  | 'transitioning'
  | 'established'
  | 'reinventing'
  | 'retiring';

export interface LifeContextOption {
  id: LifeContext;
  label: string;
  description: string;
}

export const LIFE_CONTEXT_OPTIONS: LifeContextOption[] = [
  { id: 'exploring', label: 'Exploring', description: 'Early career, discovering options' },
  { id: 'transitioning', label: 'Transitioning', description: 'Changing careers or roles' },
  { id: 'established', label: 'Established', description: 'Stable career, seeking deeper meaning' },
  { id: 'reinventing', label: 'Reinventing', description: 'Major life change, starting fresh' },
  { id: 'retiring', label: 'Retiring', description: 'Shifting focus to legacy and fulfillment' },
];

export interface QuadrantWeights {
  love: number;
  goodAt: number;
  worldNeeds: number;
  paidFor: number;
}

export const DEFAULT_WEIGHTS: QuadrantWeights = {
  love: 25,
  goodAt: 25,
  worldNeeds: 25,
  paidFor: 25,
};

export interface AnalysisConfig {
  model: ModelId;
  weights: QuadrantWeights;
  lifeContext: LifeContext;
}

export type ModelId = 'haiku-3.5' | 'sonnet-4' | 'opus-4';

export interface ModelOption {
  id: ModelId;
  name: string;
  description: string;
  apiModel: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
  {
    id: 'haiku-3.5',
    name: 'Haiku 3.5',
    description: 'Fast & affordable',
    apiModel: 'claude-3-5-haiku-20241022',
  },
  {
    id: 'sonnet-4',
    name: 'Sonnet 4',
    description: 'Balanced & thoughtful',
    apiModel: 'claude-sonnet-4-20250514',
  },
  {
    id: 'opus-4',
    name: 'Opus 4',
    description: 'Deep & nuanced',
    apiModel: 'claude-opus-4-20250514',
  },
];
