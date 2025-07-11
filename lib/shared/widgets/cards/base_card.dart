import 'package:flutter/material.dart';
import '../../../core/theme/theme.dart';
import '../../../core/constants/constants.dart';

/// Base card widget with consistent styling
/// 
/// Example usage:
/// ```dart
/// BaseCard(
///   child: Text('Card content'),
///   onTap: () => handleTap(),
/// )
/// ```
class BaseCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final Color? color;
  final double? elevation;
  final ShapeBorder? shape;
  final BorderSide? borderSide;
  final VoidCallback? onTap;
  final VoidCallback? onLongPress;
  final double? width;
  final double? height;
  final AlignmentGeometry? alignment;
  final Clip clipBehavior;
  final Widget? header;
  final Widget? footer;
  final double spacing;
  
  const BaseCard({
    Key? key,
    required this.child,
    this.padding,
    this.margin,
    this.color,
    this.elevation,
    this.shape,
    this.borderSide,
    this.onTap,
    this.onLongPress,
    this.width,
    this.height,
    this.alignment,
    this.clipBehavior = Clip.none,
    this.header,
    this.footer,
    this.spacing = 0,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Widget content = child;
    
    if (header != null || footer != null) {
      content = Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (header != null) header!,
          if (header != null && spacing > 0) SizedBox(height: spacing),
          Expanded(child: child),
          if (footer != null && spacing > 0) SizedBox(height: spacing),
          if (footer != null) footer!,
        ],
      );
    }
    
    if (padding != null) {
      content = Padding(
        padding: padding!,
        child: content,
      );
    }
    
    if (alignment != null) {
      content = Align(
        alignment: alignment!,
        child: content,
      );
    }
    
    Widget card = Card(
      color: color,
      elevation: elevation,
      shape: shape ??
          (borderSide != null
              ? RoundedRectangleBorder(
                  borderRadius: AppSpacing.cardRadius,
                  side: borderSide!,
                )
              : null),
      margin: EdgeInsets.zero,
      clipBehavior: clipBehavior,
      child: onTap != null || onLongPress != null
          ? InkWell(
              onTap: onTap,
              onLongPress: onLongPress,
              borderRadius: shape != null
                  ? BorderRadius.zero
                  : AppSpacing.cardRadius,
              child: content,
            )
          : content,
    );
    
    if (width != null || height != null) {
      card = SizedBox(
        width: width,
        height: height,
        child: card,
      );
    }
    
    if (margin != null) {
      card = Padding(
        padding: margin!,
        child: card,
      );
    }
    
    return card;
  }
}

/// Outlined card variant
class OutlinedCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final Color? borderColor;
  final double borderWidth;
  final VoidCallback? onTap;
  final VoidCallback? onLongPress;
  final double? width;
  final double? height;
  final BorderRadiusGeometry? borderRadius;
  
  const OutlinedCard({
    Key? key,
    required this.child,
    this.padding,
    this.margin,
    this.borderColor,
    this.borderWidth = 1,
    this.onTap,
    this.onLongPress,
    this.width,
    this.height,
    this.borderRadius,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BaseCard(
      padding: padding,
      margin: margin,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: borderRadius ?? AppSpacing.cardRadius,
        side: BorderSide(
          color: borderColor ?? AppColors.border,
          width: borderWidth,
        ),
      ),
      onTap: onTap,
      onLongPress: onLongPress,
      width: width,
      height: height,
      child: child,
    );
  }
}

/// Elevated card with shadow
class ElevatedCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final Color? color;
  final double elevation;
  final Color? shadowColor;
  final VoidCallback? onTap;
  final VoidCallback? onLongPress;
  final double? width;
  final double? height;
  final BorderRadiusGeometry? borderRadius;
  
  const ElevatedCard({
    Key? key,
    required this.child,
    this.padding,
    this.margin,
    this.color,
    this.elevation = 4,
    this.shadowColor,
    this.onTap,
    this.onLongPress,
    this.width,
    this.height,
    this.borderRadius,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BaseCard(
      padding: padding,
      margin: margin,
      color: color,
      elevation: elevation,
      shape: RoundedRectangleBorder(
        borderRadius: borderRadius ?? AppSpacing.cardRadius,
      ),
      onTap: onTap,
      onLongPress: onLongPress,
      width: width,
      height: height,
      child: child,
    );
  }
}

