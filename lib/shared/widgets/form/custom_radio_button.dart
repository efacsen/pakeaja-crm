import 'package:flutter/material.dart';
import '../../../core/theme/theme.dart';
import '../../../core/constants/constants.dart';

/// A customizable radio button with label
/// 
/// Example usage:
/// ```dart
/// CustomRadioButton<String>(
///   value: 'option1',
///   groupValue: selectedOption,
///   label: 'Option 1',
///   onChanged: (value) => setState(() => selectedOption = value),
/// )
/// ```
class CustomRadioButton<T> extends StatelessWidget {
  final T value;
  final T? groupValue;
  final ValueChanged<T?>? onChanged;
  final String? label;
  final bool enabled;
  final Color? activeColor;
  final Widget? secondary;
  final EdgeInsetsGeometry? contentPadding;
  final MainAxisAlignment mainAxisAlignment;
  final CrossAxisAlignment crossAxisAlignment;
  final bool dense;
  
  const CustomRadioButton({
    Key? key,
    required this.value,
    required this.groupValue,
    this.onChanged,
    this.label,
    this.enabled = true,
    this.activeColor,
    this.secondary,
    this.contentPadding,
    this.mainAxisAlignment = MainAxisAlignment.start,
    this.crossAxisAlignment = CrossAxisAlignment.center,
    this.dense = false,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: enabled && groupValue != value
          ? () => onChanged?.call(value)
          : null,
      borderRadius: AppSpacing.borderRadiusSM,
      child: Padding(
        padding: contentPadding ?? EdgeInsets.zero,
        child: Row(
          mainAxisAlignment: mainAxisAlignment,
          crossAxisAlignment: crossAxisAlignment,
          children: [
            SizedBox(
              width: 24,
              height: 24,
              child: Radio<T>(
                value: value,
                groupValue: groupValue,
                onChanged: enabled ? onChanged : null,
                activeColor: activeColor ?? AppColors.primary,
                materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                visualDensity: dense
                    ? VisualDensity.compact
                    : VisualDensity.standard,
              ),
            ),
            if (label != null) ...[
              AppSpacing.widthSM,
              Expanded(
                child: Text(
                  label!,
                  style: AppTextStyles.bodyMedium.copyWith(
                    color: enabled
                        ? AppColors.textPrimary
                        : AppColors.textDisabled,
                  ),
                ),
              ),
            ],
            if (secondary != null) ...[
              AppSpacing.widthSM,
              secondary!,
            ],
          ],
        ),
      ),
    );
  }
}

/// A group of radio buttons for single selection
/// 
/// Example usage:
/// ```dart
/// CustomRadioGroup<String>(
///   label: 'Select your preference',
///   items: ['Option 1', 'Option 2', 'Option 3'],
///   value: selectedOption,
///   onChanged: (value) => setState(() => selectedOption = value),
///   itemBuilder: (item) => item,
/// )
/// ```
class CustomRadioGroup<T> extends StatefulWidget {
  final String? label;
  final String? helperText;
  final String? errorText;
  final List<T> items;
  final T? value;
  final ValueChanged<T?>? onChanged;
  final String Function(T) itemBuilder;
  final Widget? Function(T)? secondaryBuilder;
  final bool enabled;
  final Axis direction;
  final WrapAlignment wrapAlignment;
  final double spacing;
  final double runSpacing;
  final FormFieldValidator<T>? validator;
  final AutovalidateMode? autovalidateMode;
  final EdgeInsetsGeometry? contentPadding;
  final EdgeInsetsGeometry? itemPadding;
  final bool dense;
  final Color? activeColor;
  
  const CustomRadioGroup({
    Key? key,
    this.label,
    this.helperText,
    this.errorText,
    required this.items,
    this.value,
    this.onChanged,
    required this.itemBuilder,
    this.secondaryBuilder,
    this.enabled = true,
    this.direction = Axis.vertical,
    this.wrapAlignment = WrapAlignment.start,
    this.spacing = 0,
    this.runSpacing = 0,
    this.validator,
    this.autovalidateMode,
    this.contentPadding,
    this.itemPadding,
    this.dense = false,
    this.activeColor,
  }) : super(key: key);

  @override
  State<CustomRadioGroup<T>> createState() => _CustomRadioGroupState<T>();
}

class _CustomRadioGroupState<T> extends State<CustomRadioGroup<T>> {
  String? _errorText;
  
  @override
  void initState() {
    super.initState();
    _errorText = widget.errorText;
  }
  
