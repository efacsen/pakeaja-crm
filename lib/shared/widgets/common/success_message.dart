import 'package:flutter/material.dart';
import '../../../core/theme/theme.dart';
import '../../../core/constants/constants.dart';

/// A widget to display success messages with auto-dismiss capability
/// 
/// Example usage:
/// ```dart
/// SuccessMessage(
///   message: 'Data saved successfully!',
///   onDismiss: () => Navigator.pop(context),
///   autoDismiss: true,
///   duration: Duration(seconds: 3),
/// )
/// ```
class SuccessMessage extends StatefulWidget {
  final String message;
  final String? details;
  final IconData icon;
  final double iconSize;
  final Color? iconColor;
  final Color? backgroundColor;
  final TextStyle? messageStyle;
  final TextStyle? detailsStyle;
  final EdgeInsetsGeometry? padding;
  final double spacing;
  final bool showIcon;
  final bool autoDismiss;
  final Duration dismissDuration;
  final VoidCallback? onDismiss;
  final Widget? action;
  final bool showCloseButton;
  
  const SuccessMessage({
    Key? key,
    required this.message,
    this.details,
    this.icon = Icons.check_circle,
    this.iconSize = 48,
    this.iconColor,
    this.backgroundColor,
    this.messageStyle,
    this.detailsStyle,
    this.padding,
    this.spacing = 16,
    this.showIcon = true,
    this.autoDismiss = false,
    this.dismissDuration = const Duration(seconds: 3),
    this.onDismiss,
    this.action,
    this.showCloseButton = true,
  }) : super(key: key);

  @override
  State<SuccessMessage> createState() => _SuccessMessageState();
}

