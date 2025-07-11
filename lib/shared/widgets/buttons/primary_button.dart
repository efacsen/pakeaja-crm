import 'package:flutter/material.dart';
import '../../../core/theme/theme.dart';
import '../../../core/constants/constants.dart';

/// Primary button for main actions
/// 
/// Example usage:
/// ```dart
/// PrimaryButton(
///   label: 'Save',
///   onPressed: () => save(),
///   isLoading: isSaving,
/// )
/// ```
class PrimaryButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;
  final bool isFullWidth;
  final IconData? icon;
  final ButtonSize size;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final EdgeInsetsGeometry? padding;
  final double? width;
  final double? height;
  final BorderRadiusGeometry? borderRadius;
  final Widget? child;
  
  const PrimaryButton({
    Key? key,
    required this.label,
    this.onPressed,
    this.isLoading = false,
    this.isFullWidth = false,
    this.icon,
    this.size = ButtonSize.medium,
    this.backgroundColor,
    this.foregroundColor,
    this.padding,
    this.width,
    this.height,
    this.borderRadius,
    this.child,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final buttonStyle = ElevatedButton.styleFrom(
      backgroundColor: backgroundColor,
      foregroundColor: foregroundColor,
      padding: padding ?? _getPadding(),
      minimumSize: Size(
        width ?? (isFullWidth ? double.infinity : 0),
        height ?? _getHeight(),
      ),
      shape: RoundedRectangleBorder(
        borderRadius: borderRadius ?? AppSpacing.buttonRadius,
      ),
    );

    final content = isLoading
        ? SizedBox(
            width: _getLoaderSize(),
            height: _getLoaderSize(),
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(
                foregroundColor ?? AppColors.textOnPrimary,
              ),
            ),
          )
        : child ??
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

    return SizedBox(
      width: isFullWidth ? double.infinity : width,
      height: height ?? _getHeight(),
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: buttonStyle,
        child: content,
      ),
    );
  }

  EdgeInsetsGeometry _getPadding() {
    switch (size) {
      case ButtonSize.small:
        return AppSpacing.symmetric(
          horizontal: AppSpacing.sm,
          vertical: AppSpacing.xs,
        );
      case ButtonSize.medium:
        return AppSpacing.symmetric(
          horizontal: AppSpacing.lg,
          vertical: AppSpacing.sm,
        );
      case ButtonSize.large:
        return AppSpacing.symmetric(
          horizontal: AppSpacing.xl,
          vertical: AppSpacing.md,
        );
    }
  }

  double _getHeight() {
    switch (size) {
      case ButtonSize.small:
        return UIConstants.buttonHeightSM;
      case ButtonSize.medium:
        return UIConstants.buttonHeightMD;
      case ButtonSize.large:
        return UIConstants.buttonHeightLG;
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

/// Secondary button for secondary actions
class SecondaryButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;
  final bool isFullWidth;
  final IconData? icon;
  final ButtonSize size;
  final Color? borderColor;
  final Color? foregroundColor;
  final EdgeInsetsGeometry? padding;
  final double? width;
  final double? height;
  final BorderRadiusGeometry? borderRadius;
  final Widget? child;
  
  const SecondaryButton({
    Key? key,
    required this.label,
    this.onPressed,
    this.isLoading = false,
    this.isFullWidth = false,
    this.icon,
    this.size = ButtonSize.medium,
    this.borderColor,
    this.foregroundColor,
    this.padding,
    this.width,
    this.height,
    this.borderRadius,
    this.child,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final buttonStyle = OutlinedButton.styleFrom(
      foregroundColor: foregroundColor,
      side: BorderSide(
        color: borderColor ?? Theme.of(context).colorScheme.primary,
      ),
      padding: padding ?? _getPadding(),
      minimumSize: Size(
        width ?? (isFullWidth ? double.infinity : 0),
        height ?? _getHeight(),
      ),
      shape: RoundedRectangleBorder(
        borderRadius: borderRadius ?? AppSpacing.buttonRadius,
      ),
    );

    final content = isLoading
        ? SizedBox(
            width: _getLoaderSize(),
            height: _getLoaderSize(),
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(
                foregroundColor ?? Theme.of(context).colorScheme.primary,
              ),
            ),
          )
        : child ??
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

    return SizedBox(
      width: isFullWidth ? double.infinity : width,
      height: height ?? _getHeight(),
      child: OutlinedButton(
        onPressed: isLoading ? null : onPressed,
        style: buttonStyle,
        child: content,
      ),
    );
  }

  EdgeInsetsGeometry _getPadding() {
    switch (size) {
      case ButtonSize.small:
        return AppSpacing.symmetric(
          horizontal: AppSpacing.sm,
          vertical: AppSpacing.xs,
        );
      case ButtonSize.medium:
        return AppSpacing.symmetric(
          horizontal: AppSpacing.lg,
          vertical: AppSpacing.sm,
        );
      case ButtonSize.large:
        return AppSpacing.symmetric(
          horizontal: AppSpacing.xl,
          vertical: AppSpacing.md,
        );
    }
  }

  double _getHeight() {
    switch (size) {
      case ButtonSize.small:
        return UIConstants.buttonHeightSM;
      case ButtonSize.medium:
        return UIConstants.buttonHeightMD;
      case ButtonSize.large:
        return UIConstants.buttonHeightLG;
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

/// Text button for tertiary actions
class CustomTextButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;
  final IconData? icon;
  final ButtonSize size;
  final Color? foregroundColor;
  final EdgeInsetsGeometry? padding;
  final Widget? child;
  
  const CustomTextButton({
    Key? key,
    required this.label,
    this.onPressed,
    this.isLoading = false,
    this.icon,
    this.size = ButtonSize.medium,
    this.foregroundColor,
    this.padding,
    this.child,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final buttonStyle = TextButton.styleFrom(
      foregroundColor: foregroundColor,
      padding: padding ?? _getPadding(),
    );

    final content = isLoading
        ? SizedBox(
            width: _getLoaderSize(),
            height: _getLoaderSize(),
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(
                foregroundColor ?? Theme.of(context).colorScheme.primary,
              ),
            ),
          )
        : child ??
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

    return TextButton(
      onPressed: isLoading ? null : onPressed,
      style: buttonStyle,
      child: content,
    );
  }

  EdgeInsetsGeometry _getPadding() {
    switch (size) {
      case ButtonSize.small:
        return AppSpacing.symmetric(
          horizontal: AppSpacing.xs,
          vertical: AppSpacing.xxs,
        );
      case ButtonSize.medium:
        return AppSpacing.symmetric(
          horizontal: AppSpacing.sm,
          vertical: AppSpacing.xs,
        );
      case ButtonSize.large:
        return AppSpacing.symmetric(
          horizontal: AppSpacing.md,
          vertical: AppSpacing.sm,
        );
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

/// Button size enum
enum ButtonSize {
  small,
  medium,
  large,
}