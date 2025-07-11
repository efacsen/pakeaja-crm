import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/theme.dart';
import '../../../core/constants/constants.dart';

/// A customizable date picker with range selection capability
/// 
/// Example usage:
/// ```dart
/// CustomDatePicker(
///   label: 'Select Date',
///   value: selectedDate,
///   onChanged: (date) => setState(() => selectedDate = date),
///   firstDate: DateTime(2020),
///   lastDate: DateTime(2030),
/// )
/// 
/// // Date range example:
/// CustomDatePicker.range(
///   label: 'Select Date Range',
///   startDate: startDate,
///   endDate: endDate,
///   onRangeChanged: (start, end) {
///     setState(() {
///       startDate = start;
///       endDate = end;
///     });
///   },
/// )
/// ```
class CustomDatePicker extends StatefulWidget {
  final String? label;
  final String? hintText;
  final String? helperText;
  final String? errorText;
  final DateTime? value;
  final DateTime? startDate;
  final DateTime? endDate;
  final ValueChanged<DateTime?>? onChanged;
  final ValueChanged<DateTimeRange?>? onRangeChanged;
  final DateTime? firstDate;
  final DateTime? lastDate;
  final DateTime? currentDate;
  final DatePickerMode initialDatePickerMode;
  final SelectableDayPredicate? selectableDayPredicate;
  final bool enabled;
  final bool isRangePicker;
  final IconData? prefixIcon;
  final DateFormat? dateFormat;
  final FormFieldValidator<DateTime>? validator;
  final AutovalidateMode? autovalidateMode;
  final EdgeInsetsGeometry? contentPadding;
  final InputBorder? border;
  final Color? fillColor;
  final bool isDense;
  final bool showClearButton;
  
  const CustomDatePicker({
    Key? key,
    this.label,
    this.hintText,
    this.helperText,
    this.errorText,
    this.value,
    this.onChanged,
    this.firstDate,
    this.lastDate,
    this.currentDate,
    this.initialDatePickerMode = DatePickerMode.day,
    this.selectableDayPredicate,
    this.enabled = true,
    this.prefixIcon,
    this.dateFormat,
    this.validator,
    this.autovalidateMode,
    this.contentPadding,
    this.border,
    this.fillColor,
    this.isDense = false,
    this.showClearButton = true,
  })  : isRangePicker = false,
        startDate = null,
        endDate = null,
        onRangeChanged = null,
        super(key: key);
  
  const CustomDatePicker.range({
    Key? key,
    this.label,
    this.hintText,
    this.helperText,
    this.errorText,
    this.startDate,
    this.endDate,
    this.onRangeChanged,
    this.firstDate,
    this.lastDate,
    this.currentDate,
    this.enabled = true,
    this.prefixIcon,
    this.dateFormat,
    this.autovalidateMode,
    this.contentPadding,
    this.border,
    this.fillColor,
    this.isDense = false,
    this.showClearButton = true,
  })  : isRangePicker = true,
        value = null,
        onChanged = null,
        validator = null,
        initialDatePickerMode = DatePickerMode.day,
        selectableDayPredicate = null,
        super(key: key);

  @override
  State<CustomDatePicker> createState() => _CustomDatePickerState();
}

class _CustomDatePickerState extends State<CustomDatePicker> {
  final FocusNode _focusNode = FocusNode();
  final TextEditingController _controller = TextEditingController();
  late DateFormat _dateFormat;
  String? _errorText;
  
  @override
  void initState() {
    super.initState();
    _dateFormat = widget.dateFormat ?? DateFormat('dd/MM/yyyy');
    _errorText = widget.errorText;
    _updateControllerText();
    _focusNode.addListener(() {
      setState(() {});
    });
  }
  
  @override
  void dispose() {
    _focusNode.dispose();
    _controller.dispose();
    super.dispose();
  }
  
