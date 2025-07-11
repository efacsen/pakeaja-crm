import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/theme/theme.dart';
import '../../../core/constants/constants.dart';
import '../common/custom_app_bar.dart';
import '../buttons/floating_action_button.dart';

/// Custom scaffold with common layout patterns
/// 
/// Example usage:
/// ```dart
/// CustomScaffold(
///   title: 'Dashboard',
///   body: DashboardContent(),
///   floatingActionButton: CustomFloatingActionButton(
///     icon: Icons.add,
///     onPressed: () => createNew(),
///   ),
/// )
/// ```
class CustomScaffold extends StatelessWidget {
  final String? title;
  final Widget? titleWidget;
  final Widget body;
  final List<AppBarAction>? appBarActions;
  final Widget? drawer;
  final Widget? endDrawer;
  final Widget? bottomNavigationBar;
  final Widget? bottomSheet;
  final Widget? floatingActionButton;
  final FloatingActionButtonLocation? floatingActionButtonLocation;
  final Color? backgroundColor;
  final bool resizeToAvoidBottomInset;
  final bool extendBody;
  final bool extendBodyBehindAppBar;
  final PreferredSizeWidget? appBar;
  final bool showAppBar;
  final VoidCallback? onBackPressed;
  final EdgeInsetsGeometry? padding;
  final bool useSafeArea;
  final SystemUiOverlayStyle? systemOverlayStyle;
  final Widget? persistentFooterButtons;
  final bool isLoading;
  final String? loadingMessage;
  
