package com.example.ERPBack.dto;

public class LoginResponse {
    private String userid;
    private String username;
    private String role;
    private String rank;

    public LoginResponse(String userid, String username, String role, String rank) {
        this.userid = userid;
        this.username = username;
        this.role = role;
        this.rank = rank;
    }

    public String getUserid() {
        return userid;
    }

    public String getUsername() {
        return username;
    }

    public String getRole() {
        return role;
    }

    public String getRank() {
        return rank;
    }
}
