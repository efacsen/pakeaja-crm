import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/theme/theme.dart';
import '../../../core/constants/constants.dart';

/// A customizable app bar with common actions and styling
/// 
/// Example usage:
/// ```dart
/// CustomAppBar(
///   title: 'Dashboard',
///   actions: [
///     AppBarAction(
///       icon: Icons.search,
///       onPressed: () => showSearch(),
///     ),
///     AppBarAction(
///       icon: Icons.notifications,
///       badge: '3',
///       onPressed: () => showNotifications(),
///     ),
///   ],
/// )
/// ```
class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String? title;
  final Widget? titleWidget;
  final List<AppBarAction>? actions;
  final bool showBackButton;
  final VoidCallback? onBackPressed;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final double elevation;
  final bool centerTitle;
  final Widget? leading;
  final double? leadingWidth;
  final PreferredSizeWidget? bottom;
  final SystemUiOverlayStyle? systemOverlayStyle;
  final double toolbarHeight;
  final TextStyle? titleTextStyle;
  final IconThemeData? iconTheme;
  final bool automaticallyImplyLeading;
  
  const CustomAppBar({
    Key? key,
    this.title,
    this.titleWidget,
    this.actions,
    this.showBackButton = true,
    this.onBackPressed,
    this.backgroundColor,
    this.foregroundColor,
    this.elevation = 0,
    this.centerTitle = true,
    this.leading,
    this.leadingWidth,
    this.bottom,
    this.systemOverlayStyle,
    this.toolbarHeight = kToolbarHeight,
    this.titleTextStyle,
    this.iconTheme,
    this.automaticallyImplyLeading = true,
  }) : assert(
          title != null || titleWidget != null,
          'Either title or titleWidget must be provided',
        ),
        super(key: key);
  
  @override
  Size get preferredSize => Size.fromHeight(
        toolbarHeight + (bottom?.preferredSize.height ?? 0),
      );
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return AppBar(
      title: titleWidget ??
          Text(
            title!,
            style: titleTextStyle ??
                AppTextStyles.titleLarge.copyWith(
                  color: foregroundColor ?? theme.appBarTheme.foregroundColor,
                  fontWeight: FontWeight.w600,
                ),
          ),
      leading: leading ?? _buildLeading(context),
      leadingWidth: leadingWidth,
      automaticallyImplyLeading: automaticallyImplyLeading,
      actions: _buildActions(context),
      backgroundColor: backgroundColor ?? theme.appBarTheme.backgroundColor,
      foregroundColor: foregroundColor ?? theme.appBarTheme.foregroundColor,
      elevation: elevation,
      centerTitle: centerTitle,
      bottom: bottom,
      systemOverlayStyle: systemOverlayStyle ??
          (isDark
              ? SystemUiOverlayStyle.light
              : SystemUiOverlayStyle.dark).copyWith(
            statusBarColor: Colors.transparent,
          ),
      toolbarHeight: toolbarHeight,
      iconTheme: iconTheme ??
          IconThemeData(
            color: foregroundColor ?? theme.appBarTheme.foregroundColor,
          ),
    );
  }
  
  Widget? _buildLeading(BuildContext context) {
    if (!showBackButton || !Navigator.of(context).canPop()) {
      return null;
    }
    
    return IconButton(
      icon: const Icon(Icons.arrow_back_ios),
      onPressed: onBackPressed ?? () => Navigator.of(context).pop(),
    );
  }
  
  List<Widget>? _buildActions(BuildContext context) {
    if (actions == null || actions!.isEmpty) {
      return null;
    }
    
    return actions!.map((action) => action.build(context)).toList();
  }
}

/// App bar action configuration
class AppBarAction {
  final IconData? icon;
  final Widget? iconWidget;
  final String? label;
  final VoidCallback onPressed;
  final String? badge;
  final Color? badgeColor;
  final Color? iconColor;
  final String? tooltip;
  final bool showLabel;
  
  const AppBarAction({
    this.icon,
    this.iconWidget,
    this.label,
    required this.onPressed,
    this.badge,
    this.badgeColor,
    this.iconColor,
    this.tooltip,
    this.showLabel = false,
  }) : assert(
          icon != null || iconWidget != null || label != null,
          'Either icon, iconWidget, or label must be provided',
        );
  
  Widget build(BuildContext context) {
    Widget actionWidget;
    
    if (label != null && (showLabel || icon == null)) {
      actionWidget = TextButton(
        onPressed: onPressed,
        child: Text(
          label!,
          style: AppTextStyles.labelLarge.copyWith(
            color: iconColor ?? Theme.of(context).appBarTheme.foregroundColor,
          ),
        ),
      );
    } else {
      Widget iconContent = iconWidget ??
          Icon(
            icon,
            color: iconColor,
          );
      
      if (badge != null) {
        iconContent = Stack(
          clipBehavior: Clip.none,
          children: [
            iconContent,
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
                  minWidth: 18,
                  minHeight: 18,
                ),
                child: Text(
                  badge!,
                  style: AppTextStyles.labelSmall.copyWith(
                    color: AppColors.textOnPrimary,
                    fontSize: 10,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ),
          ],
        );
      }
      
      actionWidget = IconButton(
        icon: iconContent,
        onPressed: onPressed,
        tooltip: tooltip ?? label,
      );
    }
    
    return actionWidget;
  }
}

