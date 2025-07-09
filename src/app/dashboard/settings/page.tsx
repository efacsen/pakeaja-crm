'use client';

import { GlassCard as Card, GlassCardContent as CardContent, GlassCardDescription as CardDescription, GlassCardHeader as CardHeader, GlassCardTitle as CardTitle } from "@/components/ui/glass-card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle, ThemeIndicator } from "@/components/ui/theme-toggle";
import { useAuth } from "@/contexts/auth-context";
import { 
  Settings as SettingsIcon, 
  Palette, 
  User, 
  Bell, 
  Shield, 
  Database,
  Globe,
  Smartphone
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-primary">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and application settings
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Theme Settings - Primary Feature */}
        <Card className="md:col-span-2 lg:col-span-1 transition-theme border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Theme & Appearance</CardTitle>
            </div>
            <CardDescription>
              Customize the look and feel of your application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Theme Mode</p>
                <p className="text-xs text-muted-foreground">
                  Choose your preferred theme or follow system settings
                </p>
              </div>
              <ThemeToggle />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Theme:</span>
              <ThemeIndicator />
            </div>
            
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                💡 <strong>Tip:</strong> Dark mode can help reduce eye strain during 
                extended work sessions, especially in low-light environments.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="transition-theme border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Account</CardTitle>
            </div>
            <CardDescription>
              Your account information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
                         <div className="space-y-1">
               <p className="text-sm font-medium">Profile</p>
               <p className="text-xs text-muted-foreground">
                 {user?.full_name || 'Update your profile'}
               </p>
             </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Role</p>
              <Badge variant="secondary" className="text-xs">
                {user?.role || 'user'}
              </Badge>
            </div>
            
            <Separator />
            
            <div className="text-xs text-muted-foreground">
              Account settings coming soon...
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="transition-theme border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure how you receive updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Notifications</span>
                <Badge variant="outline" className="text-xs">Coming Soon</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Push Notifications</span>
                <Badge variant="outline" className="text-xs">Coming Soon</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">SMS Alerts</span>
                <Badge variant="outline" className="text-xs">Coming Soon</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="transition-theme border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Security</CardTitle>
            </div>
            <CardDescription>
              Protect your account and data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Two-Factor Auth</span>
                <Badge variant="outline" className="text-xs">Setup Available</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Session Management</span>
                <Badge variant="outline" className="text-xs">Coming Soon</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Keys</span>
                <Badge variant="outline" className="text-xs">Coming Soon</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System */}
        <Card className="transition-theme border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">System</CardTitle>
            </div>
            <CardDescription>
              Application and data management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Export</span>
                <Badge variant="outline" className="text-xs">Available</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Backup & Restore</span>
                <Badge variant="outline" className="text-xs">Coming Soon</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Integration Settings</span>
                <Badge variant="outline" className="text-xs">Coming Soon</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility */}
        <Card className="transition-theme border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Accessibility</CardTitle>
            </div>
            <CardDescription>
              Make the app work better for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Font Size</span>
                <Badge variant="outline" className="text-xs">Normal</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">High Contrast</span>
                <Badge variant="outline" className="text-xs">Available</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Screen Reader</span>
                <Badge variant="outline" className="text-xs">Supported</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Info */}
      <Card className="transition-theme border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Application Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium">Version</p>
              <p className="text-xs text-muted-foreground">1.0.0 Beta</p>
            </div>
            <div>
              <p className="text-sm font-medium">Last Updated</p>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Environment</p>
              <Badge variant="secondary" className="text-xs">
                {process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}