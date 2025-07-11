import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/theme/theme.dart';
import '../../../core/constants/constants.dart';

/// A customizable text field with validation states and enhanced features
/// 
/// Example usage:
/// ```dart
/// CustomTextField(
///   label: 'Email',
///   hintText: 'Enter your email',
///   prefixIcon: Icons.email,
///   keyboardType: TextInputType.emailAddress,
///   validator: (value) => ValidationRules.isValidEmail(value ?? '') 
///       ? null 
///       : 'Invalid email',
///   onChanged: (value) => print(value),
/// )
/// ```
class CustomTextField extends StatefulWidget {
  final String? label;
  final String? hintText;
  final String? helperText;
  final String? errorText;
  final String? initialValue;
  final TextEditingController? controller;
  final FocusNode? focusNode;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final TextCapitalization textCapitalization;
  final bool obscureText;
  final bool enabled;
  final bool readOnly;
  final bool autofocus;
  final int? maxLines;
  final int? minLines;
  final int? maxLength;
  final MaxLengthEnforcement? maxLengthEnforcement;
  final List<TextInputFormatter>? inputFormatters;
  final ValueChanged<String>? onChanged;
  final VoidCallback? onTap;
  final VoidCallback? onEditingComplete;
  final ValueChanged<String>? onFieldSubmitted;
  final FormFieldValidator<String>? validator;
  final AutovalidateMode? autovalidateMode;
  final IconData? prefixIcon;
  final Widget? prefix;
  final IconData? suffixIcon;
  final Widget? suffix;
  final VoidCallback? onSuffixTap;
  final bool showCounter;
  final bool isDense;
  final EdgeInsetsGeometry? contentPadding;
  final InputBorder? border;
  final Color? fillColor;
  final TextStyle? style;
  final TextStyle? labelStyle;
  final TextStyle? hintStyle;
  final TextAlign textAlign;
  final bool expands;
  
  const CustomTextField({
    Key? key,
    this.label,
    this.hintText,
    this.helperText,
    this.errorText,
    this.initialValue,
    this.controller,
    this.focusNode,
    this.keyboardType,
    this.textInputAction,
    this.textCapitalization = TextCapitalization.none,
    this.obscureText = false,
    this.enabled = true,
    this.readOnly = false,
    this.autofocus = false,
    this.maxLines = 1,
    this.minLines,
    this.maxLength,
    this.maxLengthEnforcement,
    this.inputFormatters,
    this.onChanged,
    this.onTap,
    this.onEditingComplete,
    this.onFieldSubmitted,
    this.validator,
    this.autovalidateMode,
    this.prefixIcon,
    this.prefix,
    this.suffixIcon,
    this.suffix,
    this.onSuffixTap,
    this.showCounter = true,
    this.isDense = false,
    this.contentPadding,
    this.border,
    this.fillColor,
    this.style,
    this.labelStyle,
    this.hintStyle,
    this.textAlign = TextAlign.start,
    this.expands = false,
  }) : super(key: key);

  @override
  State<CustomTextField> createState() => _CustomTextFieldState();
}

class _CustomTextFieldState extends State<CustomTextField> {
  late FocusNode _focusNode;
  bool _obscureText = false;
  String? _errorText;
  
  @override
  void initState() {
    super.initState();
    _focusNode = widget.focusNode ?? FocusNode();
    _obscureText = widget.obscureText;
    _errorText = widget.errorText;
    
    _focusNode.addListener(() {
      setState(() {});
    });
  }
  
  @override
  void dispose() {
    if (widget.focusNode == null) {
      _focusNode.dispose();
    }
    super.dispose();
  }
  
  @override
  void didUpdateWidget(CustomTextField oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.errorText != oldWidget.errorText) {
      setState(() {
        _errorText = widget.errorText;
      });
    }
  }
  
  void _toggleObscureText() {
    setState(() {
      _obscureText = !_obscureText;
    });
  }
  
  Widget? _buildPrefix() {
    if (widget.prefix != null) {
      return widget.prefix;
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
    
    return null;
  }
  
  Widget? _buildSuffix() {
    if (widget.suffix != null) {
      return widget.suffix;
    }
    
    if (widget.obscureText) {
      return IconButton(
        icon: Icon(
          _obscureText ? Icons.visibility_off : Icons.visibility,
          size: UIConstants.iconSizeSM,
        ),
        onPressed: _toggleObscureText,
        color: AppColors.textTertiary,
      );
    }
    
    if (widget.suffixIcon != null) {
      if (widget.onSuffixTap != null) {
        return IconButton(
          icon: Icon(
            widget.suffixIcon,
            size: UIConstants.iconSizeSM,
          ),
          onPressed: widget.onSuffixTap,
          color: _focusNode.hasFocus
              ? Theme.of(context).colorScheme.primary
              : AppColors.textTertiary,
        );
      } else {
        return Icon(
          widget.suffixIcon,
          size: UIConstants.iconSizeSM,
          color: _focusNode.hasFocus
              ? Theme.of(context).colorScheme.primary
              : AppColors.textTertiary,
        );
      }
    }
    
    return null;
  }
  
  InputDecoration _buildDecoration() {
    final hasError = _errorText != null && _errorText!.isNotEmpty;
    
    return InputDecoration(
      labelText: widget.label,
      hintText: widget.hintText,
      helperText: widget.helperText,
      helperMaxLines: 2,
      errorText: _errorText,
      errorMaxLines: 2,
      counter: widget.showCounter ? null : const SizedBox.shrink(),
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
      labelStyle: widget.labelStyle,
      hintStyle: widget.hintStyle,
    );
  }
  
  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: widget.controller,
      focusNode: _focusNode,
      initialValue: widget.initialValue,
      keyboardType: widget.keyboardType,
      textInputAction: widget.textInputAction,
      textCapitalization: widget.textCapitalization,
      obscureText: _obscureText,
      enabled: widget.enabled,
      readOnly: widget.readOnly,
      autofocus: widget.autofocus,
      maxLines: widget.obscureText ? 1 : widget.maxLines,
      minLines: widget.minLines,
      expands: widget.expands,
      maxLength: widget.maxLength,
      maxLengthEnforcement: widget.maxLengthEnforcement,
      inputFormatters: widget.inputFormatters,
      onChanged: widget.onChanged,
      onTap: widget.onTap,
      onEditingComplete: widget.onEditingComplete,
      onFieldSubmitted: widget.onFieldSubmitted,
      validator: (value) {
        final error = widget.validator?.call(value);
        // Update error state for visual feedback
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (mounted && _errorText != error) {
            setState(() {
              _errorText = error;
            });
          }
        });
        return error;
      },
      autovalidateMode: widget.autovalidateMode,
      style: widget.style ?? AppTextStyles.bodyMedium,
      textAlign: widget.textAlign,
      decoration: _buildDecoration(),
    );
  }
}