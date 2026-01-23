
import 'dart:io';
import 'package:google_generative_ai/google_generative_ai.dart';

class GeminiService {
  late final GenerativeModel _model;

  GeminiService() {
    // API key should be stored in environment variables or safe storage
    final apiKey = Platform.environment['API_KEY'] ?? '';
    _model = GenerativeModel(
      model: 'gemini-1.5-flash-latest',
      apiKey: apiKey,
      systemInstruction: Content.system(
        "You are a Senior Business Consultant for 7ton Express. Provide only 3 short, actionable insights. Recommend contacting KAM for details."
      ),
    );
  }

  Future<String> analyzeBusinessPerformance(String context) async {
    try {
      final prompt = "Analyze my performance stats: $context. Tip to grow?";
      final response = await _model.generateContent([Content.text(prompt)]);
      return response.text ?? "Insights unavailable.";
    } catch (e) {
      return "Unable to reach AI consultant. Please try again.";
    }
  }
}
