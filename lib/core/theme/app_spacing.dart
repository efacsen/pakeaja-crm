import 'package:flutter/material.dart';

/// Consistent spacing system based on 8pt grid
class AppSpacing {
  // Private constructor to prevent instantiation
  AppSpacing._();
  
  // Base unit
  static const double unit = 8.0;
  
  // Spacing scale
  static const double xxxs = unit * 0.25; // 2
  static const double xxs = unit * 0.5;   // 4
  static const double xs = unit * 1;      // 8
  static const double sm = unit * 1.5;    // 12
  static const double md = unit * 2;      // 16
  static const double lg = unit * 3;      // 24
  static const double xl = unit * 4;      // 32
  static const double xxl = unit * 5;     // 40
  static const double xxxl = unit * 6;    // 48
  static const double xxxxl = unit * 8;   // 64
  
  // Component-specific spacing
  static const double cardPadding = md;
  static const double screenPadding = md;
  static const double sectionSpacing = lg;
  static const double listItemSpacing = sm;
  static const double iconTextSpacing = xs;
  static const double buttonPadding = sm;
  
  // EdgeInsets helpers
  static const EdgeInsets zero = EdgeInsets.zero;
  
  // All sides
  static const EdgeInsets allXXS = EdgeInsets.all(xxs);
  static const EdgeInsets allXS = EdgeInsets.all(xs);
  static const EdgeInsets allSM = EdgeInsets.all(sm);
  static const EdgeInsets allMD = EdgeInsets.all(md);
  static const EdgeInsets allLG = EdgeInsets.all(lg);
  static const EdgeInsets allXL = EdgeInsets.all(xl);
  static const EdgeInsets allXXL = EdgeInsets.all(xxl);
  
  // Horizontal
  static const EdgeInsets horizontalXXS = EdgeInsets.symmetric(horizontal: xxs);
  static const EdgeInsets horizontalXS = EdgeInsets.symmetric(horizontal: xs);
  static const EdgeInsets horizontalSM = EdgeInsets.symmetric(horizontal: sm);
  static const EdgeInsets horizontalMD = EdgeInsets.symmetric(horizontal: md);
  static const EdgeInsets horizontalLG = EdgeInsets.symmetric(horizontal: lg);
  static const EdgeInsets horizontalXL = EdgeInsets.symmetric(horizontal: xl);
  static const EdgeInsets horizontalXXL = EdgeInsets.symmetric(horizontal: xxl);
  
  // Vertical
  static const EdgeInsets verticalXXS = EdgeInsets.symmetric(vertical: xxs);
  static const EdgeInsets verticalXS = EdgeInsets.symmetric(vertical: xs);
  static const EdgeInsets verticalSM = EdgeInsets.symmetric(vertical: sm);
  static const EdgeInsets verticalMD = EdgeInsets.symmetric(vertical: md);
  static const EdgeInsets verticalLG = EdgeInsets.symmetric(vertical: lg);
  static const EdgeInsets verticalXL = EdgeInsets.symmetric(vertical: xl);
  static const EdgeInsets verticalXXL = EdgeInsets.symmetric(vertical: xxl);
  
  // Common patterns
  static const EdgeInsets screenPaddingHorizontal = horizontalMD;
  static const EdgeInsets screenPaddingVertical = verticalMD;
  static const EdgeInsets screenPaddingAll = allMD;
  
  static const EdgeInsets cardPaddingAll = allMD;
  static const EdgeInsets listTilePadding = EdgeInsets.symmetric(
    horizontal: md,
    vertical: sm,
  );
  
  static const EdgeInsets buttonPaddingHorizontal = EdgeInsets.symmetric(
    horizontal: lg,
    vertical: sm,
  );
  
  static const EdgeInsets buttonPaddingVertical = EdgeInsets.symmetric(
    horizontal: md,
    vertical: md,
  );
  
  // Dynamic spacing methods
  static EdgeInsets all(double value) => EdgeInsets.all(value);
  
  static EdgeInsets symmetric({
    double horizontal = 0.0,
    double vertical = 0.0,
  }) {
    return EdgeInsets.symmetric(
      horizontal: horizontal,
      vertical: vertical,
    );
  }
  
  static EdgeInsets only({
    double left = 0.0,
    double top = 0.0,
    double right = 0.0,
    double bottom = 0.0,
  }) {
    return EdgeInsets.only(
      left: left,
      top: top,
      right: right,
      bottom: bottom,
    );
  }
  
  // SizedBox helpers
  static const SizedBox heightXXS = SizedBox(height: xxs);
  static const SizedBox heightXS = SizedBox(height: xs);
  static const SizedBox heightSM = SizedBox(height: sm);
  static const SizedBox heightMD = SizedBox(height: md);
  static const SizedBox heightLG = SizedBox(height: lg);
  static const SizedBox heightXL = SizedBox(height: xl);
  static const SizedBox heightXXL = SizedBox(height: xxl);
  
  static const SizedBox widthXXS = SizedBox(width: xxs);
  static const SizedBox widthXS = SizedBox(width: xs);
  static const SizedBox widthSM = SizedBox(width: sm);
  static const SizedBox widthMD = SizedBox(width: md);
  static const SizedBox widthLG = SizedBox(width: lg);
  static const SizedBox widthXL = SizedBox(width: xl);
  static const SizedBox widthXXL = SizedBox(width: xxl);
  
  // Dynamic sized box
  static SizedBox height(double value) => SizedBox(height: value);
  static SizedBox width(double value) => SizedBox(width: value);
  
  // Radius values
  static const double radiusXS = xxs;   // 4
  static const double radiusSM = xs;    // 8
  static const double radiusMD = sm;    // 12
  static const double radiusLG = md;    // 16
  static const double radiusXL = lg;    // 24
  static const double radiusFull = 9999; // Full radius
  
  // BorderRadius helpers
  static const BorderRadius borderRadiusXS = BorderRadius.all(Radius.circular(radiusXS));
  static const BorderRadius borderRadiusSM = BorderRadius.all(Radius.circular(radiusSM));
  static const BorderRadius borderRadiusMD = BorderRadius.all(Radius.circular(radiusMD));
  static const BorderRadius borderRadiusLG = BorderRadius.all(Radius.circular(radiusLG));
  static const BorderRadius borderRadiusXL = BorderRadius.all(Radius.circular(radiusXL));
  static const BorderRadius borderRadiusFull = BorderRadius.all(Radius.circular(radiusFull));
  
  // Common component radius
  static const BorderRadius cardRadius = borderRadiusMD;
  static const BorderRadius buttonRadius = borderRadiusSM;
  static const BorderRadius inputRadius = borderRadiusSM;
  static const BorderRadius modalRadius = borderRadiusLG;
}