/// Search app bar with integrated search field
class SearchAppBar extends StatefulWidget implements PreferredSizeWidget {
  final String hintText;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final VoidCallback? onClear;
  final TextEditingController? controller;
  final List<AppBarAction>? actions;
  final bool autofocus;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final double elevation;
  final Widget? leading;
  final bool showBackButton;
  final VoidCallback? onBackPressed;
  
  const SearchAppBar({
    Key? key,
    this.hintText = 'Search...',
    this.onChanged,
    this.onSubmitted,
    this.onClear,
    this.controller,
    this.actions,
    this.autofocus = true,
    this.backgroundColor,
    this.foregroundColor,
    this.elevation = 0,
    this.leading,
    this.showBackButton = true,
    this.onBackPressed,
  }) : super(key: key);
  
  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
  
  @override
  State<SearchAppBar> createState() => _SearchAppBarState();
}

class _SearchAppBarState extends State<SearchAppBar> {
  late TextEditingController _controller;
  bool _showClear = false;
  
  @override
  void initState() {
    super.initState();
    _controller = widget.controller ?? TextEditingController();
    _showClear = _controller.text.isNotEmpty;
    _controller.addListener(_updateClearButton);
  }
  
  @override
  void dispose() {
    if (widget.controller == null) {
      _controller.dispose();
    }
    super.dispose();
  }
  
  void _updateClearButton() {
    final showClear = _controller.text.isNotEmpty;
    if (showClear != _showClear) {
      setState(() {
        _showClear = showClear;
      });
    }
  }
  
  void _handleClear() {
    _controller.clear();
    widget.onClear?.call();
    widget.onChanged?.call('');
  }
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return AppBar(
      backgroundColor: widget.backgroundColor ?? theme.appBarTheme.backgroundColor,
      foregroundColor: widget.foregroundColor ?? theme.appBarTheme.foregroundColor,
      elevation: widget.elevation,
      leading: widget.leading ?? (widget.showBackButton
          ? IconButton(
              icon: const Icon(Icons.arrow_back_ios),
              onPressed: widget.onBackPressed ?? () => Navigator.of(context).pop(),
            )
          : null),
      title: TextField(
        controller: _controller,
        autofocus: widget.autofocus,
        onChanged: widget.onChanged,
        onSubmitted: widget.onSubmitted,
        decoration: InputDecoration(
          hintText: widget.hintText,
          hintStyle: AppTextStyles.bodyMedium.copyWith(
            color: AppColors.textTertiary,
          ),
          border: InputBorder.none,
          contentPadding: EdgeInsets.zero,
        ),
        style: AppTextStyles.bodyMedium,
      ),
      actions: [
        if (_showClear)
          IconButton(
            icon: const Icon(Icons.clear),
            onPressed: _handleClear,
          ),
        if (widget.actions != null)
          ...widget.actions!.map((action) => action.build(context)),
      ],
    );
  }
}

/// Sliver app bar for scrollable screens
class CustomSliverAppBar extends StatelessWidget {
  final String? title;
  final Widget? titleWidget;
  final List<AppBarAction>? actions;
  final bool floating;
  final bool pinned;
  final bool snap;
  final double expandedHeight;
  final Widget? flexibleSpace;
  final Color? backgroundColor;
  final Color? foregroundColor;
  final double elevation;
  final bool centerTitle;
  final Widget? leading;
  final double? leadingWidth;
  final bool showBackButton;
  final VoidCallback? onBackPressed;
  
  const CustomSliverAppBar({
    Key? key,
    this.title,
    this.titleWidget,
    this.actions,
    this.floating = false,
    this.pinned = true,
    this.snap = false,
    this.expandedHeight = kToolbarHeight,
    this.flexibleSpace,
    this.backgroundColor,
    this.foregroundColor,
    this.elevation = 0,
    this.centerTitle = true,
    this.leading,
    this.leadingWidth,
    this.showBackButton = true,
    this.onBackPressed,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return SliverAppBar(
      title: titleWidget ??
          (title != null
              ? Text(
                  title!,
                  style: AppTextStyles.titleLarge.copyWith(
                    color: foregroundColor ?? theme.appBarTheme.foregroundColor,
                    fontWeight: FontWeight.w600,
                  ),
                )
              : null),
      leading: leading ?? _buildLeading(context),
      leadingWidth: leadingWidth,
      actions: actions?.map((action) => action.build(context)).toList(),
      floating: floating,
      pinned: pinned,
      snap: snap,
      expandedHeight: expandedHeight,
      flexibleSpace: flexibleSpace,
      backgroundColor: backgroundColor ?? theme.appBarTheme.backgroundColor,
      foregroundColor: foregroundColor ?? theme.appBarTheme.foregroundColor,
      elevation: elevation,
      centerTitle: centerTitle,
    );
  }
  
  Widget? _buildLeading(BuildContext context) {
    if (!showBackButton || !Navigator.of(context).canPop()) {
      return null;
    }
    
    return IconButton(
      icon: const Icon(Icons.arrow_back_ios),
      onPressed: onBackPressed ?? () => Navigator.of(context).pop(),
    );
  }
}