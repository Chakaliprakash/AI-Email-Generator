
package com.email.writer.Controller;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class EmailRequest {
    @JsonProperty("emailContent")
    private String emailcontent;
    private String tone;
}
