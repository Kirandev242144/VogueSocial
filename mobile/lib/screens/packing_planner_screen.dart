import 'dart:io';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/product.dart';
import '../providers/tryon_provider.dart';
import '../theme/app_theme.dart';
import '../widgets/product_image.dart';
import 'tryon_screen.dart';

class PackingPlannerScreen extends StatefulWidget {
  const PackingPlannerScreen({super.key});

  @override
  State<PackingPlannerScreen> createState() => _PackingPlannerScreenState();
}

class _PackingPlannerScreenState extends State<PackingPlannerScreen> {
  final Map<String, String> _presetUrls = {
    'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=400',
    'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=400',
    'india': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=400',
    'custom': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=400',
  };

  void _showCreateTripDialog(BuildContext context, TryOnProvider provider) {
    final destController = TextEditingController();
    DateTimeRange? selectedDateRange;
    String selectedPreset = 'custom';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppTheme.surfaceColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(24),
          topRight: Radius.circular(24),
        ),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 20,
                bottom: MediaQuery.of(context).viewInsets.bottom + 30,
              ),
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
                  const Text(
                    'PLAN A NEW TRIP',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.5,
                      color: AppTheme.textColorPrimary,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  TextField(
                    controller: destController,
                    decoration: InputDecoration(
                      labelText: 'Destination Name',
                      hintText: 'e.g. Paris Summer Getaway',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Date Picker Trigger
                  GestureDetector(
                    onTap: () async {
                      final range = await showDateRangePicker(
                        context: context,
                        firstDate: DateTime.now(),
                        lastDate: DateTime.now().add(const Duration(days: 365)),
                      );
                      if (range != null) {
                        setModalState(() {
                          selectedDateRange = range;
                        });
                      }
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.grey),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.date_range_outlined, color: AppTheme.primaryColor),
                          const SizedBox(width: 12),
                          Text(
                            selectedDateRange == null
                                ? 'Select Date Range'
                                : '${selectedDateRange!.start.day}/${selectedDateRange!.start.month}/${selectedDateRange!.start.year} - ${selectedDateRange!.end.day}/${selectedDateRange!.end.month}/${selectedDateRange!.end.year}',
                            style: TextStyle(
                              color: selectedDateRange == null ? Colors.grey : AppTheme.textColorPrimary,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  const Text(
                    'Select Landscape Cover Preset',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.textColorPrimary),
                  ),
                  const SizedBox(height: 10),

                  // Landscape covers row
                  SizedBox(
                    height: 80,
                    child: ListView(
                      scrollDirection: Axis.horizontal,
                      children: _presetUrls.keys.map((preset) {
                        final isSel = selectedPreset == preset;
                        return GestureDetector(
                          onTap: () {
                            setModalState(() {
                              selectedPreset = preset;
                            });
                          },
                          child: Container(
                            margin: const EdgeInsets.only(right: 12),
                            width: 80,
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: isSel ? AppTheme.primaryColor : Colors.transparent,
                                width: 2.5,
                              ),
                            ),
                            child: ClipRRect(
                              borderRadius: BorderRadius.circular(10),
                              child: Stack(
                                fit: StackFit.expand,
                                children: [
                                  Image.network(_presetUrls[preset]!, fit: BoxFit.cover),
                                  Container(
                                    color: Colors.black45,
                                    alignment: Alignment.center,
                                    child: Text(
                                      preset.toUpperCase(),
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                  const SizedBox(height: 24),

                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primaryColor,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      onPressed: (destController.text.trim().isEmpty || selectedDateRange == null)
                          ? null
                          : () async {
                              final start = selectedDateRange!.start;
                              final end = selectedDateRange!.end;
                              final checklistItems = {
                                'Passport / ID': false,
                                'Flight Tickets / Booking': false,
                                'Phone & Watch Charger': false,
                                'Toiletries & Toothbrush': false,
                                'Sunscreen': false,
                                'Sunglasses': false,
                              };

                              final newTrip = TripPlan(
                                id: 'trip_${DateTime.now().millisecondsSinceEpoch}',
                                destination: destController.text.trim(),
                                startDate: '${start.year}-${start.month.toString().padLeft(2, '0')}-${start.day.toString().padLeft(2, '0')}',
                                endDate: '${end.year}-${end.month.toString().padLeft(2, '0')}-${end.day.toString().padLeft(2, '0')}',
                                presetImage: selectedPreset,
                                packedGarmentIds: [],
                                dailyOutfits: {},
                                checklist: checklistItems,
                              );

                              await provider.saveTripPlan(newTrip);
                              if (context.mounted) {
                                Navigator.pop(context);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Trip Packing Plan created!')),
                                );
                              }
                            },
                      child: const Text('CREATE TRIP PLAN', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _showDeleteTripDialog(BuildContext context, TryOnProvider provider, TripPlan trip) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surfaceColor,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Delete Trip?', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        content: Text('Are you sure you want to remove "${trip.destination}"?', style: const TextStyle(fontSize: 13)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
            onPressed: () async {
              await provider.deleteTripPlan(trip.id);
              if (context.mounted) {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Deleted "${trip.destination}"')),
                );
              }
            },
            child: const Text('Delete', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<TryOnProvider>(context);
    final trips = provider.tripPlans;

    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        backgroundColor: AppTheme.backgroundColor,
        elevation: 0,
        centerTitle: true,
        title: const Text(
          'TRIP & PACKING PLANNER',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 13,
            letterSpacing: 1.5,
            color: AppTheme.textColorPrimary,
          ),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: GridView.builder(
          itemCount: trips.length + 1,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            childAspectRatio: 0.8,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
          ),
          itemBuilder: (context, index) {
            if (index == 0) {
              return GestureDetector(
                onTap: () => _showCreateTripDialog(context, provider),
                child: Container(
                  decoration: BoxDecoration(
                    color: AppTheme.backgroundColor,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: AppTheme.borderColor,
                      style: BorderStyle.solid,
                      width: 1.5,
                    ),
                  ),
                  child: const Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.luggage_outlined, size: 38, color: AppTheme.primaryColor),
                      SizedBox(height: 12),
                      Text(
                        'Create packing',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: AppTheme.primaryColor,
                          fontSize: 13,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        'Plan details & outfits',
                        style: TextStyle(color: Colors.grey, fontSize: 10),
                      ),
                    ],
                  ),
                ),
              );
            }

            final trip = trips[index - 1];
            final coverUrl = _presetUrls[trip.presetImage] ?? _presetUrls['custom']!;

            return GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => TripDetailsScreen(trip: trip),
                  ),
                );
              },
              onLongPress: () => _showDeleteTripDialog(context, provider, trip),
              child: Container(
                decoration: BoxDecoration(
                  color: AppTheme.surfaceColor,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppTheme.borderColor),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: Stack(
                          fit: StackFit.expand,
                          children: [
                            Image.network(coverUrl, fit: BoxFit.cover),
                            Positioned(
                              top: 8,
                              right: 8,
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: AppTheme.primaryColor,
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Text(
                                  trip.presetImage.toUpperCase(),
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
                      Padding(
                        padding: const EdgeInsets.all(12),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              trip.destination,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 12.5,
                                color: AppTheme.textColorPrimary,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${trip.startDate} · Packing',
                              style: const TextStyle(color: Colors.grey, fontSize: 9.5),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

class TripDetailsScreen extends StatefulWidget {
  final TripPlan trip;

  const TripDetailsScreen({super.key, required this.trip});

  @override
  State<TripDetailsScreen> createState() => _TripDetailsScreenState();
}

class _TripDetailsScreenState extends State<TripDetailsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  late TripPlan _activeTrip;
  final TextEditingController _customChecklistController = TextEditingController();

  final Map<String, String> _presetUrls = {
    'paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=600',
    'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=600',
    'india': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=600',
    'custom': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600',
  };

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _activeTrip = widget.trip;
  }

  @override
  void dispose() {
    _tabController.dispose();
    _customChecklistController.dispose();
    super.dispose();
  }

  List<DateTime> _getTripDays() {
    final start = DateTime.parse(_activeTrip.startDate);
    final end = DateTime.parse(_activeTrip.endDate);
    final days = <DateTime>[];
    for (int i = 0; i <= end.difference(start).inDays; i++) {
      days.add(start.add(Duration(days: i)));
    }
    return days;
  }

  String _formatDate(DateTime date) {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return '${months[date.month - 1]} ${date.day} ${weekdays[date.weekday % 7]}';
  }

  void _showOutfitSelector(BuildContext context, String dateStr, TryOnProvider provider) {
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
                const Text(
                  'SELECT OUTFIT FOR THIS DAY',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, letterSpacing: 1.0),
                ),
                const SizedBox(height: 16),
                
                if (provider.savedOutfits.isEmpty)
                  const Expanded(
                    child: Center(
                      child: Text(
                        'No outfits saved yet.\nGo to Styling workbench to design one!',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.grey, fontSize: 12),
                      ),
                    ),
                  )
                else
                  Expanded(
                    child: ListView.builder(
                      itemCount: provider.savedOutfits.length,
                      itemBuilder: (context, index) {
                        final outfit = provider.savedOutfits[index];
                        return ListTile(
                          contentPadding: EdgeInsets.zero,
                          title: Text(outfit.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                          subtitle: Text('${outfit.productIds.length} Items'),
                          trailing: const Icon(Icons.arrow_forward_ios, size: 14),
                          onTap: () async {
                            final updatedDaily = Map<String, String>.from(_activeTrip.dailyOutfits);
                            updatedDaily[dateStr] = outfit.id;

                            final updatedTrip = TripPlan(
                              id: _activeTrip.id,
                              destination: _activeTrip.destination,
                              startDate: _activeTrip.startDate,
                              endDate: _activeTrip.endDate,
                              presetImage: _activeTrip.presetImage,
                              packedGarmentIds: _activeTrip.packedGarmentIds,
                              dailyOutfits: updatedDaily,
                              checklist: _activeTrip.checklist,
                            );

                            await provider.saveTripPlan(updatedTrip);
                            setState(() {
                              _activeTrip = updatedTrip;
                            });
                            if (context.mounted) Navigator.pop(context);
                          },
                        );
                      },
                    ),
                  ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildItemImage(Product product) {
    final isCustom = product.id.startsWith('custom_');
    if (isCustom) {
      return Image.file(File(product.imageUrl), fit: BoxFit.contain);
    }
    return ProductImage(imagePath: product.imageUrl, fit: BoxFit.contain);
  }

  Widget _buildOutfitThumbnail(Outfit outfit, List<Product> allItems) {
    if (outfit.canvasLayout != null && outfit.canvasLayout!.isNotEmpty) {
      return ClipRRect(
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

                final itemWidth = 56.0 * scale;
                final itemHeight = 56.0 * scale;

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
      );
    }

    final outfitProducts = outfit.productIds.map((id) {
      return allItems.firstWhere((p) => p.id == id, orElse: () => Product.dummyProducts.first);
    }).toList();

    return Row(
      children: outfitProducts.map((p) => Expanded(child: Padding(padding: const EdgeInsets.all(2), child: _buildItemImage(p)))).toList(),
    );
  }

  Widget _buildOutfitTab(TryOnProvider provider) {
    final days = _getTripDays();
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: days.length,
      itemBuilder: (context, idx) {
        final day = days[idx];
        final dateStr = '${day.year}-${day.month.toString().padLeft(2, '0')}-${day.day.toString().padLeft(2, '0')}';
        final plannedOutfitId = _activeTrip.dailyOutfits[dateStr];
        Outfit? plannedOutfit;

        if (plannedOutfitId != null) {
          try {
            plannedOutfit = provider.savedOutfits.firstWhere((o) => o.id == plannedOutfitId);
          } catch (_) {}
        }

        return Container(
          margin: const EdgeInsets.only(bottom: 16),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppTheme.surfaceColor,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppTheme.borderColor),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Day ${idx + 1}',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.primaryColor),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      _formatDate(day),
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Colors.grey),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        Icon(Icons.cloudy_snowing, size: 14, color: Colors.grey[400]),
                        const SizedBox(width: 4),
                        const Text(
                          '17 / 13°C',
                          style: TextStyle(fontSize: 10.5, color: AppTheme.textColorSecondary),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              
              // Outfit preview or placeholder
              if (plannedOutfit != null)
                GestureDetector(
                  onTap: () => _showOutfitSelector(context, dateStr, provider),
                  child: Container(
                    width: 90,
                    height: 90,
                    decoration: BoxDecoration(
                      color: AppTheme.backgroundColor,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.borderColor),
                    ),
                    child: _buildOutfitThumbnail(plannedOutfit, provider.customGarments),
                  ),
                )
              else
                OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  ),
                  onPressed: () => _showOutfitSelector(context, dateStr, provider),
                  child: const Text('Add outfit', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildItemTab(TryOnProvider provider) {
    if (provider.customGarments.isEmpty) {
      return const Center(
        child: Text(
          'No garments in your wardrobe to pack.\nUpload garments inside closet catalog.',
          textAlign: TextAlign.center,
          style: TextStyle(color: Colors.grey, fontSize: 12),
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: provider.customGarments.length,
      itemBuilder: (context, idx) {
        final item = provider.customGarments[idx];
        final isPacked = _activeTrip.packedGarmentIds.contains(item.id);

        return CheckboxListTile(
          contentPadding: const EdgeInsets.symmetric(horizontal: 8),
          activeColor: AppTheme.primaryColor,
          title: Text(item.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
          subtitle: Text('${item.brand} · ${item.category.toUpperCase()}'),
          secondary: ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: SizedBox(
              width: 44,
              height: 44,
              child: File(item.imageUrl).existsSync()
                  ? Image.file(File(item.imageUrl), fit: BoxFit.cover)
                  : ProductImage(imagePath: item.imageUrl, fit: BoxFit.cover),
            ),
          ),
          value: isPacked,
          onChanged: (val) async {
            final updatedPacked = List<String>.from(_activeTrip.packedGarmentIds);
            if (val == true) {
              updatedPacked.add(item.id);
            } else {
              updatedPacked.remove(item.id);
            }

            final updatedTrip = TripPlan(
              id: _activeTrip.id,
              destination: _activeTrip.destination,
              startDate: _activeTrip.startDate,
              endDate: _activeTrip.endDate,
              presetImage: _activeTrip.presetImage,
              packedGarmentIds: updatedPacked,
              dailyOutfits: _activeTrip.dailyOutfits,
              checklist: _activeTrip.checklist,
            );

            await provider.saveTripPlan(updatedTrip);
            setState(() {
              _activeTrip = updatedTrip;
            });
          },
        );
      },
    );
  }

  Widget _buildChecklistTab(TryOnProvider provider) {
    return Column(
      children: [
        Expanded(
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: _activeTrip.checklist.entries.map((entry) {
              return CheckboxListTile(
                contentPadding: const EdgeInsets.symmetric(horizontal: 8),
                activeColor: AppTheme.primaryColor,
                title: Text(entry.key, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                value: entry.value,
                onChanged: (val) async {
                  final updatedChecklist = Map<String, bool>.from(_activeTrip.checklist);
                  updatedChecklist[entry.key] = val ?? false;

                  final updatedTrip = TripPlan(
                    id: _activeTrip.id,
                    destination: _activeTrip.destination,
                    startDate: _activeTrip.startDate,
                    endDate: _activeTrip.endDate,
                    presetImage: _activeTrip.presetImage,
                    packedGarmentIds: _activeTrip.packedGarmentIds,
                    dailyOutfits: _activeTrip.dailyOutfits,
                    checklist: updatedChecklist,
                  );

                  await provider.saveTripPlan(updatedTrip);
                  setState(() {
                    _activeTrip = updatedTrip;
                  });
                },
              );
            }).toList(),
          ),
        ),

        // Custom checklist input at bottom
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppTheme.surfaceColor,
            border: Border(top: BorderSide(color: AppTheme.borderColor)),
          ),
          child: Row(
            children: [
              Expanded(
                child: TextField(
                  controller: _customChecklistController,
                  decoration: InputDecoration(
                    hintText: 'Add custom checklist item...',
                    hintStyle: const TextStyle(fontSize: 12),
                    isDense: true,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryColor,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                onPressed: () async {
                  final text = _customChecklistController.text.trim();
                  if (text.isEmpty) return;

                  final updatedChecklist = Map<String, bool>.from(_activeTrip.checklist);
                  updatedChecklist[text] = false;

                  final updatedTrip = TripPlan(
                    id: _activeTrip.id,
                    destination: _activeTrip.destination,
                    startDate: _activeTrip.startDate,
                    endDate: _activeTrip.endDate,
                    presetImage: _activeTrip.presetImage,
                    packedGarmentIds: _activeTrip.packedGarmentIds,
                    dailyOutfits: _activeTrip.dailyOutfits,
                    checklist: updatedChecklist,
                  );

                  await provider.saveTripPlan(updatedTrip);
                  setState(() {
                    _activeTrip = updatedTrip;
                    _customChecklistController.clear();
                  });
                },
                child: const Text('Add'),
              ),
            ],
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<TryOnProvider>(context);
    final coverUrl = _presetUrls[_activeTrip.presetImage] ?? _presetUrls['custom']!;

    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: Column(
        children: [
          // Parallax cover header
          Stack(
            children: [
              Container(
                height: 220,
                width: double.infinity,
                decoration: const BoxDecoration(
                  borderRadius: BorderRadius.only(
                    bottomLeft: Radius.circular(24),
                    bottomRight: Radius.circular(24),
                  ),
                ),
                child: ClipRRect(
                  borderRadius: const BorderRadius.only(
                    bottomLeft: Radius.circular(24),
                    bottomRight: Radius.circular(24),
                  ),
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      Image.network(coverUrl, fit: BoxFit.cover),
                      Container(color: Colors.black38),
                    ],
                  ),
                ),
              ),
              SafeArea(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.arrow_back, color: Colors.white),
                        onPressed: () => Navigator.pop(context),
                      ),
                      IconButton(
                        icon: const Icon(Icons.face_retouching_natural, color: Colors.white),
                        onPressed: () {
                          // Try on all packed garments
                          final packedProducts = provider.customGarments
                              .where((g) => _activeTrip.packedGarmentIds.contains(g.id))
                              .toList();
                          if (packedProducts.isNotEmpty) {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => TryOnScreen(preSelectedOutfit: packedProducts),
                              ),
                            );
                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Please pack some items first in the "Item" tab to try them on!')),
                            );
                          }
                        },
                      ),
                    ],
                  ),
                ),
              ),
              Positioned(
                bottom: 20,
                left: 20,
                right: 20,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _activeTrip.destination,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(Icons.date_range, color: Colors.white70, size: 14),
                        const SizedBox(width: 6),
                        Text(
                          '${_activeTrip.startDate}  ·  ${_activeTrip.endDate}',
                          style: const TextStyle(color: Colors.white70, fontSize: 12),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),

          // Tab Selector
          Container(
            color: AppTheme.surfaceColor,
            child: TabBar(
              controller: _tabController,
              labelColor: AppTheme.primaryColor,
              unselectedLabelColor: Colors.grey,
              indicatorColor: AppTheme.primaryColor,
              tabs: [
                Tab(text: 'Outfit (${_activeTrip.dailyOutfits.length})'),
                Tab(text: 'Item (${_activeTrip.packedGarmentIds.length})'),
                Tab(text: 'Checklist'),
              ],
            ),
          ),

          // Tab pages
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _buildOutfitTab(provider),
                _buildItemTab(provider),
                _buildChecklistTab(provider),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
