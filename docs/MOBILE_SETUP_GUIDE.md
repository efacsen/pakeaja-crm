# 📱 PakeAja CRM Mobile App Setup Guide

> **Complete Installation & Setup Instructions for Mobile Development Team**  
> React Native | Expo | Supabase | TypeScript

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or later
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)
- Git

### Environment Setup
```bash
# Install Expo CLI globally
npm install -g @expo/cli

# Install EAS CLI for builds
npm install -g eas-cli

# Verify installation
expo --version
eas --version
```

---

## 🏗️ Project Setup

### 1. Initialize Project
```bash
# Create new Expo project
npx create-expo-app PakeAjaCRM --template typescript

# Navigate to project directory
cd PakeAjaCRM

# Install additional dependencies
npm install @supabase/supabase-js @react-native-async-storage/async-storage
npm install react-native-maps react-native-image-picker
npm install @react-navigation/native @react-navigation/bottom-tabs
npm install react-native-gesture-handler react-native-reanimated
npm install react-native-svg react-native-safe-area-context
npm install react-native-screens @react-navigation/stack
npm install expo-location expo-camera expo-media-library
npm install react-native-paper react-native-vector-icons
```

### 2. Configure Environment Variables
```bash
# Create .env file
touch .env

# Add environment variables
echo "EXPO_PUBLIC_SUPABASE_URL=https://bemrgpgwaatizgxftzgg.supabase.co" >> .env
echo "EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key" >> .env
echo "EXPO_PUBLIC_APP_ENV=development" >> .env
```

### 3. Configure app.json
```json
{
  "expo": {
    "name": "PakeAja CRM",
    "slug": "pakeaja-crm",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.pakeaja.crm"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.pakeaja.crm",
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "CAMERA",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-location",
      "expo-camera",
      "expo-media-library",
      [
        "expo-image-picker",
        {
          "photosPermission": "The app accesses your photos to upload canvassing photos."
        }
      ]
    ]
  }
}
```

---

## 🔧 Core Configuration

