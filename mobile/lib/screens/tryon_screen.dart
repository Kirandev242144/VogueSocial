import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/product.dart';
import '../providers/tryon_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/product_image.dart';
import 'avatar_creation_screen.dart';

class TryOnScreen extends StatefulWidget {
  final Product? product;
  final List<Product>? preSelectedOutfit;

  const TryOnScreen({super.key, this.product, this.preSelectedOutfit});

  @override
  State<TryOnScreen> createState() => _TryOnScreenState();
}

class _TryOnScreenState extends State<TryOnScreen> with SingleTickerProviderStateMixin {
  late AnimationController _scanController;
  late Animation<double> _scanAnimation;
  Product? _activeProduct;
  List<Product> _products = [];
  bool _loadingProducts = true;

  @override
  void initState() {
    super.initState();
    _activeProduct = widget.product ?? (widget.preSelectedOutfit != null && widget.preSelectedOutfit!.isNotEmpty ? widget.preSelectedOutfit!.first : null);
    _scanController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);

    _scanAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(_scanController);
    
    // Clear any previous results when entering
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<TryOnProvider>(context, listen: false).clearResult();
    });

    _loadProducts();
  }

  void _loadProducts() {
    final loaded = List<Product>.from(Product.shopProducts);

    // Move preSelectedOutfit or active product to the front of the list
    if (widget.preSelectedOutfit != null && widget.preSelectedOutfit!.isNotEmpty) {
      for (var outfitProd in widget.preSelectedOutfit!.reversed) {
        final idx = loaded.indexWhere((p) => p.id == outfitProd.id);
        if (idx != -1) {
          final active = loaded.removeAt(idx);
          loaded.insert(0, active);
        } else {
          loaded.insert(0, outfitProd);
        }
      }
    } else if (_activeProduct != null) {
      final idx = loaded.indexWhere((p) => p.id == _activeProduct!.id);
      if (idx != -1) {
        final active = loaded.removeAt(idx);
        loaded.insert(0, active);
      } else {
        loaded.insert(0, _activeProduct!);
      }
    }

    if (mounted) {
      setState(() {
        _products = loaded;
        _activeProduct ??= loaded.isNotEmpty ? loaded.first : null;
        _loadingProducts = false;
      });
    }
  }

  @override
  void didUpdateWidget(TryOnScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.product != oldWidget.product) {
      setState(() {
        _activeProduct = widget.product;
        // Re-sort the products to put the new active product at the front
        if (_activeProduct != null && _products.isNotEmpty) {
          final idx = _products.indexWhere((p) => p.id == _activeProduct!.id);
          if (idx != -1) {
            final active = _products.removeAt(idx);
            _products.insert(0, active);
          } else {
            _products.insert(0, _activeProduct!);
          }
        }
      });
    }
  }

  @override
  void dispose() {
    _scanController.dispose();
    super.dispose();
  }


  void _triggerTryOn(TryOnProvider provider) async {
    if (_activeProduct == null) return;
    try {
      await provider.runVirtualTryOn(_activeProduct!);
      await provider.incrementWearCount(_activeProduct!.id);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Try-On Failed: $e'),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  Widget _selectedProductHeader() {
    if (_activeProduct == null) return const SizedBox();
    return Container(
      margin: const EdgeInsets.only(bottom: 20),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.borderColor),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: File(_activeProduct!.imageUrl).existsSync()
                ? Image.file(
                    File(_activeProduct!.imageUrl),
                    height: 52,
                    width: 52,
                    fit: BoxFit.cover,
                  )
                : ProductImage(
                    imagePath: _activeProduct!.imageUrl,
                    height: 52,
                    width: 52,
                    fit: BoxFit.cover,
                  ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _activeProduct!.name,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    color: AppTheme.textColorPrimary,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  '\$${_activeProduct!.price.toStringAsFixed(0)}  ·  ${_activeProduct!.category.toUpperCase().replaceAll('-', ' ')}',
                  style: const TextStyle(
                    fontSize: 12,
                    color: AppTheme.primaryColor,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _modelPresetSelector(TryOnProvider provider) {
    // Determine active presets or fallback defaults
    final String activeFemaleUrl = (provider.defaultPresetModel != null && provider.defaultPresetModel!.contains('female'))
        ? provider.defaultPresetModel!
        : 'assets/model_female_1.webp';
    final String activeFemaleLabel = activeFemaleUrl.contains('female_2') ? 'Chloe (Curvy)' : 'Aria (Chic)';

    final String activeMaleUrl = (provider.defaultPresetModel != null && provider.defaultPresetModel!.contains('male'))
        ? provider.defaultPresetModel!
        : 'assets/model_male_1.webp';
    final String activeMaleLabel = activeMaleUrl.contains('male_2') ? 'Leo (Relaxed)' : 'Marcus (Sleek)';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const SizedBox(height: 20),
        
        // Guidelines row
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _guidelineItem('Full body'),
            const SizedBox(width: 8),
            _guidelineItem('Good lighting'),
            const SizedBox(width: 8),
            _guidelineItem('Fitted clothes'),
          ],
        ),
        
        const SizedBox(height: 16),
        
        // 1. Upload your photo Button
        SizedBox(
          width: double.infinity,
          height: 48,
          child: OutlinedButton.icon(
            style: OutlinedButton.styleFrom(
              side: BorderSide(
                color: provider.defaultPresetModel == null && provider.personImage != null
                    ? AppTheme.primaryColor
                    : AppTheme.borderColor,
                width: provider.defaultPresetModel == null && provider.personImage != null ? 2 : 1,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24),
              ),
              backgroundColor: provider.defaultPresetModel == null && provider.personImage != null
                  ? AppTheme.primaryColor.withOpacity(0.08)
                  : Colors.transparent,
            ),
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => AvatarCreationScreen(provider: provider),
              ),
            ),
            icon: Icon(
              Icons.upload_outlined,
              color: provider.defaultPresetModel == null && provider.personImage != null
                  ? AppTheme.primaryColor
                  : AppTheme.textColorPrimary,
            ),
            label: Text(
              provider.defaultPresetModel == null && provider.personImage != null
                  ? 'Selfie Selected (Tap to change)'
                  : 'Upload your photo',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
                color: provider.defaultPresetModel == null && provider.personImage != null
                    ? AppTheme.primaryColor
                    : AppTheme.textColorPrimary,
              ),
            ),
          ),
        ),
        
        const SizedBox(height: 12),
        
        // 2. OR divider
        Row(
          children: [
            Expanded(child: Divider(color: AppTheme.borderColor)),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 14),
              child: Text(
                'or',
                style: TextStyle(color: Colors.grey, fontSize: 13, fontWeight: FontWeight.bold),
              ),
            ),
            Expanded(child: Divider(color: AppTheme.borderColor)),
          ],
        ),
        
        const SizedBox(height: 12),
        
        // 3. Two preset blocks: Try on a female model / Try on a male model
        Row(
          children: [
            // Female model selector
            Expanded(
              child: _googlePresetBlock(
                provider: provider,
                label: 'Female Model:\n$activeFemaleLabel',
                imageUrl: activeFemaleUrl,
                gender: 'Female',
              ),
            ),
            const SizedBox(width: 12),
            // Male model selector
            Expanded(
              child: _googlePresetBlock(
                provider: provider,
                label: 'Male Model:\n$activeMaleLabel',
                imageUrl: activeMaleUrl,
                gender: 'Male',
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _guidelineItem(String text) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Icon(Icons.check, size: 12, color: Colors.green),
        const SizedBox(width: 3),
        Text(
          text,
          style: const TextStyle(fontSize: 11, color: Colors.grey),
        ),
      ],
    );
  }

  Widget _googlePresetBlock({
    required TryOnProvider provider,
    required String label,
    required String imageUrl,
    required String gender,
  }) {
    final isSelected = provider.defaultPresetModel != null && provider.defaultPresetModel!.contains(gender.toLowerCase());
    
    return GestureDetector(
      onTap: () => _showModelSelectorSheet(context, provider, gender),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
        decoration: BoxDecoration(
          color: AppTheme.surfaceColor,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? AppTheme.primaryColor : AppTheme.borderColor,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 34,
              height: 34,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
              ),
              child: ClipOval(
                child: Image.asset(imageUrl, fit: BoxFit.cover),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                label,
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: isSelected ? AppTheme.primaryColor : AppTheme.textColorPrimary,
                ),
                maxLines: 2,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showModelSelectorSheet(BuildContext context, TryOnProvider provider, String gender) {
    final List<Map<String, String>> models = gender == 'Female'
        ? [
            {'label': 'Aria', 'url': 'assets/model_female_1.webp', 'desc': 'Chic Fit'},
            {'label': 'Chloe', 'url': 'assets/model_female_2.webp', 'desc': 'Curvy Fit'},
          ]
        : [
            {'label': 'Marcus', 'url': 'assets/model_male_1.webp', 'desc': 'Sleek Fit'},
            {'label': 'Leo', 'url': 'assets/model_male_2.webp', 'desc': 'Relaxed Fit'},
          ];

    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.surfaceColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(24),
          topRight: Radius.circular(24),
        ),
      ),
      builder: (context) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: AppTheme.borderColor,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                Text(
                  'SELECT ${gender.toUpperCase()} MODEL',
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.5,
                    color: AppTheme.textColorPrimary,
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: models.map((model) {
                    final isSelected = provider.defaultPresetModel == model['url'];
                    return Expanded(
                      child: GestureDetector(
                        onTap: () async {
                          try {
                            await provider.setPersonImageFromPreset(model['url']!);
                            if (context.mounted) Navigator.pop(context);
                          } catch (e) {
                            if (context.mounted) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Error: $e'), backgroundColor: Colors.redAccent),
                              );
                            }
                          }
                        },
                        child: Container(
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: AppTheme.surfaceColor,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(
                              color: isSelected ? AppTheme.primaryColor : AppTheme.borderColor,
                              width: isSelected ? 2.5 : 1,
                            ),
                          ),
                          child: Column(
                            children: [
                              ClipRRect(
                                borderRadius: BorderRadius.circular(12),
                                child: Image.asset(
                                  model['url']!,
                                  height: 120,
                                  width: double.infinity,
                                  fit: BoxFit.cover,
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                model['label']!,
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                model['desc']!,
                                style: const TextStyle(color: Colors.grey, fontSize: 10),
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<TryOnProvider>(context);
    final canPop = Navigator.canPop(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'AI TRY-ON STUDIO',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            letterSpacing: 1.5,
            fontSize: 16,
          ),
        ),
        automaticallyImplyLeading: canPop,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 16),

              // Target Product Header Card
              _selectedProductHeader(),

              // Image comparison layout or upload state
              if (provider.tryOnResultUrl != null)
                _resultComparisonView(provider)
              else if (provider.isLoading)
                _scanningView(provider)
              else
                _uploadPlaceholderView(provider),

              // Model Preset Selector row
              if (!provider.isLoading && provider.tryOnResultUrl == null)
                _modelPresetSelector(provider),

              const SizedBox(height: 30),

              // Results actions (Try Another / Save Look)
              if (provider.tryOnResultUrl != null) ...[
                _resultActions(provider),
              ],
              const SizedBox(height: 30),
            ],
          ),
        ),
      ),
    );
  }

  Widget _uploadPlaceholderView(TryOnProvider provider) {
    final hasPhoto = provider.personImage != null;
    return GestureDetector(
      onTap: () => Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => AvatarCreationScreen(provider: provider),
        ),
      ),
      child: Container(
        height: 380,
        width: double.infinity,
        decoration: BoxDecoration(
          color: AppTheme.surfaceColor,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: AppTheme.borderColor),
        ),
        child: hasPhoto
            ? Stack(
                fit: StackFit.expand,
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(24),
                    child: Image.file(provider.personImage!, fit: BoxFit.cover),
                  ),
                  Positioned(
                    bottom: 16,
                    right: 16,
                    child: Container(
                      height: 48,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.15),
                            blurRadius: 8,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.secondaryColor,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(24),
                          ),
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                        ),
                        onPressed: () => _triggerTryOn(provider),
                        icon: const Icon(Icons.face_retouching_natural, color: AppTheme.primaryColor, size: 18),
                        label: const Text(
                          'RUN TRY-ON',
                          style: TextStyle(
                            color: AppTheme.primaryColor,
                            fontWeight: FontWeight.bold,
                            fontSize: 12.5,
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              )
            : Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: AppTheme.primaryColor.withOpacity(0.06),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.camera_alt_outlined,
                      size: 40,
                      color: AppTheme.primaryColor,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Upload Model Photo',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.textColorPrimary,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Take a selfie or pick from gallery',
                    style: TextStyle(
                      fontSize: 14,
                      color: AppTheme.textColorSecondary,
                    ),
                  ),
                ],
              ),
      ),
    );
  }

  Widget _scanningView(TryOnProvider provider) {
    return Container(
      height: 380,
      width: double.infinity,
      decoration: BoxDecoration(
        color: AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: AppTheme.borderColor),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(24),
        child: Stack(
          fit: StackFit.expand,
          children: [
            // Base user photo
            if (provider.personImage != null)
              Opacity(
                opacity: 0.65,
                child: Image.file(provider.personImage!, fit: BoxFit.cover),
              ),

            // Point Cloud Scanning Animation
            AnimatedBuilder(
              animation: _scanAnimation,
              builder: (context, child) {
                return CustomPaint(
                  painter: PointCloudScannerPainter(
                    scanProgress: _scanAnimation.value,
                    dotColor: AppTheme.primaryColor,
                  ),
                );
              },
            ),

            // Moving Scanline
            AnimatedBuilder(
              animation: _scanAnimation,
              builder: (context, child) {
                return Positioned(
                  top: _scanAnimation.value * 380,
                  left: 0,
                  right: 0,
                  child: Container(
                    height: 3,
                    decoration: BoxDecoration(
                      boxShadow: [
                        BoxShadow(
                          color: AppTheme.primaryColor.withOpacity(0.8),
                          blurRadius: 12,
                          spreadRadius: 1,
                        ),
                      ],
                      gradient: const LinearGradient(
                        colors: [AppTheme.primaryColor, Color(0xFF88D040)],
                      ),
                    ),
                  ),
                );
              },
            ),

            // Holographic HUD Overlay
            Positioned(
              bottom: 20,
              left: 20,
              right: 20,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.75),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.primaryColor.withOpacity(0.2)),
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.primaryColor.withOpacity(0.08),
                      blurRadius: 8,
                      spreadRadius: 1,
                    ),
                  ],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const SizedBox(
                      width: 14,
                      height: 14,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(AppTheme.primaryColor),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      provider.statusMessage.toUpperCase(),
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        letterSpacing: 1.0,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _resultComparisonView(TryOnProvider provider) {
    return Column(
      children: [
        Container(
          height: 380,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: AppTheme.borderColor),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(24),
            child: Row(
              children: [
                // Left Side: Original
                Expanded(
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      if (provider.personImage != null)
                        Image.file(provider.personImage!, fit: BoxFit.cover),
                      Container(
                        alignment: Alignment.bottomCenter,
                        padding: const EdgeInsets.all(10),
                        color: Colors.black.withOpacity(0.3),
                        child: const Text(
                          'ORIGINAL',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                // Divider Line
                Container(width: 2, color: AppTheme.surfaceColor),
                // Right Side: Generated Tryon
                Expanded(
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      Image.network(
                        provider.tryOnResultUrl!,
                        fit: BoxFit.cover,
                        loadingBuilder: (context, child, loadingProgress) {
                          if (loadingProgress == null) return child;
                          return Container(
                            color: AppTheme.surfaceColor,
                            child: const Center(
                              child: CircularProgressIndicator(),
                            ),
                          );
                        },
                        errorBuilder: (context, error, stackTrace) {
                          return Container(
                            color: AppTheme.surfaceColor,
                            child: const Icon(Icons.error_outline, color: Colors.redAccent),
                          );
                        },
                      ),
                      Container(
                        alignment: Alignment.bottomCenter,
                        padding: const EdgeInsets.all(10),
                        color: Colors.black.withOpacity(0.3),
                        child: const Text(
                          'AI TRY-ON',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.primaryColor,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _submitButton(TryOnProvider provider) {
    final hasPhoto = provider.personImage != null;
    return SizedBox(
      width: double.infinity,
      height: 56,
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          color: hasPhoto ? AppTheme.secondaryColor : Colors.grey.withOpacity(0.1),
          border: hasPhoto ? Border.all(color: AppTheme.primaryColor.withOpacity(0.15)) : null,
        ),
        child: ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.transparent,
            shadowColor: Colors.transparent,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
          ),
          onPressed: hasPhoto ? () => _triggerTryOn(provider) : null,
          child: Text(
            'RUN TRY-ON',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: hasPhoto ? AppTheme.primaryColor : Colors.grey,
            ),
          ),
        ),
      ),
    );
  }

  Widget _resultActions(TryOnProvider provider) {
    return Column(
      children: [
        // Share to Community button (Primary button, lime background, forest text)
        SizedBox(
          width: double.infinity,
          height: 52,
          child: ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.secondaryColor,
              foregroundColor: AppTheme.primaryColor,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              elevation: 0,
            ),
            onPressed: () async {
              final outfitName = _activeProduct != null ? 'Try-On: ${_activeProduct!.name}' : 'My Try-On Look';
              final productIds = _activeProduct != null ? [_activeProduct!.id] : <String>[];
              final tryOnUrl = provider.tryOnResultUrl ?? '';
              
              final success = await provider.shareTryOnToCommunity(
                outfitName: outfitName,
                productIds: productIds,
                tryOnImageUrl: tryOnUrl,
              );
              
              if (mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(success ? 'Successfully posted your Try-On look to the Community!' : 'Failed to post look.'),
                    backgroundColor: AppTheme.primaryColor,
                  ),
                );
              }
            },
            icon: const Icon(Icons.share_outlined, color: AppTheme.primaryColor, size: 18),
            label: const Text('SHARE TO COMMUNITY FEED', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: OutlinedButton(
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: AppTheme.primaryColor),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                onPressed: () {
                  provider.clearResult();
                },
                child: const Text('Try Another', style: TextStyle(color: AppTheme.primaryColor)),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryColor,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Look saved to device photos!')),
                  );
                },
                child: const Text('Save Look'),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class PointCloudScannerPainter extends CustomPainter {
  final double scanProgress; // 0.0 to 1.0
  final Color dotColor;

  PointCloudScannerPainter({
    required this.scanProgress,
    required this.dotColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = dotColor
      ..style = PaintingStyle.fill;

    final double scanY = scanProgress * size.height;
    
    // Grid parameters
    const int cols = 18;
    const int rows = 28;
    final double colSpacing = size.width / (cols + 1);
    final double rowSpacing = size.height / (rows + 1);
    
    // Max distance from scan line to affect dot glow
    final double maxDistance = size.height * 0.22;

    for (int c = 1; c <= cols; c++) {
      for (int r = 1; r <= rows; r++) {
        final double dotX = c * colSpacing;
        final double dotY = r * rowSpacing;
        
        // Calculate distance to scan line
        final double distanceToScan = (dotY - scanY).abs();
        
        if (distanceToScan < maxDistance) {
          // Dots closer to the scan line are larger and more opaque
          final double factor = 1.0 - (distanceToScan / maxDistance);
          
          // Organic waving ripple offset
          final double wave = (c % 2 == 0 ? 1.0 : -1.0) * 1.5 * scanProgress;
          
          final double opacity = factor * 0.6;
          final double radius = 1.2 + (factor * 2.2);

          paint.color = dotColor.withOpacity(opacity);
          canvas.drawCircle(Offset(dotX + wave, dotY), radius, paint);
        } else {
          // Ambient dim point cloud
          paint.color = dotColor.withOpacity(0.04);
          canvas.drawCircle(Offset(dotX, dotY), 1.0, paint);
        }
      }
    }
  }

  @override
  bool shouldRepaint(PointCloudScannerPainter oldDelegate) {
    return oldDelegate.scanProgress != scanProgress;
  }
}
