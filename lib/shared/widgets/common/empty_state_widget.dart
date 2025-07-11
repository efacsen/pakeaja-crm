import 'package:flutter/material.dart';
import '../../../core/theme/theme.dart';
import '../../../core/constants/constants.dart';

/// A widget to display when there's no data or content
/// 
/// Example usage:
/// ```dart
/// EmptyStateWidget(
///   icon: Icons.inbox,
///   title: 'No Messages',
///   message: 'You don\'t have any messages yet',
///   actionLabel: 'Start Conversation',
///   onAction: () => navigateToNewMessage(),
/// )
/// ```
class EmptyStateWidget extends StatelessWidget {
  final IconData? icon;
  final Widget? iconWidget;
  final String title;
  final String? message;
  final String? actionLabel;
  final VoidCallback? onAction;
  final Widget? action;
  final double iconSize;
  final Color? iconColor;
  final TextStyle? titleStyle;
  final TextStyle? messageStyle;
  final EdgeInsetsGeometry? padding;
  final double spacing;
  final bool center;
  
  const EmptyStateWidget({
    Key? key,
    this.icon,
    this.iconWidget,
    required this.title,
    this.message,
    this.actionLabel,
    this.onAction,
    this.action,
    this.iconSize = 80,
    this.iconColor,
    this.titleStyle,
    this.messageStyle,
    this.padding,
    this.spacing = 16,
    this.center = true,
  }) : assert(
          icon != null || iconWidget != null,
          'Either icon or iconWidget must be provided',
        ),
        assert(
          (actionLabel == null && onAction == null) ||
              (actionLabel != null && onAction != null) ||
              action != null,
          'Both actionLabel and onAction must be provided together, or use custom action widget',
        ),
        super(key: key);
  
  @override
  Widget build(BuildContext context) {
    Widget content = Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        _buildIcon(context),
        SizedBox(height: spacing),
        Text(
          title,
          style: titleStyle ??
              AppTextStyles.headlineSmall.copyWith(
                color: AppColors.textPrimary,
                fontWeight: FontWeight.w600,
              ),
          textAlign: TextAlign.center,
        ),
        if (message != null) ...[
          SizedBox(height: spacing / 2),
          Text(
            message!,
            style: messageStyle ??
                AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.textSecondary,
                ),
            textAlign: TextAlign.center,
          ),
        ],
        if (action != null || (actionLabel != null && onAction != null)) ...[
          SizedBox(height: spacing * 1.5),
          _buildAction(context),
        ],
      ],
    );
    
    if (padding != null) {
      content = Padding(
        padding: padding!,
        child: content,
      );
    }
    
    if (center) {
      content = Center(child: content);
    }
    
    return content;
  }
  
  Widget _buildIcon(BuildContext context) {
    if (iconWidget != null) {
      return iconWidget!;
    }
    
    return Container(
      width: iconSize * 1.5,
      height: iconSize * 1.5,
      decoration: BoxDecoration(
        color: (iconColor ?? AppColors.primary).withOpacity(0.1),
        shape: BoxShape.circle,
      ),
      child: Icon(
        icon,
        size: iconSize,
        color: iconColor ?? AppColors.primary,
      ),
    );
  }
  
  Widget _buildAction(BuildContext context) {
    if (action != null) {
      return action!;
    }
    
    return ElevatedButton(
      onPressed: onAction,
      child: Text(actionLabel!),
    );
  }
}

/// Pre-configured empty states for common scenarios
class CommonEmptyStates {
  CommonEmptyStates._();
  
  static Widget noData({
    String? message,
    String? actionLabel,
    VoidCallback? onAction,
  }) {
    return EmptyStateWidget(
      icon: Icons.inbox,
      title: AppStrings.noData,
      message: message ?? AppStrings.nothingHere,
      actionLabel: actionLabel,
      onAction: onAction,
    );
  }
  
