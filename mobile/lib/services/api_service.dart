import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;

class ApiService {
  // 10.0.2.2 is the special Android loopback address mapping to localhost of the developer host machine
  final String baseUrl;

  ApiService({this.baseUrl = 'http://192.168.1.33:3000'});

  /// Submits a virtual try-on request.
  /// If the server returns a jobId, it begins polling until completion.
  Future<String> submitTryOn({
    required File personImage,
    required String garmentImageUrl,
    required String category,
    required String model,
    required String description,
  }) async {
    final uri = Uri.parse('$baseUrl/api/try-on');
    final request = http.MultipartRequest('POST', uri);

    // 1. Attach the local person photo
    final personFile = await http.MultipartFile.fromPath(
      'person_image',
      personImage.path,
    );
    request.files.add(personFile);

    // 2. Fetch the remote garment image and attach it as a file
    try {
      final garmentResponse = await http.get(Uri.parse(garmentImageUrl));
      if (garmentResponse.statusCode == 200) {
        final garmentFile = http.MultipartFile.fromBytes(
          'garment_image',
          garmentResponse.bodyBytes,
          filename: 'garment.png',
        );
        request.files.add(garmentFile);
      } else {
        throw Exception('Failed to fetch garment image: HTTP ${garmentResponse.statusCode}');
      }
    } catch (e) {
      throw Exception('Could not retrieve product image from URL: $e');
    }

    // 3. Attach category, model selection, and description metadata
    request.fields['category'] = category;
    request.fields['model'] = model;
    request.fields['garment_description'] = description;

    // 4. Send request
    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode != 200) {
      final errorMsg = _tryExtractError(response.body);
      throw Exception(errorMsg);
    }

    final data = jsonDecode(response.body);

    // 5. Handle response branches (direct image vs. async Job ID)
    if (data['image'] != null) {
      return data['image'] as String;
    } else if (data['jobId'] != null) {
      final String jobId = data['jobId'] as String;
      return await _pollJobStatus(jobId);
    } else {
      throw Exception('Malformed API response: no image or jobId returned');
    }
  }

  /// Polls the Next.js status endpoint until job is COMPLETED or FAILED
  Future<String> _pollJobStatus(String jobId) async {
    final statusUri = Uri.parse('$baseUrl/api/try-on/status?jobId=$jobId');
    final pollInterval = Duration(seconds: 3);
    final maxPollAttempts = 40;
    int attempts = 0;

    while (attempts < maxPollAttempts) {
      attempts++;
      await Future.delayed(pollInterval);

      final response = await http.get(statusUri);
      if (response.statusCode != 200) {
        throw Exception('Failed to poll job status: HTTP ${response.statusCode}');
      }

      final data = jsonDecode(response.body);
      final String status = data['status'] as String? ?? 'FAILED';

      if (status == 'COMPLETED') {
        final output = data['output'];
        if (output is String) {
          return output;
        } else if (output is List && output.isNotEmpty) {
          return output[0] as String;
        } else if (output is Map && output['image'] != null) {
          return output['image'] as String;
        } else {
          throw Exception('Job completed but returned no output image link');
        }
      } else if (status == 'FAILED' || status == 'CANCELLED') {
        throw Exception(data['error'] as String? ?? 'Generation job failed');
      }
    }

    throw Exception('Try-On generation timed out. Please try again.');
  }

  String _tryExtractError(String body) {
    try {
      final data = jsonDecode(body);
      return data['error'] as String? ?? 'Server Error';
    } catch (_) {
      return 'Unexpected Server Error';
    }
  }
}
