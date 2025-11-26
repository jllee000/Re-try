package com.retry.retrybackend.controller.gemini;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fasterxml.jackson.databind.ObjectMapper; // ✅ Jackson
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class GeminiController {

    @Value("${gemini.api-key}")
    private String apiKey;

    @PostMapping("/ask")
    public ResponseEntity<String> askGemini(@RequestBody Map<String, String> body) {
        String question = body.get("question");

        String apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

        try {
            // ✅ Jackson ObjectMapper 사용
            ObjectMapper mapper = new ObjectMapper();

            Map<String, Object> payload = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(Map.of("text", question)))
                    )
            );

            String jsonInput = mapper.writeValueAsString(payload);

            HttpURLConnection conn = (HttpURLConnection) new URL(apiUrl).openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            conn.setDoOutput(true);

            try (OutputStream os = conn.getOutputStream()) {
                os.write(jsonInput.getBytes(StandardCharsets.UTF_8));
            }

            int status = conn.getResponseCode();
            InputStream stream = (status >= 200 && status < 300)
                    ? conn.getInputStream()
                    : conn.getErrorStream();

            String response = new String(stream.readAllBytes(), StandardCharsets.UTF_8);
            System.out.println("🔍 Gemini 응답 코드: " + status);
            System.out.println("🔍 Gemini 응답 본문: " + response);

            return ResponseEntity.status(status).body(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Gemini API 요청 중 오류 발생: " + e.getMessage());
        }
    }
}
