import 'package:flutter/material.dart';
import '../../../core/theme/theme.dart';
import '../../../core/constants/constants.dart';

/// A customizable dropdown with search capability
/// 
/// Example usage:
/// ```dart
/// CustomDropdown<String>(
///   label: 'Category',
///   hintText: 'Select a category',
///   items: ['Electronics', 'Clothing', 'Food', 'Books'],
///   value: selectedCategory,
///   onChanged: (value) => setState(() => selectedCategory = value),
///   itemBuilder: (item) => Text(item),
///   searchable: true,
/// )
/// ```
class CustomDropdown<T> extends StatefulWidget {
  final String? label;
  final String? hintText;
  final String? helperText;
  final String? errorText;
  final T? value;
  final List<T> items;
  final ValueChanged<T?>? onChanged;
  final Widget Function(T) itemBuilder;
  final String Function(T)? displayStringForItem;
  final bool Function(T, String)? searchMatcher;
  final bool enabled;
  final bool searchable;
  final bool showClearButton;
  final IconData? prefixIcon;
  final Widget? prefix;
  final FormFieldValidator<T>? validator;
  final AutovalidateMode? autovalidateMode;
  final EdgeInsetsGeometry? contentPadding;
  final InputBorder? border;
  final Color? fillColor;
  final double? menuMaxHeight;
  final bool isDense;
  
  const CustomDropdown({
    Key? key,
    this.label,
    this.hintText,
    this.helperText,
    this.errorText,
    this.value,
    required this.items,
    this.onChanged,
    required this.itemBuilder,
    this.displayStringForItem,
    this.searchMatcher,
    this.enabled = true,
    this.searchable = false,
    this.showClearButton = true,
    this.prefixIcon,
    this.prefix,
    this.validator,
    this.autovalidateMode,
    this.contentPadding,
    this.border,
    this.fillColor,
    this.menuMaxHeight,
    this.isDense = false,
  }) : super(key: key);

  @override
  State<CustomDropdown<T>> createState() => _CustomDropdownState<T>();
}

class _CustomDropdownState<T> extends State<CustomDropdown<T>> {
  final FocusNode _focusNode = FocusNode();
  final TextEditingController _searchController = TextEditingController();
  final LayerLink _layerLink = LayerLink();
  OverlayEntry? _overlayEntry;
  List<T> _filteredItems = [];
  bool _isOpen = false;
  String? _errorText;
  
  @override
  void initState() {
    super.initState();
    _filteredItems = widget.items;
    _errorText = widget.errorText;
    _focusNode.addListener(_onFocusChanged);
  }
  
  @override
  void dispose() {
    _focusNode.removeListener(_onFocusChanged);
    _focusNode.dispose();
    _searchController.dispose();
    _removeOverlay();
    super.dispose();
  }
  
