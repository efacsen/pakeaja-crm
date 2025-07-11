import 'package:flutter/material.dart';
import '../../../core/theme/theme.dart';
import '../../../core/constants/constants.dart';

/// A widget to display error states with retry action
/// 
/// Example usage:
/// ```dart
/// CustomErrorWidget(
///   error: 'Failed to load data',
///   onRetry: () => loadData(),
/// )
/// ```
class CustomErrorWidget extends StatelessWidget {
  final String error;
  final String? details;
  final VoidCallback? onRetry;
  final String retryLabel;
  final IconData icon;
  final double iconSize;
  final Color? iconColor;
  final Color? backgroundColor;
  final TextStyle? errorStyle;
  final TextStyle? detailsStyle;
  final EdgeInsetsGeometry? padding;
  final double spacing;
  final bool showIcon;
  final bool center;
  final Widget? action;
  
  const CustomErrorWidget({
    Key? key,
    required this.error,
    this.details,
    this.onRetry,
    this.retryLabel = 'Retry',
    this.icon = Icons.error_outline,
    this.iconSize = 48,
    this.iconColor,
    this.backgroundColor,
    this.errorStyle,
    this.detailsStyle,
    this.padding,
    this.spacing = 16,
    this.showIcon = true,
    this.center = true,
    this.action,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    Widget content = Container(
      padding: padding ?? AppSpacing.allMD,
      decoration: BoxDecoration(
        color: backgroundColor ?? AppColors.error.withOpacity(0.05),
        borderRadius: AppSpacing.borderRadiusMD,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (showIcon) ...[
            Icon(
              icon,
              size: iconSize,
              color: iconColor ?? AppColors.error,
            ),
            SizedBox(height: spacing),
          ],
          Text(
            error,
            style: errorStyle ??
                AppTextStyles.titleMedium.copyWith(
                  color: AppColors.error,
                  fontWeight: FontWeight.w600,
                ),
            textAlign: TextAlign.center,
          ),
          if (details != null) ...[
            SizedBox(height: spacing / 2),
            Text(
              details!,
              style: detailsStyle ??
                  AppTextStyles.bodySmall.copyWith(
                    color: AppColors.textSecondary,
                  ),
              textAlign: TextAlign.center,
            ),
          ],
          if (action != null || onRetry != null) ...[
            SizedBox(height: spacing),
            action ??
                OutlinedButton.icon(
                  onPressed: onRetry,
                  icon: const Icon(Icons.refresh, size: UIConstants.iconSizeSM),
                  label: Text(retryLabel),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppColors.error,
                    side: const BorderSide(color: AppColors.error),
                  ),
                ),
          ],
        ],
      ),
    );
    
    if (center) {
      content = Center(child: content);
    }
    
    return content;
  }
}

/// Inline error message widget
class InlineError extends StatelessWidget {
  final String message;
  final IconData? icon;
  final Color? color;
  final TextStyle? style;
  final EdgeInsetsGeometry? padding;
  final double iconSize;
  final double spacing;
  