  const CustomScaffold({
    Key? key,
    this.title,
    this.titleWidget,
    required this.body,
    this.appBarActions,
    this.drawer,
    this.endDrawer,
    this.bottomNavigationBar,
    this.bottomSheet,
    this.floatingActionButton,
    this.floatingActionButtonLocation,
    this.backgroundColor,
    this.resizeToAvoidBottomInset = true,
    this.extendBody = false,
    this.extendBodyBehindAppBar = false,
    this.appBar,
    this.showAppBar = true,
    this.onBackPressed,
    this.padding,
    this.useSafeArea = true,
    this.systemOverlayStyle,
    this.persistentFooterButtons,
    this.isLoading = false,
    this.loadingMessage,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final defaultSystemOverlayStyle = AppTheme.systemUiOverlayStyle(context);
    
    Widget bodyContent = body;
    
    if (padding != null) {
      bodyContent = Padding(
        padding: padding!,
        child: bodyContent,
      );
    }
    
    if (useSafeArea && !extendBodyBehindAppBar) {
      bodyContent = SafeArea(
        child: bodyContent,
      );
    }
    
    if (isLoading) {
      bodyContent = Stack(
        children: [
          bodyContent,
          Container(
            color: Colors.black.withOpacity(0.5),
            child: Center(
              child: Card(
                child: Padding(
                  padding: AppSpacing.allLG,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const CircularProgressIndicator(),
                      if (loadingMessage != null) ...[
                        AppSpacing.heightMD,
                        Text(
                          loadingMessage!,
                          style: AppTextStyles.bodyMedium,
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      );
    }
    
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: systemOverlayStyle ?? defaultSystemOverlayStyle,
      child: Scaffold(
        appBar: showAppBar
            ? (appBar ??
                CustomAppBar(
                  title: title,
                  titleWidget: titleWidget,
                  actions: appBarActions,
                  onBackPressed: onBackPressed,
                ))
            : null,
        body: bodyContent,
        drawer: drawer,
        endDrawer: endDrawer,
        bottomNavigationBar: bottomNavigationBar,
        bottomSheet: bottomSheet,
        floatingActionButton: floatingActionButton,
        floatingActionButtonLocation: floatingActionButtonLocation,
        backgroundColor: backgroundColor,
        resizeToAvoidBottomInset: resizeToAvoidBottomInset,
        extendBody: extendBody,
        extendBodyBehindAppBar: extendBodyBehindAppBar,
        persistentFooterButtons: persistentFooterButtons != null
            ? [persistentFooterButtons!]
            : null,
      ),
    );
  }
}

/// Tabbed scaffold for screens with tabs
class TabbedScaffold extends StatefulWidget {
  final String? title;
  final List<ScaffoldTab> tabs;
  final List<AppBarAction>? appBarActions;
  final Widget? drawer;
  final Widget? floatingActionButton;
  final int initialIndex;
  final ValueChanged<int>? onTabChanged;
  final bool isScrollable;
  final TabBarIndicatorSize? indicatorSize;
  final EdgeInsetsGeometry? tabBarPadding;
  final Color? backgroundColor;
  
  const TabbedScaffold({
    Key? key,
    this.title,
    required this.tabs,
    this.appBarActions,
    this.drawer,
    this.floatingActionButton,
    this.initialIndex = 0,
    this.onTabChanged,
    this.isScrollable = false,
    this.indicatorSize,
    this.tabBarPadding,
    this.backgroundColor,
  }) : super(key: key);

  @override
  State<TabbedScaffold> createState() => _TabbedScaffoldState();
}

class _TabbedScaffoldState extends State<TabbedScaffold>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  
  @override
  void initState() {
    super.initState();
    _tabController = TabController(
      length: widget.tabs.length,
      vsync: this,
      initialIndex: widget.initialIndex,
    );
    _tabController.addListener(_handleTabChange);
  }
  
  @override
  void dispose() {
    _tabController.removeListener(_handleTabChange);
    _tabController.dispose();
    super.dispose();
  }
  
  void _handleTabChange() {
    if (_tabController.indexIsChanging) {
      widget.onTabChanged?.call(_tabController.index);
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return CustomScaffold(
      backgroundColor: widget.backgroundColor,
      appBar: CustomAppBar(
        title: widget.title,
        actions: widget.appBarActions,
        bottom: TabBar(
          controller: _tabController,
          isScrollable: widget.isScrollable,
          indicatorSize: widget.indicatorSize,
          padding: widget.tabBarPadding,
          tabs: widget.tabs.map((tab) {
            return Tab(
              text: tab.label,
              icon: tab.icon != null ? Icon(tab.icon) : null,
            );
          }).toList(),
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: widget.tabs.map((tab) => tab.content).toList(),
      ),
      drawer: widget.drawer,
      floatingActionButton: widget.floatingActionButton,
    );
  }
}

/// Tab configuration for TabbedScaffold
class ScaffoldTab {
  final String label;
  final IconData? icon;
  final Widget content;
  
  const ScaffoldTab({
    required this.label,
    this.icon,
    required this.content,
  });
}

/// Master-detail scaffold for larger screens
class MasterDetailScaffold extends StatelessWidget {
  final Widget master;
  final Widget? detail;
  final double masterWidth;
  final double minMasterWidth;
  final double maxMasterWidth;
  final Color? dividerColor;
  final double dividerWidth;
  final Widget? emptyDetail;
  final bool showDivider;
  
  const MasterDetailScaffold({
    Key? key,
    required this.master,
    this.detail,
    this.masterWidth = 300,
    this.minMasterWidth = 200,
    this.maxMasterWidth = 400,
    this.dividerColor,
    this.dividerWidth = 1,
    this.emptyDetail,
    this.showDivider = true,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: masterWidth.clamp(minMasterWidth, maxMasterWidth),
          child: master,
        ),
        if (showDivider)
          Container(
            width: dividerWidth,
            color: dividerColor ?? Theme.of(context).dividerColor,
          ),
        Expanded(
          child: detail ?? emptyDetail ?? const EmptyDetailView(),
        ),
      ],
    );
  }
}

/// Empty detail view for master-detail layout
class EmptyDetailView extends StatelessWidget {
  final String? message;
  final IconData? icon;
  
  const EmptyDetailView({
    Key? key,
    this.message,
    this.icon,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon ?? Icons.inbox,
            size: UIConstants.iconSizeXXL,
            color: AppColors.textTertiary,
          ),
          AppSpacing.heightMD,
          Text(
            message ?? 'Select an item to view details',
            style: AppTextStyles.bodyLarge.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }
}