import 'package:flutter/material.dart';
import '../../../core/theme/theme.dart';
import '../../../core/constants/constants.dart';

/// A customizable checkbox with label and error state
/// 
/// Example usage:
/// ```dart
/// CustomCheckbox(
///   value: isAgreed,
///   label: 'I agree to the terms and conditions',
///   onChanged: (value) => setState(() => isAgreed = value ?? false),
///   validator: (value) => value == true ? null : 'You must agree to continue',
/// )
/// ```
class CustomCheckbox extends StatefulWidget {
  final bool value;
  final ValueChanged<bool?>? onChanged;
  final String? label;
  final String? errorText;
  final bool enabled;
  final Color? activeColor;
  final Color? checkColor;
  final FormFieldValidator<bool>? validator;
  final AutovalidateMode? autovalidateMode;
  final bool tristate;
  final Widget? secondary;
  final EdgeInsetsGeometry? contentPadding;
  final MainAxisAlignment mainAxisAlignment;
  final CrossAxisAlignment crossAxisAlignment;
  final bool dense;
  
  const CustomCheckbox({
    Key? key,
    required this.value,
    this.onChanged,
    this.label,
    this.errorText,
    this.enabled = true,
    this.activeColor,
    this.checkColor,
    this.validator,
    this.autovalidateMode,
    this.tristate = false,
    this.secondary,
    this.contentPadding,
    this.mainAxisAlignment = MainAxisAlignment.start,
    this.crossAxisAlignment = CrossAxisAlignment.center,
    this.dense = false,
  }) : super(key: key);

  @override
  State<CustomCheckbox> createState() => _CustomCheckboxState();
}

class _CustomCheckboxState extends State<CustomCheckbox> {
  String? _errorText;
  
  @override
  void initState() {
    super.initState();
    _errorText = widget.errorText;
  }
  
  @override
  void didUpdateWidget(CustomCheckbox oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.errorText != oldWidget.errorText) {
      setState(() {
        _errorText = widget.errorText;
      });
    }
  }
  
  void _handleChanged(bool? value) {
    widget.onChanged?.call(value);
    
    // Validate after change
    if (widget.validator != null) {
      final error = widget.validator!(value ?? false);
      setState(() {
        _errorText = error;
      });
    }
  }
  
  @override
  Widget build(BuildContext context) {
    final hasError = _errorText != null && _errorText!.isNotEmpty;
    
    return FormField<bool>(
      initialValue: widget.value,
      validator: widget.validator,
      autovalidateMode: widget.autovalidateMode,
      builder: (field) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            InkWell(
              onTap: widget.enabled
                  ? () => _handleChanged(!widget.value)
                  : null,
              borderRadius: AppSpacing.borderRadiusSM,
              child: Padding(
                padding: widget.contentPadding ?? EdgeInsets.zero,
                child: Row(
                  mainAxisAlignment: widget.mainAxisAlignment,
                  crossAxisAlignment: widget.crossAxisAlignment,
                  children: [
                    SizedBox(
                      width: 24,
                      height: 24,
                      child: Checkbox(
                        value: widget.value,
                        onChanged: widget.enabled ? _handleChanged : null,
                        activeColor: widget.activeColor ?? AppColors.primary,
                        checkColor: widget.checkColor ?? AppColors.textOnPrimary,
                        tristate: widget.tristate,
                        materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                        visualDensity: widget.dense
                            ? VisualDensity.compact
                            : VisualDensity.standard,
                      ),
                    ),
                    if (widget.label != null) ...[
                      AppSpacing.widthSM,
                      Expanded(
                        child: Text(
                          widget.label!,
                          style: AppTextStyles.bodyMedium.copyWith(
                            color: widget.enabled
                                ? (hasError
                                    ? AppColors.error
                                    : AppColors.textPrimary)
                                : AppColors.textDisabled,
                          ),
                        ),
                      ),
                    ],
                    if (widget.secondary != null) ...[
                      AppSpacing.widthSM,
                      widget.secondary!,
                    ],
                  ],
                ),
              ),
            ),
            if (_errorText != null && _errorText!.isNotEmpty)
              Padding(
                padding: AppSpacing.only(
                  top: AppSpacing.xxs,
                  left: AppSpacing.lg + AppSpacing.sm,
                ),
                child: Text(
                  _errorText!,
                  style: AppTextStyles.bodySmall.copyWith(
                    color: AppColors.error,
                  ),
                ),
              ),
          ],
        );
      },
    );
  }
}