  static Widget noResults({
    String? searchQuery,
    VoidCallback? onClear,
  }) {
    return EmptyStateWidget(
      icon: Icons.search_off,
      title: AppStrings.noResults,
      message: searchQuery != null
          ? AppStrings.format(AppStrings.noSearchResults, [searchQuery])
          : AppStrings.noResults,
      actionLabel: onClear != null ? AppStrings.clearSearch : null,
      onAction: onClear,
    );
  }
  
  static Widget offline({
    VoidCallback? onRetry,
  }) {
    return EmptyStateWidget(
      icon: Icons.wifi_off,
      title: AppStrings.offline,
      message: AppStrings.offlineMessage,
      actionLabel: onRetry != null ? AppStrings.retry : null,
      onAction: onRetry,
      iconColor: AppColors.warning,
    );
  }
  
  static Widget error({
    String? message,
    VoidCallback? onRetry,
  }) {
    return EmptyStateWidget(
      icon: Icons.error_outline,
      title: AppStrings.error,
      message: message ?? AppStrings.genericError,
      actionLabel: onRetry != null ? AppStrings.retry : null,
      onAction: onRetry,
      iconColor: AppColors.error,
    );
  }
  
  static Widget comingSoon({
    String feature = 'This feature',
  }) {
    return EmptyStateWidget(
      icon: Icons.engineering,
      title: 'Coming Soon',
      message: '$feature is under development and will be available soon!',
      iconColor: AppColors.secondary,
    );
  }
  
  static Widget maintenance() {
    return const EmptyStateWidget(
      icon: Icons.build,
      title: 'Under Maintenance',
      message: 'This section is temporarily unavailable. Please check back later.',
      iconColor: AppColors.warning,
    );
  }
  
  static Widget permission({
    String? message,
    String? actionLabel,
    VoidCallback? onAction,
  }) {
    return EmptyStateWidget(
      icon: Icons.lock_outline,
      title: 'Access Denied',
      message: message ?? 'You don\'t have permission to view this content.',
      actionLabel: actionLabel,
      onAction: onAction,
      iconColor: AppColors.error,
    );
  }
}

/// Illustration-based empty state widget
class IllustratedEmptyState extends StatelessWidget {
  final String illustrationPath;
  final String title;
  final String? message;
  final String? actionLabel;
  final VoidCallback? onAction;
  final Widget? action;
  final double illustrationHeight;
  final TextStyle? titleStyle;
  final TextStyle? messageStyle;
  final EdgeInsetsGeometry? padding;
  final double spacing;
  final bool center;
  
  const IllustratedEmptyState({
    Key? key,
    required this.illustrationPath,
    required this.title,
    this.message,
    this.actionLabel,
    this.onAction,
    this.action,
    this.illustrationHeight = 200,
    this.titleStyle,
    this.messageStyle,
    this.padding,
    this.spacing = 16,
    this.center = true,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    Widget content = Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Image.asset(
          illustrationPath,
          height: illustrationHeight,
          fit: BoxFit.contain,
        ),
        SizedBox(height: spacing * 1.5),
        Text(
          title,
          style: titleStyle ??
              AppTextStyles.headlineSmall.copyWith(
                color: AppColors.textPrimary,
                fontWeight: FontWeight.w600,
              ),
          textAlign: TextAlign.center,
        ),
        if (message != null) ...[
          SizedBox(height: spacing / 2),
          Text(
            message!,
            style: messageStyle ??
                AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.textSecondary,
                ),
            textAlign: TextAlign.center,
          ),
        ],
        if (action != null || (actionLabel != null && onAction != null)) ...[
          SizedBox(height: spacing * 1.5),
          action ??
              ElevatedButton(
                onPressed: onAction,
                child: Text(actionLabel!),
              ),
        ],
      ],
    );
    
    if (padding != null) {
      content = Padding(
        padding: padding!,
        child: content,
      );
    }
    
    if (center) {
      content = Center(child: content);
    }
    
    return content;
  }
}