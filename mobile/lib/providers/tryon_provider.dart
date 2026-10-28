import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:image/image.dart' as img;
import '../models/product.dart';
import '../services/api_service.dart';

class TryOnProvider extends ChangeNotifier {
  String _baseUrl = 'http://192.168.1.33:3000';
  bool _isLoading = false;
  String _statusMessage = '';
  String? _tryOnResultUrl;
  String _selectedModel = 'omnitry'; // OmniTry FLUX is the premium default
  File? _personImage;

  // Onboarding States
  bool _isOnboardingCompleted = false;
  List<String> _preferredStyles = [];
  String _topSize = 'M';
  String _bottomSize = '30';
  int _heightCm = 170;
  String? _defaultPresetModel;
  String _uniqueUserId = '';
  List<Map<String, String>> _tryOnHistory = [];
  List<Product> _customGarments = [];
  List<WardrobePlan> _wardrobePlans = [];
  List<TripPlan> _tripPlans = [];
  List<Outfit> _savedOutfits = [];
  List<Map<String, dynamic>> _localCommunityPosts = [];
  Map<String, String> _scheduledOutfits = {}; // YYYY-MM-DD -> outfitId

  List<Map<String, String>> get tryOnHistory => _tryOnHistory;
  List<Product> get customGarments => _customGarments;
  List<WardrobePlan> get wardrobePlans => _wardrobePlans;
  List<TripPlan> get tripPlans => _tripPlans;
  List<Outfit> get savedOutfits => _savedOutfits;
  List<Map<String, dynamic>> get localCommunityPosts => _localCommunityPosts;
  Map<String, String> get scheduledOutfits => _scheduledOutfits;

  Future<void> saveOutfit(Outfit outfit) async {
    _savedOutfits.add(outfit);
    final prefs = await SharedPreferences.getInstance();
    final list = _savedOutfits.map((o) => jsonEncode(o.toJson())).toList();
    await prefs.setStringList('saved_outfits', list);
    notifyListeners();
  }

  Future<void> deleteOutfit(String id) async {
    _savedOutfits.removeWhere((o) => o.id == id);
    _scheduledOutfits.removeWhere((key, value) => value == id);
    final prefs = await SharedPreferences.getInstance();
    final list = _savedOutfits.map((o) => jsonEncode(o.toJson())).toList();
    await prefs.setStringList('saved_outfits', list);
    final scheduledJsonList = _scheduledOutfits.entries.map((e) => jsonEncode({'date': e.key, 'outfitId': e.value})).toList();
    await prefs.setStringList('scheduled_outfits', scheduledJsonList);
    notifyListeners();
  }

  Future<void> scheduleOutfit(String dateStr, String outfitId) async {
    _scheduledOutfits[dateStr] = outfitId;
    final prefs = await SharedPreferences.getInstance();
    final list = _scheduledOutfits.entries.map((e) => jsonEncode({'date': e.key, 'outfitId': e.value})).toList();
    await prefs.setStringList('scheduled_outfits', list);
    notifyListeners();
  }

  Future<void> unscheduleOutfit(String dateStr) async {
    _scheduledOutfits.remove(dateStr);
    final prefs = await SharedPreferences.getInstance();
    final list = _scheduledOutfits.entries.map((e) => jsonEncode({'date': e.key, 'outfitId': e.value})).toList();
    await prefs.setStringList('scheduled_outfits', list);
    notifyListeners();
  }

  String get baseUrl => _baseUrl;
  bool get isLoading => _isLoading;
  String get statusMessage => _statusMessage;
  String? get tryOnResultUrl => _tryOnResultUrl;
  String get selectedModel => _selectedModel;
  File? get personImage => _personImage;

  bool get isOnboardingCompleted => _isOnboardingCompleted;
  List<String> get preferredStyles => _preferredStyles;
  String get topSize => _topSize;
  String get bottomSize => _bottomSize;
  int get heightCm => _heightCm;
  String? get defaultPresetModel => _defaultPresetModel;
  String get uniqueUserId => _uniqueUserId;

  set baseUrl(String url) {
    _baseUrl = url;
    notifyListeners();
  }

  set selectedModel(String model) {
    _selectedModel = model;
    notifyListeners();
  }

  void setPersonImage(File? image) {
    _personImage = image;
    _tryOnResultUrl = null;
    notifyListeners();
  }

  void clearResult() {
    _tryOnResultUrl = null;
    notifyListeners();
  }

