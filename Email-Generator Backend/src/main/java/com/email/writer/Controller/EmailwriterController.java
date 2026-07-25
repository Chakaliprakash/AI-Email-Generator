package com.email.writer.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.email.writer.Service.EmailwriterService;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/api/email")
@CrossOrigin(origins = "*")
public class EmailwriterController {

    private final EmailwriterService service;

    @PostMapping("/generate")
    public ResponseEntity<String> genarateEmail(@RequestBody EmailRequest emailrequest ) {
        String response = service.Emailgenerator(emailrequest);
        return ResponseEntity.ok(response);
    }



}
