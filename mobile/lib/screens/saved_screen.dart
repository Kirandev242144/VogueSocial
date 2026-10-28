import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../models/product.dart';
import '../providers/tryon_provider.dart';
import '../services/color_extractor.dart';
import '../theme/app_theme.dart';
import '../widgets/product_image.dart';
import 'tryon_screen.dart';
import 'styling_screen.dart';
import 'calendar_screen.dart';
import 'packing_planner_screen.dart';

class SavedScreen extends StatefulWidget {
  const SavedScreen({super.key});

  @override
  State<SavedScreen> createState() => _SavedScreenState();
}

class _SavedScreenState extends State<SavedScreen> {
  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<TryOnProvider>(context);
    
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'WARDROBE PLANNER',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            letterSpacing: 1.5,
            fontSize: 14,
          ),
        ),
        centerTitle: true,
      ),
      body: Stack(
        children: [
          const _MyWardrobeTab(),
          if (provider.isLoading)
            Container(
              color: Colors.black.withOpacity(0.5),
              child: Center(
                child: Card(
                  color: AppTheme.surfaceColor,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 28.0, vertical: 20.0),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const CircularProgressIndicator(color: AppTheme.primaryColor),
                        const SizedBox(height: 16),
                        Text(
                          provider.statusMessage.toUpperCase(),
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.textColorPrimary,
                            letterSpacing: 1.0,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

// TAB 1: MY WARDROBE
class _MyWardrobeTab extends StatefulWidget {
  const _MyWardrobeTab();

  @override
  State<_MyWardrobeTab> createState() => _MyWardrobeTabState();
}

class _MyWardrobeTabState extends State<_MyWardrobeTab> {
  String _selectedCategory = 'all'; // all, shirts, pants, shoes, jackets, accessories
  
  // Advanced Filter state variables
  String _filterBrand = 'all';
  String _filterSeason = 'all';
  String _filterOccasion = 'all';
  String _filterColor = 'all';
  
  // Sorting options
  String _sortBy = 'newest'; // newest, most_worn, least_worn

  final List<String> _colorsNameList = [
    'White', 'Black', 'Grey', 'Blue', 'Navy', 'Red', 'Beige', 'Brown', 'Purple', 'Lavender', 'Pink', 'Green', 'Yellow', 'Orange'
  ];

  Color _getColorFromName(String colorName) {
    switch (colorName.toLowerCase()) {
      case 'white': return Colors.white;
      case 'black': return Colors.black87;
      case 'grey': return Colors.grey;
      case 'blue': return Colors.blue;
      case 'navy': return const Color(0xFF0D47A1);
      case 'red': return Colors.red;
      case 'beige': return const Color(0xFFF5F5DC);
      case 'brown': return Colors.brown;
      case 'purple': return Colors.purple;
      case 'lavender': return const Color(0xFFE1BEE7);
      case 'pink': return Colors.pink;
      case 'green': return Colors.green;
      case 'yellow': return Colors.yellow;
      case 'orange': return Colors.orange;
      default: return Colors.white;
    }
  }

  void _resetFilters() {
    setState(() {
      _filterBrand = 'all';
      _filterSeason = 'all';
      _filterOccasion = 'all';
      _filterColor = 'all';
    });
  }

  void _openFilterBottomSheet(List<Product> garments) {
    final brands = ['all', ...garments.map((g) => g.brand.trim()).where((b) => b.isNotEmpty).toSet().toList()];

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
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
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
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'FILTER CLOTHES',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, letterSpacing: 1.0),
                      ),
                      TextButton(
                        onPressed: () {
                          setModalState(() {
                            _resetFilters();
                          });
                          setState(() {});
                        },
                        child: const Text('Reset All', style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold)),
                      )
                    ],
                  ),
                  const Divider(),
                  const SizedBox(height: 12),

                  const Text('Brand', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  const SizedBox(height: 8),
                  SizedBox(
                    height: 38,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: brands.length,
                      itemBuilder: (context, idx) {
                        final b = brands[idx];
                        final isSelected = _filterBrand == b;
                        return Padding(
                          padding: const EdgeInsets.only(right: 8.0),
                          child: ChoiceChip(
                            label: Text(b.toUpperCase()),
                            selected: isSelected,
                            selectedColor: AppTheme.primaryColor,
                            labelStyle: TextStyle(
                              color: isSelected ? Colors.white : AppTheme.textColorPrimary,
                              fontWeight: FontWeight.bold,
                              fontSize: 11,
                            ),
                            onSelected: (val) {
                              setModalState(() {
                                _filterBrand = b;
                              });
                              setState(() {});
                            },
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(height: 16),

                  const Text('Season', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: ['all', 'Summer', 'Winter', 'Spring/Autumn'].map((s) {
                      final isSelected = _filterSeason == s;
                      return ChoiceChip(
                        label: Text(s.toUpperCase()),
                        selected: isSelected,
                        selectedColor: AppTheme.primaryColor,
                        labelStyle: TextStyle(
                          color: isSelected ? Colors.white : AppTheme.textColorPrimary,
                          fontWeight: FontWeight.bold,
                          fontSize: 11,
                        ),
                        onSelected: (val) {
                          setModalState(() {
                            _filterSeason = s;
                          });
                          setState(() {});
                        },
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 16),

                  const Text('Occasion', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: ['all', 'Casual', 'Formal', 'Party'].map((o) {
                      final isSelected = _filterOccasion == o;
                      return ChoiceChip(
                        label: Text(o.toUpperCase()),
                        selected: isSelected,
                        selectedColor: AppTheme.primaryColor,
                        labelStyle: TextStyle(
                          color: isSelected ? Colors.white : AppTheme.textColorPrimary,
                          fontWeight: FontWeight.bold,
                          fontSize: 11,
                        ),
                        onSelected: (val) {
                          setModalState(() {
                            _filterOccasion = o;
                          });
                          setState(() {});
                        },
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 16),

                  const Text('Color', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  const SizedBox(height: 8),
                  SizedBox(
                    height: 44,
                    child: ListView(
                      scrollDirection: Axis.horizontal,
                      children: [
                        Padding(
                          padding: const EdgeInsets.only(right: 12.0),
                          child: ChoiceChip(
                            label: const Text('ALL'),
                            selected: _filterColor == 'all',
                            selectedColor: AppTheme.primaryColor,
                            labelStyle: TextStyle(
                              color: _filterColor == 'all' ? Colors.white : AppTheme.textColorPrimary,
                              fontWeight: FontWeight.bold,
                              fontSize: 11,
                            ),
                            onSelected: (val) {
                              setModalState(() {
                                _filterColor = 'all';
                              });
                              setState(() {});
                            },
                          ),
                        ),
                        ..._colorsNameList.map((colorName) {
                          final isSelected = _filterColor == colorName;
                          return GestureDetector(
                            onTap: () {
                              setModalState(() {
                                _filterColor = colorName;
                              });
                              setState(() {});
                            },
                            child: Container(
                              margin: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                              width: 32,
                              height: 32,
                              decoration: BoxDecoration(
                                color: _getColorFromName(colorName),
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: isSelected ? AppTheme.primaryColor : Colors.grey[300]!,
                                  width: isSelected ? 3 : 1,
                                ),
                              ),
                              child: isSelected
                                  ? Icon(
                                      Icons.check,
                                      size: 16,
                                      color: colorName == 'White' || colorName == 'Beige' ? Colors.black : Colors.white,
                                    )
                                  : null,
                            ),
                          );
                        }),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('APPLY FILTERS', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ),
                  const SizedBox(height: 10),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _openSortBottomSheet() {
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
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
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
                  const Text(
                    'SORT CLOTHES',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, letterSpacing: 1.0),
                  ),
                  const Divider(),
                  
                  RadioListTile<String>(
                    title: const Text('Newest Added'),
                    value: 'newest',
                    groupValue: _sortBy,
                    activeColor: AppTheme.primaryColor,
                    onChanged: (val) {
                      setModalState(() {
                        _sortBy = val!;
                      });
                      setState(() {});
                      Navigator.pop(context);
                    },
                  ),
                  RadioListTile<String>(
                    title: const Text('Most Worn'),
                    value: 'most_worn',
                    groupValue: _sortBy,
                    activeColor: AppTheme.primaryColor,
                    onChanged: (val) {
                      setModalState(() {
                        _sortBy = val!;
                      });
                      setState(() {});
                      Navigator.pop(context);
                    },
                  ),
                  RadioListTile<String>(
                    title: const Text('Least Worn'),
                    value: 'least_worn',
                    groupValue: _sortBy,
                    activeColor: AppTheme.primaryColor,
                    onChanged: (val) {
                      setModalState(() {
                        _sortBy = val!;
                      });
                      setState(() {});
                      Navigator.pop(context);
                    },
                  ),
                  const SizedBox(height: 10),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _showDeleteGarmentDialog(BuildContext context, TryOnProvider provider, Product product) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surfaceColor,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Delete Garment?', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        content: Text(
          'Are you sure you want to remove "${product.name}" from your wardrobe?',
          style: const TextStyle(fontSize: 13),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.redAccent,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: () async {
              await provider.deleteCustomGarment(product.id);
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Removed "${product.name}" from your wardrobe.')),
              );
            },
            child: const Text('Delete', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _showDeleteOutfitDialog(BuildContext context, TryOnProvider provider, Outfit outfit) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surfaceColor,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Delete Outfit Look?', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        content: Text(
          'Are you sure you want to delete the outfit "${outfit.name}" from your wardrobe?',
          style: const TextStyle(fontSize: 13),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.redAccent,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            onPressed: () async {
              await provider.deleteOutfit(outfit.id);
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Deleted outfit "${outfit.name}" successfully.')),
              );
            },
            child: const Text('Delete', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  // WHERING-STYLE TABBED UPLOAD REVIEW DIALOG
  void _showWheringReviewSheet(BuildContext context, TryOnProvider provider, File originalImage) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppTheme.surfaceColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(28),
          topRight: Radius.circular(28),
        ),
      ),
      builder: (ctx) {
        return StatefulBuilder(
          builder: (sheetContext, setSheetState) {
            return _WheringReviewSheetContent(
              originalImage: originalImage,
              provider: provider,
              onSaved: () {
                Navigator.pop(sheetContext);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Clothes saved to wardrobe!')),
                );
              },
            );
          },
        );
      },
    );
  }

  void _triggerGarmentPicker(TryOnProvider provider) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.surfaceColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
      ),
      builder: (ctx) => SafeArea(
        child: Wrap(
          children: [
            ListTile(
              leading: const Icon(Icons.photo_library_outlined, color: AppTheme.primaryColor),
              title: const Text('Pick from Gallery'),
              onTap: () async {
                Navigator.pop(ctx);
                final picker = ImagePicker();
                final pickedFile = await picker.pickImage(source: ImageSource.gallery);
                if (pickedFile != null && mounted) {
                  _showWheringReviewSheet(context, provider, File(pickedFile.path));
                }
              },
            ),
            ListTile(
              leading: const Icon(Icons.camera_alt_outlined, color: AppTheme.primaryColor),
              title: const Text('Take a Photo'),
              onTap: () async {
                Navigator.pop(ctx);
                final picker = ImagePicker();
                final pickedFile = await picker.pickImage(source: ImageSource.camera);
                if (pickedFile != null && mounted) {
                  _showWheringReviewSheet(context, provider, File(pickedFile.path));
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildToolCard({
    required BuildContext context,
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required Color textColor,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppTheme.borderColor),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.02),
              blurRadius: 6,
              offset: const Offset(0, 3),
            )
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, color: textColor == Colors.black ? Colors.black : AppTheme.primaryColor, size: 22),
            const SizedBox(height: 10),
            Text(
              title,
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 10, color: textColor, letterSpacing: 0.5),
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              style: const TextStyle(fontSize: 8, color: Colors.grey),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<TryOnProvider>(context);

    List<Product> filteredGarments = provider.customGarments.where((p) {
      if (_selectedCategory != 'all') {
        if (_selectedCategory == 'shirts' && (p.category != 'shirts' && p.category != 'tops')) return false;
        if (_selectedCategory == 'pants' && (p.category != 'pants' && p.category != 'bottoms')) return false;
        if (_selectedCategory == 'shoes' && p.category != 'shoes') return false;
        if (_selectedCategory == 'jackets' && p.category != 'jackets') return false;
        if (_selectedCategory == 'accessories' && p.category != 'accessories') return false;
      }
      
      if (_filterBrand != 'all' && p.brand.toLowerCase() != _filterBrand.toLowerCase()) return false;
      if (_filterSeason != 'all' && p.season != _filterSeason) return false;
      if (_filterOccasion != 'all' && p.occasion != _filterOccasion) return false;

      if (_filterColor != 'all') {
        if (!p.colors.contains(_filterColor)) return false;
      }

      return true;
    }).toList();

    if (_sortBy == 'newest') {
      // newest is default
    } else if (_sortBy == 'most_worn') {
      filteredGarments.sort((a, b) => b.wearCount.compareTo(a.wearCount));
    } else if (_sortBy == 'least_worn') {
      filteredGarments.sort((a, b) => a.wearCount.compareTo(b.wearCount));
    }

    final totalItems = provider.customGarments.length;
    Product? mostWornGarment;
    if (provider.customGarments.isNotEmpty) {
      Product highest = provider.customGarments.first;
      for (final g in provider.customGarments) {
        if (g.wearCount > highest.wearCount) {
          highest = g;
        }
      }
      if (highest.wearCount > 0) {
        mostWornGarment = highest;
      }
    }
    final recentlyAddedName = provider.customGarments.isNotEmpty
        ? provider.customGarments.first.name
        : 'None';
    final recentlyAddedThumb = provider.customGarments.isNotEmpty
        ? provider.customGarments.first.imageUrl
        : null;
    final randomGarmentThumb = provider.customGarments.isNotEmpty
        ? provider.customGarments[provider.customGarments.length ~/ 2].imageUrl
        : null;

    String weatherText = 'Sunny, 24°C';
    String suggestionQuote = 'Upload your tops & bottoms clothes, and your AI Stylist will suggest the look of the day!';
    
    final tops = provider.customGarments.where((c) => c.category == 'shirts' || c.category == 'tops').toList();
    final bottoms = provider.customGarments.where((c) => c.category == 'pants' || c.category == 'bottoms').toList();

    if (tops.isNotEmpty && bottoms.isNotEmpty) {
      suggestionQuote = 'Sunny and warm today! Match your ${tops.first.name} with your ${bottoms.first.name} for a smart casual vibe.';
    } else if (tops.isNotEmpty) {
      suggestionQuote = 'Its a beautiful sunny day. Pair your ${tops.first.name} with linen shorts.';
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // TOOLS BAR PANEL
          Row(
            children: [
              Expanded(
                child: _buildToolCard(
                  context: context,
                  title: 'STYLING',
                  subtitle: 'Mix & Match',
                  icon: Icons.auto_awesome_outlined,
                  color: const Color(0xFFCCFF00), // Neon Yellow/Green
                  textColor: Colors.black,
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const StylingScreen()),
                    );
                  },
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildToolCard(
                  context: context,
                  title: 'CALENDAR',
                  subtitle: 'Plan Looks',
                  icon: Icons.calendar_month_outlined,
                  color: AppTheme.surfaceColor,
                  textColor: AppTheme.textColorPrimary,
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const CalendarScreen()),
                    );
                  },
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: _buildToolCard(
                  context: context,
                  title: 'PLANNER',
                  subtitle: 'Events/Trips',
                  icon: Icons.event_note_outlined,
                  color: AppTheme.surfaceColor,
                  textColor: AppTheme.textColorPrimary,
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const PackingPlannerScreen()),
                    );
                  },
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          GestureDetector(
            onTap: () {
              final recommended = <Product>[];
              if (tops.isNotEmpty) recommended.add(tops.first);
              if (bottoms.isNotEmpty) recommended.add(bottoms.first);
              if (recommended.isNotEmpty) {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => TryOnScreen(preSelectedOutfit: recommended),
                  ),
                );
              } else {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Upload tops & bottoms to unlock AI weather outfit recommendations!'),
                  ),
                );
              }
            },
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [AppTheme.primaryColor, Color(0xFF1B3D37)],
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.primaryColor.withOpacity(0.12),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  )
                ]
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.wb_sunny_outlined, color: AppTheme.secondaryColor, size: 28),
                          const SizedBox(width: 10),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                weatherText,
                                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                              ),
                              const Text(
                                'Paris, France',
                                style: TextStyle(color: Colors.grey, fontSize: 11),
                              ),
                            ],
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.secondaryColor.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Text(
                          'AI STYLIST',
                          style: TextStyle(color: AppTheme.secondaryColor, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Daily Styling Quote:',
                    style: TextStyle(color: AppTheme.secondaryColor, fontSize: 12, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    suggestionQuote,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 13,
                      height: 1.4,
                    ),
                  ),
                  
                  // Today's suggested clothes thumbnails row
                  if (tops.isNotEmpty || bottoms.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        const Text(
                          'TODAY\'S OUTFIT LOOK',
                          style: TextStyle(
                            color: Colors.white70,
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.0,
                          ),
                        ),
                        const Spacer(),
                        Text(
                          'Tap to Try-On',
                          style: TextStyle(
                            color: AppTheme.secondaryColor.withOpacity(0.9),
                            fontSize: 9,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(width: 2),
                        Icon(Icons.arrow_forward_ios, size: 8, color: AppTheme.secondaryColor.withOpacity(0.9)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    SizedBox(
                      height: 56,
                      child: Row(
                        children: [
                          if (tops.isNotEmpty)
                            Container(
                              margin: const EdgeInsets.only(right: 10),
                              width: 56,
                              height: 56,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: Colors.white24),
                              ),
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(12),
                                child: Padding(
                                  padding: const EdgeInsets.all(4.0),
                                  child: File(tops.first.imageUrl).existsSync()
                                      ? Image.file(File(tops.first.imageUrl), fit: BoxFit.contain)
                                      : ProductImage(imagePath: tops.first.imageUrl, fit: BoxFit.contain),
                                ),
                              ),
                            ),
                          if (bottoms.isNotEmpty)
                            Container(
                              margin: const EdgeInsets.only(right: 10),
                              width: 56,
                              height: 56,
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: Colors.white24),
                              ),
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(12),
                                child: Padding(
                                  padding: const EdgeInsets.all(4.0),
                                  child: File(bottoms.first.imageUrl).existsSync()
                                      ? Image.file(File(bottoms.first.imageUrl), fit: BoxFit.contain)
                                      : ProductImage(imagePath: bottoms.first.imageUrl, fit: BoxFit.contain),
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),

          const Text(
            'WARDROBE INSIGHTS',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 1.0, color: AppTheme.textColorSecondary),
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Expanded(
                child: _statsCard(
                  title: 'Total Clothes',
                  value: '$totalItems',
                  icon: Icons.inventory_2_outlined,
                  thumbnail: randomGarmentThumb,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _statsCard(
                  title: 'Most Worn',
                  value: mostWornGarment != null
                      ? '${mostWornGarment.name} (${mostWornGarment.wearCount}x)'
                      : 'None yet',
                  icon: Icons.insights,
                  thumbnail: mostWornGarment?.imageUrl,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: _statsCard(
                  title: 'Recently Added',
                  value: recentlyAddedName,
                  icon: Icons.fiber_new_outlined,
                  thumbnail: recentlyAddedThumb,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'CLOTHES CATALOG',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 1.0, color: AppTheme.textColorSecondary),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'Long-press card to delete item',
                    style: TextStyle(fontSize: 9, color: Colors.grey[500], fontWeight: FontWeight.w500),
                  ),
                ],
              ),
              Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.sort_outlined, size: 20, color: AppTheme.primaryColor),
                    onPressed: _openSortBottomSheet,
                    tooltip: 'Sort Clothes',
                  ),
                  IconButton(
                    icon: const Icon(Icons.filter_list, size: 20, color: AppTheme.primaryColor),
                    onPressed: () => _openFilterBottomSheet(provider.customGarments),
                    tooltip: 'Filter Clothes',
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 8),

          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: ['all', 'shirts', 'pants', 'shoes', 'jackets', 'accessories', 'outfits'].map((cat) {
                final isSel = _selectedCategory == cat;
                return Padding(
                  padding: const EdgeInsets.only(right: 8.0),
                  child: FilterChip(
                    label: Text(cat.toUpperCase()),
                    selected: isSel,
                    selectedColor: AppTheme.primaryColor.withOpacity(0.12),
                    checkmarkColor: AppTheme.primaryColor,
                    labelStyle: TextStyle(
                      color: isSel ? AppTheme.primaryColor : Colors.grey,
                      fontWeight: FontWeight.bold,
                      fontSize: 10,
                    ),
                    onSelected: (selected) {
                      setState(() {
                        _selectedCategory = cat;
                      });
                    },
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 16),

          // Clothes Grid
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: _selectedCategory == 'outfits'
                ? provider.savedOutfits.length + 1
                : filteredGarments.length + 1,
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 2,
              childAspectRatio: 0.72,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
            ),
            itemBuilder: (context, index) {
              final isOutfits = _selectedCategory == 'outfits';

              if (index == 0) {
                if (isOutfits) {
                  return GestureDetector(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const StylingScreen()),
                      );
                    },
                    child: Container(
                      decoration: BoxDecoration(
                        color: AppTheme.backgroundColor,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: AppTheme.borderColor,
                          style: BorderStyle.solid,
                          width: 1,
                        ),
                      ),
                      child: const Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.palette_outlined, size: 36, color: AppTheme.primaryColor),
                          SizedBox(height: 12),
                          Text(
                            'Design Outfit',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: AppTheme.primaryColor,
                              fontSize: 14,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Mix & match in styling',
                            style: TextStyle(color: Colors.grey, fontSize: 10),
                          ),
                        ],
                      ),
                    ),
                  );
                }

                return GestureDetector(
                  onTap: () => _triggerGarmentPicker(provider),
                  child: Container(
                    decoration: BoxDecoration(
                      color: AppTheme.backgroundColor,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: AppTheme.borderColor,
                        style: BorderStyle.solid,
                        width: 1,
                      ),
                    ),
                    child: const Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.add_photo_alternate_outlined, size: 36, color: AppTheme.primaryColor),
                        SizedBox(height: 12),
                        Text(
                          'Upload Clothes',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: AppTheme.primaryColor,
                            fontSize: 14,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Add to your wardrobe',
                          style: TextStyle(color: Colors.grey, fontSize: 10),
                        ),
                      ],
                    ),
                  ),
                );
              }

              if (isOutfits) {
                final outfit = provider.savedOutfits[index - 1];
                final outfitProducts = outfit.productIds.map((id) {
                  return provider.customGarments.firstWhere((p) => p.id == id, orElse: () => Product.dummyProducts.first);
                }).toList();

                return GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => TryOnScreen(preSelectedOutfit: outfitProducts),
                      ),
                    );
                  },
                  onLongPress: () => _showDeleteOutfitDialog(context, provider, outfit),
                  child: Container(
                    decoration: BoxDecoration(
                      color: AppTheme.surfaceColor,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.borderColor),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: _buildOutfitThumbnail(outfit, provider.customGarments),
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.all(10),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  outfit.name,
                                  style: const TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.bold,
                                    color: AppTheme.textColorPrimary,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  '${outfitProducts.length} Items',
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    color: AppTheme.textColorSecondary,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              }

              final product = filteredGarments[index - 1];
              final imageFile = File(product.imageUrl);

              return GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => TryOnScreen(product: product),
                    ),
                  );
                },
                onLongPress: () => _showDeleteGarmentDialog(context, provider, product),
                child: Container(
                  decoration: BoxDecoration(
                    color: AppTheme.surfaceColor,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.borderColor),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Stack(
                            fit: StackFit.expand,
                            children: [
                              Container(
                                color: AppTheme.backgroundColor,
                                child: GridPaper(
                                  color: Colors.grey[200]!,
                                  divisions: 1,
                                  subdivisions: 1,
                                  interval: 16,
                                  child: Container(
                                    color: Colors.transparent,
                                    child: imageFile.existsSync()
                                        ? Padding(
                                            padding: const EdgeInsets.all(8.0),
                                            child: Image.file(imageFile, fit: BoxFit.contain),
                                          )
                                        : const Icon(Icons.image_outlined, color: Colors.grey),
                                  ),
                                ),
                              ),
                              Positioned(
                                top: 8,
                                right: 8,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: Colors.black.withOpacity(0.65),
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      const Icon(Icons.checkroom_outlined, size: 10, color: Colors.white),
                                      const SizedBox(width: 4),
                                      Text(
                                        'Worn ${product.wearCount}x',
                                        style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(10),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                product.name,
                                style: const TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.textColorPrimary,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                              const SizedBox(height: 4),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(
                                    child: Text(
                                      product.brand,
                                      style: TextStyle(
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                        color: AppTheme.textColorSecondary,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                  // WHERING MULTI-COLOR DOTS
                                  Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: product.colors.take(3).map((cName) {
                                      return Container(
                                        margin: const EdgeInsets.only(left: 3),
                                        width: 8,
                                        height: 8,
                                        decoration: BoxDecoration(
                                          color: _getColorFromName(cName),
                                          shape: BoxShape.circle,
                                          border: Border.all(color: Colors.grey[400]!, width: 0.5),
                                        ),
                                      );
                                    }).toList(),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        )
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _statsCard({
    required String title,
    required String value,
    required IconData icon,
    String? thumbnail,
  }) {
    final hasImage = thumbnail != null && File(thumbnail).existsSync();

    return Container(
      height: 90,
      decoration: BoxDecoration(
        color: hasImage ? Colors.transparent : AppTheme.surfaceColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.borderColor),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: Stack(
          fit: StackFit.expand,
          children: [
            // Background image if available
            if (hasImage) ...[
              Image.file(File(thumbnail), fit: BoxFit.cover),
              // Dark overlay
              Container(color: Colors.black45),
            ],

            // Content on top of background
            Padding(
              padding: const EdgeInsets.all(10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          title.toUpperCase(),
                          style: TextStyle(
                            fontSize: 8,
                            fontWeight: FontWeight.bold,
                            color: hasImage ? Colors.white70 : Colors.grey,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: 4),
                      Icon(
                        icon,
                        size: 12,
                        color: hasImage ? Colors.white70 : AppTheme.textColorSecondary,
                      ),
                    ],
                  ),
                  const Spacer(),
                  Text(
                    value,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: hasImage ? Colors.white : AppTheme.textColorPrimary,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
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
}

// WHERING REVIEW SHEET INTERNAL STATE WIDGET
class _WheringReviewSheetContent extends StatefulWidget {
  final File originalImage;
  final TryOnProvider provider;
  final VoidCallback onSaved;

  const _WheringReviewSheetContent({
    required this.originalImage,
    required this.provider,
    required this.onSaved,
  });

  @override
  State<_WheringReviewSheetContent> createState() => _WheringReviewSheetContentState();
}

class _WheringReviewSheetContentState extends State<_WheringReviewSheetContent> {
  bool _isProcessing = true;
  String? _cutoutPath;
  List<String> _colors = [];

  final nameController = TextEditingController();
  final brandController = TextEditingController();
  final notesController = TextEditingController();
  final priceController = TextEditingController();

  String category = 'shirts';
  String season = 'All';
  String occasion = 'Casual';

  final List<String> _allColors = [
    'White', 'Black', 'Grey', 'Blue', 'Navy', 'Red', 'Beige', 'Brown', 'Purple', 'Lavender', 'Pink', 'Green', 'Yellow', 'Orange'
  ];

  Color _getColorFromName(String colorName) {
    switch (colorName.toLowerCase()) {
      case 'white': return Colors.white;
      case 'black': return Colors.black87;
      case 'grey': return Colors.grey;
      case 'blue': return Colors.blue;
      case 'navy': return const Color(0xFF0D47A1);
      case 'red': return Colors.red;
      case 'beige': return const Color(0xFFF5F5DC);
      case 'brown': return Colors.brown;
      case 'purple': return Colors.purple;
      case 'lavender': return const Color(0xFFE1BEE7);
      case 'pink': return Colors.pink;
      case 'green': return Colors.green;
      case 'yellow': return Colors.yellow;
      case 'orange': return Colors.orange;
      default: return Colors.white;
    }
  }

  @override
  void initState() {
    super.initState();
    _processGarment();
  }

  Future<void> _processGarment() async {
    // 1. Run AI background removal cutout
    final cutout = await removeGarmentBackground(widget.originalImage.path);
    // 2. Run Auto-color dominant extraction
    final detected = await ColorExtractor.extractDominantColors(cutout);

    if (mounted) {
      setState(() {
        _cutoutPath = cutout;
        _colors = detected;
        _isProcessing = false;
        nameController.text = 'My ${category[0].toUpperCase()}${category.substring(1)} ${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isProcessing) {
      return Container(
        height: 480,
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const CircularProgressIndicator(color: AppTheme.primaryColor),
            const SizedBox(height: 24),
            const Text(
              'EXTRACTING GARMENT CUTOUT...',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, letterSpacing: 1.5, color: AppTheme.primaryColor),
            ),
            const SizedBox(height: 8),
            Text(
              'Auto-detecting colors and fabric shape...',
              style: TextStyle(color: Colors.grey[600], fontSize: 12),
            ),
            const SizedBox(height: 20),
            ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: Image.file(widget.originalImage, height: 180, width: 140, fit: BoxFit.cover),
            ),
          ],
        ),
      );
    }

    final double purchasePrice = double.tryParse(priceController.text) ?? 0.0;

    return Padding(
      padding: EdgeInsets.only(
        left: 20,
        right: 20,
        top: 16,
        bottom: MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: DefaultTabController(
        length: 3,
        child: SingleChildScrollView(
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
              const SizedBox(height: 14),

              // CENTER PREVIEW IMAGE CARD
              Center(
                child: Container(
                  height: 200,
                  width: 160,
                  decoration: BoxDecoration(
                    color: AppTheme.backgroundColor,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppTheme.borderColor),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(20),
                    child: GridPaper(
                      color: Colors.grey[200]!,
                      divisions: 1,
                      subdivisions: 1,
                      interval: 16,
                      child: Padding(
                        padding: const EdgeInsets.all(12.0),
                        child: Image.file(File(_cutoutPath!), fit: BoxFit.contain),
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // NAME & BRAND FIELDS (Always visible at top of form)
              TextField(
                controller: nameController,
                decoration: InputDecoration(
                  labelText: 'Item Name',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                ),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: brandController,
                decoration: InputDecoration(
                  labelText: 'Brand',
                  hintText: 'e.g. Zara, Custom',
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                ),
              ),
              const SizedBox(height: 14),

              // TABS BAR
              const TabBar(
                indicatorColor: AppTheme.primaryColor,
                labelColor: AppTheme.primaryColor,
                unselectedLabelColor: Colors.grey,
                labelStyle: TextStyle(fontWeight: FontWeight.bold),
                tabs: [
                  Tab(text: 'About'),
                  Tab(text: 'Styling'),
                  Tab(text: 'Stats'),
                ],
              ),
              const SizedBox(height: 14),

              // TAB BAR VIEW CONTAINERS
              SizedBox(
                height: 260,
                child: TabBarView(
                  children: [
                    // ABOUT TAB
                    SingleChildScrollView(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Category', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                          const SizedBox(height: 6),
                          SingleChildScrollView(
                            scrollDirection: Axis.horizontal,
                            child: Row(
                              children: ['shirts', 'pants', 'shoes', 'jackets', 'accessories'].map((cat) {
                                final isSel = category == cat;
                                return Padding(
                                  padding: const EdgeInsets.only(right: 8.0),
                                  child: ChoiceChip(
                                    label: Text(cat.toUpperCase()),
                                    selected: isSel,
                                    selectedColor: AppTheme.primaryColor,
                                    labelStyle: TextStyle(
                                      color: isSel ? Colors.white : AppTheme.textColorPrimary,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 10,
                                    ),
                                    onSelected: (selected) {
                                      if (selected) {
                                        setState(() {
                                          category = cat;
                                        });
                                      }
                                    },
                                  ),
                                );
                              }).toList(),
                            ),
                          ),
                          const SizedBox(height: 16),

                          // WHERING MULTI-COLOR TAGS LIST
                          const Text('Colours', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                          const SizedBox(height: 8),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: [
                              ..._colors.map((colorName) {
                                return Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: Colors.grey[100],
                                    borderRadius: BorderRadius.circular(18),
                                    border: Border.all(color: Colors.grey[300]!),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Container(
                                        width: 10,
                                        height: 10,
                                        decoration: BoxDecoration(
                                          color: _getColorFromName(colorName),
                                          shape: BoxShape.circle,
                                        ),
                                      ),
                                      const SizedBox(width: 6),
                                      Text(colorName, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                                      const SizedBox(width: 6),
                                      GestureDetector(
                                        onTap: () {
                                          setState(() {
                                            _colors.remove(colorName);
                                          });
                                        },
                                        child: const Icon(Icons.close, size: 12, color: Colors.grey),
                                      ),
                                    ],
                                  ),
                                );
                              }),
                              // Add Color dropdown/picker button
                              ActionChip(
                                avatar: const Icon(Icons.add, size: 12, color: Colors.white),
                                label: const Text('Add Colour'),
                                backgroundColor: AppTheme.primaryColor,
                                labelStyle: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                                onPressed: () {
                                  showModalBottomSheet(
                                    context: context,
                                    backgroundColor: AppTheme.surfaceColor,
                                    shape: const RoundedRectangleBorder(
                                      borderRadius: BorderRadius.only(
                                        topLeft: Radius.circular(20),
                                        topRight: Radius.circular(20),
                                      ),
                                    ),
                                    builder: (ctx) {
                                      final filteredList = _allColors.where((c) => !_colors.contains(c)).toList();
                                      return Padding(
                                        padding: const EdgeInsets.all(20),
                                        child: Column(
                                          mainAxisSize: MainAxisSize.min,
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            const Text('Select Colour to Add', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                                            const Divider(),
                                            SizedBox(
                                              height: 150,
                                              child: ListView.builder(
                                                itemCount: filteredList.length,
                                                itemBuilder: (context, idx) {
                                                  final c = filteredList[idx];
                                                  return ListTile(
                                                    leading: Container(
                                                      width: 18,
                                                      height: 18,
                                                      decoration: BoxDecoration(
                                                        color: _getColorFromName(c),
                                                        shape: BoxShape.circle,
                                                        border: Border.all(color: Colors.grey),
                                                      ),
                                                    ),
                                                    title: Text(c, style: const TextStyle(fontWeight: FontWeight.bold)),
                                                    onTap: () {
                                                      setState(() {
                                                        _colors.add(c);
                                                      });
                                                      Navigator.pop(ctx);
                                                    },
                                                  );
                                                },
                                              ),
                                            ),
                                          ],
                                        ),
                                      );
                                    },
                                  );
                                },
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),

                          const Text('Season', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                          const SizedBox(height: 6),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: ['All', 'Summer', 'Winter', 'Spring/Autumn'].map((s) {
                              final isSel = season == s;
                              return ChoiceChip(
                                label: Text(s.toUpperCase()),
                                selected: isSel,
                                selectedColor: AppTheme.primaryColor,
                                labelStyle: TextStyle(
                                  color: isSel ? Colors.white : AppTheme.textColorPrimary,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 10,
                                ),
                                onSelected: (selected) {
                                  if (selected) {
                                    setState(() {
                                      season = s;
                                    });
                                  }
                                },
                              );
                            }).toList(),
                          ),
                        ],
                      ),
                    ),

                    // STYLING TAB
                    SingleChildScrollView(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Occasion Suitability', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                          const SizedBox(height: 8),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: ['Casual', 'Formal', 'Party'].map((o) {
                              final isSel = occasion == o;
                              return ChoiceChip(
                                label: Text(o.toUpperCase()),
                                selected: isSel,
                                selectedColor: AppTheme.primaryColor,
                                labelStyle: TextStyle(
                                  color: isSel ? Colors.white : AppTheme.textColorPrimary,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 10,
                                ),
                                onSelected: (selected) {
                                  if (selected) {
                                    setState(() {
                                      occasion = o;
                                    });
                                  }
                                },
                              );
                            }).toList(),
                          ),
                          const SizedBox(height: 16),

                          const Text('Styling & Outfit Notes', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                          const SizedBox(height: 8),
                          TextField(
                            controller: notesController,
                            maxLines: 3,
                            decoration: InputDecoration(
                              hintText: 'e.g. Looks great with dark denim jeans or white linen trousers...',
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                              contentPadding: const EdgeInsets.all(12),
                            ),
                          ),
                        ],
                      ),
                    ),

                    // STATS TAB
                    SingleChildScrollView(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Wardrobe Statistics', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                          const SizedBox(height: 12),
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: AppTheme.backgroundColor,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: AppTheme.borderColor),
                            ),
                            child: const Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text('Initial Wear Count', style: TextStyle(color: Colors.grey, fontSize: 12)),
                                Text('0 wears', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textColorPrimary)),
                              ],
                            ),
                          ),
                          const SizedBox(height: 16),

                          // COST-PER-WEAR CALCULATOR INPUT
                          const Text('Purchase Price', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                          const SizedBox(height: 6),
                          TextField(
                            controller: priceController,
                            keyboardType: const TextInputType.numberWithOptions(decimal: true),
                            onChanged: (_) => setState(() {}),
                            decoration: InputDecoration(
                              prefixText: '\$ ',
                              hintText: '0.00',
                              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                            ),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Cost-per-wear:', style: TextStyle(color: Colors.grey, fontSize: 12)),
                              Text(
                                purchasePrice > 0 ? '\$$purchasePrice / wear' : '\$0.00',
                                style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primaryColor),
                              ),
                            ],
                          )
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),

              // SAVE TO WARDROBE CTA BUTTON
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: nameController.text.trim().isEmpty
                      ? null
                      : () async {
                          final brandName = brandController.text.trim().isEmpty
                              ? 'Custom'
                              : brandController.text.trim();

                          final extraMetadata = {
                            'desc': notesController.text.trim().isEmpty
                                ? 'Custom user uploaded garment.'
                                : notesController.text.trim(),
                            'price': purchasePrice,
                            'stylingNotes': notesController.text.trim(),
                          };

                          await widget.provider.addCustomGarment(
                            name: nameController.text.trim(),
                            imagePath: _cutoutPath!,
                            category: category,
                            brand: brandName,
                            season: season,
                            occasion: occasion,
                            colors: _colors.isEmpty ? ['White'] : _colors,
                          );

                          widget.onSaved();
                        },
                  child: const Text('SAVE TO WARDROBE', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// TAB 2: EVENT PLANNER
class _EventPlannerTab extends StatefulWidget {
  const _EventPlannerTab();

  @override
  State<_EventPlannerTab> createState() => _EventPlannerTabState();
}

class _EventPlannerTabState extends State<_EventPlannerTab> {
  void _showCreatePlanDialog(TryOnProvider provider) {
    final nameController = TextEditingController();
    final List<String> selectedGarmentIds = [];

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
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(context).viewInsets.bottom + 30,
          ),
          child: StatefulBuilder(
            builder: (context, setModalState) {
              return Column(
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
                    'CREATE TRIP / EVENT PLAN',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1.5,
                    ),
                  ),
                  const SizedBox(height: 16),
                  
                  TextField(
                    controller: nameController,
                    decoration: InputDecoration(
                      labelText: 'Plan Name',
                      hintText: 'e.g. Paris Summer Vacation',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  const Text(
                    'Select Clothes for this Event',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                  ),
                  const SizedBox(height: 10),

                  if (provider.customGarments.isEmpty)
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 20),
                      child: Center(
                        child: Text(
                          'No clothes in your wardrobe yet.\nUpload garments first to plan events!',
                          style: TextStyle(color: Colors.grey, fontSize: 12),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    )
                  else
                    SizedBox(
                      height: 200,
                      child: ListView.builder(
                        itemCount: provider.customGarments.length,
                        itemBuilder: (context, idx) {
                          final item = provider.customGarments[idx];
                          final isChecked = selectedGarmentIds.contains(item.id);
                          return CheckboxListTile(
                            contentPadding: EdgeInsets.zero,
                            title: Text(item.name),
                            subtitle: Text('${item.brand} · ${item.category.toUpperCase()}'),
                            secondary: ClipRRect(
                              borderRadius: BorderRadius.circular(6),
                              child: Image.file(
                                File(item.imageUrl),
                                width: 40,
                                height: 40,
                                fit: BoxFit.cover,
                              ),
                            ),
                            value: isChecked,
                            activeColor: AppTheme.primaryColor,
                            onChanged: (val) {
                              setModalState(() {
                                if (val == true) {
                                  selectedGarmentIds.add(item.id);
                                } else {
                                  selectedGarmentIds.remove(item.id);
                                }
                              });
                            },
                          );
                        },
                      ),
                    ),
                  const SizedBox(height: 24),

                  SizedBox(
                    width: double.infinity,
                    height: 52,
                    child: ElevatedButton(
                      onPressed: (nameController.text.trim().isEmpty || selectedGarmentIds.isEmpty)
                          ? null
                          : () async {
                              await provider.addWardrobePlan(
                                nameController.text.trim(),
                                selectedGarmentIds,
                              );
                              if (context.mounted) {
                                Navigator.pop(context);
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Wardrobe Plan created!')),
                                );
                              }
                            },
                      child: const Text(
                        'CREATE PLAN',
                        style: TextStyle(fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
                ],
              );
            },
          ),
        );
      },
    );
  }

  void _showPlanDetailsDialog(BuildContext context, WardrobePlan plan, TryOnProvider provider) {
    final List<Product> planGarments = provider.customGarments
        .where((g) => plan.garmentIds.contains(g.id))
        .toList();

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
      builder: (context) {
        return Padding(
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
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Text(
                      plan.name.toUpperCase(),
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.0,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.delete_outline, color: Colors.redAccent),
                    onPressed: () async {
                      await provider.deleteWardrobePlan(plan.id);
                      if (context.mounted) {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Plan deleted.')),
                        );
                      }
                    },
                  )
                ],
              ),
              const Divider(),
              const SizedBox(height: 12),
              
              SizedBox(
                height: 120,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: planGarments.length,
                  itemBuilder: (context, idx) {
                    final item = planGarments[idx];
                    return Container(
                      margin: const EdgeInsets.only(right: 12),
                      width: 90,
                      decoration: BoxDecoration(
                        border: Border.all(color: AppTheme.borderColor),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Stack(
                          fit: StackFit.expand,
                          children: [
                            Image.file(File(item.imageUrl), fit: BoxFit.cover),
                            Container(
                              alignment: Alignment.bottomCenter,
                              padding: const EdgeInsets.all(4),
                              color: Colors.black45,
                              child: Text(
                                item.name,
                                style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            )
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 24),

              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.secondaryColor,
                    foregroundColor: AppTheme.primaryColor,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(26),
                    ),
                  ),
                  onPressed: () {
                    Navigator.pop(context);
                    if (planGarments.isNotEmpty) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => TryOnScreen(product: planGarments.first),
                        ),
                      );
                    }
                  },
                  icon: const Icon(Icons.face_retouching_natural, size: 20),
                  label: const Text(
                    'AI TRY-ON OUTFITS',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
              ),
              const SizedBox(height: 10),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<TryOnProvider>(context);
    final plans = provider.wardrobePlans;

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: GridView.builder(
        itemCount: plans.length + 1,
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 1,
          childAspectRatio: 2.1,
          mainAxisSpacing: 16,
        ),
        itemBuilder: (context, index) {
          if (index == 0) {
            return GestureDetector(
              onTap: () => _showCreatePlanDialog(provider),
              child: Container(
                decoration: BoxDecoration(
                  color: AppTheme.backgroundColor,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: AppTheme.borderColor,
                    style: BorderStyle.solid,
                    width: 1,
                  ),
                ),
                child: const Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.edit_calendar_outlined, size: 36, color: AppTheme.primaryColor),
                    SizedBox(height: 12),
                    Text(
                      'Create Vacation / Event Plan',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: AppTheme.primaryColor,
                        fontSize: 14,
                      ),
                    ),
                    SizedBox(height: 4),
                    Text(
                      'Plan outfits for your next trip',
                      style: TextStyle(color: Colors.grey, fontSize: 10),
                    ),
                  ],
                ),
              ),
            );
          }

          final plan = plans[index - 1];
          final List<Product> planGarments = provider.customGarments
              .where((g) => plan.garmentIds.contains(g.id))
              .toList();

          return GestureDetector(
            onTap: () => _showPlanDetailsDialog(context, plan, provider),
            child: Card(
              color: AppTheme.surfaceColor,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(color: AppTheme.borderColor),
              ),
              child: Padding(
                padding: const EdgeInsets.all(14.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          plan.name.toUpperCase(),
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                            color: AppTheme.textColorPrimary,
                            letterSpacing: 0.5,
                          ),
                        ),
                        Text(
                          plan.dateCreated,
                          style: const TextStyle(color: Colors.grey, fontSize: 11),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${planGarments.length} Items planned',
                      style: TextStyle(color: AppTheme.textColorSecondary, fontSize: 11),
                    ),
                    const Spacer(),
                    
                    if (planGarments.isNotEmpty)
                      SizedBox(
                        height: 48,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: planGarments.length,
                          itemBuilder: (context, idx) {
                            final garment = planGarments[idx];
                            return Padding(
                              padding: const EdgeInsets.only(right: 8.0),
                              child: ClipRRect(
                                  borderRadius: BorderRadius.circular(8),
                                  child: Image.file(
                                    File(garment.imageUrl),
                                    width: 48,
                                    height: 48,
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              );
                            },
                          ),
                        )
                      else
                        const Text('No items added to this plan yet.', style: TextStyle(color: Colors.grey, fontSize: 10)),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      );
    }
  }
  
  class EventPlannerScreen extends StatelessWidget {
    const EventPlannerScreen({super.key});
  
    @override
    Widget build(BuildContext context) {
      return Scaffold(
        backgroundColor: AppTheme.backgroundColor,
        appBar: AppBar(
          backgroundColor: AppTheme.backgroundColor,
          elevation: 0,
          centerTitle: true,
          title: const Text(
            'EVENT PLANNER',
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, letterSpacing: 1.5, color: AppTheme.textColorPrimary),
          ),
        ),
        body: const _EventPlannerTab(),
      );
    }
  }