  @override
  void didUpdateWidget(CustomDatePicker oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.errorText != oldWidget.errorText) {
      setState(() {
        _errorText = widget.errorText;
      });
    }
    if (widget.value != oldWidget.value ||
        widget.startDate != oldWidget.startDate ||
        widget.endDate != oldWidget.endDate) {
      _updateControllerText();
    }
  }
  
  void _updateControllerText() {
    if (widget.isRangePicker) {
      if (widget.startDate != null && widget.endDate != null) {
        _controller.text =
            '${_dateFormat.format(widget.startDate!)} - ${_dateFormat.format(widget.endDate!)}';
      } else if (widget.startDate != null) {
        _controller.text = '${_dateFormat.format(widget.startDate!)} - ';
      } else {
        _controller.text = '';
      }
    } else {
      _controller.text = widget.value != null ? _dateFormat.format(widget.value!) : '';
    }
  }
  
  Future<void> _selectDate() async {
    if (!widget.enabled) return;
    
    if (widget.isRangePicker) {
      await _selectDateRange();
    } else {
      await _selectSingleDate();
    }
  }
  
  Future<void> _selectSingleDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: widget.value ?? widget.currentDate ?? DateTime.now(),
      firstDate: widget.firstDate ?? DateTime(1900),
      lastDate: widget.lastDate ?? DateTime(2100),
      currentDate: widget.currentDate,
      initialDatePickerMode: widget.initialDatePickerMode,
      selectableDayPredicate: widget.selectableDayPredicate,
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: Theme.of(context).colorScheme.copyWith(
              primary: AppColors.primary,
              onPrimary: AppColors.textOnPrimary,
              surface: Theme.of(context).cardColor,
              onSurface: AppColors.textPrimary,
            ),
          ),
          child: child!,
        );
      },
    );
    
    if (picked != null) {
      widget.onChanged?.call(picked);
      
      // Validate after selection
      if (widget.validator != null) {
        final error = widget.validator!(picked);
        setState(() {
          _errorText = error;
        });
      }
    }
  }
  
  Future<void> _selectDateRange() async {
    final DateTimeRange? picked = await showDateRangePicker(
      context: context,
      firstDate: widget.firstDate ?? DateTime(1900),
      lastDate: widget.lastDate ?? DateTime(2100),
      currentDate: widget.currentDate,
      initialDateRange: widget.startDate != null && widget.endDate != null
          ? DateTimeRange(start: widget.startDate!, end: widget.endDate!)
          : null,
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: Theme.of(context).colorScheme.copyWith(
              primary: AppColors.primary,
              onPrimary: AppColors.textOnPrimary,
              surface: Theme.of(context).cardColor,
              onSurface: AppColors.textPrimary,
            ),
          ),
          child: child!,
        );
      },
    );
    
    if (picked != null) {
      widget.onRangeChanged?.call(picked);
    }
  }
  
  void _clearDate() {
    if (widget.isRangePicker) {
      widget.onRangeChanged?.call(null);
    } else {
      widget.onChanged?.call(null);
    }
    
    setState(() {
      _errorText = null;
    });
  }
  
  Widget _buildPrefix() {
    return Icon(
      widget.prefixIcon ?? Icons.calendar_today,
      size: UIConstants.iconSizeSM,
      color: _focusNode.hasFocus
          ? Theme.of(context).colorScheme.primary
          : AppColors.textTertiary,
    );
  }
  
  Widget _buildSuffix() {
    final hasValue = widget.isRangePicker
        ? (widget.startDate != null || widget.endDate != null)
        : widget.value != null;
    
    if (widget.showClearButton && hasValue && widget.enabled) {
      return IconButton(
        icon: const Icon(Icons.clear),
        iconSize: UIConstants.iconSizeSM,
        color: AppColors.textTertiary,
        onPressed: _clearDate,
      );
    }
    
    return const SizedBox.shrink();
  }
  
  @override
  Widget build(BuildContext context) {
    final hasError = _errorText != null && _errorText!.isNotEmpty;
    
    return TextFormField(
      controller: _controller,
      focusNode: _focusNode,
      readOnly: true,
      enabled: widget.enabled,
      onTap: _selectDate,
      validator: widget.isRangePicker
          ? null
          : (value) {
              if (widget.validator != null) {
                return widget.validator!(widget.value);
              }
              return null;
            },
      autovalidateMode: widget.autovalidateMode,
      decoration: InputDecoration(
        labelText: widget.label,
        hintText: widget.hintText ?? (widget.isRangePicker
            ? AppStrings.selectDateRange
            : AppStrings.selectDate),
        helperText: widget.helperText,
        helperMaxLines: 2,
        errorText: _errorText,
        errorMaxLines: 2,
        filled: true,
        fillColor: widget.fillColor ??
            (widget.enabled
                ? (_focusNode.hasFocus
                    ? AppColors.primary.withOpacity(0.05)
                    : Theme.of(context).inputDecorationTheme.fillColor)
                : AppColors.neutral100),
        isDense: widget.isDense,
        contentPadding: widget.contentPadding,
        prefixIcon: _buildPrefix(),
        suffixIcon: _buildSuffix(),
        border: widget.border,
        enabledBorder: widget.border ??
            (hasError
                ? Theme.of(context).inputDecorationTheme.errorBorder
                : null),
        focusedBorder: widget.border ??
            (hasError
                ? Theme.of(context).inputDecorationTheme.focusedErrorBorder
                : null),
      ),
      style: AppTextStyles.bodyMedium,
    );
  }
}