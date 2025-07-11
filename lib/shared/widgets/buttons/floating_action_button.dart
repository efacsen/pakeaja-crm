import 'package:flutter/material.dart';
import '../../../core/theme/theme.dart';
import '../../../core/constants/constants.dart';

/// Custom floating action button with variants
/// 
/// Example usage:
/// ```dart
/// CustomFloatingActionButton(
///   icon: Icons.add,
///   onPressed: () => createNew(),
///   label: 'Create',
/// )
/// ```
class CustomFloatingActionButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback? onPressed;
  final String? label;
  final bool isExtended;
  final bool isMini;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final double? elevation;
  final String? tooltip;
  final Object? heroTag;
  final ShapeBorder? shape;
  final Widget? badge;
  
  const CustomFloatingActionButton({
    Key? key,
    required this.icon,
    this.onPressed,
    this.label,
    this.isExtended = false,
    this.isMini = false,
    this.backgroundColor,
    this.foregroundColor,
    this.elevation,
    this.tooltip,
    this.heroTag,
    this.shape,
    this.badge,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Widget iconWidget = Icon(
      icon,
      color: foregroundColor ?? AppColors.textOnPrimary,
    );
    
    if (badge != null) {
      iconWidget = Stack(
        clipBehavior: Clip.none,
        children: [
          iconWidget,
          Positioned(
            right: -8,
            top: -8,
            child: badge!,
          ),
        ],
      );
    }
    
    if (isExtended && label != null) {
      return FloatingActionButton.extended(
        onPressed: onPressed,
        icon: iconWidget,
        label: Text(
          label!,
          style: AppTextStyles.labelLarge.copyWith(
            color: foregroundColor ?? AppColors.textOnPrimary,
            fontWeight: FontWeight.w600,
          ),
        ),
        backgroundColor: backgroundColor ?? AppColors.primary,
        foregroundColor: foregroundColor ?? AppColors.textOnPrimary,
        elevation: elevation,
        tooltip: tooltip,
        heroTag: heroTag,
        shape: shape,
      );
    }
    
    return FloatingActionButton(
      onPressed: onPressed,
      mini: isMini,
      backgroundColor: backgroundColor ?? AppColors.primary,
      foregroundColor: foregroundColor ?? AppColors.textOnPrimary,
      elevation: elevation,
      tooltip: tooltip ?? label,
      heroTag: heroTag,
      shape: shape,
      child: iconWidget,
    );
  }
}

/// Speed dial floating action button
/// 
/// Example usage:
/// ```dart
/// SpeedDialFAB(
///   icon: Icons.add,
///   activeIcon: Icons.close,
///   children: [
///     SpeedDialChild(
///       icon: Icons.camera,
///       label: 'Take Photo',
///       onPressed: () => takePhoto(),
///     ),
///     SpeedDialChild(
///       icon: Icons.image,
///       label: 'Choose Image',
///       onPressed: () => chooseImage(),
///     ),
///   ],
/// )
/// ```
class SpeedDialFAB extends StatefulWidget {
  final IconData icon;
  final IconData? activeIcon;
  final List<SpeedDialChild> children;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final Color? overlayColor;
  final double? elevation;
  final String? tooltip;
  final Object? heroTag;
  final ShapeBorder? shape;
  final Duration animationDuration;
  final Curve animationCurve;
  
  const SpeedDialFAB({
    Key? key,
    required this.icon,
    this.activeIcon,
    required this.children,
    this.backgroundColor,
    this.foregroundColor,
    this.overlayColor,
    this.elevation,
    this.tooltip,
    this.heroTag,
    this.shape,
    this.animationDuration = UIConstants.animationNormal,
    this.animationCurve = Curves.easeInOut,
  }) : super(key: key);

  @override
  State<SpeedDialFAB> createState() => _SpeedDialFABState();
}

