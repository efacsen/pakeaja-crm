import 'package:flutter/material.dart';
import '../../../core/theme/theme.dart';
import '../../../core/constants/constants.dart';

/// A customizable bottom sheet with common patterns
/// 
/// Example usage:
/// ```dart
/// CustomBottomSheet.show(
///   context: context,
///   title: 'Select Option',
///   child: OptionsList(),
/// );
/// ```
class CustomBottomSheet extends StatelessWidget {
  final String? title;
  final Widget? titleWidget;
  final Widget child;
  final List<BottomSheetAction>? actions;
  final bool showDragHandle;
  final bool isDismissible;
  final bool enableDrag;
  final double? height;
  final double maxHeight;
  final EdgeInsetsGeometry? padding;
  final Color? backgroundColor;
  final ShapeBorder? shape;
  final bool isScrollControlled;
  final bool showCloseButton;
  final VoidCallback? onClose;
  
  const CustomBottomSheet({
    Key? key,
    this.title,
    this.titleWidget,
    required this.child,
    this.actions,
    this.showDragHandle = true,
    this.isDismissible = true,
    this.enableDrag = true,
    this.height,
    this.maxHeight = UIConstants.bottomSheetMaxHeight,
    this.padding,
    this.backgroundColor,
    this.shape,
    this.isScrollControlled = false,
    this.showCloseButton = false,
    this.onClose,
  }) : super(key: key);
  
  static Future<T?> show<T>({
    required BuildContext context,
    required Widget child,
    String? title,
    Widget? titleWidget,
    List<BottomSheetAction>? actions,
    bool showDragHandle = true,
    bool isDismissible = true,
    bool enableDrag = true,
    double? height,
    double maxHeight = UIConstants.bottomSheetMaxHeight,
    EdgeInsetsGeometry? padding,
    Color? backgroundColor,
    ShapeBorder? shape,
    bool isScrollControlled = false,
    bool showCloseButton = false,
    VoidCallback? onClose,
  }) {
    return showModalBottomSheet<T>(
      context: context,
      isDismissible: isDismissible,
      enableDrag: enableDrag,
      isScrollControlled: isScrollControlled,
      backgroundColor: Colors.transparent,
      builder: (context) => CustomBottomSheet(
        title: title,
        titleWidget: titleWidget,
        child: child,
        actions: actions,
        showDragHandle: showDragHandle,
        isDismissible: isDismissible,
        enableDrag: enableDrag,
        height: height,
        maxHeight: maxHeight,
        padding: padding,
        backgroundColor: backgroundColor,
        shape: shape,
        isScrollControlled: isScrollControlled,
        showCloseButton: showCloseButton,
        onClose: onClose,
      ),
    );
  }
  
  @override
  Widget build(BuildContext context) {
    final bottomPadding = MediaQuery.of(context).viewInsets.bottom;
    final screenHeight = MediaQuery.of(context).size.height;
    final maxHeightPixels = screenHeight * maxHeight;
    
    Widget content = Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (showDragHandle) _buildDragHandle(),
        if (title != null || titleWidget != null || showCloseButton)
          _buildHeader(context),
        Flexible(
          child: Container(
            constraints: height != null
                ? BoxConstraints(maxHeight: height!)
                : BoxConstraints(maxHeight: maxHeightPixels),
            padding: padding ?? AppSpacing.allMD,
            child: child,
          ),
        ),
        if (actions != null && actions!.isNotEmpty)
          _buildActions(context),
        if (bottomPadding > 0)
          SizedBox(height: bottomPadding),
      ],
    );
    
    return Container(
      decoration: BoxDecoration(
        color: backgroundColor ?? Theme.of(context).bottomSheetTheme.backgroundColor,
        borderRadius: shape != null
            ? null
            : const BorderRadius.vertical(
                top: Radius.circular(AppSpacing.radiusLG),
              ),
      ),
      child: SafeArea(
        top: false,
        child: content,
      ),
    );
  }
  
  Widget _buildDragHandle() {
    return Container(
      margin: AppSpacing.verticalSM,
      width: 40,
      height: 4,
      decoration: BoxDecoration(
        color: AppColors.neutral300,
        borderRadius: AppSpacing.borderRadiusFull,
      ),
    );
  }
  
  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: AppSpacing.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      decoration: BoxDecoration(
        border: Border(
          bottom: BorderSide(
            color: AppColors.border,
            width: 1,
          ),
        ),
      ),
      child: Row(
        children: [
          if (!showCloseButton) AppSpacing.widthLG,
          Expanded(
            child: titleWidget ??
                Text(
                  title ?? '',
                  style: AppTextStyles.titleMedium.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                  textAlign: TextAlign.center,
                ),
          ),
          if (showCloseButton)
            IconButton(
              icon: const Icon(Icons.close),
              onPressed: onClose ?? () => Navigator.of(context).pop(),
            )
          else
            AppSpacing.widthLG,
        ],
      ),
    );
  }
  
  Widget _buildActions(BuildContext context) {
    return Container(
      padding: AppSpacing.allMD,
      decoration: BoxDecoration(
        border: Border(
          top: BorderSide(
            color: AppColors.border,
            width: 1,
          ),
        ),
      ),
      child: Row(
        children: actions!.map((action) {
          final isLast = actions!.last == action;
          return Expanded(
            child: Padding(
              padding: EdgeInsets.only(
                right: isLast ? 0 : AppSpacing.sm,
              ),
              child: action.build(context),
            ),
          );
        }).toList(),
      ),
    );
  }
}

