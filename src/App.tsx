import { useState, useCallback, useEffect } from 'react';
import { WelcomeScreen } from './components/Assessment/WelcomeScreen';
import { QuadrantSelector } from './components/Assessment/QuadrantSelector';
import { ReviewScreen } from './components/Assessment/ReviewScreen';
import { AnalysisScreen } from './components/Assessment/AnalysisScreen';
import { ReportScreen } from './components/Report/ReportScreen';
import { HistoryScreen } from './components/History/HistoryScreen';
import { initialQuadrants } from './data/ikigai-categories';
import type { ViewState, QuadrantData, AssessmentData, AnalysisConfig } from './types';
import { DEFAULT_WEIGHTS } from './types';
import './index.css';

const PROGRESS_KEY = 'ikigai_current_assessment';

function App() {
  const [view, setView] = useState<ViewState>('welcome');
  const [quadrants, setQuadrants] = useState<QuadrantData[]>(() => {
    const saved = localStorage.getItem(PROGRESS_KEY);
    return saved ? JSON.parse(saved).quadrants : initialQuadrants;
  });
  const [currentQuadrantIndex, setCurrentQuadrantIndex] = useState(() => {
    const saved = localStorage.getItem(PROGRESS_KEY);
    return saved ? JSON.parse(saved).currentQuadrantIndex : 0;
  });
  const [hasSavedProgress, setHasSavedProgress] = useState(() => {
    return !!localStorage.getItem(PROGRESS_KEY);
  });
  const [analysisContent, setAnalysisContent] = useState<string>('');
  const [analysisConfig, setAnalysisConfig] = useState<AnalysisConfig>({
    model: 'haiku-3.5',
    weights: DEFAULT_WEIGHTS,
    lifeContext: 'exploring',
  });

  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ quadrants, currentQuadrantIndex }));
  }, [quadrants, currentQuadrantIndex]);

  const clearProgress = useCallback(() => {
    localStorage.removeItem(PROGRESS_KEY);
    setHasSavedProgress(false);
    setQuadrants(initialQuadrants);
    setCurrentQuadrantIndex(0);
  }, []);

  const handleStart = useCallback((shouldClear: boolean = true) => {
    if (shouldClear) {
      clearProgress();
    }
    setView('assessment');
  }, [clearProgress]);

  const handleResume = useCallback(() => {
    setView('assessment');
  }, []);

  const handleToggleOption = useCallback((quadrantId: string, optionId: string) => {
    setQuadrants(prev => prev.map(q => {
      if (q.id !== quadrantId) return q;
      
      const isSelected = q.selected.includes(optionId);
      return {
        ...q,
        selected: isSelected
          ? q.selected.filter(id => id !== optionId)
          : [...q.selected, optionId]
      };
    }));
  }, []);

  const handleAddCustom = useCallback((quadrantId: string, value: string) => {
    setQuadrants(prev => prev.map(q => {
      if (q.id !== quadrantId) return q;
      return {
        ...q,
        customInputs: [...q.customInputs, value]
      };
    }));
  }, []);

  const handleRemoveCustom = useCallback((quadrantId: string, index: number) => {
    setQuadrants(prev => prev.map(q => {
      if (q.id !== quadrantId) return q;
      return {
        ...q,
        customInputs: q.customInputs.filter((_, i) => i !== index)
      };
    }));
  }, []);

  const handleNext = useCallback(() => {
    if (currentQuadrantIndex < quadrants.length - 1) {
      setCurrentQuadrantIndex((prev: number) => prev + 1);
    }
  }, [currentQuadrantIndex, quadrants.length]);

  const handlePrevious = useCallback(() => {
    if (currentQuadrantIndex > 0) {
      setCurrentQuadrantIndex((prev: number) => prev - 1);
    } else {
      setView('welcome');
    }
  }, [currentQuadrantIndex]);

  const handleReview = useCallback(() => {
    setView('review');
  }, []);

  const handleEditQuadrant = useCallback((index: number) => {
    setCurrentQuadrantIndex(index);
    setView('assessment');
  }, []);

  const handleAnalyze = useCallback((config: AnalysisConfig) => {
    setAnalysisConfig(config);
    setView('analysis');
  }, []);

  const handleAnalysisComplete = useCallback((content: string) => {
    setAnalysisContent(content);
    setView('report');
  }, []);

  const handleHistory = useCallback(() => {
    setView('history');
  }, []);

  const handleNewAssessment = useCallback(() => {
    setQuadrants(initialQuadrants);
    setCurrentQuadrantIndex(0);
    setAnalysisContent('');
    setView('assessment');
  }, []);

  const assessmentData: AssessmentData = {
    quadrants,
    timestamp: new Date().toISOString(),
  };

  switch (view) {
    case 'welcome':
      return <WelcomeScreen onStart={handleStart} onHistory={handleHistory} hasSavedProgress={hasSavedProgress} onResume={handleResume} />;
    
    case 'assessment':
      return (
        <QuadrantSelector
          quadrants={quadrants}
          currentIndex={currentQuadrantIndex}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onToggleOption={handleToggleOption}
          onAddCustom={handleAddCustom}
          onRemoveCustom={handleRemoveCustom}
          onComplete={handleReview}
        />
      );
    
    case 'review':
      return (
        <ReviewScreen
          quadrants={quadrants}
          onEdit={handleEditQuadrant}
          onAnalyze={handleAnalyze}
        />
      );
    
    case 'analysis':
      return (
        <AnalysisScreen
          data={assessmentData}
          config={analysisConfig}
          onComplete={handleAnalysisComplete}
          onBack={() => setView('review')}
        />
      );
    
    case 'report':
      return (
        <ReportScreen
          content={analysisContent}
          data={assessmentData}
          onBack={() => setView('welcome')}
          onHistory={handleHistory}
        />
      );
    
    case 'history':
      return (
        <HistoryScreen
          onBack={() => setView('welcome')}
          onNew={handleNewAssessment}
        />
      );
    
    default:
      return <WelcomeScreen onStart={handleStart} onHistory={handleHistory} hasSavedProgress={hasSavedProgress} onResume={handleResume} />;
  }
}

export default App;