class _SpeedDialFABState extends State<SpeedDialFAB>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _expandAnimation;
  bool _isOpen = false;
  
  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: widget.animationDuration,
      vsync: this,
    );
    _expandAnimation = CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve,
      reverseCurve: widget.animationCurve,
    );
  }
  
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
  
  void _toggle() {
    setState(() {
      _isOpen = !_isOpen;
      if (_isOpen) {
        _controller.forward();
      } else {
        _controller.reverse();
      }
    });
  }
  
  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.bottomRight,
      clipBehavior: Clip.none,
      children: [
        if (_isOpen)
          Positioned.fill(
            child: GestureDetector(
              onTap: _toggle,
              child: Container(
                color: widget.overlayColor ?? Colors.black.withOpacity(0.5),
              ),
            ),
          ),
        ..._buildChildren(),
        _buildMainButton(),
      ],
    );
  }
  
  Widget _buildMainButton() {
    return FloatingActionButton(
      onPressed: _toggle,
      backgroundColor: widget.backgroundColor ?? AppColors.primary,
      foregroundColor: widget.foregroundColor ?? AppColors.textOnPrimary,
      elevation: widget.elevation,
      tooltip: widget.tooltip,
      heroTag: widget.heroTag ?? 'speed_dial_main',
      shape: widget.shape,
      child: AnimatedBuilder(
        animation: _expandAnimation,
        builder: (context, child) {
          return Transform.rotate(
            angle: _expandAnimation.value * 0.5 * 3.14159,
            child: Icon(
              _isOpen && widget.activeIcon != null
                  ? widget.activeIcon
                  : widget.icon,
            ),
          );
        },
      ),
    );
  }
  
  List<Widget> _buildChildren() {
    final children = <Widget>[];
    
    for (int i = 0; i < widget.children.length; i++) {
      final child = widget.children[i];
      children.add(
        Positioned(
          bottom: 70.0 + (i + 1) * 60.0,
          right: 0,
          child: AnimatedBuilder(
            animation: _expandAnimation,
            builder: (context, childWidget) {
              return Transform.scale(
                scale: _expandAnimation.value,
                child: Opacity(
                  opacity: _expandAnimation.value,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      if (child.label != null)
                        Container(
                          padding: AppSpacing.symmetric(
                            horizontal: AppSpacing.sm,
                            vertical: AppSpacing.xs,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.neutral800,
                            borderRadius: AppSpacing.borderRadiusSM,
                          ),
                          child: Text(
                            child.label!,
                            style: AppTextStyles.labelMedium.copyWith(
                              color: AppColors.textOnDark,
                            ),
                          ),
                        ),
                      AppSpacing.widthSM,
                      FloatingActionButton.small(
                        onPressed: () {
                          _toggle();
                          child.onPressed?.call();
                        },
                        backgroundColor: child.backgroundColor ?? AppColors.primary,
                        foregroundColor: child.foregroundColor ?? AppColors.textOnPrimary,
                        heroTag: 'speed_dial_child_$i',
                        child: Icon(child.icon),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      );
    }
    
    return children;
  }
}

/// Speed dial child configuration
class SpeedDialChild {
  final IconData icon;
  final String? label;
  final VoidCallback? onPressed;
  final Color? backgroundColor;
  final Color? foregroundColor;
  
  const SpeedDialChild({
    required this.icon,
    this.label,
    this.onPressed,
    this.backgroundColor,
    this.foregroundColor,
  });
}

/// FAB with counter badge
class BadgedFloatingActionButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback? onPressed;
  final int count;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final Color? badgeColor;
  final Color? badgeTextColor;
  final bool showBadge;
  final String? tooltip;
  final Object? heroTag;
  
  const BadgedFloatingActionButton({
    Key? key,
    required this.icon,
    this.onPressed,
    required this.count,
    this.backgroundColor,
    this.foregroundColor,
    this.badgeColor,
    this.badgeTextColor,
    this.showBadge = true,
    this.tooltip,
    this.heroTag,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        FloatingActionButton(
          onPressed: onPressed,
          backgroundColor: backgroundColor ?? AppColors.primary,
          foregroundColor: foregroundColor ?? AppColors.textOnPrimary,
          tooltip: tooltip,
          heroTag: heroTag,
          child: Icon(icon),
        ),
        if (showBadge && count > 0)
          Positioned(
            right: -8,
            top: -8,
            child: Container(
              padding: AppSpacing.all(AppSpacing.xxs),
              decoration: BoxDecoration(
                color: badgeColor ?? AppColors.error,
                shape: BoxShape.circle,
              ),
              constraints: const BoxConstraints(
                minWidth: 24,
                minHeight: 24,
              ),
              child: Text(
                count > 99 ? '99+' : count.toString(),
                style: AppTextStyles.labelSmall.copyWith(
                  color: badgeTextColor ?? AppColors.textOnPrimary,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ),
      ],
    );
  }
}