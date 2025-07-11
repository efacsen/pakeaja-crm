import 'package:flutter/material.dart';
import '../../../core/theme/theme.dart';
import '../../../core/constants/constants.dart';

/// A customizable loading indicator with different variants
/// 
/// Example usage:
/// ```dart
/// // Circular loading
/// LoadingIndicator()
/// 
/// // Linear loading
/// LoadingIndicator(type: LoadingIndicatorType.linear)
/// 
/// // Shimmer loading
/// LoadingIndicator(
///   type: LoadingIndicatorType.shimmer,
///   shimmerBaseColor: Colors.grey[300],
/// )
/// 
/// // With message
/// LoadingIndicator(
///   message: 'Loading data...',
/// )
/// ```
class LoadingIndicator extends StatelessWidget {
  final LoadingIndicatorType type;
  final double? size;
  final Color? color;
  final String? message;
  final TextStyle? messageStyle;
  final double spacing;
  final double strokeWidth;
  final Color? backgroundColor;
  final double? value;
  final Widget? shimmerChild;
  final Color? shimmerBaseColor;
  final Color? shimmerHighlightColor;
  final bool center;
  final EdgeInsetsGeometry? padding;
  
  const LoadingIndicator({
    Key? key,
    this.type = LoadingIndicatorType.circular,
    this.size,
    this.color,
    this.message,
    this.messageStyle,
    this.spacing = 16.0,
    this.strokeWidth = 3.0,
    this.backgroundColor,
    this.value,
    this.shimmerChild,
    this.shimmerBaseColor,
    this.shimmerHighlightColor,
    this.center = true,
    this.padding,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    Widget indicator;
    
    switch (type) {
      case LoadingIndicatorType.circular:
        indicator = _buildCircular(context);
        break;
      case LoadingIndicatorType.linear:
        indicator = _buildLinear(context);
        break;
      case LoadingIndicatorType.shimmer:
        indicator = _buildShimmer(context);
        break;
    }
    
    if (message != null) {
      indicator = Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          indicator,
          SizedBox(height: spacing),
          Text(
            message!,
            style: messageStyle ??
                AppTextStyles.bodyMedium.copyWith(
                  color: AppColors.textSecondary,
                ),
            textAlign: TextAlign.center,
          ),
        ],
      );
    }
    
    if (padding != null) {
      indicator = Padding(
        padding: padding!,
        child: indicator,
      );
    }
    
    if (center) {
      indicator = Center(child: indicator);
    }
    
    return indicator;
  }
  
  Widget _buildCircular(BuildContext context) {
    return SizedBox(
      width: size ?? UIConstants.loaderSizeMD,
      height: size ?? UIConstants.loaderSizeMD,
      child: CircularProgressIndicator(
        value: value,
        strokeWidth: strokeWidth,
        valueColor: AlwaysStoppedAnimation<Color>(
          color ?? Theme.of(context).colorScheme.primary,
        ),
        backgroundColor: backgroundColor,
      ),
    );
  }
  
  Widget _buildLinear(BuildContext context) {
    return SizedBox(
      height: strokeWidth,
      child: LinearProgressIndicator(
        value: value,
        minHeight: strokeWidth,
        valueColor: AlwaysStoppedAnimation<Color>(
          color ?? Theme.of(context).colorScheme.primary,
        ),
        backgroundColor: backgroundColor ?? AppColors.neutral200,
      ),
    );
  }
  
  Widget _buildShimmer(BuildContext context) {
    return Shimmer(
      baseColor: shimmerBaseColor ?? AppColors.neutral200,
      highlightColor: shimmerHighlightColor ?? AppColors.neutral100,
      child: shimmerChild ?? _defaultShimmerChild(),
    );
  }
  
  Widget _defaultShimmerChild() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          width: double.infinity,
          height: 200,
          color: Colors.white,
        ),
        AppSpacing.heightMD,
        Container(
          width: double.infinity,
          height: 20,
          color: Colors.white,
        ),
        AppSpacing.heightSM,
        Container(
          width: 150,
          height: 20,
          color: Colors.white,
        ),
      ],
    );
  }
}

/// Loading indicator types
enum LoadingIndicatorType {
  circular,
  linear,
  shimmer,
}

/// Shimmer effect widget
class Shimmer extends StatefulWidget {
  final Widget child;
  final Color baseColor;
  final Color highlightColor;
  final Duration duration;
  
  const Shimmer({
    Key? key,
    required this.child,
    required this.baseColor,
    required this.highlightColor,
    this.duration = UIConstants.shimmerDuration,
  }) : super(key: key);
  
  @override
  State<Shimmer> createState() => _ShimmerState();
}

class _ShimmerState extends State<Shimmer> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;
  
  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: widget.duration,
      vsync: this,
    )..repeat();
    
    _animation = Tween<double>(
      begin: -1.0,
      end: 2.0,
    ).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.linear,
    ));
  }
  
  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
  
  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return ShaderMask(
          shaderCallback: (Rect bounds) {
            return LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                widget.baseColor,
                widget.highlightColor,
                widget.baseColor,
              ],
              stops: [
                _animation.value - 1.0,
                _animation.value,
                _animation.value + 1.0,
              ],
              transform: const GradientRotation(0.5),
            ).createShader(bounds);
          },
          blendMode: BlendMode.srcIn,
          child: widget.child,
        );
      },
    );
  }
}

/// Skeleton loader for lists
class SkeletonLoader extends StatelessWidget {
  final int itemCount;
  final double itemHeight;
  final double spacing;
  final EdgeInsetsGeometry? padding;
  final Widget Function(BuildContext, int)? itemBuilder;
  
  const SkeletonLoader({
    Key? key,
    this.itemCount = 5,
    this.itemHeight = 80,
    this.spacing = 16,
    this.padding,
    this.itemBuilder,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Shimmer(
      baseColor: AppColors.neutral200,
      highlightColor: AppColors.neutral100,
      child: ListView.separated(
        padding: padding ?? AppSpacing.allMD,
        physics: const NeverScrollableScrollPhysics(),
        shrinkWrap: true,
        itemCount: itemCount,
        separatorBuilder: (context, index) => SizedBox(height: spacing),
        itemBuilder: itemBuilder ?? _defaultItemBuilder,
      ),
    );
  }
  
  Widget _defaultItemBuilder(BuildContext context, int index) {
    return Container(
      height: itemHeight,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppSpacing.borderRadiusMD,
      ),
    );
  }
}

/// Loading overlay that blocks interaction
class LoadingOverlay extends StatelessWidget {
  final bool isLoading;
  final Widget child;
  final Color? barrierColor;
  final String? message;
  final LoadingIndicatorType indicatorType;
  
  const LoadingOverlay({
    Key? key,
    required this.isLoading,
    required this.child,
    this.barrierColor,
    this.message,
    this.indicatorType = LoadingIndicatorType.circular,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        child,
        if (isLoading)
          Positioned.fill(
            child: Container(
              color: barrierColor ?? Colors.black.withOpacity(0.5),
              child: LoadingIndicator(
                type: indicatorType,
                message: message,
                messageStyle: AppTextStyles.bodyMedium.copyWith(
                  color: Colors.white,
                ),
              ),
            ),
          ),
      ],
    );
  }
}