/// Bottom sheet action configuration
class BottomSheetAction {
  final String label;
  final VoidCallback onPressed;
  final ButtonType type;
  final bool isDestructive;
  final bool isLoading;
  final IconData? icon;
  
  const BottomSheetAction({
    required this.label,
    required this.onPressed,
    this.type = ButtonType.primary,
    this.isDestructive = false,
    this.isLoading = false,
    this.icon,
  });
  
  Widget build(BuildContext context) {
    final color = isDestructive ? AppColors.error : null;
    
    switch (type) {
      case ButtonType.primary:
        return ElevatedButton(
          onPressed: isLoading ? null : onPressed,
          style: color != null
              ? ElevatedButton.styleFrom(backgroundColor: color)
              : null,
          child: isLoading
              ? SizedBox(
                  width: UIConstants.iconSizeSM,
                  height: UIConstants.iconSizeSM,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      Theme.of(context).colorScheme.onPrimary,
                    ),
                  ),
                )
              : Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (icon != null) ...[
                      Icon(icon, size: UIConstants.iconSizeSM),
                      AppSpacing.widthXS,
                    ],
                    Text(label),
                  ],
                ),
        );
      case ButtonType.secondary:
        return OutlinedButton(
          onPressed: isLoading ? null : onPressed,
          style: color != null
              ? OutlinedButton.styleFrom(
                  foregroundColor: color,
                  side: BorderSide(color: color),
                )
              : null,
          child: isLoading
              ? SizedBox(
                  width: UIConstants.iconSizeSM,
                  height: UIConstants.iconSizeSM,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      color ?? Theme.of(context).colorScheme.primary,
                    ),
                  ),
                )
              : Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (icon != null) ...[
                      Icon(icon, size: UIConstants.iconSizeSM),
                      AppSpacing.widthXS,
                    ],
                    Text(label),
                  ],
                ),
        );
      case ButtonType.text:
        return TextButton(
          onPressed: isLoading ? null : onPressed,
          style: color != null
              ? TextButton.styleFrom(foregroundColor: color)
              : null,
          child: isLoading
              ? SizedBox(
                  width: UIConstants.iconSizeSM,
                  height: UIConstants.iconSizeSM,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      color ?? Theme.of(context).colorScheme.primary,
                    ),
                  ),
                )
              : Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (icon != null) ...[
                      Icon(icon, size: UIConstants.iconSizeSM),
                      AppSpacing.widthXS,
                    ],
                    Text(label),
                  ],
                ),
        );
    }
  }
}

enum ButtonType {
  primary,
  secondary,
  text,
}

/// Option list item for bottom sheets
class BottomSheetOption extends StatelessWidget {
  final String title;
  final String? subtitle;
  final IconData? icon;
  final Widget? leading;
  final Widget? trailing;
  final VoidCallback? onTap;
  final bool selected;
  final bool enabled;
  final Color? iconColor;
  
