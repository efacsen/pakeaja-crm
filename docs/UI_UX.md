# 🎨 PakeAja CRM Mobile App - UI/UX Design Guidelines

## Design Philosophy

The PakeAja CRM Mobile App follows a **field-first design approach**, prioritizing ease of use in challenging outdoor conditions with one-handed operation, high visibility, and minimal cognitive load.

### Core Principles
1. **Thumb-Friendly**: All primary actions within thumb reach
2. **High Contrast**: Readable in bright sunlight
3. **Large Touch Targets**: Minimum 48x48dp for all interactive elements
4. **Offline Indicators**: Clear visual feedback for connectivity status
5. **Progressive Disclosure**: Show only essential information first

## Design System

### Color Palette

```dart
// Primary Colors
const Color primaryBlue = Color(0xFF1976D2);      // Main brand color
const Color primaryDark = Color(0xFF004BA0);      // Pressed states
const Color primaryLight = Color(0xFF63A4FF);     // Highlights

// Secondary Colors  
const Color secondaryOrange = Color(0xFFFF6F00);  // CTAs, alerts
const Color secondaryGreen = Color(0xFF43A047);   // Success states
const Color secondaryRed = Color(0xFFE53935);     // Errors, deletions

// Neutral Colors
const Color neutral100 = Color(0xFFF5F5F5);       // Backgrounds
const Color neutral200 = Color(0xFFEEEEEE);       // Disabled states
const Color neutral300 = Color(0xFFE0E0E0);       // Borders
const Color neutral400 = Color(0xFFBDBDBD);       // Placeholders
const Color neutral500 = Color(0xFF9E9E9E);       // Secondary text
const Color neutral600 = Color(0xFF757575);       // Icons
const Color neutral700 = Color(0xFF616161);       // Body text
const Color neutral800 = Color(0xFF424242);       // Headings
const Color neutral900 = Color(0xFF212121);       // Primary text

// Semantic Colors
const Color success = Color(0xFF4CAF50);
const Color warning = Color(0xFFFF9800);
const Color error = Color(0xFFF44336);
const Color info = Color(0xFF2196F3);

// Offline/Online Indicators
const Color offlineGray = Color(0xFF9E9E9E);
const Color onlineGreen = Color(0xFF4CAF50);
const Color syncingBlue = Color(0xFF2196F3);
```

### Typography

```dart
// Text Styles
class AppTextStyles {
  // Headings
  static const TextStyle h1 = TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.bold,
    height: 1.2,
    letterSpacing: -0.5,
  );
  
  static const TextStyle h2 = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    height: 1.3,
  );
  
  static const TextStyle h3 = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.w600,
    height: 1.4,
  );
  
  // Body Text
  static const TextStyle bodyLarge = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.normal,
    height: 1.5,
  );
  
  static const TextStyle bodyMedium = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.normal,
    height: 1.5,
  );
  
  static const TextStyle bodySmall = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.normal,
    height: 1.4,
  );
  
  // Labels
  static const TextStyle labelLarge = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w500,
    letterSpacing: 0.1,
  );
  
  static const TextStyle caption = TextStyle(
    fontSize: 12,
    fontWeight: FontWeight.normal,
    letterSpacing: 0.4,
  );
  
  // Buttons
  static const TextStyle button = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.w600,
    letterSpacing: 1.25,
  );
}
```

### Spacing System

```dart
class AppSpacing {
  static const double xs = 4.0;   // Tight spacing
  static const double sm = 8.0;   // Small elements
  static const double md = 16.0;  // Default spacing
  static const double lg = 24.0;  // Section spacing
  static const double xl = 32.0;  // Large sections
  static const double xxl = 48.0; // Page margins
}
```

### Component Library

#### 1. Buttons

```dart
// Primary Button
ElevatedButton(
  style: ElevatedButton.styleFrom(
    backgroundColor: primaryBlue,
    foregroundColor: Colors.white,
    minimumSize: Size(double.infinity, 48),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(8),
    ),
    elevation: 2,
  ),
  onPressed: () {},
  child: Text('SUBMIT REPORT'),
);

// Secondary Button
OutlinedButton(
  style: OutlinedButton.styleFrom(
    foregroundColor: primaryBlue,
    minimumSize: Size(double.infinity, 48),
    side: BorderSide(color: primaryBlue, width: 2),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(8),
    ),
  ),
  onPressed: () {},
  child: Text('SAVE DRAFT'),
);

// Icon Button
IconButton.filled(
  icon: Icon(Icons.camera_alt),
  onPressed: () {},
  style: IconButton.styleFrom(
    backgroundColor: primaryBlue,
    foregroundColor: Colors.white,
    minimumSize: Size(56, 56),
  ),
);
```

