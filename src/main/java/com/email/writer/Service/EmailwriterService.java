package com.email.writer.Service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.email.writer.Controller.EmailRequest;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;


@Service
public class EmailwriterService {

    private final WebClient webClient;

    public EmailwriterService(WebClient.Builder wBuilder) {
        this.webClient = wBuilder.build();
    }

    @Value("${gemini.api.url}")
    private String geminiApiUrl;
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public String Emailgenerator (EmailRequest emailRequest) {
        String prompt = BuildPrompt(emailRequest);
        
        Map<String,Object> requestBody = Map.of(
            "contents", new Object[] {
                Map.of("parts", new Object[] { 
                    Map.of("text", prompt)
                })
            }
        );

        String response = webClient.post()
        .uri(geminiApiUrl +"?key="+ geminiApiKey)
        .header("Content-Type", "application/json")
        .bodyValue(requestBody)
        .retrieve()
        .bodyToMono(String.class)
        .block();

        return ExtractResponse(response);
    }

    private String ExtractResponse(String response) {
        try {
        ObjectMapper mapper=new ObjectMapper();
        JsonNode rootNode=mapper.readTree(response);
        return rootNode.path("candidates")
                        .get(0)
                        .path("content")
                        .path("parts")
                        .get(0)
                        .get("text")
                        .asText();
        }
        catch(Exception e) {
            return "Error getting Response"+e.getMessage();
        }
    }

    private String BuildPrompt(EmailRequest emailRequest) {
        StringBuilder sb=new StringBuilder();

        sb.append("Generate a professional reply for the following email content . And please don't generate a subject line ");
        if(emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            sb.append("Use ").append(emailRequest.getTone()).append("tone.");
        }
        sb.append("\n Original Email: \n").append(emailRequest.getEmailcontent());
        return sb.toString();
    }

}