### 1. Supabase Configuration (`lib/supabase.ts`)
```typescript
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

### 2. Navigation Setup (`navigation/index.tsx`)
```typescript
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import CanvassingScreen from '../screens/CanvassingScreen';
import LeadsScreen from '../screens/LeadsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Canvassing" component={CanvassingScreen} />
      <Tab.Screen name="Leads" component={LeadsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 3. Authentication Context (`contexts/AuthContext.tsx`)
```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

---

## 🗄️ Data Management

### 1. Data Models (`types/index.ts`)
```typescript
export interface CanvassingReport {
  id: string;
  company_name: string;
  company_address?: string;
  contact_person?: string;
  contact_position?: string;
  contact_phone?: string;
  contact_email?: string;
  visit_date: string;
  visit_outcome: 'interested' | 'not_interested' | 'follow_up_needed' | 'already_customer' | 'competitor_locked';
  project_segment?: 'decorative' | 'floor' | 'marine' | 'protective' | 'steel' | 'waterproofing' | 'others';
  potential_value?: number;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  gps_latitude?: number;
  gps_longitude?: number;
  sales_rep_id: string;
  sales_rep_name?: string;
  general_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  lead_number: string;
  title: string;
  company_name?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  stage: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  temperature_status?: 'cold' | 'warm' | 'hot';
  estimated_value?: number;
  probability?: number;
  expected_close_date?: string;
  assigned_to: string;
  canvassing_report_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  lead_id?: string;
  user_id: string;
  type: 'phone_call' | 'email' | 'meeting' | 'site_visit' | 'follow_up' | 'other';
  title: string;
  description?: string;
  scheduled_at?: string;
  completed_at?: string;
  is_completed: boolean;
  outcome?: string;
  created_at: string;
  updated_at: string;
}
```

### 2. Data Services (`services/canvassingService.ts`)
```typescript
import { supabase } from '../lib/supabase';
import { CanvassingReport } from '../types';

export class CanvassingService {
  static async createReport(report: Partial<CanvassingReport>): Promise<CanvassingReport> {
    const { data, error } = await supabase
      .from('canvassing_reports')
      .insert([report])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getReports(salesRepId: string): Promise<CanvassingReport[]> {
    const { data, error } = await supabase
      .from('canvassing_reports')
      .select(`
        *,
        canvassing_photos (
          id,
          photo_url,
          created_at
        )
      `)
      .eq('sales_rep_id', salesRepId)
      .order('visit_date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async updateReport(id: string, updates: Partial<CanvassingReport>): Promise<CanvassingReport> {
    const { data, error } = await supabase
      .from('canvassing_reports')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async uploadPhoto(reportId: string, imageUri: string): Promise<string> {
    const fileName = `${reportId}-${Date.now()}.jpg`;
    const { data, error } = await supabase.storage
      .from('canvassing-photos')
      .upload(fileName, {
        uri: imageUri,
        type: 'image/jpeg',
        name: fileName,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('canvassing-photos')
      .getPublicUrl(fileName);

    // Create photo record
    await supabase
      .from('canvassing_photos')
      .insert({
        report_id: reportId,
        photo_url: publicUrl,
      });

    return publicUrl;
  }
}
```

---

## 📍 Location & Maps

### 1. Location Service (`services/locationService.ts`)
```typescript
import * as Location from 'expo-location';

export class LocationService {
  static async requestPermission(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }

  static async getCurrentLocation(): Promise<Location.LocationObject | null> {
    const hasPermission = await this.requestPermission();
    if (!hasPermission) return null;

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 10000,
      });
      return location;
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  }

  static async reverseGeocode(latitude: number, longitude: number): Promise<string> {
    try {
      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      
      if (result.length > 0) {
        const address = result[0];
        return `${address.street}, ${address.city}, ${address.region}`;
      }
      
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }
  }
}
```

### 2. Maps Component (`components/MapView.tsx`)
```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface MapViewProps {
  latitude: number;
  longitude: number;
  markers?: Array<{
    id: string;
    latitude: number;
    longitude: number;
    title: string;
    description?: string;
  }>;
}

export default function CustomMapView({ latitude, longitude, markers = [] }: MapViewProps) {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
```

---

## 🔄 Offline Support

### 1. Offline Storage (`services/offlineService.ts`)
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CanvassingReport } from '../types';

export class OfflineService {
  private static KEYS = {
    OFFLINE_REPORTS: 'offline_reports',
    OFFLINE_PHOTOS: 'offline_photos',
    SYNC_QUEUE: 'sync_queue',
  };

  static async saveOfflineReport(report: Partial<CanvassingReport>): Promise<void> {
    try {
      const offlineReports = await this.getOfflineReports();
      const newReport = {
        ...report,
        local_id: `local_${Date.now()}`,
        created_at: new Date().toISOString(),
        sync_status: 'pending',
      };
      
      offlineReports.push(newReport);
      await AsyncStorage.setItem(
        this.KEYS.OFFLINE_REPORTS,
        JSON.stringify(offlineReports)
      );
    } catch (error) {
      console.error('Error saving offline report:', error);
    }
  }

  static async getOfflineReports(): Promise<any[]> {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.OFFLINE_REPORTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting offline reports:', error);
      return [];
    }
  }

  static async clearOfflineReports(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.KEYS.OFFLINE_REPORTS);
    } catch (error) {
      console.error('Error clearing offline reports:', error);
    }
  }

  static async syncOfflineData(): Promise<void> {
    const offlineReports = await this.getOfflineReports();
    
    for (const report of offlineReports) {
      try {
        // Sync with server
        await CanvassingService.createReport(report);
        
        // Remove from offline storage
        await this.removeOfflineReport(report.local_id);
      } catch (error) {
        console.error('Error syncing report:', error);
      }
    }
  }

  private static async removeOfflineReport(localId: string): Promise<void> {
    const offlineReports = await this.getOfflineReports();
    const updatedReports = offlineReports.filter(
      report => report.local_id !== localId
    );
    
    await AsyncStorage.setItem(
      this.KEYS.OFFLINE_REPORTS,
      JSON.stringify(updatedReports)
    );
  }
}
```

### 2. Network Status Hook (`hooks/useNetworkStatus.ts`)
```typescript
import { useState, useEffect } from 'react';
import NetInfo from '@react-native-netinfo/netinfo';

export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
      setIsInternetReachable(state.isInternetReachable ?? false);
    });

    return unsubscribe;
  }, []);

  return { isConnected, isInternetReachable };
}
```

---

## 🎨 UI Components

### 1. Form Components (`components/forms/CanvassingForm.tsx`)
```typescript
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface CanvassingFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

export default function CanvassingForm({ onSubmit, initialData = {} }: CanvassingFormProps) {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    contact_phone: '',
    visit_outcome: 'interested',
    project_segment: 'protective',
    potential_value: '',
    priority: 'medium',
    general_notes: '',
    ...initialData,
  });

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Company Name *</Text>
      <TextInput
        style={styles.input}
        value={formData.company_name}
        onChangeText={(text) => setFormData(prev => ({ ...prev, company_name: text }))}
        placeholder="Enter company name"
      />

      <Text style={styles.label}>Contact Person</Text>
      <TextInput
        style={styles.input}
        value={formData.contact_person}
        onChangeText={(text) => setFormData(prev => ({ ...prev, contact_person: text }))}
        placeholder="Enter contact person"
      />

      <Text style={styles.label}>Visit Outcome *</Text>
      <Picker
        selectedValue={formData.visit_outcome}
        style={styles.picker}
        onValueChange={(value) => setFormData(prev => ({ ...prev, visit_outcome: value }))}
      >
        <Picker.Item label="Interested" value="interested" />
        <Picker.Item label="Not Interested" value="not_interested" />
        <Picker.Item label="Follow Up Needed" value="follow_up_needed" />
        <Picker.Item label="Already Customer" value="already_customer" />
        <Picker.Item label="Competitor Locked" value="competitor_locked" />
      </Picker>

      <Text style={styles.label}>Project Segment</Text>
      <Picker
        selectedValue={formData.project_segment}
        style={styles.picker}
        onValueChange={(value) => setFormData(prev => ({ ...prev, project_segment: value }))}
      >
        <Picker.Item label="Decorative" value="decorative" />
        <Picker.Item label="Floor" value="floor" />
        <Picker.Item label="Marine" value="marine" />
        <Picker.Item label="Protective" value="protective" />
        <Picker.Item label="Steel" value="steel" />
        <Picker.Item label="Waterproofing" value="waterproofing" />
        <Picker.Item label="Others" value="others" />
      </Picker>

      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={formData.general_notes}
        onChangeText={(text) => setFormData(prev => ({ ...prev, general_notes: text }))}
        placeholder="Enter notes about the visit"
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Report</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

---

## 🔧 Development Scripts

### package.json scripts
```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "build:android": "eas build --platform android",
    "build:ios": "eas build --platform ios",
    "submit:android": "eas submit --platform android",
    "submit:ios": "eas submit --platform ios",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

---

## 🚀 Build & Deployment

### 1. Configure EAS Build (`eas.json`)
```json
{
  "cli": {
    "version": ">= 3.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

### 2. Build Commands
```bash
# Development build
eas build --profile development --platform ios

# Preview build
eas build --profile preview --platform android

# Production build
eas build --profile production --platform all
```

---

## 🧪 Testing

### 1. Unit Tests (`__tests__/services/canvassingService.test.ts`)
```typescript
import { CanvassingService } from '../../services/canvassingService';

describe('CanvassingService', () => {
  test('should create a canvassing report', async () => {
    const reportData = {
      company_name: 'Test Company',
      visit_outcome: 'interested',
      sales_rep_id: 'test-user-id',
    };

    const result = await CanvassingService.createReport(reportData);
    expect(result).toBeDefined();
    expect(result.company_name).toBe('Test Company');
  });
});
```

### 2. Integration Tests
```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm test -- --coverage
```

---

## 🐛 Debugging

### 1. Debug Configuration
```typescript
// Debug mode detection
const __DEV__ = process.env.NODE_ENV === 'development';

// Logging utility
export const logger = {
  log: (message: string, data?: any) => {
    if (__DEV__) {
      console.log(`[PakeAja] ${message}`, data);
    }
  },
  error: (message: string, error?: any) => {
    if (__DEV__) {
      console.error(`[PakeAja Error] ${message}`, error);
    }
  },
};
```

### 2. Performance Monitoring
```typescript
// Performance tracking
export const performance = {
  mark: (name: string) => {
    if (__DEV__) {
      console.time(name);
    }
  },
  measure: (name: string) => {
    if (__DEV__) {
      console.timeEnd(name);
    }
  },
};
```

---

## 📱 Platform-Specific Considerations

### iOS
- Configure signing certificates in EAS
- Add required permissions in Info.plist
- Test on physical devices for location features

### Android
- Configure Google Play signing
- Add location permissions in AndroidManifest.xml
- Test on various screen sizes

---

## 🔒 Security Best Practices

### 1. Environment Variables
```typescript
// Never commit sensitive data
const config = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL!,
  supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
};

// Validate environment variables
if (!config.supabaseUrl || !config.supabaseKey) {
  throw new Error('Missing required environment variables');
}
```

### 2. Data Validation
```typescript
// Input validation
const validateCanvassingReport = (data: any) => {
  const errors: string[] = [];
  
  if (!data.company_name?.trim()) {
    errors.push('Company name is required');
  }
  
  if (!data.visit_outcome) {
    errors.push('Visit outcome is required');
  }
  
  return errors;
};
```

---

## 📞 Support & Resources

### Development Team Contacts
- **Backend Lead**: [Contact Info]
- **Mobile Lead**: [Contact Info]
- **DevOps**: [Contact Info]

### Documentation Links
- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)

### Useful Commands
```bash
# Check dependencies
npm outdated

# Update dependencies
npm update

# Clean cache
expo r -c

# Reset Metro cache
npx react-native start --reset-cache
```

---

**🚀 Ready to Start**: Follow the setup steps above and you'll have a fully functional mobile app development environment! 