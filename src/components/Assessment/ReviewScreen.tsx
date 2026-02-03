import React, { useState } from 'react';
import { Edit3, Sparkles, ChevronRight, Zap, Brain, Lightbulb, Heart, Star, Globe, Briefcase } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import type { QuadrantData, AnalysisConfig, QuadrantWeights, LifeContext } from '../../types';
import { MODEL_OPTIONS, LIFE_CONTEXT_OPTIONS, DEFAULT_WEIGHTS } from '../../types';

interface ReviewScreenProps {
  quadrants: QuadrantData[];
  onEdit: (index: number) => void;
  onAnalyze: (config: AnalysisConfig) => void;
}

const modelIcons = {
  'haiku-3.5': <Zap className="w-4 h-4" />,
  'sonnet-4': <Lightbulb className="w-4 h-4" />,
  'opus-4': <Brain className="w-4 h-4" />,
};

const quadrantIcons = {
  love: <Heart className="w-4 h-4" />,
  goodAt: <Star className="w-4 h-4" />,
  worldNeeds: <Globe className="w-4 h-4" />,
  paidFor: <Briefcase className="w-4 h-4" />,
};

const quadrantLabels: Record<keyof QuadrantWeights, string> = {
  love: 'What You Love',
  goodAt: 'What You\'re Good At',
  worldNeeds: 'What the World Needs',
  paidFor: 'What You Can Be Paid For',
};

export const ReviewScreen: React.FC<ReviewScreenProps> = ({ quadrants, onEdit, onAnalyze }) => {
  const [selectedModel, setSelectedModel] = useState<AnalysisConfig['model']>('haiku-3.5');
  const [weights, setWeights] = useState<QuadrantWeights>(DEFAULT_WEIGHTS);
  const [lifeContext, setLifeContext] = useState<LifeContext>('exploring');

  const getSelectedLabels = (quadrant: QuadrantData): string[] => {
    const labels: string[] = [];

    quadrant.selected.forEach(id => {
      for (const group of quadrant.groups) {
        const option = group.options.find(o => o.id === id);
        if (option) {
          labels.push(option.label);
          break;
        }
      }
    });

    quadrant.customInputs.filter(i => i.trim()).forEach(input => {
      labels.push(input);
    });

    return labels;
  };

  const handleWeightChange = (key: keyof QuadrantWeights, value: number) => {
    const oldValue = weights[key];
    const diff = value - oldValue;

    // Get other keys
    const otherKeys = (Object.keys(weights) as (keyof QuadrantWeights)[]).filter(k => k !== key);

    // Distribute the difference among other sliders proportionally
    const otherTotal = otherKeys.reduce((sum, k) => sum + weights[k], 0);

    if (otherTotal === 0) {
      // If others are all 0, distribute equally
      const perOther = -diff / otherKeys.length;
      const newWeights = { ...weights, [key]: value };
      otherKeys.forEach(k => {
        newWeights[k] = Math.max(0, Math.min(100, perOther));
      });
      setWeights(newWeights);
    } else {
      const newWeights = { ...weights, [key]: value };
      otherKeys.forEach(k => {
        const proportion = weights[k] / otherTotal;
        newWeights[k] = Math.max(0, Math.round(weights[k] - diff * proportion));
      });

      // Ensure total is 100
      const total = Object.values(newWeights).reduce((a, b) => a + b, 0);
      if (total !== 100) {
        const adjustment = 100 - total;
        // Add adjustment to the largest other value
        const largestOther = otherKeys.reduce((a, b) => newWeights[a] > newWeights[b] ? a : b);
        newWeights[largestOther] += adjustment;
      }

      setWeights(newWeights);
    }
  };

  const resetWeights = () => setWeights(DEFAULT_WEIGHTS);

  const handleAnalyze = () => {
    onAnalyze({
      model: selectedModel,
      weights,
      lifeContext,
    });
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-background to-muted">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Review Your Selections</CardTitle>
          <CardDescription>
            Review and customize your analysis before generating your ikigai report
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Quadrant Selections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quadrants.map((quadrant, index) => {
              const selected = getSelectedLabels(quadrant);
              return (
                <Card key={quadrant.id} className="relative group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${quadrant.color}`} />
                        <CardTitle className="text-lg">{quadrant.label}</CardTitle>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(index)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selected.length > 0 ? (
                      <ul className="space-y-1">
                        {selected.map((item, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No selections</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Life Context */}
          <div className="border-t pt-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">Where are you in your journey?</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {LIFE_CONTEXT_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setLifeContext(option.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      lifeContext === option.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-sm font-medium">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quadrant Weights */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <label className="text-sm font-medium">Quadrant Importance</label>
                <p className="text-xs text-muted-foreground">
                  Leave at equal (25% each) if unsure. Only increase a quadrant if it's truly more important to you —
                  e.g., if doing what you love matters more than getting paid for it.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={resetWeights}>
                Reset to Equal
              </Button>
            </div>
            <div className="space-y-4">
              {(Object.keys(weights) as (keyof QuadrantWeights)[]).map((key) => (
                <div key={key} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-48">
                    {quadrantIcons[key]}
                    <span className="text-sm">{quadrantLabels[key]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={weights[key]}
                    onChange={(e) => handleWeightChange(key, parseInt(e.target.value))}
                    className="flex-1 h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <span className="text-sm font-medium w-12 text-right">{weights[key]}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Model Selection & Generate */}
          <div className="border-t pt-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">AI Model</label>
                <div className="flex flex-wrap gap-2">
                  {MODEL_OPTIONS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => setSelectedModel(model.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                        selectedModel === model.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {modelIcons[model.id]}
                      <div className="text-left">
                        <div className="text-sm font-medium">{model.name}</div>
                        <div className="text-xs text-muted-foreground">{model.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <Button size="lg" onClick={handleAnalyze}>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Analysis
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
