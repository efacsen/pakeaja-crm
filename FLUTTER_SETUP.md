# Flutter Setup Instructions

## Prerequisites

Before you can run the PakeAja CRM mobile app, you need to install Flutter SDK on your system.

### Install Flutter SDK

1. **Download Flutter SDK**
   - Visit: https://flutter.dev/docs/get-started/install
   - Choose your operating system and follow the installation guide

2. **Add Flutter to PATH**
   ```bash
   # Add to your shell configuration file (.bashrc, .zshrc, etc.)
   export PATH="$PATH:[PATH_TO_FLUTTER_SDK]/bin"
   ```

3. **Verify Installation**
   ```bash
   flutter doctor
   ```

### Project Setup

1. **Install Dependencies**
   ```bash
   flutter pub get
   ```

2. **Run the App**
   ```bash
   # For iOS (requires macOS with Xcode)
   flutter run -d ios
   
   # For Android
   flutter run -d android
   
   # List available devices
   flutter devices
   ```

### Environment Configuration

1. **Create .env file** (optional)
   ```bash
   # Create .env file in project root
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   Note: The app will run without these credentials but won't connect to Supabase backend.

### Troubleshooting

1. **Flutter not found**
   - Ensure Flutter is properly installed and added to PATH
   - Restart your terminal after installation

2. **No devices available**
   - For iOS: Ensure Xcode is installed and simulator is running
   - For Android: Ensure Android Studio/emulator is installed and running

3. **Dependency issues**
   ```bash
   # Clean and get dependencies
   flutter clean
   flutter pub get
   ```

### Development Workflow

1. **Hot Reload**: Press `r` in terminal while app is running
2. **Hot Restart**: Press `R` in terminal for full restart
3. **Debug Mode**: App runs in debug mode by default with Flutter banner

### Working with Worktrees

Each worktree now has the same Flutter setup. To work on a specific feature:

```bash
# Navigate to worktree
cd ../mobile-app-daily-reports

# Install dependencies
flutter pub get

# Run the app
flutter run
```

### Next Steps

1. Install Flutter SDK following the instructions above
2. Run `flutter doctor` to verify setup
3. Run `flutter pub get` to install dependencies
4. Run `flutter run` to launch the app
5. Start developing your assigned feature!