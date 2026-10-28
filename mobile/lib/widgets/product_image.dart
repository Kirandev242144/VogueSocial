import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/product.dart';
import '../providers/tryon_provider.dart';
import '../theme/app_theme.dart';

class ProductImage extends StatelessWidget {
  final String imagePath;
  final BoxFit fit;
  final double? width;
  final double? height;
  final Widget? errorWidget;

  const ProductImage({
    super.key,
    required this.imagePath,
    this.fit = BoxFit.cover,
    this.width,
    this.height,
    this.errorWidget,
  });

  @override
  Widget build(BuildContext context) {
    final cleanPath = imagePath.trim();
    if (cleanPath.isEmpty) {
      return errorWidget ?? _placeholder();
    }

    // 1. Remote HTTP/HTTPS image
    if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
      return Image.network(
        cleanPath,
        fit: fit,
        width: width,
        height: height,
        errorBuilder: (_, __, ___) => errorWidget ?? _placeholder(),
      );
    }

    // 2. Local Asset image (Shop_images or assets/)
    final assetPath = Product.normalizeAssetPath(cleanPath);
    return Image.asset(
      assetPath,
      fit: fit,
      width: width,
      height: height,
      errorBuilder: (context, error, stackTrace) {
        // Fallback: If asset fails (e.g. running in web or hot reload mismatch), try dev server
        final provider = Provider.of<TryOnProvider>(context, listen: false);
        final baseUrl = provider.baseUrl.isNotEmpty ? provider.baseUrl : 'http://192.168.1.33:3000';
        final cleanBase = baseUrl.endsWith('/') ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl;
        final normalizedSub = cleanPath.startsWith('/') ? cleanPath : '/$cleanPath';
        final netUrl = '$cleanBase$normalizedSub';

        return Image.network(
          netUrl,
          fit: fit,
          width: width,
          height: height,
          errorBuilder: (_, __, ___) => errorWidget ?? _placeholder(),
        );
      },
    );
  }

  Widget _placeholder() {
    return Container(
      width: width,
      height: height,
      color: AppTheme.surfaceMuted,
      child: const Center(
        child: Icon(Icons.image_outlined, color: Colors.grey, size: 28),
      ),
    );
  }
}