#### 2. Input Fields

```dart
// Text Input
TextFormField(
  decoration: InputDecoration(
    labelText: 'Company Name',
    hintText: 'Enter company name',
    prefixIcon: Icon(Icons.business),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
    ),
    filled: true,
    fillColor: neutral100,
    contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 16),
  ),
);

// Dropdown
DropdownButtonFormField<String>(
  decoration: InputDecoration(
    labelText: 'Visit Outcome',
    prefixIcon: Icon(Icons.assignment_turned_in),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(8),
    ),
    filled: true,
    fillColor: neutral100,
  ),
  items: [...],
  onChanged: (value) {},
);
```

#### 3. Cards

```dart
// Info Card
Card(
  elevation: 2,
  shape: RoundedRectangleBorder(
    borderRadius: BorderRadius.circular(12),
  ),
  child: Padding(
    padding: EdgeInsets.all(16),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(Icons.business, color: primaryBlue),
            SizedBox(width: 8),
            Text('Company Name', style: AppTextStyles.h3),
          ],
        ),
        SizedBox(height: 8),
        Text('Contact: John Doe', style: AppTextStyles.bodyMedium),
        Text('Phone: +62 812 3456 7890', style: AppTextStyles.bodySmall),
      ],
    ),
  ),
);
```

## Screen Designs

### 1. Login Screen

```
┌─────────────────────────────┐
│         Status Bar          │
├─────────────────────────────┤
│                             │
│      [Logo - 120x120]       │
│                             │
│      PakeAja CRM            │
│   Field Sales Solution      │
│                             │
├─────────────────────────────┤
│                             │
│  ┌───────────────────────┐  │
│  │ 📧 Email              │  │
│  └───────────────────────┘  │
│                             │
│  ┌───────────────────────┐  │
│  │ 🔒 Password           │  │
│  └───────────────────────┘  │
│                             │
│  □ Remember me              │
│                             │
│  ┌───────────────────────┐  │
│  │     SIGN IN           │  │
│  └───────────────────────┘  │
│                             │
│  ─────── OR ───────         │
│                             │
│  ┌───────────────────────┐  │
│  │  🔐 Use Biometric     │  │
│  └───────────────────────┘  │
│                             │
└─────────────────────────────┘
```

### 2. Home Dashboard

```
┌─────────────────────────────┐
│  9:41 AM    📶 🔋 85%       │
├─────────────────────────────┤
│  Hello, Ahmad!              │
│  Tuesday, 10 Jan 2025       │
├─────────────────────────────┤
│  ┌─────────────────────┐    │
│  │ 🔄 Sync Status      │    │
│  │ ● Online - Synced   │    │
│  │ Last: 2 mins ago    │    │
│  └─────────────────────┘    │
├─────────────────────────────┤
│  Quick Actions              │
│  ┌─────┐ ┌─────┐ ┌─────┐   │
│  │ 📝  │ │ 📍  │ │ 📊  │   │
│  │Daily│ │Canvas│ │ View │   │
│  │Report│ │ sing │ │Reports│  │
│  └─────┘ └─────┘ └─────┘   │
├─────────────────────────────┤
│  Today's Summary            │
│  ┌─────────────────────┐    │
│  │ Visits:     5 ✅    │    │
│  │ Calls:     12 📞   │    │
│  │ Proposals:  2 📄   │    │
│  └─────────────────────┘    │
├─────────────────────────────┤
│  Pending Sync (3)           │
│  ┌─────────────────────┐    │
│  │ 🔄 PT. ABC - Report │    │
│  │ 🔄 CV. XYZ - Canvas │    │
│  │ 🔄 Daily Report 9/1 │    │
│  └─────────────────────┘    │
└─────────────────────────────┘
```

### 3. Daily Report Form

```
┌─────────────────────────────┐
│  < Back    Daily Report  ✓  │
├─────────────────────────────┤
│  Tuesday, 10 January 2025   │
├─────────────────────────────┤
│  Activities                 │
│  ┌─────────────────────┐    │
│  │ Customer Visits     │    │
│  │ [    5    ]  👥     │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │ Phone Calls         │    │
│  │ [   12    ]  📞     │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │ Proposals Sent      │    │
│  │ [    2    ]  📄     │    │
│  └─────────────────────┘    │
├─────────────────────────────┤
│  Summary                    │
│  ┌─────────────────────┐    │
│  │ What happened today?│    │
│  │                     │    │
│  │ __________________ │    │
│  │ __________________ │    │
│  └─────────────────────┘    │
├─────────────────────────────┤
│  Tomorrow's Plan            │
│  ┌─────────────────────┐    │
│  │ What's planned?     │    │
│  │                     │    │
│  │ __________________ │    │
│  └─────────────────────┘    │
├─────────────────────────────┤
│ ┌──────────┐ ┌────────────┐ │
│ │SAVE DRAFT│ │SUBMIT REPORT│ │
│ └──────────┘ └────────────┘ │
└─────────────────────────────┘
```

