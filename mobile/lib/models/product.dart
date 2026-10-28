import 'dart:convert';

class Product {
  final String id;
  final String name;
  final String shortName;
  final double price;
  final String priceDisplay;
  final String imageUrl;
  final String? secondaryImage;
  final String category; // 'tops', 'bottoms', 'outerwear', 'dresses', 'shoes'
  final String description;
  final List<String> extraImages;
  final String brand;
  final String season;
  final String occasion;
  final int wearCount;
  final String colorHex;
  final List<String> colors;
  final List<String> sizes;
  final double rating;
  final int reviewsCount;
  final bool isNew;
  final bool isTrending;
  final bool isSuggested;
  final String? matchReason;
  final String? videoUrl;

  Product({
    required this.id,
    required this.name,
    String? shortName,
    required this.price,
    String? priceDisplay,
    required this.imageUrl,
    this.secondaryImage,
    required this.category,
    required this.description,
    this.extraImages = const [],
    this.brand = 'VogueSocial',
    this.season = 'All',
    this.occasion = 'Casual',
    this.wearCount = 0,
    this.colorHex = '#FFFFFF',
    this.colors = const ['#000000'],
    this.sizes = const ['XS', 'S', 'M', 'L'],
    this.rating = 4.8,
    this.reviewsCount = 48,
    this.isNew = false,
    this.isTrending = true,
    this.isSuggested = true,
    this.matchReason,
    this.videoUrl,
  })  : shortName = shortName ?? name,
        priceDisplay = priceDisplay ?? '\$${price.toStringAsFixed(0)}';

  /// Returns all images for this product: main + extras
  List<String> get allImages {
    if (extraImages.isNotEmpty) return extraImages;
    return [imageUrl];
  }

  /// Normalizes an image path to a bundled Flutter asset path
  static String normalizeAssetPath(String path) {
    final clean = path.trim();
    if (clean.startsWith('assets/')) return clean;
    if (clean.startsWith('/Shop_images/')) return 'assets$clean';
    if (clean.startsWith('Shop_images/')) return 'assets/$clean';
    if (clean.startsWith('/')) return 'assets$clean';
    return 'assets/$clean';
  }

  /// Resolves image path (defaults to bundled asset path)
  String getFullImageUrl([String baseUrl = '']) {
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    return normalizeAssetPath(imageUrl);
  }

  factory Product.fromJson(Map<String, dynamic> json) {
    String desc = json['description'] as String? ?? '';
    List<String> extraImgs = [];

    if (desc.startsWith('{') && desc.endsWith('}')) {
      try {
        final Map<String, dynamic> parsed = jsonDecode(desc);
        desc = parsed['desc'] as String? ?? desc;
        if (parsed['extra_images'] != null) {
          extraImgs = List<String>.from(parsed['extra_images'] as List);
        }
      } catch (_) {}
    }

    List<String> cols = [];
    if (json['colors'] != null) {
      cols = List<String>.from(json['colors'] as List);
    } else {
      cols = [json['colorHex'] as String? ?? '#000000'];
    }

    List<String> szs = ['XS', 'S', 'M', 'L'];
    if (json['sizes'] != null) {
      szs = List<String>.from(json['sizes'] as List);
    }

    final priceVal = (json['price'] as num?)?.toDouble() ?? 0.0;

    return Product(
      id: json['id']?.toString() ?? '',
      name: json['name'] as String? ?? '',
      shortName: json['shortName'] as String?,
      price: priceVal,
      priceDisplay: json['priceDisplay'] as String? ?? '\$${priceVal.toStringAsFixed(0)}',
      imageUrl: (json['image_url'] ?? json['imageUrl'] ?? json['image']) as String? ?? '',
      secondaryImage: (json['secondaryImage'] ?? json['secondary_image']) as String?,
      category: json['category'] as String? ?? 'tops',
      description: desc,
      extraImages: extraImgs,
      brand: json['brand'] as String? ?? 'VogueSocial',
      season: json['season'] as String? ?? 'All',
      occasion: json['occasion'] as String? ?? 'Casual',
      wearCount: json['wearCount'] as int? ?? 0,
      colorHex: json['colorHex'] as String? ?? '#000000',
      colors: cols,
      sizes: szs,
      rating: (json['rating'] as num?)?.toDouble() ?? 4.8,
      reviewsCount: json['reviewsCount'] as int? ?? 48,
      isNew: json['isNew'] as bool? ?? false,
      isTrending: json['isTrending'] as bool? ?? true,
      isSuggested: json['isSuggested'] as bool? ?? true,
      matchReason: json['matchReason'] as String?,
      videoUrl: (json['video_url'] ?? json['videoUrl']) as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'shortName': shortName,
      'price': price,
      'priceDisplay': priceDisplay,
      'imageUrl': imageUrl,
      'secondaryImage': secondaryImage,
      'category': category,
      'description': description,
      'brand': brand,
      'season': season,
      'occasion': occasion,
      'wearCount': wearCount,
      'colorHex': colorHex,
      'colors': colors,
      'sizes': sizes,
      'rating': rating,
      'reviewsCount': reviewsCount,
      'isNew': isNew,
      'isTrending': isTrending,
      'isSuggested': isSuggested,
      'matchReason': matchReason,
      'videoUrl': videoUrl,
    };
  }

