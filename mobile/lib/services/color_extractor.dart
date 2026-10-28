import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image/image.dart' as img;

class ColorExtractor {
  static const Map<String, List<int>> _colorAnchors = {
    'White': [255, 255, 255],
    'Black': [30, 30, 30],
    'Grey': [128, 128, 128],
    'Blue': [33, 150, 243],
    'Navy': [13, 71, 161],
    'Red': [244, 67, 54],
    'Beige': [245, 245, 220],
    'Brown': [121, 85, 72],
    'Purple': [156, 39, 176],
    'Lavender': [225, 190, 231],
    'Pink': [233, 30, 99],
    'Green': [76, 175, 80],
    'Yellow': [255, 235, 59],
    'Orange': [255, 152, 0],
  };

  /// Extracts dominant color names from a cutout PNG image file
  static Future<List<String>> extractDominantColors(String imagePath) async {
    try {
      final file = File(imagePath);
      if (!file.existsSync()) return ['White'];

      final bytes = await file.readAsBytes();
      final image = img.decodeImage(bytes);
      if (image == null) return ['White'];

      // Keep track of color category counts
      final Map<String, int> counts = {};
      for (final key in _colorAnchors.keys) {
        counts[key] = 0;
      }

      int totalSampled = 0;

      // Sample pixels on a grid (step by 8 to make it fast)
      const step = 8;
      for (int y = 0; y < image.height; y += step) {
        for (int x = 0; x < image.width; x += step) {
          final pixel = image.getPixel(x, y);
          final a = img.getAlpha(pixel);
          
          // Only sample opaque (clothing) pixels
          if (a > 100) {
            final r = img.getRed(pixel);
            final g = img.getGreen(pixel);
            final b = img.getBlue(pixel);

            // Find closest color anchor
            String closestName = 'White';
            int minDistance = 99999999;

            _colorAnchors.forEach((name, rgb) {
              final int dist = (r - rgb[0]) * (r - rgb[0]) +
                                  (g - rgb[1]) * (g - rgb[1]) +
                                  (b - rgb[2]) * (b - rgb[2]);
              if (dist < minDistance) {
                minDistance = dist;
                closestName = name;
              }
            });

            counts[closestName] = counts[closestName]! + 1;
            totalSampled++;
          }
        }
      }

      if (totalSampled == 0) return ['White'];

      // Select colors that represent at least 12% of the garment area
      final List<String> dominantColors = [];
      counts.forEach((name, count) {
        final ratio = count / totalSampled;
        if (ratio >= 0.12) {
          dominantColors.add(name);
        }
      });

      // Fallback to top color if none met threshold
      if (dominantColors.isEmpty) {
        var topColor = 'White';
        var maxCount = 0;
        counts.forEach((name, count) {
          if (count > maxCount) {
            maxCount = count;
            topColor = name;
          }
        });
        dominantColors.add(topColor);
      }

      return dominantColors;
    } catch (e) {
      debugPrint('ColorExtractor: Failed to extract colors: $e');
      return ['White'];
    }
  }
}
