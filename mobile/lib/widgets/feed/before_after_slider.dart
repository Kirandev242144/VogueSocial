import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

/// Interactive before/after split slider for UGC Try-On comparisons
class BeforeAfterSlider extends StatefulWidget {
  final String beforeImage;
  final String afterImage;

  const BeforeAfterSlider({
    super.key,
    required this.beforeImage,
    required this.afterImage,
  });

  @override
  State<BeforeAfterSlider> createState() => _BeforeAfterSliderState();
}

class _BeforeAfterSliderState extends State<BeforeAfterSlider> {
  double _clipPercent = 0.5; // Drag clip position (0.0 to 1.0)

  @override
  Widget build(BuildContext context) {
    return AspectRatio(
      aspectRatio: 1.4,
      child: LayoutBuilder(
        builder: (context, constraints) {
          final width = constraints.maxWidth;
          return GestureDetector(
            onHorizontalDragUpdate: (details) {
              setState(() {
                _clipPercent = (_clipPercent + (details.primaryDelta! / width)).clamp(0.0, 1.0);
              });
            },
            child: Stack(
              fit: StackFit.expand,
              children: [
                // Background: Original (Before)
                Image.network(widget.beforeImage, fit: BoxFit.cover),

                // Foreground: AI Try-On (After) - Clipped to the clipPercent
                ClipRect(
                  clipper: _SliderClipper(_clipPercent),
                  child: Image.network(widget.afterImage, fit: BoxFit.cover),
                ),

                // Divider Line
                Positioned(
                  left: _clipPercent * width - 1,
                  top: 0,
                  bottom: 0,
                  child: Container(
                    width: 2,
                    color: AppTheme.primaryColor,
                  ),
                ),

                // Drag Handle
                Positioned(
                  left: _clipPercent * width - 18,
                  top: (constraints.maxHeight / 2) - 18,
                  child: Container(
                    width: 36,
                    height: 36,
                    decoration: const BoxDecoration(
                      color: AppTheme.primaryColor,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(color: Colors.black38, blurRadius: 4, offset: Offset(0, 2)),
                      ],
                    ),
                    child: const Icon(Icons.unfold_more_double_outlined, color: Colors.black, size: 18),
                  ),
                ),

                // Badge overlays
                Positioned(
                  left: 12,
                  top: 12,
                  child: _badge('BEFORE'),
                ),
                Positioned(
                  right: 12,
                  top: 12,
                  child: _badge('AI TRY-ON', isPrimary: true),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _badge(String text, {bool isPrimary = false}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.black.withOpacity(0.55),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: isPrimary ? AppTheme.primaryColor : Colors.white24, width: 1),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: isPrimary ? AppTheme.primaryColor : Colors.white,
          fontSize: 9,
          fontWeight: FontWeight.bold,
          letterSpacing: 0.5,
        ),
      ),
    );
  }
}

class _SliderClipper extends CustomClipper<Rect> {
  final double clipPercent;
  _SliderClipper(this.clipPercent);

  @override
  Rect getClip(Size size) {
    return Rect.fromLTRB(clipPercent * size.width, 0.0, size.width, size.height);
  }

  @override
  bool shouldReclip(_SliderClipper oldClipper) => oldClipper.clipPercent != clipPercent;
}