  @override
  void didUpdateWidget(CustomRadioGroup<T> oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.errorText != oldWidget.errorText) {
      setState(() {
        _errorText = widget.errorText;
      });
    }
  }
  
  void _handleChanged(T? value) {
    widget.onChanged?.call(value);
    
    // Validate after change
    if (widget.validator != null) {
      final error = widget.validator!(value);
      setState(() {
        _errorText = error;
      });
    }
  }
  
  Widget _buildRadioButton(T item) {
    return CustomRadioButton<T>(
      value: item,
      groupValue: widget.value,
      label: widget.itemBuilder(item),
      onChanged: _handleChanged,
      enabled: widget.enabled,
      dense: widget.dense,
      contentPadding: widget.itemPadding,
      activeColor: widget.activeColor,
      secondary: widget.secondaryBuilder?.call(item),
    );
  }
  
  @override
  Widget build(BuildContext context) {
    final hasError = _errorText != null && _errorText!.isNotEmpty;
    
    return FormField<T>(
      initialValue: widget.value,
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
            if (widget.contentPadding != null)
              Padding(
                padding: widget.contentPadding!,
                child: _buildContent(),
              )
            else
              _buildContent(),
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
  
  Widget _buildContent() {
    if (widget.direction == Axis.horizontal) {
      return Wrap(
        alignment: widget.wrapAlignment,
        spacing: widget.spacing,
        runSpacing: widget.runSpacing,
        children: widget.items.map(_buildRadioButton).toList(),
      );
    } else {
      return Column(
        children: widget.items.map((item) {
          return Padding(
            padding: AppSpacing.only(bottom: AppSpacing.xs),
            child: _buildRadioButton(item),
          );
        }).toList(),
      );
    }
  }
}

/// Radio button with custom tile layout
/// 
/// Example usage:
/// ```dart
/// CustomRadioListTile<PaymentMethod>(
///   value: PaymentMethod.creditCard,
///   groupValue: selectedPaymentMethod,
///   title: 'Credit Card',
///   subtitle: 'Pay with Visa, Mastercard, or Amex',
///   leading: Icon(Icons.credit_card),
///   onChanged: (value) => setState(() => selectedPaymentMethod = value),
/// )
/// ```
class CustomRadioListTile<T> extends StatelessWidget {
  final T value;
  final T? groupValue;
  final ValueChanged<T?>? onChanged;
  final String title;
  final String? subtitle;
  final Widget? leading;
  final Widget? trailing;
  final bool enabled;
  final Color? activeColor;
  final Color? tileColor;
  final Color? selectedTileColor;
  final EdgeInsetsGeometry? contentPadding;
  final ShapeBorder? shape;
  final bool dense;
  final bool selected;
  
  const CustomRadioListTile({
    Key? key,
    required this.value,
    required this.groupValue,
    this.onChanged,
    required this.title,
    this.subtitle,
    this.leading,
    this.trailing,
    this.enabled = true,
    this.activeColor,
    this.tileColor,
    this.selectedTileColor,
    this.contentPadding,
    this.shape,
    this.dense = false,
    this.selected = false,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    final isSelected = value == groupValue;
    
    return Card(
      margin: EdgeInsets.zero,
      color: isSelected
          ? (selectedTileColor ?? AppColors.primary.withOpacity(0.05))
          : tileColor,
      shape: shape ??
          RoundedRectangleBorder(
            borderRadius: AppSpacing.borderRadiusSM,
            side: BorderSide(
              color: isSelected ? AppColors.primary : AppColors.border,
              width: isSelected ? 2 : 1,
            ),
          ),
      child: InkWell(
        onTap: enabled && !isSelected
            ? () => onChanged?.call(value)
            : null,
        borderRadius: AppSpacing.borderRadiusSM,
        child: Padding(
          padding: contentPadding ?? AppSpacing.allMD,
          child: Row(
            children: [
              if (leading != null) ...[
                leading!,
                AppSpacing.widthMD,
              ],
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: AppTextStyles.titleSmall.copyWith(
                        color: enabled
                            ? AppColors.textPrimary
                            : AppColors.textDisabled,
                        fontWeight: isSelected
                            ? FontWeight.w600
                            : FontWeight.w500,
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
              AppSpacing.widthMD,
              Radio<T>(
                value: value,
                groupValue: groupValue,
                onChanged: enabled ? onChanged : null,
                activeColor: activeColor ?? AppColors.primary,
                materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                visualDensity: dense
                    ? VisualDensity.compact
                    : VisualDensity.standard,
              ),
              if (trailing != null) ...[
                AppSpacing.widthSM,
                trailing!,
              ],
            ],
          ),
        ),
      ),
    );
  }
}