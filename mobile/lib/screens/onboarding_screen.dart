import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../providers/tryon_provider.dart';
import '../theme/app_theme.dart';
import 'main_screen.dart';
import 'avatar_creation_screen.dart'; // To show AvatarGuideDialog

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  // Model settings
  String? _selectedPresetModel;
  File? _selectedSelfie;

  // 4 high-quality model presets
  final List<Map<String, String>> _presets = [
    {
      'id': 'female_1',
      'gender': 'Female',
      'label': 'Aria (Chic Fit)',
      'url': 'assets/model_female_1.webp'
    },
    {
      'id': 'male_1',
      'gender': 'Male',
      'label': 'Marcus (Sleek Fit)',
      'url': 'assets/model_male_1.webp'
    },
    {
      'id': 'female_2',
      'gender': 'Female',
      'label': 'Chloe (Curvy Fit)',
      'url': 'assets/model_female_2.webp'
    },
    {
      'id': 'male_2',
      'gender': 'Male',
      'label': 'Leo (Relaxed Fit)',
      'url': 'assets/model_male_2.webp'
    },
  ];

  Future<void> _pickSelfie(ImageSource source) async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(
      source: source,
      maxWidth: 1024,
      maxHeight: 1024,
      imageQuality: 85,
    );

    if (pickedFile != null) {
      setState(() {
        _selectedSelfie = File(pickedFile.path);
        _selectedPresetModel = null;
      });
    }
  }

  void _showGuideDialog() {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (ctx) => const AvatarGuideDialog(),
    );
  }

  void _finishOnboarding() async {
    // Validate we have a base model
    if (_selectedSelfie == null && _selectedPresetModel == null) {
      // Default to first preset if none chosen
      _selectedPresetModel = _presets.first['url'];
    }

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => const Center(
        child: CircularProgressIndicator(color: AppTheme.primaryColor),
      ),
    );

    final provider = Provider.of<TryOnProvider>(context, listen: false);
    await provider.saveOnboarding(
      styles: [],
      topSize: 'M',
      bottomSize: '30',
      heightCm: 170,
      presetModel: _selectedPresetModel,
      selfie: _selectedSelfie,
    );

    if (mounted) {
      Navigator.pop(context); // Dismiss loading dialog
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (context) => const MainScreen()),
      );
    }
  }

  void _showImageSourceSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.surfaceColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
      ),
      builder: (context) {
        return SafeArea(
          child: Wrap(
            children: [
              ListTile(
                leading: const Icon(Icons.photo_library_outlined, color: AppTheme.textColorPrimary),
                title: const Text('Select from Gallery', style: TextStyle(color: AppTheme.textColorPrimary)),
                onTap: () {
                  Navigator.pop(context);
                  _pickSelfie(ImageSource.gallery);
                },
              ),
              ListTile(
                leading: const Icon(Icons.camera_alt_outlined, color: AppTheme.textColorPrimary),
                title: const Text('Capture with Camera', style: TextStyle(color: AppTheme.textColorPrimary)),
                onTap: () {
                  Navigator.pop(context);
                  _pickSelfie(ImageSource.camera);
                },
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      appBar: AppBar(
        backgroundColor: AppTheme.backgroundColor,
        elevation: 0,
        leading: const SizedBox.shrink(), // No back button on startup
        actions: [
          TextButton(
            onPressed: _finishOnboarding,
            child: const Text(
              'Skip',
              style: TextStyle(
                color: AppTheme.textColorSecondary,
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 10),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'CHOOSE YOUR AVATAR',
                    style: TextStyle(
                      color: AppTheme.textColorSecondary,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                      letterSpacing: 2,
                    ),
                  ),
                  GestureDetector(
                    onTap: _showGuideDialog,
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: const [
                        Icon(Icons.info_outline, color: AppTheme.textColorSecondary, size: 14),
                        SizedBox(width: 4),
                        Text(
                          'Photo Tips',
                          style: TextStyle(
                            color: AppTheme.textColorSecondary,
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              const Text(
                'Upload your selfie avatar for realistic AI Virtual Try-On',
                style: TextStyle(
                  color: AppTheme.textColorPrimary,
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  height: 1.3,
                ),
              ),
              const SizedBox(height: 24),

              // Camera Viewfinder / Selfie Upload Box
              GestureDetector(
                onTap: _showImageSourceSheet,
                child: Container(
                  height: 200,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: AppTheme.surfaceColor,
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(
                      color: _selectedSelfie != null ? AppTheme.primaryColor : AppTheme.borderColor,
                      width: 1.5,
                    ),
                  ),
                  child: _selectedSelfie != null
                      ? ClipRRect(
                          borderRadius: BorderRadius.circular(22),
                          child: Stack(
                            fit: StackFit.expand,
                            children: [
                              Image.file(_selectedSelfie!, fit: BoxFit.cover),
                              Container(
                                color: Colors.black38,
                              ),
                              const Center(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(Icons.check_circle, color: AppTheme.secondaryColor, size: 48),
                                    SizedBox(height: 8),
                                    Text(
                                      'Selfie Uploaded Successfully!',
                                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                                    ),
                                    SizedBox(height: 4),
                                    Text(
                                      'Tap to replace photo',
                                      style: TextStyle(color: Colors.white70, fontSize: 11),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        )
                      : Stack(
                          fit: StackFit.expand,
                          children: [
                            // Alignment guidance silhouette mockup in light style
                            Center(
                              child: Opacity(
                                opacity: 0.05,
                                child: Icon(
                                  Icons.accessibility_new_outlined,
                                  size: 140,
                                  color: AppTheme.primaryColor,
                                ),
                              ),
                            ),
                            Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(14),
                                    decoration: BoxDecoration(
                                      color: AppTheme.secondaryColor.withOpacity(0.4),
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Icon(
                                      Icons.add_a_photo_outlined,
                                      color: AppTheme.primaryColor,
                                      size: 28,
                                    ),
                                  ),
                                  const SizedBox(height: 12),
                                  const Text(
                                    'Upload Portrait Selfie',
                                    style: TextStyle(
                                      color: AppTheme.textColorPrimary,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 14,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  const Text(
                                    'Align your shoulders & face inside standard lighting',
                                    style: TextStyle(
                                      color: AppTheme.textColorSecondary,
                                      fontSize: 10.5,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                ),
              ),
              const SizedBox(height: 28),

              // OR Divider
              Row(
                children: [
                  Expanded(child: Divider(color: AppTheme.borderColor)),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    child: Text(
                      'OR USE A PRESET MODEL',
                      style: TextStyle(
                        color: AppTheme.textColorSecondary,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.0,
                      ),
                    ),
                  ),
                  Expanded(child: Divider(color: AppTheme.borderColor)),
                ],
              ),
              const SizedBox(height: 20),

              // Preset Avatars horizontal list
              SizedBox(
                height: 110,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: _presets.length,
                  itemBuilder: (context, index) {
                    final preset = _presets[index];
                    final isSelected = _selectedPresetModel == preset['url'];

                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          _selectedPresetModel = preset['url'];
                          _selectedSelfie = null;
                        });
                      },
                      child: Container(
                        width: 90,
                        margin: const EdgeInsets.only(right: 14, bottom: 4),
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(
                            color: isSelected ? AppTheme.primaryColor : AppTheme.borderColor,
                            width: isSelected ? 2.5 : 1,
                          ),
                        ),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(14),
                          child: Stack(
                            fit: StackFit.expand,
                            children: [
                              Image.asset(preset['url']!, fit: BoxFit.cover),
                              // Overlay label
                              Positioned(
                                bottom: 0,
                                left: 0,
                                right: 0,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 2),
                                  color: Colors.black.withOpacity(0.55),
                                  child: Text(
                                    preset['label']!,
                                    style: const TextStyle(color: Colors.white, fontSize: 8.5, fontWeight: FontWeight.bold),
                                    textAlign: TextAlign.center,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ),
                              if (isSelected)
                                Container(
                                  color: AppTheme.primaryColor.withOpacity(0.12),
                                  alignment: Alignment.center,
                                  child: const Icon(Icons.check_circle, color: AppTheme.secondaryColor, size: 24),
                                ),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
              
              const Spacer(),

              // Bottom primary CTA button
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.secondaryColor,
                    foregroundColor: AppTheme.primaryColor,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  onPressed: _finishOnboarding,
                  child: const Text(
                    'FINISH SETUP',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                      letterSpacing: 1.0,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
    );
  }
}
