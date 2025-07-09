'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Construction, Package, Plus } from 'lucide-react';

export default function MaterialsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6" />
          Materials Database
        </h1>
        <p className="text-muted-foreground mt-1">Material pricing and specifications</p>
      </div>

      {/* Coming Soon Card */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Construction className="h-5 w-5 text-orange-500" />
            Under Development
          </CardTitle>
          <CardDescription>
            The materials database is being optimized for better performance and usability.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We're working on:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Comprehensive material catalog with pricing</li>
              <li>Real-time inventory tracking</li>
              <li>Supplier management integration</li>
              <li>Automated price updates</li>
              <li>Material specification sheets</li>
            </ul>
            
            <div className="pt-4">
              <p className="text-sm font-medium mb-2">Expected completion:</p>
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-sm text-center">Phase 2 - Q2 2024</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Available features during development</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <Button variant="outline" className="justify-start" disabled>
              <Plus className="h-4 w-4 mr-2" />
              Add New Material
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => window.location.href = '/dashboard/calculator'}
            >
              <Package className="h-4 w-4 mr-2" />
              Use Calculator Instead
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}