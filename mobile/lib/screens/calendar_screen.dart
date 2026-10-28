import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../theme/app_theme.dart';
import '../models/product.dart';
import '../providers/tryon_provider.dart';
import '../widgets/product_image.dart';
import 'tryon_screen.dart';

class CalendarScreen extends StatefulWidget {
  const CalendarScreen({super.key});

  @override
  State<CalendarScreen> createState() => _CalendarScreenState();
}

class _CalendarScreenState extends State<CalendarScreen> {
  DateTime _focusedMonth = DateTime.now();
  DateTime _selectedDate = DateTime.now();

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<TryOnProvider>(context);
    final selectedDateStr = _getDateString(_selectedDate);
    final scheduledOutfitId = provider.scheduledOutfits[selectedDateStr];

    final allItems = provider.customGarments;
    Outfit? scheduledOutfit;
    if (scheduledOutfitId != null) {
      try {
        scheduledOutfit = provider.savedOutfits.firstWhere((o) => o.id == scheduledOutfitId);
      } catch (_) {}
    }

    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        backgroundColor: AppTheme.backgroundColor,
        elevation: 0,
        centerTitle: true,
        title: const Text(
          'OUTFIT CALENDAR',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, letterSpacing: 1.5, color: AppTheme.textColorPrimary),
        ),
      ),
      body: Column(
        children: [
          // MONTH NAVIGATION ROW
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: const Icon(Icons.chevron_left, color: AppTheme.textColorPrimary),
                  onPressed: () {
                    setState(() {
                      _focusedMonth = DateTime(_focusedMonth.year, _focusedMonth.month - 1);
                    });
                  },
                ),
                Text(
                  _getMonthName(_focusedMonth).toUpperCase(),
                  style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 15, letterSpacing: 1.0, color: AppTheme.textColorPrimary),
                ),
                IconButton(
                  icon: const Icon(Icons.chevron_right, color: AppTheme.textColorPrimary),
                  onPressed: () {
                    setState(() {
                      _focusedMonth = DateTime(_focusedMonth.year, _focusedMonth.month + 1);
                    });
                  },
                ),
              ],
            ),
          ),

          // CALENDAR DAYS GRIDBOARD
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: _buildCalendarGrid(provider),
          ),
          const SizedBox(height: 20),

          // SCHEDULED OUTFIT DETAIL VIEWER
          Expanded(
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppTheme.surfaceColor,
                borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
                border: Border(top: BorderSide(color: AppTheme.borderColor)),
              ),
              child: SingleChildScrollView(
                child: scheduledOutfit != null
                    ? _buildOutfitDetailsCard(context, provider, scheduledOutfit, allItems)
                    : _buildEmptyScheduleCard(context, provider),
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _getDateString(DateTime date) {
    return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
  }

  String _getMonthName(DateTime date) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return '${months[date.month - 1]} ${date.year}';
  }

  Widget _buildCalendarGrid(TryOnProvider provider) {
    final allItems = provider.customGarments;
    // Days in current focused month
    final firstDayOfMonth = DateTime(_focusedMonth.year, _focusedMonth.month, 1);
    final lastDayOfMonth = DateTime(_focusedMonth.year, _focusedMonth.month + 1, 0);

    final offsetDays = firstDayOfMonth.weekday - 1; // Days from previous month to align layout
    final totalDays = lastDayOfMonth.day;

    final List<Widget> dayWidgets = [];

    // Weekdays headers
    const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    for (var w in weekdays) {
      dayWidgets.add(
        Center(
          child: Text(
            w,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Colors.grey),
          ),
        ),
      );
    }

    // Offset empty spaces
    for (int i = 0; i < offsetDays; i++) {
      dayWidgets.add(const SizedBox());
    }

    // Days numbers
    for (int day = 1; day <= totalDays; day++) {
      final date = DateTime(_focusedMonth.year, _focusedMonth.month, day);
      final dateStr = _getDateString(date);
      final isSelected = date.year == _selectedDate.year && date.month == _selectedDate.month && date.day == _selectedDate.day;
      final hasOutfit = provider.scheduledOutfits.containsKey(dateStr);

      Outfit? dayOutfit;
      if (hasOutfit) {
        final outfitId = provider.scheduledOutfits[dateStr];
        try {
          dayOutfit = provider.savedOutfits.firstWhere((o) => o.id == outfitId);
        } catch (_) {}
      }

      dayWidgets.add(
        GestureDetector(
          onTap: () {
            setState(() {
              _selectedDate = date;
            });
          },
          child: Container(
            margin: const EdgeInsets.all(2),
            decoration: BoxDecoration(
              color: isSelected
                  ? AppTheme.primaryColor.withOpacity(0.12)
                  : Colors.transparent,
              borderRadius: BorderRadius.circular(12),
              border: isSelected
                  ? Border.all(color: AppTheme.primaryColor, width: 1.5)
                  : null,
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Text(
                  '$day',
                  style: TextStyle(
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                    color: isSelected ? AppTheme.primaryColor : AppTheme.textColorPrimary,
                    fontSize: 12,
                  ),
                ),
                if (dayOutfit != null)
                  SizedBox(
                    height: 34,
                    width: 34,
                    child: _buildMiniCollage(dayOutfit, allItems),
                  )
                else
                  const SizedBox(height: 34),
              ],
            ),
          ),
        ),
      );
    }

    return GridView.count(
      shrinkWrap: true,
      crossAxisCount: 7,
      childAspectRatio: 0.65,
      physics: const NeverScrollableScrollPhysics(),
      children: dayWidgets,
    );
  }

  Widget _buildEmptyScheduleCard(BuildContext context, TryOnProvider provider) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const SizedBox(height: 12),
        Icon(Icons.calendar_today_outlined, color: Colors.grey[400], size: 48),
        const SizedBox(height: 14),
        const Text(
          'No Look Planned Today',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.textColorPrimary),
        ),
        const SizedBox(height: 6),
        Text(
          'Plan ahead what you wear to look stunning everyday.',
          style: TextStyle(color: Colors.grey[600], fontSize: 12),
        ),
        const SizedBox(height: 20),
        ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: const Color(0xFFCCFF00), // Neon Yellow
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
            elevation: 0,
          ),
          onPressed: () => _showOutfitSelectorSheet(context, provider),
          child: const Text(
            'Schedule Outfit',
            style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
          ),
        ),
      ],
    );
  }

  Widget _buildOutfitDetailsCard(
    BuildContext context,
    TryOnProvider provider,
    Outfit outfit,
    List<Product> allItems,
  ) {
    final outfitProducts = outfit.productIds.map((id) {
      return allItems.firstWhere((p) => p.id == id, orElse: () => Product.dummyProducts.first);
    }).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  outfit.name.toUpperCase(),
                  style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 15, color: AppTheme.textColorPrimary),
                ),
                const SizedBox(height: 2),
                Text(
                  'Planned Outfit',
                  style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.grey[500]),
                ),
              ],
            ),
            Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.edit_calendar, color: Colors.grey),
                  onPressed: () => _showOutfitSelectorSheet(context, provider),
                ),
                IconButton(
                  icon: const Icon(Icons.delete_sweep_outlined, color: Colors.red),
                  onPressed: () async {
                    await provider.unscheduleOutfit(_getDateString(_selectedDate));
                  },
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: 16),

        if (outfit.canvasLayout != null && outfit.canvasLayout!.isNotEmpty) ...[
          Container(
            height: 160,
            width: double.infinity,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppTheme.borderColor),
            ),
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: _buildOutfitThumbnail(outfit, allItems),
            ),
          ),
          const SizedBox(height: 16),
        ],

        // Products lists
        SizedBox(
          height: 120,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: outfitProducts.length,
            itemBuilder: (ctx, idx) {
              final product = outfitProducts[idx];
              final isCustom = product.id.startsWith('custom_');
              
              return Container(
                width: 90,
                margin: const EdgeInsets.only(right: 12),
                decoration: BoxDecoration(
                  color: AppTheme.backgroundColor,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.borderColor),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(16),
                  child: Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: isCustom
                        ? Image.file(File(product.imageUrl), fit: BoxFit.contain)
                        : ProductImage(imagePath: product.imageUrl, fit: BoxFit.contain),
                  ),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 24),

        // TRY ON SCHEDULED LOOK BUTTON
        SizedBox(
          width: double.infinity,
          height: 50,
          child: ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primaryColor,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              elevation: 0,
            ),
            onPressed: () {
              // Pre-load items to VTON screen and navigate to VTON screen tab
              // We can pass selection parameters to TryOnScreen.
              // To do this simply, we navigate using standard tab controller index,
              // or open the TryOnScreen inside the Navigator stack!
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => TryOnScreen(preSelectedOutfit: outfitProducts),
                ),
              );
            },
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: const [
                Icon(Icons.face_retouching_natural, color: Colors.white, size: 18),
                SizedBox(width: 8),
                Text(
                  'TRY ON THIS LOOK',
                  style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.0, color: Colors.white),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  void _showOutfitSelectorSheet(BuildContext context, TryOnProvider provider) {
    if (provider.savedOutfits.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('No saved outfits! Design an outfit look in styling first.')),
      );
      return;
    }

    final allItems = provider.customGarments;

    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.surfaceColor,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Select Outfit Look',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textColorPrimary),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: ListView.builder(
                itemCount: provider.savedOutfits.length,
                itemBuilder: (context, index) {
                  final outfit = provider.savedOutfits[index];
                  final firstProduct = allItems.firstWhere((p) => p.id == outfit.productIds.first, orElse: () => Product.dummyProducts.first);
                  final isCustom = firstProduct.id.startsWith('custom_');

                  return ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: Container(
                      height: 50,
                      width: 50,
                      decoration: BoxDecoration(
                        color: AppTheme.backgroundColor,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(4.0),
                        child: isCustom
                            ? Image.file(File(firstProduct.imageUrl), fit: BoxFit.contain)
                            : ProductImage(imagePath: firstProduct.imageUrl, fit: BoxFit.contain),
                      ),
                    ),
                    title: Text(outfit.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    subtitle: Text('${outfit.productIds.length} Items', style: const TextStyle(fontSize: 11)),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () async {
                      await provider.scheduleOutfit(_getDateString(_selectedDate), outfit.id);
                      Navigator.pop(ctx);
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildItemImage(Product product) {
    if (product.id.startsWith('placeholder_')) {
      return Center(
        child: Icon(Icons.add_photo_alternate_outlined, color: Colors.grey[400], size: 28),
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

  Widget _buildMiniCollage(Outfit outfit, List<Product> allItems) {
    final productIds = outfit.productIds;
    final products = productIds.map((id) => allItems.firstWhere((p) => p.id == id, orElse: () => Product.dummyProducts.first)).toList();

    if (products.isEmpty) return const SizedBox.shrink();

    return ClipRRect(
      borderRadius: BorderRadius.circular(8),
      child: Container(
        color: Colors.grey[100],
        padding: const EdgeInsets.all(2),
        child: Stack(
          children: [
            // Draw products
            if (products.length == 1)
              Center(child: _buildItemImage(products[0]))
            else if (products.length == 2)
              Row(
                children: [
                  Expanded(child: _buildItemImage(products[0])),
                  const SizedBox(width: 1),
                  Expanded(child: _buildItemImage(products[1])),
                ],
              )
            else
              // 3 or more items: show first 2 side-by-side, but overlay a badge on the second one if > 2
              Row(
                children: [
                  Expanded(child: _buildItemImage(products[0])),
                  const SizedBox(width: 1),
                  Expanded(
                    child: Stack(
                      fit: StackFit.expand,
                      children: [
                        _buildItemImage(products[1]),
                        if (products.length > 2)
                          Container(
                            color: Colors.black.withOpacity(0.45),
                            child: Center(
                              child: Text(
                                '+${products.length - 1}',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 8,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
          ],
        ),
      ),
    );
  }
}
