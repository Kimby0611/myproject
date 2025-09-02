package com.example.thescreen.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * React SPA를 위한 라우팅 컨트롤러 (최소 필수 설정만)
 */
@Controller
public class ReactController {

    @GetMapping(value = {
            "/",
            "/home",
            "/movies/**",
            "/theaters/**",
            "/reservation/**",
            "/mypage/**",
            "/admin/**",
            "/login/**",
            "/register/**",
            "/event/**",
            "/notice/**"
    })
    public String forwardToReact() {
        return "forward:/index.html";
    }

    @GetMapping(value = "/{path:[^\\.]*}")
    public String forwardOtherPaths() {
        return "forward:/index.html";
    }
}