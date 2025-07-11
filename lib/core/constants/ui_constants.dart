import 'package:flutter/material.dart';

/// UI-related constants used throughout the app
class UIConstants {
  // Private constructor to prevent instantiation
  UIConstants._();
  
  // Animation Durations
  static const Duration animationFast = Duration(milliseconds: 200);
  static const Duration animationNormal = Duration(milliseconds: 300);
  static const Duration animationSlow = Duration(milliseconds: 500);
  static const Duration animationSlowest = Duration(milliseconds: 1000);
  
  // Animation Curves
  static const Curve defaultCurve = Curves.easeInOut;
  static const Curve bounceCurve = Curves.bounceOut;
  static const Curve elasticCurve = Curves.elasticOut;
  
  // Elevation values
  static const double elevationZero = 0;
  static const double elevationXS = 1;
  static const double elevationSM = 2;
  static const double elevationMD = 4;
  static const double elevationLG = 8;
  static const double elevationXL = 12;
  static const double elevationXXL = 16;
  
  // Icon Sizes
  static const double iconSizeXS = 16;
  static const double iconSizeSM = 20;
  static const double iconSizeMD = 24;
  static const double iconSizeLG = 32;
  static const double iconSizeXL = 40;
  static const double iconSizeXXL = 48;
  
  // Avatar Sizes
  static const double avatarSizeXS = 24;
  static const double avatarSizeSM = 32;
  static const double avatarSizeMD = 40;
  static const double avatarSizeLG = 56;
  static const double avatarSizeXL = 72;
  static const double avatarSizeXXL = 96;
  
  // Loading Indicator Sizes
  static const double loaderSizeSM = 16;
  static const double loaderSizeMD = 24;
  static const double loaderSizeLG = 36;
  
  // Button Heights
  static const double buttonHeightSM = 32;
  static const double buttonHeightMD = 40;
  static const double buttonHeightLG = 48;
  static const double buttonHeightXL = 56;
  
  // Input Field Heights
  static const double inputHeightSM = 40;
  static const double inputHeightMD = 48;
  static const double inputHeightLG = 56;
  
  // AppBar Heights
  static const double appBarHeight = 56;
  static const double appBarHeightLarge = 64;
  
  // Bottom Navigation Heights
  static const double bottomNavHeight = 56;
  static const double bottomNavHeightWithLabel = 72;
  
  // Card Dimensions
  static const double cardMinHeight = 80;
  static const double cardMaxWidth = 400;
  
  // Modal Dimensions
  static const double modalMaxWidth = 560;
  static const double bottomSheetMaxHeight = 0.9; // 90% of screen height
  
  // Opacity values
  static const double opacityDisabled = 0.38;
  static const double opacityMedium = 0.6;
  static const double opacityHigh = 0.87;
  static const double opacityFull = 1.0;
  
  // Blur values
  static const double blurNone = 0;
  static const double blurSM = 4;
  static const double blurMD = 8;
  static const double blurLG = 16;
  static const double blurXL = 24;
  
  // Z-index values (for Stack widgets)
  static const int zIndexDefault = 0;
  static const int zIndexDropdown = 1000;
  static const int zIndexModal = 2000;
  static const int zIndexTooltip = 3000;
  static const int zIndexNotification = 4000;
  static const int zIndexMax = 9999;
  
  // Breakpoints for responsive design
  static const double breakpointMobile = 0;
  static const double breakpointTablet = 600;
  static const double breakpointDesktop = 1024;
  static const double breakpointWide = 1440;
  
  // Grid values
  static const int gridColumnsMobile = 4;
  static const int gridColumnsTablet = 8;
  static const int gridColumnsDesktop = 12;
  
  // Aspect Ratios
  static const double aspectRatio1x1 = 1.0;
  static const double aspectRatio4x3 = 4 / 3;
  static const double aspectRatio16x9 = 16 / 9;
  static const double aspectRatio21x9 = 21 / 9;
  static const double aspectRatioGolden = 1.618;
  
  // List Item Heights
  static const double listItemHeightSM = 48;
  static const double listItemHeightMD = 56;
  static const double listItemHeightLG = 72;
  static const double listItemHeightXL = 88;
  
  // Divider Thickness
  static const double dividerThicknessThin = 0.5;
  static const double dividerThicknessDefault = 1.0;
  static const double dividerThicknessThick = 2.0;
  
  // Progress Indicator Stroke Width
  static const double progressStrokeWidthSM = 2;
  static const double progressStrokeWidthMD = 3;
  static const double progressStrokeWidthLG = 4;
  
  // Shimmer Animation
  static const Duration shimmerDuration = Duration(milliseconds: 1500);
  static const double shimmerBaseOpacity = 0.1;
  static const double shimmerHighlightOpacity = 0.2;
  
  // Swipe Thresholds
  static const double swipeThreshold = 0.4; // 40% of screen width
  static const double swipeVelocityThreshold = 300.0;
  
  // Debounce/Throttle Durations
  static const Duration debounceDuration = Duration(milliseconds: 300);
  static const Duration throttleDuration = Duration(milliseconds: 100);
  
  // Snackbar Durations
  static const Duration snackbarDurationShort = Duration(seconds: 2);
  static const Duration snackbarDurationMedium = Duration(seconds: 3);
  static const Duration snackbarDurationLong = Duration(seconds: 5);
  
  // Max values
  static const int maxTextLength = 255;
  static const int maxDescriptionLength = 500;
  static const int maxFileSize = 10 * 1024 * 1024; // 10MB
  static const int maxImageSize = 5 * 1024 * 1024; // 5MB
  
  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;
}