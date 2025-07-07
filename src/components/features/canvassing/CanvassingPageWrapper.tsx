'use client';

import { Component, ReactNode } from 'react';
import { CanvassingPage } from './CanvassingPage';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class CanvassingErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Canvassing page error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto py-6 space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Something went wrong loading the canvassing page. 
              {this.state.error?.message && (
                <div className="mt-2 text-sm">
                  Error: {this.state.error.message}
                </div>
              )}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            Reload Page
          </Button>
        </div>
      );
    }

    return <CanvassingPage />;
  }
}

export function CanvassingPageWrapper() {
  return (
    <CanvassingErrorBoundary>
      <CanvassingPage />
    </CanvassingErrorBoundary>
  );
}