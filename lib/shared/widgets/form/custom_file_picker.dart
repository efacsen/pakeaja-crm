import 'dart:io';
import 'package:flutter/material.dart';
import '../../../core/theme/theme.dart';
import '../../../core/constants/constants.dart';

/// File information model
class FileInfo {
  final String name;
  final String path;
  final int size;
  final String extension;
  
  FileInfo({
    required this.name,
    required this.path,
    required this.size,
    required this.extension,
  });
  
  String get sizeString {
    if (size < 1024) return '$size B';
    if (size < 1024 * 1024) return '${(size / 1024).toStringAsFixed(1)} KB';
    return '${(size / (1024 * 1024)).toStringAsFixed(1)} MB';
  }
}

/// A customizable file picker for images and documents
/// 
/// Example usage:
/// ```dart
/// CustomFilePicker(
///   label: 'Upload Document',
///   accept: FileType.document,
///   maxSize: 5 * 1024 * 1024, // 5MB
///   onChanged: (files) {
///     print('Selected files: ${files.length}');
///   },
/// )
/// ```
class CustomFilePicker extends StatefulWidget {
  final String? label;
  final String? hintText;
  final String? helperText;
  final String? errorText;
  final List<FileInfo> value;
  final ValueChanged<List<FileInfo>>? onChanged;
  final FileType accept;
  final int? maxSize;
  final int maxFiles;
  final bool enabled;
  final bool showPreview;
  final FormFieldValidator<List<FileInfo>>? validator;
  final AutovalidateMode? autovalidateMode;
  final EdgeInsetsGeometry? contentPadding;
  final InputBorder? border;
  final Color? fillColor;
  final bool isDense;
  
  const CustomFilePicker({
    Key? key,
    this.label,
    this.hintText,
    this.helperText,
    this.errorText,
    this.value = const [],
    this.onChanged,
    this.accept = FileType.any,
    this.maxSize,
    this.maxFiles = 1,
    this.enabled = true,
    this.showPreview = true,
    this.validator,
    this.autovalidateMode,
    this.contentPadding,
    this.border,
    this.fillColor,
    this.isDense = false,
  }) : super(key: key);

  @override
  State<CustomFilePicker> createState() => _CustomFilePickerState();
}

class _CustomFilePickerState extends State<CustomFilePicker> {
  final FocusNode _focusNode = FocusNode();
  String? _errorText;
  
  @override
  void initState() {
    super.initState();
    _errorText = widget.errorText;
    _focusNode.addListener(() {
      setState(() {});
    });
  }
  
  @override
  void dispose() {
    _focusNode.dispose();
    super.dispose();
  }
  
