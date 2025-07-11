import 'package:flutter/material.dart';
import '../../../core/constants/constants.dart';

/// A widget that builds different layouts based on screen size
/// 
/// Example usage:
/// ```dart
/// ResponsiveBuilder(
///   mobile: MobileLayout(),
///   tablet: TabletLayout(),
///   desktop: DesktopLayout(),
/// )
/// ```
class ResponsiveBuilder extends StatelessWidget {
  final Widget mobile;
  final Widget? tablet;
  final Widget? desktop;
  final double tabletBreakpoint;
  final double desktopBreakpoint;
  
  const ResponsiveBuilder({
    Key? key,
    required this.mobile,
    this.tablet,
    this.desktop,
    this.tabletBreakpoint = UIConstants.breakpointTablet,
    this.desktopBreakpoint = UIConstants.breakpointDesktop,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth >= desktopBreakpoint && desktop != null) {
          return desktop!;
        } else if (constraints.maxWidth >= tabletBreakpoint && tablet != null) {
          return tablet!;
        } else {
          return mobile;
        }
      },
    );
  }
  
  /// Get the current breakpoint
  static ScreenSize getScreenSize(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    
    if (width >= UIConstants.breakpointDesktop) {
      return ScreenSize.desktop;
    } else if (width >= UIConstants.breakpointTablet) {
      return ScreenSize.tablet;
    } else {
      return ScreenSize.mobile;
    }
  }
  
  /// Check if current screen is mobile
  static bool isMobile(BuildContext context) {
    return getScreenSize(context) == ScreenSize.mobile;
  }
  
  /// Check if current screen is tablet
  static bool isTablet(BuildContext context) {
    return getScreenSize(context) == ScreenSize.tablet;
  }
  
  /// Check if current screen is desktop
  static bool isDesktop(BuildContext context) {
    return getScreenSize(context) == ScreenSize.desktop;
  }
  
  /// Check if current screen is tablet or larger
  static bool isTabletOrLarger(BuildContext context) {
    final screenSize = getScreenSize(context);
    return screenSize == ScreenSize.tablet || screenSize == ScreenSize.desktop;
  }
  
  /// Get responsive value based on screen size
  static T value<T>(
    BuildContext context, {
    required T mobile,
    T? tablet,
    T? desktop,
  }) {
    final screenSize = getScreenSize(context);
    
    switch (screenSize) {
      case ScreenSize.desktop:
        return desktop ?? tablet ?? mobile;
      case ScreenSize.tablet:
        return tablet ?? mobile;
      case ScreenSize.mobile:
        return mobile;
    }
  }
}

/// Screen size enum
enum ScreenSize {
  mobile,
  tablet,
  desktop,
}

/// Responsive grid layout
class ResponsiveGrid extends StatelessWidget {
  final List<Widget> children;
  final int mobileColumns;
  final int tabletColumns;
  final int desktopColumns;
  final double spacing;
  final double runSpacing;
  final EdgeInsetsGeometry? padding;
  
  const ResponsiveGrid({
    Key? key,
    required this.children,
    this.mobileColumns = 1,
    this.tabletColumns = 2,
    this.desktopColumns = 3,
    this.spacing = 16,
    this.runSpacing = 16,
    this.padding,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final columns = ResponsiveBuilder.value<int>(
      context,
      mobile: mobileColumns,
      tablet: tabletColumns,
      desktop: desktopColumns,
    );
    
    return Padding(
      padding: padding ?? EdgeInsets.zero,
      child: LayoutBuilder(
        builder: (context, constraints) {
          final itemWidth = (constraints.maxWidth - (columns - 1) * spacing) / columns;
          
          return Wrap(
            spacing: spacing,
            runSpacing: runSpacing,
            children: children.map((child) {
              return SizedBox(
                width: itemWidth,
                child: child,
              );
            }).toList(),
          );
        },
      ),
    );
  }
}

/// Responsive padding widget
class ResponsivePadding extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry mobile;
  final EdgeInsetsGeometry? tablet;
  final EdgeInsetsGeometry? desktop;
  
  const ResponsivePadding({
    Key? key,
    required this.child,
    required this.mobile,
    this.tablet,
    this.desktop,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final padding = ResponsiveBuilder.value<EdgeInsetsGeometry>(
      context,
      mobile: mobile,
      tablet: tablet,
      desktop: desktop,
    );
    
    return Padding(
      padding: padding,
      child: child,
    );
  }
}

/// Responsive container with max width
class ResponsiveContainer extends StatelessWidget {
  final Widget child;
  final double? maxWidth;
  final double mobileMaxWidth;
  final double tabletMaxWidth;
  final double desktopMaxWidth;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final AlignmentGeometry alignment;
  
  const ResponsiveContainer({
    Key? key,
    required this.child,
    this.maxWidth,
    this.mobileMaxWidth = double.infinity,
    this.tabletMaxWidth = 768,
    this.desktopMaxWidth = 1200,
    this.padding,
    this.margin,
    this.alignment = Alignment.center,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final responsiveMaxWidth = maxWidth ??
        ResponsiveBuilder.value<double>(
          context,
          mobile: mobileMaxWidth,
          tablet: tabletMaxWidth,
          desktop: desktopMaxWidth,
        );
    
    return Container(
      alignment: alignment,
      margin: margin,
      child: Container(
        constraints: BoxConstraints(
          maxWidth: responsiveMaxWidth,
        ),
        padding: padding,
        child: child,
      ),
    );
  }
}

/// Responsive visibility widget
class ResponsiveVisibility extends StatelessWidget {
  final Widget child;
  final bool mobile;
  final bool tablet;
  final bool desktop;
  final Widget? replacement;
  
  const ResponsiveVisibility({
    Key? key,
    required this.child,
    this.mobile = true,
    this.tablet = true,
    this.desktop = true,
    this.replacement,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final screenSize = ResponsiveBuilder.getScreenSize(context);
    bool isVisible = false;
    
    switch (screenSize) {
      case ScreenSize.mobile:
        isVisible = mobile;
        break;
      case ScreenSize.tablet:
        isVisible = tablet;
        break;
      case ScreenSize.desktop:
        isVisible = desktop;
        break;
    }
    
    if (isVisible) {
      return child;
    } else if (replacement != null) {
      return replacement!;
    } else {
      return const SizedBox.shrink();
    }
  }
}