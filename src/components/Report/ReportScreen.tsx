import React, { useState } from 'react';
import { Download, Copy, Check, FileText, ChevronLeft, Save, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { PDFDownloadLink } from '@react-pdf/renderer';
import IkigaiPDFDocument from './PDFDocument';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { AssessmentData, SavedReport } from '../../types';
import { storage, generateId, formatDate } from '../../services/storage';

interface ReportScreenProps {
  content: string;
  data: AssessmentData;
  onBack: () => void;
  onHistory: () => void;
}

// Custom components for better markdown rendering
const MarkdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-3xl font-bold text-primary mb-6 pb-2 border-b-2 border-primary/20">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4 pb-2 border-b border-border">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-xl font-semibold text-foreground/90 mt-6 mb-3 flex items-center gap-2">
      <Sparkles className="w-4 h-4 text-primary" />
      {children}
    </h3>
  ),
  h4: ({ children }: { children?: React.ReactNode }) => (
    <h4 className="text-lg font-semibold text-foreground/80 mt-4 mb-2">
      {children}
    </h4>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-muted-foreground leading-relaxed mb-4">
      {children}
    </p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="space-y-2 mb-4 ml-4">
      {children}
    </ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="space-y-2 mb-4 ml-4 list-decimal list-inside">
      {children}
    </ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="text-muted-foreground leading-relaxed">
      {children}
    </li>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-foreground">
      {children}
    </strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic text-foreground/90">
      {children}
    </em>
  ),
  hr: () => (
    <hr className="my-8 border-border" />
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-4 border-primary/30 pl-4 my-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
};

export const ReportScreen: React.FC<ReportScreenProps> = ({
  content,
  data,
  onBack,
  onHistory,
}) => {
  const [copied, setCopied] = useState(false);
  const [title, setTitle] = useState('');
  const [saved, setSaved] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    const report: SavedReport = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      title: title || undefined,
      quadrants: data,
      markdownContent: content,
      hasPdf: false,
    };
    storage.saveReport(report);
    setSaved(true);
  };

  const date = formatDate(new Date().toISOString());

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-background to-muted">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Your Ikigai Analysis</CardTitle>
              <CardDescription>{date}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onBack}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button variant="outline" onClick={onHistory}>
                <FileText className="w-4 h-4 mr-2" />
                History
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1 w-full">
              <Label htmlFor="title">Title (optional)</Label>
              <Input
                id="title"
                placeholder="e.g., My Career Transition Ikigai"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCopy}
                className="min-w-[140px]"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Markdown
                  </>
                )}
              </Button>
              <PDFDownloadLink
                document={<IkigaiPDFDocument content={content} date={date} />}
                fileName={`ikigai-analysis-${new Date().toISOString().split('T')[0]}.pdf`}
              >
                {({ loading }) => (
                  <Button variant="outline" disabled={loading} className="min-w-[120px]">
                    <Download className="w-4 h-4 mr-2" />
                    {loading ? 'Loading...' : 'Download PDF'}
                  </Button>
                )}
              </PDFDownloadLink>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Your Ikigai Report</span>
              </div>
              {!saved ? (
                <Button size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save to History
                </Button>
              ) : (
                <span className="text-sm text-green-600 flex items-center font-medium">
                  <Check className="w-4 h-4 mr-1" />
                  Saved!
                </span>
              )}
            </div>
            <div className="p-8 bg-background text-foreground">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={MarkdownComponents}
              >
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          Your ikigai analysis is private and stored only on your device
        </CardFooter>
      </Card>
    </div>
  );
};
