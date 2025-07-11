import 'package:flutter/material.dart';
import '../../../core/theme/theme.dart';
import '../../../core/constants/constants.dart';

/// Custom icon button with label support
/// 
/// Example usage:
/// ```dart
/// CustomIconButton(
///   icon: Icons.add,
///   onPressed: () => addItem(),
///   label: 'Add Item',
/// )
/// ```
class CustomIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback? onPressed;
  final String? label;
  final Color? color;
  final Color? backgroundColor;
  final double? iconSize;
  final EdgeInsetsGeometry? padding;
  final String? tooltip;
  final bool showLabel;
  final Axis direction;
  final double spacing;
  final BorderRadiusGeometry? borderRadius;
  final BoxBorder? border;
  final bool isLoading;
  final Widget? badge;
  
  const CustomIconButton({
    Key? key,
    required this.icon,
    this.onPressed,
    this.label,
    this.color,
    this.backgroundColor,
    this.iconSize,
    this.padding,
    this.tooltip,
    this.showLabel = true,
    this.direction = Axis.horizontal,
    this.spacing = 8,
    this.borderRadius,
    this.border,
    this.isLoading = false,
    this.badge,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final hasLabel = label != null && showLabel;
    
    Widget iconWidget = Icon(
      icon,
      size: iconSize ?? UIConstants.iconSizeMD,
      color: color ?? Theme.of(context).iconTheme.color,
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
    
    Widget content;
    if (isLoading) {
      content = SizedBox(
        width: iconSize ?? UIConstants.iconSizeMD,
        height: iconSize ?? UIConstants.iconSizeMD,
        child: CircularProgressIndicator(
          strokeWidth: 2,
          valueColor: AlwaysStoppedAnimation<Color>(
            color ?? Theme.of(context).colorScheme.primary,
          ),
        ),
      );
    } else if (hasLabel) {
      content = direction == Axis.horizontal
          ? Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                iconWidget,
                SizedBox(width: spacing),
                Text(
                  label!,
                  style: AppTextStyles.labelMedium.copyWith(
                    color: color,
                  ),
                ),
              ],
            )
          : Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                iconWidget,
                SizedBox(height: spacing / 2),
                Text(
                  label!,
                  style: AppTextStyles.labelSmall.copyWith(
                    color: color,
                  ),
                ),
              ],
            );
    } else {
      content = iconWidget;
    }
    
    final button = Material(
      color: backgroundColor ?? Colors.transparent,
      borderRadius: borderRadius ?? AppSpacing.borderRadiusSM,
      child: InkWell(
        onTap: isLoading ? null : onPressed,
        borderRadius: borderRadius ?? AppSpacing.borderRadiusSM,
        child: Container(
          padding: padding ??
              (hasLabel
                  ? AppSpacing.symmetric(
                      horizontal: AppSpacing.sm,
                      vertical: AppSpacing.xs,
                    )
                  : AppSpacing.allXS),
          decoration: BoxDecoration(
            border: border,
            borderRadius: borderRadius ?? AppSpacing.borderRadiusSM,
          ),
          child: content,
        ),
      ),
    );
    
    if (tooltip != null && !hasLabel) {
      return Tooltip(
        message: tooltip!,
        child: button,
      );
    }
    
    return button;
  }
}

