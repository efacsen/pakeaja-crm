import 'package:flutter/material.dart';
import '../../../core/theme/theme.dart';
import '../../../core/constants/constants.dart';

/// Section header with optional actions
/// 
/// Example usage:
/// ```dart
/// SectionHeader(
///   title: 'Recent Orders',
///   action: TextButton(
///     onPressed: () => viewAll(),
///     child: Text('View All'),
///   ),
/// )
/// ```
class SectionHeader extends StatelessWidget {
  final String title;
  final String? subtitle;
  final Widget? leading;
  final Widget? action;
  final List<Widget>? actions;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final Color? titleColor;
  final TextStyle? titleStyle;
  final TextStyle? subtitleStyle;
  final bool showDivider;
  final Color? dividerColor;
  final double dividerThickness;
  
  const SectionHeader({
    Key? key,
    required this.title,
    this.subtitle,
    this.leading,
    this.action,
    this.actions,
    this.padding,
    this.margin,
    this.titleColor,
    this.titleStyle,
    this.subtitleStyle,
    this.showDivider = false,
    this.dividerColor,
    this.dividerThickness = 1,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    Widget header = Row(
      children: [
        if (leading != null) ...[
          leading!,
          AppSpacing.widthSM,
        ],
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: titleStyle ??
                    AppTextStyles.titleMedium.copyWith(
                      fontWeight: FontWeight.w600,
                      color: titleColor,
                    ),
              ),
              if (subtitle != null) ...[
                AppSpacing.heightXXS,
                Text(
                  subtitle!,
                  style: subtitleStyle ??
                      AppTextStyles.bodySmall.copyWith(
                        color: AppColors.textSecondary,
                      ),
                ),
              ],
            ],
          ),
        ),
        if (action != null)
          action!
        else if (actions != null)
          Row(
            mainAxisSize: MainAxisSize.min,
            children: actions!,
          ),
      ],
    );
    
    if (padding != null) {
      header = Padding(
        padding: padding!,
        child: header,
      );
    }
    
    return Container(
      margin: margin,
      child: Column(
        children: [
          header,
          if (showDivider) ...[
            AppSpacing.heightSM,
            Divider(
              color: dividerColor,
              thickness: dividerThickness,
              height: 1,
            ),
          ],
        ],
      ),
    );
  }
}

/// Collapsible section header
class CollapsibleSectionHeader extends StatefulWidget {
  final String title;
  final String? subtitle;
  final Widget child;
  final bool initiallyExpanded;
  final ValueChanged<bool>? onExpansionChanged;
  final Widget? leading;
  final Widget? trailing;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? childPadding;
  final Duration animationDuration;
  final Curve animationCurve;
  
  const CollapsibleSectionHeader({
    Key? key,
    required this.title,
    this.subtitle,
    required this.child,
    this.initiallyExpanded = true,
    this.onExpansionChanged,
    this.leading,
    this.trailing,
    this.padding,
    this.childPadding,
    this.animationDuration = UIConstants.animationNormal,
    this.animationCurve = Curves.easeInOut,
  }) : super(key: key);

  @override
  State<CollapsibleSectionHeader> createState() => _CollapsibleSectionHeaderState();
}