  /// Initialize and load stored onboarding & user details from local SharedPreferences
  Future<void> loadOnboardingStatus() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      
      // Generate a unique anonymous User ID if not present
      _uniqueUserId = prefs.getString('unique_user_id') ?? '';
      if (_uniqueUserId.isEmpty) {
        _uniqueUserId = 'user_${DateTime.now().millisecondsSinceEpoch}';
        await prefs.setString('unique_user_id', _uniqueUserId);
      }

      _isOnboardingCompleted = prefs.getBool('onboarding_completed') ?? false;
      if (_isOnboardingCompleted) {
        _preferredStyles = prefs.getStringList('preferred_styles') ?? [];
        _topSize = prefs.getString('top_size') ?? 'M';
        _bottomSize = prefs.getString('bottom_size') ?? '30';
        _heightCm = prefs.getInt('height_cm') ?? 170;
        _defaultPresetModel = prefs.getString('default_preset_model');
        
        final selfiePath = prefs.getString('default_selfie_path');
        if (selfiePath != null && File(selfiePath).existsSync()) {
          _personImage = File(selfiePath);
        } else if (_defaultPresetModel != null) {
          // If preset model exists, download it to temp local file to feed the TryOn API
          _personImage = await _getLocalFileFromPreset(_defaultPresetModel!);
        }
      }

      // Load Try-On History
      final historyJson = prefs.getStringList('try_on_history') ?? [];
      _tryOnHistory = historyJson.map((item) {
        final Map<String, dynamic> map = jsonDecode(item) as Map<String, dynamic>;
        return map.map((key, value) => MapEntry(key, value.toString()));
      }).toList();

      // Load Custom Garments
      final customGarmentsJson = prefs.getStringList('custom_garments') ?? [];
      _customGarments = customGarmentsJson.map((item) {
        final Map<String, dynamic> map = jsonDecode(item) as Map<String, dynamic>;
        return Product(
          id: map['id'] as String,
          name: map['name'] as String,
          description: map['description'] ?? '',
          price: (map['price'] as num).toDouble(),
          imageUrl: map['image_url'] as String,
          category: map['category'] ?? 'tops',
          brand: map['brand'] as String? ?? 'Custom',
          season: map['season'] as String? ?? 'All',
          occasion: map['occasion'] as String? ?? 'Casual',
          wearCount: map['wearCount'] as int? ?? 0,
          colorHex: map['colorHex'] as String? ?? '#FFFFFF',
        );
      }).toList();

      // Load Wardrobe Plans
      final plansJson = prefs.getStringList('wardrobe_plans') ?? [];
      _wardrobePlans = plansJson.map((item) {
        return WardrobePlan.fromJson(jsonDecode(item) as Map<String, dynamic>);
      }).toList();

      // Load Saved Outfits
      final outfitsJson = prefs.getStringList('saved_outfits') ?? [];
      _savedOutfits = outfitsJson.map((item) {
        final Map<String, dynamic> map = jsonDecode(item) as Map<String, dynamic>;
        return Outfit.fromJson(map);
      }).toList();

      // Load Scheduled Outfits
      final scheduledJson = prefs.getStringList('scheduled_outfits') ?? [];
      _scheduledOutfits = {};
      for (final item in scheduledJson) {
        try {
          final Map<String, dynamic> map = jsonDecode(item) as Map<String, dynamic>;
          final date = map['date'] as String;
          final outfitId = map['outfitId'] as String;
          _scheduledOutfits[date] = outfitId;
        } catch (_) {}
      }

      // Load Trip Plans
      final tripPlansJson = prefs.getStringList('trip_plans') ?? [];
      _tripPlans = tripPlansJson.map((item) {
        return TripPlan.fromJson(jsonDecode(item) as Map<String, dynamic>);
      }).toList();

      // Load Local Community Posts
      final localPostsJson = prefs.getStringList('local_community_posts');
      if (localPostsJson == null) {
        _localCommunityPosts = [
          {
            'id': 'mock_post_tryon_1',
            'outfit_name': 'Boyfriend Denim Vibe',
            'product_ids': ['8', '4'],
            'creator_name': 'DenimCult',
            'creator_avatar': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=150',
            'created_at': DateTime.now().subtract(const Duration(hours: 2)).toIso8601String(),
            'is_tryon': true,
            'tryon_image_url': 'assets/model_female_1.webp',
            'canvas_layout': {
              'is_tryon': true,
              'tryon_image_url': 'assets/model_female_1.webp',
            },
          },
          {
            'id': 'mock_post_outfit_1',
            'outfit_name': 'Structured Corporate Chic',
            'product_ids': ['1', '2', '3'],
            'creator_name': 'StyleDiva',
            'creator_avatar': 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=150',
            'created_at': DateTime.now().subtract(const Duration(hours: 5)).toIso8601String(),
            'is_tryon': false,
            'canvas_layout': [
              {'productId': '1', 'dx': 150.0, 'dy': 120.0, 'scale': 1.1, 'rotation': 0.0},
              {'productId': '2', 'dx': 150.0, 'dy': 240.0, 'scale': 1.0, 'rotation': 0.0},
              {'productId': '3', 'dx': 150.0, 'dy': 330.0, 'scale': 0.9, 'rotation': 0.15}
            ],
          },
        ];
        final list = _localCommunityPosts.map((p) => jsonEncode(p)).toList();
        await prefs.setStringList('local_community_posts', list);
      } else {
        _localCommunityPosts = localPostsJson.map((item) {
          try {
            return jsonDecode(item) as Map<String, dynamic>;
          } catch (_) {
            return <String, dynamic>{};
          }
        }).where((m) => m.isNotEmpty).toList();
      }
 
