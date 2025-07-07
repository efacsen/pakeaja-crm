'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Beaker } from 'lucide-react';

interface MaterialSystemBuilderProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function MaterialSystemBuilder({ onSuccess, onCancel }: MaterialSystemBuilderProps) {
  return (
    <div className="space-y-6">
      <div className="text-center py-12">
        <Beaker className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">System Builder Coming Soon</h3>
        <p className="text-muted-foreground mb-4">
          Create and manage approved coating systems with multiple layers
        </p>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Close
        </Button>
      </div>
    </div>
  );
}