class _CollapsibleSectionHeaderState extends State<CollapsibleSectionHeader>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _expandAnimation;
  late Animation<double> _rotateAnimation;
  bool _isExpanded = false;
  
  @override
  void initState() {
    super.initState();
    _isExpanded = widget.initiallyExpanded;
    _controller = AnimationController(
      duration: widget.animationDuration,
      vsync: this,
      value: _isExpanded ? 1.0 : 0.0,
    );
    _expandAnimation = CurvedAnimation(
      parent: _controller,
      curve: widget.animationCurve,
    );
    _rotateAnimation = Tween<double>(
      begin: 0.0,
      end: 0.5,
    ).animate(_expandAnimation);
  }
  
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
  
  void _toggleExpanded() {
    setState(() {
      _isExpanded = !_isExpanded;
      if (_isExpanded) {
        _controller.forward();
      } else {
        _controller.reverse();
      }
    });
    widget.onExpansionChanged?.call(_isExpanded);
  }
  
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        InkWell(
          onTap: _toggleExpanded,
          borderRadius: AppSpacing.borderRadiusSM,
          child: Padding(
            padding: widget.padding ?? AppSpacing.allMD,
            child: Row(
              children: [
                if (widget.leading != null) ...[
                  widget.leading!,
                  AppSpacing.widthSM,
                ],
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.title,
                        style: AppTextStyles.titleMedium.copyWith(
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      if (widget.subtitle != null) ...[
                        AppSpacing.heightXXS,
                        Text(
                          widget.subtitle!,
                          style: AppTextStyles.bodySmall.copyWith(
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
                if (widget.trailing != null) ...[
                  widget.trailing!,
                  AppSpacing.widthSM,
                ],
                RotationTransition(
                  turns: _rotateAnimation,
                  child: Icon(
                    Icons.expand_more,
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
        ),
        SizeTransition(
          sizeFactor: _expandAnimation,
          child: Padding(
            padding: widget.childPadding ?? AppSpacing.allMD,
            child: widget.child,
          ),
        ),
      ],
    );
  }
}

/// List item tile with various layouts
class ListItemTile extends StatelessWidget {
  final String title;
  final String? subtitle;
  final String? description;
  final Widget? leading;
  final Widget? trailing;
  final VoidCallback? onTap;
  final VoidCallback? onLongPress;
  final EdgeInsetsGeometry? padding;
  final bool selected;
  final bool enabled;
  final Color? selectedColor;
  final Color? tileColor;
  final ListItemLayout layout;
  final CrossAxisAlignment crossAxisAlignment;
  
  const ListItemTile({
    Key? key,
    required this.title,
    this.subtitle,
    this.description,
    this.leading,
    this.trailing,
    this.onTap,
    this.onLongPress,
    this.padding,
    this.selected = false,
    this.enabled = true,
    this.selectedColor,
    this.tileColor,
    this.layout = ListItemLayout.standard,
    this.crossAxisAlignment = CrossAxisAlignment.center,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final isCompact = layout == ListItemLayout.compact;
    final isDetailed = layout == ListItemLayout.detailed;
    
    return Material(
      color: selected
          ? (selectedColor ?? AppColors.primary).withOpacity(0.1)
          : tileColor ?? Colors.transparent,
      child: InkWell(
        onTap: enabled ? onTap : null,
        onLongPress: enabled ? onLongPress : null,
        child: Padding(
          padding: padding ??
              (isCompact
                  ? AppSpacing.symmetric(
                      horizontal: AppSpacing.md,
                      vertical: AppSpacing.xs,
                    )
                  : AppSpacing.listTilePadding),
          child: Row(
            crossAxisAlignment: crossAxisAlignment,
            children: [
              if (leading != null) ...[
                leading!,
                SizedBox(width: isCompact ? AppSpacing.sm : AppSpacing.md),
              ],
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: (isCompact
                              ? AppTextStyles.bodyMedium
                              : AppTextStyles.titleSmall)
                          .copyWith(
                        color: enabled
                            ? (selected
                                ? selectedColor ?? AppColors.primary
                                : AppColors.textPrimary)
                            : AppColors.textDisabled,
                        fontWeight: selected ? FontWeight.w600 : FontWeight.w500,
                      ),
                    ),
                    if (subtitle != null) ...[
                      SizedBox(height: isCompact ? 0 : AppSpacing.xxs),
                      Text(
                        subtitle!,
                        style: (isCompact
                                ? AppTextStyles.caption
                                : AppTextStyles.bodySmall)
                            .copyWith(
                          color: enabled
                              ? AppColors.textSecondary
                              : AppColors.textDisabled,
                        ),
                      ),
                    ],
                    if (isDetailed && description != null) ...[
                      AppSpacing.heightXS,
                      Text(
                        description!,
                        style: AppTextStyles.bodySmall.copyWith(
                          color: enabled
                              ? AppColors.textTertiary
                              : AppColors.textDisabled,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ],
                ),
              ),
              if (trailing != null) ...[
                SizedBox(width: isCompact ? AppSpacing.sm : AppSpacing.md),
                trailing!,
              ],
            ],
          ),
        ),
      ),
    );
  }
}

/// List item layout options
enum ListItemLayout {
  compact,
  standard,
  detailed,
}

/// Separator for list sections
class ListSeparator extends StatelessWidget {
  final String? text;
  final Widget? leading;
  final Widget? trailing;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final Color? color;
  final TextStyle? textStyle;
  
  const ListSeparator({
    Key? key,
    this.text,
    this.leading,
    this.trailing,
    this.padding,
    this.margin,
    this.color,
    this.textStyle,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (text == null && leading == null && trailing == null) {
      return Container(
        margin: margin,
        child: Divider(
          color: color,
          thickness: 1,
          height: 1,
        ),
      );
    }
    
    return Container(
      margin: margin,
      padding: padding ?? AppSpacing.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      color: color ?? AppColors.neutral50,
      child: Row(
        children: [
          if (leading != null) ...[
            leading!,
            AppSpacing.widthSM,
          ],
          if (text != null)
            Expanded(
              child: Text(
                text!,
                style: textStyle ??
                    AppTextStyles.labelSmall.copyWith(
                      color: AppColors.textSecondary,
                      fontWeight: FontWeight.w600,
                    ),
              ),
            ),
          if (trailing != null) ...[
            AppSpacing.widthSM,
            trailing!,
          ],
        ],
      ),
    );
  }
}