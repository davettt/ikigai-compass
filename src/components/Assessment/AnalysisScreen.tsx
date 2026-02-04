import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { callClaudeAPI, buildIkigaiPrompt } from '../../services/claude-api';
import type { AssessmentData, AnalysisConfig } from '../../types';
import { MODEL_OPTIONS, LIFE_CONTEXT_OPTIONS } from '../../types';

interface AnalysisScreenProps {
  data: AssessmentData;
  config: AnalysisConfig;
  onComplete: (content: string) => void;
  onBack: () => void;
}

export const AnalysisScreen: React.FC<AnalysisScreenProps> = ({
  data,
  config,
  onComplete,
  onBack,
}) => {
  const modelOption = MODEL_OPTIONS.find(m => m.id === config.model) || MODEL_OPTIONS[0];
  const lifeContextOption = LIFE_CONTEXT_OPTIONS.find(l => l.id === config.lifeContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const attemptedRef = useRef(false);

  const generateAnalysis = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const prompt = buildIkigaiPrompt(data, config);

      const content = await callClaudeAPI(prompt, modelOption.apiModel);

      onComplete(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate analysis');
      setIsLoading(false);
    }
  }, [data, config, modelOption.apiModel, onComplete]);

  useEffect(() => {
    if (!attemptedRef.current) {
      attemptedRef.current = true;
      // Use setTimeout to break synchronous execution
      setTimeout(() => {
        generateAnalysis();
      }, 0);
    }
  }, [generateAnalysis]);

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-background to-muted flex items-center justify-center">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            {isLoading ? (
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            ) : error ? (
              <AlertCircle className="w-8 h-8 text-destructive" />
            ) : (
              <span className="text-2xl">✨</span>
            )}
          </div>
          <CardTitle>
            {isLoading ? 'Generating Your Ikigai...' : error ? 'Error' : 'Complete!'}
          </CardTitle>
          <CardDescription>
            {isLoading
              ? `Using ${modelOption.name} to create your personalized analysis for the "${lifeContextOption?.label}" stage...`
              : error
                ? 'Something went wrong while generating your analysis'
                : 'Your ikigai analysis is ready'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="text-left">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="whitespace-pre-wrap">{error}</AlertDescription>
            </Alert>
          )}

          {error && (
            <div className="flex justify-center gap-2">
              <Button variant="outline" onClick={onBack}>
                Go Back
              </Button>
              <Button onClick={generateAnalysis}>Try Again</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