  @override
  void didUpdateWidget(CustomFilePicker oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.errorText != oldWidget.errorText) {
      setState(() {
        _errorText = widget.errorText;
      });
    }
  }
  
  Future<void> _pickFiles() async {
    if (!widget.enabled) return;
    
    // This is a placeholder for file picking functionality
    // In a real implementation, you would use file_picker or image_picker package
    // For now, we'll just show the UI structure
    
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(AppSpacing.radiusLG),
        ),
      ),
      builder: (context) => _buildPickerOptions(),
    );
  }
  
  Widget _buildPickerOptions() {
    return Container(
      padding: AppSpacing.allMD,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 40,
            height: 4,
            margin: AppSpacing.only(bottom: AppSpacing.lg),
            decoration: BoxDecoration(
              color: AppColors.neutral300,
              borderRadius: AppSpacing.borderRadiusFull,
            ),
          ),
          Text(
            widget.accept == FileType.image
                ? AppStrings.selectImage
                : AppStrings.selectFile,
            style: AppTextStyles.titleMedium,
          ),
          AppSpacing.heightMD,
          if (widget.accept == FileType.image) ...[
            ListTile(
              leading: const Icon(Icons.camera_alt),
              title: Text(AppStrings.takePhoto),
              onTap: () {
                Navigator.pop(context);
                // Implement camera capture
              },
            ),
            ListTile(
              leading: const Icon(Icons.photo_library),
              title: Text(AppStrings.chooseFromGallery),
              onTap: () {
                Navigator.pop(context);
                // Implement gallery selection
              },
            ),
          ] else ...[
            ListTile(
              leading: const Icon(Icons.folder_open),
              title: const Text('Browse Files'),
              onTap: () {
                Navigator.pop(context);
                // Implement file browser
              },
            ),
          ],
          AppSpacing.heightMD,
        ],
      ),
    );
  }
  
  void _removeFile(int index) {
    final newFiles = List<FileInfo>.from(widget.value)..removeAt(index);
    widget.onChanged?.call(newFiles);
    
    // Validate after removal
    if (widget.validator != null) {
      final error = widget.validator!(newFiles);
      setState(() {
        _errorText = error;
      });
    }
  }
  
  Widget _buildFilePreview(FileInfo file, int index) {
    final isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp']
        .contains(file.extension.toLowerCase());
    
    return Container(
      margin: AppSpacing.only(bottom: AppSpacing.xs),
      padding: AppSpacing.allSM,
      decoration: BoxDecoration(
        color: AppColors.neutral50,
        borderRadius: AppSpacing.borderRadiusSM,
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppColors.neutral100,
              borderRadius: AppSpacing.borderRadiusXS,
            ),
            child: Icon(
              isImage ? Icons.image : Icons.insert_drive_file,
              color: AppColors.primary,
            ),
          ),
          AppSpacing.widthSM,
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  file.name,
                  style: AppTextStyles.bodySmall,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                Text(
                  file.sizeString,
                  style: AppTextStyles.caption.copyWith(
                    color: AppColors.textTertiary,
                  ),
                ),
              ],
            ),
          ),
          if (widget.enabled)
            IconButton(
              icon: const Icon(Icons.close),
              iconSize: UIConstants.iconSizeXS,
              color: AppColors.textTertiary,
              onPressed: () => _removeFile(index),
            ),
        ],
      ),
    );
  }
  
  @override
  Widget build(BuildContext context) {
    final hasError = _errorText != null && _errorText!.isNotEmpty;
    final canAddMore = widget.value.length < widget.maxFiles;
    
    return FormField<List<FileInfo>>(
      initialValue: widget.value,
      validator: widget.validator,
      autovalidateMode: widget.autovalidateMode,
      builder: (field) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (widget.label != null)
              Padding(
                padding: AppSpacing.only(bottom: AppSpacing.xs),
                child: Text(
                  widget.label!,
                  style: AppTextStyles.bodyMedium.copyWith(
                    color: hasError ? AppColors.error : AppColors.textPrimary,
                  ),
                ),
              ),
            InkWell(
              onTap: canAddMore ? _pickFiles : null,
              borderRadius: AppSpacing.borderRadiusSM,
              child: Container(
                padding: widget.contentPadding ??
                    AppSpacing.symmetric(
                      horizontal: AppSpacing.md,
                      vertical: AppSpacing.sm,
                    ),
                decoration: BoxDecoration(
                  color: widget.fillColor ??
                      (widget.enabled
                          ? (_focusNode.hasFocus
                              ? AppColors.primary.withOpacity(0.05)
                              : Theme.of(context).inputDecorationTheme.fillColor)
                          : AppColors.neutral100),
                  borderRadius: AppSpacing.borderRadiusSM,
                  border: Border.all(
                    color: hasError
                        ? AppColors.error
                        : (_focusNode.hasFocus
                            ? AppColors.primary
                            : AppColors.border),
                    width: _focusNode.hasFocus ? 2 : 1,
                  ),
                ),
                child: Column(
                  children: [
                    if (widget.value.isEmpty) ...[
                      Icon(
                        widget.accept == FileType.image
                            ? Icons.add_photo_alternate
                            : Icons.upload_file,
                        size: UIConstants.iconSizeLG,
                        color: widget.enabled
                            ? AppColors.primary
                            : AppColors.textDisabled,
                      ),
                      AppSpacing.heightXS,
                      Text(
                        widget.hintText ??
                            (widget.accept == FileType.image
                                ? AppStrings.selectImage
                                : AppStrings.selectFile),
                        style: AppTextStyles.bodyMedium.copyWith(
                          color: widget.enabled
                              ? AppColors.textSecondary
                              : AppColors.textDisabled,
                        ),
                      ),
                      if (widget.helperText != null) ...[
                        AppSpacing.heightXS,
                        Text(
                          widget.helperText!,
                          style: AppTextStyles.caption.copyWith(
                            color: AppColors.textTertiary,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ] else ...[
                      if (widget.showPreview)
                        ...widget.value.asMap().entries.map(
                              (entry) => _buildFilePreview(entry.value, entry.key),
                            ),
                      if (canAddMore && widget.enabled) ...[
                        AppSpacing.heightSM,
                        OutlinedButton.icon(
                          onPressed: _pickFiles,
                          icon: const Icon(Icons.add, size: UIConstants.iconSizeXS),
                          label: const Text('Add More'),
                          style: OutlinedButton.styleFrom(
                            minimumSize: Size.zero,
                            padding: AppSpacing.symmetric(
                              horizontal: AppSpacing.sm,
                              vertical: AppSpacing.xxs,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ],
                ),
              ),
            ),
            if (_errorText != null && _errorText!.isNotEmpty)
              Padding(
                padding: AppSpacing.only(top: AppSpacing.xs, left: AppSpacing.sm),
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

/// File type enum
enum FileType {
  any,
  image,
  document,
}