  /// Synchronized catalog products identical to the Web Frontend Shop dataset (19 garments)
  static final List<Product> shopProducts = [
    Product(
      id: 'post-1',
      name: 'Structured Wool Blazer',
      shortName: 'Structured Wool Blazer',
      price: 280.0,
      priceDisplay: '\$280.00',
      brand: 'Ankita Manot',
      rating: 4.8,
      reviewsCount: 128,
      category: 'outerwear',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['#E5E7EB', '#1E293B'],
      imageUrl: '/Shop_images/1/basic2-500x750.jpeg',
      secondaryImage: '/Shop_images/1/basic3-500x750.jpeg',
      extraImages: [
        '/Shop_images/1/basic2-500x750.jpeg',
        '/Shop_images/1/basic3-500x750.jpeg',
        '/Shop_images/1/basic4-500x750.jpeg',
      ],
      isNew: true,
      isTrending: true,
      isSuggested: true,
      description: 'Milanese avant-garde silhouette crafted from virgin wool with peaked lapels.',
      matchReason: 'Sharp structured shoulders define your posture and silhouette. Crafted from virgin wool.',
      videoUrl: 'assets/Woman_modeling_outfit_in_studio_202608030912.mp4',
    ),
    Product(
      id: 'post-2',
      name: 'Summer Breeze Set',
      shortName: 'Summer Breeze Set',
      price: 115.0,
      priceDisplay: '\$115.00',
      brand: 'Style Diva',
      rating: 4.5,
      reviewsCount: 95,
      category: 'tops',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['#FFFFFF', '#CBD5E1'],
      imageUrl: '/Shop_images/2/cup1-500x750.jpeg',
      secondaryImage: '/Shop_images/2/cup2-500x750.jpeg',
      extraImages: [
        '/Shop_images/2/cup1-500x750.jpeg',
        '/Shop_images/2/cup2-500x750.jpeg',
      ],
      isNew: false,
      isTrending: true,
      isSuggested: true,
      description: 'Lightweight breathable cotton long sleeve with signature coastal typographic prints.',
      matchReason: 'Lightweight breathable cotton long sleeve with signature coastal prints.',
    ),
    Product(
      id: 'post-3',
      name: 'Midnight Silk Evening Dress',
      shortName: 'Midnight Silk Dress',
      price: 320.0,
      priceDisplay: '\$320.00',
      brand: 'Urban Chic',
      rating: 4.9,
      reviewsCount: 210,
      category: 'dresses',
      sizes: ['XS', 'S', 'M'],
      colors: ['#000000', '#1E293B'],
      imageUrl: '/Shop_images/3/dressblack1-1-500x750.jpeg',
      secondaryImage: '/Shop_images/3/dressblack2-500x750.jpeg',
      extraImages: [
        '/Shop_images/3/dressblack1-1-500x750.jpeg',
        '/Shop_images/3/dressblack2-500x750.jpeg',
        '/Shop_images/3/dressblack3-500x750.jpeg',
      ],
      isNew: false,
      isTrending: true,
      isSuggested: true,
      description: 'Pure silk evening maxi featuring subtle side slit and lustrous midnight sheen.',
      matchReason: 'Sleek silk silhouette with side slit creates an elegant vertical line.',
    ),
    Product(
      id: 'post-4',
      name: 'Vintage Graphic Oversized Tee',
      shortName: 'Graphic Oversized Tee',
      price: 48.0,
      priceDisplay: '\$48.00',
      brand: 'Street Aura',
      rating: 4.6,
      reviewsCount: 52,
      category: 'tops',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['#0F172A', '#F8FAFC'],
      imageUrl: '/Shop_images/4/graphic1-500x750.jpg',
      secondaryImage: '/Shop_images/4/graphic2-500x750.jpg',
      extraImages: [
        '/Shop_images/4/graphic1-500x750.jpg',
        '/Shop_images/4/graphic2-500x750.jpg',
      ],
      isNew: true,
      isTrending: true,
      isSuggested: true,
      description: 'Vintage washed heavy cotton with retro artwork and dropped shoulder silhouette.',
      matchReason: 'Vintage washed heavy cotton with retro artwork and dropped shoulder silhouette.',
    ),
    Product(
      id: 'post-5',
      name: 'Knotted Casual Tee',
      shortName: 'Knotted Casual Tee',
      price: 55.0,
      priceDisplay: '\$55.00',
      brand: 'Trends Today',
      rating: 4.2,
      reviewsCount: 34,
      category: 'tops',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['#F8FAFC', '#FED7AA'],
      imageUrl: '/Shop_images/5/knotted1-500x750.jpeg',
      secondaryImage: '/Shop_images/5/knotted2-500x750.jpeg',
      extraImages: [
        '/Shop_images/5/knotted1-500x750.jpeg',
        '/Shop_images/5/knotted2-500x750.jpeg',
      ],
      isNew: false,
      isTrending: false,
      isSuggested: true,
      description: 'Casual fits for everyday comfort with cinched front tie.',
      matchReason: 'Casual fits for everyday comfort with cinched front tie.',
    ),
    Product(
      id: 'post-6',
      name: 'Sculpting Performance Leggings',
      shortName: 'Sculpting Leggings',
      price: 85.0,
      priceDisplay: '\$85.00',
      brand: 'Fashion Forward',
      rating: 4.7,
      reviewsCount: 45,
      category: 'bottoms',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['#1E293B', '#000000'],
      imageUrl: '/Shop_images/6/leggings1-500x750.jpeg',
      secondaryImage: '/Shop_images/6/leggings2-500x750.jpeg',
      extraImages: [
        '/Shop_images/6/leggings1-500x750.jpeg',
        '/Shop_images/6/leggings2-500x750.jpeg',
      ],
      isNew: false,
      isTrending: true,
      isSuggested: true,
      description: 'High-waisted compression contouring with premium active stretch.',
      matchReason: 'High-waisted compression contouring with premium active stretch.',
    ),
    Product(
      id: 'post-7',
      name: 'Tech Nylon Windbreaker Jacket',
      shortName: 'Nylon Windbreaker',
      price: 175.0,
      priceDisplay: '\$175.00',
      brand: 'Urban Chic',
      rating: 4.7,
      reviewsCount: 62,
      category: 'outerwear',
      sizes: ['S', 'M', 'L'],
      colors: ['#0F172A', '#334155'],
      imageUrl: '/Shop_images/7/nylon1-500x750.jpg',
      secondaryImage: '/Shop_images/7/nylon2-500x750.jpg',
      extraImages: [
        '/Shop_images/7/nylon1-500x750.jpg',
        '/Shop_images/7/nylon2-500x750.jpg',
      ],
      isNew: true,
      isTrending: true,
      isSuggested: true,
      description: 'Weatherproof ripstop technical shell with concealed zip pockets.',
      matchReason: 'Weatherproof ripstop technical shell with concealed zip pockets.',
    ),
    Product(
      id: 'post-8',
      name: 'Utility Corduroy Overshirt',
      shortName: 'Corduroy Overshirt',
      price: 130.0,
      priceDisplay: '\$130.00',
      brand: 'Mens Edit',
      rating: 4.8,
      reviewsCount: 78,
      category: 'outerwear',
      sizes: ['M', 'L', 'XL'],
      colors: ['#78350F', '#D97706'],
      imageUrl: '/Shop_images/8/overshirt1-500x750.jpg',
      secondaryImage: '/Shop_images/8/overshirt2-500x750.jpg',
      extraImages: [
        '/Shop_images/8/overshirt1-500x750.jpg',
        '/Shop_images/8/overshirt2-500x750.jpg',
      ],
      isNew: false,
      isTrending: true,
      isSuggested: true,
      description: 'Thick wale corduroy tailored with chest flap pockets for relaxed layering.',
      matchReason: 'Thick wale corduroy tailored with chest flap pockets for relaxed layering.',
    ),
    Product(
      id: 'post-9',
      name: 'Cargo Pocket Trousers',
      shortName: 'Cargo Pocket Trousers',
      price: 110.0,
      priceDisplay: '\$110.00',
      brand: 'Mens Edit',
      rating: 4.6,
      reviewsCount: 67,
      category: 'bottoms',
      sizes: ['M', 'L', 'XL'],
      colors: ['#D97706', '#475569'],
      imageUrl: '/Shop_images/9/pocketmen1-500x750.jpeg',
      secondaryImage: '/Shop_images/9/pocketmen3-500x750.jpeg',
      extraImages: [
        '/Shop_images/9/pocketmen1-500x750.jpeg',
        '/Shop_images/9/pocketmen3-500x750.jpeg',
      ],
      isNew: false,
      isTrending: false,
      isSuggested: true,
      description: 'Functional cargo pockets with utilitarian relaxed taper.',
      matchReason: 'Functional cargo pockets with utilitarian relaxed taper.',
    ),
    Product(
      id: 'post-10',
      name: 'Distressed Boyfriend Jeans',
      shortName: 'Distressed Jeans',
      price: 160.0,
      priceDisplay: '\$160.00',
      brand: 'Denim Cult',
      rating: 4.8,
      reviewsCount: 89,
      category: 'bottoms',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['#93C5FD', '#3B82F6'],
      imageUrl: '/Shop_images/10/ripped1-500x750.jpeg',
      secondaryImage: '/Shop_images/10/ripped2-500x750.jpeg',
      extraImages: [
        '/Shop_images/10/ripped1-500x750.jpeg',
        '/Shop_images/10/ripped2-500x750.jpeg',
      ],
      isNew: false,
      isTrending: true,
      isSuggested: true,
      description: 'Authentic 90s vintage wash with subtle knee distressing.',
      matchReason: 'Authentic 90s vintage wash with subtle knee distressing.',
    ),
    Product(
      id: 'post-11',
      name: 'Bell Sleeve Blouse',
      shortName: 'Bell Sleeve Blouse',
      price: 145.0,
      priceDisplay: '\$145.00',
      brand: 'Sleeve Story',
      rating: 4.8,
      reviewsCount: 134,
      category: 'tops',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['#FFFFFF', '#FCE7F3'],
      imageUrl: '/Shop_images/11/sleev1-500x750.jpeg',
      secondaryImage: '/Shop_images/11/sleev2-500x750.jpeg',
      extraImages: [
        '/Shop_images/11/sleev1-500x750.jpeg',
        '/Shop_images/11/sleev2-500x750.jpeg',
      ],
      isNew: true,
      isTrending: false,
      isSuggested: true,
      description: 'Dramatic flare bell sleeves with delicate gathers and pearl buttons.',
      matchReason: 'Dramatic flare bell sleeves with delicate gathers and pearl buttons.',
    ),
    Product(
      id: 'post-12',
      name: 'Embroidered Slogan Sweatshirt',
      shortName: 'Slogan Sweatshirt',
      price: 68.0,
      priceDisplay: '\$68.00',
      brand: 'Street Culture',
      rating: 4.5,
      reviewsCount: 41,
      category: 'tops',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['#1E293B', '#CBD5E1'],
      imageUrl: '/Shop_images/12/slogan1-500x750.jpg',
      secondaryImage: '/Shop_images/12/slogan2-500x750.jpg',
      extraImages: [
        '/Shop_images/12/slogan1-500x750.jpg',
        '/Shop_images/12/slogan2-500x750.jpg',
      ],
      isNew: true,
      isTrending: true,
      isSuggested: true,
      description: 'Cozy French terry sweatshirt with precision tonal slogan embroidery.',
      matchReason: 'Cozy French terry sweatshirt with precision tonal slogan embroidery.',
    ),
    Product(
      id: 'post-13',
      name: 'Pleated Wide-Leg Trousers',
      shortName: 'Pleated Trousers',
      price: 195.0,
      priceDisplay: '\$195.00',
      brand: 'Ankita Manot',
      rating: 4.8,
      reviewsCount: 57,
      category: 'bottoms',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['#F5F5F4', '#E7E5E4'],
      imageUrl: '/Shop_images/13/wideleg1-500x750.jpg',
      secondaryImage: '/Shop_images/13/wideleg2-500x750.jpg',
      extraImages: [
        '/Shop_images/13/wideleg1-500x750.jpg',
        '/Shop_images/13/wideleg2-500x750.jpg',
      ],
      isNew: true,
      isTrending: true,
      isSuggested: true,
      description: 'High-waisted pleated wide trousers tailored in Italian wool-silk blend.',
      matchReason: 'High-waisted pleated wide trousers tailored in Italian wool-silk blend.',
    ),
    Product(
      id: 'post-14',
      name: 'Women Halter Neck Printed Jumpsuit',
      shortName: 'Printed Halter Jumpsuit',
      price: 65.0,
      priceDisplay: '\$65.00',
      brand: 'SummerVibes',
      rating: 4.6,
      reviewsCount: 56,
      category: 'dresses',
      sizes: ['S', 'M', 'L'],
      colors: ['#F59E0B', '#10B981'],
      imageUrl: '/Shop_images/14/bTgDVAex_00915cef3b634c61a7a77980d8384727.jpg',
      secondaryImage: '/Shop_images/14/u97PsqkV_1c92d329f65c42d4a0590ecd2690b550.jpg',
      extraImages: [
        '/Shop_images/14/bTgDVAex_00915cef3b634c61a7a77980d8384727.jpg',
        '/Shop_images/14/u97PsqkV_1c92d329f65c42d4a0590ecd2690b550.jpg',
      ],
      isNew: false,
      isTrending: true,
      isSuggested: true,
      description: 'Vibrant summer print with halter neck and flowy silhouette.',
      matchReason: 'Vibrant summer print with halter neck and flowy silhouette.',
    ),
    Product(
      id: 'post-15',
      name: 'Women Solid Shirt Dress with Belt',
      shortName: 'Solid Shirt Dress',
      price: 78.0,
      priceDisplay: '\$78.00',
      brand: 'ChicEssentials',
      rating: 4.7,
      reviewsCount: 42,
      category: 'dresses',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['#DC2626', '#B91C1C'],
      imageUrl: '/Shop_images/15/1000016314131-Red-RED-1000016314131_01-2100.jpg',
      secondaryImage: '/Shop_images/15/1000016314131-Red-RED-1000016314131_02-2100.jpg',
      extraImages: [
        '/Shop_images/15/1000016314131-Red-RED-1000016314131_01-2100.jpg',
        '/Shop_images/15/1000016314131-Red-RED-1000016314131_02-2100.jpg',
      ],
      isNew: true,
      isTrending: false,
      isSuggested: true,
      description: 'Versatile belted shirt dress in crimson red for office to evening.',
      matchReason: 'Versatile belted shirt dress in crimson red for office to evening.',
    ),
    Product(
      id: 'post-16',
      name: 'Chemistry Floral Print Midi Dress',
      shortName: 'Chemistry Midi Dress',
      price: 89.0,
      priceDisplay: '\$89.00',
      brand: 'Chemistry',
      rating: 4.8,
      reviewsCount: 64,
      category: 'dresses',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['#1E40AF', '#EC4899'],
      imageUrl: '/Shop_images/16/2062af47-4098-4cc2-9e3f-f36ebca76b881725273460897-Chemistry-Women-Dresses-9631725273460568-5.jpg',
      secondaryImage: '/Shop_images/16/9fe85a3b-34fb-4fc6-96f5-16fb2e2fcc501725273460948-Chemistry-Women-Dresses-9631725273460568-1.jpg',
      extraImages: [
        '/Shop_images/16/2062af47-4098-4cc2-9e3f-f36ebca76b881725273460897-Chemistry-Women-Dresses-9631725273460568-5.jpg',
        '/Shop_images/16/9fe85a3b-34fb-4fc6-96f5-16fb2e2fcc501725273460948-Chemistry-Women-Dresses-9631725273460568-1.jpg',
      ],
      isNew: true,
      isTrending: true,
      isSuggested: true,
      description: 'Chic floral midi dress designed for effortless comfort and fluid drape.',
      matchReason: 'Chic floral midi dress designed for effortless comfort and fluid drape.',
    ),
    Product(
      id: 'post-17',
      name: 'No Human Is Illegal Barbed Wire T-Shirt',
      shortName: 'No Human Is Illegal Tee',
      price: 35.0,
      priceDisplay: '\$35.00',
      brand: 'Vogue Social Impact',
      rating: 5.0,
      reviewsCount: 48,
      category: 'tops',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['#000000'],
      imageUrl: '/Shop_images/nohuman.png',
      secondaryImage: '/Shop_images/nohuman.png',
      extraImages: [
        '/Shop_images/nohuman.png',
        '/Shop_images/4/graphic1-500x750.jpg',
      ],
      isNew: false,
      isTrending: true,
      isSuggested: true,
      description: '100% cotton charity t-shirt with signature barbed wire rainbow heart.',
      matchReason: '100% cotton charity t-shirt with signature barbed wire rainbow heart.',
    ),
    Product(
      id: 'post-18',
      name: 'Vibrant Summer Floral Dress',
      shortName: 'Vibrant Summer Dress',
      price: 120.0,
      priceDisplay: '\$120.00',
      brand: 'Summer Floral Co',
      rating: 4.9,
      reviewsCount: 89,
      category: 'dresses',
      sizes: ['S', 'M', 'L'],
      colors: ['#15803D', '#86EFAC'],
      imageUrl: '/Shop_images/greendress.jpg',
      secondaryImage: '/Shop_images/greendress.jpg',
      extraImages: [
        '/Shop_images/greendress.jpg',
        '/Shop_images/3/dressblack1-1-500x750.jpeg',
      ],
      isNew: true,
      isTrending: true,
      isSuggested: true,
      description: 'Green floral slip dress with delicate spaghetti straps and tiered ruffles.',
      matchReason: 'Green floral slip dress with delicate spaghetti straps and tiered ruffles.',
    ),
    Product(
      id: 'prod-boots',
      name: 'Pointed Toe Leather Ankle Boots',
      shortName: 'Pointed Toe Ankle Boots',
      price: 450.0,
      priceDisplay: '\$450.00',
      brand: 'Ankita Manot',
      rating: 4.9,
      reviewsCount: 38,
      category: 'shoes',
      sizes: ['S', 'M', 'L'],
      colors: ['#000000'],
      imageUrl: '/Shop_images/1/basic4-500x750.jpeg',
      secondaryImage: '/Shop_images/1/basic2-500x750.jpeg',
      extraImages: [
        '/Shop_images/1/basic4-500x750.jpeg',
        '/Shop_images/1/basic2-500x750.jpeg',
        '/Shop_images/1/basic3-500x750.jpeg',
      ],
      isNew: false,
      isTrending: false,
      isSuggested: true,
      description: 'Pointed toe sculpted leather ankle boots in smooth calfskin.',
      matchReason: 'Pointed toe sculpted leather ankle boots in smooth calfskin.',
    ),
    Product(
      id: 'post-boyfriend-jeans',
      name: 'Boyfriend Mid Rise Cropped Turn Up Jeans',
      shortName: 'Boyfriend Turn Up Jeans',
      price: 145.0,
      priceDisplay: '\$145.00',
      brand: 'VogueSocial',
      rating: 4.9,
      reviewsCount: 112,
      category: 'bottoms',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['#3B82F6', '#1E293B'],
      imageUrl: 'assets/Boyfriend-Mid-Rise-Cropped-Turn-Up-Jeans.avif',
      secondaryImage: 'assets/Boyfriend-Mid-Rise-Cropped-Turn-Up-Jeans.avif',
      extraImages: [
        'assets/Boyfriend-Mid-Rise-Cropped-Turn-Up-Jeans.avif',
      ],
      videoUrl: 'assets/Woman_modeling_outfit_in_studio_202608030912.mp4',
      isNew: true,
      isTrending: true,
      isSuggested: true,
      description: 'Relaxed boyfriend mid-rise cropped jeans featuring vintage washed indigo denim and signature turn-up cuffs.',
      matchReason: 'Vintage washed indigo denim with relaxed street taper and signature turn-up cuffs.',
    ),
  ];

  /// Backward-compatible alias for existing callers
  static List<Product> get dummyProducts => shopProducts;
}