  const InlineError({
    Key? key,
    required this.message,
    this.icon = Icons.error_outline,
    this.color,
    this.style,
    this.padding,
    this.iconSize = 16,
    this.spacing = 8,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    final errorColor = color ?? AppColors.error;
    
    return Container(
      padding: padding ?? AppSpacing.symmetric(
        horizontal: AppSpacing.sm,
        vertical: AppSpacing.xs,
      ),
      decoration: BoxDecoration(
        color: errorColor.withOpacity(0.1),
        borderRadius: AppSpacing.borderRadiusSM,
        border: Border.all(
          color: errorColor.withOpacity(0.3),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(
              icon,
              size: iconSize,
              color: errorColor,
            ),
            SizedBox(width: spacing),
          ],
          Flexible(
            child: Text(
              message,
              style: style ??
                  AppTextStyles.bodySmall.copyWith(
                    color: errorColor,
                  ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Error types for different scenarios
enum ErrorType {
  network,
  server,
  validation,
  permission,
  notFound,
  timeout,
  unknown,
}

/// Pre-configured error widgets for common scenarios
class CommonErrors {
  CommonErrors._();
  
  static Widget network({VoidCallback? onRetry}) {
    return CustomErrorWidget(
      error: AppStrings.networkError,
      details: AppStrings.checkConnection,
      icon: Icons.wifi_off,
      onRetry: onRetry,
    );
  }
  
  static Widget server({VoidCallback? onRetry}) {
    return CustomErrorWidget(
      error: AppStrings.serverError,
      details: AppStrings.tryAgainLater,
      icon: Icons.cloud_off,
      onRetry: onRetry,
    );
  }
  
  static Widget timeout({VoidCallback? onRetry}) {
    return CustomErrorWidget(
      error: AppStrings.timeoutError,
      details: AppStrings.tryAgain,
      icon: Icons.access_time,
      onRetry: onRetry,
    );
  }
  
  static Widget permission({
    String? message,
    VoidCallback? onAction,
    String? actionLabel,
  }) {
    return CustomErrorWidget(
      error: 'Permission Denied',
      details: message ?? 'You don\'t have permission to perform this action.',
      icon: Icons.lock_outline,
      onRetry: onAction,
      retryLabel: actionLabel ?? 'Request Access',
    );
  }
  
  static Widget notFound({
    String? resource,
    VoidCallback? onAction,
    String? actionLabel,
  }) {
    return CustomErrorWidget(
      error: '${resource ?? 'Resource'} Not Found',
      details: 'The ${resource?.toLowerCase() ?? 'item'} you\'re looking for doesn\'t exist.',
      icon: Icons.search_off,
      onRetry: onAction,
      retryLabel: actionLabel ?? 'Go Back',
    );
  }
  
  static Widget validation({
    required List<String> errors,
    VoidCallback? onDismiss,
  }) {
    return Container(
      padding: AppSpacing.allMD,
      decoration: BoxDecoration(
        color: AppColors.error.withOpacity(0.05),
        borderRadius: AppSpacing.borderRadiusMD,
        border: Border.all(
          color: AppColors.error.withOpacity(0.3),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.warning_amber_rounded,
                color: AppColors.error,
                size: UIConstants.iconSizeSM,
              ),
              AppSpacing.widthXS,
              Expanded(
                child: Text(
                  'Please fix the following errors:',
                  style: AppTextStyles.titleSmall.copyWith(
                    color: AppColors.error,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              if (onDismiss != null)
                IconButton(
                  icon: const Icon(Icons.close),
                  iconSize: UIConstants.iconSizeSM,
                  color: AppColors.error,
                  onPressed: onDismiss,
                ),
            ],
          ),
          AppSpacing.heightSM,
          ...errors.map((error) => Padding(
                padding: AppSpacing.only(bottom: AppSpacing.xs),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('• ', style: TextStyle(color: AppColors.error)),
                    Expanded(
                      child: Text(
                        error,
                        style: AppTextStyles.bodySmall.copyWith(
                          color: AppColors.error,
                        ),
                      ),
                    ),
                  ],
                ),
              )),
        ],
      ),
    );
  }
  
  static Widget fromType(
    ErrorType type, {
    String? message,
    VoidCallback? onRetry,
  }) {
    switch (type) {
      case ErrorType.network:
        return network(onRetry: onRetry);
      case ErrorType.server:
        return server(onRetry: onRetry);
      case ErrorType.timeout:
        return timeout(onRetry: onRetry);
      case ErrorType.permission:
        return permission(message: message, onAction: onRetry);
      case ErrorType.notFound:
        return notFound(onAction: onRetry);
      case ErrorType.validation:
        return CustomErrorWidget(
          error: 'Validation Error',
          details: message ?? 'Please check your input and try again.',
          icon: Icons.warning_amber_rounded,
          onRetry: onRetry,
        );
      case ErrorType.unknown:
      default:
        return CustomErrorWidget(
          error: AppStrings.unknownError,
          details: message ?? AppStrings.tryAgain,
          onRetry: onRetry,
        );
    }
  }
}