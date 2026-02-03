import React from 'react';
import { ChevronRight, ChevronLeft, Plus, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import type { QuadrantData } from '../../types';

interface QuadrantSelectorProps {
  quadrants: QuadrantData[];
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  onToggleOption: (quadrantId: string, optionId: string) => void;
  onAddCustom: (quadrantId: string, value: string) => void;
  onRemoveCustom: (quadrantId: string, index: number) => void;
  onComplete: () => void;
}

export const QuadrantSelector: React.FC<QuadrantSelectorProps> = ({
  quadrants,
  currentIndex,
  onNext,
  onPrevious,
  onToggleOption,
  onAddCustom,
  onRemoveCustom,
  onComplete,
}) => {
  const currentQuadrant = quadrants[currentIndex];
  const [customInput, setCustomInput] = React.useState('');
  const progress = ((currentIndex + 1) / quadrants.length) * 100;

  const handleAddCustom = () => {
    if (customInput.trim()) {
      onAddCustom(currentQuadrant.id, customInput.trim());
      setCustomInput('');
    }
  };

  const selectedCount = currentQuadrant.selected.length + currentQuadrant.customInputs.filter(i => i.trim()).length;
  const hasSelections = selectedCount > 0;

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-background to-muted">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${currentQuadrant.color}`} />
              <span className="text-sm text-muted-foreground">
                Step {currentIndex + 1} of {quadrants.length}
              </span>
            </div>
            <span className="text-sm font-medium">
              {selectedCount} selected
            </span>
          </div>
          <Progress value={progress} className="mb-4" />
          <CardTitle className="text-2xl">{currentQuadrant.label}</CardTitle>
          <CardDescription>{currentQuadrant.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentQuadrant.groups.map((group) => (
              <div key={group.id} className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  {group.label}
                </h3>
                <div className="space-y-2">
                  {group.options.map((option) => (
                    <div key={option.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={option.id}
                        checked={currentQuadrant.selected.includes(option.id)}
                        onCheckedChange={() => onToggleOption(currentQuadrant.id, option.id)}
                      />
                      <Label
                        htmlFor={option.id}
                        className="text-sm font-normal cursor-pointer leading-tight"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
              Add Your Own
            </h3>
            <div className="flex gap-2">
              <Input
                placeholder="Type something not listed above..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
              />
              <Button onClick={handleAddCustom} size="icon" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {currentQuadrant.customInputs.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {currentQuadrant.customInputs.map((input, index) => (
                  input.trim() && (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {input}
                      <button
                        onClick={() => onRemoveCustom(currentQuadrant.id, index)}
                        className="hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={onPrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            {currentIndex < quadrants.length - 1 ? (
              <Button onClick={onNext} disabled={!hasSelections}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={onComplete} disabled={!hasSelections}>
                Review
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