  const BottomSheetOption({
    Key? key,
    required this.title,
    this.subtitle,
    this.icon,
    this.leading,
    this.trailing,
    this.onTap,
    this.selected = false,
    this.enabled = true,
    this.iconColor,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: enabled ? onTap : null,
      child: Padding(
        padding: AppSpacing.symmetric(
          horizontal: AppSpacing.md,
          vertical: AppSpacing.sm,
        ),
        child: Row(
          children: [
            if (leading != null)
              leading!
            else if (icon != null)
              Icon(
                icon,
                color: iconColor ??
                    (selected
                        ? AppColors.primary
                        : enabled
                            ? AppColors.textPrimary
                            : AppColors.textDisabled),
              ),
            if (icon != null || leading != null) AppSpacing.widthMD,
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: AppTextStyles.bodyMedium.copyWith(
                      color: enabled
                          ? (selected ? AppColors.primary : AppColors.textPrimary)
                          : AppColors.textDisabled,
                      fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                    ),
                  ),
                  if (subtitle != null) ...[
                    AppSpacing.heightXXS,
                    Text(
                      subtitle!,
                      style: AppTextStyles.bodySmall.copyWith(
                        color: enabled
                            ? AppColors.textSecondary
                            : AppColors.textDisabled,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            if (trailing != null)
              trailing!
            else if (selected)
              Icon(
                Icons.check,
                color: AppColors.primary,
                size: UIConstants.iconSizeSM,
              ),
          ],
        ),
      ),
    );
  }
}

/// Confirmation bottom sheet
class ConfirmationBottomSheet extends StatelessWidget {
  final String title;
  final String message;
  final String confirmLabel;
  final String cancelLabel;
  final VoidCallback? onConfirm;
  final VoidCallback? onCancel;
  final bool isDestructive;
  final IconData? icon;
  final Color? iconColor;
  
  const ConfirmationBottomSheet({
    Key? key,
    required this.title,
    required this.message,
    this.confirmLabel = 'Confirm',
    this.cancelLabel = 'Cancel',
    this.onConfirm,
    this.onCancel,
    this.isDestructive = false,
    this.icon,
    this.iconColor,
  }) : super(key: key);
  
  static Future<bool?> show({
    required BuildContext context,
    required String title,
    required String message,
    String confirmLabel = 'Confirm',
    String cancelLabel = 'Cancel',
    bool isDestructive = false,
    IconData? icon,
    Color? iconColor,
  }) {
    return CustomBottomSheet.show<bool>(
      context: context,
      child: ConfirmationBottomSheet(
        title: title,
        message: message,
        confirmLabel: confirmLabel,
        cancelLabel: cancelLabel,
        isDestructive: isDestructive,
        icon: icon,
        iconColor: iconColor,
      ),
      showDragHandle: false,
    );
  }
  
  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (icon != null) ...[
          Icon(
            icon,
            size: UIConstants.iconSizeXL,
            color: iconColor ??
                (isDestructive ? AppColors.error : AppColors.primary),
          ),
          AppSpacing.heightMD,
        ],
        Text(
          title,
          style: AppTextStyles.titleLarge.copyWith(
            fontWeight: FontWeight.w600,
          ),
          textAlign: TextAlign.center,
        ),
        AppSpacing.heightSM,
        Text(
          message,
          style: AppTextStyles.bodyMedium.copyWith(
            color: AppColors.textSecondary,
          ),
          textAlign: TextAlign.center,
        ),
        AppSpacing.heightLG,
        Row(
          children: [
            Expanded(
              child: OutlinedButton(
                onPressed: () {
                  onCancel?.call();
                  Navigator.of(context).pop(false);
                },
                child: Text(cancelLabel),
              ),
            ),
            AppSpacing.widthSM,
            Expanded(
              child: ElevatedButton(
                onPressed: () {
                  onConfirm?.call();
                  Navigator.of(context).pop(true);
                },
                style: isDestructive
                    ? ElevatedButton.styleFrom(
                        backgroundColor: AppColors.error,
                      )
                    : null,
                child: Text(confirmLabel),
              ),
            ),
          ],
        ),
      ],
    );
  }
}