import 'dart:convert';
import 'dart:io';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:image_picker/image_picker.dart';
import '../theme/app_theme.dart';
import '../models/product.dart';
import '../providers/tryon_provider.dart';
import '../widgets/product_image.dart';

class CanvasItem {
  final Product product;
  Offset position;
  double scale;
  double rotation;
  bool isLocked;

  CanvasItem({
    required this.product,
    required this.position,
    this.scale = 1.0,
    this.rotation = 0.0,
    this.isLocked = false,
  });

  CanvasItem copy() {
    return CanvasItem(
      product: product,
      position: Offset(position.dx, position.dy),
      scale: scale,
      rotation: rotation,
      isLocked: isLocked,
    );
  }
}

class StylingScreen extends StatefulWidget {
  const StylingScreen({super.key});

  @override
  State<StylingScreen> createState() => _StylingScreenState();
}

class _StylingScreenState extends State<StylingScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // DRESS ME STATE
  final PageController _topsController = PageController(viewportFraction: 0.7);
  final PageController _bottomsController = PageController(viewportFraction: 0.7);
  final PageController _shoesController = PageController(viewportFraction: 0.7);

  int _selectedTopIndex = 0;
  int _selectedBottomIndex = 0;
  int _selectedShoesIndex = 0;

  bool _isTopPinned = false;
  bool _isBottomPinned = false;
  bool _isShoesPinned = false;

  bool _isGridView = false; // Toggle between slot shuffler and grid flatlay

  // CANVAS STATE
  final List<CanvasItem> _canvasItems = [];
  final List<List<CanvasItem>> _history = [];
  CanvasItem? _selectedItem;

  double _initialScale = 1.0;
  double _initialRotation = 0.0;
  Offset _initialFocalPoint = Offset.zero;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _topsController.dispose();
    _bottomsController.dispose();
    _shoesController.dispose();
    super.dispose();
  }

  void _saveHistory() {
    _history.add(_canvasItems.map((item) => item.copy()).toList());
    if (_history.length > 20) {
      _history.removeAt(0);
    }
  }

  void _undo() {
    if (_history.isEmpty) return;
    setState(() {
      _canvasItems.clear();
      _canvasItems.addAll(_history.removeLast());
      _selectedItem = null;
    });
  }

  void _clearCanvas() {
    if (_canvasItems.isEmpty) return;
    _saveHistory();
    setState(() {
      _canvasItems.clear();
      _selectedItem = null;
    });
  }

  // Shuffle dress me combinations
  void _shuffleCombinations(List<Product> tops, List<Product> bottoms, List<Product> shoes) {
    final random = math.Random();
    setState(() {
      if (!_isTopPinned && tops.length > 1) {
        _selectedTopIndex = random.nextInt(tops.length);
        _topsController.animateToPage(_selectedTopIndex, duration: const Duration(milliseconds: 300), curve: Curves.easeOut);
      }
      if (!_isBottomPinned && bottoms.length > 1) {
        _selectedBottomIndex = random.nextInt(bottoms.length);
        _bottomsController.animateToPage(_selectedBottomIndex, duration: const Duration(milliseconds: 300), curve: Curves.easeOut);
      }
      if (!_isShoesPinned && shoes.length > 1) {
        _selectedShoesIndex = random.nextInt(shoes.length);
        _shoesController.animateToPage(_selectedShoesIndex, duration: const Duration(milliseconds: 300), curve: Curves.easeOut);
      }
    });
  }

  // Triggered when saving from Dress Me or Canvas
  void _showSaveOutfitDialog(BuildContext context, List<Product> products, {List<CanvasItem>? canvasLayoutSource}) {
    if (products.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Cannot save an empty outfit!')),
      );
      return;
    }

    final nameController = TextEditingController(
      text: 'Outfit ${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}',
    );

    bool shareToCommunity = false;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setState) {
          return AlertDialog(
            backgroundColor: AppTheme.surfaceColor,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            title: const Text('Save Outfit Look', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Give your new look a style name to organize it in your Moodboard.',
                  style: TextStyle(fontSize: 12, color: Colors.grey),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: nameController,
                  decoration: InputDecoration(
                    labelText: 'Outfit Name',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
                const SizedBox(height: 12),
                CheckboxListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('Share to Community Feed', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                  subtitle: const Text('Let others try this on and see your style creation!', style: TextStyle(fontSize: 9)),
                  value: shareToCommunity,
                  activeColor: AppTheme.primaryColor,
                  onChanged: (val) {
                    setState(() {
                      shareToCommunity = val ?? false;
                    });
                  },
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(ctx),
                child: const Text('Cancel'),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryColor,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                onPressed: () async {
                  final provider = Provider.of<TryOnProvider>(context, listen: false);
                  
                  final List<Map<String, dynamic>>? layoutJson = canvasLayoutSource == null
                      ? null
                      : canvasLayoutSource.map((item) => {
                          'productId': item.product.id,
                          'dx': item.position.dx,
                          'dy': item.position.dy,
                          'scale': item.scale,
                          'rotation': item.rotation,
                        }).toList();

                  final newOutfit = Outfit(
                    id: 'outfit_${DateTime.now().millisecondsSinceEpoch}',
                    name: nameController.text.trim(),
                    productIds: products.map((p) => p.id).toList(),
                    dateCreated: DateTime.now().toIso8601String(),
                    canvasLayout: layoutJson,
                  );
                  await provider.saveOutfit(newOutfit);
                  if (shareToCommunity) {
                    await provider.shareOutfitToCommunity(newOutfit);
                  }
                  Navigator.pop(ctx);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Saved "${newOutfit.name}"${shareToCommunity ? ' and shared to Community!' : ' successfully!'}'),
                      action: SnackBarAction(
                        label: 'SCHEDULE',
                        textColor: AppTheme.primaryColor,
                        onPressed: () => _showCalendarScheduleSheet(context, newOutfit.id),
                      ),
                    ),
                  );
                },
                child: const Text('Save Look', style: TextStyle(color: Colors.white)),
              ),
            ],
          );
        }
      ),
    );
  }

  void _showCalendarScheduleSheet(BuildContext context, String outfitId) {
    final provider = Provider.of<TryOnProvider>(context, listen: false);
    final today = DateTime.now();
    
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.surfaceColor,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Schedule Outfit',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textColorPrimary),
            ),
            const SizedBox(height: 8),
            Text(
              'Pick a date to schedule this look on your calendar dashboard.',
              style: TextStyle(fontSize: 12, color: Colors.grey[600]),
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 120,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: 14,
                itemBuilder: (context, index) {
                  final date = today.add(Duration(days: index));
                  final dateStr = '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
                  final isScheduled = provider.scheduledOutfits.containsKey(dateStr);
                  
                  final weekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][date.weekday - 1];
                  
                  return GestureDetector(
                    onTap: () async {
                      await provider.scheduleOutfit(dateStr, outfitId);
                      Navigator.pop(ctx);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Scheduled outfit for $weekday, ${date.day}/${date.month}!')),
                      );
                    },
                    child: Container(
                      width: 80,
                      margin: const EdgeInsets.only(right: 12),
                      decoration: BoxDecoration(
                        color: isScheduled ? Colors.grey[200] : AppTheme.primaryColor.withOpacity(0.06),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isScheduled ? Colors.grey[300]! : AppTheme.primaryColor.withOpacity(0.2),
                        ),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(weekday, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey[600])),
                          const SizedBox(height: 6),
                          Text('${date.day}', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppTheme.textColorPrimary)),
                          const SizedBox(height: 4),
                          if (isScheduled)
                            const Icon(Icons.check_circle, size: 12, color: Colors.grey)
                          else
                            const Text('Select', style: TextStyle(fontSize: 10, color: AppTheme.primaryColor, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  // Slides open the wardrobe add drawer in Canvas tab
  void _showAddItemsDrawer(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppTheme.surfaceColor,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (dialogCtx, setSheetState) {
            final provider = Provider.of<TryOnProvider>(context);
            // Only show user's custom uploaded items
            final allItems = provider.customGarments;
            
            return DraggableScrollableSheet(
              initialChildSize: 0.65,
              maxChildSize: 0.9,
              minChildSize: 0.4,
              expand: false,
              builder: (context, scrollController) {
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: Column(
                    children: [
                      Center(
                        child: Container(
                          width: 40,
                          height: 4,
                          margin: const EdgeInsets.symmetric(vertical: 12),
                          decoration: BoxDecoration(
                            color: AppTheme.borderColor,
                            borderRadius: BorderRadius.circular(2),
                          ),
                        ),
                      ),
                      const Text(
                        'Add to Canvas',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textColorPrimary),
                      ),
                      const SizedBox(height: 12),
                      
                      // UPLOAD NEW BUTTON
                      InkWell(
                        onTap: () async {
                          final picker = ImagePicker();
                          final image = await picker.pickImage(source: ImageSource.gallery);
                          if (image != null) {
                            Navigator.pop(ctx);
                            // Process and auto-save via standard SavedScreen bottom sheet setup!
                            // Here we directly prompt dialog to save it
                            setState(() {
                              _isProcessingNewUpload = true;
                            });
                            try {
                              final processed = await removeGarmentBackground(image.path);
                              final newProduct = Product(
                                id: 'custom_${DateTime.now().millisecondsSinceEpoch}',
                                name: 'Closet ${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}',
                                price: 0.0,
                                imageUrl: processed,
                                category: 'tops',
                                description: 'Uploaded via Canvas',
                              );
                              await provider.addCustomGarment(
                                name: newProduct.name,
                                imagePath: image.path,
                                category: 'tops',
                                brand: 'Custom',
                                season: 'All',
                                occasion: 'Casual',
                                colors: ['White'],
                              );
                              setState(() {
                                _canvasItems.add(CanvasItem(
                                  product: provider.customGarments.last,
                                  position: const Offset(150, 200),
                                ));
                                _isProcessingNewUpload = false;
                              });
                            } catch (_) {
                              setState(() {
                                _isProcessingNewUpload = false;
                              });
                            }
                          }
                        },
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: AppTheme.primaryColor.withOpacity(0.06),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppTheme.primaryColor.withOpacity(0.12)),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: const [
                              Icon(Icons.add_a_photo, color: AppTheme.primaryColor, size: 18),
                              SizedBox(width: 8),
                              Text(
                                'Upload & Cutout New Garment',
                                style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primaryColor, fontSize: 12),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      
                      Expanded(
                        child: GridView.builder(
                          controller: scrollController,
                          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 3,
                            crossAxisSpacing: 10,
                            mainAxisSpacing: 10,
                            childAspectRatio: 0.75,
                          ),
                          itemCount: allItems.length,
                          itemBuilder: (context, idx) {
                            final product = allItems[idx];
                            final isCustom = product.id.startsWith('custom_');
                            
                            return GestureDetector(
                              onTap: () {
                                _saveHistory();
                                setState(() {
                                  _canvasItems.add(CanvasItem(
                                    product: product,
                                    position: const Offset(150, 180),
                                  ));
                                  _selectedItem = _canvasItems.last;
                                });
                                Navigator.pop(ctx);
                              },
                              child: Card(
                                elevation: 0,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                  side: BorderSide(color: AppTheme.borderColor),
                                ),
                                child: ClipRRect(
                                  borderRadius: BorderRadius.circular(12),
                                  child: isCustom
                                      ? Image.file(File(product.imageUrl), fit: BoxFit.cover)
                                      : ProductImage(imagePath: product.imageUrl, fit: BoxFit.cover),
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                    ],
                  ),
                );
              },
            );
          }
        );
      },
    );
  }

  bool _isProcessingNewUpload = false;

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<TryOnProvider>(context);

    // Filter categories for shuffler using ONLY custom items
    final allProducts = provider.customGarments;
    final tops = allProducts.where((p) => p.category.toLowerCase() == 'tops' || p.category.toLowerCase() == 'shirts').toList();
    final bottoms = allProducts.where((p) => p.category.toLowerCase() == 'bottoms' || p.category.toLowerCase() == 'pants').toList();
    final shoes = allProducts.where((p) => p.category.toLowerCase() == 'one-pieces' || p.category.toLowerCase() == 'shoes').toList();

    // Placeholder definitions to prevent shuffler from throwing RangeError or displaying empty tabs
    final dummyTopPlaceholder = Product(
      id: 'placeholder_top',
      name: 'No Tops Yet',
      description: 'Upload shirts in wardrobe to style',
      price: 0,
      imageUrl: '',
      category: 'tops',
    );
    final dummyBottomPlaceholder = Product(
      id: 'placeholder_bottom',
      name: 'No Bottoms Yet',
      description: 'Upload pants in wardrobe to style',
      price: 0,
      imageUrl: '',
      category: 'bottoms',
    );
    final dummyShoesPlaceholder = Product(
      id: 'placeholder_shoes',
      name: 'No Shoes Yet',
      description: 'Upload footwear in wardrobe to style',
      price: 0,
      imageUrl: '',
      category: 'shoes',
    );

    final displayTops = tops.isEmpty ? [dummyTopPlaceholder] : tops;
    final displayBottoms = bottoms.isEmpty ? [dummyBottomPlaceholder] : bottoms;
    final displayShoes = shoes.isEmpty ? [dummyShoesPlaceholder] : shoes;

    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        backgroundColor: AppTheme.backgroundColor,
        elevation: 0,
        centerTitle: true,
        title: const Text(
          'STYLING WORKBENCH',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, letterSpacing: 1.5, color: AppTheme.textColorPrimary),
        ),
      ),
      body: Column(
        children: [
          Container(
            color: AppTheme.surfaceColor,
            child: TabBar(
              controller: _tabController,
              indicatorColor: AppTheme.primaryColor,
              labelColor: AppTheme.primaryColor,
              unselectedLabelColor: Colors.grey,
              labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, letterSpacing: 0.5),
              tabs: const [
                Tab(text: 'DRESS ME'),
                Tab(text: 'CANVAS'),
                Tab(text: 'MOODBOARD'),
              ],
            ),
          ),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              physics: const NeverScrollableScrollPhysics(), // Prevent swipe to make canvas gestures easier
              children: [
                // 1. DRESS ME WORKBENCH
                _buildDressMeTab(displayTops, displayBottoms, displayShoes),

                // 2. INTERACTIVE CANVAS WORKSPACE
                _buildCanvasTab(),

                // 3. MOODBOARD LOOKS CATALOG
                _buildMoodboardTab(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDressMeTab(List<Product> tops, List<Product> bottoms, List<Product> shoes) {
    final provider = Provider.of<TryOnProvider>(context, listen: false);
    if (provider.customGarments.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.style_outlined, color: Colors.grey[400], size: 64),
            const SizedBox(height: 16),
            const Text(
              'Add items to your wardrobe first!',
              style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey),
            ),
          ],
        ),
      );
    }

    final safeTopIndex = _selectedTopIndex < tops.length ? _selectedTopIndex : 0;
    final safeBottomIndex = _selectedBottomIndex < bottoms.length ? _selectedBottomIndex : 0;
    final safeShoesIndex = _selectedShoesIndex < shoes.length ? _selectedShoesIndex : 0;

    final selectedTop = tops[safeTopIndex];
    final selectedBottom = bottoms[safeBottomIndex];
    final selectedShoes = shoes[safeShoesIndex];

    return Column(
      children: [
        // TOP CONTROL CARD (Layout switches and Neon Save Look button)
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              IconButton(
                icon: Icon(_isGridView ? Icons.view_agenda_outlined : Icons.grid_view_outlined, color: AppTheme.textColorPrimary),
                onPressed: () {
                  setState(() {
                    _isGridView = !_isGridView;
                  });
                },
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFCCFF00), // Whering neon yellow
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  elevation: 0,
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 10),
                ),
                onPressed: () => _showSaveOutfitDialog(context, [selectedTop, selectedBottom, selectedShoes]),
                child: const Text(
                  'Save Look',
                  style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 12),
                ),
              ),
            ],
          ),
        ),

        Expanded(
          child: _isGridView
              ? _buildDressMeGridView(selectedTop, selectedBottom, selectedShoes)
              : _buildDressMeSlotsView(tops, bottoms, shoes),
        ),

        // SHUFFLE CONTROLS PANEL
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: AppTheme.surfaceColor,
            border: Border(top: BorderSide(color: AppTheme.borderColor)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              // Pin states indicator
              Column(
                children: [
                  const Text('LOCKS', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey)),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      _buildPinIndicator('Top', _isTopPinned, () => setState(() => _isTopPinned = !_isTopPinned)),
                      const SizedBox(width: 8),
                      _buildPinIndicator('Bottom', _isBottomPinned, () => setState(() => _isBottomPinned = !_isBottomPinned)),
                      const SizedBox(width: 8),
                      _buildPinIndicator('Shoes', _isShoesPinned, () => setState(() => _isShoesPinned = !_isShoesPinned)),
                    ],
                  ),
                ],
              ),

              // Dice Shuffle Action Button
              GestureDetector(
                onTap: () => _shuffleCombinations(tops, bottoms, shoes),
                child: Container(
                  height: 64,
                  width: 64,
                  decoration: const BoxDecoration(
                    color: Colors.black,
                    shape: BoxShape.circle,
                    boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10, offset: Offset(0, 5))],
                  ),
                  child: const Center(
                    child: Text('🎲', style: TextStyle(fontSize: 28)),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildPinIndicator(String label, bool isPinned, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: isPinned ? AppTheme.primaryColor.withOpacity(0.12) : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isPinned ? AppTheme.primaryColor : Colors.grey[300]!,
          ),
        ),
        child: Text(
          '$label ${isPinned ? '🔒' : '🔓'}',
          style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.bold,
            color: isPinned ? AppTheme.primaryColor : Colors.grey[700],
          ),
        ),
      ),
    );
  }

  Widget _buildDressMeGridView(Product top, Product bottom, Product shoe) {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Card(
        color: AppTheme.surfaceColor,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: BorderSide(color: AppTheme.borderColor),
        ),
        child: Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Expanded(
                child: Row(
                  children: [
                    Expanded(child: _buildItemImage(top)),
                    const SizedBox(width: 12),
                    Expanded(child: _buildItemImage(bottom)),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Expanded(
                child: Center(
                  child: FractionallySizedBox(
                    widthFactor: 0.6,
                    child: _buildItemImage(shoe),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDressMeSlotsView(List<Product> tops, List<Product> bottoms, List<Product> shoes) {
    return Column(
      children: [
        // TOPS SLOT
        Expanded(
          child: PageView.builder(
            controller: _topsController,
            onPageChanged: (idx) => setState(() => _selectedTopIndex = idx),
            itemCount: tops.length,
            itemBuilder: (ctx, idx) => _buildSlotCard(tops[idx], _isTopPinned, () => setState(() => _isTopPinned = !_isTopPinned)),
          ),
        ),
        Container(height: 1, color: AppTheme.borderColor.withOpacity(0.5)),

        // BOTTOMS SLOT
        Expanded(
          child: PageView.builder(
            controller: _bottomsController,
            onPageChanged: (idx) => setState(() => _selectedBottomIndex = idx),
            itemCount: bottoms.length,
            itemBuilder: (ctx, idx) => _buildSlotCard(bottoms[idx], _isBottomPinned, () => setState(() => _isBottomPinned = !_isBottomPinned)),
          ),
        ),
        Container(height: 1, color: AppTheme.borderColor.withOpacity(0.5)),

        // SHOES SLOT
        Expanded(
          child: PageView.builder(
            controller: _shoesController,
            onPageChanged: (idx) => setState(() => _selectedShoesIndex = idx),
            itemCount: shoes.length,
            itemBuilder: (ctx, idx) => _buildSlotCard(shoes[idx], _isShoesPinned, () => setState(() => _isShoesPinned = !_isShoesPinned)),
          ),
        ),
      ],
    );
  }

  Widget _buildSlotCard(Product product, bool isPinned, VoidCallback onPinTap) {
    return AnimatedBuilder(
      animation: Listenable.merge([_topsController, _bottomsController, _shoesController]),
      builder: (context, child) {
        return Container(
          margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
          decoration: BoxDecoration(
            color: AppTheme.surfaceColor,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 8, offset: const Offset(0, 4))],
          ),
          child: Stack(
            children: [
              Center(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: _buildItemImage(product),
                ),
              ),
              Positioned(
                top: 8,
                right: 8,
                child: IconButton(
                  icon: Icon(isPinned ? Icons.push_pin : Icons.push_pin_outlined, color: isPinned ? AppTheme.primaryColor : Colors.grey),
                  onPressed: onPinTap,
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildItemImage(Product product) {
    if (product.id.startsWith('placeholder_')) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.add_photo_alternate_outlined, color: Colors.grey[400], size: 36),
            const SizedBox(height: 8),
            Text(
              product.name,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.grey),
            ),
            const SizedBox(height: 4),
            Text(
              product.description,
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 9, color: Colors.grey[500]),
            ),
          ],
        ),
      );
    }
    final isCustom = product.id.startsWith('custom_');
    if (isCustom) {
      return Image.file(File(product.imageUrl), fit: BoxFit.contain);
    }
    return ProductImage(imagePath: product.imageUrl, fit: BoxFit.contain);
  }

  Widget _buildOutfitThumbnail(Outfit outfit, List<Product> allItems) {
    if (outfit.canvasLayout != null && outfit.canvasLayout!.isNotEmpty) {
      return Container(
        color: Colors.white,
        child: ClipRRect(
          borderRadius: BorderRadius.circular(12),
          child: LayoutBuilder(
            builder: (context, constraints) {
              return Stack(
                children: outfit.canvasLayout!.map((itemMap) {
                  final productId = itemMap['productId'] as String;
                  final dx = (itemMap['dx'] as num).toDouble();
                  final dy = (itemMap['dy'] as num).toDouble();
                  final scale = (itemMap['scale'] as num).toDouble();
                  final rotation = (itemMap['rotation'] as num).toDouble();

                  Product? product;
                  try {
                    product = allItems.firstWhere((p) => p.id == productId);
                  } catch (_) {}

                  if (product == null) return const SizedBox.shrink();

                  final rx = dx - 150;
                  final ry = dy - 180;

                  final cx = constraints.maxWidth / 2 + rx * 0.38;
                  final cy = constraints.maxHeight / 2 + ry * 0.38;

                  final itemWidth = 80.0 * scale * 0.9;
                  final itemHeight = 80.0 * scale * 0.9;

                  return Positioned(
                    left: cx - itemWidth / 2,
                    top: cy - itemHeight / 2,
                    child: Transform.rotate(
                      angle: rotation,
                      child: SizedBox(
                        width: itemWidth,
                        height: itemHeight,
                        child: _buildItemImage(product),
                      ),
                    ),
                  );
                }).toList(),
              );
            },
          ),
        ),
      );
    }

    final outfitProducts = outfit.productIds.map((id) {
      return allItems.firstWhere((p) => p.id == id, orElse: () => Product.dummyProducts.first);
    }).toList();

    return Row(
      children: [
        if (outfitProducts.isNotEmpty)
          Expanded(child: _buildItemImage(outfitProducts[0])),
        if (outfitProducts.length > 1) ...[
          const SizedBox(width: 6),
          Expanded(child: _buildItemImage(outfitProducts[1])),
        ],
      ],
    );
  }

  // 2. CANVAS WORKSPACE
  Widget _buildCanvasTab() {
    return Column(
      children: [
        if (_isProcessingNewUpload)
          LinearProgressIndicator(color: AppTheme.primaryColor, backgroundColor: AppTheme.primaryColor.withOpacity(0.1)),
          
        Expanded(
          child: Stack(
            children: [
              // CANVAS WORKSPACE GRIDBOARD
              GestureDetector(
                onTap: () {
                  setState(() {
                    _selectedItem = null;
                  });
                },
                onScaleStart: (details) {
                  if (_selectedItem == null || _selectedItem!.isLocked) return;
                  _initialScale = _selectedItem!.scale;
                  _initialRotation = _selectedItem!.rotation;
                  _initialFocalPoint = details.localFocalPoint;
                },
                onScaleUpdate: (details) {
                  if (_selectedItem == null || _selectedItem!.isLocked) return;
                  setState(() {
                    _selectedItem!.scale = math.max(0.2, math.min(_initialScale * details.scale, 5.0));
                    _selectedItem!.rotation = _initialRotation + details.rotation;
                    
                    final delta = details.localFocalPoint - _initialFocalPoint;
                    _selectedItem!.position += delta;
                    _initialFocalPoint = details.localFocalPoint;
                  });
                },
                child: Container(
                  color: Colors.white,
                  child: GridPaper(
                    color: Colors.grey[100]!,
                    divisions: 1,
                    subdivisions: 1,
                    interval: 20,
                    child: Stack(
                      children: _canvasItems.map((item) {
                        final isSelected = _selectedItem == item;
                        
                        return Positioned(
                          left: item.position.dx - 100,
                          top: item.position.dy - 100,
                          child: GestureDetector(
                            onTap: () {
                              setState(() {
                                _selectedItem = item;
                              });
                            },
                            child: Transform.translate(
                              offset: Offset.zero,
                              child: Transform.rotate(
                                angle: item.rotation,
                                child: Transform.scale(
                                  scale: item.scale,
                                  child: Container(
                                    height: 200,
                                    width: 200,
                                    decoration: BoxDecoration(
                                      border: isSelected
                                          ? Border.all(color: Colors.purple.withOpacity(0.6), width: 2)
                                          : null,
                                    ),
                                    child: Padding(
                                      padding: const EdgeInsets.all(8.0),
                                      child: _buildItemImage(item.product),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ),
              ),

              // FLOATING VERTICAL LAYER CONTROLS (Right Side)
              if (_selectedItem != null)
                Positioned(
                  top: 20,
                  right: 16,
                  child: Card(
                    color: AppTheme.surfaceColor,
                    elevation: 8,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 4.0),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          _buildCanvasToolButton(
                            icon: Icons.vertical_align_top,
                            tooltip: 'Bring to Front',
                            onTap: () {
                              setState(() {
                                final idx = _canvasItems.indexOf(_selectedItem!);
                                if (idx != -1 && idx < _canvasItems.length - 1) {
                                  _saveHistory();
                                  _canvasItems.removeAt(idx);
                                  _canvasItems.add(_selectedItem!);
                                }
                              });
                            },
                          ),
                          _buildCanvasToolButton(
                            icon: Icons.vertical_align_bottom,
                            tooltip: 'Send to Back',
                            onTap: () {
                              setState(() {
                                final idx = _canvasItems.indexOf(_selectedItem!);
                                if (idx > 0) {
                                  _saveHistory();
                                  _canvasItems.removeAt(idx);
                                  _canvasItems.insert(0, _selectedItem!);
                                }
                              });
                            },
                          ),
                          _buildCanvasToolButton(
                            icon: Icons.copy,
                            tooltip: 'Duplicate',
                            onTap: () {
                              setState(() {
                                _saveHistory();
                                final copy = _selectedItem!.copy();
                                copy.position += const Offset(20, 20);
                                _canvasItems.add(copy);
                                _selectedItem = copy;
                              });
                            },
                          ),
                          _buildCanvasToolButton(
                            icon: _selectedItem!.isLocked ? Icons.lock : Icons.lock_open,
                            tooltip: _selectedItem!.isLocked ? 'Unlock' : 'Lock',
                            onTap: () {
                              setState(() {
                                _selectedItem!.isLocked = !_selectedItem!.isLocked;
                              });
                            },
                          ),
                          const Divider(height: 10, thickness: 1),
                          _buildCanvasToolButton(
                            icon: Icons.delete_outline,
                            color: Colors.red,
                            tooltip: 'Delete',
                            onTap: () {
                              setState(() {
                                _saveHistory();
                                _canvasItems.remove(_selectedItem);
                                _selectedItem = null;
                              });
                            },
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),

        // BOTTOM TOOLBAR
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          decoration: BoxDecoration(
            color: AppTheme.surfaceColor,
            border: Border(top: BorderSide(color: AppTheme.borderColor)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  IconButton(
                    icon: const Icon(Icons.undo, color: AppTheme.textColorPrimary),
                    onPressed: _history.isNotEmpty ? _undo : null,
                  ),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFCCFF00),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                    ),
                    onPressed: () => _showSaveOutfitDialog(
                      context,
                      _canvasItems.map((item) => item.product).toList(),
                      canvasLayoutSource: _canvasItems,
                    ),
                    child: const Text('Save Outfit', style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold)),
                  ),
                  IconButton(
                    icon: const Icon(Icons.restart_alt, color: AppTheme.textColorPrimary),
                    onPressed: _canvasItems.isNotEmpty ? _clearCanvas : null,
                  ),
                ],
              ),
              const SizedBox(height: 8),
              
              // Add Items Slide-up bar
              GestureDetector(
                onTap: () => _showAddItemsDrawer(context),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 10),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.04),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: const [
                      Icon(Icons.keyboard_arrow_up, color: Colors.grey, size: 20),
                      SizedBox(width: 4),
                      Text(
                        'Add Closet Items',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.grey),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildCanvasToolButton({
    required IconData icon,
    required String tooltip,
    required VoidCallback onTap,
    Color color = AppTheme.textColorPrimary,
  }) {
    return IconButton(
      icon: Icon(icon, color: color, size: 20),
      tooltip: tooltip,
      onPressed: onTap,
    );
  }

  // 3. MOODBOARD LOOKS LIST
  Widget _buildMoodboardTab() {
    final provider = Provider.of<TryOnProvider>(context);
    final outfits = provider.savedOutfits;

    if (outfits.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.dashboard_customize_outlined, color: Colors.grey[400], size: 64),
            const SizedBox(height: 16),
            const Text(
              'No saved outfits yet!',
              style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey),
            ),
            const SizedBox(height: 8),
            Text(
              'Design outfits in Dress Me or Canvas to save them here.',
              style: TextStyle(fontSize: 12, color: Colors.grey[500]),
            ),
          ],
        ),
      );
    }

    final allItems = provider.customGarments;

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: GridView.builder(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
          childAspectRatio: 0.85,
        ),
        itemCount: outfits.length,
        itemBuilder: (ctx, idx) {
          final outfit = outfits[idx];
          
          // Get products in this outfit
          final outfitProducts = outfit.productIds.map((id) {
            return allItems.firstWhere((p) => p.id == id, orElse: () => Product.dummyProducts.first);
          }).toList();

          return Card(
            color: AppTheme.surfaceColor,
            elevation: 0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
              side: BorderSide(color: AppTheme.borderColor),
            ),
            child: Stack(
              children: [
                Padding(
                  padding: const EdgeInsets.all(12.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: _buildOutfitThumbnail(outfit, allItems),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        outfit.name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.textColorPrimary),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        '${outfitProducts.length} Items',
                        style: TextStyle(fontSize: 10, color: Colors.grey[600]),
                      ),
                    ],
                  ),
                ),
                Positioned(
                  top: 4,
                  right: 4,
                  child: PopupMenuButton<String>(
                    onSelected: (val) async {
                      if (val == 'delete') {
                        await provider.deleteOutfit(outfit.id);
                      } else if (val == 'schedule') {
                        _showCalendarScheduleSheet(context, outfit.id);
                      }
                    },
                    itemBuilder: (context) => const [
                      PopupMenuItem(value: 'schedule', child: Text('Schedule Look')),
                      PopupMenuItem(value: 'delete', child: Text('Delete Look', style: TextStyle(color: Colors.red))),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