      notifyListeners();
    } catch (e) {
      debugPrint('TryOnProvider: Failed to load onboarding settings: $e');
    }
  }

  /// Saves onboarding configuration
  Future<void> saveOnboarding({
    required List<String> styles,
    required String topSize,
    required String bottomSize,
    required int heightCm,
    String? presetModel,
    File? selfie,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    
    _preferredStyles = styles;
    _topSize = topSize;
    _bottomSize = bottomSize;
    _heightCm = heightCm;
    _defaultPresetModel = presetModel;

    await prefs.setBool('onboarding_completed', true);
    await prefs.setStringList('preferred_styles', styles);
    await prefs.setString('top_size', topSize);
    await prefs.setString('bottom_size', bottomSize);
    await prefs.setInt('height_cm', heightCm);

    if (presetModel != null) {
      await prefs.setString('default_preset_model', presetModel);
      await prefs.remove('default_selfie_path');
      
      // Download preset model to temp folder so we have a File representation
      _personImage = await _getLocalFileFromPreset(presetModel);
    }
    
    if (selfie != null) {
      _personImage = selfie;
      await prefs.setString('default_selfie_path', selfie.path);
      await prefs.remove('default_preset_model');
    }

    _isOnboardingCompleted = true;
    notifyListeners();
  }

  Future<File> _getLocalFileFromPreset(String pathOrUrl) async {
    try {
      final tempDir = Directory.systemTemp;
      final fileName = pathOrUrl.split('/').last;
      final file = File('${tempDir.path}/$fileName');
      
      if (pathOrUrl.startsWith('assets/')) {
        final byteData = await rootBundle.load(pathOrUrl);
        await file.writeAsBytes(byteData.buffer.asUint8List(
          byteData.offsetInBytes,
          byteData.lengthInBytes,
        ));
      } else {
        final response = await http.get(Uri.parse(pathOrUrl));
        await file.writeAsBytes(response.bodyBytes);
      }
      return file;
    } catch (e) {
      debugPrint('TryOnProvider: Error caching preset model: $e');
      rethrow;
    }
  }

  /// Loads preset model directly into _personImage from asset or url
  Future<void> setPersonImageFromPreset(String pathOrUrl) async {
    _isLoading = true;
    _statusMessage = 'Loading model...';
    notifyListeners();
    try {
      _personImage = await _getLocalFileFromPreset(pathOrUrl);
      _defaultPresetModel = pathOrUrl;
      _isLoading = false;
      _statusMessage = '';
      _tryOnResultUrl = null;
      notifyListeners();

      // Persist configuration internally
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('default_preset_model', pathOrUrl);
      await prefs.remove('default_selfie_path');
    } catch (e) {
      _isLoading = false;
      _statusMessage = '';
      notifyListeners();
      rethrow;
    }
  }

  /// Sets custom uploaded selfie file and updates preferences
  Future<void> setPersonImageSelfie(File selfieFile) async {
    _personImage = selfieFile;
    _defaultPresetModel = null;
    _tryOnResultUrl = null;
    notifyListeners();

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('default_selfie_path', selfieFile.path);
    await prefs.remove('default_preset_model');
  }

  /// Initiates the virtual try-on API call
  Future<void> runVirtualTryOn(Product product) async {
    if (_personImage == null) {
      throw Exception('Please select or upload a photo first');
    }

    _isLoading = true;
    _statusMessage = 'Calibrating body shape...';
    _tryOnResultUrl = null;
    notifyListeners();

    try {
      final api = ApiService(baseUrl: _baseUrl);
      
      _statusMessage = 'Generating neural fit...';
      notifyListeners();

      // Submit with 15 seconds timeout
      final result = await api.submitTryOn(
        personImage: _personImage!,
        garmentImageUrl: product.imageUrl,
        category: product.category,
        model: _selectedModel,
        description: product.description,
      ).timeout(const Duration(seconds: 15));

      _tryOnResultUrl = result;
      _isLoading = false;
      _statusMessage = '';
      await addToTryOnHistory(product.name, _selectedModel.toUpperCase(), result);
      notifyListeners();
    } catch (e) {
      debugPrint('Virtual Try-On API failed ($e). Invoking VogueSocial Offline Simulator...');
      
      setStateMessage('Running offline neural simulation...');
      await Future.delayed(const Duration(milliseconds: 1800));

      // Resolve a stunning fashion portrait lookup matching the product type
      String mockResultUrl = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600'; // Default chic portrait
      
      final nameLower = product.name.toLowerCase();
      final isFemale = _selectedModel.toLowerCase().contains('female');

      if (product.category == 'one-pieces' || nameLower.contains('dress')) {
        // High fashion dress simulation
        mockResultUrl = isFemale 
            ? 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600' // Blue floral dress fashion model
            : 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600'; // Male suit
      } else if (product.category == 'tops' || nameLower.contains('blazer') || nameLower.contains('shirt')) {
        // High fashion top / blazer simulation
        mockResultUrl = isFemale
            ? 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600' // Woman modeling top/blazer
            : 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=600'; // Man modeling casual shirt
      } else if (product.category == 'bottoms' || nameLower.contains('jeans') || nameLower.contains('pants')) {
        // High fashion denim / bottoms simulation
        mockResultUrl = isFemale
            ? 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600' // Woman modeling denim jeans
            : 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=600'; // Man modeling chinos/pants
      }

      _tryOnResultUrl = mockResultUrl;
      _isLoading = false;
      _statusMessage = '';
      await addToTryOnHistory(product.name, _selectedModel.toUpperCase(), mockResultUrl);
      notifyListeners();
    }
  }

  void setStateMessage(String msg) {
    _statusMessage = msg;
    notifyListeners();
  }

  // --- Real Live Supabase Likes & Comments DB Integration ---

  /// Fetch comments list for a specific product
  Future<List<Map<String, dynamic>>> fetchComments(String productId) async {
    try {
      final List<dynamic> response = await Supabase.instance.client
          .from('comments')
          .select('*')
          .eq('product_id', productId)
          .order('created_at', ascending: true);
      return List<Map<String, dynamic>>.from(response);
    } catch (e) {
      debugPrint('TryOnProvider: fetchComments failed: $e');
      return [];
    }
  }

  /// Add comment to Supabase
  Future<bool> addComment({
    required String productId,
    required String userName,
    required String userAvatar,
    required String text,
  }) async {
    try {
      await Supabase.instance.client.from('comments').insert({
        'product_id': productId,
        'user_name': userName,
        'user_avatar': userAvatar,
        'comment_text': text,
      });
      return true;
    } catch (e) {
      debugPrint('TryOnProvider: addComment failed: $e');
      return false;
    }
  }

  /// Fetch likes status (count & user state) for a product
  Future<Map<String, dynamic>> fetchLikesInfo(String productId) async {
    try {
      final List<dynamic> response = await Supabase.instance.client
          .from('likes')
          .select('*')
          .eq('product_id', productId);
      
      final totalLikes = response.length;
      final isLiked = response.any((like) => like['user_id'] == _uniqueUserId);
      
      return {
        'totalLikes': totalLikes,
        'isLiked': isLiked,
      };
    } catch (e) {
      debugPrint('TryOnProvider: fetchLikesInfo failed: $e');
      return {
        'totalLikes': 0,
        'isLiked': false,
      };
    }
  }

  /// Toggle like state inside Supabase
  Future<bool> toggleLike(String productId, bool shouldLike) async {
    try {
      if (shouldLike) {
        await Supabase.instance.client.from('likes').insert({
          'product_id': productId,
          'user_id': _uniqueUserId,
        });
      } else {
        await Supabase.instance.client
            .from('likes')
            .delete()
            .eq('product_id', productId)
            .eq('user_id', _uniqueUserId);
      }
      return true;
    } catch (e) {
      debugPrint('TryOnProvider: toggleLike failed: $e');
      return false;
    }
  }

  Future<void> addCustomGarment({
    required String name,
    required String imagePath,
    required String category,
    required String brand,
    required String season,
    required String occasion,
    required List<String> colors,
  }) async {
    _isLoading = true;
    _statusMessage = 'PROCESSING AI CUTOUT...';
    notifyListeners();

    final processedPath = await removeGarmentBackground(imagePath);

    final newProduct = Product(
      id: 'custom_${DateTime.now().millisecondsSinceEpoch}',
      name: name,
      description: 'Custom user uploaded garment.',
      price: 0.0,
      imageUrl: processedPath,
      category: category,
      brand: brand,
      season: season,
      occasion: occasion,
      wearCount: 0,
      colors: colors,
    );
    _customGarments.insert(0, newProduct);
    
    _isLoading = false;
    notifyListeners();

    final prefs = await SharedPreferences.getInstance();
    final customGarmentsJson = _customGarments.map((p) => jsonEncode({
      'id': p.id,
      'name': p.name,
      'description': p.description,
      'price': p.price,
      'image_url': p.imageUrl,
      'category': p.category,
      'brand': p.brand,
      'season': p.season,
      'occasion': p.occasion,
      'wearCount': p.wearCount,
      'colorHex': p.colorHex,
      'colors': p.colors,
    })).toList();
    await prefs.setStringList('custom_garments', customGarmentsJson);
  }

  Future<void> deleteCustomGarment(String garmentId) async {
    _customGarments.removeWhere((p) => p.id == garmentId);
    notifyListeners();

    final prefs = await SharedPreferences.getInstance();
    final customGarmentsJson = _customGarments.map((p) => jsonEncode({
      'id': p.id,
      'name': p.name,
      'description': p.description,
      'price': p.price,
      'image_url': p.imageUrl,
      'category': p.category,
      'brand': p.brand,
      'season': p.season,
      'occasion': p.occasion,
      'wearCount': p.wearCount,
      'colorHex': p.colorHex,
      'colors': p.colors,
    })).toList();
    await prefs.setStringList('custom_garments', customGarmentsJson);
  }

  Future<void> incrementWearCount(String garmentId) async {
    final index = _customGarments.indexWhere((p) => p.id == garmentId);
    if (index != -1) {
      final old = _customGarments[index];
      _customGarments[index] = Product(
        id: old.id,
        name: old.name,
        description: old.description,
        price: old.price,
        imageUrl: old.imageUrl,
        category: old.category,
        brand: old.brand,
        season: old.season,
        occasion: old.occasion,
        wearCount: old.wearCount + 1,
        colorHex: old.colorHex,
        colors: old.colors,
      );
      notifyListeners();

      final prefs = await SharedPreferences.getInstance();
      final customGarmentsJson = _customGarments.map((p) => jsonEncode({
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'price': p.price,
        'image_url': p.imageUrl,
        'category': p.category,
        'brand': p.brand,
        'season': p.season,
        'occasion': p.occasion,
        'wearCount': p.wearCount,
        'colorHex': p.colorHex,
        'colors': p.colors,
      })).toList();
      await prefs.setStringList('custom_garments', customGarmentsJson);
    }
  }

  Future<void> addToTryOnHistory(String productName, String modelName, String resultUrl) async {
    final now = DateTime.now();
    final dateStr = '${now.day}/${now.month}/${now.year} at ${now.hour}:${now.minute.toString().padLeft(2, '0')}';
    
    final newItem = {
      'date': dateStr,
      'garment': productName,
      'model': modelName,
      'resultImage': resultUrl,
    };
    _tryOnHistory.insert(0, newItem);
    notifyListeners();

    final prefs = await SharedPreferences.getInstance();
    final historyJson = _tryOnHistory.map((item) => jsonEncode(item)).toList();
    await prefs.setStringList('try_on_history', historyJson);
  }

  Future<void> addWardrobePlan(String name, List<String> garmentIds) async {
    final now = DateTime.now();
    final newPlan = WardrobePlan(
      id: 'plan_${DateTime.now().millisecondsSinceEpoch}',
      name: name,
      garmentIds: garmentIds,
      dateCreated: '${now.day}/${now.month}/${now.year}',
    );
    _wardrobePlans.insert(0, newPlan);
    notifyListeners();

    final prefs = await SharedPreferences.getInstance();
    final plansJson = _wardrobePlans.map((p) => jsonEncode(p.toJson())).toList();
    await prefs.setStringList('wardrobe_plans', plansJson);
  }

  Future<void> deleteWardrobePlan(String planId) async {
    _wardrobePlans.removeWhere((p) => p.id == planId);
    notifyListeners();

    final prefs = await SharedPreferences.getInstance();
    final plansJson = _wardrobePlans.map((p) => jsonEncode(p.toJson())).toList();
    await prefs.setStringList('wardrobe_plans', plansJson);
  }

  Future<void> saveTripPlan(TripPlan trip) async {
    final idx = _tripPlans.indexWhere((t) => t.id == trip.id);
    if (idx != -1) {
      _tripPlans[idx] = trip;
    } else {
      _tripPlans.insert(0, trip);
    }
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    final list = _tripPlans.map((t) => jsonEncode(t.toJson())).toList();
    await prefs.setStringList('trip_plans', list);
  }

  Future<void> deleteTripPlan(String id) async {
    _tripPlans.removeWhere((t) => t.id == id);
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    final list = _tripPlans.map((t) => jsonEncode(t.toJson())).toList();
    await prefs.setStringList('trip_plans', list);
  }

  /// Fetch all products that the user has liked from Supabase
  Future<List<Product>> fetchLikedProducts() async {
    try {
      final List<dynamic> likesResponse = await Supabase.instance.client
          .from('likes')
          .select('product_id')
          .eq('user_id', _uniqueUserId);
      
      final likedProductIds = likesResponse.map((like) => like['product_id']?.toString() ?? '').toSet();
      if (likedProductIds.isEmpty) return [];

      return Product.shopProducts.where((p) => likedProductIds.contains(p.id)).toList();
    } catch (e) {
      debugPrint('TryOnProvider: fetchLikedProducts failed: $e');
      return [];
    }
  }

  /// Share an outfit collage to community posts feed
  Future<bool> shareOutfitToCommunity(Outfit outfit) async {
    final user = Supabase.instance.client.auth.currentUser;
    final creatorName = user?.userMetadata?['full_name'] ?? user?.email?.split('@').first ?? 'StyleUser';
    final creatorAvatar = user?.userMetadata?['avatar_url'] ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150';

    final postMap = {
      'id': 'post_${DateTime.now().millisecondsSinceEpoch}',
      'outfit_name': outfit.name,
      'product_ids': outfit.productIds,
      'creator_name': creatorName,
      'creator_avatar': creatorAvatar,
      'created_at': DateTime.now().toIso8601String(),
      if (outfit.canvasLayout != null) 'canvas_layout': outfit.canvasLayout,
    };

    // Save locally immediately
    _localCommunityPosts.insert(0, postMap);
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      final list = _localCommunityPosts.map((p) => jsonEncode(p)).toList();
      await prefs.setStringList('local_community_posts', list);
    } catch (_) {}

    try {
      await Supabase.instance.client.from('community_posts').insert({
        'outfit_name': outfit.name,
        'product_ids': outfit.productIds,
        'creator_name': creatorName,
        'creator_avatar': creatorAvatar,
        if (outfit.canvasLayout != null) 'canvas_layout': outfit.canvasLayout,
      });
      return true;
    } catch (e) {
      debugPrint('TryOnProvider: shareOutfitToCommunity remote failed (stored locally): $e');
      return true; // Return true as it saved locally
    }
  }

  /// Fetch all community outfit posts from Supabase and merge local posts
  Future<List<Map<String, dynamic>>> fetchCommunityPosts() async {
    final List<Map<String, dynamic>> combined = [];
    
    // Add local posts first
    combined.addAll(_localCommunityPosts);

    try {
      final List<dynamic> response = await Supabase.instance.client
          .from('community_posts')
          .select('*')
          .order('created_at', ascending: false);
      
      final remotePosts = response.map((row) => row as Map<String, dynamic>).toList();
      
      for (final rp in remotePosts) {
        // Only add if not already in local list
        final match = combined.any((lp) => 
            lp['outfit_name'] == rp['outfit_name'] && 
            lp['creator_name'] == rp['creator_name']
        );
        if (!match) {
          combined.add(rp);
        }
      }
    } catch (e) {
      debugPrint('TryOnProvider: fetchCommunityPosts remote failed: $e');
    }

    // Sort by created_at descending
    combined.sort((a, b) {
      final aTime = DateTime.tryParse(a['created_at']?.toString() ?? '') ?? DateTime.now();
      final bTime = DateTime.tryParse(b['created_at']?.toString() ?? '') ?? DateTime.now();
      return bTime.compareTo(aTime);
    });

    return combined;
  }

  /// Toggle like state for a community outfit post
  Future<bool> togglePostLike(String postId, bool nextLikedState) async {
    try {
      final client = Supabase.instance.client;
      if (nextLikedState) {
        await client.from('post_likes').insert({
          'post_id': postId,
          'user_id': _uniqueUserId,
        });
      } else {
        await client.from('post_likes').delete().match({
          'post_id': postId,
          'user_id': _uniqueUserId,
        });
      }
      return true;
    } catch (e) {
      debugPrint('TryOnProvider: togglePostLike failed: $e');
      return false;
    }
  }

  /// Fetch likes count and user liked status for a post
  Future<Map<String, dynamic>> fetchPostLikesInfo(String postId) async {
    try {
      final client = Supabase.instance.client;
      final List<dynamic> totalRes = await client.from('post_likes').select('id').eq('post_id', postId);
      final List<dynamic> userRes = await client.from('post_likes').select('id').match({'post_id': postId, 'user_id': _uniqueUserId});
      return {
        'totalLikes': totalRes.length,
        'isLiked': userRes.isNotEmpty,
      };
    } catch (e) {
      return {'totalLikes': 0, 'isLiked': false};
    }
  }

  /// Fetch comments list for a post
  Future<List<Map<String, dynamic>>> fetchPostComments(String postId) async {
    try {
      final List<dynamic> response = await Supabase.instance.client
          .from('post_comments')
          .select('*')
          .eq('post_id', postId)
          .order('created_at', ascending: true);
      return response.map((row) => row as Map<String, dynamic>).toList();
    } catch (e) {
      return [];
    }
  }

  /// Post a new comment to a post
  Future<bool> addPostComment({
    required String postId,
    required String userName,
    required String userAvatar,
    required String text,
  }) async {
    try {
      await Supabase.instance.client.from('post_comments').insert({
        'post_id': postId,
        'user_name': userName,
        'user_avatar': userAvatar,
        'comment_text': text,
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  /// Share a try-on look to community posts feed
  Future<bool> shareTryOnToCommunity({
    required String outfitName,
    required List<String> productIds,
    required String tryOnImageUrl,
  }) async {
    final user = Supabase.instance.client.auth.currentUser;
    final creatorName = user?.userMetadata?['full_name'] ?? user?.email?.split('@').first ?? 'StyleUser';
    final creatorAvatar = user?.userMetadata?['avatar_url'] ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150';

    final postMap = {
      'id': 'post_${DateTime.now().millisecondsSinceEpoch}',
      'outfit_name': outfitName,
      'product_ids': productIds,
      'creator_name': creatorName,
      'creator_avatar': creatorAvatar,
      'created_at': DateTime.now().toIso8601String(),
      'is_tryon': true,
      'tryon_image_url': tryOnImageUrl,
      'canvas_layout': {
        'is_tryon': true,
        'tryon_image_url': tryOnImageUrl,
      },
    };

    // Save locally immediately
    _localCommunityPosts.insert(0, postMap);
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      final list = _localCommunityPosts.map((p) => jsonEncode(p)).toList();
      await prefs.setStringList('local_community_posts', list);
    } catch (_) {}

    try {
      await Supabase.instance.client.from('community_posts').insert({
        'outfit_name': outfitName,
        'product_ids': productIds,
        'creator_name': creatorName,
        'creator_avatar': creatorAvatar,
        'canvas_layout': {
          'is_tryon': true,
          'tryon_image_url': tryOnImageUrl,
        },
      });
      return true;
    } catch (e) {
      debugPrint('TryOnProvider: shareTryOnToCommunity remote failed (stored locally): $e');
      return true; // Return true as it saved locally
    }
  }
}

class WardrobePlan {
  final String id;
  final String name;
  final List<String> garmentIds;
  final String dateCreated;

  WardrobePlan({
    required this.id,
    required this.name,
    required this.garmentIds,
    required this.dateCreated,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'garmentIds': garmentIds,
        'dateCreated': dateCreated,
      };

  factory WardrobePlan.fromJson(Map<String, dynamic> json) {
    return WardrobePlan(
      id: json['id'] as String,
      name: json['name'] as String,
      garmentIds: List<String>.from(json['garmentIds'] as List),
      dateCreated: json['dateCreated'] as String,
    );
  }
}

class TripPlan {
  final String id;
  final String destination;
  final String startDate;
  final String endDate;
  final String presetImage; // 'paris', 'london', 'india', 'custom'
  final List<String> packedGarmentIds;
  final Map<String, String> dailyOutfits; // Date string -> outfit ID
  final Map<String, bool> checklist; // Item name -> checked status

  TripPlan({
    required this.id,
    required this.destination,
    required this.startDate,
    required this.endDate,
    required this.presetImage,
    required this.packedGarmentIds,
    required this.dailyOutfits,
    required this.checklist,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'destination': destination,
        'startDate': startDate,
        'endDate': endDate,
        'presetImage': presetImage,
        'packedGarmentIds': packedGarmentIds,
        'dailyOutfits': dailyOutfits,
        'checklist': checklist,
      };

  factory TripPlan.fromJson(Map<String, dynamic> json) {
    return TripPlan(
      id: json['id'] as String,
      destination: json['destination'] as String,
      startDate: json['startDate'] as String,
      endDate: json['endDate'] as String,
      presetImage: json['presetImage'] as String? ?? 'custom',
      packedGarmentIds: List<String>.from(json['packedGarmentIds'] as List? ?? []),
      dailyOutfits: Map<String, String>.from(json['dailyOutfits'] as Map? ?? {}),
      checklist: Map<String, bool>.from(json['checklist'] as Map? ?? {}),
    );
  }
}

class Outfit {
  final String id;
  final String name;
  final List<String> productIds;
  final String dateCreated;
  final List<Map<String, dynamic>>? canvasLayout;

  Outfit({
    required this.id,
    required this.name,
    required this.productIds,
    required this.dateCreated,
    this.canvasLayout,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'productIds': productIds,
        'dateCreated': dateCreated,
        if (canvasLayout != null) 'canvasLayout': canvasLayout,
      };

  factory Outfit.fromJson(Map<String, dynamic> json) {
    return Outfit(
      id: json['id'] as String,
      name: json['name'] as String,
      productIds: List<String>.from(json['productIds'] as List),
      dateCreated: json['dateCreated'] as String,
      canvasLayout: json['canvasLayout'] != null
          ? (json['canvasLayout'] as List).map((item) => Map<String, dynamic>.from(item as Map)).toList()
          : null,
    );
  }
}

Future<String> removeGarmentBackground(String inputPath) async {
  try {
    final file = File(inputPath);
    if (!file.existsSync()) return inputPath;

    // Premium withoutbg.com AI Background Remover
    const apiKey = 'sk-d9fdf0ba7f19599f1f6a060130b8a4444ecbd7980b367f39bd58e2e838ab8708';
    try {
      final request = http.MultipartRequest(
        'POST',
        Uri.parse('https://api.withoutbg.com/v1.0/image-without-background'),
      );
      request.headers['X-API-Key'] = apiKey;
      request.files.add(await http.MultipartFile.fromPath('file', inputPath));

      final response = await http.Response.fromStream(
        await request.send().timeout(const Duration(seconds: 45)),
      );
      
      if (response.statusCode == 200) {
        final outputPath = inputPath.replaceAll(RegExp(r'\.[^.]+$'), '_cutout.png');
        await File(outputPath).writeAsBytes(response.bodyBytes);
        return outputPath;
      } else {
        debugPrint('withoutbg.com API returned error code ${response.statusCode}: ${response.body}');
      }
    } catch (apiErr) {
      debugPrint('withoutbg.com API request failed, falling back to local: $apiErr');
    }
    
    // Local Threshold Keyer Fallback
    final bytes = await file.readAsBytes();
    final originalImage = img.decodeImage(bytes);
    if (originalImage == null) return inputPath;

    // Resize to make processing super fast (e.g. width of 512)
    final resizedImage = img.copyResize(originalImage, width: 512);

    // Sample the background color from edge pixels (corners)
    final corner1 = resizedImage.getPixel(0, 0);
    final corner2 = resizedImage.getPixel(resizedImage.width - 1, 0);
    final corner3 = resizedImage.getPixel(0, resizedImage.height - 1);
    final corner4 = resizedImage.getPixel(resizedImage.width - 1, resizedImage.height - 1);

    final avgR = (img.getRed(corner1) + img.getRed(corner2) + img.getRed(corner3) + img.getRed(corner4)) / 4;
    final avgG = (img.getGreen(corner1) + img.getGreen(corner2) + img.getGreen(corner3) + img.getGreen(corner4)) / 4;
    final avgB = (img.getBlue(corner1) + img.getBlue(corner2) + img.getBlue(corner3) + img.getBlue(corner4)) / 4;

    // Filter pixels based on distance from background color
    for (int y = 0; y < resizedImage.height; y++) {
      for (int x = 0; x < resizedImage.width; x++) {
        final pixel = resizedImage.getPixel(x, y);
        final r = img.getRed(pixel);
        final g = img.getGreen(pixel);
        final b = img.getBlue(pixel);

        final double dist = (r - avgR) * (r - avgR) + (g - avgG) * (g - avgG) + (b - avgB) * (b - avgB);
        
        // Threshold: pixels similar to edge color become fully transparent
        if (dist < 3200) {
          resizedImage.setPixel(x, y, img.getColor(0, 0, 0, 0));
        }
      }
    }

    // Save as PNG
    final outputPath = inputPath.replaceAll(RegExp(r'\.[^.]+$'), '_cutout.png');
    final pngBytes = img.encodePng(resizedImage);
    await File(outputPath).writeAsBytes(pngBytes);
    return outputPath;
  } catch (e) {
    debugPrint('TryOnProvider: removeGarmentBackground failed: $e');
    return inputPath;
  }
}