/// Loading button with progress indicator
/// 
/// Example usage:
/// ```dart
/// LoadingButton(
///   label: 'Upload',
///   onPressed: () => upload(),
///   isLoading: isUploading,
///   progress: uploadProgress,
/// )
/// ```
class LoadingButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;
  final double? progress;
  final IconData? icon;
  final ButtonType type;
  final ButtonSize size;
  final bool isFullWidth;
  final Color? color;
  final String? loadingText;
  final Widget? child;
  
  const LoadingButton({
    Key? key,
    required this.label,
    this.onPressed,
    this.isLoading = false,
    this.progress,
    this.icon,
    this.type = ButtonType.primary,
    this.size = ButtonSize.medium,
    this.isFullWidth = false,
    this.color,
    this.loadingText,
    this.child,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Widget content;
    
    if (isLoading) {
      content = Row(
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(
            width: _getLoaderSize(),
            height: _getLoaderSize(),
            child: progress != null
                ? CircularProgressIndicator(
                    value: progress,
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      _getProgressColor(context),
                    ),
                  )
                : CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      _getProgressColor(context),
                    ),
                  ),
          ),
          if (loadingText != null) ...[
            SizedBox(width: AppSpacing.sm),
            Text(
              loadingText!,
              style: _getTextStyle().copyWith(
                color: _getTextColor(context),
              ),
            ),
          ],
        ],
      );
    } else {
      content = child ??
          Row(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (icon != null) ...[
                Icon(icon, size: _getIconSize()),
                SizedBox(width: AppSpacing.xs),
              ],
              Text(
                label,
                style: _getTextStyle(),
              ),
            ],
          );
    }
    
    switch (type) {
      case ButtonType.primary:
        return PrimaryButton(
          label: label,
          onPressed: isLoading ? null : onPressed,
          size: size,
          isFullWidth: isFullWidth,
          backgroundColor: color,
          child: content,
        );
      case ButtonType.secondary:
        return SecondaryButton(
          label: label,
          onPressed: isLoading ? null : onPressed,
          size: size,
          isFullWidth: isFullWidth,
          borderColor: color,
          foregroundColor: color,
          child: content,
        );
      case ButtonType.text:
        return CustomTextButton(
          label: label,
          onPressed: isLoading ? null : onPressed,
          size: size,
          foregroundColor: color,
          child: content,
        );
    }
  }
  
  Color _getProgressColor(BuildContext context) {
    switch (type) {
      case ButtonType.primary:
        return AppColors.textOnPrimary;
      case ButtonType.secondary:
      case ButtonType.text:
        return color ?? Theme.of(context).colorScheme.primary;
    }
  }
  
  Color _getTextColor(BuildContext context) {
    switch (type) {
      case ButtonType.primary:
        return AppColors.textOnPrimary;
      case ButtonType.secondary:
      case ButtonType.text:
        return color ?? Theme.of(context).colorScheme.primary;
    }
  }
  
  double _getLoaderSize() {
    switch (size) {
      case ButtonSize.small:
        return UIConstants.loaderSizeSM;
      case ButtonSize.medium:
        return UIConstants.loaderSizeMD;
      case ButtonSize.large:
        return UIConstants.loaderSizeMD;
    }
  }
  
  double _getIconSize() {
    switch (size) {
      case ButtonSize.small:
        return UIConstants.iconSizeXS;
      case ButtonSize.medium:
        return UIConstants.iconSizeSM;
      case ButtonSize.large:
        return UIConstants.iconSizeMD;
    }
  }
  
  TextStyle _getTextStyle() {
    switch (size) {
      case ButtonSize.small:
        return AppTextStyles.labelSmall.copyWith(
          fontWeight: FontWeight.w600,
        );
      case ButtonSize.medium:
        return AppTextStyles.labelMedium.copyWith(
          fontWeight: FontWeight.w600,
        );
      case ButtonSize.large:
        return AppTextStyles.labelLarge.copyWith(
          fontWeight: FontWeight.w600,
        );
    }
  }
}

/// Badge widget for icon buttons
class IconButtonBadge extends StatelessWidget {
  final String text;
  final Color? backgroundColor;
  final Color? textColor;
  final double? size;
  
  const IconButtonBadge({
    Key? key,
    required this.text,
    this.backgroundColor,
    this.textColor,
    this.size,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: AppSpacing.all(AppSpacing.xxs),
      decoration: BoxDecoration(
        color: backgroundColor ?? AppColors.error,
        shape: BoxShape.circle,
      ),
      constraints: BoxConstraints(
        minWidth: size ?? 18,
        minHeight: size ?? 18,
      ),
      child: Text(
        text,
        style: AppTextStyles.labelSmall.copyWith(
          color: textColor ?? AppColors.textOnPrimary,
          fontSize: 10,
        ),
        textAlign: TextAlign.center,
      ),
    );
  }
}

enum ButtonType {
  primary,
  secondary,
  text,
}