/// Interactive card with hover/press effects
class InteractiveCard extends StatefulWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final Color? color;
  final Color? hoverColor;
  final Color? pressColor;
  final double? elevation;
  final double? hoverElevation;
  final VoidCallback? onTap;
  final VoidCallback? onLongPress;
  final Duration animationDuration;
  final BorderRadiusGeometry? borderRadius;
  
  const InteractiveCard({
    Key? key,
    required this.child,
    this.padding,
    this.margin,
    this.color,
    this.hoverColor,
    this.pressColor,
    this.elevation = 2,
    this.hoverElevation = 8,
    this.onTap,
    this.onLongPress,
    this.animationDuration = UIConstants.animationFast,
    this.borderRadius,
  }) : super(key: key);

  @override
  State<InteractiveCard> createState() => _InteractiveCardState();
}

class _InteractiveCardState extends State<InteractiveCard> {
  bool _isHovered = false;
  bool _isPressed = false;
  
  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: GestureDetector(
        onTapDown: (_) => setState(() => _isPressed = true),
        onTapUp: (_) => setState(() => _isPressed = false),
        onTapCancel: () => setState(() => _isPressed = false),
        child: AnimatedContainer(
          duration: widget.animationDuration,
          margin: widget.margin,
          transform: Matrix4.identity()
            ..translate(0.0, _isPressed ? 2.0 : 0.0),
          child: BaseCard(
            padding: widget.padding,
            color: _isPressed
                ? widget.pressColor
                : (_isHovered ? widget.hoverColor : widget.color),
            elevation: _isPressed
                ? widget.elevation ?? 2
                : (_isHovered ? widget.hoverElevation ?? 8 : widget.elevation),
            shape: RoundedRectangleBorder(
              borderRadius: widget.borderRadius ?? AppSpacing.cardRadius,
            ),
            onTap: widget.onTap,
            onLongPress: widget.onLongPress,
            child: widget.child,
          ),
        ),
      ),
    );
  }
}

/// Card with header section
class HeaderCard extends StatelessWidget {
  final Widget header;
  final Widget body;
  final Widget? footer;
  final EdgeInsetsGeometry? headerPadding;
  final EdgeInsetsGeometry? bodyPadding;
  final EdgeInsetsGeometry? footerPadding;
  final EdgeInsetsGeometry? margin;
  final Color? color;
  final Color? headerColor;
  final Color? footerColor;
  final double? elevation;
  final VoidCallback? onTap;
  final bool showDivider;
  final BorderRadiusGeometry? borderRadius;
  
  const HeaderCard({
    Key? key,
    required this.header,
    required this.body,
    this.footer,
    this.headerPadding,
    this.bodyPadding,
    this.footerPadding,
    this.margin,
    this.color,
    this.headerColor,
    this.footerColor,
    this.elevation,
    this.onTap,
    this.showDivider = true,
    this.borderRadius,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BaseCard(
      margin: margin,
      color: color,
      elevation: elevation,
      shape: RoundedRectangleBorder(
        borderRadius: borderRadius ?? AppSpacing.cardRadius,
      ),
      onTap: onTap,
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            color: headerColor,
            padding: headerPadding ?? AppSpacing.allMD,
            child: header,
          ),
          if (showDivider) const Divider(height: 1, thickness: 1),
          Expanded(
            child: Padding(
              padding: bodyPadding ?? AppSpacing.allMD,
              child: body,
            ),
          ),
          if (footer != null) ...[
            if (showDivider) const Divider(height: 1, thickness: 1),
            Container(
              color: footerColor,
              padding: footerPadding ?? AppSpacing.allMD,
              child: footer!,
            ),
          ],
        ],
      ),
    );
  }
}