import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/theme.dart';
import '../../../core/constants/constants.dart';
import 'base_card.dart';

/// Product card for displaying material/product information
/// 
/// Example usage:
/// ```dart
/// ProductCard(
///   name: 'Premium Paint',
///   sku: 'SKU-12345',
///   price: 150000,
///   stock: 25,
///   imageUrl: 'https://example.com/image.jpg',
///   onTap: () => viewProduct(),
/// )
/// ```
class ProductCard extends StatelessWidget {
  final String name;
  final String? sku;
  final double? price;
  final int? stock;
  final String? unit;
  final String? imageUrl;
  final Widget? image;
  final String? description;
  final VoidCallback? onTap;
  final VoidCallback? onAddToCart;
  final EdgeInsetsGeometry? margin;
  final bool showStock;
  final bool showPrice;
  final Widget? badge;
  final List<String>? tags;
  
  const ProductCard({
    Key? key,
    required this.name,
    this.sku,
    this.price,
    this.stock,
    this.unit,
    this.imageUrl,
    this.image,
    this.description,
    this.onTap,
    this.onAddToCart,
    this.margin,
    this.showStock = true,
    this.showPrice = true,
    this.badge,
    this.tags,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(
      locale: 'id_ID',
      symbol: 'Rp ',
      decimalDigits: 0,
    );
    
    return BaseCard(
      margin: margin,
      padding: EdgeInsets.zero,
      onTap: onTap,
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              _buildImage(),
              if (badge != null)
                Positioned(
                  top: AppSpacing.xs,
                  right: AppSpacing.xs,
                  child: badge!,
                ),
              if (stock != null && stock! <= 5 && showStock)
                Positioned(
                  bottom: AppSpacing.xs,
                  left: AppSpacing.xs,
                  child: _buildLowStockBadge(),
                ),
            ],
          ),
          Padding(
            padding: AppSpacing.allMD,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (sku != null)
                  Text(
                    sku!,
                    style: AppTextStyles.caption.copyWith(
                      color: AppColors.textTertiary,
                    ),
                  ),
                if (sku != null) AppSpacing.heightXXS,
                Text(
                  name,
                  style: AppTextStyles.titleMedium.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                if (description != null) ...[
                  AppSpacing.heightXS,
                  Text(
                    description!,
                    style: AppTextStyles.bodySmall.copyWith(
                      color: AppColors.textSecondary,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
                if (tags != null && tags!.isNotEmpty) ...[
                  AppSpacing.heightSM,
                  _buildTags(),
                ],
                AppSpacing.heightSM,
                Row(
                  children: [
                    if (showPrice && price != null) ...[
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              currencyFormat.format(price),
                              style: AppTextStyles.titleMedium.copyWith(
                                color: AppColors.primary,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            if (unit != null)
                              Text(
                                '/ $unit',
                                style: AppTextStyles.caption.copyWith(
                                  color: AppColors.textSecondary,
                                ),
                              ),
                          ],
                        ),
                      ),
                    ],
                    if (showStock && stock != null) ...[
                      if (showPrice && price != null) AppSpacing.widthSM,
                      _buildStockInfo(),
                    ],
                  ],
                ),
                if (onAddToCart != null) ...[
                  AppSpacing.heightMD,
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton.icon(
                      onPressed: stock == 0 ? null : onAddToCart,
                      icon: const Icon(Icons.add_shopping_cart, size: UIConstants.iconSizeSM),
                      label: Text(stock == 0 ? 'Out of Stock' : 'Add to Cart'),
                      style: ElevatedButton.styleFrom(
                        padding: AppSpacing.symmetric(
                          vertical: AppSpacing.sm,
                        ),
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildImage() {
    if (image != null) {
      return SizedBox(
        height: 160,
        width: double.infinity,
        child: image!,
      );
    }
    
    return Container(
      height: 160,
      width: double.infinity,
      color: AppColors.neutral100,
      child: imageUrl != null
          ? Image.network(
              imageUrl!,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) => _buildImagePlaceholder(),
            )
          : _buildImagePlaceholder(),
    );
  }
  
  Widget _buildImagePlaceholder() {
    return Center(
      child: Icon(
        Icons.inventory_2,
        size: UIConstants.iconSizeXL,
        color: AppColors.textTertiary,
      ),
    );
  }
  
  Widget _buildLowStockBadge() {
    return Container(
      padding: AppSpacing.symmetric(
        horizontal: AppSpacing.xs,
        vertical: AppSpacing.xxs,
      ),
      decoration: BoxDecoration(
        color: AppColors.warning,
        borderRadius: AppSpacing.borderRadiusSM,
      ),
      child: Text(
        'Low Stock',
        style: AppTextStyles.labelSmall.copyWith(
          color: AppColors.textOnPrimary,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
  
  Widget _buildStockInfo() {
    final isLowStock = stock! <= 5;
    final stockColor = stock == 0
        ? AppColors.error
        : (isLowStock ? AppColors.warning : AppColors.success);
    
    return Container(
      padding: AppSpacing.symmetric(
        horizontal: AppSpacing.sm,
        vertical: AppSpacing.xs,
      ),
      decoration: BoxDecoration(
        color: stockColor.withOpacity(0.1),
        borderRadius: AppSpacing.borderRadiusSM,
        border: Border.all(
          color: stockColor.withOpacity(0.3),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.inventory,
            size: UIConstants.iconSizeXS,
            color: stockColor,
          ),
          AppSpacing.widthXXS,
          Text(
            '$stock',
            style: AppTextStyles.labelMedium.copyWith(
              color: stockColor,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _buildTags() {
    return Wrap(
      spacing: AppSpacing.xs,
      runSpacing: AppSpacing.xs,
      children: tags!.map((tag) {
        return Container(
          padding: AppSpacing.symmetric(
            horizontal: AppSpacing.xs,
            vertical: AppSpacing.xxs,
          ),
          decoration: BoxDecoration(
            color: AppColors.neutral100,
            borderRadius: AppSpacing.borderRadiusFull,
          ),
          child: Text(
            tag,
            style: AppTextStyles.labelSmall.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
        );
      }).toList(),
    );
  }
}

/// Grid product card for catalog view
class GridProductCard extends StatelessWidget {
  final String name;
  final String? imageUrl;
  final double? price;
  final String? unit;
  final VoidCallback? onTap;
  final Widget? badge;
  
  const GridProductCard({
    Key? key,
    required this.name,
    this.imageUrl,
    this.price,
    this.unit,
    this.onTap,
    this.badge,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final currencyFormat = NumberFormat.currency(
      locale: 'id_ID',
      symbol: 'Rp ',
      decimalDigits: 0,
    );
    
    return BaseCard(
      padding: EdgeInsets.zero,
      onTap: onTap,
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Stack(
              children: [
                Container(
                  width: double.infinity,
                  color: AppColors.neutral100,
                  child: imageUrl != null
                      ? Image.network(
                          imageUrl!,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => Center(
                            child: Icon(
                              Icons.inventory_2,
                              size: UIConstants.iconSizeLG,
                              color: AppColors.textTertiary,
                            ),
                          ),
                        )
                      : Center(
                          child: Icon(
                            Icons.inventory_2,
                            size: UIConstants.iconSizeLG,
                            color: AppColors.textTertiary,
                          ),
                        ),
                ),
                if (badge != null)
                  Positioned(
                    top: AppSpacing.xs,
                    right: AppSpacing.xs,
                    child: badge!,
                  ),
              ],
            ),
          ),
          Padding(
            padding: AppSpacing.allSM,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: AppTextStyles.bodyMedium.copyWith(
                    fontWeight: FontWeight.w500,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                if (price != null) ...[
                  AppSpacing.heightXS,
                  Text(
                    currencyFormat.format(price),
                    style: AppTextStyles.titleSmall.copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  if (unit != null)
                    Text(
                      '/ $unit',
                      style: AppTextStyles.caption.copyWith(
                        color: AppColors.textSecondary,
                      ),
                    ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Summary card for dashboard metrics
class SummaryCard extends StatelessWidget {
  final String title;
  final String value;
  final String? subtitle;
  final IconData? icon;
  final Color? color;
  final Widget? chart;
  final VoidCallback? onTap;
  final EdgeInsetsGeometry? margin;
  final bool isLoading;
  
  const SummaryCard({
    Key? key,
    required this.title,
    required this.value,
    this.subtitle,
    this.icon,
    this.color,
    this.chart,
    this.onTap,
    this.margin,
    this.isLoading = false,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final cardColor = color ?? AppColors.primary;
    
    return BaseCard(
      margin: margin,
      padding: AppSpacing.allMD,
      onTap: onTap,
      child: isLoading
          ? const Center(
              child: CircularProgressIndicator(),
            )
          : Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    if (icon != null)
                      Container(
                        padding: AppSpacing.allSM,
                        decoration: BoxDecoration(
                          color: cardColor.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          icon,
                          color: cardColor,
                          size: UIConstants.iconSizeMD,
                        ),
                      ),
                    if (icon != null) AppSpacing.widthMD,
                    Expanded(
                      child: Text(
                        title,
                        style: AppTextStyles.titleSmall.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ),
                    if (onTap != null)
                      Icon(
                        Icons.arrow_forward_ios,
                        size: UIConstants.iconSizeXS,
                        color: AppColors.textTertiary,
                      ),
                  ],
                ),
                AppSpacing.heightMD,
                Text(
                  value,
                  style: AppTextStyles.headlineMedium.copyWith(
                    fontWeight: FontWeight.w700,
                    color: cardColor,
                  ),
                ),
                if (subtitle != null) ...[
                  AppSpacing.heightXS,
                  Text(
                    subtitle!,
                    style: AppTextStyles.caption.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
                if (chart != null) ...[
                  AppSpacing.heightMD,
                  SizedBox(
                    height: 60,
                    child: chart!,
                  ),
                ],
              ],
            ),
    );
  }
}