### 4. Canvassing Form

```
┌─────────────────────────────┐
│  < Back    Canvassing    📍 │
├─────────────────────────────┤
│  Company Information        │
│  ┌─────────────────────┐    │
│  │ 🏢 Company Name     │    │
│  │ [PT. Example____]   │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │ 📍 Address (Auto)   │    │
│  │ [Jl. Sudirman...] 🔄│    │
│  └─────────────────────┘    │
├─────────────────────────────┤
│  Contact Person             │
│  ┌─────────────────────┐    │
│  │ 👤 Name             │    │
│  │ [________________]  │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │ 💼 Position         │    │
│  │ [________________]  │    │
│  └─────────────────────┘    │
│  ┌─────────────────────┐    │
│  │ 📱 Phone            │    │
│  │ [+62___________]    │    │
│  └─────────────────────┘    │
├─────────────────────────────┤
│  Visit Outcome              │
│  ┌─────────────────────┐    │
│  │ ○ Interested       │    │
│  │ ○ Not Interested   │    │
│  │ ● Follow-up Needed │    │
│  │ ○ Already Customer │    │
│  └─────────────────────┘    │
├─────────────────────────────┤
│  Photos (2/5)               │
│  ┌────┐ ┌────┐ ┌────┐      │
│  │ 📷 │ │ 📷 │ │ + │      │
│  │Img1│ │Img2│ │Add │      │
│  └────┘ └────┘ └────┘      │
├─────────────────────────────┤
│  ┌────────────────────┐     │
│  │   SAVE CANVASSING  │     │
│  └────────────────────┘     │
└─────────────────────────────┘
```

## Interaction Patterns

### 1. Offline Mode Indicators

```dart
// Sync Status Widget
Container(
  padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
  decoration: BoxDecoration(
    color: isOnline ? onlineGreen.withOpacity(0.1) : offlineGray.withOpacity(0.1),
    borderRadius: BorderRadius.circular(20),
    border: Border.all(
      color: isOnline ? onlineGreen : offlineGray,
    ),
  ),
  child: Row(
    mainAxisSize: MainAxisSize.min,
    children: [
      Icon(
        isOnline ? Icons.cloud_done : Icons.cloud_off,
        size: 16,
        color: isOnline ? onlineGreen : offlineGray,
      ),
      SizedBox(width: 4),
      Text(
        isOnline ? 'Online' : 'Offline',
        style: TextStyle(
          color: isOnline ? onlineGreen : offlineGray,
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
      ),
    ],
  ),
);
```

### 2. Loading States

```dart
// Shimmer Loading
Shimmer.fromColors(
  baseColor: Colors.grey[300]!,
  highlightColor: Colors.grey[100]!,
  child: Container(
    height: 80,
    margin: EdgeInsets.symmetric(vertical: 8),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(8),
    ),
  ),
);

// Pull to Refresh
RefreshIndicator(
  color: primaryBlue,
  onRefresh: () async {
    await ref.refresh(dataProvider);
  },
  child: ListView(...),
);
```

### 3. Empty States

```dart
Center(
  child: Column(
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      Icon(
        Icons.inbox_outlined,
        size: 64,
        color: neutral400,
      ),
      SizedBox(height: 16),
      Text(
        'No reports yet',
        style: AppTextStyles.h3.copyWith(color: neutral600),
      ),
      SizedBox(height: 8),
      Text(
        'Start by creating your first daily report',
        style: AppTextStyles.bodyMedium.copyWith(color: neutral500),
        textAlign: TextAlign.center,
      ),
      SizedBox(height: 24),
      ElevatedButton(
        onPressed: () {},
        child: Text('CREATE REPORT'),
      ),
    ],
  ),
);
```

### 4. Error Handling

```dart
// Error Dialog
showDialog(
  context: context,
  builder: (context) => AlertDialog(
    title: Row(
      children: [
        Icon(Icons.error_outline, color: error),
        SizedBox(width: 8),
        Text('Sync Failed'),
      ],
    ),
    content: Text('Unable to sync data. Please check your connection and try again.'),
    actions: [
      TextButton(
        onPressed: () => Navigator.pop(context),
        child: Text('CANCEL'),
      ),
      ElevatedButton(
        onPressed: () {
          Navigator.pop(context);
          // Retry logic
        },
        child: Text('RETRY'),
      ),
    ],
  ),
);
```