class _SuccessMessageState extends State<SuccessMessage>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;
  
  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: UIConstants.animationNormal,
      vsync: this,
    );
    
    _fadeAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeIn,
    ));
    
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, -0.1),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOut,
    ));
    
    _controller.forward();
    
    if (widget.autoDismiss) {
      Future.delayed(widget.dismissDuration, () {
        if (mounted) {
          _dismiss();
        }
      });
    }
  }
  
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
  
  void _dismiss() {
    _controller.reverse().then((_) {
      if (mounted) {
        widget.onDismiss?.call();
      }
    });
  }
  
  @override
  Widget build(BuildContext context) {
    return SlideTransition(
      position: _slideAnimation,
      child: FadeTransition(
        opacity: _fadeAnimation,
        child: Container(
          padding: widget.padding ?? AppSpacing.allMD,
          decoration: BoxDecoration(
            color: widget.backgroundColor ?? AppColors.success.withOpacity(0.1),
            borderRadius: AppSpacing.borderRadiusMD,
            border: Border.all(
              color: AppColors.success.withOpacity(0.3),
            ),
          ),
          child: Row(
            children: [
              if (widget.showIcon) ...[
                Icon(
                  widget.icon,
                  size: widget.iconSize,
                  color: widget.iconColor ?? AppColors.success,
                ),
                SizedBox(width: widget.spacing),
              ],
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      widget.message,
                      style: widget.messageStyle ??
                          AppTextStyles.titleSmall.copyWith(
                            color: AppColors.success,
                            fontWeight: FontWeight.w600,
                          ),
                    ),
                    if (widget.details != null) ...[
                      SizedBox(height: widget.spacing / 4),
                      Text(
                        widget.details!,
                        style: widget.detailsStyle ??
                            AppTextStyles.bodySmall.copyWith(
                              color: AppColors.textSecondary,
                            ),
                      ),
                    ],
                  ],
                ),
              ),
              if (widget.action != null) ...[
                SizedBox(width: widget.spacing),
                widget.action!,
              ] else if (widget.showCloseButton) ...[
                SizedBox(width: widget.spacing),
                IconButton(
                  icon: const Icon(Icons.close),
                  iconSize: UIConstants.iconSizeSM,
                  color: AppColors.success,
                  onPressed: _dismiss,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

/// Toast-style success message
class SuccessToast extends StatelessWidget {
  final String message;
  final IconData? icon;
  final Duration duration;
  
  const SuccessToast({
    Key? key,
    required this.message,
    this.icon,
    this.duration = const Duration(seconds: 3),
  }) : super(key: key);
  
  static void show(
    BuildContext context, {
    required String message,
    IconData? icon,
    Duration duration = const Duration(seconds: 3),
  }) {
    final overlay = Overlay.of(context);
    final overlayEntry = OverlayEntry(
      builder: (context) => Positioned(
        top: MediaQuery.of(context).padding.top + AppSpacing.md,
        left: AppSpacing.md,
        right: AppSpacing.md,
        child: Material(
          color: Colors.transparent,
          child: SuccessToast(
            message: message,
            icon: icon,
            duration: duration,
          ),
        ),
      ),
    );
    
    overlay.insert(overlayEntry);
    
    Future.delayed(duration, () {
      overlayEntry.remove();
    });
  }
  
  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: UIConstants.animationNormal,
      builder: (context, value, child) {
        return Transform.scale(
          scale: value,
          child: Opacity(
            opacity: value,
            child: Container(
              padding: AppSpacing.symmetric(
                horizontal: AppSpacing.md,
                vertical: AppSpacing.sm,
              ),
              decoration: BoxDecoration(
                color: AppColors.success,
                borderRadius: AppSpacing.borderRadiusMD,
                boxShadow: [
                  BoxShadow(
                    color: AppColors.shadow,
                    blurRadius: UIConstants.blurMD,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    icon ?? Icons.check_circle,
                    color: AppColors.textOnPrimary,
                    size: UIConstants.iconSizeSM,
                  ),
                  AppSpacing.widthSM,
                  Flexible(
                    child: Text(
                      message,
                      style: AppTextStyles.bodyMedium.copyWith(
                        color: AppColors.textOnPrimary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

/// Inline success message
class InlineSuccess extends StatelessWidget {
  final String message;
  final IconData? icon;
  final Color? color;
  final TextStyle? style;
  final EdgeInsetsGeometry? padding;
  final double iconSize;
  final double spacing;
  final VoidCallback? onDismiss;
  
  const InlineSuccess({
    Key? key,
    required this.message,
    this.icon = Icons.check_circle_outline,
    this.color,
    this.style,
    this.padding,
    this.iconSize = 16,
    this.spacing = 8,
    this.onDismiss,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    final successColor = color ?? AppColors.success;
    
    return Container(
      padding: padding ??
          AppSpacing.symmetric(
            horizontal: AppSpacing.sm,
            vertical: AppSpacing.xs,
          ),
      decoration: BoxDecoration(
        color: successColor.withOpacity(0.1),
        borderRadius: AppSpacing.borderRadiusSM,
        border: Border.all(
          color: successColor.withOpacity(0.3),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(
              icon,
              size: iconSize,
              color: successColor,
            ),
            SizedBox(width: spacing),
          ],
          Flexible(
            child: Text(
              message,
              style: style ??
                  AppTextStyles.bodySmall.copyWith(
                    color: successColor,
                  ),
            ),
          ),
          if (onDismiss != null) ...[
            SizedBox(width: spacing),
            InkWell(
              onTap: onDismiss,
              child: Icon(
                Icons.close,
                size: iconSize,
                color: successColor,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

/// Common success messages
class CommonSuccessMessages {
  CommonSuccessMessages._();
  
  static Widget saved({
    String? itemName,
    VoidCallback? onDismiss,
    bool autoDismiss = true,
  }) {
    return SuccessMessage(
      message: itemName != null
          ? '$itemName ${AppStrings.savedSuccessfully}'
          : AppStrings.savedSuccessfully,
      autoDismiss: autoDismiss,
      onDismiss: onDismiss,
    );
  }
  
  static Widget deleted({
    String? itemName,
    VoidCallback? onDismiss,
    bool autoDismiss = true,
  }) {
    return SuccessMessage(
      message: itemName != null
          ? '$itemName ${AppStrings.deletedSuccessfully}'
          : AppStrings.deletedSuccessfully,
      icon: Icons.delete_outline,
      autoDismiss: autoDismiss,
      onDismiss: onDismiss,
    );
  }
  
  static Widget updated({
    String? itemName,
    VoidCallback? onDismiss,
    bool autoDismiss = true,
  }) {
    return SuccessMessage(
      message: itemName != null
          ? '$itemName ${AppStrings.updatedSuccessfully}'
          : AppStrings.updatedSuccessfully,
      autoDismiss: autoDismiss,
      onDismiss: onDismiss,
    );
  }
  
  static Widget submitted({
    String? itemName,
    VoidCallback? onDismiss,
    bool autoDismiss = true,
  }) {
    return SuccessMessage(
      message: itemName != null
          ? '$itemName ${AppStrings.submittedSuccessfully}'
          : AppStrings.submittedSuccessfully,
      icon: Icons.send,
      autoDismiss: autoDismiss,
      onDismiss: onDismiss,
    );
  }
  
  static Widget uploaded({
    String? fileName,
    VoidCallback? onDismiss,
    bool autoDismiss = true,
  }) {
    return SuccessMessage(
      message: fileName != null
          ? '$fileName ${AppStrings.uploadedSuccessfully}'
          : AppStrings.uploadedSuccessfully,
      icon: Icons.cloud_upload,
      autoDismiss: autoDismiss,
      onDismiss: onDismiss,
    );
  }
  
  static Widget copied({
    VoidCallback? onDismiss,
    bool autoDismiss = true,
  }) {
    return SuccessMessage(
      message: AppStrings.copiedToClipboard,
      icon: Icons.content_copy,
      autoDismiss: autoDismiss,
      dismissDuration: const Duration(seconds: 2),
      onDismiss: onDismiss,
    );
  }
}