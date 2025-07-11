import 'package:flutter/material.dart';
import '../../../core/theme/theme.dart';
import '../../../core/constants/constants.dart';

/// A wrapper widget that provides consistent styling and layout for form fields
/// 
/// Example usage:
/// ```dart
/// FormFieldWrapper(
///   label: 'Email Address',
///   required: true,
///   helperText: 'We\'ll never share your email',
///   child: TextFormField(
///     // ... field configuration
///   ),
/// )
/// ```
class FormFieldWrapper extends StatelessWidget {
  final String? label;
  final String? helperText;
  final String? errorText;
  final bool required;
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final CrossAxisAlignment crossAxisAlignment;
  final double spacing;
  final Widget? suffix;
  final bool showRequiredIndicator;
  
  const FormFieldWrapper({
    Key? key,
    this.label,
    this.helperText,
    this.errorText,
    this.required = false,
    required this.child,
    this.padding,
    this.crossAxisAlignment = CrossAxisAlignment.start,
    this.spacing = 8.0,
    this.suffix,
    this.showRequiredIndicator = true,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    final hasError = errorText != null && errorText!.isNotEmpty;
    
    return Padding(
      padding: padding ?? EdgeInsets.zero,
      child: Column(
        crossAxisAlignment: crossAxisAlignment,
        children: [
          if (label != null)
            Padding(
              padding: EdgeInsets.only(bottom: spacing),
              child: Row(
                children: [
                  Expanded(
                    child: RichText(
                      text: TextSpan(
                        style: AppTextStyles.labelLarge.copyWith(
                          color: hasError
                              ? AppColors.error
                              : AppColors.textPrimary,
                          fontWeight: FontWeight.w500,
                        ),
                        children: [
                          TextSpan(text: label),
                          if (required && showRequiredIndicator)
                            TextSpan(
                              text: ' *',
                              style: TextStyle(
                                color: AppColors.error,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),
                  if (suffix != null) ...[
                    AppSpacing.widthXS,
                    suffix!,
                  ],
                ],
              ),
            ),
          child,
          if (helperText != null && (errorText == null || errorText!.isEmpty))
            Padding(
              padding: EdgeInsets.only(top: spacing / 2),
              child: Text(
                helperText!,
                style: AppTextStyles.caption.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
            ),
          if (errorText != null && errorText!.isNotEmpty)
            Padding(
              padding: EdgeInsets.only(top: spacing / 2),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(
                    Icons.error_outline,
                    size: UIConstants.iconSizeXS,
                    color: AppColors.error,
                  ),
                  AppSpacing.widthXXS,
                  Expanded(
                    child: Text(
                      errorText!,
                      style: AppTextStyles.caption.copyWith(
                        color: AppColors.error,
                      ),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

/// A section divider for forms with optional title
/// 
/// Example usage:
/// ```dart
/// FormSection(
///   title: 'Personal Information',
///   children: [
///     CustomTextField(...),
///     CustomTextField(...),
///   ],
/// )
/// ```
class FormSection extends StatelessWidget {
  final String? title;
  final String? subtitle;
  final List<Widget> children;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double spacing;
  final Color? backgroundColor;
  final BorderRadius? borderRadius;
  final bool showDivider;
  
  const FormSection({
    Key? key,
    this.title,
    this.subtitle,
    required this.children,
    this.padding,
    this.margin,
    this.spacing = 16.0,
    this.backgroundColor,
    this.borderRadius,
    this.showDivider = false,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    Widget content = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (title != null) ...[
          Text(
            title!,
            style: AppTextStyles.titleMedium.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          if (subtitle != null) ...[
            AppSpacing.heightXXS,
            Text(
              subtitle!,
              style: AppTextStyles.bodySmall.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
          ],
          SizedBox(height: spacing),
        ],
        ...children.map((child) => Padding(
              padding: EdgeInsets.only(bottom: spacing),
              child: child,
            )),
      ],
    );
    
    if (backgroundColor != null) {
      content = Container(
        padding: padding ?? AppSpacing.allMD,
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: borderRadius ?? AppSpacing.borderRadiusMD,
        ),
        child: content,
      );
    } else if (padding != null) {
      content = Padding(
        padding: padding!,
        child: content,
      );
    }
    
    return Container(
      margin: margin,
      child: Column(
        children: [
          content,
          if (showDivider)
            const Divider(
              height: 1,
              thickness: 1,
            ),
        ],
      ),
    );
  }
}

/// A row layout for form fields
/// 
/// Example usage:
/// ```dart
/// FormFieldRow(
///   children: [
///     Expanded(
///       child: CustomTextField(label: 'First Name'),
///     ),
///     Expanded(
///       child: CustomTextField(label: 'Last Name'),
///     ),
///   ],
/// )
/// ```
class FormFieldRow extends StatelessWidget {
  final List<Widget> children;
  final double spacing;
  final CrossAxisAlignment crossAxisAlignment;
  final MainAxisAlignment mainAxisAlignment;
  
  const FormFieldRow({
    Key? key,
    required this.children,
    this.spacing = 16.0,
    this.crossAxisAlignment = CrossAxisAlignment.start,
    this.mainAxisAlignment = MainAxisAlignment.start,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: crossAxisAlignment,
      mainAxisAlignment: mainAxisAlignment,
      children: children.map((child) {
        final isLast = children.last == child;
        return isLast
            ? child
            : Padding(
                padding: EdgeInsets.only(right: spacing),
                child: child,
              );
      }).toList(),
    );
  }
}