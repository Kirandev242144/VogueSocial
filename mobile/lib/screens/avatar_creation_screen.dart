import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../theme/app_theme.dart';
import '../providers/tryon_provider.dart';

class AvatarCreationScreen extends StatefulWidget {
  final TryOnProvider provider;

  const AvatarCreationScreen({super.key, required this.provider});

  @override
  State<AvatarCreationScreen> createState() => _AvatarCreationScreenState();
}

class _AvatarCreationScreenState extends State<AvatarCreationScreen> {
  bool _isFrontCamera = true;

  Future<void> _pickImage(ImageSource source) async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(
      source: source,
      maxWidth: 1024,
      maxHeight: 1024,
      imageQuality: 85,
    );

    if (pickedFile != null) {
      await widget.provider.setPersonImageSelfie(File(pickedFile.path));
      if (mounted) {
        Navigator.pop(context, true);
      }
    }
  }

  void _showGuideDialog() {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (ctx) => const AvatarGuideDialog(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16.0, top: 10, bottom: 10),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: Colors.black,
                elevation: 0,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                padding: const EdgeInsets.symmetric(horizontal: 16),
              ),
              onPressed: _showGuideDialog,
              child: const Text('Guide', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // Viewfinder Camera preview simulation
          Expanded(
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              decoration: BoxDecoration(
                color: Colors.grey[900],
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.white.withOpacity(0.15)),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(24),
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    // Mock Viewfinder silhouette / camera background guidance
                    Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.accessibility_new_outlined,
                            size: 180,
                            color: Colors.white.withOpacity(0.12),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'Align your body inside the frame',
                            style: TextStyle(color: Colors.white.withOpacity(0.4), fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                    
                    // Live camera guidelines overlay
                    Container(
                      decoration: BoxDecoration(
                        border: Border.all(
                          color: AppTheme.primaryColor.withOpacity(0.3),
                          width: 2,
                          style: BorderStyle.solid,
                        ),
                        borderRadius: BorderRadius.circular(24),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Control Bar
          Padding(
            padding: const EdgeInsets.only(bottom: 40.0, top: 20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                // Gallery trigger button
                IconButton(
                  iconSize: 28,
                  icon: const Icon(Icons.photo_library_outlined, color: Colors.white),
                  onPressed: () => _pickImage(ImageSource.gallery),
                ),
                
                // Shutter trigger button
                GestureDetector(
                  onTap: () => _pickImage(ImageSource.camera),
                  child: Container(
                    height: 76,
                    width: 76,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 4),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(4.0),
                      child: Container(
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                ),

                // Toggle camera rotation button
                IconButton(
                  iconSize: 28,
                  icon: const Icon(Icons.cached_outlined, color: Colors.white),
                  onPressed: () {
                    setState(() {
                      _isFrontCamera = !_isFrontCamera;
                    });
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Switched to ${_isFrontCamera ? "front" : "back"} camera view'),
                        duration: const Duration(seconds: 1),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// SLIDE WALKTHROUGH DIALOG FOR VTON PHOTO TIPS
class AvatarGuideDialog extends StatefulWidget {
  const AvatarGuideDialog({super.key});

  @override
  State<AvatarGuideDialog> createState() => _AvatarGuideDialogState();
}

class _AvatarGuideDialogState extends State<AvatarGuideDialog> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<Map<String, String>> _guideSlides = [
    {
      'title': 'Take the photo with only yourself in the frame',
      'dosUrl': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=300',
      'dontsUrl': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300',
    },
    {
      'title': 'Stand straight with your arms relaxed at your sides',
      'dosUrl': 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=300',
      'dontsUrl': 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=300',
    },
    {
      'title': 'Ensure good lighting with a clear contrast',
      'dosUrl': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300',
      'dontsUrl': 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=300',
    },
    {
      'title': 'Wear form-fitting clothes for a better try-on simulation',
      'dosUrl': 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=300',
      'dontsUrl': 'https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=300',
    },
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      insetPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Header with close button
          Padding(
            padding: const EdgeInsets.only(left: 8.0, top: 8.0),
            child: Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.close, color: Colors.black87),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
          ),

          // Main title
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 24.0),
            child: Text(
              'Photo tips for the best avatar',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 20,
                color: Colors.black,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          const SizedBox(height: 20),

          // Slide views content
          Flexible(
            child: SizedBox(
              height: 280,
              child: PageView.builder(
                controller: _pageController,
                itemCount: _guideSlides.length,
                onPageChanged: (idx) {
                  setState(() {
                    _currentPage = idx;
                  });
                },
                itemBuilder: (context, idx) {
                  final slide = _guideSlides[idx];
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24.0),
                    child: Column(
                      children: [
                        Text(
                          slide['title']!,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: Colors.grey,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 20),
                        
                        // Illustration side-by-side (Dos vs Donts)
                        Expanded(
                          child: Row(
                            children: [
                              // Dos block
                              Expanded(
                                child: Column(
                                  children: [
                                    const Icon(Icons.check, color: Colors.blue, size: 16),
                                    const SizedBox(height: 4),
                                    Expanded(
                                      child: ClipRRect(
                                        borderRadius: BorderRadius.circular(12),
                                        child: Image.network(
                                          slide['dosUrl']!,
                                          fit: BoxFit.cover,
                                          width: double.infinity,
                                          errorBuilder: (_, __, ___) => Container(
                                            color: Colors.grey[200],
                                            child: const Icon(Icons.image_outlined, color: Colors.grey),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 16),
                              // Donts block
                              Expanded(
                                child: Column(
                                  children: [
                                    const Icon(Icons.close, color: Colors.red, size: 16),
                                    const SizedBox(height: 4),
                                    Expanded(
                                      child: ClipRRect(
                                        borderRadius: BorderRadius.circular(12),
                                        child: Image.network(
                                          slide['dontsUrl']!,
                                          fit: BoxFit.cover,
                                          width: double.infinity,
                                          errorBuilder: (_, __, ___) => Container(
                                            color: Colors.grey[200],
                                            child: const Icon(Icons.image_outlined, color: Colors.grey),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Slide indicator dots
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(_guideSlides.length, (index) {
              final active = _currentPage == index;
              return Container(
                margin: const EdgeInsets.symmetric(horizontal: 4),
                height: 6,
                width: 6,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: active ? Colors.black87 : Colors.grey[300],
                ),
              );
            }),
          ),
          const SizedBox(height: 24),

          // Got it button
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
            child: SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF1A1A1A),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                onPressed: () {
                  if (_currentPage < _guideSlides.length - 1) {
                    _pageController.nextPage(
                      duration: const Duration(milliseconds: 300),
                      curve: Curves.easeOut,
                    );
                  } else {
                    Navigator.pop(context);
                  }
                },
                child: Text(
                  _currentPage == _guideSlides.length - 1 ? 'Got it' : 'Next',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
