package com.example.ERPBack.dto;

public class LoginRequest {
    private String userid;
    private String userpw;
    private String role;
    private String rank;

    public String getUserid() {return userid;}
    public void setUserid(String userid) {this.userid = userid;}
    public String getUserpw() {return userpw;}
    public void setUserpw(String userpw) {this.userpw = userpw;}
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getRank() { return rank; }
    public void setRank(String rank) { this.rank = rank; }
}
