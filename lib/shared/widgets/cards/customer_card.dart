import 'package:flutter/material.dart';
import '../../../core/theme/theme.dart';
import '../../../core/constants/constants.dart';
import 'base_card.dart';

/// Customer card for displaying customer information
/// 
/// Example usage:
/// ```dart
/// CustomerCard(
///   name: 'John Doe',
///   phone: '+62 812 3456 7890',
///   address: 'Jl. Sudirman No. 123',
///   status: CustomerStatus.active,
///   onTap: () => viewCustomerDetails(),
/// )
/// ```
class CustomerCard extends StatelessWidget {
  final String name;
  final String? subtitle;
  final String? phone;
  final String? email;
  final String? address;
  final CustomerStatus? status;
  final String? avatarUrl;
  final Widget? avatar;
  final Widget? trailing;
  final VoidCallback? onTap;
  final VoidCallback? onLongPress;
  final EdgeInsetsGeometry? margin;
  final bool showStatus;
  final List<CustomerAction>? actions;
  
  const CustomerCard({
    Key? key,
    required this.name,
    this.subtitle,
    this.phone,
    this.email,
    this.address,
    this.status,
    this.avatarUrl,
    this.avatar,
    this.trailing,
    this.onTap,
    this.onLongPress,
    this.margin,
    this.showStatus = true,
    this.actions,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BaseCard(
      margin: margin,
      padding: AppSpacing.allMD,
      onTap: onTap,
      onLongPress: onLongPress,
      child: Column(
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildAvatar(),
              AppSpacing.widthMD,
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            name,
                            style: AppTextStyles.titleMedium.copyWith(
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                        if (showStatus && status != null)
                          _buildStatusBadge(),
                      ],
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
                    AppSpacing.heightSM,
                    _buildContactInfo(),
                  ],
                ),
              ),
              if (trailing != null) ...[
                AppSpacing.widthSM,
                trailing!,
              ],
            ],
          ),
          if (actions != null && actions!.isNotEmpty) ...[
            AppSpacing.heightMD,
            const Divider(),
            AppSpacing.heightSM,
            _buildActions(),
          ],
        ],
      ),
    );
  }
  
  Widget _buildAvatar() {
    if (avatar != null) {
      return avatar!;
    }
    
    return CircleAvatar(
      radius: 24,
      backgroundColor: AppColors.primary.withOpacity(0.1),
      backgroundImage: avatarUrl != null ? NetworkImage(avatarUrl!) : null,
      child: avatarUrl == null
          ? Text(
              name.isNotEmpty ? name[0].toUpperCase() : '?',
              style: AppTextStyles.titleLarge.copyWith(
                color: AppColors.primary,
                fontWeight: FontWeight.w600,
              ),
            )
          : null,
    );
  }
  
  Widget _buildStatusBadge() {
    final statusColor = _getStatusColor();
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
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(
              color: statusColor,
              shape: BoxShape.circle,
            ),
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
  
  Widget _buildContactInfo() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (phone != null)
          _buildInfoRow(Icons.phone, phone!),
        if (email != null) ...[
          if (phone != null) AppSpacing.heightXXS,
          _buildInfoRow(Icons.email, email!),
        ],
        if (address != null) ...[
          if (phone != null || email != null) AppSpacing.heightXXS,
          _buildInfoRow(Icons.location_on, address!),
        ],
      ],
    );
  }
  
  Widget _buildInfoRow(IconData icon, String text) {
    return Row(
      children: [
        Icon(
          icon,
          size: UIConstants.iconSizeXS,
          color: AppColors.textTertiary,
        ),
        AppSpacing.widthXS,
        Expanded(
          child: Text(
            text,
            style: AppTextStyles.bodySmall.copyWith(
              color: AppColors.textSecondary,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
  
  Widget _buildActions() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: actions!.map((action) {
        return Expanded(
          child: TextButton.icon(
            onPressed: action.onPressed,
            icon: Icon(
              action.icon,
              size: UIConstants.iconSizeSM,
            ),
            label: Text(
              action.label,
              style: AppTextStyles.labelSmall,
            ),
            style: TextButton.styleFrom(
              foregroundColor: action.color ?? AppColors.primary,
              padding: AppSpacing.symmetric(
                horizontal: AppSpacing.xs,
                vertical: AppSpacing.xxs,
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
  
  Color _getStatusColor() {
    switch (status) {
      case CustomerStatus.active:
        return AppColors.success;
      case CustomerStatus.inactive:
        return AppColors.warning;
      case CustomerStatus.blocked:
        return AppColors.error;
      case CustomerStatus.pending:
        return AppColors.neutral500;
      default:
        return AppColors.neutral500;
    }
  }
  
  String _getStatusText() {
    switch (status) {
      case CustomerStatus.active:
        return 'Active';
      case CustomerStatus.inactive:
        return 'Inactive';
      case CustomerStatus.blocked:
        return 'Blocked';
      case CustomerStatus.pending:
        return 'Pending';
      default:
        return 'Unknown';
    }
  }
}

/// Customer status enum
enum CustomerStatus {
  active,
  inactive,
  blocked,
  pending,
}

/// Customer card action
class CustomerAction {
  final IconData icon;
  final String label;
  final VoidCallback onPressed;
  final Color? color;
  
  const CustomerAction({
    required this.icon,
    required this.label,
    required this.onPressed,
    this.color,
  });
}

/// Compact customer card for lists
class CompactCustomerCard extends StatelessWidget {
  final String name;
  final String? subtitle;
  final String? avatarUrl;
  final Widget? leading;
  final Widget? trailing;
  final VoidCallback? onTap;
  final EdgeInsetsGeometry? margin;
  final bool selected;
  
  const CompactCustomerCard({
    Key? key,
    required this.name,
    this.subtitle,
    this.avatarUrl,
    this.leading,
    this.trailing,
    this.onTap,
    this.margin,
    this.selected = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return BaseCard(
      margin: margin,
      padding: EdgeInsets.zero,
      onTap: onTap,
      color: selected ? AppColors.primary.withOpacity(0.05) : null,
      borderSide: selected
          ? BorderSide(color: AppColors.primary, width: 2)
          : null,
      child: ListTile(
        leading: leading ??
            CircleAvatar(
              radius: 20,
              backgroundColor: AppColors.primary.withOpacity(0.1),
              backgroundImage: avatarUrl != null ? NetworkImage(avatarUrl!) : null,
              child: avatarUrl == null
                  ? Text(
                      name.isNotEmpty ? name[0].toUpperCase() : '?',
                      style: AppTextStyles.titleSmall.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.w600,
                      ),
                    )
                  : null,
            ),
        title: Text(
          name,
          style: AppTextStyles.bodyMedium.copyWith(
            fontWeight: selected ? FontWeight.w600 : FontWeight.w500,
          ),
        ),
        subtitle: subtitle != null
            ? Text(
                subtitle!,
                style: AppTextStyles.bodySmall.copyWith(
                  color: AppColors.textSecondary,
                ),
              )
            : null,
        trailing: trailing ??
            (selected
                ? Icon(
                    Icons.check_circle,
                    color: AppColors.primary,
                    size: UIConstants.iconSizeSM,
                  )
                : Icon(
                    Icons.chevron_right,
                    color: AppColors.textTertiary,
                    size: UIConstants.iconSizeSM,
                  )),
      ),
    );
  }
}