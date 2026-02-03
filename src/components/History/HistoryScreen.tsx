import React from 'react';
import { Trash2, FileText, ChevronLeft, Compass, Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { storage, formatDate } from '../../services/storage';
import type { SavedReport } from '../../types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface HistoryScreenProps {
  onBack: () => void;
  onNew: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ onBack, onNew }) => {
  const [reports, setReports] = React.useState<SavedReport[]>([]);
  const [selectedReport, setSelectedReport] = React.useState<SavedReport | null>(null);

  React.useEffect(() => {
    setReports(storage.getReports());
  }, []);

  const handleDelete = (id: string) => {
    storage.deleteReport(id);
    setReports(storage.getReports());
    if (selectedReport?.id === id) {
      setSelectedReport(null);
    }
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
          {reports.length === 0 ? (
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
                {reports.map((report) => (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedReport?.id === report.id
                        ? 'bg-primary/10 border-primary'
                        : 'bg-muted/50 hover:bg-muted'
                    } border`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">
                          {report.title || 'Untitled Analysis'}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(report.timestamp)}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(report.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-2">
                {selectedReport ? (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-muted px-4 py-3 border-b">
                      <h3 className="font-semibold">
                        {selectedReport.title || 'Ikigai Analysis'}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(selectedReport.timestamp)}
                      </p>
                    </div>
                    <div className="p-6 max-h-[600px] overflow-y-auto">
                      <div className="prose prose-slate max-w-none dark:prose-invert">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {selectedReport.markdownContent}
                        </ReactMarkdown>
                      </div>
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
