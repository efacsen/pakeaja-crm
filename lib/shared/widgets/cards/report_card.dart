import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/theme.dart';
import '../../../core/constants/constants.dart';
import 'base_card.dart';

/// Report card for displaying daily reports
/// 
/// Example usage:
/// ```dart
/// ReportCard(
///   title: 'Daily Sales Report',
///   date: DateTime.now(),
///   status: ReportStatus.synced,
///   metrics: [
///     ReportMetric(label: 'Visits', value: '12'),
///     ReportMetric(label: 'Sales', value: 'Rp 1.2M'),
///   ],
///   onTap: () => viewReport(),
/// )
/// ```
class ReportCard extends StatelessWidget {
  final String title;
  final DateTime date;
  final ReportStatus status;
  final List<ReportMetric>? metrics;
  final String? description;
  final Widget? thumbnail;
  final VoidCallback? onTap;
  final VoidCallback? onEdit;
  final VoidCallback? onDelete;
  final EdgeInsetsGeometry? margin;
  final bool showActions;
  
  const ReportCard({
    Key? key,
    required this.title,
    required this.date,
    required this.status,
    this.metrics,
    this.description,
    this.thumbnail,
    this.onTap,
    this.onEdit,
    this.onDelete,
    this.margin,
    this.showActions = true,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat('dd MMM yyyy, HH:mm');
    
    return BaseCard(
      margin: margin,
      padding: AppSpacing.allMD,
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (thumbnail != null) ...[
                thumbnail!,
                AppSpacing.widthMD,
              ],
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            title,
                            style: AppTextStyles.titleMedium.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        _buildStatusBadge(),
                      ],
                    ),
                    AppSpacing.heightXXS,
                    Row(
                      children: [
                        Icon(
                          Icons.access_time,
                          size: UIConstants.iconSizeXS,
                          color: AppColors.textTertiary,
                        ),
                        AppSpacing.widthXXS,
                        Text(
                          dateFormat.format(date),
                          style: AppTextStyles.caption.copyWith(
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          if (description != null) ...[
            AppSpacing.heightSM,
            Text(
              description!,
              style: AppTextStyles.bodySmall.copyWith(
                color: AppColors.textSecondary,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ],
          if (metrics != null && metrics!.isNotEmpty) ...[
            AppSpacing.heightMD,
            _buildMetrics(),
          ],
          if (showActions && (onEdit != null || onDelete != null)) ...[
            AppSpacing.heightMD,
            const Divider(),
            AppSpacing.heightSM,
            _buildActions(),
          ],
        ],
      ),
    );
  }
  
  Widget _buildStatusBadge() {
    final statusColor = _getStatusColor();
    final statusIcon = _getStatusIcon();
    final statusText = _getStatusText();
    
    return Container(
      padding: AppSpacing.symmetric(
        horizontal: AppSpacing.xs,
        vertical: AppSpacing.xxs,
      ),
      decoration: BoxDecoration(
        color: statusColor.withOpacity(0.1),
        borderRadius: AppSpacing.borderRadiusFull,
        border: Border.all(
          color: statusColor.withOpacity(0.3),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            statusIcon,
            size: UIConstants.iconSizeXS,
            color: statusColor,
          ),
          AppSpacing.widthXXS,
          Text(
            statusText,
            style: AppTextStyles.labelSmall.copyWith(
              color: statusColor,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildMetrics() {
    return Container(
      padding: AppSpacing.allSM,
      decoration: BoxDecoration(
        color: AppColors.neutral50,
        borderRadius: AppSpacing.borderRadiusSM,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: metrics!.map((metric) {
          final isLast = metrics!.last == metric;
          return Expanded(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Column(
                  children: [
                    Text(
                      metric.value,
                      style: AppTextStyles.titleLarge.copyWith(
                        fontWeight: FontWeight.w700,
                        color: metric.color ?? AppColors.primary,
                      ),
                    ),
                    AppSpacing.heightXXS,
                    Text(
                      metric.label,
                      style: AppTextStyles.caption.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ],
                ),
                if (!isLast) ...[
                  AppSpacing.widthMD,
                  Container(
                    width: 1,
                    height: 30,
                    color: AppColors.border,
                  ),
                  AppSpacing.widthMD,
                ],
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
  
  Widget _buildActions() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        if (onEdit != null)
          TextButton.icon(
            onPressed: onEdit,
            icon: const Icon(Icons.edit, size: UIConstants.iconSizeSM),
            label: const Text('Edit'),
            style: TextButton.styleFrom(
              foregroundColor: AppColors.primary,
            ),
          ),
        if (onEdit != null && onDelete != null) AppSpacing.widthSM,
        if (onDelete != null)
          TextButton.icon(
            onPressed: onDelete,
            icon: const Icon(Icons.delete, size: UIConstants.iconSizeSM),
            label: const Text('Delete'),
            style: TextButton.styleFrom(
              foregroundColor: AppColors.error,
            ),
          ),
      ],
    );
  }
  
  Color _getStatusColor() {
    switch (status) {
      case ReportStatus.draft:
        return AppColors.neutral500;
      case ReportStatus.pending:
        return AppColors.warning;
      case ReportStatus.synced:
        return AppColors.success;
      case ReportStatus.failed:
        return AppColors.error;
    }
  }
  
  IconData _getStatusIcon() {
    switch (status) {
      case ReportStatus.draft:
        return Icons.edit_note;
      case ReportStatus.pending:
        return Icons.sync;
      case ReportStatus.synced:
        return Icons.cloud_done;
      case ReportStatus.failed:
        return Icons.sync_problem;
    }
  }
  
  String _getStatusText() {
    switch (status) {
      case ReportStatus.draft:
        return 'Draft';
      case ReportStatus.pending:
        return 'Pending Sync';
      case ReportStatus.synced:
        return 'Synced';
      case ReportStatus.failed:
        return 'Sync Failed';
    }
  }
}

/// Report status enum
enum ReportStatus {
  draft,
  pending,
  synced,
  failed,
}

/// Report metric data
class ReportMetric {
  final String label;
  final String value;
  final Color? color;
  
  const ReportMetric({
    required this.label,
    required this.value,
    this.color,
  });
}

/// Summary report card
class SummaryReportCard extends StatelessWidget {
  final String title;
  final String? subtitle;
  final IconData? icon;
  final String primaryValue;
  final String? primaryLabel;
  final String? secondaryValue;
  final String? secondaryLabel;
  final double? changePercentage;
  final bool isPositiveChange;
  final Color? color;
  final VoidCallback? onTap;
  final EdgeInsetsGeometry? margin;
  
  const SummaryReportCard({
    Key? key,
    required this.title,
    this.subtitle,
    this.icon,
    required this.primaryValue,
    this.primaryLabel,
    this.secondaryValue,
    this.secondaryLabel,
    this.changePercentage,
    this.isPositiveChange = true,
    this.color,
    this.onTap,
    this.margin,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final cardColor = color ?? AppColors.primary;
    
    return BaseCard(
      margin: margin,
      padding: AppSpacing.allMD,
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              if (icon != null)
                Container(
                  padding: AppSpacing.allSM,
                  decoration: BoxDecoration(
                    color: cardColor.withOpacity(0.1),
                    borderRadius: AppSpacing.borderRadiusSM,
                  ),
                  child: Icon(
                    icon,
                    color: cardColor,
                    size: UIConstants.iconSizeMD,
                  ),
                ),
              if (icon != null) AppSpacing.widthMD,
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: AppTextStyles.titleSmall.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                    if (subtitle != null) ...[
                      AppSpacing.heightXXS,
                      Text(
                        subtitle!,
                        style: AppTextStyles.caption.copyWith(
                          color: AppColors.textTertiary,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
          AppSpacing.heightMD,
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      primaryValue,
                      style: AppTextStyles.headlineMedium.copyWith(
                        fontWeight: FontWeight.w700,
                        color: cardColor,
                      ),
                    ),
                    if (primaryLabel != null) ...[
                      AppSpacing.heightXXS,
                      Text(
                        primaryLabel!,
                        style: AppTextStyles.caption.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              if (secondaryValue != null)
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      secondaryValue!,
                      style: AppTextStyles.titleMedium.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    if (secondaryLabel != null) ...[
                      AppSpacing.heightXXS,
                      Text(
                        secondaryLabel!,
                        style: AppTextStyles.caption.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ],
                ),
            ],
          ),
          if (changePercentage != null) ...[
            AppSpacing.heightSM,
            Row(
              children: [
                Icon(
                  isPositiveChange
                      ? Icons.trending_up
                      : Icons.trending_down,
                  size: UIConstants.iconSizeSM,
                  color: isPositiveChange
                      ? AppColors.success
                      : AppColors.error,
                ),
                AppSpacing.widthXXS,
                Text(
                  '${changePercentage!.abs().toStringAsFixed(1)}%',
                  style: AppTextStyles.labelSmall.copyWith(
                    color: isPositiveChange
                        ? AppColors.success
                        : AppColors.error,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                AppSpacing.widthXS,
                Text(
                  'vs last period',
                  style: AppTextStyles.caption.copyWith(
                    color: AppColors.textTertiary,
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}