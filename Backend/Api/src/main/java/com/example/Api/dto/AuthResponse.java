
package com.example.Api.dto;

public class AuthResponse {

    private boolean success;
    private String message;
    private String token;
    private String tokenType;

    public AuthResponse() {
    }

    public AuthResponse(
            boolean success,
            String message,
            String token,
            String tokenType) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.tokenType = tokenType;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
}