  @override
  void didUpdateWidget(CustomDropdown<T> oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.errorText != oldWidget.errorText) {
      setState(() {
        _errorText = widget.errorText;
      });
    }
    if (widget.items != oldWidget.items) {
      setState(() {
        _filteredItems = widget.items;
      });
    }
  }
  
  void _onFocusChanged() {
    if (!_focusNode.hasFocus && _isOpen) {
      _closeDropdown();
    }
  }
  
  String _getDisplayString(T? item) {
    if (item == null) return '';
    if (widget.displayStringForItem != null) {
      return widget.displayStringForItem!(item);
    }
    return item.toString();
  }
  
  void _toggleDropdown() {
    if (!widget.enabled) return;
    
    if (_isOpen) {
      _closeDropdown();
    } else {
      _openDropdown();
    }
  }
  
  void _openDropdown() {
    _focusNode.requestFocus();
    _overlayEntry = _createOverlayEntry();
    Overlay.of(context).insert(_overlayEntry!);
    setState(() {
      _isOpen = true;
    });
  }
  
  void _closeDropdown() {
    _removeOverlay();
    _searchController.clear();
    setState(() {
      _isOpen = false;
      _filteredItems = widget.items;
    });
  }
  
  void _removeOverlay() {
    _overlayEntry?.remove();
    _overlayEntry = null;
  }
  
  void _onSearchChanged(String query) {
    setState(() {
      if (query.isEmpty) {
        _filteredItems = widget.items;
      } else {
        _filteredItems = widget.items.where((item) {
          if (widget.searchMatcher != null) {
            return widget.searchMatcher!(item, query);
          }
          final displayString = _getDisplayString(item).toLowerCase();
          return displayString.contains(query.toLowerCase());
        }).toList();
      }
    });
    _overlayEntry?.markNeedsBuild();
  }
  
  void _selectItem(T? item) {
    widget.onChanged?.call(item);
    _closeDropdown();
    
    // Validate after selection
    if (widget.validator != null) {
      final error = widget.validator!(item);
      setState(() {
        _errorText = error;
      });
    }
  }
  
  OverlayEntry _createOverlayEntry() {
    final RenderBox renderBox = context.findRenderObject() as RenderBox;
    final size = renderBox.size;
    final offset = renderBox.localToGlobal(Offset.zero);
    
    return OverlayEntry(
      builder: (context) => Positioned(
        width: size.width,
        child: CompositedTransformFollower(
          link: _layerLink,
          showWhenUnlinked: false,
          offset: Offset(0, size.height + 5),
          child: Material(
            elevation: 8,
            borderRadius: AppSpacing.borderRadiusSM,
            child: Container(
              constraints: BoxConstraints(
                maxHeight: widget.menuMaxHeight ?? 300,
              ),
              decoration: BoxDecoration(
                color: Theme.of(context).cardColor,
                borderRadius: AppSpacing.borderRadiusSM,
                border: Border.all(
                  color: AppColors.border,
                  width: 1,
                ),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (widget.searchable) ...[
                    Padding(
                      padding: AppSpacing.allSM,
                      child: TextField(
                        controller: _searchController,
                        decoration: InputDecoration(
                          hintText: AppStrings.searchPlaceholder,
                          prefixIcon: const Icon(Icons.search),
                          isDense: true,
                          border: OutlineInputBorder(
                            borderRadius: AppSpacing.borderRadiusSM,
                          ),
                        ),
                        onChanged: _onSearchChanged,
                        autofocus: true,
                      ),
                    ),
                    const Divider(height: 1),
                  ],
                  Flexible(
                    child: _filteredItems.isEmpty
                        ? Padding(
                            padding: AppSpacing.allMD,
                            child: Text(
                              AppStrings.noResults,
                              style: AppTextStyles.bodyMedium.copyWith(
                                color: AppColors.textTertiary,
                              ),
                            ),
                          )
                        : ListView.builder(
                            shrinkWrap: true,
                            padding: AppSpacing.verticalXS,
                            itemCount: _filteredItems.length,
                            itemBuilder: (context, index) {
                              final item = _filteredItems[index];
                              final isSelected = item == widget.value;
                              
                              return InkWell(
                                onTap: () => _selectItem(item),
                                child: Container(
                                  padding: AppSpacing.symmetric(
                                    horizontal: AppSpacing.md,
                                    vertical: AppSpacing.sm,
                                  ),
                                  color: isSelected
                                      ? Theme.of(context)
                                          .colorScheme
                                          .primary
                                          .withOpacity(0.1)
                                      : null,
                                  child: Row(
                                    children: [
                                      Expanded(
                                        child: widget.itemBuilder(item),
                                      ),
                                      if (isSelected)
                                        Icon(
                                          Icons.check,
                                          size: UIConstants.iconSizeSM,
                                          color: Theme.of(context)
                                              .colorScheme
                                              .primary,
                                        ),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
  
  Widget _buildPrefix() {
    if (widget.prefix != null) {
      return widget.prefix!;
    }
    
    if (widget.prefixIcon != null) {
      return Icon(
        widget.prefixIcon,
        size: UIConstants.iconSizeSM,
        color: _focusNode.hasFocus
            ? Theme.of(context).colorScheme.primary
            : AppColors.textTertiary,
      );
    }
    
    return const SizedBox.shrink();
  }
  
  Widget _buildSuffix() {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (widget.showClearButton && widget.value != null && widget.enabled)
          IconButton(
            icon: const Icon(Icons.clear),
            iconSize: UIConstants.iconSizeSM,
            color: AppColors.textTertiary,
            onPressed: () => _selectItem(null),
          ),
        Icon(
          _isOpen ? Icons.arrow_drop_up : Icons.arrow_drop_down,
          size: UIConstants.iconSizeMD,
          color: widget.enabled
              ? (_focusNode.hasFocus
                  ? Theme.of(context).colorScheme.primary
                  : AppColors.textTertiary)
              : AppColors.textDisabled,
        ),
      ],
    );
  }
  
  @override
  Widget build(BuildContext context) {
    final hasError = _errorText != null && _errorText!.isNotEmpty;
    
    return CompositedTransformTarget(
      link: _layerLink,
      child: FormField<T>(
        initialValue: widget.value,
        validator: widget.validator,
        autovalidateMode: widget.autovalidateMode,
        builder: (field) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              InkWell(
                onTap: _toggleDropdown,
                borderRadius: AppSpacing.borderRadiusSM,
                child: InputDecorator(
                  decoration: InputDecoration(
                    labelText: widget.label,
                    hintText: widget.hintText,
                    helperText: widget.helperText,
                    helperMaxLines: 2,
                    errorText: _errorText,
                    errorMaxLines: 2,
                    filled: true,
                    fillColor: widget.fillColor ??
                        (widget.enabled
                            ? (_focusNode.hasFocus
                                ? AppColors.primary.withOpacity(0.05)
                                : Theme.of(context)
                                    .inputDecorationTheme
                                    .fillColor)
                            : AppColors.neutral100),
                    isDense: widget.isDense,
                    contentPadding: widget.contentPadding,
                    prefixIcon: widget.prefixIcon != null || widget.prefix != null
                        ? _buildPrefix()
                        : null,
                    suffixIcon: _buildSuffix(),
                    border: widget.border,
                    enabledBorder: widget.border ??
                        (hasError
                            ? Theme.of(context).inputDecorationTheme.errorBorder
                            : null),
                    focusedBorder: widget.border ??
                        (hasError
                            ? Theme.of(context)
                                .inputDecorationTheme
                                .focusedErrorBorder
                            : null),
                  ),
                  child: widget.value == null
                      ? Text(
                          widget.hintText ?? '',
                          style: AppTextStyles.bodyMedium.copyWith(
                            color: AppColors.textTertiary,
                          ),
                        )
                      : widget.itemBuilder(widget.value as T),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}