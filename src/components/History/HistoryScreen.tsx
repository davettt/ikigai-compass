import React from 'react';
import {
  Trash2,
  FileText,
  ChevronLeft,
  Compass,
  Calendar,
  Loader2,
  Copy,
  Check,
  Download,
  Sparkles,
  Pencil,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Input } from '../ui/input';
import { storage, formatDate } from '../../services/storage';
import type { SavedReport } from '../../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PDFDownloadLink } from '@react-pdf/renderer';
import IkigaiPDFDocument from '../Report/PDFDocument';

interface HistoryScreenProps {
  onBack: () => void;
  onNew: () => void;
}

// Custom components for better markdown rendering (same as ReportScreen)
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
    <h4 className="text-lg font-semibold text-foreground/80 mt-4 mb-2">{children}</h4>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="space-y-2 mb-4 ml-4">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="space-y-2 mb-4 ml-4 list-decimal list-inside">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="text-muted-foreground leading-relaxed">{children}</li>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic text-foreground/90">{children}</em>
  ),
  hr: () => <hr className="my-8 border-border" />,
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-4 border-primary/30 pl-4 my-4 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
};

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ onBack, onNew }) => {
  const [reports, setReports] = React.useState<SavedReport[]>([]);
  const [selectedReport, setSelectedReport] = React.useState<SavedReport | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [loadingReport, setLoadingReport] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState('');

  React.useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      const data = await storage.getReports();
      setReports(data);
      setLoading(false);
    };
    loadReports();
  }, []);

  const handleSelectReport = async (report: SavedReport) => {
    setLoadingReport(true);
    setCopied(false);
    const fullReport = await storage.getReport(report.id);
    setSelectedReport(fullReport);
    setLoadingReport(false);
  };

  const handleDelete = async (id: string) => {
    await storage.deleteReport(id);
    const data = await storage.getReports();
    setReports(data);
    if (selectedReport?.id === id) {
      setSelectedReport(null);
    }
  };

  const handleCopy = async () => {
    if (selectedReport?.markdownContent) {
      await navigator.clipboard.writeText(selectedReport.markdownContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStartEdit = (report: SavedReport, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(report.id);
    setEditTitle(report.title || '');
  };

  const handleSaveEdit = async (id: string) => {
    const trimmedTitle = editTitle.trim();
    const updated = await storage.updateReport(id, { title: trimmedTitle || undefined });
    if (updated) {
      setReports(prev => prev.map(r => (r.id === id ? { ...r, title: updated.title } : r)));
      if (selectedReport?.id === id) {
        setSelectedReport({ ...selectedReport, title: updated.title });
      }
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-background to-muted">
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Your Ikigai History</CardTitle>
                <CardDescription>View and manage your saved analyses</CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onBack}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={onNew}>
                <Compass className="w-4 h-4 mr-2" />
                New Assessment
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-muted-foreground mx-auto mb-4 animate-spin" />
              <p className="text-muted-foreground">Loading reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No saved analyses yet</h3>
              <p className="text-muted-foreground mb-4">
                Complete an assessment and save it to see it here
              </p>
              <Button onClick={onNew}>
                <Compass className="w-4 h-4 mr-2" />
                Start Assessment
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1 space-y-2">
                {reports.map(report => (
                  <div
                    key={report.id}
                    onClick={() => editingId !== report.id && handleSelectReport(report)}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedReport?.id === report.id
                        ? 'bg-primary/10 border-primary'
                        : 'bg-muted/50 hover:bg-muted'
                    } border`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {editingId === report.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={editTitle}
                              onChange={e => setEditTitle(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') handleSaveEdit(report.id);
                                if (e.key === 'Escape') handleCancelEdit();
                              }}
                              onClick={e => e.stopPropagation()}
                              placeholder="Enter a title..."
                              className="h-7 text-sm"
                              autoFocus
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 shrink-0"
                              onClick={e => {
                                e.stopPropagation();
                                handleSaveEdit(report.id);
                              }}
                            >
                              <Check className="w-3 h-3 text-green-600" />
                            </Button>
                          </div>
                        ) : (
                          <h4 className="font-medium truncate">
                            {report.title || 'Untitled Analysis'}
                          </h4>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(report.timestamp)}
                        </div>
                      </div>
                      <div className="flex shrink-0">
                        {editingId !== report.id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={e => handleStartEdit(report, e)}
                            title="Rename"
                          >
                            <Pencil className="w-4 h-4 text-muted-foreground" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={e => {
                            e.stopPropagation();
                            handleDelete(report.id);
                          }}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-2">
                {loadingReport ? (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    <p>Loading report...</p>
                  </div>
                ) : selectedReport ? (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-3 border-b flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div>
                          <h3 className="font-semibold">
                            {selectedReport.title || 'Ikigai Analysis'}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(selectedReport.timestamp)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => {
                            setEditingId(selectedReport.id);
                            setEditTitle(selectedReport.title || '');
                          }}
                          title="Rename"
                        >
                          <Pencil className="w-3 h-3 text-muted-foreground" />
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopy}
                          className="min-w-[100px]"
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-1" />
                              Copy
                            </>
                          )}
                        </Button>
                        <PDFDownloadLink
                          document={
                            <IkigaiPDFDocument
                              content={selectedReport.markdownContent || ''}
                              date={formatDate(selectedReport.timestamp)}
                            />
                          }
                          fileName={`ikigai-${selectedReport.id}.pdf`}
                        >
                          {({ loading: pdfLoading }) => (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={pdfLoading}
                              className="min-w-[100px]"
                            >
                              <Download className="w-4 h-4 mr-1" />
                              {pdfLoading ? 'Loading...' : 'PDF'}
                            </Button>
                          )}
                        </PDFDownloadLink>
                      </div>
                    </div>
                    <div className="p-6 max-h-[600px] overflow-y-auto bg-background">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponents}>
                        {selectedReport.markdownContent || ''}
                      </ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <p>Select a report to view</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