## Navigation Patterns

### Bottom Navigation

```dart
BottomNavigationBar(
  type: BottomNavigationBarType.fixed,
  selectedItemColor: primaryBlue,
  unselectedItemColor: neutral600,
  currentIndex: currentIndex,
  items: [
    BottomNavigationBarItem(
      icon: Icon(Icons.home),
      label: 'Home',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.assignment),
      label: 'Reports',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.location_on),
      label: 'Canvassing',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.inventory_2),
      label: 'Materials',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.more_horiz),
      label: 'More',
    ),
  ],
);
```

### Page Transitions

```dart
// Slide transition for navigation
PageRouteBuilder(
  pageBuilder: (context, animation, secondaryAnimation) => DestinationPage(),
  transitionsBuilder: (context, animation, secondaryAnimation, child) {
    const begin = Offset(1.0, 0.0);
    const end = Offset.zero;
    const curve = Curves.ease;

    var tween = Tween(begin: begin, end: end).chain(
      CurveTween(curve: curve),
    );

    return SlideTransition(
      position: animation.drive(tween),
      child: child,
    );
  },
);
```

## Accessibility

### Guidelines
1. **Minimum touch targets**: 48x48dp
2. **Text contrast**: WCAG AA compliant (4.5:1)
3. **Screen reader support**: All interactive elements labeled
4. **Focus indicators**: Visible focus states
5. **Gesture alternatives**: All gestures have button alternatives

### Implementation

```dart
// Semantic labels
Semantics(
  label: 'Submit daily report',
  hint: 'Double tap to submit your daily report',
  child: ElevatedButton(
    onPressed: submitReport,
    child: Text('SUBMIT'),
  ),
);

// Accessible form fields
TextFormField(
  decoration: InputDecoration(
    labelText: 'Company Name',
    helperText: 'Enter the full company name',
    errorText: hasError ? 'Company name is required' : null,
  ),
  textInputAction: TextInputAction.next,
  onFieldSubmitted: (_) => FocusScope.of(context).nextFocus(),
);
```

## Responsive Design

### Breakpoints
- **Phone**: < 600dp width
- **Tablet**: 600dp - 840dp width
- **Desktop**: > 840dp width (future consideration)

### Adaptive Layouts

```dart
class ResponsiveBuilder extends StatelessWidget {
  final Widget mobile;
  final Widget? tablet;
  
  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth >= 600 && tablet != null) {
          return tablet!;
        }
        return mobile;
      },
    );
  }
}
```

## Animation Guidelines

### Micro-interactions

```dart
// Button press feedback
AnimatedContainer(
  duration: Duration(milliseconds: 100),
  transform: isPressed 
    ? Matrix4.translationValues(0, 2, 0) 
    : Matrix4.translationValues(0, 0, 0),
  child: ElevatedButton(...),
);

// Success checkmark
AnimatedOpacity(
  opacity: isSuccess ? 1.0 : 0.0,
  duration: Duration(milliseconds: 300),
  child: Icon(Icons.check_circle, color: success),
);
```

### Page Transitions

```dart
// Fade and scale transition
FadeTransition(
  opacity: animation,
  child: ScaleTransition(
    scale: Tween<double>(
      begin: 0.95,
      end: 1.0,
    ).animate(animation),
    child: child,
  ),
);
```

## Dark Mode Support

```dart
// Theme definition
class AppTheme {
  static ThemeData lightTheme = ThemeData(
    brightness: Brightness.light,
    primaryColor: primaryBlue,
    scaffoldBackgroundColor: neutral100,
    // ... other light theme properties
  );
  
  static ThemeData darkTheme = ThemeData(
    brightness: Brightness.dark,
    primaryColor: primaryBlue,
    scaffoldBackgroundColor: Color(0xFF121212),
    // ... other dark theme properties
  );
}
```

## Performance Considerations

1. **Image optimization**: Max 1MB per image, compressed to 70% quality
2. **List virtualization**: Use ListView.builder for long lists
3. **Lazy loading**: Load data as needed, not all at once
4. **Caching**: Cache frequently accessed data locally
5. **Animation performance**: Use Transform instead of Container animations

## Testing Guidelines

### Visual Testing
- Test on multiple screen sizes (5", 6", 6.5")
- Test in bright sunlight conditions
- Test with large text accessibility settings
- Test one-handed operation

### Interaction Testing
- Test all touch targets are minimum 48x48dp
- Test offline mode transitions
- Test form validation and error states
- Test loading and empty states

This UI/UX guide ensures consistent, accessible, and performant design across the PakeAja CRM Mobile App, optimized for field sales operations.