/// A group of checkboxes for multiple selection
/// 
/// Example usage:
/// ```dart
/// CustomCheckboxGroup<String>(
///   label: 'Select your interests',
///   items: ['Sports', 'Music', 'Reading', 'Travel'],
///   values: selectedInterests,
///   onChanged: (values) => setState(() => selectedInterests = values),
///   itemBuilder: (item) => item,
/// )
/// ```
class CustomCheckboxGroup<T> extends StatefulWidget {
  final String? label;
  final String? helperText;
  final String? errorText;
  final List<T> items;
  final List<T> values;
  final ValueChanged<List<T>>? onChanged;
  final String Function(T) itemBuilder;
  final bool enabled;
  final Axis direction;
  final WrapAlignment wrapAlignment;
  final double spacing;
  final double runSpacing;
  final FormFieldValidator<List<T>>? validator;
  final AutovalidateMode? autovalidateMode;
  final EdgeInsetsGeometry? contentPadding;
  final bool dense;
  
  const CustomCheckboxGroup({
    Key? key,
    this.label,
    this.helperText,
    this.errorText,
    required this.items,
    required this.values,
    this.onChanged,
    required this.itemBuilder,
    this.enabled = true,
    this.direction = Axis.vertical,
    this.wrapAlignment = WrapAlignment.start,
    this.spacing = 0,
    this.runSpacing = 0,
    this.validator,
    this.autovalidateMode,
    this.contentPadding,
    this.dense = false,
  }) : super(key: key);

  @override
  State<CustomCheckboxGroup<T>> createState() => _CustomCheckboxGroupState<T>();
}

class _CustomCheckboxGroupState<T> extends State<CustomCheckboxGroup<T>> {
  String? _errorText;
  
  @override
  void initState() {
    super.initState();
    _errorText = widget.errorText;
  }
  
  @override
  void didUpdateWidget(CustomCheckboxGroup<T> oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.errorText != oldWidget.errorText) {
      setState(() {
        _errorText = widget.errorText;
      });
    }
  }
  
  void _handleChanged(T item, bool? checked) {
    final newValues = List<T>.from(widget.values);
    if (checked == true && !newValues.contains(item)) {
      newValues.add(item);
    } else if (checked == false) {
      newValues.remove(item);
    }
    
    widget.onChanged?.call(newValues);
    
    // Validate after change
    if (widget.validator != null) {
      final error = widget.validator!(newValues);
      setState(() {
        _errorText = error;
      });
    }
  }
  
  @override
  Widget build(BuildContext context) {
    final hasError = _errorText != null && _errorText!.isNotEmpty;
    
    return FormField<List<T>>(
      initialValue: widget.values,
      validator: widget.validator,
      autovalidateMode: widget.autovalidateMode,
      builder: (field) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (widget.label != null)
              Padding(
                padding: AppSpacing.only(bottom: AppSpacing.sm),
                child: Text(
                  widget.label!,
                  style: AppTextStyles.titleSmall.copyWith(
                    color: hasError ? AppColors.error : AppColors.textPrimary,
                  ),
                ),
              ),
            if (widget.helperText != null)
              Padding(
                padding: AppSpacing.only(bottom: AppSpacing.sm),
                child: Text(
                  widget.helperText!,
                  style: AppTextStyles.caption.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
              ),
            widget.direction == Axis.horizontal
                ? Wrap(
                    alignment: widget.wrapAlignment,
                    spacing: widget.spacing,
                    runSpacing: widget.runSpacing,
                    children: widget.items.map((item) {
                      return CustomCheckbox(
                        value: widget.values.contains(item),
                        label: widget.itemBuilder(item),
                        onChanged: (value) => _handleChanged(item, value),
                        enabled: widget.enabled,
                        dense: widget.dense,
                        contentPadding: widget.contentPadding,
                      );
                    }).toList(),
                  )
                : Column(
                    children: widget.items.map((item) {
                      return Padding(
                        padding: AppSpacing.only(bottom: AppSpacing.xs),
                        child: CustomCheckbox(
                          value: widget.values.contains(item),
                          label: widget.itemBuilder(item),
                          onChanged: (value) => _handleChanged(item, value),
                          enabled: widget.enabled,
                          dense: widget.dense,
                          contentPadding: widget.contentPadding,
                        ),
                      );
                    }).toList(),
                  ),
            if (_errorText != null && _errorText!.isNotEmpty)
              Padding(
                padding: AppSpacing.only(top: AppSpacing.xs),
                child: Text(
                  _errorText!,
                  style: AppTextStyles.bodySmall.copyWith(
                    color: AppColors.error,
                  ),
                ),
              ),
          ],
        );
      },
    );
  }
}