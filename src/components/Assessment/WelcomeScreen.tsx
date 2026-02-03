import React from 'react';
import { Compass, Sparkles, Lock, History } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface WelcomeScreenProps {
  onStart: (shouldClear?: boolean) => void;
  onHistory: () => void;
  hasSavedProgress: boolean;
  onResume: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onHistory, hasSavedProgress, onResume }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Compass className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Ikigai Compass
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Discover your reason for being through the Japanese concept of ikigai
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
              <Sparkles className="w-8 h-8 text-yellow-500 mb-2" />
              <h3 className="font-semibold mb-1">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">
                Personalized analysis using Claude AI
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
              <Lock className="w-8 h-8 text-green-500 mb-2" />
              <h3 className="font-semibold mb-1">100% Private</h3>
              <p className="text-sm text-muted-foreground">
                All data stays on your device
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 rounded-lg bg-muted/50">
              <Compass className="w-8 h-8 text-blue-500 mb-2" />
              <h3 className="font-semibold mb-1">Actionable</h3>
              <p className="text-sm text-muted-foreground">
                Clear pathways and next steps
              </p>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>What is Ikigai?</strong> Ikigai (生き甲斐) is a Japanese concept meaning 
              "a reason for being." It lies at the intersection of:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>What you love (your passion)</li>
              <li>What you're good at (your profession)</li>
              <li>What the world needs (your mission)</li>
              <li>What you can be paid for (your vocation)</li>
            </ul>
          </div>

          <div className="flex gap-3 justify-center">
            {hasSavedProgress ? (
              <>
                <Button size="lg" onClick={() => onStart(true)} className="min-w-[200px]">
                  <Compass className="w-4 h-4 mr-2" />
                  Start New Assessment
                </Button>
                <Button size="lg" variant="secondary" onClick={onResume} className="min-w-[140px]">
                  Resume Progress
                </Button>
              </>
            ) : (
              <Button size="lg" onClick={() => onStart()} className="min-w-[200px]">
                <Compass className="w-4 h-4 mr-2" />
                Start Assessment
              </Button>
            )}
            <Button size="lg" variant="outline" onClick={onHistory} className="min-w-[140px]">
              <History className="w-4 h-4 mr-2" />
              History
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
